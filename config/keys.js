module.exports = {
    mongoURI: process.env.MONGODB_URI || "mongodb://127.0.0.1/mydb",
    jwt: process.env.JWT || "dev jwt"
};