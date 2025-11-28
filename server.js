const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname)))

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

server.listen(9000, () => {
    console.log('Server started');
})