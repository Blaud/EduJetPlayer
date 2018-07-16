let mongoose = require('mongoose');
const crypto = require('crypto');
let jwt = require('jsonwebtoken');

let UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    image: String,
    hash: String,
    salt: String,
    words: [{
        word: String,
        translate: String,
        knowledge: Number
    }]
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

    return this.hash === hash;
};

UserSchema.methods.addWord = function(_word,_knw,_trans) {
    let banana=this;
    console.log("slova: "+_word+_knw+_trans);
    this.db.model('User').findOne({
        "words.word": _word,
        "_id":banana._id
    }, function (err, result) {

        if (err) {if(err)console.log("error on find user for addWord! "+err) }
        if (!result) {

            banana.db.model('User').update(
                { _id: banana._id },
                { $push: { words:{word:_word,knowledge:_knw,translate:_trans}} },
                function(err1,raw) {if(err1)console.log("error on insert in user for addWord! "+err1+" = "+_word+_knw+_trans)}
            );
            //this.words.push({word:_word,knowledge:_knw});
            // do stuff here
        }else{
            banana.db.model('User').update({"words.word": _word}, {'$set': {
                    'words.$.knowledge': _knw
                }}, function(err2) {if(err2)console.log("error on update user for addWord! "+err2)})
            //this.words.push({word:_word,knowledge:_knw});
        }
    });

    //this.save(done);
};

UserSchema.methods.generateJWT = function() {

    // set expiration to 60 days
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, 'SECRET');
};

const User = mongoose.model('User', UserSchema);
User.ensureIndexes();