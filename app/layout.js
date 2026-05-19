import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider/ReduxProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Plate — Restaurant Operations",
  description: "Modern restaurant ordering and operations system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
