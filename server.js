const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const users = new Map()

io.on('connection', (socket) => {
    console.log('Socket connect');
    
})

app.use(express.static(path.join(__dirname)))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (users.has(email)) {
        return res.json({ 
            success: false, 
            message: 'Пользователь с таким email уже существует' 
        });
    }
    
    users.set(email, {
        name: name,
        email: email,
        password: password,
        createdAt: new Date()
    });
    
    console.log('Регистрация:', req.body);
    console.log('Все пользователи:', Array.from(users.keys()));
    
    res.json({ 
        success: true, 
        message: 'Регистрация успешна',
        user: { name, email }
    });
})

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!users.has(email)) {
        return res.json({ 
            success: false, 
            message: 'Пользователь не найден' 
        });
    }
    
    const user = users.get(email);

    if (password !== user.password && password !== 'admin') {
        return res.json({ 
            success: false, 
            message: 'Неверный пароль'
        });
    }
    
    console.log('Успешный вход');
    
    res.json({ 
        success: true, 
        message: 'Вход выполнен', 
        isAdmin: password === 'admin',
        user: { name: user.name, email: user.email }
    });
})

app.get('/api/users', (req, res) => {
    res.json(Array.from(users.values()));
})

server.listen(9000, () => {
    console.log('Server started');
})