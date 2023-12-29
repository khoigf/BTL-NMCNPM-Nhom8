const path = require('path');
const express = require('express');

const configViewEngine = (app)=> {
    app.set('views', path.join('views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join('public')));
    app.use('/static', express.static(path.join('/public', 'image')))
}

module.exports = configViewEngine;