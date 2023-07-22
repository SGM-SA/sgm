/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EtapeModeleDetail } from '../models/EtapeModeleDetail'
import type { EtapeModeleListCreate } from '../models/EtapeModeleListCreate'
import type { FicheModeleDetail } from '../models/FicheModeleDetail'
import type { FicheModeleEtEtapes } from '../models/FicheModeleEtEtapes'
import type { PaginatedEtapeModeleListCreateList } from '../models/PaginatedEtapeModeleListCreateList'
import type { PaginatedFicheModeleDetailList } from '../models/PaginatedFicheModeleDetailList'
import type { PaginatedFicheModeleOptionsList } from '../models/PaginatedFicheModeleOptionsList'
import type { PatchedEtapeModeleDetail } from '../models/PatchedEtapeModeleDetail'
import type { PatchedFicheModeleEtEtapes } from '../models/PatchedFicheModeleEtEtapes'

import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'

export class ModeleService {
	/**
	 * Etape Modele
	 * Permet de récupérer une liste d'étape modèle
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedEtapeModeleListCreateList
	 * @throws ApiError
	 */
	public static apiModelesEtapesList(
		page?: number
	): CancelablePromise<PaginatedEtapeModeleListCreateList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/modeles/etapes/',
			query: {
				page: page,
			},
		})
	}

	/**
	 * Etape Modele
	 * Permet de récupérer une liste d'étape modèle
	 * @param requestBody
	 * @returns EtapeModeleListCreate
	 * @throws ApiError
	 */
	public static apiModelesEtapesCreate(
		requestBody: EtapeModeleListCreate
	): CancelablePromise<EtapeModeleListCreate> {
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/modeles/etapes/',
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * Etape Modele
	 * gestion étape modèle
	 * @param id
	 * @returns EtapeModeleDetail
	 * @throws ApiError
	 */
	public static apiModelesEtapesRetrieve(
		id: number
	): CancelablePromise<EtapeModeleDetail> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/modeles/etapes/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * Etape Modele
	 * gestion étape modèle
	 * @param id
	 * @param requestBody
	 * @returns EtapeModeleDetail
	 * @throws ApiError
	 */
	public static apiModelesEtapesUpdate(
		id: number,
		requestBody: EtapeModeleDetail
	): CancelablePromise<EtapeModeleDetail> {
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/modeles/etapes/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * Etape Modele
	 * gestion étape modèle
	 * @param id
	 * @param requestBody
	 * @returns EtapeModeleDetail
	 * @throws ApiError
	 */
	public static apiModelesEtapesPartialUpdate(
		id: number,
		requestBody?: PatchedEtapeModeleDetail
	): CancelablePromise<EtapeModeleDetail> {
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/modeles/etapes/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * Etape Modele
	 * gestion étape modèle
	 * @param id
	 * @returns void
	 * @throws ApiError
	 */
	public static apiModelesEtapesDestroy(id: number): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/modeles/etapes/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * Fiche Modele
	 * Permet de récupérer une liste de fiches modèle
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedFicheModeleDetailList
	 * @throws ApiError
	 */
	public static apiModelesFichesList(
		page?: number
	): CancelablePromise<PaginatedFicheModeleDetailList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/modeles/fiches/',
			query: {
				page: page,
			},
		})
	}

	/**
	 * Fiche Modele
	 * Permet de créer une fiche modèle
	 * @param requestBody
	 * @returns FicheModeleDetail
	 * @throws ApiError
	 */
	public static apiModelesFichesCreate(
		requestBody?: FicheModeleDetail
	): CancelablePromise<FicheModeleDetail> {
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/modeles/fiches/',
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * Fiche Modele
	 * Permet de gérer une fiche modèle
	 * @param id
	 * @returns FicheModeleEtEtapes
	 * @throws ApiError
	 */
	public static apiModelesFichesRetrieve(
		id: number
	): CancelablePromise<FicheModeleEtEtapes> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/modeles/fiches/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * Fiche Modele
	 * Permet de gérer une fiche modèle
	 * @param id
	 * @param requestBody
	 * @returns FicheModeleEtEtapes
	 * @throws ApiError
	 */
	public static apiModelesFichesUpdate(
		id: number,
		requestBody?: FicheModeleEtEtapes
	): CancelablePromise<FicheModeleEtEtapes> {
		return __request(OpenAPI, {
			method: 'PUT',
			url: '/api/modeles/fiches/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * Fiche Modele
	 * Permet de gérer une fiche modèle
	 * @param id
	 * @param requestBody
	 * @returns FicheModeleEtEtapes
	 * @throws ApiError
	 */
	public static apiModelesFichesPartialUpdate(
		id: number,
		requestBody?: PatchedFicheModeleEtEtapes
	): CancelablePromise<FicheModeleEtEtapes> {
		return __request(OpenAPI, {
			method: 'PATCH',
			url: '/api/modeles/fiches/{id}',
			path: {
				id: id,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * Fiche Modele
	 * Permet de gérer une fiche modèle
	 * @param id
	 * @returns void
	 * @throws ApiError
	 */
	public static apiModelesFichesDestroy(id: number): CancelablePromise<void> {
		return __request(OpenAPI, {
			method: 'DELETE',
			url: '/api/modeles/fiches/{id}',
			path: {
				id: id,
			},
		})
	}

	/**
	 * Copie Fiche Modele
	 * Permet de copier une fiche modèle vers une affaire
	 * @param affaire id de l'affaire vers laquelle copier la fiche modèle
	 * @param modele id de la fiche modèle à copier
	 * @param requestBody
	 * @returns FicheModeleEtEtapes
	 * @throws ApiError
	 */
	public static apiModelesFichesCopyCreate(
		affaire: number,
		modele: number,
		requestBody?: FicheModeleEtEtapes
	): CancelablePromise<FicheModeleEtEtapes> {
		return __request(OpenAPI, {
			method: 'POST',
			url: '/api/modeles/fiches/copy',
			query: {
				affaire: affaire,
				modele: modele,
			},
			body: requestBody,
			mediaType: 'application/json',
		})
	}

	/**
	 * Fiche Modele Titre
	 * Permet de récupérer les titres des fiches modèle sous formes d'options pour un select
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedFicheModeleOptionsList
	 * @throws ApiError
	 */
	public static apiModelesFichesOptionsList(
		page?: number
	): CancelablePromise<PaginatedFicheModeleOptionsList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/modeles/fiches/options',
			query: {
				page: page,
			},
		})
	}
}
