import { Navigate } from '@sgm/web/router'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useToken } from '../hooks/useToken'

type AuthGuardProps = {
    children: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {

    const location = useLocation()
    const { token } = useToken()
    
    const isPassing = !!token || location.pathname === '/auth/login'

    console.log('isPassing', isPassing)

    return isPassing ? children : <Navigate to="/auth/login" />
}