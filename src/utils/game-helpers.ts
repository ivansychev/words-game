import { createLetterElement, shuffle, toggleElementClass } from "./utils";
import { GameState } from "./state";

type LettersEventListeners = {
    onClickEventListener: (e: MouseEvent) => void
    onKeyUpEventListener: (e: KeyboardEvent) => void
}

export const generateResponsiveLetters = (
    game: GameState,
    genWord: () => void
) => {
    game.DOM.currentPendingLetterElements = []
    game.DOM.currentGuessedLetterElements = []
    game.state.currentGuess.currentWord = game.state.remainingWordsInTask.shift()
    game.state.currentGuess.currentAnswer = ''

    const { lettersDOMElement, currentPendingLetterElements } = game.DOM
    const eventListeners: LettersEventListeners = {
        onClickEventListener: void 0,
        onKeyUpEventListener: void 0
    }

    eventListeners.onClickEventListener = createOnClickEventListenerCallback(game, genWord,
        removeAllListenersCallBack(lettersDOMElement, eventListeners)
    );

    eventListeners.onKeyUpEventListener = createOnKeyUpEventListenerCallback(game, genWord,
        removeAllListenersCallBack(lettersDOMElement, eventListeners)
    );

    const shuffledLetters = shuffle(game.state.currentGuess.currentWord.split(''))
    shuffledLetters.forEach((char) => {
        createPendingLetter(char, currentPendingLetterElements, lettersDOMElement)
    })

    lettersDOMElement.addEventListener('click', eventListeners.onClickEventListener)
    document.addEventListener('keyup', eventListeners.onKeyUpEventListener)
}

export const removeAllListenersCallBack = (
    lettersDOMElement: HTMLElement,
    eventListeners: LettersEventListeners
) => () => {
    lettersDOMElement.removeEventListener('click', eventListeners.onClickEventListener)
    document.removeEventListener('keyup', eventListeners.onKeyUpEventListener)
}

export const createPendingLetter = (char: string, currentPendingLetterElements: HTMLElement[], lettersDOMElement: HTMLElement) => {
    const pLetter = createLetterElement(char, 'primary')
    currentPendingLetterElements.push(pLetter)
    lettersDOMElement.append(pLetter)
}

export const createGuessedLetter = (char: string, currentGuessedLetterElements: HTMLElement[], answerDOMElement: HTMLElement) => {
    const pAnswer = createLetterElement(char, 'success')
    currentGuessedLetterElements.push(pAnswer)
    answerDOMElement.append(pAnswer)
}

export const createOnClickEventListenerCallback = (
    game: GameState,
    genWord: () => void,
    removeAllListenersCallBack: () => void
) => (e: MouseEvent) => {
    const target = e.target as HTMLElement

    if(target.tagName === 'BUTTON')
        compareWords(game, target, target.innerText, removeAllListenersCallBack, genWord)
}

export const createOnKeyUpEventListenerCallback = (
    game: GameState,
    removeAllListenersCallBack: () => void,
    genWord: () => void
) => (e: KeyboardEvent) => {
    const { currentPendingLetterElements } = game.DOM
    const char = e.key.toLowerCase()
    const el = currentPendingLetterElements.find((el) => el.innerText === char)

    if(el)
        compareWords(game, el, char, removeAllListenersCallBack, genWord)
}

export const compareWords = (
    game: GameState,
    el: HTMLElement,
    char: string,
    removeAllListenersCallBack: () => void,
    genWord: () => void
) => {
    const { currentGuessedLetterElements, answerDOMElement } = game.DOM
    const { currentWord, currentAnswer } = game.state.currentGuess

    const suggestion = currentAnswer + char

    if(suggestion === currentWord.substring(0, suggestion.length)){
        game.state.currentGuess.currentAnswer = suggestion
        createGuessedLetter(char, currentGuessedLetterElements, answerDOMElement)
        el.remove()

        if(suggestion === currentWord){
            currentGuessedLetterElements.forEach((el) => el.remove())
            removeAllListenersCallBack()
            genWord()
        }
    } else {
        toggleElementClass(el, "btn-primary", "btn-danger")
    }
}