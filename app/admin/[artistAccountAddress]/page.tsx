"use client";
import { Button } from "@/components/ui/button";
import { useStorageClientStore } from "@/stores/storage-client-store";
import { authenticate, useSessionStore } from "@/stores/session-store";
import useLensAccounts from "@/hooks/useLensAccounts";
import { Role } from "@lens-protocol/react";
import { formatAddress } from "@/lib/utils";
import { useAccount } from "wagmi";
import {
  addAccountManager,
  fetchAccount,
  setAccountMetadata,
} from "@lens-protocol/client/actions";
import { useParams } from "next/navigation";
import { Address } from "viem";
import { blockchainData, evmAddress } from "@lens-protocol/client";
import { configureAccountAction } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { account, MetadataAttributeType } from "@lens-protocol/metadata";
import { immutable } from "@lens-chain/storage-client";
import { lensSepolia } from "@/lib/web3-provider";
import {
  BUY_ARTIST_TOKEN_ACTION,
  DAVINCI_TOKEN,
  DOECHII_TOKEN,
  SELL_ARTIST_TOKEN_ACTION,
} from "@/lib/constants";

// 1. Replace addresses for buy and sell actions (OK)
// 2. For each artist, replace the token address in the attributes
// 3. Log in as the artist account owner, and update the metadata
// 4. Then, add actions to the account

// IMPORTANT. YOU NEED TO LOG IN AS THE ARTIST ACCOUNT OWNER TO ADD ACTIONS TO THE ACCOUNT

const UNIVERSAL_ACTION_KEY =
  "0xa12c06eea999f2a08fb2bd50e396b2a286921eebbda81fb45a0adcf13afb18ef"; // keccak256("lens.param.universal")

export default function AdminPage() {
  const { address } = useAccount();
  const { storageClient } = useStorageClientStore();
  const { session, walletClient } = useSessionStore();
  const { accounts } = useLensAccounts(address);
  const { artistAccountAddress } = useParams<{
    artistAccountAddress: Address;
  }>();

  const addBuyActionAsAccountManager = async () => {
    if (!storageClient || !session || !walletClient) {
      throw new Error("Storage client or session not found");
    }

    const artistAccount = await fetchAccount(session, {
      address: artistAccountAddress,
    });

    if (artistAccount.isErr()) {
      throw new Error("Artist account not found");
    }

    console.log("Adding buy token action");
    await addAccountManager(session, {
      address: evmAddress(BUY_ARTIST_TOKEN_ACTION),
      permissions: {
        canExecuteTransactions: true,
        canTransferTokens: false,
        canTransferNative: false,
        canSetMetadataUri: false,
      },
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction)
      .andThen((txHash) => {
        console.log("ADD BUY TOKEN ACTION TX HASH:", txHash);
        return fetchAccount(session, { txHash });
      });
  };

  const addSellActionAsAccountManager = async () => {
    if (!storageClient || !session || !walletClient) {
      throw new Error("Storage client or session not found");
    }

    const artistAccount = await fetchAccount(session, {
      address: artistAccountAddress,
    });

    if (artistAccount.isErr()) {
      throw new Error("Artist account not found");
    }

    console.log("Adding sell token action");
    await addAccountManager(session, {
      address: evmAddress(SELL_ARTIST_TOKEN_ACTION),
      permissions: {
        canExecuteTransactions: true,
        canTransferTokens: false,
        canTransferNative: false,
        canSetMetadataUri: false,
      },
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction)
      .andThen((txHash) => {
        console.log("ADD SELL TOKEN ACTION TX HASH:", txHash);
        return fetchAccount(session, { txHash });
      });
  };

  const configureBuyAction = async () => {
    if (!storageClient || !session || !walletClient) {
      throw new Error("Storage client or session not found");
    }

    const artistAccount = await fetchAccount(session, {
      address: artistAccountAddress,
    });

    if (artistAccount.isErr()) {
      throw new Error("Artist account not found");
    }

    console.log("Configuring buy token action", artistAccount.value?.address);
    await configureAccountAction(session, {
      action: {
        unknown: {
          address: evmAddress(BUY_ARTIST_TOKEN_ACTION),
          params: [
            {
              raw: {
                key: blockchainData(UNIVERSAL_ACTION_KEY),
                data: blockchainData("0x00"), // puede ser cualquier valor dummy
              },
            },
          ],
        },
      },
    })
      .andThen((args) => {
        console.log("CONFIGURE BUY TOKEN ACTION ARGS:", args);
        return handleOperationWith(walletClient)(args);
      })
      .andThen(session.waitForTransaction)
      .andThen((txHash) => {
        console.log("CONFIGURE BUY TOKEN ACTION TX HASH:", txHash);
        return fetchAccount(session, { txHash });
      });
  };

  const configureSellAction = async () => {
    if (!storageClient || !session || !walletClient) {
      throw new Error("Storage client or session not found");
    }

    const artistAccount = await fetchAccount(session, {
      address: artistAccountAddress,
    });

    if (artistAccount.isErr()) {
      throw new Error("Artist account not found");
    }

    console.log("Configuring sell token action");
    await configureAccountAction(session, {
      action: {
        unknown: {
          address: evmAddress(SELL_ARTIST_TOKEN_ACTION),
          params: [],
        },
      },
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction)
      .andThen((txHash) => {
        console.log("CONFIGURE SELL TOKEN ACTION TX HASH:", txHash);
        return fetchAccount(session, { txHash });
      });
  };

  // const addActionsToArtistAccount = async () => {
  //   if (!storageClient || !session || !walletClient) {
  //     throw new Error("Storage client or session not found");
  //   }

  //   const artistAccount = await fetchAccount(session, {
  //     address: artistAccountAddress,
  //   });

  //   if (artistAccount.isErr()) {
  //     throw new Error("Artist account not found");
  //   }

  //   console.log("Adding buy token action");
  //   await addAccountManager(session, {
  //     address: evmAddress(BUY_ARTIST_TOKEN_ACTION),
  //     permissions: {
  //       canExecuteTransactions: true,
  //       canTransferTokens: false,
  //       canTransferNative: false,
  //       canSetMetadataUri: false,
  //     },
  //   })
  //     .andThen(handleOperationWith(walletClient))
  //     .andThen(session.waitForTransaction)
  //     .andThen((txHash) => {
  //       console.log("ADD BUY TOKEN ACTION TX HASH:", txHash);
  //       return fetchAccount(session, { txHash });
  //     });

  //   console.log("Adding sell token action");
  //   await addAccountManager(session, {
  //     address: evmAddress(SELL_ARTIST_TOKEN_ACTION),
  //     permissions: {
  //       canExecuteTransactions: true,
  //       canTransferTokens: false,
  //       canTransferNative: false,
  //       canSetMetadataUri: false,
  //     },
  //   })
  //     .andThen(handleOperationWith(walletClient))
  //     .andThen(session.waitForTransaction)
  //     .andThen((txHash) => {
  //       console.log("ADD SELL TOKEN ACTION TX HASH:", txHash);
  //       return fetchAccount(session, { txHash });
  //     });

  //   console.log("Configuring buy token action");
  //   await configureAccountAction(session, {
  //     action: {
  //       unknown: {
  //         address: evmAddress(BUY_ARTIST_TOKEN_ACTION),
  //         params: [],
  //       },
  //     },
  //   })
  //     .andThen(handleOperationWith(walletClient))
  //     .andThen(session.waitForTransaction)
  //     .andThen((txHash) => {
  //       console.log("CONFIGURE BUY TOKEN ACTION TX HASH:", txHash);
  //       return fetchAccount(session, { txHash });
  //     });

  //   console.log("Configuring sell token action");
  //   await configureAccountAction(session, {
  //     action: {
  //       unknown: {
  //         address: evmAddress(SELL_ARTIST_TOKEN_ACTION),
  //         params: [],
  //       },
  //     },
  //   })
  //     .andThen(handleOperationWith(walletClient))
  //     .andThen(session.waitForTransaction)
  //     .andThen((txHash) => {
  //       console.log("CONFIGURE SELL TOKEN ACTION TX HASH:", txHash);
  //       return fetchAccount(session, { txHash });
  //     });
  // };

  const updateArtistMetadata = async () => {
    if (!storageClient || !session || !walletClient) {
      throw new Error("Storage client or session not found");
    }

    const artistAccount = await fetchAccount(session, {
      address: artistAccountAddress,
    });

    if (artistAccount.isErr()) {
      throw new Error("Artist account not found");
    }

    const metadata = artistAccount.value?.metadata;

    if (!metadata || !metadata.name || !metadata.bio || !metadata.picture) {
      throw new Error("Metadata not found");
    }

    const updatedMetadata = account({
      name: metadata.name,
      bio: metadata.bio,
      picture: metadata.picture,
      attributes: [
        {
          key: "token",
          type: MetadataAttributeType.STRING,
          value: DAVINCI_TOKEN,
        },
      ],
    });

    const acl = immutable(lensSepolia.id);

    const { uri } = await storageClient.uploadAsJson(updatedMetadata, {
      acl,
    });

    const result = await setAccountMetadata(session, {
      metadataUri: uri,
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction)
      .andThen((txHash) => {
        console.log("SET ARTIST METADATA TX HASH:", txHash);
        return fetchAccount(session, { txHash });
      });

    if (result.isErr()) {
      throw new Error("Failed to update artist metadata");
    }

    console.log("Artist metadata updated");
  };

  return (
    <div className="flex flex-col gap-4">
      <h1>Single Artist Admin</h1>
      {session && (
        <div className="flex flex-col gap-4">
          <Button onClick={addBuyActionAsAccountManager}>
            Add Buy Action to Artist Account
          </Button>
          <Button onClick={addSellActionAsAccountManager}>
            Add Sell Action to Artist Account
          </Button>
          <Button onClick={configureBuyAction}>Configure Buy Action</Button>
          <Button onClick={configureSellAction}>Configure Sell Action</Button>
          <Button onClick={updateArtistMetadata}>
            Update artists metadata
          </Button>
        </div>
      )}
      {!session && (
        <div className="flex flex-col gap-4">
          {accounts.map((account) => (
            <div
              key={account.account.address}
              className="flex items-center gap-2"
            >
              <p>{formatAddress(account.account.address)}</p>
              <p>{formatAddress(account.account.owner)}</p>
              <p>{account.account.username?.localName}</p>
              <Button
                onClick={() =>
                  authenticate(
                    account.account.owner,
                    account.account.address,
                    Role.AccountOwner
                  )
                }
              >
                Authenticate
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
