"use client";
import { Button } from "@/components/ui/button";
import {
  storageClient,
  useStorageClientStore,
} from "@/stores/storage-client-store";
import { authenticate, useSessionStore } from "@/stores/session-store";
import useLensAccounts from "@/hooks/useLensAccounts";
import { bigDecimal, Role, TokenStandard } from "@lens-protocol/react";
import { formatAddress } from "@/lib/utils";
import { useAccount, usePublicClient, useReadContract } from "wagmi";
import {
  addAccountManager,
  fetchAccount,
  setAccountMetadata,
  updateAccountFollowRules,
} from "@lens-protocol/client/actions";
import { useParams } from "next/navigation";
import { Address, encodeFunctionData, fromBytes } from "viem";
import { Account, blockchainData, evmAddress } from "@lens-protocol/client";
import { configureAccountAction } from "@lens-protocol/client/actions";
import {
  handleOperationWith,
  signMessageWith,
} from "@lens-protocol/client/viem";
import { account, MetadataAttributeType } from "@lens-protocol/metadata";
import { immutable } from "@lens-chain/storage-client";
import { lensMainnet, Web3Provider } from "@/lib/web3-provider";
import {
  ACTION_HUB,
  BUY_ARTIST_TOKEN_ACTION,
  DAVINCI_TOKEN_ADDRESS,
  DOECHII_TOKEN_ADDRESS,
  SELL_ARTIST_TOKEN_ACTION,
} from "@/lib/constants";
import { lensAccountAbi } from "@/lib/lens-account-abi";
import { actionHubAbi } from "@/lib/action-hub-abi";
import useLensAccount from "@/hooks/useLensAccount";

// 1. Replace addresses for buy and sell actions (OK)
// 2. For each artist, replace the token address in the attributes
// 3. Log in as the artist account owner, and update the metadata
// 4. Then, add actions to the account

// IMPORTANT. YOU NEED TO LOG IN AS THE ARTIST ACCOUNT OWNER TO ADD ACTIONS TO THE ACCOUNT

export default function AdminPage() {
  const { address } = useAccount();
  const viemPublicClient = usePublicClient({
    chainId: lensMainnet.id,
  });
  const { storageClient } = useStorageClientStore();
  const { session, walletClient } = useSessionStore();
  const { artistAccountAddress } = useParams<{
    artistAccountAddress: Address;
  }>();
  const { account: lensAccount } = useLensAccount(address);

  // const addBuyActionAsAccountManager = async () => {
  //   if (!storageClient || !session || !walletClient || !walletClient.account) {
  //     throw new Error("Storage client or session not found");
  //   }

  //   const artistAccount = await fetchAccount(session, {
  //     address: artistAccountAddress,
  //   });

  //   if (artistAccount.isErr()) {
  //     throw new Error("Artist account not found");
  //   }

  //   const addBuyActionResult = await addAccountManager(session, {
  //     address: evmAddress(BUY_ARTIST_TOKEN_ACTION),
  //     permissions: {
  //       canExecuteTransactions: true,
  //       canTransferTokens: false,
  //       canTransferNative: false,
  //       canSetMetadataUri: false,
  //     },
  //   });

  //   if (addBuyActionResult.isErr()) {
  //     console.error(
  //       "Failed to add buy token action as account manager",
  //       addBuyActionResult.error
  //     );
  //     return;
  //   }

  //   if (addBuyActionResult.value.__typename !== "SponsoredTransactionRequest") {
  //     console.error(
  //       "Failed to add buy token action as account manager",
  //       addBuyActionResult.value
  //     );
  //     return;
  //   }

  //   // EOA APPROACH ----- START

  //   // 2) Crea el contrato apuntando a tu smart-account
  //   const aaTxHash = await walletClient.sendTransaction({
  //     account: walletClient.account,
  //     chain: lensMainnet,
  //     to: artistAccountAddress,
  //     data: encodeFunctionData({
  //       abi: lensAccountAbi,
  //       functionName: "addAccountManager",
  //       args: [
  //         evmAddress(BUY_ARTIST_TOKEN_ACTION),
  //         {
  //           canExecuteTransactions: true,
  //           canTransferTokens: false,
  //           canTransferNative: false,
  //           canSetMetadataURI: false,
  //         },
  //       ],
  //     }),
  //   });

  //   console.log("AA TX HASH:", aaTxHash);

  //   const aaTx = await viemPublicClient?.waitForTransactionReceipt({
  //     hash: aaTxHash,
  //   });

  //   console.log("AA TX:", aaTx);
  //   return;
  //   // EOA APPROACH ----- END

  //   // const handledOperation = await handleOperationWith(walletClient)(
  //   //   addBuyActionResult.value
  //   // );

  //   // if (handledOperation.isErr()) {
  //   //   console.error("Failed to handle operation", handledOperation.error);
  //   //   return;
  //   // }

  //   // const txHash = await session.waitForTransaction(handledOperation.value);

  //   // if (txHash.isErr()) {
  //   //   console.error("Failed to wait for transaction", txHash.error);
  //   //   return;
  //   // }

  //   // console.log("ADD BUY TOKEN ACTION AS ACCOUNT MANAGER TX HASH:", txHash);
  //   // const updatedAccount = await fetchAccount(session, {
  //   //   txHash: txHash,
  //   // });

  //   // if (updatedAccount.isErr()) {
  //   //   console.error("Failed to fetch updated account", updatedAccount.error);
  //   //   return;
  //   // }

  //   // console.log(
  //   //   "ADD BUY TOKEN ACTION AS ACCOUNT MANAGER RESULT:",
  //   //   updatedAccount.value
  //   // );
  // };

  // const addSellActionAsAccountManager = async () => {
  //   if (!storageClient || !session || !walletClient || !walletClient.account) {
  //     throw new Error("Storage client or session not found");
  //   }

  //   const artistAccount = await fetchAccount(session, {
  //     address: artistAccountAddress,
  //   });

  //   if (artistAccount.isErr()) {
  //     throw new Error("Artist account not found");
  //   }

  //   // EOA APPROACH ----- START

  //   // 2) Crea el contrato apuntando a tu smart-account
  //   const aaTxHash = await walletClient.sendTransaction({
  //     account: walletClient.account,
  //     chain: lensMainnet,
  //     to: artistAccountAddress,
  //     data: encodeFunctionData({
  //       abi: lensAccountAbi,
  //       functionName: "addAccountManager",
  //       args: [
  //         evmAddress(BUY_ARTIST_TOKEN_ACTION),
  //         {
  //           canExecuteTransactions: true,
  //           canTransferTokens: false,
  //           canTransferNative: false,
  //           canSetMetadataURI: false,
  //         },
  //       ],
  //     }),
  //   });

  //   console.log("AA TX HASH:", aaTxHash);

  //   const aaTx = await viemPublicClient?.waitForTransactionReceipt({
  //     hash: aaTxHash,
  //   });

  //   console.log("AA TX:", aaTx);
  //   return;

  //   // console.log("Adding sell token action as account manager");
  //   // addAccountManager(session, {
  //   //   address: evmAddress(SELL_ARTIST_TOKEN_ACTION),
  //   //   permissions: {
  //   //     canExecuteTransactions: true,
  //   //     canTransferTokens: false,
  //   //     canTransferNative: false,
  //   //     canSetMetadataUri: false,
  //   //   },
  //   // })
  //   //   .andThen((args) => {
  //   //     console.log("ADD SELL TOKEN ACTION AS ACCOUNT MANAGER ARGS:", args);
  //   //     return handleOperationWith(walletClient)(args);
  //   //   })
  //   //   .andThen(session.waitForTransaction)
  //   //   .andThen((txHash) => {
  //   //     console.log(
  //   //       "ADD SELL TOKEN ACTION AS ACCOUNT MANAGER TX HASH:",
  //   //       txHash
  //   //     );
  //   //     return fetchAccount(session, { txHash });
  //   //   });
  // };

  // const configureBuyAction = async () => {
  //   if (!storageClient || !session || !walletClient || !walletClient.account) {
  //     throw new Error("Storage client or session not found");
  //   }

  //   // EOA APPROACH ----- START

  //   try {
  //     const aaTxHash = await walletClient.sendTransaction({
  //       account: walletClient.account,
  //       chain: lensMainnet,
  //       to: artistAccountAddress,
  //       data: encodeFunctionData({
  //         abi: lensAccountAbi,
  //         functionName: "executeTransaction",
  //         args: [
  //           ACTION_HUB, // target address
  //           BigInt(0), // value (0 ETH)
  //           encodeFunctionData({
  //             abi: actionHubAbi,
  //             functionName: "configureAccountAction",
  //             args: [BUY_ARTIST_TOKEN_ACTION, artistAccountAddress, []],
  //           }),
  //         ],
  //       }),
  //     });

  //     console.log("AA TX HASH:", aaTxHash);

  //     const aaTx = await viemPublicClient?.waitForTransactionReceipt({
  //       hash: aaTxHash,
  //     });

  //     console.log("AA TX:", aaTx);
  //     return;
  //   } catch (error) {
  //     console.error("Error executing transaction:", error);
  //   }
  //   // EOA APPROACH ----- END

  //   const configureResult = configureAccountAction(session, {
  //     action: {
  //       unknown: {
  //         address: evmAddress(BUY_ARTIST_TOKEN_ACTION),
  //         params: [],
  //       },
  //     },
  //   });

  //   configureResult
  //     .andThen((args) => {
  //       console.log("CONFIGURE BUY TOKEN ACTION ARGS:", args);
  //       return handleOperationWith(walletClient)(args);
  //     })
  //     .andThen(session.waitForTransaction)
  //     .andThen((txHash) => {
  //       console.log("CONFIGURE BUY TOKEN ACTION TX HASH:", txHash);
  //       return fetchAccount(session, { txHash });
  //     });
  // };

  // const configureSellAction = async () => {
  //   if (!storageClient || !session || !walletClient) {
  //     throw new Error("Storage client or session not found");
  //   }

  //   const artistAccount = await fetchAccount(session, {
  //     address: artistAccountAddress,
  //   });

  //   if (artistAccount.isErr()) {
  //     throw new Error("Artist account not found");
  //   }

  //   console.log("Configuring sell token action");
  //   const configureResult = await configureAccountAction(session, {
  //     action: {
  //       unknown: {
  //         address: evmAddress(SELL_ARTIST_TOKEN_ACTION),
  //         params: [],
  //       },
  //     },
  //   })
  //     .andThen((args) => {
  //       console.log("CONFIGURE SELL TOKEN ACTION ARGS:", args);
  //       return handleOperationWith(walletClient)(args);
  //     })
  //     .andThen(session.waitForTransaction)
  //     .andThen((txHash) => {
  //       console.log("CONFIGURE SELL TOKEN ACTION TX HASH:", txHash);
  //       return fetchAccount(session, { txHash });
  //     });

  //   if (configureResult.isErr()) {
  //     throw new Error("Failed to configure sell token action");
  //   }

  //   console.log("Sell token action configured", configureResult.value);
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
          value: DOECHII_TOKEN_ADDRESS,
        },
      ],
    });

    const acl = immutable(lensMainnet.id);

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

  const updateArtistImage = async () => {
    if (!storageClient || !session || !walletClient) {
      throw new Error("Storage client or session not found");
    }

    try {
      const response = await fetch("/Doechii.jpg");
      const blob = await response.blob();
      const file = new File([blob], "Doechii.jpg", {
        type: blob.type,
      });

      const acl = immutable(lensMainnet.id);

      const { uri: imageUri } = await storageClient.uploadFile(file, {
        acl,
      });

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
        picture: imageUri,
        attributes: [
          {
            key: "token",
            type: MetadataAttributeType.STRING,
            value: DOECHII_TOKEN_ADDRESS,
          },
        ],
      });

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
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  const onAuthenticate = async (account: Account) => {
    console.log("Authenticating", account);
    await authenticate(account.owner, account.address, Role.AccountOwner);
  };

  const onAddFollowRule = async () => {
    if (!storageClient || !session || !walletClient) {
      throw new Error("Storage client or session not found");
    }

    const result = await updateAccountFollowRules(session, {
      toAdd: {
        required: [
          {
            tokenGatedRule: {
              token: {
                currency: evmAddress(DAVINCI_TOKEN_ADDRESS),
                standard: TokenStandard.Erc20,
                value: bigDecimal("1"),
              },
            },
          },
        ],
      },
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction)
      .andThen((txHash) => {
        console.log("UPDATE ACCOUNT FOLLOW RULES TX HASH:", txHash);
        return fetchAccount(session, { txHash });
      });

    console.log("UPDATE ACCOUNT FOLLOW RULES RESULT:", result);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1>Single Artist Admin</h1>
      {session && (
        <div className="flex flex-col gap-4">
          {/* <Button onClick={configureBuyAction}>Configure Buy Action</Button>
          <Button onClick={configureSellAction}>Configure Sell Action</Button>
          <Button onClick={addBuyActionAsAccountManager}>
            Add Buy Action as Account Manager
          </Button>
          <Button onClick={addSellActionAsAccountManager}>
            Add Sell Action as Account Manager
          </Button> */}
          <Button onClick={updateArtistMetadata}>
            Update artists metadata
          </Button>
          <Button onClick={updateArtistImage}>Update artists image</Button>
          <Button onClick={onAddFollowRule}>Add Follow Rule</Button>
        </div>
      )}
      {!session && (
        <div className="flex flex-col gap-4">
          {lensAccount &&
            [lensAccount].map((account) => (
              <div key={account.address} className="flex items-center gap-2">
                <p>{formatAddress(account.address)}</p>
                <p>{formatAddress(account.owner)}</p>
                <p>{account.username?.localName}</p>
                <Button onClick={() => onAuthenticate(account)}>
                  Authenticate
                </Button>
              </div>
            ))}
          {!lensAccount && address && (
            <div className="flex items-center justify-center h-[50vh] flex-col gap-4">
              <p className="text-xl text-gray-400">No account found</p>
              <Button
                onClick={() =>
                  authenticate(address, artistAccountAddress, Role.AccountOwner)
                }
              >
                Authenticate
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
