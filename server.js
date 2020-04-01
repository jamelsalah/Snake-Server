import express from 'express'
import http from 'http'
import createGame from './gameServer.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()
setInterval(game.addFruit, 500)

game.subscribe((command) => {
    sockets.emit(command.type, command)
})
setInterval(game.run, 100)

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log('>>Player connected on Server With id: ' + playerId)

    game.addPlayer(playerId)

    socket.emit('setup', game.generateSetup())

    socket.on('move-player', (command) => {
        if(socket.id === command.id){
            game.movePlayer(command)
        }
    })

    socket.on('disconnect', () => {
        game.removePlayer(playerId)
    })
})


server.listen(3000, () => {
    console.log('>>> Server Online !')
})
