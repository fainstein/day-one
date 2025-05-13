import { useSessionStore } from "@/stores/session-store";
import { useEffect } from "react";
import { useWalletClient } from "wagmi";
import { lensSepolia } from "./web3-provider";
export default function WalletClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: walletClient } = useWalletClient({
    chainId: lensSepolia.id,
  });

  useEffect(() => {
    if (walletClient) {
      useSessionStore.setState((state) => ({
        ...state,
        walletClient,
      }));
    }
  }, [walletClient]);

  return <>{children}</>;
}
