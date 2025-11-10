import OpenAI from "openai";
import config from ".";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.open_router.api_key,
});

export default openai;
