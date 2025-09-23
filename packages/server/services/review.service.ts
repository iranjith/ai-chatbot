import { type Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      // get 10 most recent reviews for the product
      // send them to OpenAI for summarization
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');

      // Placeholder implementation for summarization
      return `Summarization for product ID ${productId} is not yet implemented.`;
   },
};
