import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

import { Button } from './ui/button';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

type Message = {
   content: string;
   role: 'user' | 'bot';
};

const Chatbot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const formRef = useRef<HTMLFormElement | null>(null);
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   useEffect(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);

      reset();
      const { data } = await axios.post<ChatResponse>('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
      setIsBotTyping(false);
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-3 mb-10">
            {messages.map((msg, index) => (
               <p
                  key={index}
                  className={`px-3 py-1 rounded-xl ${
                     msg.role === 'user'
                        ? 'bg-blue-600 text-white self-end'
                        : 'bg-gray-100 text-black self-start'
                  }`}
               >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
               </p>
            ))}
            {isBotTyping && (
               <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-125"></div>
               </div>
            )}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            ref={formRef}
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
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />{' '}
            </Button>
         </form>
      </div>
   );
};

export default Chatbot;
