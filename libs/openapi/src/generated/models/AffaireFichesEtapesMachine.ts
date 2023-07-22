/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FicheEtEtapesMachine } from './FicheEtEtapesMachine'

/**
 * Serializer pour récupérer une affaire avec ses fiches et ses étapes machine
 */
export type AffaireFichesEtapesMachine = {
	readonly id: number
	num_affaire?: number | null
	description?: string | null
	readonly fiches: Array<FicheEtEtapesMachine>
	readonly charge_affaire: string
}
