// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
	| `/`
	| `/affaires`
	| `/affaires/:numAffaire`
	| `/affaires/:numAffaire/fiches/:id`
	| `/auth/login`
	| `/auth/logout`
	| `/machines`
	| `/modeles`
	| `/planning/machines`
	| `/planning/zones`
	| `/zones`

export type Params = {
	'/affaires/:numAffaire': { numAffaire: string }
	'/affaires/:numAffaire/fiches/:id': { numAffaire: string; id: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<
	Path,
	Params,
	ModalPath
>()
export const { redirect } = utils<Path, Params>()
