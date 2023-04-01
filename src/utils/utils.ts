export const shuffle = <T>(arr: T[]): T[] =>
    arr
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);

export const createLetterElement = (char: string, type: string) => {
    const el = document.createElement('button')
    el.innerText = char
    el.setAttribute("data-toggle","button")
    el.className = `btn btn-${type} btn-lg m-2`
    el.style.width = "50px"
    return el
}

export const changeElementClass = (el: HTMLElement, prev: string, next: string) => {
    el.classList.remove(prev)
    el.classList.add(next)
}

export const toggleElementClass = (el: HTMLElement, prev: string, next: string) => {
    if(el.classList.contains(next)) return
    changeElementClass(el, prev, next)
    setTimeout(() => {
        changeElementClass(el, next, prev)
    }, 500)
}