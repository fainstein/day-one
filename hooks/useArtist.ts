import { Artist } from "@/lib/mock-data-provider";
import useLensAccount from "./useLensAccount";
import { Address } from "viem";

const DUMMY_TOKEN_SYMBOL = "DAY1";
const DUMMY_PRICE = 1;
const DUMMY_CHANGE_24H = 10;
const DUMMY_NET_WORTH = 1000000;
const DUMMY_PRICE_HISTORY = [
  {
    timestamp: Date.now(),
    price: DUMMY_PRICE,
  },
];

const DUMMY_METRICS = {};

export default function useArtist(accountAddress: Address): Artist {
  const { account } = useLensAccount(accountAddress, true);
  console.log("account", account, accountAddress);
  const artist: Artist = {
    id: accountAddress,
    name: account?.metadata?.name || "",
    image: account?.metadata?.picture || "",
    tokenSymbol: DUMMY_TOKEN_SYMBOL,
    price: DUMMY_PRICE,
    change24h: DUMMY_CHANGE_24H,
    totalInvested: DUMMY_NET_WORTH,
    accountAddress: accountAddress,
    priceHistory: DUMMY_PRICE_HISTORY,
    metrics: DUMMY_METRICS,
  };

  return artist;
}
