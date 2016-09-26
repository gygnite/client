'use strict';

const express = require('express'),
    app = express(),
    path = require('path'),
    logger = require('morgan');


app.use(logger('dev'));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(function(req, res, next) {
    res.renderHTML = function(file) {
        res.sendFile(path.resolve(__dirname, './public/' + file + '.html'));
    };
    next();
});

app.get('*', function(req, res) {
    res.renderHTML('index');
});


app.listen(8081, function() {
    console.log("client server 8081");
});
