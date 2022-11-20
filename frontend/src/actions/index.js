export const addItemhandler  = item => {
    return dispatch => {
        dispatch({
            type : "ADD_ITEM",
            payload : {
                item : item
            }
        })
    }
}

export const removeItemhandler  = id => {
    return dispatch => {
        dispatch({
            type : "REMOVE_ITEM",
            payload : {
                id : id
            }
        })
    }
}