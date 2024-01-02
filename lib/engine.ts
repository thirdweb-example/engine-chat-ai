import { ChatCompletionCreateParams} from "openai/resources/chat/index.mjs";
import {KEYS_SMART_CONTRACT_ADDRESS, CHAIN, ENGINE_MINTER_WALLET_ADDRESS } from "./constants";
import { Engine } from "@thirdweb-dev/engine";

export const functions: ChatCompletionCreateParams.Function[] = [
    {
      name: "check_keys_balance",
      description:
        "Function that figures out the number of magic keys currently held by a player",
      parameters: {
        type: "object",
        properties: {
          address: {
            type: "string",
            description: "The wallet address of the player",
          },
        },
        required: ["address"],
      },
    },
    {
        name: "send_key_to_player_wallet",
        description:
          "Function that sends a key to a player's wallet when the player finds a key in the game",
        parameters: {
          type: "object",
          properties: {
            address: {
              type: "string",
              description: "The wallet address of the player",
            },
            keyColor: {
              type: "string",
              description: "The color of the key to send to the player",
            },
          },
          required: ["address", "keyColor"],
        },
      },
  ];

  // helper function to check the balance of magic keys held by a player
  async function check_keys_balance(address: string) {
    console.log("Checking balance for address: " + address);

    try {
        // create Engine connection
        const engine = new Engine({
            url: process.env.THIRDWEB_ENGINE_URL as string,
            accessToken: process.env.THIRDWEB_ENGINE_ACCESS_TOKEN as string,
        });

        const redKeyBalance = await engine.erc1155.balanceOf(address, "0", CHAIN, KEYS_SMART_CONTRACT_ADDRESS);
        const blueKeyBalance = await engine.erc1155.balanceOf(address, "1", CHAIN, KEYS_SMART_CONTRACT_ADDRESS);
        const goldKeyBalance = await engine.erc1155.balanceOf(address, "2", CHAIN, KEYS_SMART_CONTRACT_ADDRESS);

        return JSON.stringify({ status: 'success', data: {
            redKeyBalance: redKeyBalance,
            blueKeyBalance: blueKeyBalance,
            goldKeyBalance: goldKeyBalance,
        } });
    } catch (e) {
        console.error(e);
        return JSON.stringify({ status: 'error', e });
    }

  }

    // helper function to send a key to a player's wallet when the player finds a key in the game
    async function send_key_to_player_wallet(address: string, keyColor: string) {
        console.log("Sending key: " + keyColor + " to address: " + address);

        // convert key color to token id
        let tokenId; 
        if(keyColor.toLowerCase().includes("crimson")) {
            tokenId = "0";
        } else if(keyColor.toLowerCase().includes("azure")) {
            tokenId = "1";
        } else if(keyColor.toLowerCase().includes("gold")) {
            tokenId = "2";
        } else {
            return JSON.stringify({ status: 'error', e: "Invalid key color: " + keyColor });
        }
    
        try {
            // create Engine connection
            const engine = new Engine({
                url: process.env.THIRDWEB_ENGINE_URL as string,
                accessToken: process.env.THIRDWEB_ENGINE_ACCESS_TOKEN as string,
            });
    
            const result = await engine.erc1155.mintAdditionalSupplyTo(
                CHAIN, 
                KEYS_SMART_CONTRACT_ADDRESS, 
                ENGINE_MINTER_WALLET_ADDRESS,
                {
                    receiver: address,
                    tokenId: tokenId,
                    additionalSupply: "1",
                });

            return JSON.stringify({ status: 'success', data: {
                result: result.result.queueId,
            } });
        } catch (e) {
            console.error(e);
            return JSON.stringify({ status: 'error', e });
        }
    
      }

  export async function executeFunction(name: string, args: any) {
    console.log("Executing function: " + name + " with args: " + JSON.stringify(args));
    switch (name) {
      case "check_keys_balance":
        return await check_keys_balance(args["address"]);
      case "send_key_to_player_wallet":
        return await send_key_to_player_wallet(args["address"], args["keyColor"]);
      default:
        return null;
    }
  }