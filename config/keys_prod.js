module.exports = {
    whiteList: process.env.WHITELIST.split(' '),
    blueKey : process.env.BLUE_KEY,
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET
}