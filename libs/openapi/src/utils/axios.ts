import { AuthService } from '@sgm/web/auth'
import { environment } from '@sgm/web/environments'
import defaultAxios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ErrorWrapper } from '../generated/apiFetcher'
import { fetchAuthTokenRefreshCreate } from '../generated/apiComponents'

export const axiosInstance = defaultAxios.create({
	baseURL: environment.apiBaseUrl, // Replace with your base URL
	timeout: 10000, // Set a reasonable timeout
	headers: {
		'Content-Type': 'application/json',
	},
})

const refreshAuthLogic = async () => {

	const token = AuthService.getToken()
	const refreshToken = AuthService.getRefreshToken()

	if (!refreshToken || !token) {
		return Promise.reject()
	}

	const { access: newToken } = await fetchAuthTokenRefreshCreate({
		body: {
			access: token,
			refresh: refreshToken,
		},
	})

	console.warn('refreshed token', newToken)

	AuthService.login(newToken, refreshToken)

	return newToken
}

// Request interceptor to handle multipart/form-data and set headers
axiosInstance.interceptors.request.use((config) => {

    const contentType = config.headers['Content-Type']

	if (contentType?.toString()?.toLowerCase().includes('multipart/form-data')) {
		delete config.headers['Content-Type']
	}
	return config
})

// Response interceptor to handle errors and response parsing
axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		if (response.headers['content-type']?.includes('json')) {
			return response.data
		} else {
			// If it's not a JSON response, assume it's a blob and cast it
			return response.data as unknown
		}
	},
	async (error: AxiosError) => {
		if (error.response) {

			const originalConfig = error.config as (InternalAxiosRequestConfig<any> & { _retry: boolean }) | undefined
			if (!originalConfig) return Promise.reject(error)

			// Handle response errors
			const errorWrapper: ErrorWrapper<unknown> = {
				status: error.response.status, // Set your status based on error.response
				payload: error.response.data,
			}

			if (error.response.status === 401) {

				if (!originalConfig._retry) AuthService.logout()
				else {
			
					originalConfig._retry = true

					const newToken = await refreshAuthLogic().catch(() => {
						AuthService.logout()
						return Promise.reject(errorWrapper)
					})

					originalConfig.headers.Authorization = `Bearer ${newToken}`
					return axiosInstance.request(originalConfig)
				}
			}

			return Promise.reject(errorWrapper)
		} else if (error.request) {
			// Handle request errors
			const errorObject: Error = {
				name: 'unknown',
				message: `Network error (${error.message})`,
				stack: error.stack || '',
			}
			return Promise.reject(errorObject)
		} else {
			// Handle other errors
			const errorObject: Error = {
				name: 'unknown',
				message: `Unknown error (${error.message})`,
				stack: error.stack || '',
			}
			return Promise.reject(errorObject)
		}
	}
)

// export const axios = defaultAxios.create({
//     baseURL: environment.apiBaseUrl
// })

// axios.interceptors.response.use((response) => {

//     // logout if unauthorized
//     if (response.status === 401) {
//         AuthService.logout()
//     }

//     return response
// })
