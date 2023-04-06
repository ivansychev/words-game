import { shuffle } from "./utils";


export type DisplayStats = {
    noErrorsWords: number
    totalErrors: number
    mostErrorsWord: {
        words: string[]
        errors: number
    }
}

export type GameState = {
    DOM: DOM,
    state: State,
    stats: Stats
}

export type DOM = {
    infoContainerDOMElement: HTMLElement
    gameContainerDOMElement: HTMLElement
    statsContainerDOMElement: HTMLElement
    currExerciseDOMElement: HTMLElement
    currQuestionDOMElement: HTMLElement
    totalExerciseDOMElement: HTMLElement
    totalQuestionDOMElement: HTMLElement
    lettersDOMElement: HTMLElement
    answerDOMElement: HTMLElement
    currentPendingLettersElements: HTMLElement[]
    currentAnsweredLettersElements: HTMLElement[]
}

export type State = {
    totalNumberOfTasks: number
    totalNumberOfWords: number
    remainingWordsInTask: string[]
    remainingWordsInGame: string[]
    resolvedWords: string[]
    currentGuess: GuessState
}

type GuessState = {
    currentWord: string
    currentAnswer: string
}

export type WordStat = {
    task: number
    question: number
    word: string
    errors: number
}

type Stats = WordStat[]

export const initState = (words: string[], numberOfTasks: number, numberOfWords: number): State => ({
    totalNumberOfTasks: numberOfTasks,
    totalNumberOfWords: numberOfWords,
    remainingWordsInTask: [],
    remainingWordsInGame: shuffle(Array.from(words, (word) => word.toLowerCase())),
    resolvedWords: [],
    currentGuess: {
        currentWord: '',
        currentAnswer: ''
    }
})

export const initStats = (): Stats => ([])

export const getInitGameState = (state: State, stats: Stats): GameState => ({
    DOM: {
        infoContainerDOMElement: document.getElementById('info-container'),
        gameContainerDOMElement: document.getElementById('game-container'),
        statsContainerDOMElement: document.getElementById('stats-container'),
        currExerciseDOMElement: document.getElementById('current_exercise'),
        currQuestionDOMElement: document.getElementById('current_question'),
        totalExerciseDOMElement: document.getElementById('total_exercises'),
        totalQuestionDOMElement: document.getElementById('total_questions'),
        lettersDOMElement: document.getElementById('letters'),
        answerDOMElement: document.getElementById('answer'),
        currentPendingLettersElements: [],
        currentAnsweredLettersElements: []
    },
    state: state,
    stats: stats
})