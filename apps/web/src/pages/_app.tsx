import { ChakraProvider } from '@chakra-ui/react'
import { AuthContext, AuthGuard } from '@sgm/web/auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { StrictMode, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { theme } from '../core/theme'

import '@fontsource-variable/montserrat'
import 'react-toastify/dist/ReactToastify.css'

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
			<ToastContainer position='bottom-center' />
		</StrictMode>
	)
}

export default App
