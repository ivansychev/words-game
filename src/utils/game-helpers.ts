import { shuffle } from "./utils";
import { GameState, WordStat } from "./state";
import { createPendingLetters } from "../ui/game-ui";
import {
    createOnClickEventListenerCallback,
    createOnKeyUpEventListenerCallback,
    removeAllListenersCallBack
} from "./game-event-handlers";


export const startCurrentQuestion = (
    game: GameState,
    genWord: () => void
) => {
    const { state } = game
    const { lettersDOMElement } = game.DOM

    game.DOM.currentPendingLettersElements = []
    game.DOM.currentAnsweredLettersElements = []
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
    createPendingLetters(game.DOM, shuffledLetters)

    lettersDOMElement.addEventListener('click', eventListeners.onClickEventListener)
    document.addEventListener('keyup', eventListeners.onKeyUpEventListener)
}

type LettersEventListeners = {
    onClickEventListener: (e: MouseEvent) => void
    onKeyUpEventListener: (e: KeyboardEvent) => void
}