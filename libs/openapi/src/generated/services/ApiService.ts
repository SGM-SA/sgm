/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AffectationAjustageDetail } from '../models/AffectationAjustageDetail'
import type { AffectationMachineDetail } from '../models/AffectationMachineDetail'
import type { Client } from '../models/Client'
import type { EtapeCreate } from '../models/EtapeCreate'
import type { Etat } from '../models/Etat'
import type { FicheEtEtapesAjustage } from '../models/FicheEtEtapesAjustage'
import type { PaginatedAffectationAjustageDetailList } from '../models/PaginatedAffectationAjustageDetailList'
import type { PaginatedAffectationMachineDetailList } from '../models/PaginatedAffectationMachineDetailList'
import type { PaginatedClientList } from '../models/PaginatedClientList'
import type { PaginatedEtatList } from '../models/PaginatedEtatList'
import type { PaginatedListZoneList } from '../models/PaginatedListZoneList'
import type { PatchedAffectationAjustageDetail } from '../models/PatchedAffectationAjustageDetail'
import type { PatchedAffectationMachineDetail } from '../models/PatchedAffectationMachineDetail'
import type { PatchedClient } from '../models/PatchedClient'
import type { PatchedEtapeCreate } from '../models/PatchedEtapeCreate'
import type { User } from '../models/User'

import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'

export class ApiService {
	/**
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedAffectationAjustageDetailList
	 * @throws ApiError
	 */
	public static apiAffectationsAjustagesList(
		page?: number
	): CancelablePromise<PaginatedAffectationAjustageDetailList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/affectations/ajustages/',
			query: {
				page: page,
			},
		})
	}

	/**
	 * @param requestBody
	 * @returns AffectationAjustageDetail
	 * @throws ApiError
	 */
	public static apiAffectationsAjustagesCreate(
		requestBody: AffectationAjustageDetail
	): CancelablePromise<AffectationAjustageDetail> {
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/affectations/ajustages/',
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * @param id
	 * @returns AffectationAjustageDetail
	 * @throws ApiError
	 */
	public static apiAffectationsAjustagesRetrieve(
		id: number
	): CancelablePromise<AffectationAjustageDetail> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/affectations/ajustages/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * @param id
	 * @param requestBody
	 * @returns AffectationAjustageDetail
	 * @throws ApiError
	 */
	public static apiAffectationsAjustagesUpdate(
		id: number,
		requestBody: AffectationAjustageDetail
	): CancelablePromise<AffectationAjustageDetail> {
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/affectations/ajustages/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * @param id
	 * @param requestBody
	 * @returns AffectationAjustageDetail
	 * @throws ApiError
	 */
	public static apiAffectationsAjustagesPartialUpdate(
		id: number,
		requestBody?: PatchedAffectationAjustageDetail
	): CancelablePromise<AffectationAjustageDetail> {
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/affectations/ajustages/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * @param id
	 * @returns void
	 * @throws ApiError
	 */
	public static apiAffectationsAjustagesDestroy(
		id: number
	): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/affectations/ajustages/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedAffectationMachineDetailList
	 * @throws ApiError
	 */
	public static apiAffectationsMachinesList(
		page?: number
	): CancelablePromise<PaginatedAffectationMachineDetailList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/affectations/machines/',
			query: {
				page: page,
			},
		})
	}

	/**
	 * @param requestBody
	 * @returns AffectationMachineDetail
	 * @throws ApiError
	 */
	public static apiAffectationsMachinesCreate(
		requestBody: AffectationMachineDetail
	): CancelablePromise<AffectationMachineDetail> {
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/affectations/machines/',
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * @param id
	 * @returns AffectationMachineDetail
	 * @throws ApiError
	 */
	public static apiAffectationsMachinesRetrieve(
		id: number
	): CancelablePromise<AffectationMachineDetail> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/affectations/machines/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * @param id
	 * @param requestBody
	 * @returns AffectationMachineDetail
	 * @throws ApiError
	 */
	public static apiAffectationsMachinesUpdate(
		id: number,
		requestBody: AffectationMachineDetail
	): CancelablePromise<AffectationMachineDetail> {
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/affectations/machines/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * @param id
	 * @param requestBody
	 * @returns AffectationMachineDetail
	 * @throws ApiError
	 */
	public static apiAffectationsMachinesPartialUpdate(
		id: number,
		requestBody?: PatchedAffectationMachineDetail
	): CancelablePromise<AffectationMachineDetail> {
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/affectations/machines/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * @param id
	 * @returns void
	 * @throws ApiError
	 */
	public static apiAffectationsMachinesDestroy(
		id: number
	): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/affectations/machines/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedClientList
	 * @throws ApiError
	 */
	public static apiClientsList(
		page?: number
	): CancelablePromise<PaginatedClientList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/clients',
			query: {
				page: page,
			},
		})
	}

	/**
	 * @param requestBody
	 * @returns Client
	 * @throws ApiError
	 */
	public static apiClientsCreate(
		requestBody: Client
	): CancelablePromise<Client> {
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/clients',
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * @param id
	 * @returns Client
	 * @throws ApiError
	 */
	public static apiClientsRetrieve(id: number): CancelablePromise<Client> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/clients/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * @param id
	 * @param requestBody
	 * @returns Client
	 * @throws ApiError
	 */
	public static apiClientsUpdate(
		id: number,
		requestBody: Client
	): CancelablePromise<Client> {
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/clients/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * @param id
	 * @param requestBody
	 * @returns Client
	 * @throws ApiError
	 */
	public static apiClientsPartialUpdate(
		id: number,
		requestBody?: PatchedClient
	): CancelablePromise<Client> {
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/clients/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * @param id
	 * @returns void
	 * @throws ApiError
	 */
	public static apiClientsDestroy(id: number): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/clients/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * @param requestBody
	 * @returns EtapeCreate
	 * @throws ApiError
	 */
	public static apiEtapesCreate(
		requestBody: EtapeCreate
	): CancelablePromise<EtapeCreate> {
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/etapes/',
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * @param id
	 * @returns EtapeCreate
	 * @throws ApiError
	 */
	public static apiEtapesRetrieve(
		id: number
	): CancelablePromise<EtapeCreate> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/etapes/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * @param id
	 * @param requestBody
	 * @returns EtapeCreate
	 * @throws ApiError
	 */
	public static apiEtapesUpdate(
		id: number,
		requestBody: EtapeCreate
	): CancelablePromise<EtapeCreate> {
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/etapes/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * @param id
	 * @param requestBody
	 * @returns EtapeCreate
	 * @throws ApiError
	 */
	public static apiEtapesPartialUpdate(
		id: number,
		requestBody?: PatchedEtapeCreate
	): CancelablePromise<EtapeCreate> {
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/etapes/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * @param id
	 * @returns void
	 * @throws ApiError
	 */
	public static apiEtapesDestroy(id: number): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/etapes/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedEtatList
	 * @throws ApiError
	 */
	public static apiEtatsList(
		page?: number
	): CancelablePromise<PaginatedEtatList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/etats',
			query: {
				page: page,
			},
		})
	}

	/**
	 * @param id
	 * @returns Etat
	 * @throws ApiError
	 */
	public static apiEtatsRetrieve(id: number): CancelablePromise<Etat> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/etats/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * @param id
	 * @returns void
	 * @throws ApiError
	 */
	public static apiFichesDestroy(id: number): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/fiches/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * @param id
	 * @returns FicheEtEtapesAjustage
	 * @throws ApiError
	 */
	public static apiFichesEtapesRetrieve(
		id: number
	): CancelablePromise<FicheEtEtapesAjustage> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/fiches/etapes/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * @returns User
	 * @throws ApiError
	 */
	public static apiUserRetrieve(): CancelablePromise<User> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/user',
		})
	}

	/**
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedListZoneList
	 * @throws ApiError
	 */
	public static apiZonesList(
		page?: number
	): CancelablePromise<PaginatedListZoneList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/zones/',
			query: {
				page: page,
			},
		})
	}
}
