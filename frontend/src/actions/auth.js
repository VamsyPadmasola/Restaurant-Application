import axios from "axios";
import { useCallback } from "react";
import {useNavigate}from "react-router-dom";

export const handleLogin = (details, callback) => {
   
    return async(dispatch) => {
        try{
            const response = await axios.post(`http://127.0.0.1:8000/api/auth/token/login`,{
                password: details.password,
                username: details.username
            })
            console.log(response)
            dispatch({
                type : 'LOGIN',
                payload :  response.data
            })
            return callback(response.data)
        }
        catch(error){
            console.log(error);
            return callback({
                error : true,
                response : error.response
            })
        }
    }   
}
