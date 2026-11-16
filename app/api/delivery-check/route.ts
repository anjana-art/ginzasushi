// app/api/delivery-check/route.ts
import { NextResponse } from "next/server";
import { checkDeliveryEligibility } from "@/lib/distance";

export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { error: "Address required" },
        { status: 400 }
      );
    }

    const result = await checkDeliveryEligibility(address);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Delivery check error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}