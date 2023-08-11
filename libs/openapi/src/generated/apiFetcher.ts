import { environment } from '@sgm/web/environments'
import { ApiContext } from './apiContext'
import { AuthService } from '@sgm/web/auth';
import { fetchAuthTokenRefreshCreate } from './apiComponents';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstance } from '../utils/axios';

const baseUrl = environment.apiBaseUrl

export type ErrorWrapper<TError> =
	| TError
	| { status: 'unknown'; payload: string }

export type ApiFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
	url: string
	method: string
	body?: TBody
	headers?: THeaders
	queryParams?: TQueryParams
	pathParams?: TPathParams
	signal?: AbortSignal
} & ApiContext['fetcherOptions']

export async function apiFetch<
	TData,
	TError,
	TBody extends {} | FormData | undefined | null,
	THeaders extends {},
	TQueryParams extends {},
	TPathParams extends {}
>({
	url,
	method,
	body,
	headers,
	pathParams,
	queryParams,
	signal,
}: ApiFetcherOptions<
	TBody,
	THeaders,
	TQueryParams,
	TPathParams
>): Promise<TData> {

	const processedHeaders: HeadersInit = {
		...axiosInstance.head,
		...headers,
	}

	// TODO: useful with the js fetch API, check if it is still needed with axios
	if (
		processedHeaders['Content-Type']
			?.toLowerCase()
			.includes('multipart/form-data')
	) {
		delete processedHeaders['Content-Type']
	}

	const config: AxiosRequestConfig = {
		method: method.toUpperCase(),
		url: resolveUrl(url, queryParams, pathParams),
		data: body instanceof FormData ? body : JSON.stringify(body),
		signal: signal,
		headers: processedHeaders
	}

	return axiosInstance.request(config)
}

const resolveUrl = (
	url: string,
	queryParams: Record<string, string> = {},
	pathParams: Record<string, string> = {}
) => {
	let query = new URLSearchParams(queryParams).toString()
	if (query) query = `?${query}`
	return (
		url.replace(/\{\w*\}/g, (key) => pathParams[key.slice(1, -1)]) + query
	)
}
