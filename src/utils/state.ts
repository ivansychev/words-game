import { shuffle } from "./utils";
import { WORDS } from "../words";

export type GameState = {
    DOM: DOM,
    state: State
}

type DOM = {
    currExerciseDOMElement: HTMLElement
    currQuestionDOMElement: HTMLElement
    totalExerciseDOMElement: HTMLElement
    totalQuestionDOMElement: HTMLElement
    lettersDOMElement: HTMLElement
    answerDOMElement: HTMLElement
    currentPendingLetterElements: HTMLElement[]
    currentGuessedLetterElements: HTMLElement[]
}

type State = {
    currentTaskNumber: number
    currentQuestionNumber: number
    totalNumberOfTasks: number
    totalNumberOfWords: number
    remainingWordsInTask: string[]
    remainingWordsInGame: string[]
    solvedWords: string[]
    currentGuess: GuessState
}

type GuessState = {
    currentWord: string
    currentAnswer: string
}

export const getInitGameState = (words: string[], numberOfTasks: number, numberOfWords: number): GameState => ({
    DOM: {
        currExerciseDOMElement: document.getElementById('current_exercise'),
        currQuestionDOMElement: document.getElementById('current_question'),
        totalExerciseDOMElement: document.getElementById('total_exercises'),
        totalQuestionDOMElement: document.getElementById('total_questions'),
        lettersDOMElement: document.getElementById('letters'),
        answerDOMElement: document.getElementById('answer'),
        currentPendingLetterElements: [],
        currentGuessedLetterElements: []
    },
    state: {
        currentTaskNumber: 0,
        currentQuestionNumber: 0,
        totalNumberOfTasks: numberOfTasks,
        totalNumberOfWords: numberOfWords,
        remainingWordsInTask: [],
        remainingWordsInGame: shuffle(Array.from(WORDS, (word) => word.toLowerCase())),
        solvedWords: [],
        currentGuess: {
            currentWord: '',
            currentAnswer: ''
        }
    }
})