/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MachineDetail } from './MachineDetail';

export type EtapeDetailMachine = {
    readonly id: number;
    readonly machine: MachineDetail;
    readonly affectation_id: number;
    readonly salarie_id: number;
    num_etape: number;
    terminee?: boolean;
    description?: string | null;
    ref_doc?: string | null;
    nom_piece?: string | null;
    quantite?: number;
    temps?: number;
    plan?: string | null;
    rep?: string | null;
    readonly date_creation: string;
    readonly date_modification: string;
    date_cloture?: string | null;
    fiche: number;
};

