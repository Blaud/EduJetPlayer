/**
 * Created by Anton on 27.03.2016.
 */
let mongoose = require('mongoose');

let WordSchema = new mongoose.Schema({
    text: {type: String, unique: true}
    //post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});
/*
WordSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};*/

let Word = mongoose.model('Word', WordSchema);
Word.ensureIndexes();