import { useState } from "react";

export default function ReactionTime(){
    const [reactionState, setReactionState] = useState<number>(0)
    const [startTime, setStartTime] = useState<number>(0)
    const [timeDifference, setTimeDifference] = useState<number>(0)
    const [timeoutState, setTimeoutState] = useState<NodeJS.Timeout | undefined>(undefined)
    const waitTime:number = 5000

    const handleReactionState = () => {
        if(reactionState === 0){
            setReactionState(1)
            const timer:NodeJS.Timeout = setTimeout(() => {setReactionState(2);setStartTime(Date.now())},Math.floor(Math.random() * (waitTime - 1000 + 1) + 1000))
            setTimeoutState(timer)
        }
        else if(reactionState === 1){
            clearTimeout(timeoutState)
            setReactionState(0)
        }
        else{
            setTimeDifference((Date.now() - startTime))
            setReactionState(0)
        }
    }

    return(
        <div className={`flex flex-col items-center w-full h-full ${reactionState === 0 || reactionState === 4 ? 'bg-cyan-500': reactionState === 1 ? 'bg-red-500': 'bg-green-500'}`} onClick={()=> handleReactionState()}>
        <p className="">Click when Red turns Green</p>
        {reactionState === 0 ? <div className="flex w-full h-12 justify-center"> {!timeDifference? '': timeDifference}</div>:<div className="flex w-full h-12"></div>}
      </div>
    );
}