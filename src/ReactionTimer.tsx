import { Line } from "@nivo/line";
import { ReactNode, useState } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";


export interface TimerProps {
    waitTime?: number;
    children?: ReactNode;
    className?: string;
    needInstruction?: boolean;
    instructionsClassName?: string
    onReactionTimeChange: React.Dispatch<React.SetStateAction<number>>
}

export interface AnalyticsProps {
    onReactionTimeChange: React.Dispatch<React.SetStateAction<number>>
    height:number
    width:number
}

export interface SingleAttempt {
    reactionTime: number;
    testTime: number;
}

export interface Database {
    latestAttempt: SingleAttempt;
    listOfAttempts: Array<SingleAttempt>;
    bestAttempts: Array<SingleAttempt>;
    averageOfAllAttemps: number;
}

export function ReactionTime(props: TimerProps): JSX.Element {
    const [databaseState, setDatabaseState] = useState<Database>(() => {
        const value = localStorage.getItem('rt_database'); return value !== null ? JSON.parse(value) :
            {
                latestAttempt: {},
                listOfAttempts: [],
                bestAttempts: [],
                averageOfAllAttemps: 0
            }
    })
    const [reactionState, setReactionState] = useState<number>(0)
    const [startTime, setStartTime] = useState<number>(0)
    const [instruction, setInstruction] = useState<string>('Click the box when Red Turns Green')
    const [localReactionTime, setLocalReactionTime] = useState<number>(0)
    const [timeoutState, setTimeoutState] = useState<NodeJS.Timeout | undefined>(undefined)

    const waitTimeInner = !props.waitTime ? 5000 : props.waitTime

    const handleReactionState = () => {
        if (reactionState === 0) {
            setReactionState(1);
            setInstruction('wait for it')
            setTimeoutState(setTimeout(() => { setReactionState(2); setStartTime(Date.now()); setInstruction('press now!') }, Math.floor(Math.random() * (waitTimeInner - 1000 + 1) + 1000)))
        } else if (reactionState === 1) {
            clearTimeout(timeoutState)
            props.onReactionTimeChange(0)
            setInstruction('You Pressed Early')
            setReactionState(0)
        } else {
            setLocalReactionTime(Date.now() - startTime)
            props.onReactionTimeChange((Date.now() - startTime))
            setInstruction('Nice Job!')
            if (localReactionTime > 0) {
                setDatabaseState({
                    latestAttempt: { reactionTime: localReactionTime, testTime: Date.now() },
                    listOfAttempts: [...databaseState.listOfAttempts, { reactionTime: localReactionTime, testTime: Date.now() }],
                    averageOfAllAttemps: databaseState.listOfAttempts.map(Item => Item.reactionTime).reduce(function (avg, value, _, { length }) {
                        return avg + value / length;
                    }, 0),
                    bestAttempts: [...databaseState.bestAttempts]
                })
                localReactionTime < Math.min(...databaseState.bestAttempts.map(Item => Item.reactionTime)) ?
                    setDatabaseState(
                        {
                            ...databaseState,
                            bestAttempts: [...databaseState.bestAttempts, { reactionTime: localReactionTime, testTime: Date.now() }]
                        }) : null
            }
            setReactionState(0)
        }
    }

    useEffect(() => {
        localStorage.setItem('rt_database', JSON.stringify(databaseState))
    }, [databaseState]);

    return (
        <div className={`${props.className} ${reactionState === 0 || reactionState === 4 ? 'bg-cyan-500' : reactionState === 1 ? 'bg-red-500' : 'bg-green-500'}`} onClick={() => handleReactionState()}>
            <p className={props.instructionsClassName}>{instruction}</p>
            {localReactionTime}
            {props.children}
        </div>
    );
}

export function Analytics(props: AnalyticsProps) {

    const [reactionData, setReactionData] = useState<Database>(() => {
        const value = localStorage.getItem('rt_database'); return value !== null ? JSON.parse(value) :
            {
                latestAttempt: {},
                listOfAttempts: [],
                bestAttempts: [],
                averageOfAllAttemps: 0
            }
    })
    useEffect(() => {
        setReactionData(() => {
            const value = localStorage.getItem('rt_database'); return value !== null ? JSON.parse(value) :
                {
                    latestAttempt: {},
                    listOfAttempts: [],
                    bestAttempts: [],
                    averageOfAllAttemps: 0
                }
        })
    }, [props.onReactionTimeChange]);
    console.log(reactionData)
    return (
        <div className="flex w-[100vw]">
            <Line
            
                data={[
                    {
                        color: 'hsl(111, 70%, 50%)',
                        id: "Reaction Time",
                        data: reactionData.listOfAttempts.map(Item => {return({y:Item.reactionTime, x:dayjs(Item.testTime).format('hh:mm:ss')})})
                    },{
                        id:'Best Results',
                        data: reactionData.bestAttempts.map(Item => {return({y:Item.reactionTime, x:dayjs(Item.testTime).format('hh:mm:ss')})})
                    }
                ]}
                markers={[
                    {
                        axis: 'y',
                        value: reactionData.averageOfAllAttemps,
                        legend: 'Average',
                        lineStyle: {
                            stroke: 'red',
                        },
                        textStyle: {
                            fill: 'red',
                        },
                    },
                ]}
                lineWidth={6}
                crosshairType="cross"
                curve='linear'
                enableSlices="x"
                height={props.height}
                margin={{
                    bottom: 60,
                    left: 80,
                    right: 20,
                    top: 20
                }}
                width={props.width}
                        />
        </div>
    );
}


