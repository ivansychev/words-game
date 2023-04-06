import { WORDS } from "./words";
import { hideModal, showModal } from "./ui/game-ui";
import { startGame } from "./game";

const initGame = (numberOfQuestionsInTask: number) => {
    const numberOfTasks = Math.floor(WORDS.length / numberOfQuestionsInTask)
    const words = WORDS.splice(0, numberOfQuestionsInTask * numberOfTasks)

    if(sessionStorage.length !== 0){
        const modal = document.getElementById("myModal")
        const cancelButton = document.getElementById("cancelModalButton")
        const continueButton = document.getElementById("continueModalButton")

        showModal(modal)

        const handleCancel = () => {
            hideModal(modal)
            startGame(words, numberOfTasks, numberOfQuestionsInTask, false)
            sessionStorage.clear()
            cancelButton.removeEventListener('click', handleCancel)
        }

        const handleContinue = () => {
            hideModal(modal)
            startGame(words, numberOfTasks, numberOfQuestionsInTask, true)
            continueButton.removeEventListener('click', handleContinue)
        }

        cancelButton.addEventListener('click', handleCancel)
        continueButton.addEventListener('click', handleContinue)
    } else {
        startGame(words, numberOfTasks, numberOfQuestionsInTask, false)
    }
}

initGame(6)