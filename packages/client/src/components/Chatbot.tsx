import axios from 'axios';
import { useRef } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

import { Button } from './ui/button';

type FormData = {
   prompt: string;
};

const Chatbot = () => {
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      reset();
      const { data } = await axios.post('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });
      console.log(data);
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         onKeyDown={onKeyDown}
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
         <textarea
            {...register('prompt', {
               required: true,
               validate: (value) => value.trim().length > 0,
               maxLength: 1000,
            })}
            className="w-full border-0 focus:outline-0 resize-none"
            placeholder="Ask Anything"
            maxLength={1000}
         />
         <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
            <FaArrowUp />{' '}
         </Button>
      </form>
   );
};

export default Chatbot;
