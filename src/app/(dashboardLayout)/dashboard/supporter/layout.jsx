// import { requireRole } from "@/app/lib/require-role";

import { requireRole } from "@/app/lib/require-role";

export default async function SupporterLayout({ children }) {
  await requireRole(["Supporter"]);

  return <>{children}</>;
}