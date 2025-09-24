import { type Review } from '../generated/prisma';
import { llmClient } from '../llm/client';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');

      const prompt = `
         Summarize the following product reviews into a concise paragraph highlighting common themes, pros, and cons:
         ${joinedReviews}
      `;

      const response = await llmClient.generateText({ prompt, maxTokens: 500 });
      return response.text.trim();
   },
};
