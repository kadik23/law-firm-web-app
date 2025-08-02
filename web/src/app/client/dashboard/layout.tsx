import Sidebar from "@/components/dashboard/client/sidebar";
import DashboardAuthWrapper from "@/components/DashboardAuthWrapper";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <DashboardAuthWrapper requiredType="client">
            <div className="flex">
                <Sidebar />
                <div className="md:py-20 md:px-10 flex-1 py-6">
                    {children}
                </div>
            </div>
        </DashboardAuthWrapper>
    );
  }