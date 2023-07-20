import { Route } from '@tanstack/router'
import { rootRoute } from '@web/router'
import React from 'react'

type HomePageProps = {}

export const HomePage: React.FC<HomePageProps> = (props) => {
    
    return (
		<div>
			<h1>Welcome to web!</h1>
		</div>
	)
}

export default new Route({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage
})