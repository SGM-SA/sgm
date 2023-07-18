import { RootRoute, Route, Router } from '@tanstack/router'
import HomePage from '@sgm/web/pages/home/HomePage'

/**
 * Root route
 */
export const rootRoute = new RootRoute()

/**
 * 
 */
const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage
})

const routeTree = rootRoute.addChildren([
    indexRoute,
])

export const router = new Router({ routeTree })

declare module '@tanstack/router' {
    interface Register {
        router: typeof router
    }
}