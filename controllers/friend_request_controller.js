
const userModel = require("../models/user");

const inspectProfile = async (req, res) => {
    const client_request_list = req.session.user.request_list;
    const inspection_id = req.params.poppy_id;
    if (client_request_list.includes(inspection_id)) {
        const user_data = await userModel.findOne({ poppy_id: inspection_id });
        const data_for_client = {
            username: user_data.name,
            poppy_id: user_data.poppy_id,
            friends_count: (user_data.friends_list).length
        }
        res.render('inspect', { data_for_client });
    }
}

const confirmRequest = async (req, res) => {
    
}

const declineRequest = async (req, res) => {

}

module.exports = {
    inspectProfile,
    confirmRequest,
    declineRequest
}