
const serveLanding = (req, res) => {
    data = {
        username: req.session.user.name,
        email: req.session.user.email,
        poppy_id: req.session.user.poppy_id,
        _id: req.session.user._id,
        created_at: req.session.user.createdAt
    }
    res.render('room_landing', {data: data});
}

const joinRoom = async (req, res) => {
    const room_id = req.params.room_id;
    data = {
        username: req.session.user.name,
        email: req.session.user.email,
        poppy_id: req.session.user.poppy_id,
        _id: req.session.user._id,
        created_at: req.session.user.createdAt
    }
    res.render('room', {data: data});
}

module.exports = {
    serveLanding,
    joinRoom,
}