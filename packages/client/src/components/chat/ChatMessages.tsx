import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
   content: string;
   role: 'user' | 'bot';
};
type Props = {
   messages: Message[];
};

const onCopyMessage = (e: React.ClipboardEvent) => {
   const selection = window.getSelection()?.toString().trim();
   if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
   }
};

const ChatMessages = ({ messages }: Props) => {
   const lastDivRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      lastDivRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   return (
      <div className="flex flex-col gap-3">
         {messages.map((msg, index) => (
            <div
               key={index}
               ref={index === messages.length - 1 ? lastDivRef : null}
               onCopy={onCopyMessage}
               className={`px-3 py-1 rounded-xl ${
                  msg.role === 'user'
                     ? 'bg-blue-600 text-white self-end'
                     : 'bg-gray-100 text-black self-start'
               }`}
            >
               <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
         ))}
      </div>
   );
};

export default ChatMessages;
