/**
 * Created by toddgeist on 3/30/15.
 */

'use strict'

var request = require('superagent');
var dbNamesRequest = require('./dbNamesRequest');
var database = require('./database');

var END_POINT = '/fmi/xml/fmresultset.xml'

const parseString = require('xml2js').parseString;
const parser = function (res, fn) {
    res.text = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) { res.text += chunk; });
    res.on('end', function () {
        let fmError, fmResult;
        try {
            parseString(res.text, (err, result) => { fmResult = !err ? result : null; });
        }
        catch (err) {
            fmError = fmResult ? err : null;
        }
        fn(fmError, fmResult);
    });
};

/**
 * creates a FMS Connection
 * @param options
 * @returns {{post: Request, query: Function}}
 */
var connection = function (options) {

    var url = options.url;
    var protocol = options.protocol || 'http';
    var userName = options.userName;
    var password = options.password;


    var createPostRequest = function () {
        var post = request
            .post(protocol + '://' + url + END_POINT)
            .auth(userName, password)
            .accept('xml')
            .buffer(true)
            .parse(parser);
        return post
    };

    var db = function (name) {
        return database(createPostRequest, name)
    }

    return {
        dbnames : function(){return dbNamesRequest( createPostRequest() )},
        db : db
    }

}

module.exports = {
    connection : connection
}