import { DisplayStats, GameState } from "./state";


export const parseStats = (game: GameState) =>
    game.stats.reduce<DisplayStats>((acc, curr) => {
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