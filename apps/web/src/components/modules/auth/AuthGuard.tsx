import React from 'react'

type AuthGuardProps = {
    children: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {

    const hasJwt = () => {
        const jwt = localStorage.getItem('jwt')
        return !!jwt
    }

    if (!hasJwt()) return <>Tu n'est pas loggé !</>
    else return children
}