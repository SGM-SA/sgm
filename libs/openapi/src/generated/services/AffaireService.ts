/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AffaireDetails } from '../models/AffaireDetails';
import type { AffaireFiches } from '../models/AffaireFiches';
import type { PaginatedAffaireDetailsList } from '../models/PaginatedAffaireDetailsList';
import type { PaginatedAffaireNumAffaireList } from '../models/PaginatedAffaireNumAffaireList';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AffaireService {

    /**
     * Affaire
     * Liste des affaires
     * @param numAffaire Numéro de l'affaire
     * @param ordering Champ de tri
     * @param page Numéro de la page
     * @param perPage Nombre d'affaires par page
     * @param search Recherche dans les champs num_affaire, client, description
     * @param statut Statut de l'affaire
     * @returns PaginatedAffaireDetailsList
     * @throws ApiError
     */
    public static apiAffairesList(
        numAffaire?: string,
        ordering?: string,
        page?: string,
        perPage?: string,
        search?: string,
        statut?: 'A00' | 'D00' | 'E00' | 'EAA' | 'EAC' | 'ECA' | 'ECC' | 'ECH' | 'ED' | 'EHA' | 'EST' | 'G00' | 'INT' | 'P00' | 'S00' | 'SV0' | 'T00',
    ): CancelablePromise<PaginatedAffaireDetailsList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/affaires/',
            query: {
                'num_affaire': numAffaire,
                'ordering': ordering,
                'page': page,
                'per_page': perPage,
                'search': search,
                'statut': statut,
            },
        });
    }

    /**
     * Affaire
     * Création affaire
     * @param requestBody
     * @returns AffaireDetails
     * @throws ApiError
     */
    public static apiAffairesCreate(
        requestBody?: AffaireDetails,
    ): CancelablePromise<AffaireDetails> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/affaires/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Affaire
     * Permet de récupérer une affaire
     * @param id
     * @returns AffaireDetails
     * @throws ApiError
     */
    public static apiAffairesRetrieve(
        id: number,
    ): CancelablePromise<AffaireDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/affaires/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Affaire et Fiches
     * Permet de récupérer une affaire avec ses fiches
     * @param id
     * @returns AffaireFiches
     * @throws ApiError
     */
    public static apiAffairesFichesRetrieve(
        id: number,
    ): CancelablePromise<AffaireFiches> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/affaires/{id}/fiches',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Affaire
     * Permet de une liste de numéro d'affaire avec un numéro d'affaire
     * @param page A page number within the paginated result set.
     * @param search Recherche dans les champs num_affaire
     * @returns PaginatedAffaireNumAffaireList
     * @throws ApiError
     */
    public static apiAffairesNumsList(
        page?: number,
        search?: string,
    ): CancelablePromise<PaginatedAffaireNumAffaireList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/affaires/nums',
            query: {
                'page': page,
                'search': search,
            },
        });
    }

}
