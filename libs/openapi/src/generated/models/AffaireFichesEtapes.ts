/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FicheEtEtapes } from './FicheEtEtapes'
import type { Salarie } from './Salarie'

/**
 * Serializer pour récupérer une affaire avec ses fiches et ses étapes
 */
export type AffaireFichesEtapes = {
	readonly id: number
	num_affaire?: number | null
	description?: string | null
	readonly fiches: Array<FicheEtEtapes>
	readonly charge_affaire_detail: Salarie
}
