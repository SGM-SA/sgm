/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AffaireFichesEtapesMachine } from './AffaireFichesEtapesMachine';

/**
 * Serializer pour la planification d'une machine.
 */
export type PlanningMachine = {
    readonly id: number;
    nom_machine: string;
    readonly affaires: Array<AffaireFichesEtapesMachine>;
};

