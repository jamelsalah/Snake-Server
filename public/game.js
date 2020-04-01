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

    function addPlayer(command) {
        const playerId = command.id
        const body = command.body
        const direction = command.direction

        state.players[playerId] = {
            id: playerId,
            body: body,
            direction: direction,
            minSize: 2,
            score: 0,
            move: true
        }
    }

    function addFruit(command) {
        const fruitId = command.fruitId
        const x = command.x
        const y = command.y
        const type = command.fruitType
       
        state.fruits.push({
            id: fruitId,
            x: x,
            y: y,
            type: type
        })            
    }

    function removePlayer(playerId) {
        delete state.players[playerId]
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
            move(player)
            player.move = false
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
        removePlayer
    }
}
