# Day One Frontend

An interactive marketplace for **Day One** artists built on Lens Protocol.

---

## 🚀 Overview

Day One allows artists to tokenize their growth metrics as ERC-20 tokens, and fans to buy, sell and follow based on those tokens. This frontend provides:

- Full integration with Lens Protocol primitives: accounts, follows, token‐gated follow rules, and metadata.
- A simple marketplace: mint and burn ArtistTokens by sending GHO to the artist's Lens Account.

---

## 🔧 Key Primitives

1. **Lens Accounts**

   - Every user and artist has a Lens Account.
   - Buying/selling tokens happens _from_ and _to_ these Accounts.
   - Artist profiles (avatar, username, bio, etc.) live in the Account metadata, along with a `token` attribute pointing to their ERC-20 address.

2. **Follow & Token-Gated Follow Rule**

   - We wire up Lens' **TokenGatedGraphRule** so that **only holders** of ≥ 1 ArtistToken can follow that artist's profile.
   - Follows are executed _on your custom Graph_ using the Lens SDK.

3. **ArtistToken in Metadata**
   - Each artist's Lens Account metadata includes a `token` attribute (the ERC-20 address).
   - Frontend reads this to drive buy/sell and follow gating.

---

## 🛠️ Web3 Tech Stack

- **ConnectKit + Family + Wagmi** — Wallet connection UI & hooks
- **@lens-protocol** — Lens SDK for auth, account creation, follows, Graph & actions
- **viem** — Low-level Ethereum primitives

---

## 📦 Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure `.env`**

   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
   ```

3. **Run locally**

   ```bash
   pnpm dev
   ```

4. **Build & deploy**

   ```bash
   pnpm build
   pnpm start
   ```

---

## 🌐 Deployments

| Component           | Address                                      |
| ------------------- | -------------------------------------------- |
| **Token Factory**   | `0xd92b0FC2c414BD4484ffaC0F6b89BAe85aabDD43` |
| **Price Engine**    | `0x8Aa88f77B0828b1881f4eb5c4FF9B25679A30CE4` |
| **Artist Accounts** |                                              |
| DOECHII             | `0x32cB946b47e36bc2c35E8Fa9571656216f35C5f6` |
| DAVINCI             | `0x85E2079d2F69407dD86B3D871329b382153Bb595` |
| **Artist Tokens**   |                                              |
| DOECHII             | `0x94317bB1Bf44cAd9719BbA91fdeb7dcF2aaE34b3` |
| DAVINCI             | `0x8AbFa9E9aa3531B976e9F078524eb402c981fE5D` |
| **Actions**         |                                              |
| Buy Artist Token    | `0xDa5e635C89dF6e207d167E2311024dA7e4831654` |
| Sell Artist Token   | `0xd75Bf44D044891bF65ecaba47ED65df903124F7B` |

---

## 💡 Feedback & Improvements

During development we explored Lens' **Custom Account Actions** for Buy & Sell flows:

- **Action approach**: Deploy `BuyArtistTokenAction` & `SellArtistTokenAction`, add them as managers on artist Accounts, and have each user execute them.
- **Blocker 1**: The Lens SDK currently does **not** support sending a custom `value` (GHO) in Account Actions the same way as native ETH in other EVMs.
  _Discussed on Discord:_
  [https://discord.com/channels/918178320682733648/1372008378351747172](https://discord.com/channels/918178320682733648/1372008378351747172)
- **Blocker 2**: Adding a custom action caused Lens' GraphQL API to return **502 errors**, making that Account unusable.
  _Bug report & follow-up:_
  [https://discord.com/channels/918178320682733648/1373051686427557978](https://discord.com/channels/918178320682733648/1373051686427557978)

**Workaround**: We fell back to a hybrid model:

- Use Lens SDK for account creation, authentication, follows & graph operations (works flawlessly).
- For mint/burn of ArtistTokens, we build raw transactions from our EOA to the user's smart account, that points to the ERC-20 ArtistToken.

⚙️ **Next steps**:

- Migrate back to a pure Account Actions approach once:

  1. Lens SDK supports custom `value` in Account Actions.
  2. The GraphQL 502 bug is resolved (Done).

We love Lens' extensibility—these improvements would unlock a truly seamless, signless UX for Day One's token marketplace!

---

> Day One is an experimental platform. Feedback and contributions welcome!
