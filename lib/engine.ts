import { ChatCompletionCreateParams} from "openai/resources/chat/index.mjs";
import {KEYS_SMART_CONTRACT_ADDRESS, CHAIN} from "./constants";
import { Engine } from "@thirdweb-dev/engine";

export const functions: ChatCompletionCreateParams.Function[] = [
    {
      name: "check_keys_balance",
      description:
        "Function that checks the balance of magic keys currently held by a player",
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

        const redKeyBalance = engine.erc1155.balanceOf(address, "0", CHAIN, KEYS_SMART_CONTRACT_ADDRESS);
        const blueKeyBalance = engine.erc1155.balanceOf(address, "1", CHAIN, KEYS_SMART_CONTRACT_ADDRESS);
        const goldKeyBalance = engine.erc1155.balanceOf(address, "2", CHAIN, KEYS_SMART_CONTRACT_ADDRESS);

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

  export async function executeFunction(name: string, args: any) {
    console.log("Executing function: " + name + " with args: " + JSON.stringify(args));
    switch (name) {
      case "check_keys_balance":
        return await check_keys_balance(args["address"]);
      default:
        return null;
    }
  }