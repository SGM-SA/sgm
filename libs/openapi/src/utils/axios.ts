import { AuthService } from '@sgm/web/auth'
import { environment } from '@sgm/web/environments'
import defaultAxios, { AxiosError, AxiosResponse } from 'axios'
import { ErrorWrapper } from '../generated/apiFetcher'

const instance = defaultAxios.create({
	baseURL: environment.apiBaseUrl, // Replace with your base URL
	timeout: 10000, // Set a reasonable timeout
	headers: {
		'Content-Type': 'application/json',
	},
})

// Request interceptor to handle multipart/form-data and set headers
instance.interceptors.request.use((config) => {

    const contentType = config.headers['Content-Type']

	if (contentType?.toString()?.toLowerCase().includes('multipart/form-data')) {
		delete config.headers['Content-Type']
	}
	return config
})

// Response interceptor to handle errors and response parsing
instance.interceptors.response.use(
	(response: AxiosResponse) => {
		if (response.headers['content-type']?.includes('json')) {
			return response.data
		} else {
			// If it's not a JSON response, assume it's a blob and cast it
			return response.data as unknown
		}
	},
	(error: AxiosError) => {
		if (error.response) {
			// Handle response errors
			const errorWrapper: ErrorWrapper<unknown> = {
				status: 'unknown', // Set your status based on error.response
				payload: error.response.data,
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
