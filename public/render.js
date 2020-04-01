export default function renderGame(screen, game, requestAnimationFrame) {
    const ctx = screen.getContext('2d')
    const tileSize = game.state.tileSize
    ctx.clearRect(0, 0, 600, 600)
    renderPlayers(tileSize, ctx)
    renderFruits(tileSize, ctx)

    function renderPlayers(tileSize, ctx) {
        for(let i in game.state.players) {
            const player = game.state.players[i]
            const head = player.body[0]
            renderBody(player)
            renderEyes(player, head)
            
            function renderBody(player) {
                if(player.id !== game.clientId) {
                    ctx.fillStyle = 'red'
                } else {
                    ctx.fillStyle = 'green'
                }

                for(let j in player.body) {
                    const tile = player.body[j]
                    ctx.fillRect(tile[0] * tileSize, tile[1] * tileSize, tileSize, tileSize)
                }
            }

            function renderEyes(player, head) {
                if(player.id !== game.clientId) {
                    ctx.fillStyle = 'black'
                } else {
                    ctx.fillStyle = 'red'
                }

                if(player.direction == 'up'){
                    ctx.fillRect(head[0] * tileSize +2, head[1] * tileSize +3, 2, 2)
                    ctx.fillRect(head[0] * tileSize +6, head[1] * tileSize +3, 2, 2)
                } else if(player.direction == 'right') {
                    ctx.fillRect(head[0] * tileSize +5, head[1]  * tileSize +2, 2, 2)
                    ctx.fillRect(head[0] * tileSize +5, head[1]  * tileSize +6, 2, 2)
                } else if(player.direction == 'down') {
                    ctx.fillRect(head[0] * tileSize +2, head[1] * tileSize +5, 2, 2)
                    ctx.fillRect(head[0] * tileSize +6, head[1] * tileSize +5, 2, 2)
                } else if(player.direction == 'left') {
                    ctx.fillRect(head[0] * tileSize +4, head[1]  * tileSize +2, 2, 2)
                    ctx.fillRect(head[0] * tileSize +4, head[1]  * tileSize +6, 2, 2)
                }
            }
        }
    }

    function renderFruits(tileSize, ctx) {
        for(let i in game.state.fruits) {
            const fruit = game.state.fruits[i]

            if(fruit.type == 'yellow') {
                ctx.fillStyle = 'yellow'
            } else {
                ctx.fillStyle = 'orange'
            }
            ctx.fillRect(fruit.x * tileSize, fruit.y * tileSize, tileSize, tileSize)
        }
    }

    requestAnimationFrame(()=>{
        renderGame(screen, game, requestAnimationFrame)
    })
}