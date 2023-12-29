const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const express = require('express');

const middleware = (app)=>{
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use(session({
        secret : 'Khoi',
        cookie : {maxAge : 60000},
        saveUninitialized : false,
        resave : false
    }));

    app.use(flash());
}

module.exports = middleware;