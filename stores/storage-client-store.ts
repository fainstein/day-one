import { StorageClient } from "@lens-chain/storage-client";
import { create } from "zustand";

export const storageClient = StorageClient.create();

export type StorageClientState = {
  storageClient: StorageClient | null;
};

const defaultInitState: StorageClientState = {
  storageClient: null,
};

export const useStorageClientStore = create<StorageClientState>((set) => ({
  ...defaultInitState,
  storageClient,
}));
