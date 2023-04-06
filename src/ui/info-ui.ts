import { GameState } from "../utils/state";

export const setTotalExercises = (game: GameState, numberOfTasks: number) => {
    game.DOM.totalExerciseDOMElement.innerText = String(numberOfTasks)
}

export const setTotalQuestions = (game: GameState, numberOfWords: number) => {
    game.DOM.totalQuestionDOMElement.innerText = String(numberOfWords)
}

export const setCurrentExercise = (game: GameState, number: number) => {
    game.DOM.currExerciseDOMElement.innerText = String(number)
}

export const setCurrentQuestion = (game: GameState, number: number) => {
    game.DOM.currQuestionDOMElement.innerText = String(number)
}