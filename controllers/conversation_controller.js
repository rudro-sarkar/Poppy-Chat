
const initiateConversation = async (req, res) => {
    const receiver_id = req.params.receiver_id;
    let friend_list = req.session.user.friends_list;
    if (friend_list.includes(receiver_id)) {
        const data = {
            username: req.session.user.name,
            email: req.session.user.email,
            poppy_id: req.session.user.poppy_id,
            _id: req.session.user._id,
            created_at: req.session.user.createdAt
        }
        res.render('conversation', { data: data, receiver: receiver_id });
    }else {
        res.redirect('/inbox');   
    }
    
}

module.exports = {
    initiateConversation
}