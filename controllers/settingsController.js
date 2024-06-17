
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

const requstAccDeletion = async (req, res) => {
    try { 
        let searched_document = await userModel.findOne({email: req.session.user.email});
        if (searched_document) {
            req.session.flagedAcc = searched_document;
            let msg = {
                error: '',
                name: searched_document.poppy_id
            }
            res.render('confirm_deletion', { msg });
        }else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
    }
}

const proceedAccDeletion = async (req, res) => {
    const { confirmation_text, password } = req.body;
    if (confirmation_text == `poppy delete ${req.session.flagedAcc.poppy_id}`) {
        let hash_status = await bcrypt.compare(password, req.session.flagedAcc.password);
        if (hash_status) {
            await userModel.findOneAndDelete({ poppy_id: req.session.flagedAcc.poppy_id });
            req.session.destroy();
            res.redirect('/bye');
        }else {
            let msg = {
                error: 'Invalid Inputs!',
                name: req.session.flagedAcc.poppy_id
            }
            res.render('confirm_deletion', { msg });
        }
    }else {
        let msg = {
            error: 'Invalid Inputs!',
            name: req.session.flagedAcc.poppy_id
        }
        res.render('confirm_deletion', { msg });
    }
    
}

module.exports = {
    requstAccDeletion,
    proceedAccDeletion
}