import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";

export async function requireRole(allowedRoles) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const userRole = session.user.role;

  if (!allowedRoles.includes(userRole)) {
    if (userRole === "Supporter") {
      redirect("/dashboard/supporter");
    }

    if (userRole === "Creator") {
      redirect("/dashboard/creator");
    }

    if (userRole === "Admin") {
      redirect("/dashboard/admin");
    }

    redirect("/login");
  }

  return session;
}