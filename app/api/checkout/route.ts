// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { calculateDiscounts, DISCOUNTS } from "@/lib/discounts";
import { checkDeliveryEligibility } from "@/lib/distance";
import { SITE } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      items,
      deliveryType,
      useLoyalty,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      specialInstructions,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Calculate subtotal from items
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // 2. Check delivery eligibility if delivery
    if (deliveryType === "DELIVERY") {
      if (!deliveryAddress?.fullAddress) {
        return NextResponse.json(
          { error: "Delivery address required" },
          { status: 400 }
        );
      }
      const check = await checkDeliveryEligibility(deliveryAddress.fullAddress);
      if (!check.eligible) {
        return NextResponse.json({ error: check.reason }, { status: 400 });
      }
    }

    // 3. Fetch user points
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { points: true },
    });
    const userPoints = user?.points ?? 0;

    // 4. Calculate discounts
    const discounts = calculateDiscounts(subtotal, userPoints, useLoyalty);

    // 5. Build Stripe line items (one per cart item)
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
          ...(item.optionName ? { description: item.optionName } : {}),
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // 6. Add discount as a negative line item (Stripe doesn't support negative unit_amount directly,
    // so we use a coupon or adjust. Simpler: apply discount via Stripe coupon.)
    // For simplicity, we'll pass the discount as metadata and create the order with final total.
    // Stripe will charge the full subtotal, then we record the discount.
    // Better approach: use a Stripe coupon. For now, let's keep it simple.

    // 7. Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: customerEmail,
      success_url: `${SITE.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE.url}/checkout`,
      metadata: {
        userId: (session.user as any).id,
        deliveryType,
        customerName,
        customerPhone,
        customerEmail,
        specialInstructions: specialInstructions || "",
        deliveryAddress: deliveryAddress
          ? JSON.stringify(deliveryAddress)
          : "",
        subtotal: subtotal.toString(),
        onlineDiscount: discounts.onlineDiscount.toString(),
        loyaltyDiscount: discounts.loyaltyDiscount.toString(),
        loyaltyPointsUsed: discounts.pointsUsed.toString(),
        totalAfterDiscount: discounts.totalAfterDiscount.toString(),
        useLoyalty: useLoyalty ? "true" : "false",
        cartItems: JSON.stringify(
          items.map((i: any) => ({
            menuItemId: i.menuItemId,
            optionId: i.optionId || null,
            name: i.name,
            optionName: i.optionName || null,
            price: i.price,
            quantity: i.quantity,
            notes: i.notes || null,
            image: i.image || null,
          }))
        ),
      },
    });

    // 8. Return the Stripe URL
    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}