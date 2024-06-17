
async function session_route_mgmt(req, res, next) {
    try {
        if (req.session.user) {
            next();
        }else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
    }
}

async function session_login_mgmt(req, res, next) {
    try {
        if (req.session.user) {
            res.redirect('/poppy');
        }else {
            next();
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    session_route_mgmt,
    session_login_mgmt
};