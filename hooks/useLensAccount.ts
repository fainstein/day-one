import { evmAddress, Account } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";
import { useEffect, useState } from "react";
import { lensClient } from "@/lib/web3-provider";
import { Address } from "viem";

export default function useLensAccount(accountAddress?: Address): {
  account: Account | null;
} {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (!accountAddress) return;
    const fn = async () => {
      const result = await fetchAccount(lensClient, {
        address: evmAddress(accountAddress),
      });

      if (result.isErr()) {
        return console.error(result.error);
      }

      const fetchedAccount = result.value;
      console.log("fetchedAccount", fetchedAccount);

      if (!fetchedAccount) {
        setAccount(null);
        return;
      }

      setAccount(fetchedAccount);
    };

    fn();
  }, [accountAddress]);

  return { account };
}
