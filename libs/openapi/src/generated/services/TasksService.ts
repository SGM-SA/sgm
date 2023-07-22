/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'

export class TasksService {
	/**
	 * Sync data SGM
	 * Sync les données SGM affaire avec la base de données django
	 * @returns any No response body
	 * @throws ApiError
	 */
	public static apiTasksResyncDataSgmCreate(): CancelablePromise<any> {
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/tasks/resync_data_sgm',
		})
	}
}
