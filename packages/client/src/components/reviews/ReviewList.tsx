import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { HiSparkles } from 'react-icons/hi';
import { Button } from '../ui/button';
import ReviewSkeleton from './ReviewSkeleton';
import StarRating from './StarRating';

type Props = {
   productId: number;
};

type Review = {
   id: string;
   content: string;
   rating: number;
   author: string;
   createdAt: string;
};

type GetReviewsResponse = {
   reviews: Review[];
   summary: string | null;
};

type SummarizeResponse = {
   summary: string;
};

const ReviewList = ({ productId }: Props) => {
   const summaryMutation = useMutation<SummarizeResponse>({
      mutationFn: () => summarizeReviews(),
   });

   const reviewsQuery = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const summarizeReviews = async () => {
      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/reviews/summarize`
      );
      return data;
   };

   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   if (reviewsQuery.isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((p) => (
               <ReviewSkeleton key={p} />
            ))}
         </div>
      );
   }

   if (reviewsQuery.isError) {
      return <div className="text-red-500">{reviewsQuery.error.message}</div>;
   }

   if (reviewsQuery.data?.reviews.length === 0) {
      return <div>No reviews available.</div>;
   }

   const currentSummary =
      reviewsQuery.data?.summary || summaryMutation.data?.summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => summaryMutation.mutate()}
                     disabled={summaryMutation.isPending}
                     className="cursor-pointer"
                  >
                     <HiSparkles /> Summarize
                  </Button>
                  {summaryMutation.isPending && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summaryMutation.isError && (
                     <div className="text-red-500 mt-2">
                        Could not summarize reviews. Try again.s
                     </div>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewsQuery.data?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarRating value={review.rating} />
                  </div>
                  <p className="py-2">{review.content}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
