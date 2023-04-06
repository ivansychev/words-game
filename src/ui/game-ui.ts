import { DOM, GameState } from "../utils/state";


export const createLetterElement = (char: string, type: string) => {
    const el = document.createElement('button')
    el.innerText = char
    el.setAttribute("data-toggle","button")
    el.className = `btn btn-${type} btn-lg m-2`
    el.style.width = "50px"
    return el
}

export const changeElementClass = (el: HTMLElement, prev: string, next: string) => {
    el.classList.remove(prev)
    el.classList.add(next)
}

export const toggleElementClass = (el: HTMLElement, prev: string, next: string, delay = 500) => {
    if(el.classList.contains(next)) return
    changeElementClass(el, prev, next)
    setTimeout(() => {
        changeElementClass(el, next, prev)
    }, delay)
}

export const createUILetter = (char: string, type: string, htmlElements: HTMLElement[], DOMParent: HTMLElement) => {
    const pLetter = createLetterElement(char, type)
    htmlElements.push(pLetter)
    DOMParent.append(pLetter)
}

export const removeAnsweredLetters = (DOM: DOM) => {
    DOM.currentAnsweredLettersElements.forEach((el) => el.remove())
}

export const removePendingLetters = (DOM: DOM) => {
    DOM.currentPendingLettersElements.forEach((el) => el.remove())
}

export const createUnguessedAnswer = (game: GameState) => {
    game.state.currentGuess.currentWord.split('').forEach((char) => {
        createUILetter(char, 'danger', game.DOM.currentAnsweredLettersElements, game.DOM.answerDOMElement)
    })
}

export const createPendingLetters = (DOM: DOM, shuffledLetters: string[]) => {
    shuffledLetters.forEach((char) => {
        createUILetter(char, 'primary', DOM.currentPendingLettersElements, DOM.lettersDOMElement)
    })
}