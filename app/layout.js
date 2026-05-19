import "./globals.css";
import { ReduxProvider } from "@/store/provider/ReduxProvider";

export const metadata = {
  title: "Plate - Restaurant Operations",
  description: "Modern restaurant ordering and operations system",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased"
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
