import { getInitGameState, initState, initStats } from "./utils/state";
import { setCurrentExercise, setCurrentQuestion, setTotalExercises, setTotalQuestions } from "./ui/info-ui";
import { getCurrentQuestionNumber, getCurrentTaskNumber } from "./utils/utils";
import { parseStats } from "./utils/stats-helpers";
import { displayStats } from "./ui/stats-ui";
import { startCurrentQuestion } from "./utils/game-helpers";

export const startGame = (words: string[], numberOfTasks: number, numberOfWords: number, storageInit: boolean) => {
    const game = storageInit
        ? getInitGameState(
            JSON.parse(sessionStorage.getItem('game-state')),
            JSON.parse(sessionStorage.getItem('stats-state'))
        )
        : getInitGameState(
            initState(words, numberOfTasks, numberOfWords),
            initStats()
        )

    const { state } = game

    setTotalExercises(game, numberOfTasks)
    setTotalQuestions(game, numberOfWords)

    const gameLoop = () => {
        if(state.remainingWordsInGame.length === 0 || getCurrentTaskNumber(state) > state.totalNumberOfTasks){
            sessionStorage.clear()
            const stats = parseStats(game)
            displayStats(game, stats)
        } else {
            genTask()
        }
    }

    const genTask = () => {
        state.remainingWordsInTask = game.state.remainingWordsInGame.splice(0,numberOfWords)
        genWord()
    }

    const genWord = () => {
        if(state.remainingWordsInTask.length === 0){
            gameLoop()
        } else {
            setCurrentExercise(game, getCurrentTaskNumber(state))
            setCurrentQuestion(game, getCurrentQuestionNumber(state))
            startCurrentQuestion(game, genWord)
        }
    }

    if(storageInit){
        genWord()
    } else {
        gameLoop()
    }
}