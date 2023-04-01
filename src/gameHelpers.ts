import { createLetterElement, shuffle, toggleElementClass } from "./utils";

type TextAndElements = {
    elements: HTMLElement[],
    text: string
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

    const shuffledLetters = shuffle(currentLetters.text.split(''))
    shuffledLetters.forEach((char) => {
        createSuggestionLetter(char, currentLetters, lettersDOMElement)
    })

    lettersDOMElement.addEventListener('click', addOnClickEventListener(
        currentLetters, currentAnswer, lettersDOMElement, answerDOMElement, genWord
    ))

    document.addEventListener('keyup', (e) => {
        console.log(e.key.toLowerCase())
    })
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

export const addOnClickEventListener = (
    currentLetters: TextAndElements,
    currentAnswer: TextAndElements,
    lettersDOMElement: HTMLElement,
    answerDOMElement: HTMLElement,
    genWord: () => void
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
                    lettersDOMElement.removeEventListener('click', callback)
                    genWord()
                }
            } else {
                toggleElementClass(target, "btn-primary", "btn-danger")
            }
        }
    }

    return callback
}