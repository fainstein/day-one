import { useSessionStore } from "@/stores/session-store";
import { useEffect } from "react";
import { useWalletClient } from "wagmi";
import { lensMainnet } from "./web3-provider";
import { eip712WalletActions } from "viem/zksync";

export default function WalletClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: walletClient } = useWalletClient({
    chainId: lensMainnet.id,
  });

  useEffect(() => {
    if (walletClient) {
      const parsedWalletClient = walletClient.extend(eip712WalletActions());
      useSessionStore.setState((state) => ({
        ...state,
        walletClient: parsedWalletClient,
      }));
    }
  }, [walletClient]);

  return <>{children}</>;
}
