/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FicheDetail } from './FicheDetail'
import type { Salarie } from './Salarie'

/**
 * Serializer pour récupérer une affaire avec ses fiches
 */
export type AffaireFiches = {
	readonly id: number
	num_affaire?: number | null
	readonly fiches: Array<FicheDetail>
	readonly charge_affaire_detail: Salarie
}
