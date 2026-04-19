import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const userName = user?.firstName || user?.username || "User";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  console.log(`[DashboardLayout] userId=${userId}, orgId=${orgId}, name=${userName}`);

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Sidebar
          userName={userName}
          userEmail={userEmail}
        />
        <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
