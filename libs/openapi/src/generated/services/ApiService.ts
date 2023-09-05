/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AffectationAjustageDetail } from '../models/AffectationAjustageDetail';
import type { AffectationMachineDetail } from '../models/AffectationMachineDetail';
import type { FicheEtEtapesAjustage } from '../models/FicheEtEtapesAjustage';
import type { PaginatedAffectationAjustageDetailList } from '../models/PaginatedAffectationAjustageDetailList';
import type { PaginatedAffectationMachineDetailList } from '../models/PaginatedAffectationMachineDetailList';
import type { PaginatedListZoneList } from '../models/PaginatedListZoneList';
import type { PatchedAffectationAjustageDetail } from '../models/PatchedAffectationAjustageDetail';
import type { PatchedAffectationMachineDetail } from '../models/PatchedAffectationMachineDetail';
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ApiService {

    /**
     * @param page A page number within the paginated result set.
     * @returns PaginatedAffectationAjustageDetailList
     * @throws ApiError
     */
    public static apiAffectationsAjustagesList(
        page?: number,
    ): CancelablePromise<PaginatedAffectationAjustageDetailList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/affectations/ajustages/',
            query: {
                'page': page,
            },
        });
    }

    /**
     * @param requestBody
     * @returns AffectationAjustageDetail
     * @throws ApiError
     */
    public static apiAffectationsAjustagesCreate(
        requestBody: AffectationAjustageDetail,
    ): CancelablePromise<AffectationAjustageDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/affectations/ajustages/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns AffectationAjustageDetail
     * @throws ApiError
     */
    public static apiAffectationsAjustagesRetrieve(
        id: number,
    ): CancelablePromise<AffectationAjustageDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/affectations/ajustages/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns AffectationAjustageDetail
     * @throws ApiError
     */
    public static apiAffectationsAjustagesUpdate(
        id: number,
        requestBody: AffectationAjustageDetail,
    ): CancelablePromise<AffectationAjustageDetail> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/affectations/ajustages/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns AffectationAjustageDetail
     * @throws ApiError
     */
    public static apiAffectationsAjustagesPartialUpdate(
        id: number,
        requestBody?: PatchedAffectationAjustageDetail,
    ): CancelablePromise<AffectationAjustageDetail> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/affectations/ajustages/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static apiAffectationsAjustagesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/affectations/ajustages/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param page A page number within the paginated result set.
     * @returns PaginatedAffectationMachineDetailList
     * @throws ApiError
     */
    public static apiAffectationsMachinesList(
        page?: number,
    ): CancelablePromise<PaginatedAffectationMachineDetailList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/affectations/machines/',
            query: {
                'page': page,
            },
        });
    }

    /**
     * @param requestBody
     * @returns AffectationMachineDetail
     * @throws ApiError
     */
    public static apiAffectationsMachinesCreate(
        requestBody: AffectationMachineDetail,
    ): CancelablePromise<AffectationMachineDetail> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/affectations/machines/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns AffectationMachineDetail
     * @throws ApiError
     */
    public static apiAffectationsMachinesRetrieve(
        id: number,
    ): CancelablePromise<AffectationMachineDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/affectations/machines/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns AffectationMachineDetail
     * @throws ApiError
     */
    public static apiAffectationsMachinesUpdate(
        id: number,
        requestBody: AffectationMachineDetail,
    ): CancelablePromise<AffectationMachineDetail> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/affectations/machines/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @param requestBody
     * @returns AffectationMachineDetail
     * @throws ApiError
     */
    public static apiAffectationsMachinesPartialUpdate(
        id: number,
        requestBody?: PatchedAffectationMachineDetail,
    ): CancelablePromise<AffectationMachineDetail> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/affectations/machines/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static apiAffectationsMachinesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/affectations/machines/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static apiFichesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/fiches/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id
     * @returns FicheEtEtapesAjustage
     * @throws ApiError
     */
    public static apiFichesEtapesRetrieve(
        id: number,
    ): CancelablePromise<FicheEtEtapesAjustage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fiches/etapes/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @returns User
     * @throws ApiError
     */
    public static apiUserRetrieve(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user',
        });
    }

    /**
     * @param page A page number within the paginated result set.
     * @returns PaginatedListZoneList
     * @throws ApiError
     */
    public static apiZonesList(
        page?: number,
    ): CancelablePromise<PaginatedListZoneList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/zones/',
            query: {
                'page': page,
            },
        });
    }

}
