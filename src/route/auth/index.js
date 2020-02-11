const express = require("express")
const User = require("../../model/auth")
const { basic, adminOnly } = require("../../helpers/auth")

const router = express.Router()

router.get("/", basic, adminOnly, async (req, res)=>{
    res.send(await User.find({}))
})

router.post("/register", async(req, res)=>{
    try{
        const user = await User.register(req.body, req.body.password);
        res.send(`This user: ${user} is successfully signed-up`)
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = router;