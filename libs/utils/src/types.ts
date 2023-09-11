export type Paginated<TData> = {
    /**
	 * @example 123
	 */
	count?: number
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=4
	 */
	next?: string | null
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=2
	 */
	previous?: string | null
	results?: TData[]
}