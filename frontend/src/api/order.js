import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const createorder = async (formData) => {
    const token = getToken()
    try {
        const { data } = await client.post("/order/create", formData, {
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

export const getOrders = async () => {
    const token = getToken()
    try {
        const { data } = await client(`/order/orders`, {
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

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}


export const handlePayment = async (formData) => {

    const token = getToken()
    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }
    try {
        const { data } = await client.post("/payment/orders", formData, {
            headers: {
                authorization: "Bearer " + token,
                // "content-type": "multipart/form-data",
            },
            // onUploadProgress: ({ loaded, total }) => {
            //     if (onUploadProgress)
            //     onUploadProgress(Math.floor((loaded / total) * 100));
            // },
        });
        return data
    } catch (error) {
        return catchError(error)
    }
}

export const initPayment = async (formData) => {
    const token = getToken()
    const { error, data } = await handlePayment(formData)
    if (error)
        return catchError(error)

    const options = {
        key: "rzp_test_AJCZIkM7K8zRsi",
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        handler: async (response) => {
            try {
                const { data } = await client.post("/payment/verify", response, {
                    headers: {
                        authorization: "Bearer " + token,
                        // "content-type": "multipart/form-data",
                    },
                    // onUploadProgress: ({ loaded, total }) => {
                    //     if (onUploadProgress)
                    //     onUploadProgress(Math.floor((loaded / total) * 100));
                    // },
                });
                return data
            } catch (error) {
                return catchError(error)
            }
        },
        theme: {
            color: '#E25A25'
        }
    }
    console.log("ok")
    const rzp1 = new window.Razorpay(options)
    rzp1.open()
}