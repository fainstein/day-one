import { Account, evmAddress } from "@lens-protocol/client";
import {
  fetchAccount,
  fetchAccountsAvailable,
} from "@lens-protocol/client/actions";
import { useEffect, useState } from "react";
import { lensClient, lensMainnet } from "@/lib/web3-provider";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { Role } from "@lens-protocol/react";

export type LensAccount = {
  account: Account;
  role: Role;
};

export default function useLensAccounts(accountAddress?: Address): {
  accounts: LensAccount[];
} {
  const [accounts, setAccounts] = useState<LensAccount[]>([]);
  const publicClient = usePublicClient({
    chainId: lensMainnet.id,
  });

  useEffect(() => {
    if (!accountAddress) return;
    const fn = async () => {
      const result = await fetchAccountsAvailable(lensClient, {
        managedBy: evmAddress(accountAddress),
        includeOwned: true,
      });

      if (result.isErr()) {
        return console.error(result.error);
      }

      const fetchedAccounts = result.value;
      console.log("fetchedAccount", fetchedAccounts);

      if (!fetchedAccounts) {
        setAccounts([]);
        return;
      }

      let isEOA = false;
      if (fetchedAccounts.items.length === 1) {
        // When only having one account, we check if it's an EOA
        const accountAddressCode = await publicClient?.getCode({
          address: fetchedAccounts.items[0].account.address,
        });

        isEOA = !accountAddressCode || accountAddressCode === "0x";
      }

      setAccounts(
        fetchedAccounts.items.map((item) => ({
          account: item.account,
          role: isEOA ? Role.OnboardingUser : Role.AccountOwner,
        }))
      );
    };

    fn();
  }, [accountAddress]);

  return { accounts };
}
