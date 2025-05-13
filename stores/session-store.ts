import { lensClient } from "@/lib/web3-provider";
import { evmAddress, Role, Account } from "@lens-protocol/react";
import { Address, WalletClient } from "viem";
import { create } from "zustand";
import { signMessageWith } from "@lens-protocol/client/viem";
import { SessionClient } from "@lens-protocol/client";

export const LENS_APP_TESTNET_EXAMPLE =
  "0xC75A89145d765c396fd75CbD16380Eb184Bd2ca7";

export type SessionState = {
  session: SessionClient | null;
  walletClient: WalletClient | null;
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
};

const authenticateOnboardingUser = async (walletAddress: Address) => {
  const walletClient = useSessionStore.getState().walletClient;
  if (!walletClient) {
    throw new Error("Wallet client not found");
  }
  const authenticated = await lensClient.login({
    onboardingUser: {
      wallet: evmAddress(walletAddress),
      app: LENS_APP_TESTNET_EXAMPLE,
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
      app: LENS_APP_TESTNET_EXAMPLE,
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

  useSessionStore.setState((state) => ({
    ...state,
    session: sessionClient,
  }));
};

export const authenticate = async (
  walletAddress: Address,
  accountAddress: Address,
  role: Role
) => {
  if (role === Role.OnboardingUser) {
    await authenticateOnboardingUser(walletAddress);
    return;
  } else if (role === Role.AccountOwner) {
    await authenticateAccountOwnerUser(walletAddress, accountAddress);
    return;
  } else {
    throw new Error("Unsupported role");
  }
};

export const useSessionStore = create<SessionStore>((set) => ({
  ...defaultInitState,
  authenticate,
}));
