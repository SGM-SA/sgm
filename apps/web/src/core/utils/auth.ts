import { OpenAPI } from '@sgm/openapi'

export const setToken = (token?: string) => {
    OpenAPI.TOKEN = token
}