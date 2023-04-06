import { shuffle } from "./utils";
import { GameState, WordStat } from "./state";
import { createUILetter, toggleElementClass } from "../ui/game-ui";

type LettersEventListeners = {
    onClickEventListener: (e: MouseEvent) => void
    onKeyUpEventListener: (e: KeyboardEvent) => void
}

export const generateResponsiveLetters = (
    game: GameState,
    genWord: () => void
) => {
    const { state } = game
    const { lettersDOMElement } = game.DOM

    state.currentPendingLetterElements = []
    state.currentGuessedLetterElements = []
    state.currentGuess.currentWord = game.state.remainingWordsInTask.shift()
    state.currentGuess.currentAnswer = ''

    const eventListeners: LettersEventListeners = {
        onClickEventListener: void 0,
        onKeyUpEventListener: void 0
    }

    const currWordStat: WordStat = {
        task: state.currentTaskNumber,
        question: state.currentQuestionNumber,
        word: state.currentGuess.currentWord,
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
        createUILetter(char, 'primary', state.currentPendingLetterElements, lettersDOMElement)
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
    const { lettersDOMElement } = game.DOM
    const { currentPendingLetterElements } = game.state

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
    const { answerDOMElement } = game.DOM
    const { currentGuessedLetterElements, currentGuess: { currentWord, currentAnswer } } = game.state
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
    const { answerDOMElement } = game.DOM
    const { currentGuessedLetterElements, currentPendingLetterElements, currentGuess: { currentWord } } = game.state

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