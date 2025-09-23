import { PrismaClient, type Review } from '../generated/prisma';

export const reviewRepository = {
   async getReviews(productId: number): Promise<Review[]> {
      const prisma = new PrismaClient();

      const reviews = await prisma.review.findMany({
         where: { productId }, // Filter reviews by productId
         orderBy: { createdAt: 'desc' }, // Order by creation date descending
      });

      return reviews;
   },
};
