// import DashboardSidebar from "@/components/DashboardSidebar";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardSidebar />

      <main className="ml-72 min-h-screen w-[calc(100%-18rem)]">
        {children}
      </main>
    </div>
  );
}