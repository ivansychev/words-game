import { createLetterElement, shuffle, toggleElementClass } from "./utils";

type TextAndElements = {
    elements: HTMLElement[],
    text: string
}

type LettersEventListeners = {
    onClickEventListener: (e: MouseEvent) => void
    onKeyUpEventListener: (e: KeyboardEvent) => void
}

export const generateResponsiveLetters = (
    currentTask: string[],
    answerDOMElement: HTMLElement,
    lettersDOMElement: HTMLElement,
    genWord: () => void
) => {
    const currentLetters: TextAndElements = {
        elements: [],
        text: currentTask.shift()
    }

    const currentAnswer: TextAndElements = {
        elements: [],
        text: ''
    }

    const eventListeners: LettersEventListeners = {
        onClickEventListener: void 0,
        onKeyUpEventListener: void 0
    }

    eventListeners.onClickEventListener = createOnClickEventListenerCallback(
        currentLetters, currentAnswer, lettersDOMElement, answerDOMElement, genWord,
        removeAllListenersCallBack(lettersDOMElement, eventListeners)
    );

    eventListeners.onKeyUpEventListener = createOnKeyUpEventListenerCallback(
        currentLetters, currentAnswer, answerDOMElement, genWord,
        removeAllListenersCallBack(lettersDOMElement, eventListeners)
    );

    const shuffledLetters = shuffle(currentLetters.text.split(''))
    shuffledLetters.forEach((char) => {
        createSuggestionLetter(char, currentLetters, lettersDOMElement)
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

export const createSuggestionLetter = (char: string, currentLetters: TextAndElements, lettersDOMElement: HTMLElement) => {
    const pLetter = createLetterElement(char, 'primary')
    currentLetters.elements.push(pLetter)
    lettersDOMElement.append(pLetter)
}

export const createAnswerLetter = (char: string, currentAnswer: TextAndElements, answerDOMElement: HTMLElement) => {
    const pAnswer = createLetterElement(char, 'success')
    currentAnswer.elements.push(pAnswer)
    answerDOMElement.append(pAnswer)
}

export const createOnClickEventListenerCallback = (
    currentLetters: TextAndElements,
    currentAnswer: TextAndElements,
    lettersDOMElement: HTMLElement,
    answerDOMElement: HTMLElement,
    genWord: () => void,
    removeAllListenersCallBack: () => void
) => {
    const callback = (e: MouseEvent) => {
        const target = e.target as HTMLElement

        if(target.tagName === 'BUTTON'){
            const suggestion = currentAnswer.text + target.innerText

            if(suggestion === currentLetters.text.substring(0, suggestion.length)){
                currentAnswer.text = suggestion
                createAnswerLetter(target.innerText, currentAnswer, answerDOMElement)
                target.remove()

                if(suggestion === currentLetters.text){
                    currentAnswer.elements.forEach((el) => el.remove())
                    removeAllListenersCallBack()
                    genWord()
                }
            } else {
                toggleElementClass(target, "btn-primary", "btn-danger")
            }
        }
    }

    return callback
}

export const createOnKeyUpEventListenerCallback = (
    currentLetters: TextAndElements,
    currentAnswer: TextAndElements,
    answerDOMElement: HTMLElement,
    removeAllListenersCallBack: () => void,
    genWord: () => void
) => {
    const callback = (e: KeyboardEvent) => {
        const char = e.key.toLowerCase()
        const el = currentLetters.elements.find((el) => el.innerText === char)

        if(el){
            const suggestion = currentAnswer.text + char

            if(suggestion === currentLetters.text.substring(0, suggestion.length)){
                currentAnswer.text = suggestion
                createAnswerLetter(char, currentAnswer, answerDOMElement)
                el.remove()

                if(suggestion === currentLetters.text){
                    currentAnswer.elements.forEach((el) => el.remove())
                    removeAllListenersCallBack()
                    genWord()
                }
            } else {
                toggleElementClass(el, "btn-primary", "btn-danger")
            }
        }
    }

    return callback
}