import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

export const useToken = () => {

    const { token, setToken: defaultSetToken } = useContext(AuthContext)

    const setToken = (token: string | null) => {
        defaultSetToken(token)
        localStorage.setItem('token', token || '')
    }

    return { token, setToken }
}