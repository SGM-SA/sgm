/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkDelete } from '../models/BulkDelete';
import type { FicheCRUD } from '../models/FicheCRUD';
import type { PatchedFicheCRUD } from '../models/PatchedFicheCRUD';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FicheService {

    /**
     * Création d'une fiche
     * Permet de créer une fiche
     * @param requestBody
     * @returns FicheCRUD
     * @throws ApiError
     */
    public static apiFichesCreate(
        requestBody: FicheCRUD,
    ): CancelablePromise<FicheCRUD> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/fiches/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Récupérer une fiche
     * Cette opération permet de récupérer une fiche spécifique en utilisant son ID.
     * @param id
     * @returns FicheCRUD
     * @throws ApiError
     */
    public static apiFichesRetrieve(
        id: number,
    ): CancelablePromise<FicheCRUD> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fiches/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Mettre à jour une fiche
     * Cette opération permet de mettre à jour une fiche spécifique en utilisant son ID.
     * @param id
     * @param requestBody
     * @returns FicheCRUD
     * @throws ApiError
     */
    public static apiFichesUpdate(
        id: number,
        requestBody: FicheCRUD,
    ): CancelablePromise<FicheCRUD> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/fiches/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Mise à jour partielle d'une fiche
     * Cette opération permet de mettre à jour partiellement une fiche spécifique en utilisant son ID.
     * @param id
     * @param requestBody
     * @returns FicheCRUD
     * @throws ApiError
     */
    public static apiFichesPartialUpdate(
        id: number,
        requestBody?: PatchedFicheCRUD,
    ): CancelablePromise<FicheCRUD> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/fiches/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Bulk delete de fiches
     * Permet de supprimer plusieurs fiches en même temps
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static apiFichesDeleteCreate(
        requestBody: BulkDelete,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/fiches/delete/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `No response body`,
            },
        });
    }

}
