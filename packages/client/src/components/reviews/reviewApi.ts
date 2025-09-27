import axios from 'axios';

export type Review = {
   id: string;
   content: string;
   rating: number;
   author: string;
   createdAt: string;
};

export type GetReviewsResponse = {
   reviews: Review[];
   summary: string | null;
};

export type SummarizeResponse = {
   summary: string;
};

export const reviewsApi = {
   async fetchReviews(productId: number) {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   },

   async summarizeReviews(productId: number) {
      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/reviews/summarize`
      );
      return data;
   },
};
