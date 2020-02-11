const auth = require("express-basic-auth")
const User = require("../model/auth")
const atob = require("atob")

checkInMongoose = async (username, password, next) => {
    const authResult = await User.authenticate()(username, password)
    return next(null, authResult.user)
}

module.exports = {
    basic: auth({
        authorizer: checkInMongoose,
        authorizeAsync: true,
    }),
    setUserInfo: async (req, res, next) =>{
        const username = atob(req.headers.authorization.split(" ")[1]).split(":")[0]
        req.user = await User.findOne({ username: username});
        next()
    },
    adminOnly: async (req, res, next) =>{
        
        const username = atob(req.headers.authorization.split(" ")[1]).split(":")[0]
        
        const user = await User.findOne({ username: username})
        if (user.role === "superadmin" && "admin") 
            next()
        else 
            res.status(401).send("You don't have access to this page")
    }
}