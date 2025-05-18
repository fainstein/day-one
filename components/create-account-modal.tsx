import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { account } from "@lens-protocol/metadata";
import { useStorageClientStore } from "@/stores/storage-client-store";
import { createAccountWithUsername } from "@lens-protocol/client/actions";
import { useSessionStore } from "@/stores/session-store";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { fetchAccount } from "@lens-protocol/client/actions";
import { never } from "@lens-protocol/client";
import { immutable } from "@lens-chain/storage-client";
import { lensMainnet } from "@/lib/web3-provider";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAccountModal = ({ isOpen, onClose }: CreateAccountModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const { storageClient } = useStorageClientStore();
  const { session, walletClient } = useSessionStore();

  const handleSubmit = async () => {
    if (
      !storageClient ||
      !session ||
      !inputValue ||
      !walletClient ||
      !account
    ) {
      throw new Error("Storage client not found");
    }

    const metadata = account({
      name: inputValue,
    });

    const acl = immutable(lensMainnet.id);

    const { uri } = await storageClient.uploadAsJson(metadata, {
      acl,
    });

    console.log("URI:", uri);

    const result = await createAccountWithUsername(session, {
      username: { localName: inputValue },
      metadataUri: uri,
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction)
      .andThen((txHash) => {
        console.log("TX HASH:", txHash);
        return fetchAccount(session, { txHash });
      })
      .andThen((account) => {
        return session.switchAccount({
          account: account?.address ?? never("Account not found"),
        });
      });

    if (result.isErr()) {
      console.error(result.error);
      return;
    }

    console.log("RESULT:", result.value);

    useSessionStore.setState((state) => ({
      ...state,
      session: result.value,
    }));

    setInputValue("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter account name"
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccountModal;
