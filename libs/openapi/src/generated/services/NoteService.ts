/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NoteCreate } from '../models/NoteCreate';
import type { NoteDetail } from '../models/NoteDetail';
import type { PatchedNoteDetail } from '../models/PatchedNoteDetail';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NoteService {

    /**
     * Créer une Note
     * Permet de créer une nouvelle note
     * @param requestBody
     * @returns NoteCreate
     * @throws ApiError
     */
    public static apiNotesCreate(
        requestBody: NoteCreate,
    ): CancelablePromise<NoteCreate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notes/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Détails et Modification de la Note
     * Permet de récupérer, modifier ou supprimer une note existante
     * @param id
     * @returns NoteDetail
     * @throws ApiError
     */
    public static apiNotesRetrieve(
        id: number,
    ): CancelablePromise<NoteDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notes/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Détails et Modification de la Note
     * Permet de récupérer, modifier ou supprimer une note existante
     * @param id
     * @param requestBody
     * @returns NoteDetail
     * @throws ApiError
     */
    public static apiNotesUpdate(
        id: number,
        requestBody: NoteDetail,
    ): CancelablePromise<NoteDetail> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/notes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Détails et Modification de la Note
     * Permet de récupérer, modifier ou supprimer une note existante
     * @param id
     * @param requestBody
     * @returns NoteDetail
     * @throws ApiError
     */
    public static apiNotesPartialUpdate(
        id: number,
        requestBody?: PatchedNoteDetail,
    ): CancelablePromise<NoteDetail> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/notes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Détails et Modification de la Note
     * Permet de récupérer, modifier ou supprimer une note existante
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static apiNotesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/notes/{id}',
            path: {
                'id': id,
            },
        });
    }

}
