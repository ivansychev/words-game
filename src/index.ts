import { WORDS } from "./words";
import { startCurrentQuestion } from "./utils/game-helpers";
import { getInitGameState, initState, initStats } from "./utils/state";
import { displayStats } from "./ui/stats-ui";
import { parseStats } from "./utils/stats-helpers";
import { setCurrentExercise, setCurrentQuestion, setTotalExercises, setTotalQuestions } from "./ui/info-ui";
import { getCurrentQuestionNumber, getCurrentTaskNumber } from "./utils/utils";


const startGame = (words: string[], numberOfTasks: number, numberOfWords: number) => {
    const storageInit = sessionStorage.length !== 0

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
        if(state.remainingWordsInGame.length === 0 || state.currentTaskNumber > state.totalNumberOfTasks){
            sessionStorage.clear()
            const stats = parseStats(game)
            displayStats(game, stats)
        } else {
            genTask()
        }
    }

    const genTask = () => {
        state.remainingWordsInTask = game.state.remainingWordsInGame.splice(0,numberOfWords)
        setCurrentExercise(game, getCurrentTaskNumber(state))
        genWord()
    }

    const genWord = () => {
        if(state.remainingWordsInTask.length === 0){
            gameLoop()
        } else {
            setCurrentQuestion(game, getCurrentQuestionNumber(state))
            startCurrentQuestion(game, genWord)
            console.log(game)
        }
    }

    if(storageInit){
        console.log('storage!', game)
        genWord()
    } else {
        gameLoop()
    }
}


startGame(WORDS, 3, 2)