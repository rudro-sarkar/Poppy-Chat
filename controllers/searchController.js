

const userModel = require("../models/user");

const searchAccount = async (req, res) => {
    data = {
        username: req.session.user.name,
        email: req.session.user.email,
        poppy_id: req.session.user.poppy_id,
        _id: req.session.user._id,
        created_at: req.session.user.createdAt
    }
    const { poppy_search } = req.body;
    if (/^[a-z0-9]+$/.test(poppy_search)) {
        const searched_data = await userModel.findOne({ poppy_id: poppy_search });
        if (searched_data) {
            const data_for_client = {
                username: searched_data.name,
                poppy_id: searched_data.poppy_id,
                friends_count: (searched_data.friends_list).length
            }
            if (searched_data._id == data._id) {
                res.redirect('/settings');
            }else {
                req.session.searchedAccountId = data_for_client.poppy_id;
                res.render('searched_profile', { data: data, info: data_for_client, find_err: '' });
            }
        }else {
            res.render('searched_profile', { data: data, info: '',  find_err: '' });
        }
    } else {
        res.render('explore', { data: data, info: 'Invalid Poppy ID', find_err: '' });
    }
}

const addfriend = async (req, res) => {
    let searched_poppy_id = req.session.searchedAccountId;
    let searched_document = await userModel.findOne({ poppy_id: searched_poppy_id });
    data = {
        username: req.session.user.name,
        email: req.session.user.email,
        poppy_id: req.session.user.poppy_id,
        _id: req.session.user._id,
        created_at: req.session.user.createdAt
    }
    let client_info = {
        username: searched_document.name,
        poppy_id: searched_document.poppy_id,
        friends_count: (searched_document.friends_list).length
    }
    if (searched_document.friends_list.includes(data.poppy_id)) {
        res.render('friend_action_result.ejs', { find_err: 'alreadyFrnd'});
    }else if (searched_document.request_list.includes(data.poppy_id)) {
        res.render('friend_action_result.ejs', { find_err: 'alreadyRequested'});
    }
    else {
        await userModel.findOneAndUpdate({poppy_id: searched_poppy_id}, { $push: { request_list: data.poppy_id } });
        res.render('friend_action_result.ejs', { find_err: 'noerror'});
    }
}

module.exports = {
    searchAccount,
    addfriend
}