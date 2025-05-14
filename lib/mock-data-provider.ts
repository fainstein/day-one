import { Address } from "viem";

export type Artist = {
  id: string;
  name: string;
  tokenSymbol: string;
  image: string;
  price: number;
  change24h: number;
  totalInvested: number;
  accountAddress: Address;
  priceHistory: { timestamp: number; price: number }[];
  tokenAddress: Address;
  metrics: {
    [key: string]: {
      name: string;
      value: number;
      history: number[];
      unit?: string;
      icon: string;
    };
  };
};
