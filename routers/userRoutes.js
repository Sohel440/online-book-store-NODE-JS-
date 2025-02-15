const mongoose = require('mongoose');
const express = require('express');
const { jwtMiddleware, generateToken } = require('../jwt');
const { User } = require('../models/user');
const bodyParser = require('body-parser');
const router  = express.Router();

// user sign up
router.post('/signup', async (req , res)=>{
    try { 
        const data = req.body;
        const newUser = new User(data);

        const response = await newUser.save();

        console.log("Data saved !!");
        const payload= {
            id : response.id
        }

        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : " , token);

        res.status(200).json({response : response , token : token});

    }catch (err){
        console.log(err);
        res.status(500).json({err: "Internal error !"});
    }
});

router.post('/login' , async (req, res) =>{
    try {
      const { username, password }= req.body;

      const user = await User.findOne({username: username});
      if(!user || !await user.comparePassword(password)) return res.status(404).json({error : "Invalid data given..."});


      //gen token 
      const payload = {
        id : user.id
      }

      const token = generateToken(payload);
      res.json({token:token});

    } catch (err) {
      console.log(err);
      res.status(500).json({error:"Internal server error!!!"});
    }
  });
  router.get('/profile', jwtMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;