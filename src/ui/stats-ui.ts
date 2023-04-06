import { GameState } from "../utils/state";

type DisplayStats = {
    noErrorsWords: number
    totalErrors: number
    mostErrorsWord: {
        words: string[]
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
            acc.mostErrorsWord.words = []
            acc.mostErrorsWord.words.push(curr.word)
            acc.mostErrorsWord.errors = curr.errors
        } else if(curr.errors === acc.mostErrorsWord.errors && curr.errors !== 0){
            acc.mostErrorsWord.words.push(curr.word)
        }

        return acc
    }, {
        noErrorsWords: 0,
        totalErrors: 0,
        mostErrorsWord: {
            words: [],
            errors: 0
        }
    })

    statsContainerDOMElement.innerHTML = `
        <p class="mb-5">Число собранных слов без ошибок: ${stats.noErrorsWords}</p>
        <p class="mb-5">Общее число ошибок: ${stats.totalErrors}</p>
        <p class="mb-5">
            ${stats.mostErrorsWord.words.length === 0 
                ? "Все слова собраны правильно"
                : `${stats.mostErrorsWord.words.length === 1 ? "Слово" : "Слова"}
                   с самым большим числом ошибок - ${stats.mostErrorsWord.words.join(', ')}. 
                   (Ошибок: ${stats.mostErrorsWord.errors})`
            }
        </p>
    `
}