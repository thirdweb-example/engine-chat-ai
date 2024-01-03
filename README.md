This is a ChatGPT generated text adventure game called **The Quest for the Three Keys** where players are sent on a quest to find three keys in the enchanted forest.  When a player finds a key the LLM rewards the player by minting an NFT.

## Components Used

* [thirdweb Embedded Wallets](https://portal.thirdweb.com/embedded-wallet)
* [thirdweb Engine](https://portal.thirdweb.com/engine)
* [Vercel AI](https://vercel.com/ai)
* [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)

## Getting Started

Install packages:

```bash
yarn install
# or
npm install
```

## Environment Variables

As outlined in `.env.example` file:

* OPENAI_API_KEY - your API key from OpenAI
* THIRDWEB_ENGINE_URL - URL for thirdweb Engine
* THIRDWEB_ENGINE_ACCESS_TOKEN - access token [created](https://portal.thirdweb.com/engine/authentication#create-an-access-token) on thirdweb Dashboard
* NEXT_PUBLIC_THIRDWEB_CLIENT_ID - thirdweb client API key with embedded wallets enabled

## Smart Contract Setup

An [Edition](https://thirdweb.com/thirdweb.eth/TokenERC1155) contract should be deployed to the Arbitrum Sepolia blockchain minted with token id 0 a "Crimson" key, token id 1 an "Azure" key and token id 2 a "Golden" key ( [example contract](https://thirdweb.com/arbitrum-sepolia/0x55FC5F6EbCd258aFc8958b897cC0f8cb054a0c10/nfts) )

Once deployed two constants should be updated in the `lib/constants.ts` file:

* KEYS_SMART_CONTRACT_ADDRESS - the address of your Edition smart contract
* ENGINE_MINTER_WALLET_ADDRESS - the address of the Engine backend wallet that has `MINTER` role on smart contract

## Running the App

To run:

```bash
yarn dev
# or
npm run dev
```

## Learn More

To learn more about thirdweb, take a look at the following resources:

- [thirdweb Documentation](https://portal.thirdweb.com) - learn about thirdweb's web3 developer tools
- [thirdweb Embedded Wallets](https://thirdweb.com/embedded-wallets) 
