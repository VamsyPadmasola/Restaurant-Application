const authReducer = (state = {}, action) => {
    const {payload, type} = action

    switch(type){
        case 'LOGIN' : {
            return payload
        }
        default : return state;
    }
}
export default authReducer;