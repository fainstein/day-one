import type { FragmentOf } from "@lens-protocol/react";

import { AccountFragment, AccountMetadataFragment } from "./accounts";

declare module "@lens-protocol/react" {
  export interface Account extends FragmentOf<typeof AccountFragment> {}
  export interface AccountMetadata
    extends FragmentOf<typeof AccountMetadataFragment> {}
}

export const fragments = [AccountFragment, AccountMetadataFragment];
