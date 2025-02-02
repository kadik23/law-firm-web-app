import SearchSection from "@/components/blog/searchSection";
import BlogsWrapper from "@/components/BlogsWrapper";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="py-8 lg:mx-12 mx-8">
          <BlogsWrapper>
            <SearchSection />
            {children}
          </BlogsWrapper>
        </div>
    );
  }