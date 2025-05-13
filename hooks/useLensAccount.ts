import { evmAddress, Account } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useSessionStore } from "@/stores/session-store";

export default function useLensAccount(accountAddress?: Address): {
  account: Account | null;
} {
  const [account, setAccount] = useState<Account | null>(null);
  const { session } = useSessionStore();

  useEffect(() => {
    if (!accountAddress || !session) return;
    const fn = async () => {
      const result = await fetchAccount(session, {
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
