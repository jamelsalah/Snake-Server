export default function createKeyBordListener(document, game) {
    let observers = []

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function deleteObservers() {
        observers = []
    }

    function notifyAll(command) {
        for(let observer of observers) {
            observer(command)
        }
    }

    document.addEventListener('keydown', handle)

    function handle(event) {
        notifyAll({
            type: 'move-player',
            id: game.clientId,
            keyPressed : event.key
        })
    }

    return {
        subscribe
    }
}
