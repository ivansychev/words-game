import { WORDS } from "./words";
import { generateResponsiveLetters } from "./utils/game-helpers";
import { getInitGameState } from "./utils/state";
import { displayStats } from "./ui/stats-ui";
import { parseStats } from "./utils/stats-helpers";
import {setCurrentExercise, setCurrentQuestion, setTotalExercises, setTotalQuestions} from "./ui/info-ui";


const startGame = (words: string[], numberOfTasks: number, numberOfWords: number) => {
    const game = getInitGameState(words, numberOfTasks, numberOfWords)
    const { state } = game

    setTotalExercises(game, numberOfTasks)
    setTotalQuestions(game, numberOfWords)

    const gameLoop = () => {
        if(state.remainingWordsInGame.length === 0 || state.currentTaskNumber > state.totalNumberOfTasks){
            console.log(game)
            const stats = parseStats(game)
            displayStats(game, stats)
        } else {
            genTask()
        }
    }

    const genTask = () => {
        state.remainingWordsInTask = game.state.remainingWordsInGame.splice(0,numberOfWords)
        setCurrentExercise(game, ++game.state.currentTaskNumber)
        genWord()
    }

    const genWord = () => {
        if(state.remainingWordsInTask.length === 0){
            state.currentQuestionNumber = 0
            gameLoop()
        } else {
            setCurrentQuestion(game, ++state.currentQuestionNumber)
            generateResponsiveLetters(game, genWord)
        }
    }

    gameLoop()
}


startGame(WORDS, 3, 2)