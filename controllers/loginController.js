
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
        const { account_identifier, password: entered_password } = req.body;
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
                res.redirect('/inbox');
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
    res.redirect('/login');
}

const loadDashboard = async (req, res) => {
    const data = {
        username: req.session.user.name,
        email: req.session.user.email,
        poppy_id: req.session.user.poppy_id,
        _id: req.session.user._id,
        created_at: req.session.user.createdAt
    }
    const searched_data = await userModel.findOne({ _id: data._id });
    const friend_list_array = searched_data.friends_list;
    const all_profiles = await userModel.find({ _id: { $nin: data._id } });
    let friend_list_accounts = [];
    for (elms in all_profiles) {
        if (friend_list_array.includes(all_profiles[elms].poppy_id)) {
            let friend_accounts = {
                username: all_profiles[elms].name,
                poppy_id: all_profiles[elms].poppy_id,
                status: all_profiles[elms].status
            }
            friend_list_accounts.push(friend_accounts);
        }
    }
    res.render('inbox', { data: data, friendListArray: friend_list_accounts });
}

const loadExplorePage = async (req, res) => {
    data = {
        username: req.session.user.name,
        email: req.session.user.email,
        poppy_id: req.session.user.poppy_id,
        _id: req.session.user._id,
        created_at: req.session.user.createdAt
    }
    res.render('explore', { data: data, info: '', find_err: '' });
}

const loadRequestsPage = async (req, res) => {
    data = {
        username: req.session.user.name,
        email: req.session.user.email,
        poppy_id: req.session.user.poppy_id,
        _id: req.session.user._id,
        created_at: req.session.user.createdAt
    }
    const searched_data = await userModel.findOne({ _id: data._id });
    const request_list_array = searched_data.request_list;
    const all_profiles = await userModel.find({ _id: { $nin: data._id } });
    let request_list_accounts = [];
    for (elms in all_profiles) {
        // console.log(all_profiles[elms].poppy_id);
        if (request_list_array.includes(all_profiles[elms].poppy_id)) {
            let requested_accounts = {
                username: all_profiles[elms].name,
                poppy_id: all_profiles[elms].poppy_id
            }
            request_list_accounts.push(requested_accounts);
        }
    }
    res.render('requests', { data: data, requestListArray: request_list_accounts });
}

const loadSettingsPage = async (req, res) => {
    data = {
        username: req.session.user.name,
        email: req.session.user.email,
        poppy_id: req.session.user.poppy_id,
        _id: req.session.user._id,
        created_at: req.session.user.createdAt
    }
    res.render('settings', { data });
}

module.exports = {
    loadLoginPage,
    login,
    logout,
    loadDashboard,
    loadExplorePage,
    loadRequestsPage,
    loadSettingsPage
}