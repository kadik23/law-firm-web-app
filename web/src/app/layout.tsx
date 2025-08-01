import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthClientWrapper from "@/components/AuthClientWrapper";
import { AlertProvider } from "@/contexts/AlertContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

// const geistSans = localFont({
//   src: "../assets/fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "../assets/fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Law Firm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <head />
      <body className={`antialiased `}>
        <AlertProvider>
          <AuthClientWrapper>
            <NotificationProvider>
              <div>
                <Header />
                <div className="mt-12 md:mt-14">{children}</div>
                <Footer />
              </div>
            </NotificationProvider>
          </AuthClientWrapper>
        </AlertProvider>
      </body>
    </html>
  );
}
