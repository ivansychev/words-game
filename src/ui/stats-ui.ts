import { DisplayStats, GameState } from "../utils/state";

export const displayStats = (game: GameState, stats: DisplayStats) => {
    const { infoContainerDOMElement, gameContainerDOMElement, statsContainerDOMElement } = game.DOM

    infoContainerDOMElement.innerHTML = ''
    gameContainerDOMElement.innerHTML = ''

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