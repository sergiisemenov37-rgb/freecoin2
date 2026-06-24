"use client";

import { useEffect, useState } from "react";
import {
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  useWallet,
} from "@solana/wallet-adapter-react";

export default function WalletButton() {
  const [mounted, setMounted] =
    useState(false);

  const { publicKey } =
    useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (publicKey) {
      localStorage.setItem(
        "wallet",
        publicKey.toString()
      );
    }
  }, [publicKey]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="scale-90">
      <WalletMultiButton />
    </div>
  );
}