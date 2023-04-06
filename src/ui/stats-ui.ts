import { GameState } from "../utils/state";

type DisplayStats = {
    noErrorsWords: number
    totalErrors: number
    mostErrorsWord: {
        word: string
        errors: number
    }
}

export const displayStats = (game: GameState) => {
    const { infoContainerDOMElement, gameContainerDOMElement, statsContainerDOMElement } = game.DOM

    infoContainerDOMElement.innerHTML = ''
    gameContainerDOMElement.innerHTML = ''

    const stats = game.stats.reduce<DisplayStats>((acc, curr) => {
        acc.noErrorsWords += curr.errors === 0 ? 1 : 0
        acc.totalErrors += curr.errors

        if(curr.errors > acc.mostErrorsWord.errors){
            acc.mostErrorsWord = {
                word: curr.word,
                errors: curr.errors
            }
        }

        return acc
    }, {
        noErrorsWords: 0,
        totalErrors: 0,
        mostErrorsWord: {
            word: '',
            errors: 0
        }
    })

    statsContainerDOMElement.innerHTML = `
        <p class="mb-5">Число собранных слов без ошибок: ${stats.noErrorsWords}</p>
        <p class="mb-5">Общее число ошибок: ${stats.totalErrors}</p>
        <p class="mb-5">Слово с самым большим числом ошибок - ${stats.mostErrorsWord.word}. (Ошибок: ${stats.mostErrorsWord.errors})</p>
    `
}