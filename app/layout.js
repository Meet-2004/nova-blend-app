import "./globals.css";
import ReduxProvider from "@/store/provider/ReduxProvider";

export const metadata = {
  title: "Plate — Restaurant OS",
  description: "Order, track, and pay — all from your table. The premium restaurant operations platform.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1a1f2e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
