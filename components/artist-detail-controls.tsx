import { Artist } from "@/types/artist";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useSessionStore } from "@/stores/session-store";
import { follow, unfollow, fetchAccount } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/client";
import { handleOperationWith } from "@lens-protocol/client/viem";
import useLensAccount from "@/hooks/useLensAccount";

export default function ArtistDetailControls({ artist }: { artist: Artist }) {
  const { account } = useLensAccount(artist.accountAddress);
  const { session, walletClient } = useSessionStore();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (account) {
      const result = account.operations?.isFollowedByMe;
      setIsFollowing(!!result);
    }
  }, [account]);

  const handleToggleFollow = async () => {
    if (!session || !walletClient) {
      console.log("No session or account or walletClient");
      return;
    }

    const account = await fetchAccount(session, {
      address: evmAddress(artist.accountAddress),
    });

    console.log("fetchAccount", account);

    if (account.isErr()) {
      console.error("Error fetching account:", account.error);
      return;
    }

    const targetAccount = account.value;

    if (!targetAccount) {
      console.log("No target account");
      return;
    }

    const operations = targetAccount.operations;

    if (!operations) {
      console.log("No operations");
      return;
    }

    if (isFollowing) {
      // Unfollow logic
      if (operations.isFollowedByMe) {
        try {
          const result = await unfollow(session, {
            account: evmAddress(targetAccount.address),
          })
            .andThen(handleOperationWith(walletClient))
            .andThen(session.waitForTransaction)
            .andThen((txHash) => {
              console.log("UNFOLLOW TX HASH:", txHash);
              return fetchAccount(session, { txHash });
            });

          if (result.isOk()) {
            setIsFollowing(false);
          }
        } catch (error) {
          console.error("Error unfollowing:", error);
        }
      }
    } else {
      // Follow logic
      const canFollow = operations.canFollow;

      if (canFollow.__typename === "AccountFollowOperationValidationPassed") {
        try {
          const result = await follow(session, {
            account: evmAddress(targetAccount.address),
          })
            .andThen(handleOperationWith(walletClient))
            .andThen(session.waitForTransaction)
            .andThen((txHash) => {
              console.log("FOLLOW TX HASH:", txHash);
              return fetchAccount(session, { txHash });
            });

          if (result.isOk()) {
            setIsFollowing(true);
          }
        } catch (error) {
          console.error("Error following:", error);
        }
      } else if (
        canFollow.__typename === "AccountFollowOperationValidationFailed"
      ) {
        console.error("Cannot follow:", canFollow.reason);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isFollowing ? "outline" : "default"}
        onClick={handleToggleFollow}
        disabled={!session}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
}
