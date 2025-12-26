import { ALERT_FAILED, ALERT_SUCCESS, ALERT_CLEAR } from './../action_types';

export const alertSuccess = (message) => ({
    type: ALERT_SUCCESS,
    payload: 'success',
    message: message
});

export const alertFailed = (message) => ({
    type: ALERT_FAILED,
    payload: 'failed',
    message: message
});

export const alertClear = () => ({
    type: ALERT_CLEAR,
    payload: 'clear',
    message: null
});

export const callAlert = (caseType) => {

    
    return async (dispatch) => {

        if(caseType.type === 'CLEAR'){
            alertClear();
        }else if(caseType.type === 'SUCCESS'){
            dispatch(alertSuccess(caseType.message));
        }else{
            dispatch(alertFailed(caseType.message));
        }

    }
}