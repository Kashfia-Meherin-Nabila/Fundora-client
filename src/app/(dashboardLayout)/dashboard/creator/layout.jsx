import { requireRole } from "@/app/lib/require-role";

export default async function CreatorLayout({ children }) {
  await requireRole(["Creator"]);

  return <>{children}</>;
}