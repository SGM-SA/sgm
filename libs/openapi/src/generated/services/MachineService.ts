/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MachineDetail } from '../models/MachineDetail'
import type { PaginatedMachineDetailList } from '../models/PaginatedMachineDetailList'
import type { PatchedMachineDetail } from '../models/PatchedMachineDetail'

import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'

export class MachineService {
	/**
	 * Liste
	 * Liste des machines
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedMachineDetailList
	 * @throws ApiError
	 */
	public static apiMachinesList(
		page?: number
	): CancelablePromise<PaginatedMachineDetailList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/machines/',
			query: {
				page: page,
			},
		})
	}

	/**
	 * Création
	 * Création d'une machine
	 * @param requestBody
	 * @returns MachineDetail
	 * @throws ApiError
	 */
	public static apiMachinesCreate(
		requestBody: MachineDetail
	): CancelablePromise<MachineDetail> {
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/machines/',
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * Détail
	 * Détail d'une machine
	 * @param id
	 * @returns MachineDetail
	 * @throws ApiError
	 */
	public static apiMachinesRetrieve(
		id: number
	): CancelablePromise<MachineDetail> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/machines/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * Modification
	 * Modification d'une machine
	 * @param id
	 * @param requestBody
	 * @returns MachineDetail
	 * @throws ApiError
	 */
	public static apiMachinesUpdate(
		id: number,
		requestBody: MachineDetail
	): CancelablePromise<MachineDetail> {
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/machines/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * Modification
	 * Modification d'une machine
	 * @param id
	 * @param requestBody
	 * @returns MachineDetail
	 * @throws ApiError
	 */
	public static apiMachinesPartialUpdate(
		id: number,
		requestBody?: PatchedMachineDetail
	): CancelablePromise<MachineDetail> {
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/machines/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * Suppression
	 * Suppression d'une machine ou plusieurs machines, la machine est désactivée et non supprimée pour garder l'historique
	 * @param ids
	 * @returns void
	 * @throws ApiError
	 */
	public static apiMachinesDeleteDestroy(
		ids: string
	): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/machines/delete',
			query: {
				ids: ids,
			},
		})
	}
}
