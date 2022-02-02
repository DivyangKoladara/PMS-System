exports.success = function(res, payload, extra) {
    return res.json({
        status: true,
        ...extra,
        data: payload
    });
}

exports.fail =function (res,error,status= 500){
        let message = "";
        if (typeof error === 'object') {    
            if(Object.keys(error)[0]){
                message = error[ Object.keys(error)[ 0 ] ][0];
            }    
        } 
        if (typeof error === 'String') { 
            message = error;
            
        }
        return res.status(status).json({
            status:false,
            message:message
        }) ;
}

exports.httpCode = {
    'BAD_REQUEST': 400,
     'OK': 200,
     'CONTINUE': 100,
     'INTERNAL_SERVER_ERROR': 500,
     'NOT_FOUND': 404,
}