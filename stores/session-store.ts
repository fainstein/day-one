import { lensClient } from "@/lib/web3-provider";
import { evmAddress, Role, Account } from "@lens-protocol/react";
import { Address, WalletClient } from "viem";
import { create } from "zustand";
import { signMessageWith } from "@lens-protocol/client/viem";
import { SessionClient } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";

export const LENS_APP_TESTNET_DAY_ONE =
  "0x9F4803810FC7C8A693d043c856cB1Fb1cC48699f";
export const LENS_APP_MAINNET_DAY_ONE =
  "0xF5c8EE8EE0167fCe274931425e6a1d7cd20D08f5";
export type SessionState = {
  session: SessionClient | null;
  walletClient: WalletClient | null;
  accountAddress: Address | null;
};

export type SessionActions = {
  authenticate: (
    walletAddress: Address,
    accountAddress: Address,
    role: Role
  ) => Promise<void>;
  //   setSession: (session: SessionClient) => void;
  //   setWalletClient: (walletClient: WalletClient) => void;
};

export type SessionStore = SessionState & SessionActions;

const defaultInitState: SessionState = {
  session: null,
  walletClient: null,
  accountAddress: null,
};

const authenticateOnboardingUser = async (
  walletAddress: Address,
  accountAddress: Address
) => {
  const walletClient = useSessionStore.getState().walletClient;
  if (!walletClient) {
    throw new Error("Wallet client not found");
  }
  const authenticated = await lensClient.login({
    onboardingUser: {
      wallet: evmAddress(walletAddress),
      app: LENS_APP_MAINNET_DAY_ONE,
    },
    signMessage: signMessageWith(walletClient),
  });

  if (authenticated.isErr()) {
    throw new Error("Failed to authenticate");
  }

  const session = authenticated.value;

  useSessionStore.setState((state) => ({
    ...state,
    session,
    accountAddress,
  }));
};

const authenticateAccountOwnerUser = async (
  walletAddress: Address,
  accountAddress: Address
) => {
  const walletClient = useSessionStore.getState().walletClient;
  if (!walletClient) {
    throw new Error("Wallet client not found");
  }

  const authenticated = await lensClient.login({
    accountOwner: {
      account: accountAddress,
      app: LENS_APP_MAINNET_DAY_ONE,
      owner: walletAddress,
    },
    signMessage: signMessageWith(walletClient),
  });

  if (authenticated.isErr()) {
    return console.error(authenticated.error);
  }

  // SessionClient: { ... }
  console.log("authenticated", authenticated);
  const sessionClient = authenticated.value;

  const fullAccount = await fetchAccount(sessionClient, {
    address: accountAddress,
  });

  console.log("fullAccount", fullAccount);

  useSessionStore.setState((state) => ({
    ...state,
    session: sessionClient,
    accountAddress,
  }));
};

const authenticateAccountManagerUser = async (
  walletAddress: Address,
  accountAddress: Address
) => {
  const walletClient = useSessionStore.getState().walletClient;
  if (!walletClient) {
    throw new Error("Wallet client not found");
  }

  const authenticated = await lensClient.login({
    accountManager: {
      account: accountAddress,
      app: LENS_APP_MAINNET_DAY_ONE,
      manager: walletAddress,
    },
    signMessage: signMessageWith(walletClient),
  });

  if (authenticated.isErr()) {
    throw new Error("Failed to authenticate");
  }

  const sessionClient = authenticated.value;

  useSessionStore.setState((state) => ({
    ...state,
    session: sessionClient,
    accountAddress,
  }));
};

export const authenticate = async (
  walletAddress: Address,
  accountAddress: Address,
  role: Role
) => {
  if (role === Role.OnboardingUser) {
    await authenticateOnboardingUser(walletAddress, accountAddress);
    return;
  } else if (role === Role.AccountOwner) {
    await authenticateAccountOwnerUser(walletAddress, accountAddress);
    return;
  } else if (role === Role.AccountManager) {
    await authenticateAccountManagerUser(walletAddress, accountAddress);
    return;
  } else {
    throw new Error("Unsupported role");
  }
};

export const useSessionStore = create<SessionStore>((set) => ({
  ...defaultInitState,
  authenticate,
}));
