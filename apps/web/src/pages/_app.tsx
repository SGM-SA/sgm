import React, { StrictMode } from 'react'
import { Outlet } from 'react-router-dom'

type AppProps = {}

export const App: React.FC<AppProps> = (props) => {
        
    return (
        <StrictMode>
            <Outlet />
        </StrictMode>
    )
}