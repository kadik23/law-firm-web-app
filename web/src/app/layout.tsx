import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthClientWrapper from "@/components/AuthClientWrapper";
import { Alert } from "@/components/alert";

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
      <head/>
      <body
        className={`antialiased `}
      >
        <AuthClientWrapper>
          <div>
            <Header />
            <div className="mt-12 md:mt-14">{children}</div>
            <Alert 
              alertType="help" 
              alertTitle="Warning!" 
              alertMessage="Sorry! There was a problem with your request."/>
            <Footer />
          </div>
        </AuthClientWrapper>
      </body>
    </html>
  );
}
