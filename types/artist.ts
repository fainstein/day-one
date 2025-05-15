import { Address } from "viem";

export type Artist = {
  id: string;
  name: string;
  tokenSymbol: string;
  tokenAddress: Address;
  accountAddress: Address;
  image: string;
  price?: number;
  change24h?: number;
  totalInvested?: number;
  priceHistory?: { timestamp: number; price: number }[];
  metrics?: {
    [key: string]: {
      name: string;
      value: number;
      history: number[];
      unit?: string;
      icon: string;
    };
  };
};
