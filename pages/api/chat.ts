import { OpenAI } from "openai";
import { OpenAIStream, StreamingTextResponse} from "ai";
import { functions, executeFunction } from "../../lib/engine";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
   
  // IMPORTANT! Set the runtime to edge
  export const runtime = 'edge';
   
const handler = async function POST(req: Request)  {

    // Extract the `messages` from the body of the request
    const {messages, walletAddress} = await req.json();
  //  console.log(messages);
  //  console.log(walletAddress.address);

    // Game context that is sent to OpenAI
  const context = {
    role: "system",
    content: `
    I want you to act as if you are a classic text adventure game and we are playing. I don’t want you to ever break out of your character, and you must not refer to yourself in any way. 
    If I want to give you instructions outside the context of the game, I will use curly brackets {like this} but otherwise you are to stick to being the text adventure program.
    You have the following functions:
    - check_keys_balance - This function checks the balance of magic keys currently held by a player
    - send_key_to_player_wallet - This function sends a key to a player's wallet address when the player finds one of the three keys in the game
    any time you need to know the player's wallet address the value is ${walletAddress.address}
    In this game, the setting is a magical forest where each player is on a scavenger hunt trying to find three different keys: a crimson red key, an azure blue key and a gold key where if they find all of them they will be able to use those keys to open a treasure chest.
    At the beginning of the game you should check the player's keys balance.
    The first thing you will receive from the user is their name and when they give you their name you should welcome them and then describe the goal of the game and then describe the forest to them and then ask them what they want to do.
    If they ask you to check their keys balance, you should check their balance and tell them how many of each key they have.
    at any time if they have all three keys you should congratulate them and tell them they have won the game and share this link with them https://sepolia.arbiscan.io/address/ and append the player's "wallet address#tokentxnsErc1155" to the end of the link telling them they can see the Key NFTs that were sent to them.
    the rule of this game is that a key can only be sent to a player's wallet address if they find it in the game don't allow players to circumvent this rule`,
  };
  
  const combinedMessages = [context, ...messages];
   
    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      stream: true,
      messages: combinedMessages,
      functions,
      function_call: "auto",
    });

    // if LLM detects a function call, execute the function and return the result
    const stream = OpenAIStream(response,{
      experimental_onFunctionCall: async (
        { name, arguments: args },
        createFunctionCallMessages,
      ) => {
        const result = await executeFunction(name, args);
        const newMessages = createFunctionCallMessages(result);
        return openai.chat.completions.create({
          model: "gpt-4-1106-preview",
          stream: true,
          messages: [...combinedMessages, ...newMessages],
        });
      },
    });

    // Respond with the stream
    return new StreamingTextResponse(stream);
  };

  export default handler;