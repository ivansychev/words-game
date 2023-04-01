import { WORDS } from "./words";
import { shuffle } from "./utils";
import { generateResponsiveLetters } from "./gameHelpers";

const startGame = (words: string[], numberOfTasks: number, numberOfWords: number) => {
    const currExerciseDOMElement = document.getElementById('current_exercise')
    const currQuestionDOMElement = document.getElementById('current_question')
    const totalExerciseDOMElement = document.getElementById('total_exercises')
    const totalQuestionDOMElement = document.getElementById('total_questions')
    const lettersDOMElement = document.getElementById('letters')
    const answerDOMElement = document.getElementById('answer')
    const remainingWords = shuffle(Array.from(WORDS))

    let currentTask: string[] = []
    let currentTaskNumber = 0;
    let currentQuestionNumber = 0;

    totalExerciseDOMElement.innerText = String(numberOfTasks)
    totalQuestionDOMElement.innerText = String(numberOfWords)

    const genTask = () => {
        currentTask = remainingWords.splice(0,numberOfWords)
        currExerciseDOMElement.innerText = String(++currentTaskNumber)
        genWord()
    }

    const genWord = () => {
        if(currentTask.length === 0){
            currentQuestionNumber = 0
            gameLoop()
        } else {
            currQuestionDOMElement.innerText = String(++currentQuestionNumber);
            generateResponsiveLetters(currentTask, answerDOMElement, lettersDOMElement, genWord)
        }
    }

    const gameLoop = () => {
        if(remainingWords.length === 0 || currentTaskNumber > numberOfTasks){
            alert("Done")
        } else {
            genTask()
        }
    }

    gameLoop()
}


startGame(WORDS, 3, 2)