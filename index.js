const express=require('express');
const app=express();
const bodyParser=require('body-parser')
const session=require('express-session');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))


var title=['Latest','Blog','Trending','News','Project']
var description=['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempor fringilla justo, a consectetur metus ullamcorper eu. Pellentesque euismod ligula vitae est tempus efficitur.','Donec sollicitudin erat nec justo efficitur volutpat. Duis tristique consequat ex, vel placerat arcu finibus a. Aenean consectetur dapibus diam nec euismod.','Etiam eleifend feugiat massa vitae eleifend. Maecenas consequat lectus purus, eu auctor mi iaculis a. In nec efficitur velit, vel lacinia sem.','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempor fringilla justo, a consectetur metus ullamcorper eu.','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempor fringilla justo, a consectetur metus ullamcorper eu.']
var author=['Aditya','Sushree','admin','Sonu','Tuinn']
var users=['admin','Aditya','Sushree','Sonu']
var passs=['admin','Padhi','Tuinn','Gudu']
var usrtyp=[1,0,1,0]
var usrstatus=[1,1,1,1]

app.set('view engine','ejs');
app.use(session({
    secret: 'Sonu',
    resave: true,
    saveUninitialized: true
}));

app.get("/",function(req,res){
    res.render('index3',{title:title,author:author,usrstatus:usrstatus});
});
app.get("/singlepost/:id",function(req,res){
    res.render('singlepost',{title:title[req.params.id],description:description[req.params.id]})
});
app.get("/login",function(req,res){
    res.render('login')
});

app.post("/auth",function(req,res){
    user=req.body.username
    pass=req.body.password
    // console.log(user + pass);
    for(var i=0; i<users.length;i++){
        if(users[i]==user && passs[i]==pass){
            // res.send('Logged In');
            req.session.usrtyp=usrtyp[i];
            req.session.isLogin=true;
            req.session.loginuser=user;
            req.session.usrstatus=usrstatus[i];
            // console.log(req.session.loginuser);
            break;
        }
        else{
            req.session.isLogin=false;
        }}
    
        if(req.session.isLogin==true && req.session.usrtyp==1 && req.session.usrstatus==1){
            res.redirect("/dashboard");
        }
        else if(req.session.isLogin==true && req.session.usrtyp==0 && req.session.usrstatus==1){
            res.redirect("/admDash")
        }
        else{
            res.redirect("/login");
        }
    });
    app.get("/admDash",function(req,res){
        res.render("admdash")
    });
    app.get("/admedit",function(req,res){
        res.render("admedit",{title:title,description:description});
    });
    app.get("/dashboard",function(req,res){
        if(req.session.isLogin==true){
        res.render('dashboard');}
        else{
            res.redirect("/login")
        }
    });
    app.get('/logout',function(req,res){
        req.session.destroy();
        res.redirect("/dashboard")
    });
    app.get("/cap",function(req,res){
        if(req.session.isLogin==true){
            res.render("cap");
        }
        else{
            res.redirect("/login");
        }
    });
    
    app.post("/ppost",function(req,res){
        if(req.session.isLogin==true){
        var tp=req.body.title;
        var dp=req.body.description;
        var ap=req.session.loginuser;
        title.push(tp);
        description.push(dp);
        author.push(ap);
        res.redirect("/");
        }
    });

    app.get('/signup',function(req,res){
        res.render('signup');
    });
    app.post("/signup",function(req,res){
        var uname=req.body.username;
        var pass=req.body.asd;
        var cpass=req.body.cpd;
        // console.log(uname + pass + cpass);
        if(pass==cpass){
            users.push(uname);
            passs.push(pass);
            usrtyp.push(1);
            usrstatus.push(1);
            console.log(users);
            console.log(passs);
            res.redirect("/login")
        }
        else{
            res.redirect("/signup")
        }
    });
    app.get("/edit-del",function(req,res){
        if(req.session.isLogin==true){
        var searchElement=req.session.loginuser;
        var indices=[];
        for(let i=0;i<author.length; i++){
            if(author[i] === searchElement){
                indices.push(i);
            }
        }
        console.log(indices);
        res.render("edit-del",{title:title,description:description,indices:indices});
    }
    });
    app.get("/del/:id",function(req,res){
        if(req.session.isLogin==true){
        var index=req.params.id;
        title.splice(index,1);
        description.splice(index, 1);
        author.splice(index, 1);
        res.redirect("/");
        }
    });
    app.post("/epost",function(req,res){
      if(req.session.isLogin==true){
      var index=req.body.index;
      title[index]=req.body.title;
      description[index]=req.body.description;
      console.log(index);
      res.redirect("/");
      }
    });
    app.get("/edit/:id",function(req,res){
        if(req.session.isLogin==true){
        var index=req.params.id;
        res.render("eap",{title:title[index],description:description[index],index:index});
        }
    });  
    app.get("/manageuser",function(req,res){
        res.render("manage",{users:users,usrtyp:usrtyp,usrstatus:usrstatus});
    });
    app.get("/activate/:id",function(req,res){
        var id=req.params.id;
        usrstatus[id]=1;
        res.redirect("/manageuser");
    });
    app.get("/deactivate/:id",function(req,res){
        var id=req.params.id;
        usrstatus[id]=0;
        res.redirect("/manageuser");
    });


app.listen(3000,function(req,res)
{
    console.log("server started");
});