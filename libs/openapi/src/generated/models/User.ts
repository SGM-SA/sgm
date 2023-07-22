/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * test
 */
export type User = {
	/**
	 * Requis. 150 caractères maximum. Uniquement des lettres, nombres et les caractères « @ », « . », « + », « - » et « _ ».
	 */
	username: string
	email?: string
	first_name?: string
	last_name?: string
	readonly groups: Array<string>
}
