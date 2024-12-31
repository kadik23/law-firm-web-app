import SearchSection from "@/components/blog/searchSection";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="py-8 lg:mx-12 mx-8">
            <SearchSection />
            {children}
        </div>
    );
  }