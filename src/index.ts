import { WORDS } from "./words";
import { generateResponsiveLetters } from "./utils/game-helpers";
import { getInitGameState } from "./utils/state";


const startGame = (words: string[], numberOfTasks: number, numberOfWords: number) => {
    const game = getInitGameState(words, numberOfTasks, numberOfWords);

    game.DOM.totalExerciseDOMElement.innerText = String(numberOfTasks)
    game.DOM.totalQuestionDOMElement.innerText = String(numberOfWords)

    const gameLoop = () => {
        if(game.state.remainingWordsInGame.length === 0 || game.state.currentTaskNumber > game.state.totalNumberOfTasks){
            alert("Done")
        } else {
            genTask()
        }
    }

    const genTask = () => {
        game.state.remainingWordsInTask = game.state.remainingWordsInGame.splice(0,numberOfWords)
        game.DOM.currExerciseDOMElement.innerText = String(++game.state.currentTaskNumber)
        genWord()
    }

    const genWord = () => {
        if(game.state.remainingWordsInTask.length === 0){
            game.state.currentQuestionNumber = 0
            gameLoop()
        } else {
            game.DOM.currQuestionDOMElement.innerText = String(++game.state.currentQuestionNumber);
            generateResponsiveLetters(game, genWord)
        }
    }

    gameLoop()
}


startGame(WORDS, 3, 2)