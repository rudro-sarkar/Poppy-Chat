
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

const loadLoginPage = async (req, res) => {
    try {
        res.render('login', { message: '' });
    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    try {
        const { account_identifier, password:entered_password } = req.body;
        let searched_data;
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(account_identifier)) {
            searched_data = await userModel.findOne({ email: account_identifier });
        } else {
            searched_data = await userModel.findOne({ poppy_id: account_identifier });
        }
        if (searched_data) {
            let hash_status = await bcrypt.compare(entered_password, searched_data.password);
            if (hash_status) {
                req.session.user = searched_data;
                res.redirect('/poppy');
            } else {
                res.render('login', { message: 'Invalid Credentials!' });

            }
        } else {
            res.render('login', { message: 'Invalid Credentials!' });
        }
    } catch (error) {
        console.log(error);
    }
}

const logout = async (req, res) => {
    req.session.destroy();
    red.redirect('/login');
}

const loadDashboard = async (req, res) => {
    res.render('poppy', { data: req.session.user });
}

module.exports = {
    loadLoginPage,
    login,
    logout,
    loadDashboard
}