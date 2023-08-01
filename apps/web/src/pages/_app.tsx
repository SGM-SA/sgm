import { AuthGuard } from '@web/components/modules'
import React, { StrictMode } from 'react'
import { Outlet } from 'react-router-dom'

type AppProps = {}

const App: React.FC<AppProps> = (props) => {
        
    return (
        <StrictMode>
            {/* <AuthGuard> */}
                <Outlet />
            {/* </AuthGuard> */}
        </StrictMode>
    )
}

export default App