import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const createDelivery = async (formData) => {
    const token = getToken()
    try {
        const { data } = await client.post("/delivery/create", formData, {
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

export const getDelivery = async () => {
    const token = getToken()
    try {
        const { data } = await client(`/delivery/deliverys`, {
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

export const searchDelivery = async (query) => {
    const token = getToken()
    try {
        const { data } = await client(`/delivery/search?name=${query}`, {
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error)
    }
}

export const updateDelivery = async (id, formData) => {
    const token = getToken()
    try {
        const { data } = await client.post("/delivery/update/" + id, formData, {
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

export const deleteDelivery = async (id) => {
    const token = getToken()
    try {
        const { data } = await client.delete("/delivery/" + id, {
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

