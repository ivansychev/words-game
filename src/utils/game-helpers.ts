import { createLetterElement, shuffle, toggleElementClass } from "./utils";
import { GameState, WordStat } from "./state";

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
    const { currentTaskNumber, currentQuestionNumber, currentGuess: { currentWord } } = game.state
    const eventListeners: LettersEventListeners = {
        onClickEventListener: void 0,
        onKeyUpEventListener: void 0
    }

    const currWordStat: WordStat = {
        task: currentTaskNumber,
        question: currentQuestionNumber,
        word: currentWord,
        errors: 0
    }

    eventListeners.onClickEventListener = createOnClickEventListenerCallback(game, currWordStat, genWord,
        removeAllListenersCallBack(lettersDOMElement, eventListeners)
    );

    eventListeners.onKeyUpEventListener = createOnKeyUpEventListenerCallback(game, currWordStat, genWord,
        removeAllListenersCallBack(lettersDOMElement, eventListeners)
    );

    const shuffledLetters = shuffle(game.state.currentGuess.currentWord.split(''))
    shuffledLetters.forEach((char) => {
        createUILetter(char, 'primary', currentPendingLetterElements, lettersDOMElement)
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

export const createUILetter = (char: string, type: string, htmlElements: HTMLElement[], DOMParent: HTMLElement) => {
    const pLetter = createLetterElement(char, type)
    htmlElements.push(pLetter)
    DOMParent.append(pLetter)
}

export const createOnClickEventListenerCallback = (
    game: GameState,
    currWordStat: WordStat,
    genWord: () => void,
    removeAllListenersCallBack: () => void
) => (e: MouseEvent) => {
    const target = e.target as HTMLElement

    if(target.tagName === 'BUTTON')
        compareWords(game, target, target.innerText, currWordStat, removeAllListenersCallBack, genWord)
}

export const createOnKeyUpEventListenerCallback = (
    game: GameState,
    currWordStat: WordStat,
    genWord: () => void,
    removeAllListenersCallBack: () => void
) => (e: KeyboardEvent) => {
    const { currentPendingLetterElements, lettersDOMElement } = game.DOM

    if(/^[a-zA-Z]$/.test(e.key)){
        const char = e.key.toLowerCase()
        const el = currentPendingLetterElements.find((el) => el.innerText === char)

        if(el){
            compareWords(game, el, char, currWordStat, removeAllListenersCallBack, genWord)
        } else {
            toggleElementClass(lettersDOMElement, 'bg-body', 'bg-danger', 200)
            currWordStat.errors++
            if(currWordStat.errors >= 3){
                handleUnguessedWord(game, currWordStat, removeAllListenersCallBack, genWord)
            }
        }
    }
}

export const compareWords = (
    game: GameState,
    el: HTMLElement,
    char: string,
    currWordStat: WordStat,
    removeAllListenersCallBack: () => void,
    genWord: () => void
) => {
    const { currentGuessedLetterElements, answerDOMElement } = game.DOM
    const { currentWord, currentAnswer } = game.state.currentGuess
    const suggestion = currentAnswer + char

    if(suggestion === currentWord.substring(0, suggestion.length)){
        game.state.currentGuess.currentAnswer = suggestion
        createUILetter(char, 'success', currentGuessedLetterElements, answerDOMElement)
        el.remove()

        if(suggestion === currentWord){
            removeAllListenersCallBack()
            setTimeout(() => {
                currentGuessedLetterElements.forEach((el) => el.remove())
                game.stats.push(currWordStat)
                genWord()
            }, 750)
        }
    } else {
        currWordStat.errors++
        toggleElementClass(el, "btn-primary", "btn-danger")
        if(currWordStat.errors >= 3){
            handleUnguessedWord(game, currWordStat, removeAllListenersCallBack, genWord)
        }
    }
}

export const handleUnguessedWord = (
    game: GameState,
    currWordStat: WordStat,
    removeAllListenersCallBack: () => void,
    genWord: () => void
) => {
    const { currentGuessedLetterElements, currentPendingLetterElements, answerDOMElement } = game.DOM
    const { currentWord } = game.state.currentGuess

    removeAllListenersCallBack()
    currentGuessedLetterElements.forEach((el) => el.remove())
    currentPendingLetterElements.forEach((el) => el.remove())
    currentWord.split('').forEach((char) => {
        createUILetter(char, 'danger', currentGuessedLetterElements, answerDOMElement)
    })
    setTimeout(() => {
        currentGuessedLetterElements.forEach((el) => el.remove())
        game.stats.push(currWordStat)
        genWord()
    }, 1250)
}