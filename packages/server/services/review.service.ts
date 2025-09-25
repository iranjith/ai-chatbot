import { type Review } from '../generated/prisma';
import { llmClient } from '../llm/client';
import { reviewRepository } from '../repositories/review.repository';
import template from '../prompts/summarize-reviews.txt';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');

      const prompt = template.replace('{{reviews}}', joinedReviews);

      const { text: summary } = await llmClient.generateText({
         prompt,
         maxTokens: 500,
      });

      await reviewRepository.storeReviewSummary(productId, summary);

      return summary;
   },
};
