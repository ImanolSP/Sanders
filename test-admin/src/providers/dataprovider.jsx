// src/providers/dataprovider.jsx

import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = 'https://localhost:3000';

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

        // Mapear `_id` a `id` en cada registro
        const data = json.map(record => {
            const { _id, ...rest } = record;
            return { id: _id, ...rest };
        });

        return {
            data: data,
            total: total,
        };
    },

    getOne: async (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        const { json } = await httpClient(url);

        // Mapear `_id` a `id`
        const { _id, ...rest } = json;
        const transformedData = { id: _id, ...rest };

        return { data: transformedData };
    },

    getMany: async (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url, { signal: params.signal });

        // Mapear `_id` a `id` en cada registro
        const data = json.map(record => {
            const { _id, ...rest } = record;
            return { id: _id, ...rest };
        });

        return { data: data };
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

        // Mapear `_id` a `id` en cada registro
        const data = json.map(record => {
            const { _id, ...rest } = record;
            return { id: _id, ...rest };
        });

        return {
            data: data,
            total: total,
        };
    },

    create: async (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        const { json } = await httpClient(url, {
            method: 'POST',
            body: JSON.stringify(params.data),
        });

        // Mapear `_id` a `id`
        const { _id, ...rest } = json;
        const transformedData = { id: _id, ...rest };

        return { data: transformedData };
    },

    update: async (resource, params) => {
        let url;
        let options = {
            method: 'PUT',
            body: JSON.stringify(params.data),
        };

        if (resource === 'usuarios' || resource === 'donaciones') {
            // Send request to /usuarios or /donaciones without ID in URL, ID in body
            url = `${apiUrl}/${resource}`;

            // Include ID in params.data
            const dataWithId = { ...params.data, id: params.id };
            options.body = JSON.stringify(dataWithId);
        } else {
            // For other resources, include ID in URL
            url = `${apiUrl}/${resource}/${params.id}`;
        }

        const { json } = await httpClient(url, options);

        // Mapear `_id` a `id`
        const { _id, ...rest } = json;
        const transformedData = { id: _id || params.id, ...rest };

        return { data: transformedData };
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

        // Mapear `_id` a `id` en cada registro
        const data = json.map(record => {
            const { _id, ...rest } = record;
            return { id: _id, ...rest };
        });

        return { data: data };
    },

    delete: async (resource, params) => {
        let url;
        let options = {
            method: 'DELETE',
        };

        if (resource === 'usuarios' || resource === 'donaciones') {
            // Send request to /usuarios or /donaciones without ID in URL, ID in body
            url = `${apiUrl}/${resource}`;
            // Include ID in body
            options.body = JSON.stringify({ id: params.id });
        } else {
            // For other resources, include ID in URL
            url = `${apiUrl}/${resource}/${params.id}`;
        }

        const { json } = await httpClient(url, options);

        // Mapear `_id` a `id`
        const { _id, ...rest } = json || {};
        const transformedData = { id: _id || params.id, ...rest };

        return { data: transformedData };
    },

    deleteMany: async (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json } = await httpClient(url, {
            method: 'DELETE',
        });

        // Mapear `_id` a `id` en cada registro
        const data = json.map(record => {
            const { _id, ...rest } = record;
            return { id: _id, ...rest };
        });

        return { data: data };
    },
};