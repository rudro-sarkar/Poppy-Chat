
const userModel = require("../models/user");

const inspectProfile = async (req, res) => {
    const client_request_list = req.session.user.request_list;
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

module.exports = {
    inspectProfile,
    confirmRequest,
    declineRequest,
}

