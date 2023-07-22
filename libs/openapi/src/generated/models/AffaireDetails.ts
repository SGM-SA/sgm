/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BlankEnum } from './BlankEnum'
import type { NullEnum } from './NullEnum'
import type { Salarie } from './Salarie'
import type { StatutEnum } from './StatutEnum'

/**
 * Serializer pour l'affichage des affaires
 */
export type AffaireDetails = {
	readonly id: number
	num_affaire?: number | null
	description?: string | null
	observation?: string | null
	client?: string | null
	montant?: string | null
	statut?: (StatutEnum | BlankEnum | NullEnum) | null
	date_rendu?: string | null
	readonly date_modification: string
	date_cloture?: string | null
	readonly charge_affaire_detail: Salarie
	readonly avancement_affaire: number
}
