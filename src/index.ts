import { WORDS } from "./words";
import { createLetterElement, shuffle, toggleElementClass } from "./utils";

const startGame = () => {
    const lettersDOMElement = document.getElementById('letters')
    const answerDOMElement = document.getElementById('answer')
    const words = shuffle(Array.from(WORDS))

    guessNextWord(lettersDOMElement, answerDOMElement)
}

const guessNextWord = (lettersDOMElement: HTMLElement, answerDOMElement: HTMLElement) => {
    const wordToGuess = WORDS.shift()
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
                    guessNextWord(lettersDOMElement, answerDOMElement)
                }
            } else {
                toggleElementClass(pLetter, "btn-primary", "btn-danger")
            }
        }

        pLetter.addEventListener('click', onClick)

        lettersDOMElement.append(pLetter)
    })
}

startGame()