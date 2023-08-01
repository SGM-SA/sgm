import { createContext } from 'react'

type AuthContextType = {
    token: string | null
    setToken: (token: string | null) => void
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => {},
})