import Sidebar from "@/components/dashboard/sidebar";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="md:py-20 md:px-10 flex-1 py-6">
                {children}
            </div>
        </div>
    );
  }