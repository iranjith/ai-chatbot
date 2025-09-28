import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';
import summarizePrompt from '../llm/prompts/summarize-reviews.txt';

const openAiClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});
const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

type GenerateTextOptions = {
   model?: string;
   instructions?: string;
   prompt: string;
   temperature?: number;
   maxTokens?: number;
   previousResponseId?: string;
};

type GenerateTextResult = {
   id: string;
   text: string;
};

export const llmClient = {
   async generateText({
      prompt,
      instructions,
      model = 'gpt-4.1',
      temperature = 0.2,
      maxTokens = 300,
      previousResponseId,
   }: GenerateTextOptions): Promise<GenerateTextResult> {
      const resopnse = await openAiClient.responses.create({
         model,
         input: prompt,
         instructions,
         temperature,
         max_output_tokens: maxTokens,
         previous_response_id: previousResponseId,
      });
      return {
         id: resopnse.id,
         text: resopnse.output_text,
      };
   },

   async summarizeReviews(review: string) {
      const chatCompletion = await inferenceClient.chatCompletion({
         inputs: review,
         model: 'meta-llama/Llama-3.1-8B-Instruct',
         provider: 'nebius',
         messages: [
            {
               role: 'system',
               content: summarizePrompt,
            },
            {
               role: 'user',
               content: review,
            },
         ],
      });
      return (
         chatCompletion.choices[0]?.message.content || 'No summary generated.'
      );
   },
};
