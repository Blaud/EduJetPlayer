let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let jwt = require('express-jwt');
let Post = mongoose.model('Post');
let User = mongoose.model('User');
//let Word = mongoose.model('Word');
let auth = jwt({secret: 'SECRET', userProperty: 'payload'});
const translator = require('google-translator');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs-extra');
var url = require('url');
var http = require('http');
//var unrar = require("node-unrar-js");
//var node7zip = require('node-7zip');
let { zip, unzip } = require('cross-unzip');
var path = require('path');
let relevancy = require('relevancy');
//var subsrt = require('./subsrt.js');
var subsrt = require('subsrt');
let iconv = require('iconv-lite');
var chardet = require('chardet');

var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    let tmp1=file.slice(0,file.length-path.basename(file).length);
                    tmp1=tmp1.replace(/-|_|\||\./g, ' ');
                    let tmp2 = path.basename(file);
                    tmp2=tmp2.replace(/-|_|\||\./g, ' ');
                    results.push([file,tmp2]);
                    //results.push(tmp2);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};
/*

[ [ 'F:\\developed\\temp\\output\\Cowboy_Bebop_26_1998_Eng\\v2\\',
    'cb 01 srt' ],
  [ 'F:\\developed\\temp\\output\\Cowboy_Bebop_TV_26_1998_Rus\\Cowboy Bebop 01-26 [dragondrop]\\',
    'cb 01 srt' ],
  [ 'F:\\developed\\temp\\output\\Cowboy_Bebop_TV_26_1998_Rus\\Cowboy Bebop 01-26 [max_skuratov]\\',
    'cb 01r srt' ],
  [ 'F:\\developed\\temp\\output\\Cowboy_Bebop_TV_26_1998_Rus\\Cowboy Bebop 01-26 [serg_svetlichny]\\',
    'Bebop 01 srt' ],
  [ 'F:\\developed\\temp\\output\\Cowboy_Bebop_TV_26_1998_Rus\\Cowboy Bebop 01-12 [sokill]\\',
    'CowboyBebop01 srt' ] ]
* */
router.get('/', function(req, res, next) {
  res.render('_layout', { title: 'Express' });
});

router.get('/findUser', function(req, res, next) {
    let  _name = parseInt(req.query.name);
    User.find({username:_name}, function (err, data) {
        if(err) {
            res.json(500, err);
        }
        else {
            res.json(data);
        }
    });
});

router.get('/posts', function(req, res, next) {
    let  page = parseInt(req.query.page),
        size = 10,
        skip = page > 0 ? ((page - 1) * size) : 0;
    Post.find(null, null, {
        skip: skip,
        limit: size,
        sort:{ upvotes: -1 }
    }, function (err, data) {
        if(err) {
            res.json(500, err);
        }
        else {
            res.json(data);
        }
    });
  /*Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  }).skip(0).limit(10);*/
});

router.get('/userPosts', function(req, res, next) {
    let _name = req.query.name;
    obj = {
      image:"",
      posts:[]
    };
    let newarr={};
    User.findOne({username: _name},function(err, result) {
        if (err)console.log('NIEN, find failed');
        else {
            result.words.forEach(function (tmp){
                obj.posts.push({word:tmp.word,knowledge:tmp.knowledge,translate:tmp.translate});//newarr[tmp.word]=tmp.knowledge;
            });
            obj.image = result.image;

            res.json(obj);
        }
    });
});

router.post('/uploadAnki', auth, function(req, res, next) {
    let data = req.body;
});

router.post('/words',  auth, function(req, res, next) {
    //console.log('user:'+req.payload.username);
   let data = req.body;
    console.log('words'+data);
   // console.log(req.payload.username);
    let newarr={};

        //let word = new Word({text:key,knowledge:data[key]});

        User.findOne({username: req.payload.username},function(err, result) {
            if (err)console.log('NIEN, find failed');
            else {
                let i=Object.keys(data).length;
                for (var _key in data) {
                    let _word=_key;
                    let _knw=data[_key];
                    translator(undefined, 'ru', _word, function(banana)  {
                        result.addWord(_word,_knw,banana.text);
                        i-=1;
                        if(i==0)
                        {
                            User.findOne({username: req.payload.username},function(err, _result) {
                                if (err)console.log('NIEN, find failed');
                                else {
                                    _result.words.forEach(function (tmp){
                                        console.log("words: "+tmp);
                                        newarr[tmp.word]=tmp.knowledge;
                                    });
                                    //console.log(newarr);
                                    res.send(newarr);
                                }});

                        }
                    });
                }


            }
        });

/*
    User.findOne({username:req.payload.username}, function (err, data) {
        if(err) {
            console.log('NIEN');
            res.json(500, err);
        }
        else {
            newarr=data.words;
            console.log(data.words);
            for (var key in data.words) {
                console.log('data:'+_data);
                newarr[_data.text]=_data.knowledge;
            }
            console.log(newarr);
            res.send(newarr);
        }})*/
});

router.post('/posts', auth, function(req, res, next) {
    let post = new Post(req.body);
    //console.log(req.body.lang);
    post.author = req.payload.username;
    let perevod = function (response) {
        if (response.text.split(' ').length != 1) {
            post.text = post.text + " | " + response.text;
            post.save(function (err, post) {
                if (err) {
                    return next(err);
                }

                res.json(post);
            });
        }
        else {
            var syn = '';
            let temptext=post.text;
            User.findOne({username: req.payload.username},function(err, result) {
                if (err)console.log('NIEN, find failed');
                else {
                    result.addWord(temptext.toLocaleLowerCase(), 1, response.text + syn);
                }
            });
            for (var i = 0; i < response.target.synonyms.length; i++)
                syn += ' ' + response.target.synonyms[i];
            post.text = post.text + " | " + response.text + syn;
            post.save(function (err, post) {
                if (err) {
                    return next(err);
                }

                res.json(post);
            });
        }
    };
    translator(undefined, req.body.lang, post.text, response => {
        if(response.isCorrect==false) {
            translator(undefined, req.body.lang, response.text, banana => {perevod(banana)});
        }else (perevod(response));

    });

});

router.post('/translate', function(req, res, next) {
    //console.log(req.body.lang);
    translator(undefined, req.body.lang, req.body.text, response => {
        if(response.isCorrect==false) {
            translator(undefined, req.body.lang, response.text, banana => {res.send(banana.text)});
        }else (res.send(response.text));

    });
});

router.post('/languages', function(req, res, next) {
    res.send(translator.languages);
});

router.param('user', function(req, res, next, id) {
    let query = User.findById(id);

    query.exec(function (err, user){
        if (err) { return next(err); }
        if (!user) { return next(new Error('can\'t find user')); }

        req.user = user;
        return next();
    });
});
//TODO сделать работу с авторизацией
router.get('/download', function(req, res, next) {
    let _name = req.query.name;
    console.log(_name);
    User.findOne({username:_name}, function (err, data) {
        if(err)  res.json(500, err);
        else {
            let text = "";
            data.words.forEach(temp=>{text +=temp.word+' ; '+temp.translate+'\r\n';});
            console.log(data.words);
            let filename ='lang.txt';
            fs.writeFile(filename, text, function (err) {
                if (err) throw err;
                console.log('Saved!');
                res.download(filename); // Set disposition and send it.
            });
        }
    });

});

router.post('/getcaption', function(req, res, next) {
    let _name = decodeURIComponent(req.query.name);
    res.download('temp/converted/'+_name.slice(0,-3)+'vtt');
});

router.post('/caption', function(req, res, next) {
    let _name = req.query.name;

    //TODO safe search encodeURIComponent(newstr)
    var newstr = _name.replace(/(\b(\w{1,3})\b(\s|$))/g,'');
    newstr = newstr.replace(/\s+/g, '+').toUpperCase();
    console.log(newstr);
    var URL = 'http://subs.com.ru/index.php?e=search&sq='+newstr;

    request(URL, function(error, response, body) {
        if(error) { return  console.error('There was an error!'); }

        var $ = cheerio.load(body);
        var i=0;
        $('a').each(function() {
            var name = $(this).text();
            var link = $(this).attr('href');
            if(link.includes('highlight=') && !link.includes('#')) {i++;console.log(i+' '+name+' '+link);}});
        $('a').each(function() {
            var name = $(this).text();
            var link = $(this).attr('href');

            if(link.includes('highlight')) {
                link ="http://subs.com.ru/" + link.substring(0, link.indexOf('&'));
                request(link, function(error, response, body) {
                    if(error) { return  console.error('There was an error!'); }

                    var banana = cheerio.load(body);

                    banana('td[class=even]').each(function() {

                        var text = banana(this).text();
                        // http://subs.com.ru/sub/enganime/Qualidea_Code_TV_2016_Eng.rar
                        // http://subs.com.ru/sub/Enganime/Qualidea_Code_TV_2016_Eng.rar
                        // http://subs.com.ru/sub/anime/Qualidea_Code_TV_2016_Rus.rar

                        if (text.includes('.rar')) {
                            var pos=text.indexOf('.rar');
                            var lang=text.substring(pos-3,pos).toLowerCase();
                            var downloadUrl='';
                            if(lang === 'rus')
                                downloadUrl='http://subs.com.ru/sub/anime/'+text;
                            else
                                downloadUrl='http://subs.com.ru/sub/'+ lang +'anime/'+text;
                            console.log('req ' + downloadUrl);
                            var filename='temp_'+lang+'sub_for_' + text;
                            //var file = fs.createWriteStream(filename);
                            request({uri: downloadUrl})
                                .pipe(fs.createWriteStream('temp/'+filename))
                                .on('close', function() {
                                   // console.log('7zipping ' + 'temp/'+filename);
                                    unzip('temp/'+filename, 'temp/output', ferr => {
                                        if (ferr) console.log('fuck! ' + ferr); else {
                                            console.log('done 7zipping ' + 'temp/' + filename);
                                            i--;
                                            if (i==0) {
                                                walk('temp/output', function(err, results) {
                                                    if (err) throw err;
                                                   // var nameSorter = relevancy.Sorter(null, results);
                                                    //_name = _name.replace(/(\b(\w{4,})\b(\s|$|-|]))/g,'');
                                                    console.log(_name);
                                                  /*  let tempres=[];
                                                    results.forEach(function(element) {
                                                        let tmp1=element[0];
                                                        tmp1=tmp1.replace(/-|_|\||\./g, ' ');
                                                        let tmp2 = element[1];
                                                        tmp2=tmp2.replace(/-|_|\||\./g, ' ');
                                                        tempres.push([tmp1,tmp2,element[0]]);
                                                    });*/
                                                  let mySorter=relevancy;
                                                  mySorter.weights={matchInSubjectLength: 1,
                                                      matchInSubjectIndex: 1,
                                                      matchInValueLength: 0,
                                                      matchInValueIndex: 0};
                                                    let tmp=mySorter.sort(results, _name).slice(0,10);
                                                    console.log(tmp);
                                                    let j=0;
                                                    let myBuff=[];


                                                    tmp.forEach(function(element) {
                                                        let myfilename=element[0];
                                                        let encoding=chardet.detectFileSync(myfilename);
                                                        //TODO uSync reader
                                                        var srt = fs.readFileSync(myfilename, 'binary');
                                                        let sult = iconv.decode(srt, encoding);
                                                        var vtt = subsrt.convert(sult, { format: 'vtt' });
                                                        myBuff.push(path.basename(myfilename));
                                                        fs.writeFileSync('temp/converted/'+path.basename(myfilename).slice(0,-3)+'vtt', vtt, 'utf8');
                                                    });

                                                    const directory = 'temp';

                                                    fs.readdir(directory, (err, files) => {
                                                        if (err) throw err;

                                                        for (const file of files) {
                                                            if(file.slice(0,4)=='temp')
                                                            fs.unlink(path.join(directory, file), err => {
                                                                if (err) throw err;
                                                            });
                                                        }
                                                    });
                                                    fs.remove('temp/output', function (err) {
                                                        if (err) throw err;
                                                    });
                                                   // fs.unlink('temp/output');
                                                    res.send(myBuff);
                                                    //let myfilename=tmp[0][0];//[0];




                                                   // console.log(tmp);
                                                    //Read a .srt file
                                                   /* let srt;
                                                    let stream=fs.createReadStream(tmp[0][0])
                                                        .pipe(utf8())
                                                        .pipe(process.stdout);*/
                                                    /*.on('end', function () {
                                                        //var srt = fs.readFileSync('sample.txt', 'utf8');
                                                        console.log(srt);
                                                        var vtt = subsrt.convert(srt, { format: 'vtt' });
                                                        fs.writeFileSync('temp/converted/'+_name+'.vtt', vtt, 'utf8');
                                                        res.download('temp/converted/'+_name+'.vtt');
                                                    });*/
                                                    /*let encoding=chardet.detectFileSync(myfilename);
                                                    var srt = fs.readFileSync(myfilename, 'binary');
                                                    let sult = iconv.decode(srt, encoding);
                                                    //console.log(sult);

                                                    //var srt = fs.readFileSync('sample.srt', 'utf8');

//Convert .srt to .sbv
                                                    var vtt = subsrt.convert(sult, { format: 'vtt' });

//Write content to .sbv file
                                                    fs.writeFileSync('temp/converted/'+_name+'.vtt', vtt, 'utf8');

                                                    //let myData = new Blob([vtt], { type: 'text/plain;charset=utf-8' });
                                                    //res.send(vtt);
                                                    res.download('temp/converted/'+_name+'.vtt');
*/
                                                    //res.sendStatus(200);
                                                    // console.log(results);
                                                });

                                            }

                                        }
                                    })

                                    //node7zip.unzip('F:/developed/temp/'+filename, 'F:/developed/temp/output/');
                                    /*var rar = new Unrar('temp/'+filename);

/// Create '/path/to/dest/' before rar.extract()

                                    rar.extract('temp/unrar/', null, function (err) {
                                        if(err)console.log('error '+err);
                                        else console.log('succ '+err);
                                    });
*/
                                    /*
// Read the archive file into a typedArray
                                   // var buf = Uint8Array.from(fs.readFileSync('temp/'+filename)).buffer;
                                    if (!fs.existsSync('temp/unrar/')){
                                        fs.mkdirSync('temp/unrar/');
                                    }
                                    var extractor = unrar.createExtractorFromFile('temp/'+filename,'temp/unrar/');
                                    try {
                                        var extracted = extractor.extractAll();
                                        if (extracted.state === "SUCCESS") console.log('unrarred') ;
                                        else
                                            console.log('nien nien nien ' +filename);
                                    }
                                    catch (e) { console.log('error '+e);}*/

                                })
                                .on('error',function(err){console.log('download err ',err);});
                        }
                    })
                });





/*
                var request = http.get(dest, function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        console.log('?????????');
                        file.close();  // close() is async, call cb after close completes.
                    });
                }).on('error', function (err) { // Handle errors
                    fs.unlink(dest); // Delete the file async. (But we don't check the result)
                    console.log('??????: ' + err);
                });
*/
            };
        });
    });

});

router.param('post', function(req, res, next, id) {
    let query = Post.findById(id);

    query.exec(function (err, post){
        if (err) { return next(err); }
        if (!post) { return next(new Error('can\'t find post')); }

        req.post = post;
        return next();
    });
});

router.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(post);
    });
});

router.post('/post_change', auth, function(req, res, next) {
    let post = new Post(req.body);

    if (post.author == req.payload.username) {
        console.log(post);
        Post.update({_id:post._id }, {$set: {'image': post.image, 'text':post.text,'title':post.title}}, {multi: false},
            function (e, doc) {
                console.log(doc);
            });

        Post.find({_id:post._id}, function (err, data2) {
            if (err) {
                res.json(500, err);
            }
            else {                
                return res.json(data2);
            }
        });
    }
    else
        return res.json(401, "Not authorized for this");
});

router.put('/posts/:post/upvote', auth,  function(req, res, next) {
    req.post.upvote(function(err, post){
        if (err) { return next(err); }

        res.json(post);
    });
});

router.put('/posts/:post/delete', auth,  function(req, res, next) {
    //if (post.author!='' && post.author == req.payload.) {
    req.post.remove({ _id: req.post._id }, function (err) {
        if (err) return handleError(err);

        res.json(200, "Succ");
    });
    /*}
    else
        return res.json(401, "Not authorized for this");*/
});

router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    let user = new User();

    user.username = req.body.username;

    user.image = req.body.image;

    user.setPassword(req.body.password);
    //return res.status(400).json({message: user.hash});
    user.save(function (err){
        if(err){ return res.status(400).json({message: 'Yoba'}); }

        return res.json({token: user.generateJWT()})
    });
});

router.post('/change', auth, function(req, res, next){
    mongoose.connection.collections['users'].drop( function(err) {
        if(!err)
        console.log('collection dropped');
        else console.log('collection not dropped: '+err)

    });
    return res.json(401, "Not authorized for this");
    /*
    if (req.payload.username == req.body.name) {
        User.update({username: req.payload.username}, {$set: {'image': req.body.image}}, {multi: true},
            function (e, doc) {
                console.log(doc);
            });

        User.find({username: req.body.name}, function (err, data2) {
            if (err) {
                res.json(500, err);
            }
            else {
                console.log("ava " + data2['image']);
                return res.json(data2);
            }
        });
    }
    else
        return res.json(401, "Not authorized for this");*/
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;
