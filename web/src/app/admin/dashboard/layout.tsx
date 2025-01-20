import Sidebar from "@/components/dashboard/sidebar";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="py-20 px-10 flex-1">
                {children}
            </div>
        </div>
    );
  }