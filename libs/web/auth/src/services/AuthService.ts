import mitt from 'mitt'

export type AuthEvents = {
    login: string
    logout: void
}

export class AuthService {

    static emitter = mitt<AuthEvents>()

    public static login(token: string) {
        localStorage.setItem('token', token)
        this.emitter.emit('login', token)
    }

    public static logout() {
        localStorage.removeItem('token')
        this.emitter.emit('logout')
    }

    public static getToken() {
        return localStorage.getItem('token')
    }
} 