const TypingIndicator = () => {
   return (
      <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl">
         <Dot delaySeconds={75} />
         <Dot delaySeconds={100} />
         <Dot delaySeconds={124} />
      </div>
   );
};

type DotProps = {
   delaySeconds: number;
};

const Dot = ({ delaySeconds }: DotProps) => (
   <div
      className={`w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-${delaySeconds}`}
   ></div>
);

export default TypingIndicator;
