/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkDelete } from '../models/BulkDelete';
import type { GroupeMachine } from '../models/GroupeMachine';
import type { PaginatedGroupeMachineList } from '../models/PaginatedGroupeMachineList';
import type { PatchedGroupeMachine } from '../models/PatchedGroupeMachine';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GroupeMachineService {

    /**
     * Lister tous les GroupesMachine
     * Cette opération permet de récupérer la liste de tous les GroupesMachine.
     * @param page A page number within the paginated result set.
     * @returns PaginatedGroupeMachineList
     * @throws ApiError
     */
    public static apiGroupeMachineList(
        page?: number,
    ): CancelablePromise<PaginatedGroupeMachineList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/groupe_machine/',
            query: {
                'page': page,
            },
        });
    }

    /**
     * Créer un nouveau GroupeMachine
     * Cette opération permet de créer un nouveau GroupeMachine.
     * @param requestBody
     * @returns GroupeMachine
     * @throws ApiError
     */
    public static apiGroupeMachineCreate(
        requestBody: GroupeMachine,
    ): CancelablePromise<GroupeMachine> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/groupe_machine/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Récupérer un GroupeMachine
     * Cette opération permet de récupérer un GroupeMachine spécifique en utilisant son ID.
     * @param id
     * @returns GroupeMachine
     * @throws ApiError
     */
    public static apiGroupeMachineRetrieve(
        id: number,
    ): CancelablePromise<GroupeMachine> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/groupe_machine/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Mettre à jour un GroupeMachine
     * Cette opération permet de mettre à jour un GroupeMachine spécifique en utilisant son ID.
     * @param id
     * @param requestBody
     * @returns GroupeMachine
     * @throws ApiError
     */
    public static apiGroupeMachineUpdate(
        id: number,
        requestBody: GroupeMachine,
    ): CancelablePromise<GroupeMachine> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/groupe_machine/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Mise à jour partielle d'un GroupeMachine
     * Cette opération permet de mettre à jour partiellement un GroupeMachine spécifique en utilisant son ID.
     * @param id
     * @param requestBody
     * @returns GroupeMachine
     * @throws ApiError
     */
    public static apiGroupeMachinePartialUpdate(
        id: number,
        requestBody?: PatchedGroupeMachine,
    ): CancelablePromise<GroupeMachine> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/groupe_machine/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Supprimer un GroupeMachine
     * Cette opération permet de supprimer un GroupeMachine spécifique en utilisant son ID.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static apiGroupeMachineDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/groupe_machine/{id}/',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Bulk delete de GroupeMachine
     * Permet de supprimer plusieurs GroupeMachines en même temps
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static apiGroupeMachineDeleteCreate(
        requestBody: BulkDelete,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/groupe_machine/delete/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `No response body`,
            },
        });
    }

}
