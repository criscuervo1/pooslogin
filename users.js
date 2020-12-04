const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { check,validationResult } = require('express-validator');
const UserSchema = require('../schemas/User');
const config = require('config');

router.post(
    '/register',
    [
        check('email', 'Type proper email').isEmail(),
        check('password','Password is required').not().isEmpty()
    ],
    async (req,res) => {
        try {
            let { email,password } = req.body;
            let user = await UserSchema.findOne({ email });
            const errors = validationResult(req); 
            if(!errors.isEmpty()){
                return res.status(401).json({ errors: errors.array() });
            }

            if(user){
                return res.status(401).json({ msg: "There is already user with this e-mail"});
            }

            const salt = await bcryptjs.genSalt(10);
            password = await bcryptjs.hash(password,salt);

            user = new UserSchema({
                email,
                password
            });

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                (err, token) => {
                    if(err) throw err;
                    res.json({ token });
                }
            )

        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ msg: "Server Error..."});
        }
    }
);

router.post(
    '/login',
    [
        check('email', "Type proper e-mail").isEmail(),
        check('password', "Password is required").not().isEmpty()
    ],
    (req,res) => {
        try {

            const { email,password } = req.body;
            let user = await UserSchema.findOne({ emaill });

            if(!user){
                return res.status(401).json({ msg: "There is no user with this e-mail" });
            }

        } catch (error) {
            console.log(error.message);
            return res.status(500).json({msg: "Server Error..."});
        }
    }
)

module.exports = router;