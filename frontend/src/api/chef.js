import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const createChef = async (formData) => {
    const token = getToken()
    try {
        const { data } = await client.post("/chef/create", formData, {
            headers: {
                authorization: "Bearer " + token,
                // "content-type": "multipart/form-data",
            },
            // onUploadProgress: ({ loaded, total }) => {
            //     if (onUploadProgress)
            //     onUploadProgress(Math.floor((loaded / total) * 100));
            // },
        });
        return data;
    } catch (error) {
        return catchError(error)
    }
}

export const getChefs = async () => {
    const token = getToken()
    try {
        const { data } = await client(`/chef/chefs`, {
            headers: {
                authorization: "Bearer " + token,
                "content-type": "multipart/form-data",
            },
        });
        return data;
    } catch (error) {
        return catchError(error)
    }
}

export const searchChef = async (query) => {
    const token = getToken()
    try {
        const { data } = await client(`/chef/search?name=${query}`, {
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error)
    }
}

export const updateChef = async (id, formData) => {
    const token = getToken()
    try {
        const { data } = await client.post("/chef/update/" + id, formData, {
            headers: {
                authorization: "Bearer " + token,
                // "content-type": "multipart/form-data",
            },
        });
        return data;
    } catch (error) {
        return catchError(error)
    }
}

export const deleteChef = async (id) => {
    const token = getToken()
    try {
        const { data } = await client.delete("/chef/" + id, {
            headers: {
                authorization: "Bearer " + token,
            },
            // onUploadProgress: ({ loaded, total }) => {
            //     if (onUploadProgress)
            //     onUploadProgress(Math.floor((loaded / total) * 100));
            // },
        });
        return data;
    } catch (error) {
        return catchError(error)
    }
}

