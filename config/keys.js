module.exports = {
  mongoURI: process.env.MONGODB_URI || 'mongodb://127.0.0.1/mydb',
  jwt: process.env.JWT || 'dev jwt',
  loaderio: process.env.LOADERIO_VERIFICATION_KEY || 'test',
  corsAnyWhereServer:
    process.env.CORSANYWHERE_SERVER || 'https://cors-for-ejp.herokuapp.com/',
};
