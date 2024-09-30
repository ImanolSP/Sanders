// src/providers/dataprovider.jsx

import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = 'https://localhost:3000';
//const httpClient = fetchUtils.fetchJson;

// Modifica el httpClient para incluir el token
const httpClient = (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }
    return fetchUtils.fetchJson(url, options);
};


export const basedatos = {
    getList: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { headers, json } = await httpClient(url, { signal: params.signal });

        if (!headers.has('content-range') && !headers.has('x-total-count')) {
            throw new Error('La respuesta de la API debe contener el header "Content-Range" o "X-Total-Count".');
        }

        const total = headers.has('content-range')
            ? parseInt(headers.get('content-range').split('/').pop(), 10)
            : parseInt(headers.get('x-total-count'), 10);

        return {
            data: json.map(record => ({ ...record })),
            total: total,
        };
    },

    getOne: async (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        const { json } = await httpClient(url);
    
        // Map the `_id` field to `id` for React Admin
        const transformedData = { ...json, id: json._id };
        delete transformedData._id;
    
        return { data: transformedData };
    },

    getMany: async (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url, { signal: params.signal });
        return { data: json };
    },

    getManyReference: async (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { headers, json } = await httpClient(url, { signal: params.signal });

        if (!headers.has('content-range') && !headers.has('x-total-count')) {
            throw new Error('La respuesta de la API debe contener el header "Content-Range" o "X-Total-Count".');
        }

        const total = headers.has('content-range')
            ? parseInt(headers.get('content-range').split('/').pop(), 10)
            : parseInt(headers.get('x-total-count'), 10);

        return {
            data: json,
            total: total,
        };
    },

    create: async (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        const { json } = await httpClient(url, {
            method: 'POST',
            body: JSON.stringify(params.data),
        });

        return { data: { ...json } };
    },

    update: async (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify({
                id: params.id,
                ...params.data,
            }),
        });

        return { data: json };
    },

    updateMany: async (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify({
                ids: params.ids,
                ...params.data,
            }),
        });
        return { data: json };
    },

    delete: async (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        const { json } = await httpClient(url, {
            method: 'DELETE',
            body: JSON.stringify({ id: params.id }),
        });
        return { data: json };
    },

    deleteMany: async (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        const { json } = await httpClient(url, {
            method: 'DELETE',
            body: JSON.stringify({ ids: params.ids }),
        });
        return { data: json };
    },
};