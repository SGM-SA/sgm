/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MachineDetail } from './MachineDetail';

export type EtapeModeleDetail = {
    readonly id: number;
    readonly machine: MachineDetail;
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
    groupe_machine?: number | null;
};

