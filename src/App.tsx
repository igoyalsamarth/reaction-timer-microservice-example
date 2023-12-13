import { ReactionTime, Analytics } from "./ReactionTimer";
//import {ReactionTime} from '@goyalsamarth/reaction-time-microservice'
import { useState } from "react";

function App() {
  const [reactionTimeState, setReactionTimeState] = useState<number>(0);

  return (
    <>
      {/*<ReactionTime onReactionTimeChange={setReactionTime}>
      test
      <p>{reactionTime}</p>
    </ReactionTime>*/}
      <ReactionTime className='flex flex-col items-center w-full h-96' onReactionTimeChange={setReactionTimeState} instructionsClassName="text-2xl">
        <p className="text-2xl font-black">{reactionTimeState}</p>
      </ReactionTime>
      <Analytics onReactionTimeChange={setReactionTimeState} height={300} className="w-[100vw]" />
    </>
  )
}

export default App
