import { OpenAI } from "openai";
import {
  OpenAIStream,
  StreamingTextResponse,
} from "ai";

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
    In this game, the setting is a magical forest where each player is on a scavenger hunt trying to find three different keys where if they find all of them they will be able to use those keys to open a treasure chest.
    The first thing you will receive from the user is their name and the first thing you should do is welcome them and describe the goal of the game and then describe the forest to them and ask them what they want to do.`,
  };
  
  const combinedMessages = [context, ...messages];
   
    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      stream: true,
      messages: combinedMessages,
    });
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  };

  export default handler;