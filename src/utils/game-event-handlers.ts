import { GameState, WordStat } from "./state";
import {
    createUILetter,
    createUnguessedAnswer,
    removeAnsweredLetters,
    removePendingLetters,
    toggleElementClass
} from "../ui/game-ui";


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
    const target = e.target as HTMLElement;

    if (target.tagName === "BUTTON")
        handleUserAction(game, target, target.innerText, currWordStat, removeAllListenersCallBack, genWord);
};

export const createOnKeyUpEventListenerCallback = (
    game: GameState,
    currWordStat: WordStat,
    genWord: () => void,
    removeAllListenersCallBack: () => void
) => (e: KeyboardEvent) => {
    const { lettersDOMElement, currentPendingLettersElements } = game.DOM;

    if (/^[a-zA-Z]$/.test(e.key)) {
        const char = e.key.toLowerCase();
        const el = currentPendingLettersElements.find((el) => el.innerText === char);

        if (el) {
            handleUserAction(game, el, char, currWordStat, removeAllListenersCallBack, genWord);
        } else {
            toggleElementClass(lettersDOMElement, "bg-body", "bg-danger", 200);
            currWordStat.errors++;
            if (currWordStat.errors >= 3) {
                handleUnguessedWord(game, currWordStat, removeAllListenersCallBack, genWord);
            }
        }
    }
};

export const handleUserAction = (
    game: GameState,
    el: HTMLElement,
    char: string,
    currWordStat: WordStat,
    removeAllListenersCallBack: () => void,
    genWord: () => void
) => {
    const { answerDOMElement, currentAnsweredLettersElements } = game.DOM;
    const { currentWord, currentAnswer } = game.state.currentGuess;
    const suggestion = currentAnswer + char;

    if (suggestion === currentWord.substring(0, suggestion.length)) {
        game.state.currentGuess.currentAnswer = suggestion;
        createUILetter(char, "success", currentAnsweredLettersElements, answerDOMElement);
        el.remove();

        if (suggestion === currentWord) {
            removeAllListenersCallBack();
            setTimeout(() => {
                removeAnsweredLetters(game.DOM);
                game.stats.push(currWordStat);
                genWord();
            }, 750);
        }
    } else {
        currWordStat.errors++;
        toggleElementClass(el, "btn-primary", "btn-danger");
        if (currWordStat.errors >= 3) {
            handleUnguessedWord(game, currWordStat, removeAllListenersCallBack, genWord);
        }
    }
};

export const handleUnguessedWord = (
    game: GameState,
    currWordStat: WordStat,
    removeAllListenersCallBack: () => void,
    genWord: () => void
) => {
    removeAllListenersCallBack();
    removeAnsweredLetters(game.DOM);
    removePendingLetters(game.DOM);
    createUnguessedAnswer(game);

    setTimeout(() => {
        removeAnsweredLetters(game.DOM);
        game.stats.push(currWordStat);
        genWord();
    }, 1250);
};