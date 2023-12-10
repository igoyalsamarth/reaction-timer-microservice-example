//import { ReactionTime } from "./ReactionTimer";
import {ReactionTime} from '@goyalsamarth/reaction-time-microservice'
import { useState } from "react";

function App() {
  const [reactionTime, setReactionTime] = useState<number>(0);

  return (
    <>
    <ReactionTime onReactionTimeChange={setReactionTime}>
      test
      <p>{reactionTime}</p>
    </ReactionTime>
    {/*<ReactionTime className='flex flex-col items-center w-full h-96' onReactionTimeChange={setReactionTime} instructionsClassName="text-2xl">
      <p className="text-2xl font-black">{reactionTime}</p>
  </ReactionTime>*/}
  </>
  )
}

export default App
