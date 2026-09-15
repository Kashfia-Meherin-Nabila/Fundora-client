import { requireRole } from "@/app/lib/require-role";

export default async function AdminLayout({ children }) {
  await requireRole(["Admin"]);

  return <>{children}</>;
}