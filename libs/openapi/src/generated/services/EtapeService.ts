/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkDelete } from '../models/BulkDelete';
import type { EtapeCreate } from '../models/EtapeCreate';
import type { PatchedEtapeCreate } from '../models/PatchedEtapeCreate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EtapeService {

    /**
     * Creation d'Etape
     * @param requestBody
     * @returns EtapeCreate
     * @throws ApiError
     */
    public static apiEtapesCreate(
        requestBody: EtapeCreate,
    ): CancelablePromise<EtapeCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/etapes/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Gestion d'Etapes
     * @param id
     * @returns EtapeCreate
     * @throws ApiError
     */
    public static apiEtapesRetrieve(
        id: number,
    ): CancelablePromise<EtapeCreate> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/etapes/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Gestion d'Etapes
     * @param id
     * @param requestBody
     * @returns EtapeCreate
     * @throws ApiError
     */
    public static apiEtapesUpdate(
        id: number,
        requestBody: EtapeCreate,
    ): CancelablePromise<EtapeCreate> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/etapes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Gestion d'Etapes
     * @param id
     * @param requestBody
     * @returns EtapeCreate
     * @throws ApiError
     */
    public static apiEtapesPartialUpdate(
        id: number,
        requestBody?: PatchedEtapeCreate,
    ): CancelablePromise<EtapeCreate> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/etapes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Gestion d'Etapes
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static apiEtapesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/etapes/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Bulk delete d'Etapes
     * Bulk delete d'objets en fonction de leur id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static apiEtapesDeleteCreate(
        requestBody: BulkDelete,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/etapes/delete',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `No response body`,
            },
        });
    }

}
