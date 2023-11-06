import { Navigate, Path } from '@sgm/web/router'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { useToken } from '../hooks/useToken'
import { bypassUrls } from '../bypassUrls'

type AuthGuardProps = {
    children: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {

    const location = useLocation()
    const { token } = useToken()
    
    const isPassing = !!token || bypassUrls.includes(location.pathname as Path) 

    return isPassing ? children : <Navigate to="/auth/login" />
}