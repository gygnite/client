'use strict';
var request = require('superagent');
require('superagent-auth-bearer')(request);
var Cache = require('lscache');
var Promise = require('bluebird');

function notify(type, text, slug_to_notify) {
    return new Promise(function(resolve, reject) {
        request.post(BASE_URL+'/api/admins/notifications')
            .authBearer(Cache.get(ACTIONS.cache.AUTH_TOKEN))
            .send({
                type: type,
                text: text,
                slug_to_notify: slug_to_notify
            }).end(function(err, res) {
                console.log("err,res??",err,res)
                if (!err || !res.body.error) {
                    resolve({
                        error: false,
                        data: res.body
                    });
                } else {
                    reject({
                        error: true,
                        message: 'Unable to send notification'
                    });
                }
            });
    });

}




module.exports = notify;
