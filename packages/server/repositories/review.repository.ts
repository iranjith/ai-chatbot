import dayjs from 'dayjs';
import { PrismaClient, type Review } from '../generated/prisma';

const prisma = new PrismaClient();
export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      const reviews = await prisma.review.findMany({
         where: { productId }, // Filter reviews by productId
         orderBy: { createdAt: 'desc' }, // Order by creation date descending
         take: limit, // Limit the number of reviews if a limit is provided
      });

      return reviews;
   },

   storeReviewSummary(productId: number, summary: string) {
      const now = new Date();
      const expiresAt = dayjs(now).add(7, 'days').toDate();

      const data = {
         content: summary,
         expiresAt,
         generatedAt: now,
         productId,
      };
      return prisma.summary.upsert({
         where: { productId },
         create: data,
         update: data,
      });
   },

   getReviewSummmary(productId: number) {
      return prisma.summary.findUnique({
         where: { productId },
      });
   },
};
