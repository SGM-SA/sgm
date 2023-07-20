import { RouterProvider } from '@tanstack/router'
import React, { StrictMode } from 'react'
import { router } from './router'

type AppProps = {}

export const App: React.FC<AppProps> = (props) => {
        
    return (
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>
    )
}