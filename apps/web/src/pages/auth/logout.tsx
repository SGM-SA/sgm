import { useToken } from '@sgm/web/auth'
import { Navigate } from '@sgm/web/router'
import React, { useEffect } from 'react'

const LogoutPage: React.FC = () => {

    const { setToken } = useToken()
    
    useEffect(() => {
        setToken(null)
    }, [setToken])

	return <Navigate to='/auth/login' />
}

export default LogoutPage