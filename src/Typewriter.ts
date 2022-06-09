type QueueItem = () => Promise<void>

export default class Typewriter {
    #queue: QueueItem[] = []
    element: HTMLElement
    loop: boolean
    typingSpeed: number
    deletingSpeed: number
    constructor(
        parent: HTMLElement,
        { loop = false, typingSpeed = 50, deletingSpeed = 50 } = {}) {
        this.element = document.createElement("div")
        this.element.classList.add("whitespace")
        parent.append(this.element)
        this.loop = loop
        this.typingSpeed = typingSpeed
        this.deletingSpeed = deletingSpeed
    }

    typeString(string: string) {
    }

    deleteChars(number: number) {
    }

    pauseFor(duration: number) {
        this.#addToQueue(resolve => {
            setTimeout(resolve, duration)                
        })
        return this
    }

    deleteAll(deleteSpeed = this.deletingSpeed) {
        this.#addToQueue(() => {
            return new Promise(resolve => {
                let i = 0
                const interval = setInterval(() => {
                    this.element.innerText = this.element.innerText?.substring(0, this.element.innerText.length -1)
                    i++
                    if (this.element.innerText.length === 0) {
                        clearInterval(interval)
                        resolve()
                    }
                }, deleteSpeed)
            })
        })
        return this
    }

    async start() {
        const cb = this.#queue.shift()
        while(cb != null) {
            cb = this.#queue.shift()
            await cb()
            if(this.loop) this.#queue.push(cb)
        }

        return this
    }

    #addToQueue(cb: (resolve: () => void) => void) {
        this.#queue.push(() => new Promise(cb))
    }
}
