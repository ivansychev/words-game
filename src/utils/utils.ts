import { State } from "./state";


export const shuffle = <T>(arr: T[]): T[] =>
    arr
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);

export const getCurrentQuestionNumber = (state: State) => {
    return state.totalNumberOfWords - state.remainingWordsInTask.length + 1
}

export const getCurrentTaskNumber = (state: State) => {
    return (state.totalNumberOfWords * state.totalNumberOfTasks - state.remainingWordsInGame.length) / state.totalNumberOfWords
}