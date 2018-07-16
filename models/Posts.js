/**
 * Created by Anton on 27.03.2016.
 */
let mongoose = require('mongoose');


let PostSchema = new mongoose.Schema({
    title: String,
    text: String,
    image: String,
    author: String,
    upvotes: {type: Number, default: 0},
   // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, {timestamps: true});

PostSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

let Post = mongoose.model('Post', PostSchema);
Post.ensureIndexes();