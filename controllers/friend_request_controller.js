
const userModel = require("../models/user");

const inspectProfile = async (req, res) => {
    const inspection_id = req.params.poppy_id;
    const user_data = await userModel.findOne({ poppy_id: inspection_id });
    const data_for_client = {
        username: user_data.name,
        poppy_id: user_data.poppy_id,
        friends_count: (user_data.friends_list).length
    }
    res.render('inspect', { data_for_client });   
}

const confirmRequest = async (req, res) => {
    const inspection_id = req.params.poppy_id;
    const userId = req.session.user._id;
    const user_poppy_id = req.session.user.poppy_id;
    await userModel.findByIdAndUpdate(userId, { $push: { friends_list: inspection_id }, $pull: { request_list: inspection_id } });
    await userModel.findOneAndUpdate({ poppy_id: inspection_id }, { $push: { friends_list: user_poppy_id } });
    res.redirect('/requests');
}

const declineRequest = async (req, res) => {
    const inspection_id = req.params.poppy_id;
    const userId = req.session.user._id
    await userModel.findByIdAndUpdate(userId, { $pull: { request_list: inspection_id } });
    res.redirect('/requests');
}

const manageFriends = async (req, res) => {
    const visiting_user_id = req.session.user._id;
    const searched_data = await userModel.findOne({ _id: visiting_user_id });
    const all_profiles = await userModel.find({ _id: { $nin: data._id } });
    const friends_list = searched_data.friends_list;
    const friends_count = friends_list.length;
    const friend_list_account_details = [];
    for (elms in all_profiles) {
        if (friends_list.includes(all_profiles[elms].poppy_id)) {
            let account = {
                username: all_profiles[elms].name,
                poppy_id: all_profiles[elms].poppy_id
            }
            friend_list_account_details.push(account);
        }
    }
    data = {
        username: req.session.user.name,
        email: req.session.user.email,
        poppy_id: req.session.user.poppy_id,
        _id: req.session.user._id,
        created_at: req.session.user.createdAt
    }

    const additional_data_for_client = {
        friends_list: friend_list_account_details,
        friends_count: friends_count
    }
    res.render('manage_friends', { data: data, adfc: additional_data_for_client });
}

const removeFriend = async (req, res) => {
    const targeted_id = req.params.poppyId;
    const userData = await userModel.findOne({ poppy_id: req.session.user.poppy_id });
    const friends_list = userData.friends_list;
    if (friends_list.includes(targeted_id)) {
        await userModel.findOneAndUpdate({ poppy_id: req.session.user.poppy_id }, { $pull: { friends_list: targeted_id } });
        await userModel.findOneAndUpdate({ poppy_id: targeted_id }, { $pull: { friends_list: req.session.user.poppy_id } });
        res.redirect('/managefriends');
    }else {
        res.redirect('/managefriends');
    }

}

module.exports = {
    inspectProfile,
    confirmRequest,
    declineRequest,
    manageFriends,
    removeFriend
}

