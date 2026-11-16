// lib/auth-utils.ts
import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Get the current session (or null if not logged in)
 */
export async function getSession() {
  return await auth();
}

/**
 * Require a logged-in user. Redirects to /login if not.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Require an admin user. Redirects to /login if not, or / if not admin.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (!(session.user as any).isAdmin) {
    redirect("/");
  }
  return session;
}