import { AuthContext, AuthGuard } from '@sgm/web/auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { StrictMode, useState } from 'react'
import { Outlet } from 'react-router-dom'

const queryClient = new QueryClient()

const App: React.FC = () => {

    const [token, setToken] = useState(localStorage.getItem('token'))
        
    return (
        <StrictMode>
            <AuthContext.Provider value={{ token, setToken }}>
                <QueryClientProvider client={queryClient}>
                    <AuthGuard>
                        <Outlet />
                    </AuthGuard>
                </QueryClientProvider>
            </AuthContext.Provider>
        </StrictMode>
    )
}

export default App