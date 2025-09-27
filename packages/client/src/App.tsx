import './App.css';
import ReviewList from './components/reviews/ReviewList';

function App() {
   return (
      <div className="p-4 h-screen w-full">
         {/* <Chatbot /> */}
         <ReviewList productId={1} />
      </div>
   );
}

export default App;
