class Controller {
    constructor() {
        this.logBtn = document.querySelector('#login-btn')
        this.createModal = this.createModal.bind(this)
        this.logHandler = this.logHandler.bind(this)
        this.socket = null
    }

    init_socket() {
        this.socket = io()

        this.socket.on('connect', () => {
            console.log('Socket connect');
        })

        this.socket.on('history', (history) => {
            if (history.length !== 0) {
                history.forEach((i) => {
                    if (i.from === 'user') {
                        const messagesContainer = document.querySelector('.chat-messages');

                        const messageHTML = `
                        <div class="message sent">
                            <div class="message-content">
                                <div class="message-text">${i.message}</div>
                                <div class="message-time">${i.time}</div>
                            </div>
                            <div class="message-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                        </div>>
                        `;

                        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    } else if (i.from === 'admin') {
                        const messagesContainer = document.querySelector('.chat-messages');

                        const messageHTML = `
                        <div class="message received">
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                        <div class="message-content">
                            <div class="message-text">${i.message}</div>
                                <div class="message-time">${i.time}</div>
                            </div>
                        </div>
                        `;

                        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                })
            }
        })

        this.socket.on('chats', (chats) => {
            if (JSON.stringify(chats) !== '{}') {
                Object.entries(chats).forEach(([email, chatData]) => {
                    const chatLine = document.createElement('div');
                    chatLine.className = 'chat-line';

                    chatLine.innerHTML = `
                    <div class="chat-mini-line">
                        <div class="chat-email">${email}</div>
                    </div>`


                    chatLine.querySelector('.chat-email').addEventListener('click', () => {
                        this.createChatModal(email)
                    })

                    document.querySelector('.empty-container').appendChild(chatLine)
                })
            }
        })

        this.socket.on('message', (message) => {
            if (message.from === 'user') {
                const messagesContainer = document.querySelector('.chat-messages');

                const messageHTML = `
                        <div class="message sent">
                            <div class="message-content">
                                <div class="message-text">${message.message}</div>
                                <div class="message-time">${message.time}</div>
                            </div>
                            <div class="message-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                        </div>>
                        `;

                messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } else if (message.from === 'admin') {
                const messagesContainer = document.querySelector('.chat-messages');

                const messageHTML = `
                        <div class="message received">
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                        <div class="message-content">
                            <div class="message-text">${message.message}</div>
                                <div class="message-time">${message.time}</div>
                            </div>
                        </div>
                        `;

                messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        })
    }

    createModal() {
        if (this.active_button === 'Вход') {
            this.active_button_className = 'login'
        } else {
            this.active_button_className = 'reg'
        }

        const fragment = document.createElement('div')
        fragment.className = 'auth-modal-overlay'
        fragment.innerHTML = `
                <div class="auth-modal">
                    <button class="close-btn">&times;</button>
        
                    <div class="auth-tabs">
                        <button class="tab-btn log active">Вход</button>
                        <button class="tab-btn reg">Регистрация</button>
                    </div>
        
                    <div class="tab-content">
                        <div class="tab-pane active" id="login">
                            <form class="auth-form" method='POST' action='/api/login' onsubmit="return false">
                                <input type="email" name="email" placeholder="Email" required>
                                <input type="password" name="password" placeholder="Пароль" required>
                                <button type="submit" class="submit-btn">Войти</button>
                            </form>
                        </div>

                        <div class="tab-pane" id="register">
                            <form class="auth-form" method='POST' action='/api/register' onsubmit="return false">
                                <input type="text" name="name" placeholder="Имя" required>
                                <input type="email" name="email" placeholder="Email" required>
                                <input type="password" name="password" placeholder="Пароль" required>
                                <button type="submit"class="submit-btn">Зарегистрироваться</button>
                            </form>
                        </div>
                    </div>
        
                    <div class="auth-divider">
                        <span>или</span>
                    </div>
        
                    <div class="social-auth">
                        <button class="social-btn google-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Продолжить с Google
                        </button>
                    </div>
                </div>
        `;

        fragment.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            if (e.target.closest('#login')) {
                console.log('Логин данные:', data);
                try {
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    console.log('Ответ сервера (логин):', result);
                    e.target.reset()
                    alert(result.message)

                    if (result.success) {
                        document.querySelector('#login-btn').remove()
                        document.body.removeChild(fragment)
                        localStorage.setItem('is_login', true)

                        if (result.isAdmin) {
                            localStorage.setItem('role', 'admin')
                        } else {
                            localStorage.setItem('role', 'user')
                        }

                        this.admin_controller()//показ админ панели
                    }
                } catch (error) {
                    console.error('Ошибка входа:', error);
                }
            } else if (e.target.closest('#register')) {
                console.log('Регистрация данные:', data);
                try {
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    console.log('Ответ сервера (регистрация):', result);
                    e.target.reset()
                    alert(result.message)

                    localStorage.setItem('user_email', result.user.email)

                    if (result.success) {
                        document.body.removeChild(fragment)
                    }
                } catch (error) {
                    console.error('Ошибка регистрации:', error);
                }
            }
        });


        fragment.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(fragment)
        })

        document.body.appendChild(fragment);
        return fragment
    }

    btnsHandlers(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const btns = document.querySelectorAll('.tab-btn')
                btns.forEach((i) => {
                    i.classList.remove('active')
                })

                e.target.classList.add('active')

                modal.querySelectorAll('.tab-pane').forEach((i) => {
                    i.classList.remove('active')
                })

                if (e.target.classList.contains('log')) {
                    modal.querySelector('#login').classList.add('active')
                } else if (e.target.classList.contains('reg')) {
                    modal.querySelector('#register').classList.add('active')
                }
            }
        })
    }

    logHandler() {
        const modal = this.createModal()
        this.btnsHandlers(modal)
    }

    createChatModal(room_id = localStorage.getItem('user_email')) {
        const fragment = document.createElement('div');
        fragment.className = 'chat-modal-overlay';

        fragment.innerHTML = `
        <div class="chat-modal">
            <div class="chat-header">
                <div class="chat-user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <h3>Чат поддержки</h3>
                        <span class="user-status online">• Онлайн</span>
                    </div>
                </div>
                <button class="chat-close-btn">&times;</button>
            </div>

            <div class="chat-messages">
                <div class="message received">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-text">Здравствуйте, укажите, что хотите заказать.</div>
                        <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                </div>
            </div>

            <div class="chat-input-area">
                <div class="input-wrapper">
                    <input type="text" class="chat-input" placeholder="Введите сообщение...">
                    <button class="send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
        `;

        // обработчики
        const closeBtn = fragment.querySelector('.chat-close-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(fragment);
        });

        // закрытие по клику вне модалки
        fragment.addEventListener('click', (e) => {
            if (e.target === fragment) {
                document.body.removeChild(fragment);
            }
        });

        this.socket.emit('join_room', room_id)

        // отправка сообщения
        const sendBtn = fragment.querySelector('.send-btn');
        const chatInput = fragment.querySelector('.chat-input');

        const sendMessage = () => {
            const text = chatInput.value.trim();
            if (text) {
                const messagesContainer = fragment.querySelector('.chat-messages');
                let messageHTML

                //новое сообщение
                if (localStorage.getItem('role') === 'user') {
                    messageHTML = `
                        <div class="message sent">
                            <div class="message-content">
                                <div class="message-text">${text}</div>
                                <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            <div class="message-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                        </div>
                    `;
                } else if (localStorage.getItem('role') === 'admin') {
                    messageHTML = `
                    <div class="message received">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <div class="message-text">${text}</div>
                            <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    </div>`
                }

                messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
                chatInput.value = '';

                // прокрутка вниз
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                this.socket.emit('new_message', {
                    message: text,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    from: localStorage.getItem('role')
                }, room_id)
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        document.body.appendChild(fragment);

        setTimeout(() => {
            fragment.querySelector('.chat-input').focus();
        }, 100);

        return fragment;
    }

    admin_controller() {
        function showAdminSidebar() {
            if (document.querySelector('.admin-panel')) {
                document.body.removeChild(document.querySelector('.admin-panel'))
            }

            const panel = document.createElement('div');
            panel.className = 'admin-panel';
            panel.innerHTML = `
                <div class="panel-header">
                    <h3>Админ Панель</h3>
                    <button class="close-panel">×</button>
                </div>
                <div class="panel-content">
                    <div class="empty-container"></div>
                </div>
            `;

            document.body.appendChild(panel);

            setTimeout(() => panel.classList.add('active'), 10);

            panel.querySelector('.close-panel').addEventListener('click', () => {
                panel.classList.remove('active');
                setTimeout(() => panel.remove(), 400);
            });

            controller.socket.emit('get_chats', localStorage.getItem('role'))
        }

        if (localStorage.getItem('role') === 'admin') {
            const admin_btn = document.createElement('li')
            admin_btn.innerHTML = '<a>Админ панель</a>'

            admin_btn.addEventListener('click', showAdminSidebar)

            document.querySelector('.nav-links').appendChild(admin_btn)
        }
    }

    start() {
        this.init_socket()
        this.admin_controller()
        this.logBtn.addEventListener('click', this.logHandler)
        document.querySelectorAll('.buy').forEach((i) => {
            i.addEventListener('click', () => {
                if (localStorage.getItem('is_login')) {
                    this.createChatModal()
                } else {
                    alert('Чтобы выбрать бокс - зарегистрируйтесь')
                }
            })
        });
    }
}

/*localStorage.removeItem('is_login')
localStorage.removeItem('user_email')
localStorage.removeItem('role')*/


if (localStorage.getItem('is_login')) {
    document.querySelector('#login-btn').style.display = 'none'
}

const controller = new Controller()
controller.start()