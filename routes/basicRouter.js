

const basic_router = require("express").Router();

basic_router.get('/', (req, res) => {
    res.render('home');
});

basic_router.get('/release_notes', (req, res) => {
    res.render('release_notes', {version: '1.0'});
});

basic_router.get('/bye', (req, res ) => {
    res.render('bye');
});

basic_router.get('/tmc', (req, res) => {
    res.render('terms_conds'); 
});

basic_router.get('/termsndconds', (req, res) => {
    res.render('terms_conds.ejs');
});

module.exports = basic_router;
