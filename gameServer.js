export default function createGame() {
    const clientId = null

    const state = {
        players: {},
        fruits: [],
        tileSize: 10
    }

    const observers = []

    function setState(newState) {
        Object.assign(state, newState)
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for(let observer of observers) {
            observer(command)
        }
    }

    function addPlayer(playerId) {
        const body = createBody()
        const direction = setDirection()

        state.players[playerId] = {
            id: playerId,
            body: body,
            direction: direction,
            minSize: 2,
            score: 0,
            move: true
        }

        function createBody() {
            const body = []
            const head = [Math.floor(Math.random() * (55 - 5) + 5), Math.floor(Math.random() * (55 - 5) + 5)]
            body.push(head)
            return body
        }

        function setDirection() {
            const directions = ['up', 'right', 'down', 'left']
            return directions[Math.floor(Math.random() * 4)]
        }

        notifyAll({
            type: 'add-player',
            id: playerId,
            body: body,
            direction: direction
        }) 
    }

    function removePlayer(playerId) {
        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            id: playerId
        })
    }

    function generateSetup() {
        const setup = {
            players: {},
            fruits: state.fruits
        }

        const players = state.players

        for(let i of Object.keys(players)) {
            const player = players[i]

            setup.players[i] = {
                id: player.id,
                body: player.body,
                direction: player.direction,
                score: player.score,
                minSize: 2
            }
        }
        return setup
    }

    function addFruit(){
        const id = Math.floor(Math.random() * 1000000)
        const x = Math.floor(Math.random() * 60)
        const y = Math.floor(Math.random() * 60)
        const type = fruitType() 

        if(state.fruits.length < 100) {
                state.fruits.push({
                type: type,
                id: id,
                x: x,
                y: y,
            })      

            notifyAll({
                type: 'add-fruit',
                id: id,
                x: x,
                y: y,
                fruitType: type
            })
        }

        function fruitType() {
            const random = Math.floor(Math.random() * 21)
            if (random  ==  20) {
                return 'orange'
            } else {
                return 'yellow'
            }
        }

    }
    
    function movePlayer(command) {
        const playerId = command.id
        const player = state.players[playerId]

        const directions = {
            ArrowUp(player) {
                if(player.direction !== 'down'){
                    player.direction = 'up'
                }
            },
            ArrowLeft(player) {
                if(player.direction !== 'right'){
                    player.direction = 'left'
                }
            },
            ArrowDown(player) {
                if(player.direction !== 'up'){
                    player.direction = 'down'
                }
            },
            ArrowRight(player) {
                if(player.direction !== 'left'){
                    player.direction = 'right'
                }
            }
        }
        
        const move = directions[command.keyPressed]

        if(move  &&  playerId  &&  player  &&  player.move) {
            player.move = false
            move(player)
            notifyAll({
                type: 'move-player',
                id: playerId,
                keyPressed: command.keyPressed
            })
        }
    }

    function maxSizePlayer(player) {
            return (Math.floor(player.minSize + Math.floor(player.score / 5)))
    }

    function run() {
        const moves = {
            up(player, head) {
                const move = [head[0], head[1] -1]

                if(move[1] < 0) {
                    move[1] = 59
                }

                player.body.splice(0, 0, move)
                player.body.splice(maxSizePlayer(player), 3)
            },
            left(player,head) {
                const move = [head[0] -1, head[1]]

                if(move[0] < 0) {
                    move[0] = 59
                }

                player.body.splice(0, 0, move)
                player.body.splice(maxSizePlayer(player), 3)
            },
            down(player, head) {
                const move = [head[0] , head[1] +1]

                if(move[1] > 59) {
                    move[1] = 0
                }

                player.body.splice(0, 0, move)
                player.body.splice(maxSizePlayer(player), 3)
            },
            right(player, head) {
                const move = [head[0] + 1, head[1]]

                if(move[0] > 59) {
                    move[0] = 0
                }

                player.body.splice(0, 0, move)
                player.body.splice(maxSizePlayer(player), 2)
            },
        }

        for(let i in state.players) {
            const player = state.players[i]
            const head = player.body[0]
            const move = moves[player.direction]
            player.move = true

            move(player, head)
        }

        fruitColision()
        playerColision()
        autoColision()

        notifyAll({
            type: 'run',
        })
    }

    function fruitColision() {
        for(let i in state.fruits) {
            const fruit = state.fruits[i]

            for(let j in state.players) {
                const player = state.players[j]
                const head = player.body[0]

                if(head[0] === fruit.x  &&  head[1] === fruit.y) {
                    state.fruits.splice(i, 1)

                    if(fruit.type == 'orange') {
                        player.score += 10
                    } else {
                        player.score ++
                    }
                }
            }
        }
    }

    function playerColision() {
        for(let i in state.players) {
            const player1 = state.players[i]
            const head = player1.body[0]

            for(let j in state.players) {
                const player2 = state.players[j]
                const body = player2.body
                const head2 = player2.body[0]
                const headColision = (head2[0] == head[0]  &&  head2[1] == head[1])

                if(player1 !== player2) {
                    for(let k in body) {
                        const tile = body[k]

                        if(head[0] == tile[0]  &&  head[1] == tile[1]  &&  k <= maxSizePlayer(player2)  &&  !headColision) {
                            player2.score += Math.floor(player1.score / 2)
                            player1.score = 0
                        } else if(head[0] == tile[0]  &&  head[1] == tile[1]  &&  k <= maxSizePlayer(player2)  &&  headColision) {
                            player1.score = 0
                            player2.score = 0
                        }
                    }
                }
            }
        }
    }

    function autoColision() {
        for(let i in state.players) {
            const player = state.players[i]
            const head = player.body[0]
            const body = []

            for(let j in player.body) {
                const tile = player.body[j]
                if(j != 0)         
                    body.push(tile)
            }

            for(let j in body) {
                const tile = body[j]

                if(head[0] == tile[0]  &&  head[1] == tile[1]  &&  j <= maxSizePlayer(player)) {
                    player.score = j * 5
                }
            }
        }
    }

    return {
        state,
        addPlayer,
        run,
        movePlayer,
        addFruit,
        clientId,
        setState,
        subscribe,
        removePlayer,
        generateSetup
    }
}
