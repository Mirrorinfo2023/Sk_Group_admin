import { ALERT_FAILED, ALERT_SUCCESS, ALERT_CLEAR } from './../action_types';

const initialState = {
    type: null,
    message: null
}

const AlertHandler = (state = initialState, action) => {

    switch (action.type) {
        case ALERT_CLEAR:
            return {
                ...state,
                type: null,
                message: null
            }
        case ALERT_SUCCESS:
            return {
                ...state,
                type: action.payload,
                message: action.message
            }
        case ALERT_FAILED:
            return {
                ...state,
                type: action.payload,
                message: action.message
            }
        default:
            return state;
    }
}

export default AlertHandler;