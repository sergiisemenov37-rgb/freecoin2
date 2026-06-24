import "./globals.css";

import BottomNav from "../components/BottomNav";

import {
  AppWalletProvider,
} from "../components/WalletProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <AppWalletProvider>

          {children}

          <BottomNav />

        </AppWalletProvider>

      </body>
    </html>
  );
}
