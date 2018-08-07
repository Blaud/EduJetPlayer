angular.module('EduJetPlayer', [
    'ui.router',
    'textAngular',
    'ngFileSaver',
    "ngSanitize",
    'vjs.video'
])

    .factory('auth', ['$http', '$window', function ($http, $window) {
        let auth = {};
        auth.saveToken = function (token) {
            $window.localStorage['edujetplayer-token'] = token;
        };

        auth.getToken = function () {
            return $window.localStorage['edujetplayer-token'];
        };

        auth.isLoggedIn = function () {
            let token = auth.getToken();

            if (token) {
                let payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        auth.currentUser = function () {
            if (auth.isLoggedIn()) {
                let token = auth.getToken();
                let payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
            return "anon";
        };

        auth.register = function (user) {
            return $http.post('/register', user).success(function (data) {
                auth.saveToken(data.token);
            });
        };
        auth.change = function (user) {
            return $http.post('/change', user,{
                headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function (data) {
            });
        };
        auth.logIn = function (user) {
            return $http.post('/login', user).success(function (data) {
                auth.saveToken(data.token);
            });
        };

        auth.logOut = function () {
            //users.reset();
            $window.localStorage.removeItem('edujetplayer-token');
        };

        return auth;
    }])

    .factory('users', ['$http', 'auth', function ($http, auth) {
        let user = {
            name:"anon",
            image:"https://cs412316.vk.me/v412316674/b7c/vd2U-k3VxsE.jpg",
            posts:[]
        };
        user.setName=function (_name="anon") {
            user.name=_name;
        };
        user.getAnki=function (_name=user.name) {

            return $http.get('/download?name='+_name,{
                headers: {Authorization: 'Bearer '+auth.getToken()}
            });
        };
        user.getImage=function (_name="anon") {
            if (user.image=="") {
                user.getInfo(_name);
            }
                return user.image;
        };
        user.getInfo = function (_name=user.name) {
            return $http.get('/userPosts?name='+_name).success(function (data) {
                user.name=_name;
                user.image=data.image;
                angular.copy(data.posts, user.posts);

            });
        };
        user.uploadAnki = function (data) {
            return $http.post('/uploadAnki', data, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            })
        };
        user.reset = function () {
            user.name="anon",
                user.image="https://cs412316.vk.me/v412316674/b7c/vd2U-k3VxsE.jpg",
                user.posts=[];
        };
        return user;
    }])
    
    .factory('Posts', ['$http', 'auth', function ($http, auth) {
        let o = {
            posts: []
        };
        let subbedwords={};
        let info = {
            page : 1,
            txt : ''
        };
        o.getAll = function () {
            return $http.get('/posts'+info.txt).success(function (data) {

                angular.copy(data, o.posts);
            });
        };
        o.setN = function (_page) {
            info.page=_page;
            info.txt='?page='+info.page;
        };
        o.createNew = function(post) {
            console.log('new post!');
            return $http.post('/posts', post, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                o.posts.push(data);
            });
        };
        o.change = function(post) {
            return $http.post('/post_change', post, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                o.posts.push(data);
            });
        };
        o.upvote = function(post) {
            return $http.put('/posts/' + post._id + '/upvote', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                post.upvotes += 1;
            });
        };
        o.delete = function(post) {
            return $http.put('/posts/' + post._id + '/delete', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                var index = o.posts.indexOf(post);
                if (index !== -1) o.posts.splice(index, 1);
            });
        };
        o.get = function (id) {
            return $http.get('/posts/' + id).then(function (res) {
                return res.data;
            });
        };
        return o;
    }])

    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'MainCtrl',
                    resolve: {
                        postPromise: ['Posts', function (Posts) {
                            Posts.setN(1);
                            return Posts.getAll();
                        }]
                    }
                })
                .state('profile', {
                    url: '/profile/{_name}',
                    templateUrl: '/profile.html',
                    controller: 'ProfileCtrl',
                    resolve: {
                        postPromise: ['users','$stateParams', function (users,$stateParams) {
                            return users.getInfo($stateParams._name);
                        }]
                    }
                })
                .state('my_profile', {
                    url: '/my_profile/{_name}',
                    templateUrl: '/my_profile.html',
                    controller: 'ProfileCtrl',
                    onEnter: ['$state', '$stateParams','auth', function ($state,$stateParams, auth) {
                        if (auth.currentUser() != $stateParams._name) $state.go('home');
                    }],
                    resolve: {
                        postPromise: ['users','$stateParams', function (users,$stateParams) {
                            return users.getInfo($stateParams._name);
                        }]
                    }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: '/login.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                        if (auth.isLoggedIn()) {
                            $state.go('home');
                        }
                    }]
                })
                .state('register', {
                    url: '/register',
                    templateUrl: '/register.html',
                    controller: 'AuthCtrl',
                    onEnter: ['$state', 'auth', function ($state, auth) {
                        if (auth.isLoggedIn()) {
                            $state.go('home');
                        }
                    }]
                })
                .state('posts', {
                    url: '/posts/{id}',
                    templateUrl: '/posts.html',
                    controller: 'PostsCtrl',
                    resolve: {
                        post: ['$stateParams', 'Posts', function ($stateParams, Posts) {
                            return Posts.get($stateParams.id);
                        }]
                    }
                })
                .state('post_change', {
                    url: '/change/posts/{id}',
                    templateUrl: '/post_change.html',
                    controller: 'PostsChangeCtrl',
                    /*onEnter: ['$state', '$stateParams','auth', function ($state,$stateParams, auth) {
                        if (auth.currentUser() != ) $state.go('home');
                    }],*/
                    resolve: {
                        post: ['$stateParams', 'Posts', function ($stateParams, Posts) {
                            return Posts.get($stateParams.id);
                        }]
                    }
                });

            $urlRouterProvider.otherwise('home');
        }])

    .controller('PostsCtrl', ['$scope', 'Posts', 'post', 'auth',
        function PostsCtrl($scope, Posts, post, auth) {
            $scope.post = post;
            $scope.currentUser = function () {
                if (auth.currentUser() == post.author)
                    return true;
                return false;
            };
            $scope.isLoggedIn = auth.isLoggedIn;

            $scope.incrementUpvotes = function (comment) {
                Posts.upvoteComment(post, comment);
            };
            $scope.incrementPostUpvotes = function (post) {
                Posts.upvote(post);
            };
        }])
    
    .controller('PostsChangeCtrl', ['$scope', 'Posts', 'post', 'auth',
        function PostsChangeCtrl($scope, Posts, post, auth) {
            $scope.post = post;
            $scope.isLoggedIn = auth.isLoggedIn;
            $scope.changePost = function () {
                console.log($scope.post);
                if (!$scope.post.title || $scope.post.title === '') {
                    return;
                }
                Posts.change($scope.post);
            };
            
        }])

    .directive('customOnChange', function() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.customOnChange);
                element.on('change', onChangeHandler);
                element.on('$destroy', function() {
                    element.off();
                });

            }
        };
    })


    .controller('VideoCtrl',
        ['$scope', 'Posts', 'auth', '$http', function ($scope, Posts, auth, $http) {
            var paused = true;
            var doTrans;

            if (!Posts.subbedwords)
                Posts.subbedwords={};
            $scope.selectedWords=Object.keys(Posts.subbedwords).length;
            $scope.addWords= function addWordsFromSubs(){
                $scope.selectedWords=Object.keys(Posts.subbedwords).length;
                console.log( "addWords");
                console.log( $scope.selectedWords);
                console.log(Posts.subbedwords);
                let wordarr=Posts.subbedwords;//JSON.stringify(words);
                $http.post('/words', wordarr,{
                    headers: {Authorization: 'Bearer '+auth.getToken()}
                }).success(function (data,status,headers) {
                    var arr = data;
                    console.log(data);
                    for (var key in arr) {
                        console.log(key + " = " +  arr[key]);
                    }
                });
            };
            function trans(el, _text, _lang) {
                el.innerText = "Переводим...";

                $http.post('/translate', {text:_text, lang:_lang}).success(function(data) {
                    el.innerText = data;
                    // Posts.createNew({
                    //     lang: _lang,
                    //     author: $scope.currentUser,
                    //     title: document.querySelector('video').currentSrc,
                    //     text: data,
                    //     image: ""
                    // });
                });
            };
            function languages(el) {
                $http.post('/languages').success(function(data) {
                    var arr = Object.keys(data);
                    var len = arr.length;
                    //el.setAttribute('size', len);
                    for (var i = 0; i < len; i++) {
                        var option = document.createElement("option");
                        option.value = arr[i];
                        option.text = data[arr[i]];
                        el.appendChild(option);
                        if (option.value === "ru")
                            el.value = option.value;
                    }
                    changeWidth(el);
                });
            }
            function getSelectedText() {
                if (window.getSelection) {
                    return window.getSelection().toString();
                } else if (document.selection) {
                    return document.selection.createRange().text;
                }
                return '';
            }
            function changeWidth (e) {
                var select = e;
                var o = select.options[select.selectedIndex];
                var s = document.createElement('span');
                
                s.textContent = o.textContent;
                
                var ostyles = getComputedStyle(o);
                s.style.fontFamily = ostyles.fontFamily;
                s.style.fontStyle = ostyles.fontStyle;
                s.style.fontWeight = ostyles.fontWeight;
                s.style.fontSize = ostyles.fontSize;
                
                
                document.body.appendChild(s);
                
                select.style.width = (s.offsetWidth + 21) + 'px';
                   
                
                document.body.removeChild(s);
            }
            function showPopup(){
                div = document.getElementsByClassName("tooltip1")[0];
                //TODO положение окна над словом...
                div.setAttribute("class", "vjs-overlay vjs-overlay-top vjs-overlay-background tooltip1");
            }

            function popup(el, text) {
                var div, lang, label;
                if (document.getElementsByClassName("tooltip1")[0] == null) {
                    div = document.createElement('div');
                    var close = document.createElement('button');
                    close.innerText = "X";
                    close.onclick = function () {
                        popdown();
                    };
                    var post = document.createElement('button');
                    post.innerHTML = '&#128190';
                    post.onclick = function () {
                        subtran(doTrans, div.childNodes[0].childNodes[2].value == "" ? "ru" : div.childNodes[0].childNodes[2].value);
                    };
                    lang = document.createElement('span');
                    lang.setAttribute("style", "all:initial;");
                    div.appendChild(lang);
                    label = document.createElement('span');
                    div.appendChild(label);
                    var select = document.createElement('select');
                    
                    languages(select);
                    lang.appendChild(close);
                    lang.appendChild(post);
                    lang.appendChild(select);
                    lang.appendChild(document.createTextNode(" | "));
                    div.setAttribute("class", "vjs-overlay vjs-overlay-top vjs-overlay-background tooltip1");
                    //div.style.visibility="hidden";
                    document.getElementById("video").appendChild(div);
                    select.onchange = function() {
                        changeWidth(select);
                        trans(label, label.innerText, select.value);
                    };
                    div.setAttribute("style", "font-size:1.5vmax;background-color:rgba(0,0,0,0.4);");
                    div.onmouseenter = function () {
                        this.setAttribute("style", "font-size:1.5vmax;background-color:rgba(255,255,255,0.4);");
                        if (!paused && !videojs('video').paused()) {
                            videojs('video').pause();
                        }
                        else if (videojs('video').paused()) {
                                paused = true;
                            }
                            else {
                                
                                videojs('video').pause();
                                paused = false;
                            }
                    };
                    div.onmouseleave = function () {
                        this.setAttribute("style", "font-size:1.5vmax;background-color:rgba(0,0,0,0.4);");
                        if (!paused)
                            videojs('video').play();    
                    };
                }
                else {
                    div = document.getElementsByClassName("tooltip1")[0];
                    div.childNodes[0].childNodes[1].onclick = function () {
                        subtran(doTrans, div.childNodes[0].childNodes[2].value == "" ? "ru" : div.childNodes[0].childNodes[2].value);
                    };
                    div.setAttribute("class", "vjs-overlay vjs-overlay-top vjs-overlay-background tooltip1");
                }
                
                trans(div.childNodes[1], text, div.childNodes[0].childNodes[2].value == "" ? "ru" : div.childNodes[0].childNodes[2].value);
            }
            function popdown() {
                document.getElementsByClassName("tooltip1")[0].setAttribute("class", "vjs-overlay vjs-overlay-top vjs-overlay-background vjs-hidden tooltip1");;
            }
            $scope.changedVideo= function(event){
                    $scope.myVideoInfo=event.target.files[0].name;
                $scope.$apply();
                };

            $scope.changedSub = function(event){
                $scope.mySubInfo=event.target.files[0].name;
                $scope.$apply();
            };
            var subtran = function (el, _lang) {
                $scope.posts = Posts.posts;
                $scope.isLoggedIn = auth.isLoggedIn;
                console.log(document.querySelector('video').currentSrc.toLocaleLowerCase());
                console.log(doTrans);
                Posts.createNew({
                    lang: _lang,
                    author: $scope.currentUser,
                    title: document.querySelector('video').currentSrc,
                    text: doTrans,
                    image: ""
                });
            };
            var updateTracks = function(data){
                console.log('dlinna = ',Object.keys(Posts.subbedwords).length);

                var videoNode = videojs('video');
                var textTrack = videoNode.textTracks()[0];
                var overlays = [];
                for (var i = 0; i<textTrack.cues.length; i++) {
                    overlays.push({content: textTrack.cues[i].text, start:  textTrack.cues[i].startTime, end:  textTrack.cues[i].endTime});
                };
                textTrack.mode = "hidden";
                videoNode.overlay({align: 'bottom', overlays: overlays});
                var spans,p = document.querySelectorAll(".vjs-overlay:not(.tooltip1)");
                console.log("changed");
                for(var i=0;i<p.length;i++) {

                    p[i].setAttribute("style", "bottom:3.5rem;font-size:1.5vmax;background-color:rgba(0,0,0,0.4);");
                    p[i].onmouseenter = function () {
                        this.setAttribute("style", "bottom:3.5rem;font-size:1.5vmax;background-color:rgba(255,255,255,0.4);");
                        if (!paused && !videojs('video').paused()) {
                            videojs('video').pause();
                        }
                        else if (videojs('video').paused()) {
                                paused = true;
                            }
                            else {
                                
                                videojs('video').pause();
                                paused = false;
                            }
                    };
                    p[i].onmouseleave = function (e) {
                        this.setAttribute("style", "bottom:3.5rem;font-size:1.5vmax;background-color:rgba(0,0,0,0.4);");
                        if (!paused)
                            videojs('video').play();    
                    };
                    p[i].onmousedown = function (e) {
                        e.stopPropagation();
                        if (getSelectedText() != '') {
                            showPopup();
                            return;
                        }
                        //this.setAttribute("style", "bottom:3.5rem;font-size:1.5vmax;background-color:rgba(0,0,0,0.4);");
                    };
                    p[i].onmouseup = function (e) {
                        e.stopPropagation();
                        if (getSelectedText() != ''){
                            showPopup();
                            return;
                        }
                        doTrans = this.innerText;
                        popup(this, this.innerText);
                        //  this.setAttribute("style", "bottom:3.5rem;font-size:1.5vmax;background-color:rgba(255,255,255,0.4);");
                    };
                    if(p[i]==undefined) continue;
                    p[i].innerHTML = XRegExp.replace(p[i].innerHTML, XRegExp("[\\p{L}']+"), "<span>$&</span>", 'all');
                    spans = p[i].getElementsByTagName("span");

                    for(var a=0;a<spans.length;a++) {

                        Posts.subbedwords[spans[a].innerHTML.toLocaleLowerCase()]=3;


                        spans[a].onmousedown = function(e){
                            e.stopPropagation();
                            this.style.backgroundColor = "yellow";
                            //console.log('fdsfsdf');
                            if (getSelectedText() == '' && this.innerText != '' && this.innerText != doTrans) {
                                doTrans = this.innerText;
                                popup(this, this.innerText);
                            }
                            else{
                                showPopup();
                            }
                            // $scope.posts = Posts.posts;
                            // Posts.createNew({
                            //     author: $scope.currentUser,
                            //     title:  document.querySelector('video').currentSrc,
                            //     text: this.innerHTML,
                            //     image: ""
                            // });
                            //videojs('video').pause();
                        };
                        spans[a].onmouseleave = function (e) {
                            e.stopPropagation();
                            if (getSelectedText() != '' && getSelectedText() != doTrans) {
                                doTrans = getSelectedText();
                                popup(this, getSelectedText());
                            }
                            this.style.backgroundColor = "transparent";
                        };
                        spans[a].onmouseup =  function(e){
                            e.stopPropagation();
                            if (getSelectedText() != '' && getSelectedText() != doTrans) {
                                doTrans = getSelectedText();
                                popup(this, getSelectedText());
                            }
                            else{
                                showPopup();
                            }
                            this.style.backgroundColor = "transparent";
                            //videojs('video').play();
                        };
                    };

                };
                $scope.selectedWords=Object.keys(Posts.subbedwords).length;
                //$scope.$apply();
                videoNode.off("play", updateTracks);
            };
            $scope.captionsrc='Cowboy Bebop TV e01';
            $scope.sublist=['---'];
            $scope.selectCaption = function () {
                Posts.subbedwords={};
                $http.post('/getcaption?name='+encodeURIComponent($scope.selectedSub)).success(function (data,status,headers) {
                    let disposition=headers()['content-disposition'];
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    let filename='undefined';
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                    let myData = new Blob([data], { type: 'text/plain' });
                    var videoNode = videojs(document.querySelector('video'));
                    if (videoNode.textTracks() != undefined)
                        videoNode.removeRemoteTextTrack(videoNode.textTracks()[0]);
                    videoNode.addRemoteTextTrack({
                        kind: 'subtitles',
                        label: filename,
                        src: URL.createObjectURL(myData),
                        srclang: 'en',
                        default: true
                    });
                    //videoNode.load();
                    videoNode.on("play", updateTracks);

                });

            };
            $scope.findCaption = function () {
                $scope.sublist=['Поиск'];
                $http.post('/caption?name='+ $scope.captionsrc).success(function (data,status,headers) {
                   // console.log(data);
                    $scope.sublist=[];
                    data.forEach(function(element) {
                        //let myData = new Blob([element.content], { type: 'text/plain' });

                        $scope.sublist.push([element]);
                    });
                   // let myData = new Blob([data], { type: 'text/plain' });


                   // $scope.$apply();
                    /*var videoNode = videojs(document.querySelector('video'));
                    if (videoNode.textTracks() != undefined)
                        videoNode.removeRemoteTextTrack(videoNode.textTracks()[0]);
                    videoNode.addRemoteTextTrack({
                        kind: 'subtitles',
                        label: 'Downloaded',
                        src: URL.createObjectURL(myData),
                        srclang: 'en',
                        default: true
                    });
                    videoNode.load();
                    videoNode.on("play", updateTracks);*/
                   // let myData = new Blob([data], { type: 'text/plain;charset=utf-8' });

                });
            };

            $scope.selectSrc = function () {
                var srcs, subs, srcOnline = false, subOnline = false, videoNode = videojs(document.querySelector('video'));
                if (!(typeof angular.element(document.getElementById('src'))[0].files[0] === 'undefined') && document.getElementById('uploaded_video').value === angular.element(document.getElementById('src'))[0].files[0].name) {
                    srcs = angular.element(document.getElementById('src'))[0].files[0];
                }
                else {
                    srcOnline = true;
                    srcs = document.getElementById('uploaded_video').value
                }
                if (videoNode.textTracks() != undefined)
                    videoNode.removeRemoteTextTrack(videoNode.textTracks()[0]);
                if (!(typeof angular.element(document.getElementById('sub'))[0].files[0] === 'undefined') && document.getElementById('uploaded_sub').value === angular.element(document.getElementById('sub'))[0].files[0].name)
                    subs = angular.element(document.getElementById('sub'))[0].files[0];
                else {
                    subOnline = true;
                    subs = document.getElementById('uploaded_sub').value
                }
                //var videoNode = videojs(document.querySelector('video'));
                //var canPlay = videoNode.canPlayType(type);
                videoNode.addRemoteTextTrack({
                    kind: 'subtitles',
                    label: 'English',
                    src: subOnline ? subs : URL.createObjectURL(subs),
                    srclang: 'en',
                    default: true
                });
                videoNode.src({type:srcOnline ? undefined : srcs.type,  src: srcOnline ? srcs : URL.createObjectURL(srcs)});
                videoNode.load();
                //videoNode.textTracks()[0].mode = 'showing';
                videoNode.on("play", updateTracks);
            };
            $scope.media = {
                sources: [
                    {
                        src: 'video/Cowboy Bebop - 01.mp4',
                        type: 'video/mp4'
                    }
                ],
                tracks: [
                    {
                        kind: 'subtitles',
                        label: 'English',
                        src: 'subtitles/vtt/sintel-en.vtt',
                        srclang: 'en',
                        default: true
                    }
                ],
            };
            $scope.addSub = function () {
                $scope.posts = Posts.posts;
                $scope.isLoggedIn = auth.isLoggedIn;
                console.log(document.querySelector('video').currentSrc.toLocaleLowerCase());
                var arr = document.querySelectorAll(".vjs-overlay:not(.tooltip1)");
                for (var i = 0; i < arr.length; i++) {
                    if (!arr[i].classList.contains("vjs-hidden")) {
                        Posts.createNew({
                            author: $scope.currentUser,
                            title: document.querySelector('video').currentSrc,
                            text: arr[i].innerText || arr[i].textContent,
                            image: ""
                        });
                    }
                };
            };
            $scope.$on('vjsVideoReady', function (e, data) {
                //data.player.width = ''
                data.player.on("play", updateTracks);

            });

            // $scope.addSub = function () {
            //     $scope.posts = Posts.posts;
            //     $scope.isLoggedIn = auth.isLoggedIn;
            //     console.log(document.querySelector('video').currentSrc.toLocaleLowerCase());
            //     Posts.createNew({
            //         author: $scope.currentUser,
            //         title:  document.querySelector('video').currentSrc,
            //         text: document.querySelector('video').textTracks[0].cues[0].text,
            //         image: ""
            //     });
            //     }

            /*this.config = {
                sources: [
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
                    {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
                ],
                tracks: [
                    {
                        src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                        kind: "subtitles",
                        srclang: "en",
                        label: "English",
                        default: ""
                    }
                ],
                theme: "bower_components/videogular-themes-default/videogular.css",
                plugins: {
                    poster: "http://www.videogular.com/assets/images/videogular.png"
                }
            };*/

        }]
    )

    .controller('MainCtrl', ['$scope', 'Posts', 'auth',
        function MainCtrl($scope, Posts, auth) {
            $scope.posts = Posts.posts;
            $scope.isLoggedIn = auth.isLoggedIn;
            $scope.selectFile = function () {

            };
            $scope.addPost = function () {
                if (!$scope.title || $scope.title === '') {
                    return;
                }
                Posts.createNew({
                    author: $scope.currentUser,
                    title: $scope.title,
                    text: $scope.htmlVariable,
                    image: $scope.image
                });
                $scope.title = '';
                $scope.htmlVariable = '';
                $scope.image = '';
            };
            $scope.incrementUpvotes = function (post) {
                Posts.upvote(post);
            };
            $scope.delete = function (post) {
                Posts.delete(post);
            };
        }])
    
    .controller('ProfileCtrl', ['$scope', '$http', 'FileSaver', 'Blob', 'users', 'auth', 'Posts',
        function ProfileCtrl($scope,$http, FileSaver, Blob, users, auth, Posts) {
            function convertToCsv(data) {
                return JSON.stringify(data)
                    .replace(/],\[/g, '\n')
                    .replace(/]]/g, '')
                    .replace(/\[\[/g, '')
                    .replace(/\\"/g, '""');
            }
            function fixInput(parameter) {
                if (parameter && parameter.length == undefined &&
                    _.keys(parameter).length > 0)
                    parameter = [parameter];  // data is a json object instead of an array
                                              // of json objects
            
                return parameter;
            }
            function convert(data, headers, suppressHeader) {
                if (!_.isBoolean(suppressHeader)) suppressHeader = false;
            
                data = fixInput(data);
            
                if (data == null || data.length == 0) {
                    return "";
                }
            
                var columns = headers ? ((typeof headers == 'string') ? [headers] : headers)
                                      : getColumns(data);
            
                var rows = [];
            
                if (!suppressHeader) {
                    rows.push(columns);
                }
            
                for (var i = 0; i < data.length; i++) {
                    var row = [];
                    _.forEach(columns, function(column) {
                        var value =
                            typeof data[i][column] == "object" && data[i][column] &&
                                "[Object]" ||
                            typeof data[i][column] == "number" && String(data[i][column]) ||
                            data[i][column] || "";
                        row.push(value);
                    });
                    rows.push(row);
                }
            
                return convertToCsv(rows);
            }
            function arrayNamesToObj(fields, values) {
                var obj = {};
                for (i in values) {
                    obj[fields[i]] = values[i];
                }
                return obj;
            }
            function updateNestedObj(obj, outerKey, innerKey, innerVal) {
                if (!(outerKey in obj)) {
                    obj[outerKey] = {};  // don't do {innerKey: innerKey} '_'
                    obj[outerKey][innerKey] = innerVal;
                } else {
                    if (!(innerKey in obj[outerKey])) {
                        obj[outerKey][innerKey] = innerVal;
                    }
                }
                return obj;
            }
            $scope.changedProgress = function(event, options){
                var unknownDeckString = "unknown deck";
                var unknownNoteString = "unknown note facts";
                var unknownModelString = "unknown model";
                var ankiSeparator = '\x1f';
                if (typeof options === 'undefined') {
                    options = {limit : 100, recent : true};
                }
                
                var f = event.target.files[0];
                var r = new FileReader();
                r.onload = function() {
                    var compressed = new Uint8Array(r.result);
                    var unzip = new Zlib.Unzip(compressed);
                    var filenames = unzip.getFilenames();
                    if (filenames.indexOf("collection.anki2") >= 0) {
                        var plain = unzip.decompress("collection.anki2");
                        var
                            Uints = new Uint8Array(plain),
                            db = new SQL.Database(Uints),
                            allModelsDecks = db.exec('SELECT models,decks FROM col')[0].values[0],
                            allModels = JSON.parse(allModelsDecks[0]),
                            decksReviewed = {}, modelsReviewed = {},
                            allDecks = JSON.parse(allModelsDecks[1]);
                        var query =
                'SELECT revlog.id, revlog.ease, revlog.ivl, revlog.lastIvl, revlog.time, notes.flds, notes.sfld, cards.id, cards.reps, cards.lapses, cards.did, notes.mid, cards.ord \
        FROM revlog \
        LEFT OUTER JOIN cards ON revlog.cid=cards.id \
        LEFT OUTER JOIN notes ON cards.nid=notes.id \
        ORDER BY revlog.id' +
                            (options.recent ? " DESC " : "") +
                            (options.limit && options.limit > 0 ? " LIMIT " + options.limit : "");
                        var queryResultNames = "revId,ease,interval,lastInterval,timeToAnswer,noteFacts,noteSortKeyFact,cardId,reps,lapses,deckId,modelId,templateNum".split(',');
                        var revlogTable = db.exec(query)[0].values;
                        revlogTable = revlogTable.map(function(rev) {
                            // First, convert this review from an array to an object
                            rev = arrayNamesToObj(queryResultNames, rev);
                    
                            // Add deck name
                            rev.deckName = rev.deckId ? allDecks[rev.deckId].name : unknownDeckString;
                    
                            // Convert facts string to a fact object
                            var fieldNames =
                                rev.modelId
                                    ? allModels[rev.modelId].flds.map(function(f) { return f.name; })
                                    : null;
                            rev.noteFacts =
                                rev.noteFacts ? arrayNamesToObj(fieldNames,
                                                                rev.noteFacts.split(ankiSeparator))
                                            : unknownNoteString;
                            // Add model name
                            rev.modelName =
                                rev.modelId ? allModels[rev.modelId].name : unknownModelString;
                            // delete rev.modelId;
                    
                            // Decks need to know what models are in them. decksReviewed is an
                            // object of objects: what matters are the keys, at both levels, not the
                            // values. TODO can this be done faster in SQL?
                            updateNestedObj(decksReviewed, rev.deckId, rev.modelId, rev.modelName);
                            // But let's also keep track of models in the same way, since we're lazy
                            // FIXME
                            updateNestedObj(modelsReviewed, rev.modelId, rev.deckId, rev.deckName);
                    
                            // Add review date
                            rev.date = new Date(rev.revId);
                            rev.dateString = rev.date.toString();
                    
                            // Add a JSON representation of facts
                            rev.noteFactsJSON = typeof rev.noteFacts === "object"
                                                    ? JSON.stringify(rev.noteFacts)
                                                    : unknownNoteString;
                    
                            // Switch timeToAnswer from milliseconds to seconds
                            rev.timeToAnswer /= 1000;
                    
                            return rev;
                        });
                        var
                            words = {};
                            wordsTable = revlogTable.map(function(rev) {
                                var obj = rev.noteFacts[Object.keys(rev.noteFacts)[0]].split(' ');
                                for(var i = 0; i < obj.length; i++) {
                                    var word = obj[i].replace(new XRegExp("[^\\p{L}^']"), '');
                                    if (typeof words[word] === 'undefined')
                                        words[word] = rev.ease;
                                    else
                                        words[word] = Math.max(words[word], rev.ease);
                                };
                                return rev;
                            });
                            //  db.exec("SELECT mid,flds FROM notes");
                        // var csv = convert(revlogTable, "dateString,ease,interval,lastInterval,timeToAnswer,noteSortKeyFact,deckName,modelName,lapses,\
                        //     reps,cardId,noteFactsJSON".split(','));
                        // var blob = new Blob(['\ufeff' + csv], {type: 'text/csv;charset=utf-8'});
                        // var url = URL.createObjectURL(blob);
                        //alert(url);
                        //console.log(JSON.stringify(words));
                        let wordarr=words;//JSON.stringify(words);
                        $http.post('/words', wordarr,{
                            headers: {Authorization: 'Bearer '+auth.getToken()}
                        }).success(function (data,status,headers) {
                            var arr = data;
                            console.log(data);
                            for (var key in arr) {
                                console.log(key + " = " +  arr[key]);
                            }
                        });

                    }
                    else {
                        alert("Wrong file!");
                    }
                }
                r.readAsArrayBuffer(f);
                
                //db.prepare("SELECT name,hired_on FROM employees");
                //window.JSON.parse()
            };
            $scope.parting = users.posts;
            $scope.user = {
              name:"",
              image:""
            };
            $scope.user.name = users.name;
            $scope.user.image=users.image;
            $scope.isLoggedIn = auth.isLoggedIn;
            $scope.currentUser = function () {
                if (auth.currentUser() == $scope.user.name)
                    return true;
                return false;
            };
            $scope.incrementUpvotes = function (post) {
                Posts.upvote(post);
            };
            $scope.download = function () {
                users.getAnki().success(function (data,status,headers) {
                        let myData = new Blob([data], { type: 'text/plain;charset=utf-8' });
                        FileSaver.saveAs(myData, 'text.txt');
                });
            };
            $scope.change = function () {
                auth.change($scope.user).error(function (error) {
                    $scope.error = error;
                });
            };
        }])
    
    .controller('AuthCtrl', ['$scope', '$state', 'auth',
        function AuthCtrl($scope, $state, auth) {
            $scope.user = {};

            $scope.register = function () {
                auth.register($scope.user).error(function (error) {
                    $scope.error = error;
                }).then(function () {
                    $state.go('home');
                });
            };

            $scope.logIn = function () {
                auth.logIn($scope.user).error(function (error) {
                    $scope.error = error;
                }).then(function () {
                    $state.go('home');
                });
            };
        }])

    .controller('NavCtrl', ['$scope', '$rootScope', '$state', 'auth', 'Posts','users','$http',
        function NavCtrl($scope, $rootScope, $state, auth, Posts, users, $http) {
            let n=1;
            $rootScope.previousState;
            $rootScope.currentState;
            $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
                $rootScope.previousState = from.name;
                $rootScope.currentState = to.name;
            });
            $scope.back = function () {                
                    $state.go($rootScope.previousState);                
            };
            $scope.next = function () {
                n = n < Posts.posts.length ? n+1 : n;
                Posts.setN(n);
                Posts.getAll();
                $scope.posts = Posts.posts;
            };
            $scope.prev = function () {
                n = n > 1 ? n-1 : n;
                Posts.setN(n);
                Posts.getAll();
                $scope.posts = Posts.posts;
            };
            console.log(auth.currentUser());

            $scope.isLoggedIn = auth.isLoggedIn;
            $scope.currentUser = auth.currentUser;
            $scope.needUser = auth.currentUser;
            $scope.logOut = auth.logOut;
            $scope.getAvatar = function () {
                if (auth.isLoggedIn())
               return users.getImage(auth.currentUser());
                else return "https://cs412316.vk.me/v412316674/b7c/vd2U-k3VxsE.jpg";
            };
        }]);
