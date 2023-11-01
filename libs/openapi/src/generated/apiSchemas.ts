/**
 * Generated by @openapi-codegen
 *
 * @version 1.0.0
 */
/**
 * Serializer pour l'affichage des affaires
 */
export type AffaireDetails = {
	id: number
	/**
	 * @minimum 0
	 */
	num_affaire?: number | null
	validation_ingenieur?: boolean
	en_retard: boolean
	couleur_affichage: string
	/**
	 * @maxLength 10000
	 */
	description?: string | null
	/**
	 * @maxLength 1000
	 */
	observation?: string | null
	/**
	 * @maxLength 200
	 */
	client?: string | null
	/**
	 * @format decimal
	 * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
	 */
	montant?: string | null
	statut?: StatutEnum
	/**
	 * @format date
	 */
	date_rendu?: string | null
	/**
	 * @format date-time
	 */
	date_modification: string
	/**
	 * @format date
	 */
	date_cloture?: string | null
	charge_affaire_detail: CustomUserDetail
	/**
	 * @format double
	 * @maximum 1
	 * @minimum 0
	 * @default 0
	 */
	avancement_affaire: number
	/**
	 * @format double
	 */
	cout_affaire: number
	temps_ajustage: number
	temps_machine: number
	temps_restant: number
	nombre_fiches: number
}

/**
 * Serializer pour l'affichage des affaires
 */
export type AffaireDetailsRequest = {
	/**
	 * @minimum 0
	 */
	num_affaire?: number | null
	validation_ingenieur?: boolean
	/**
	 * @maxLength 10000
	 */
	description?: string | null
	/**
	 * @maxLength 1000
	 */
	observation?: string | null
	/**
	 * @maxLength 200
	 */
	client?: string | null
	/**
	 * @format decimal
	 * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
	 */
	montant?: string | null
	statut?: StatutEnum
	/**
	 * @format date
	 */
	date_rendu?: string | null
	/**
	 * @format date
	 */
	date_cloture?: string | null
}

/**
 * Serializer pour récupérer une affaire avec ses fiches
 */
export type AffaireFiches = {
	id: number
	/**
	 * @minimum 0
	 */
	num_affaire?: number | null
	validation_ingenieur?: boolean
	fiches: FicheDetail[]
	charge_affaire_detail: CustomUserDetail
}

/**
 * Serializer pour récupérer une affaire avec ses fiches et ses étapes
 */
export type AffaireFichesEtapes = {
	id: number
	/**
	 * @minimum 0
	 */
	num_affaire?: number | null
	validation_ingenieur?: boolean
	/**
	 * @maxLength 10000
	 */
	description?: string | null
	fiches: FicheEtEtapes[]
	charge_affaire_detail: CustomUserDetail
}

/**
 * Serializer permettant de récuper uniquement l'id et le numéro d'affaire
 */
export type AffaireNumAffaire = {
	id: number
	/**
	 * @minimum 0
	 */
	num_affaire?: number | null
}

/**
 * Serializer pour les statistiques des affaires.
 *   on y retrouve
 *     - le nombre d'affaires par statut
 *     - nombre d'affaires terminées cette semaine
 *     - nombre d'affaires en retard
 */
export type AffaireStatsGlobal = {
	par_statut: {
		[key: string]: number
	}
	terminees_cette_semaine: number
	terminees_semaine_der: number
	en_retard: number
}

/**
 * Serializer pour l'affectation d'un ajustage à une étape
 */
export type AffectationAjustageCreate = {
	id: number
	etape?: number
	zone?: number
	/**
	 * @format date
	 */
	semaine_affectation: string
	previous?: number | null
}

/**
 * Serializer pour l'affectation d'un ajustage à une étape
 */
export type AffectationAjustageCreateRequest = {
	etape?: number
	zone?: number
	/**
	 * @format date
	 */
	semaine_affectation: string
	previous?: number | null
}

/**
 * Serializer pour la mise à jour d'une affectation d'ajustage
 */
export type AffectationAjustageUpdate = {
	id: number
	user?: number | null
	zone?: number
	previous?: number | null
}

/**
 * Serializer pour l'affectation d'une machine à une étape
 */
export type AffectationMachineCreate = {
	id: number
	/**
	 * @format date
	 */
	semaine_affectation: string
	user?: number | null
	previous?: number | null
	machine?: number
	etape?: number
}

/**
 * Serializer pour l'affectation d'une machine à une étape
 */
export type AffectationMachineCreateRequest = {
	/**
	 * @format date
	 */
	semaine_affectation: string
	user?: number | null
	previous?: number | null
	machine?: number
	etape?: number
}

/**
 * Serializer pour la mise à jour d'une affectation de machine
 */
export type AffectationMachineUpdate = {
	id: number
	user?: number | null
	machine?: number
	previous?: number | null
}

export type BulkDeleteRequest = {
	/**
	 * Liste des ids des objets à supprimer
	 */
	ids: number[]
}

export type CustomUserDetail = {
	id: number
	/**
	 * @format email
	 * @maxLength 254
	 */
	email: string
	/**
	 * @maxLength 200
	 */
	name?: string | null
	/**
	 * @maxLength 200
	 */
	surname?: string | null
}

export type CustomUserDetailRequest = {
	/**
	 * @format email
	 * @minLength 1
	 * @maxLength 254
	 */
	email: string
	/**
	 * @maxLength 200
	 */
	name?: string | null
	/**
	 * @maxLength 200
	 */
	surname?: string | null
}

/**
 * test
 */
export type CustomUserGroups = {
	/**
	 * @format email
	 * @maxLength 254
	 */
	email: string
	/**
	 * @maxLength 200
	 */
	name?: string | null
	/**
	 * @maxLength 200
	 */
	surname?: string | null
	groups: string[]
}

export type Etape = {
	id: number
	num_etape: number
}

export type EtapeCreate = {
	id: number
	num_etape: number
	terminee?: boolean
	/**
	 * @maxLength 10000
	 */
	description?: string
	/**
	 * @maxLength 2000
	 */
	ref_doc?: string | null
	/**
	 * @maxLength 2000
	 */
	nom_piece?: string | null
	quantite?: number
	temps?: number
	/**
	 * @maxLength 2000
	 */
	plan?: string | null
	/**
	 * @maxLength 2000
	 */
	rep?: string | null
	/**
	 * @format date
	 */
	date_creation: string
	/**
	 * @format date-time
	 */
	date_modification: string
	/**
	 * @format date
	 */
	date_cloture?: string | null
	fiche: number
	groupe_machine?: number | null
}

export type EtapeCreateRequest = {
	num_etape: number
	terminee?: boolean
	/**
	 * @minLength 1
	 * @maxLength 10000
	 */
	description?: string
	/**
	 * @maxLength 2000
	 */
	ref_doc?: string | null
	/**
	 * @maxLength 2000
	 */
	nom_piece?: string | null
	quantite?: number
	temps?: number
	/**
	 * @maxLength 2000
	 */
	plan?: string | null
	/**
	 * @maxLength 2000
	 */
	rep?: string | null
	/**
	 * @format date
	 */
	date_cloture?: string | null
	fiche: number
	groupe_machine?: number | null
}

export type EtapeDetail = {
	id: number
	machine: MachineDetail
	/**
	 * @format double
	 */
	cout_etape: number
	deja_planifiee: boolean
	num_etape: number
	terminee?: boolean
	/**
	 * @maxLength 10000
	 */
	description?: string
	/**
	 * @maxLength 2000
	 */
	ref_doc?: string | null
	/**
	 * @maxLength 2000
	 */
	nom_piece?: string | null
	quantite?: number
	temps?: number
	/**
	 * @maxLength 2000
	 */
	plan?: string | null
	/**
	 * @maxLength 2000
	 */
	rep?: string | null
	/**
	 * @format date
	 */
	date_creation: string
	/**
	 * @format date-time
	 */
	date_modification: string
	/**
	 * @format date
	 */
	date_cloture?: string | null
	fiche: number
	groupe_machine?: number | null
}

export type EtapeDetailAjustage = {
	id: number
	affectation_id: number
	user_id: number
	/**
	 * @format double
	 */
	cout_etape: number
	num_etape: number
	terminee?: boolean
	/**
	 * @maxLength 10000
	 */
	description?: string
	/**
	 * @maxLength 2000
	 */
	ref_doc?: string | null
	/**
	 * @maxLength 2000
	 */
	nom_piece?: string | null
	quantite?: number
	temps?: number
	/**
	 * @maxLength 2000
	 */
	plan?: string | null
	/**
	 * @maxLength 2000
	 */
	rep?: string | null
	/**
	 * @format date
	 */
	date_creation: string
	/**
	 * @format date-time
	 */
	date_modification: string
	/**
	 * @format date
	 */
	date_cloture?: string | null
	fiche: number
	groupe_machine?: number | null
}

export type EtapeDetailMachine = {
	id: number
	affectation_id: number
	user_id: number
	num_etape: number
	terminee?: boolean
	/**
	 * @maxLength 10000
	 */
	description?: string
	/**
	 * @maxLength 2000
	 */
	ref_doc?: string | null
	/**
	 * @maxLength 2000
	 */
	nom_piece?: string | null
	quantite?: number
	temps?: number
	/**
	 * @maxLength 2000
	 */
	plan?: string | null
	/**
	 * @maxLength 2000
	 */
	rep?: string | null
	/**
	 * @format date
	 */
	date_creation: string
	/**
	 * @format date-time
	 */
	date_modification: string
	/**
	 * @format date
	 */
	date_cloture?: string | null
	fiche: number
	groupe_machine?: number | null
}

export type EtapeModeleDetail = {
	id: number
	machine: MachineDetail
	/**
	 * @format double
	 */
	cout_etape: number
	num_etape: number
	quantite?: number
	temps?: number
	/**
	 * @maxLength 2000
	 */
	plan?: string | null
	/**
	 * @maxLength 2000
	 */
	rep?: string | null
	terminee?: boolean
	/**
	 * @maxLength 10000
	 */
	description?: string
	/**
	 * @format date
	 */
	date_creation: string
	/**
	 * @format date-time
	 */
	date_modification: string
	fiche_modele: number
	groupe_machine?: number | null
}

export type EtapeModeleDetailRequest = {
	num_etape: number
	quantite?: number
	temps?: number
	/**
	 * @maxLength 2000
	 */
	plan?: string | null
	/**
	 * @maxLength 2000
	 */
	rep?: string | null
	terminee?: boolean
	/**
	 * @minLength 1
	 * @maxLength 10000
	 */
	description?: string
	fiche_modele: number
	groupe_machine?: number | null
}

export type EtapeModeleListCreate = {
	id: number
	/**
	 * @format double
	 */
	cout_etape: number
	num_etape: number
	quantite?: number
	temps?: number
	/**
	 * @maxLength 2000
	 */
	plan?: string | null
	/**
	 * @maxLength 2000
	 */
	rep?: string | null
	terminee?: boolean
	/**
	 * @maxLength 10000
	 */
	description?: string
	/**
	 * @format date
	 */
	date_creation: string
	/**
	 * @format date-time
	 */
	date_modification: string
	fiche_modele: number
	groupe_machine?: number | null
}

export type EtapeModeleListCreateRequest = {
	num_etape: number
	quantite?: number
	temps?: number
	/**
	 * @maxLength 2000
	 */
	plan?: string | null
	/**
	 * @maxLength 2000
	 */
	rep?: string | null
	terminee?: boolean
	/**
	 * @minLength 1
	 * @maxLength 10000
	 */
	description?: string
	fiche_modele: number
	groupe_machine?: number | null
}

export type FicheCRUD = {
	id: number
	/**
	 * @format double
	 * @maximum 1
	 * @minimum 0
	 * @default 0
	 */
	avancement_fiche: number
	/**
	 * @maxLength 100
	 */
	titre?: string
	description?: string | null
	/**
	 * @maxLength 1000
	 */
	observation?: string | null
	/**
	 * @maxLength 200
	 */
	ref_doc?: string | null
	terminee?: boolean
	fourniture?: boolean
	/**
	 * @format date
	 */
	date_creation: string
	/**
	 * @format date-time
	 */
	date_modification: string
	/**
	 * @format date
	 */
	date_cloture?: string | null
	affaire: number
}

export type FicheCRUDRequest = {
	/**
	 * @minLength 1
	 * @maxLength 100
	 */
	titre?: string
	description?: string | null
	/**
	 * @maxLength 1000
	 */
	observation?: string | null
	/**
	 * @maxLength 200
	 */
	ref_doc?: string | null
	terminee?: boolean
	fourniture?: boolean
	/**
	 * @format date
	 */
	date_cloture?: string | null
	affaire: number
}

export type FicheDetail = {
	id: number
	/**
	 * @format double
	 * @maximum 1
	 * @minimum 0
	 * @default 0
	 */
	avancement_fiche: number
	/**
	 * Serializer pour l'affectation d'un ajustage à une étape
	 */
	affectation_zone: AffectationAjustageCreate
	affaire_description: string | null
	/**
	 * @minimum 0
	 */
	num_affaire: number | null
	affaire_id: number
	/**
	 * @format double
	 */
	cout_fiche: number
	/**
	 * @maxLength 100
	 */
	titre?: string
	description?: string | null
	/**
	 * @maxLength 1000
	 */
	observation?: string | null
	/**
	 * @maxLength 200
	 */
	ref_doc?: string | null
	terminee?: boolean
	fourniture?: boolean
	/**
	 * @format date
	 */
	date_creation: string
	/**
	 * @format date-time
	 */
	date_modification: string
	/**
	 * @format date
	 */
	date_cloture?: string | null
	affaire: number
}

export type FicheEtEtapes = {
	id: number
	/**
	 * @format double
	 * @maximum 1
	 * @minimum 0
	 * @default 0
	 */
	avancement_fiche: number
	/**
	 * Serializer pour l'affectation d'un ajustage à une étape
	 */
	affectation_zone: AffectationAjustageCreate
	affaire_description: string | null
	/**
	 * @minimum 0
	 */
	num_affaire: number | null
	affaire_id: number
	/**
	 * @format double
	 */
	cout_fiche: number
	etapes: EtapeDetail[]
	/**
	 * @maxLength 100
	 */
	titre?: string
	description?: string | null
	/**
	 * @maxLength 1000
	 */
	observation?: string | null
	/**
	 * @maxLength 200
	 */
	ref_doc?: string | null
	terminee?: boolean
	fourniture?: boolean
	/**
	 * @format date
	 */
	date_creation: string
	/**
	 * @format date-time
	 */
	date_modification: string
	/**
	 * @format date
	 */
	date_cloture?: string | null
	affaire: number
}

export type FicheEtEtapesAjustage = {
	id: number
	/**
	 * @format double
	 * @maximum 1
	 * @minimum 0
	 * @default 0
	 */
	avancement_fiche: number
	/**
	 * Serializer pour l'affectation d'un ajustage à une étape
	 */
	affectation_zone: AffectationAjustageCreate
	affaire_description: string | null
	/**
	 * @minimum 0
	 */
	num_affaire: number | null
	affaire_id: number
	/**
	 * @format double
	 */
	cout_fiche: number
	etapes: EtapeDetailAjustage[]
	nombre_etapes: number
	temps_total: number
	/**
	 * @maxLength 100
	 */
	titre?: string
	description?: string | null
	/**
	 * @maxLength 1000
	 */
	observation?: string | null
	/**
	 * @maxLength 200
	 */
	ref_doc?: string | null
	terminee?: boolean
	fourniture?: boolean
	/**
	 * @format date
	 */
	date_creation: string
	/**
	 * @format date-time
	 */
	date_modification: string
	/**
	 * @format date
	 */
	date_cloture?: string | null
	affaire: number
}

export type FicheModeleDetail = {
	id: number
	/**
	 * @format double
	 */
	cout_fiche: number
	/**
	 * @format date
	 */
	date_creation: string
	/**
	 * @maxLength 100
	 */
	titre?: string
	description?: string | null
	fourniture?: boolean
}

export type FicheModeleDetailRequest = {
	/**
	 * @minLength 1
	 * @maxLength 100
	 */
	titre?: string
	description?: string | null
	fourniture?: boolean
}

export type FicheModeleEtEtapes = {
	id: number
	/**
	 * @format double
	 */
	cout_fiche: number
	etapes_modele: EtapeModeleDetail[]
	/**
	 * @format date
	 */
	date_creation: string
	/**
	 * @maxLength 100
	 */
	titre?: string
	description?: string | null
	fourniture?: boolean
}

export type FicheModeleEtEtapesRequest = {
	/**
	 * @minLength 1
	 * @maxLength 100
	 */
	titre?: string
	description?: string | null
	fourniture?: boolean
}

export type FicheModeleOptions = {
	value: string
	name: string
}

export type GroupeMachine = {
	id: number
	/**
	 * @maxLength 300
	 */
	nom_groupe: string
	prix_theorique?: number
}

export type GroupeMachineRequest = {
	/**
	 * @minLength 1
	 * @maxLength 300
	 */
	nom_groupe: string
	prix_theorique?: number
}

export type ListZone = {
	id: number
	/**
	 * @maxLength 200
	 */
	nom: string
	/**
	 * @maxLength 1000
	 */
	description: string
}

export type ListZoneRequest = {
	/**
	 * @minLength 1
	 * @maxLength 200
	 */
	nom: string
	/**
	 * @minLength 1
	 * @maxLength 1000
	 */
	description: string
}

export type MachineDetail = {
	id: number
	/**
	 * @maxLength 100
	 */
	nom_machine: string
	/**
	 * @maxLength 1000
	 */
	description?: string | null
	fonctionnelle?: boolean
	est_active?: boolean
	groupe_machine?: number | null
}

export type MachineDetailRequest = {
	/**
	 * @minLength 1
	 * @maxLength 100
	 */
	nom_machine: string
	/**
	 * @maxLength 1000
	 */
	description?: string | null
	fonctionnelle?: boolean
	est_active?: boolean
	groupe_machine?: number | null
}

export type NoteCreate = {
	id: number
	contenu: string
	/**
	 * @format date-time
	 */
	date_creation: string
	affaire: number
}

export type NoteCreateRequest = {
	/**
	 * @minLength 1
	 */
	contenu: string
	affaire: number
}

export type NoteDetail = {
	id: number
	user: string | null
	contenu: string
	/**
	 * @format date-time
	 */
	date_creation: string
}

export type NoteDetailRequest = {
	/**
	 * @minLength 1
	 */
	contenu: string
}

export type PaginatedAffaireDetailsList = {
	/**
	 * @example 123
	 */
	count?: number
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=4
	 */
	next?: string | null
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=2
	 */
	previous?: string | null
	results?: AffaireDetails[]
}

export type PaginatedAffaireNumAffaireList = {
	/**
	 * @example 123
	 */
	count?: number
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=4
	 */
	next?: string | null
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=2
	 */
	previous?: string | null
	results?: AffaireNumAffaire[]
}

export type PaginatedEtapeModeleListCreateList = {
	/**
	 * @example 123
	 */
	count?: number
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=4
	 */
	next?: string | null
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=2
	 */
	previous?: string | null
	results?: EtapeModeleListCreate[]
}

export type PaginatedFicheModeleDetailList = {
	/**
	 * @example 123
	 */
	count?: number
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=4
	 */
	next?: string | null
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=2
	 */
	previous?: string | null
	results?: FicheModeleDetail[]
}

export type PaginatedFicheModeleOptionsList = {
	/**
	 * @example 123
	 */
	count?: number
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=4
	 */
	next?: string | null
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=2
	 */
	previous?: string | null
	results?: FicheModeleOptions[]
}

export type PaginatedGroupeMachineList = {
	/**
	 * @example 123
	 */
	count?: number
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=4
	 */
	next?: string | null
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=2
	 */
	previous?: string | null
	results?: GroupeMachine[]
}

export type PaginatedListZoneList = {
	/**
	 * @example 123
	 */
	count?: number
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=4
	 */
	next?: string | null
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=2
	 */
	previous?: string | null
	results?: ListZone[]
}

export type PaginatedMachineDetailList = {
	/**
	 * @example 123
	 */
	count?: number
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=4
	 */
	next?: string | null
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=2
	 */
	previous?: string | null
	results?: MachineDetail[]
}

export type PaginatedReadPointageList = {
	/**
	 * @example 123
	 */
	count?: number
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=4
	 */
	next?: string | null
	/**
	 * @format uri
	 * @example http://api.example.org/accounts/?page=2
	 */
	previous?: string | null
	results?: ReadPointage[]
}

/**
 * Serializer pour l'affichage des affaires
 */
export type PatchedAffaireDetailsRequest = {
	/**
	 * @minimum 0
	 */
	num_affaire?: number | null
	validation_ingenieur?: boolean
	/**
	 * @maxLength 10000
	 */
	description?: string | null
	/**
	 * @maxLength 1000
	 */
	observation?: string | null
	/**
	 * @maxLength 200
	 */
	client?: string | null
	/**
	 * @format decimal
	 * @pattern ^-?\d{0,8}(?:\.\d{0,2})?$
	 */
	montant?: string | null
	statut?: StatutEnum
	/**
	 * @format date
	 */
	date_rendu?: string | null
	/**
	 * @format date
	 */
	date_cloture?: string | null
}

/**
 * Serializer pour la mise à jour d'une affectation d'ajustage
 */
export type PatchedAffectationAjustageUpdateRequest = {
	user?: number | null
	zone?: number
	previous?: number | null
}

/**
 * Serializer pour la mise à jour d'une affectation de machine
 */
export type PatchedAffectationMachineUpdateRequest = {
	user?: number | null
	machine?: number
	previous?: number | null
}

export type PatchedEtapeCreateRequest = {
	num_etape?: number
	terminee?: boolean
	/**
	 * @minLength 1
	 * @maxLength 10000
	 */
	description?: string
	/**
	 * @maxLength 2000
	 */
	ref_doc?: string | null
	/**
	 * @maxLength 2000
	 */
	nom_piece?: string | null
	quantite?: number
	temps?: number
	/**
	 * @maxLength 2000
	 */
	plan?: string | null
	/**
	 * @maxLength 2000
	 */
	rep?: string | null
	/**
	 * @format date
	 */
	date_cloture?: string | null
	fiche?: number
	groupe_machine?: number | null
}

export type PatchedEtapeModeleDetailRequest = {
	num_etape?: number
	quantite?: number
	temps?: number
	/**
	 * @maxLength 2000
	 */
	plan?: string | null
	/**
	 * @maxLength 2000
	 */
	rep?: string | null
	terminee?: boolean
	/**
	 * @minLength 1
	 * @maxLength 10000
	 */
	description?: string
	fiche_modele?: number
	groupe_machine?: number | null
}

export type PatchedFicheCRUDRequest = {
	/**
	 * @minLength 1
	 * @maxLength 100
	 */
	titre?: string
	description?: string | null
	/**
	 * @maxLength 1000
	 */
	observation?: string | null
	/**
	 * @maxLength 200
	 */
	ref_doc?: string | null
	terminee?: boolean
	fourniture?: boolean
	/**
	 * @format date
	 */
	date_cloture?: string | null
	affaire?: number
}

export type PatchedFicheModeleEtEtapesRequest = {
	/**
	 * @minLength 1
	 * @maxLength 100
	 */
	titre?: string
	description?: string | null
	fourniture?: boolean
}

export type PatchedGroupeMachineRequest = {
	/**
	 * @minLength 1
	 * @maxLength 300
	 */
	nom_groupe?: string
	prix_theorique?: number
}

export type PatchedListZoneRequest = {
	/**
	 * @minLength 1
	 * @maxLength 200
	 */
	nom?: string
	/**
	 * @minLength 1
	 * @maxLength 1000
	 */
	description?: string
}

export type PatchedMachineDetailRequest = {
	/**
	 * @minLength 1
	 * @maxLength 100
	 */
	nom_machine?: string
	/**
	 * @maxLength 1000
	 */
	description?: string | null
	fonctionnelle?: boolean
	est_active?: boolean
	groupe_machine?: number | null
}

export type PatchedNoteDetailRequest = {
	/**
	 * @minLength 1
	 */
	contenu?: string
}

/**
 * Serializer pour la planification d'une machine.
 */
export type PlanningMachine = {
	id: number
	/**
	 * @maxLength 100
	 */
	nom_machine: string
	fonctionnelle?: boolean
	heures_travail_dispo: number
	heures_travail_affectees: number
	affectations: TotalAffaire[]
}

/**
 * Serializer pour la planification d'une zone.
 */
export type PlanningZone = {
	id: number
	/**
	 * @maxLength 200
	 */
	nom: string
	heures_travail_dispo: number
	heures_travail_affectees: number
	affectations: TotalAffaireAjustage[]
}

/**
 * Serializer pour les pointages,
 */
export type Pointage = {
	etape: number
	/**
	 * @default false
	 */
	terminer_etape?: boolean
}

/**
 * Serializer pour les pointages,
 */
export type PointageRequest = {
	etape: number
	/**
	 * @default false
	 */
	terminer_etape?: boolean
}

/**
 * Serializer pour les pointages en lecture
 */
export type ReadPointage = {
	id: number
	user: string
	etape: Etape
	en_cours: boolean
	/**
	 * @format float
	 */
	duree: number
	/**
	 * @format date-time
	 */
	date_debut: string
	/**
	 * @format date-time
	 */
	date_fin?: string | null
}

export type StatutEnum =
	| 'S00'
	| 'A00'
	| 'EHA'
	| 'EAA'
	| 'EAC'
	| 'P00'
	| 'T00'
	| 'E00'
	| 'ECC'
	| 'INT'
	| 'ECA'
	| 'ED'
	| 'D00'
	| 'G00'
	| 'SV0'
	| 'EST'
	| 'ECH'

export type TokenObtainPair = {
	access: string
	refresh: string
}

export type TokenObtainPairRequest = {
	/**
	 * @minLength 1
	 */
	email: string
	/**
	 * @minLength 1
	 */
	password: string
}

export type TokenRefresh = {
	access: string
}

export type TokenRefreshRequest = {
	/**
	 * @minLength 1
	 */
	refresh: string
}

export type TotalAffaire = {
	id: number
	/**
	 * @minimum 0
	 */
	num_affaire?: number | null
	fiches: TotalFichePlanning[]
}

export type TotalAffaireAjustage = {
	id: number
	/**
	 * @minimum 0
	 */
	num_affaire?: number | null
	fiches: TotalFichePlanningAjustage[]
}

export type TotalFichePlanning = {
	id: number
	/**
	 * @maxLength 100
	 */
	titre?: string
	/**
	 * @format double
	 * @maximum 1
	 * @minimum 0
	 * @default 0
	 */
	avancement_fiche: number
	etapes: EtapeDetailMachine[]
}

export type TotalFichePlanningAjustage = {
	id: number
	/**
	 * @maxLength 100
	 */
	titre?: string
	/**
	 * @format double
	 * @maximum 1
	 * @minimum 0
	 * @default 0
	 */
	avancement_fiche: number
	etapes: EtapeDetailAjustage[]
}
