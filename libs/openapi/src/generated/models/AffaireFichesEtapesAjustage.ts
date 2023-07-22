/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FicheEtEtapesAjustage } from './FicheEtEtapesAjustage';

/**
 * Serializer pour récupérer une affaire avec ses fiches et ses étapes ajustage
 */
export type AffaireFichesEtapesAjustage = {
    readonly id: number;
    num_affaire?: number | null;
    description?: string | null;
    readonly fiches: Array<FicheEtEtapesAjustage>;
    readonly charge_affaire: string;
};

