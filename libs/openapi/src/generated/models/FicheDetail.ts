/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AffectationAjustageDetail } from './AffectationAjustageDetail';

export type FicheDetail = {
    readonly id: number;
    readonly avancement_fiche: number;
    readonly affectation_zone: AffectationAjustageDetail;
    readonly affaire_description: string | null;
    readonly num_affaire: number | null;
    readonly affaire_id: number;
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

