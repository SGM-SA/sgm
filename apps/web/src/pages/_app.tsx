import { ChakraProvider } from '@chakra-ui/react'
import { AuthContext, AuthGuard } from '@sgm/web/auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { StrictMode, useState } from 'react'
import { Outlet } from 'react-router-dom'

import '@fontsource-variable/montserrat'
import { theme } from '../core/theme'

const queryClient = new QueryClient()

const App: React.FC = () => {

    const [token, setToken] = useState(localStorage.getItem('token'))
        
    return (
        <StrictMode>
            <AuthContext.Provider value={{ token, setToken }}>
                <QueryClientProvider client={queryClient}>
                    <AuthGuard>
                        <ChakraProvider theme={theme}>
                            <Outlet />
                        </ChakraProvider>
                    </AuthGuard>
                </QueryClientProvider>
            </AuthContext.Provider>
        </StrictMode>
    )
}

export default App