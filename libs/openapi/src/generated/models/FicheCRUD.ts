/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type FicheCRUD = {
    readonly id: number;
    readonly avancement_fiche: number;
    titre?: string;
    description?: string | null;
    observation?: string | null;
    ref_doc?: string | null;
    terminee?: boolean;
    fourniture?: boolean;
    readonly date_creation: string;
    readonly date_modification: string;
    date_cloture?: string | null;
    affaire: number;
};

