/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedSalarieFormOptionsList } from '../models/PaginatedSalarieFormOptionsList';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SalarieService {

    /**
     * Salarie form options
     * Permet de récupérer les options pour les formulaires
     * @param page A page number within the paginated result set.
     * @returns PaginatedSalarieFormOptionsList
     * @throws ApiError
     */
    public static apiSalariesFormOptionsList(
        page?: number,
    ): CancelablePromise<PaginatedSalarieFormOptionsList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/salaries/form-options',
            query: {
                'page': page,
            },
        });
    }

}
