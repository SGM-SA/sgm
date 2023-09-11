import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { AuthService } from '../services/AuthService'
import { useNavigate } from '@sgm/web/router'

export const useToken = () => {

    const { token, setToken } = useContext(AuthContext)
    const navigate = useNavigate()

    AuthService.emitter.on('login', (token) => setToken(token))
    AuthService.emitter.on('logout', () => {
        setToken(null)
        navigate('/auth/login')
    })

    return { token, setToken }
}
