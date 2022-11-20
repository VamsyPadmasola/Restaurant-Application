import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const createMenuItem = async (formData) => {
    const token = getToken()
    try {
        const { data } = await client.post("/menu/create", formData, {
            headers: {
                authorization: "Bearer " + token,
                "content-type": "multipart/form-data",
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

export const getMenu = async (pageNo, limit) => {
    const token = getToken()
    try {
        const { data } = await client(`/menu/items?pageNo=${pageNo}&limit=${limit}`, {
            // headers: {
            //     authorization: "Bearer " + token,
            //     "content-type": "multipart/form-data",
            // },
        });
        return data;
    } catch (error) {
        return catchError(error)
    }
}

export const searchMenu = async (query) => {
    const token = getToken()
    try {
        const { data } = await client(`/menu/search?name=${query}`, {
            headers: {
                authorization: "Bearer " + token,
            },
        });
        return data;
    } catch (error) {
        return catchError(error)
    }
}

// export const searchActor = async (query) => {
//     const token = getToken()
//     try {
//         const { data } = await client(`/actor/search?name=${query}`, {
//             headers: {
//                 authorization: "Bearer " + token,
//             },
//         });
//         return data;
//     } catch (error) {
//         return catchError(error)
//     }
// }

export const updateMenuItem = async (id, formData) => {
    const token = getToken()
    try {
        const { data } = await client.post("/menu/update/" + id, formData, {
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

export const deleteMenuItem = async (id) => {
    const token = getToken()
    try {
        const { data } = await client.delete("/menu/" + id, {
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

// export const getActorProfile = async (id) => {
//     const token = getToken()
//     try {
//         const { data } = await client(`/actor/single/${id}`);
//         return data;
//     } catch (error) {
//         return catchError(error)
//     }
// }