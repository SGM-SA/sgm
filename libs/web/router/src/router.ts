// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
	| `/`
	| `/auth/login`
	| `/auth/logout`
	| `/dashboard`
	| `/dashboard/affaires`
	| `/dashboard/affaires/:numAffaire`
	| `/dashboard/affaires/:numAffaire/fiches/:id`

export type Params = {
	'/dashboard/affaires/:numAffaire': { numAffaire: string }
	'/dashboard/affaires/:numAffaire/fiches/:id': {
		numAffaire: string
		id: string
	}
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<
	Path,
	Params,
	ModalPath
>()
export const { redirect } = utils<Path, Params>()
