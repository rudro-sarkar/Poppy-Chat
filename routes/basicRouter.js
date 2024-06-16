

const basic_router = require("express").Router();

basic_router.get('/', (req, res) => {
    res.render('home');
});

basic_router.get('/release_notes', (req, res) => {
    res.render('release_notes', {version: '1.0'});
});

// basic_router.get("*", (req, res) => {
//     res.render('404notfound', {
//         error_name: "Page Not Found",
//         error_code: 404,
//         error_msg: "Sorry, the page you're looking for can't be found."
//     });
// });

module.exports = basic_router;
