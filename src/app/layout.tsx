import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { I18nWrapper } from "@/components/i18n-wrapper";
import "./globals.css";

const ibmPlex = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "iGAS — Medical Gas Maintenance Reports",
  description: "نظام تقارير الصيانة الدورية لشبكة الغازات الطبية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${ibmPlex.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-800">
        <I18nWrapper>{children}</I18nWrapper>
      </body>
    </html>
  );
}
