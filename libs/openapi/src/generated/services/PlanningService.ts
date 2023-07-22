/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedAffaireFichesEtapesList } from '../models/PaginatedAffaireFichesEtapesList'
import type { PaginatedPlanningMachineList } from '../models/PaginatedPlanningMachineList'
import type { PaginatedPlanningZoneList } from '../models/PaginatedPlanningZoneList'

import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'

export class PlanningService {
	/**
	 * Permet de récupérer pour une semaine donnée, chaque affaires et leurs fiches / étapes ajustage à traiter dans chaque zone
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedAffaireFichesEtapesList
	 * @throws ApiError
	 */
	public static apiFichesAjustageAPlanifierList(
		page?: number
	): CancelablePromise<PaginatedAffaireFichesEtapesList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/fiches/ajustage/a_planifier',
			query: {
				page: page,
			},
		})
	}

	/**
	 * Permet de récupérer pour une semaine donnée, chaque affaires et leurs fiches / étapes machine à traiter
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedAffaireFichesEtapesList
	 * @throws ApiError
	 */
	public static apiFichesMachineAPlanifierList(
		page?: number
	): CancelablePromise<PaginatedAffaireFichesEtapesList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/fiches/machine/a_planifier',
			query: {
				page: page,
			},
		})
	}

	/**
	 * Planning machine avec fiches
	 * Permet de récupérer pour une semaine donnée, chaque affaires et leurs fiches à traiter pour chaque machine
	 * @param annee annee
	 * @param semaine numero semaine
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedPlanningMachineList
	 * @throws ApiError
	 */
	public static apiPlanningMachineList(
		annee: number,
		semaine: number,
		page?: number
	): CancelablePromise<PaginatedPlanningMachineList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/planning/machine',
			query: {
				annee: annee,
				page: page,
				semaine: semaine,
			},
		})
	}

	/**
	 * Permet de récupérer pour une année et semaine donnée, chaque affaires et leurs fiches à traiter dans chaque zone
	 * @param annee annee
	 * @param semaine numero semaine
	 * @param page A page number within the paginated result set.
	 * @returns PaginatedPlanningZoneList
	 * @throws ApiError
	 */
	public static apiPlanningZoneList(
		annee: number,
		semaine: number,
		page?: number
	): CancelablePromise<PaginatedPlanningZoneList> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/api/planning/zone',
			query: {
				annee: annee,
				page: page,
				semaine: semaine,
			},
		})
	}
}
