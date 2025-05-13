"use client";

import React, { useEffect } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import {
  LensConfig,
  LensProvider,
  development,
  production,
} from "@lens-protocol/react-web";
import { bindings } from "@lens-protocol/wagmi";
import { BLOCK_EXPLORER_URL, RPC_PROVIDER_URL } from "@/lib/constants";
import { PublicClient, testnet } from "@lens-protocol/client";
import { fragments } from "@/fragments";
import WalletClientProvider from "./wallet-client-provider";

// connect kit doesn't export the config type, so we create it here
type ConnectKitConfig = Parameters<typeof getDefaultConfig>[0];

export const lensSepolia = {
  id: 37111,
  name: "Lens Network Sepolia Testnet",
  nativeCurrency: {
    name: "GRASS",
    symbol: "GRASS",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [RPC_PROVIDER_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "LensExplorerScan",
      url: BLOCK_EXPLORER_URL,
      apiUrl: "",
    },
  },
};

// differences in config between the environments
const appConfigs = {
  development: {
    connectkit: {
      chains: [lensSepolia],
      transports: {
        [lensSepolia.id]: http(),
      },
    } as Partial<ConnectKitConfig>,
    lens: {
      environment: development,
      debug: true,
    } as Partial<LensConfig>,
  },
  production: {
    connectkit: {
      chains: [lensSepolia],
      transports: {
        [lensSepolia.id]: http(),
      },
    } as Partial<ConnectKitConfig>,
    lens: {
      environment: production,
    } as Partial<LensConfig>,
  },
};

// select the config based on the environment
const appConfig = appConfigs["development"]; // or appConfigs["production"]

const wagmiConfig = createConfig(
  getDefaultConfig({
    // storage: createStorage({
    //   storage: window ? localStorage : undefined,
    //   key: "lensfairflair",
    // }),
    appName: "Day One",
    appUrl:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://day-one-neon.vercel.app/",
    appDescription:
      "Day One is a platform for early-stage investing in emerging talent",
    appIcon: "/favicon.ico",
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    ssr: false,
    ...appConfig.connectkit,
  })
);

const queryClient = new QueryClient();

const lensConfig: LensConfig = {
  environment: development, // or production
  bindings: bindings(wagmiConfig),
  ...appConfig.lens,
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="soft" mode="dark">
          <WalletClientProvider>
            <LensProvider config={lensConfig}>{children}</LensProvider>
          </WalletClientProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export const lensClient = PublicClient.create({
  environment: testnet,
  // fragments,
});
