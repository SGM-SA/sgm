/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AffaireFichesEtapesAjustage } from './AffaireFichesEtapesAjustage'

/**
 * Serializer pour la planification d'une zone.
 */
export type PlanningZone = {
	readonly id: number
	nom: string
	description: string
	readonly affaires: Array<AffaireFichesEtapesAjustage>
}
