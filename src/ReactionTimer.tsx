import { ReactNode, useState } from "react";

interface TimerProps {
    waitTime?: number | undefined
    children: ReactNode
    className? : string
}

export function ReactionTime(props: TimerProps) {
    const [reactionState, setReactionState] = useState<number>(0)
    const [startTime, setStartTime] = useState<number>(0)
    const [timeoutState, setTimeoutState] = useState<NodeJS.Timeout | undefined>(undefined)
    const [timeDifference, setTimeDifference] = useState<number | undefined>(undefined)

    const waitTimeInner = !props.waitTime ? 5000 : props.waitTime

    const handleReactionState = () => {
        if (reactionState === 0) {
            setReactionState(1)
            setTimeoutState(setTimeout(() => { setReactionState(2); setStartTime(Date.now()) }, Math.floor(Math.random() * (waitTimeInner - 1000 + 1) + 1000)))
        }
        else if (reactionState === 1) {
            clearTimeout(timeoutState)
            setTimeDifference(undefined)
            setReactionState(0)
        }
        else {
            setTimeDifference((Date.now() - startTime))
            setReactionState(0)
        }
    }

    return (
        <div className={`${props.className} ${reactionState === 0 || reactionState === 4 ? 'bg-cyan-500' : reactionState === 1 ? 'bg-red-500' : 'bg-green-500'}`} onClick={() => handleReactionState()}>
            <p>Reaction Time:{timeDifference}</p>
            {props.children}
        </div>
    );
}


