/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EtapeService {

    /**
     * Suppression
     * Bulk delete des étapes
     * @param ids Liste des ids des étapes à supprimer
     * @returns void
     * @throws ApiError
     */
    public static apiEtapesDeleteDestroy(
        ids: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/etapes/delete',
            query: {
                'ids': ids,
            },
        });
    }

}
