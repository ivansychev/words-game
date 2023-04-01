import { createLetterElement, shuffle, toggleElementClass } from "./utils";

export const generateResponsiveLetters = (
    currentTask: string[],
    answerDOMElement: HTMLElement,
    lettersDOMElement: HTMLElement,
    genWord: () => void
) => {
    const wordToGuess = currentTask.shift()
    const currentLetters = shuffle(wordToGuess.split(''))
    const answeredChars: HTMLElement[] = []
    let currentAnswer = ''

    currentLetters.forEach((char) => {
        const pLetter = createLetterElement(char, 'primary')

        const onClick = () => {
            const suggestion = currentAnswer + char
            if(suggestion === wordToGuess.substring(0, suggestion.length)){
                currentAnswer = suggestion

                pLetter.removeEventListener('click', onClick)
                pLetter.remove()

                const pAnswer = createLetterElement(char, 'success')
                answeredChars.push(pAnswer)
                answerDOMElement.append(pAnswer)

                if(suggestion === wordToGuess){
                    answeredChars.forEach((el) => el.remove())
                    genWord()
                }
            } else {
                toggleElementClass(pLetter, "btn-primary", "btn-danger")
            }
        }

        pLetter.addEventListener('click', onClick)

        lettersDOMElement.append(pLetter)
    })
}