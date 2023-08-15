import mitt from 'mitt'
import { toast } from 'react-toastify'

export type AuthEvents = {
    login: string
    logout: void
}

export enum Items {
    Token = 'token',
    RefreshToken = 'refresh_token'
}

export class AuthService {

    static emitter = mitt<AuthEvents>()

    public static login(token: string, refreshToken: string, showToast = true) {
        localStorage.setItem(Items.Token, token)
        localStorage.setItem(Items.RefreshToken, refreshToken)
        if (showToast) toast.success('Vous êtes connecté', { toastId: 'login' })
        this.emitter.emit('login', token)
    }

    public static logout(showToast = true) {
        localStorage.removeItem(Items.Token)
        localStorage.removeItem(Items.RefreshToken)
        if (showToast) toast.error('Vous avez été déconnecté', { toastId: 'logout' })
        this.emitter.emit('logout')
    }

    public static getToken() {
        return localStorage.getItem(Items.Token)
    }

    public static getRefreshToken() {
        return localStorage.getItem(Items.RefreshToken)
    }
} 