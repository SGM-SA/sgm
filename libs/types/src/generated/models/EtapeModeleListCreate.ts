/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EtapeModeleListCreate = {
    readonly id: number;
    num_etape: number;
    quantite?: number;
    temps?: number;
    plan?: string | null;
    rep?: string | null;
    terminee?: boolean;
    description?: string | null;
    readonly date_creation: string;
    readonly date_modification: string;
    fiche_modele: number;
    machine: number;
};

