/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EtapeModeleDetail } from '../models/EtapeModeleDetail';
import type { EtapeModeleListCreate } from '../models/EtapeModeleListCreate';
import type { PaginatedEtapeModeleListCreateList } from '../models/PaginatedEtapeModeleListCreateList';
import type { PatchedEtapeModeleDetail } from '../models/PatchedEtapeModeleDetail';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EtapeModeleService {

    /**
     * Etape Modele
     * Permet de récupérer une liste d'étape modèle
     * @param page A page number within the paginated result set.
     * @returns PaginatedEtapeModeleListCreateList
     * @throws ApiError
     */
    public static apiModelesEtapesList(
        page?: number,
    ): CancelablePromise<PaginatedEtapeModeleListCreateList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/modeles/etapes/',
            query: {
                'page': page,
            },
        });
    }

    /**
     * Etape Modele
     * Permet de récupérer une liste d'étape modèle
     * @param requestBody
     * @returns EtapeModeleListCreate
     * @throws ApiError
     */
    public static apiModelesEtapesCreate(
        requestBody: EtapeModeleListCreate,
    ): CancelablePromise<EtapeModeleListCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/modeles/etapes/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Etape Modele
     * gestion étape modèle
     * @param id
     * @returns EtapeModeleDetail
     * @throws ApiError
     */
    public static apiModelesEtapesRetrieve(
        id: number,
    ): CancelablePromise<EtapeModeleDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/modeles/etapes/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Etape Modele
     * gestion étape modèle
     * @param id
     * @param requestBody
     * @returns EtapeModeleDetail
     * @throws ApiError
     */
    public static apiModelesEtapesUpdate(
        id: number,
        requestBody: EtapeModeleDetail,
    ): CancelablePromise<EtapeModeleDetail> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/modeles/etapes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Etape Modele
     * gestion étape modèle
     * @param id
     * @param requestBody
     * @returns EtapeModeleDetail
     * @throws ApiError
     */
    public static apiModelesEtapesPartialUpdate(
        id: number,
        requestBody?: PatchedEtapeModeleDetail,
    ): CancelablePromise<EtapeModeleDetail> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/modeles/etapes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Etape Modele
     * gestion étape modèle
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static apiModelesEtapesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/modeles/etapes/{id}',
            path: {
                'id': id,
            },
        });
    }

}
