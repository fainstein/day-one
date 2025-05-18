"use client";
import { Button } from "@/components/ui/button";
import { MetadataAttributeType, account } from "@lens-protocol/metadata";
import { useStorageClientStore } from "@/stores/storage-client-store";
import { authenticate, useSessionStore } from "@/stores/session-store";
import { immutable } from "@lens-chain/storage-client";
import { lensMainnet } from "@/lib/web3-provider";
import useLensAccounts from "@/hooks/useLensAccounts";
import { Role } from "@lens-protocol/react";
import { formatAddress } from "@/lib/utils";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import {
  createAccountWithUsername,
  fetchAccount,
} from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import CreateAccountModal from "@/components/create-account-modal";

const ARTIST_DATA = {
  name: "Doechii (Day One)",
  username: "dayone-v3-doechii",
  bio: "Doechii is a genre-defying force in hip-hop, blending razor-sharp lyricism with boundless creativity and unapologetic authenticity.",
  picture: "/Doechii.jpg",
  PICTURE_FILE_NAME: "Doechii.jpg",
  TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000",
};

export default function AdminPage() {
  const { address } = useAccount();
  const { storageClient } = useStorageClientStore();
  const { session, walletClient } = useSessionStore();
  const { accounts } = useLensAccounts(address);
  const [imageData, setImageData] = useState<File | null>(null);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(ARTIST_DATA.picture);
        const blob = await response.blob();
        const file = new File([blob], ARTIST_DATA.PICTURE_FILE_NAME, {
          type: blob.type,
        });

        setImageData(file);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    loadImage();
  }, []);

  const createArtist = async () => {
    if (!storageClient || !session || !walletClient) {
      throw new Error("Storage client or session not found");
    }

    if (!imageData) {
      throw new Error("Image not loaded yet");
    }

    // First upload the image to IPFS
    const acl = immutable(lensMainnet.id);

    const { uri: imageUri } = await storageClient.uploadFile(imageData, {
      acl,
    });

    // Then create the account metadata with the image URI
    const metadata = account({
      name: ARTIST_DATA.name,
      bio: ARTIST_DATA.bio,
      picture: imageUri,
      attributes: [
        {
          key: "token",
          type: MetadataAttributeType.STRING,
          value: ARTIST_DATA.TOKEN_ADDRESS,
        },
      ],
    });

    // Upload the metadata to IPFS
    const { uri: metadataUri } = await storageClient.uploadAsJson(metadata, {
      acl,
    });

    const result = await createAccountWithUsername(session, {
      username: { localName: ARTIST_DATA.username },
      metadataUri: metadataUri,
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction)
      .andThen((txHash) => {
        console.log("TX HASH:", txHash);
        return fetchAccount(session, { txHash });
      });

    if (result.isErr()) {
      console.error(result.error);
      return;
    }

    console.log("RESULT:", result.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1>Admin</h1>
      <CreateAccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
      />
      {session && (
        <div className="flex flex-col gap-4">
          <Button onClick={createArtist}>Create Artist</Button>
        </div>
      )}
      {!session && (
        <div className="flex flex-col gap-4">
          {accounts.length > 0 &&
            accounts.map((account) => (
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
          {accounts.length === 0 && (
            <div className="flex flex-col gap-4">
              <p>No accounts found. Please create an account first.</p>
              <Button
                onClick={() => {
                  if (!address) return;
                  authenticate(address, address, Role.OnboardingUser);
                  setIsCreateAccountModalOpen(true);
                }}
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
