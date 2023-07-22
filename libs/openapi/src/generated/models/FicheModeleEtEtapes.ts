/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EtapeModeleDetail } from './EtapeModeleDetail'

export type FicheModeleEtEtapes = {
	readonly id: number
	readonly etapes_modele: Array<EtapeModeleDetail>
	readonly date_creation: string
	titre?: string
	description?: string | null
	fourniture?: boolean
}
