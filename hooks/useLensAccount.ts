import { evmAddress, Account } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useSessionStore } from "@/stores/session-store";
import { lensClient } from "@/lib/web3-provider";

export default function useLensAccount(
  accountAddress?: Address,
  usePublicClient?: boolean
): {
  account: Account | null;
} {
  const [account, setAccount] = useState<Account | null>(null);
  const { session } = useSessionStore();

  useEffect(() => {
    const clientToUse = usePublicClient ? lensClient : session;
    const fn = async () => {
      if (!accountAddress || !clientToUse) return;

      const result = await fetchAccount(clientToUse, {
        address: evmAddress(accountAddress),
      });

      if (result.isErr()) {
        return console.error(result.error);
      }

      const fetchedAccount = result.value;

      if (!fetchedAccount) {
        setAccount(null);
        return;
      }

      setAccount(fetchedAccount);
    };

    fn();
  }, [accountAddress, session]);

  return { account };
}
