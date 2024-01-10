var database = require('../database');
var read = require('fs');
let obj;
read.readFile('./saved.json' , 'utf-8' , (err , data)=>{
   // console.log(data);
    //console.log(typeof(data));
    obj = JSON.parse(data);
    //console.log(obj);
})

const getLogin = (request, response, next)=>{
    response.render('project', {message : request.flash()});       
  
}
const postLogin = (request, response, next)=>{

    var user_name = request.body.user_name

    var user_password = request.body.user_password;

    if(user_name && user_password)
    {
        query = `
        SELECT * FROM users
        WHERE user_name = "${user_name}"
        `;

        database.query(query, function(error, data){

            if(data.length > 0)
            {
                    if(data[0].user_password == user_password)
                    {
                        obj.checkuser=true;
                        read.writeFile('./saved.json' , JSON.stringify(obj) , (err)=>{
                            console.log(err);
                        });
                        response.redirect(`/project/login/user/${data[0].user_id}`);
                    }
                    else
                    {
                        request.flash('fail','Mật khẩu không đúng')
                        response.redirect("/project");
                    }

            }
            else
            {
                request.flash('fail','Tên đăng nhập không đúng');
                response.redirect("/project")
            }
            response.end();
        });
    }
    else
    {
        request.flash('fail','Hãy nhập tên đăng nhập và mật khẩu');
        response.redirect('/project');
    }

}
const getResigter = (request, response, next)=>{

    var query = `select * from users`;

    database.query(query, function(error, data){

        if(error)
		{
			throw error;
		}	
		else
		{
			response.render('register', {message : request.flash(),sampleData:data});
        }

    });   
  
}
const postResigter = (request, response, next)=>{
    var id = request.body.user_id;
    var name = request.body.user_name;
    var pass = request.body.pass;
    var mobile = request.body.mobile;
    var email = request.body.email;
    var addr = request.body.addr; 

    var query1 = `select * from users`;

    database.query(query1, function(error, data){

        if(error)
		{
			throw error;
		}	
		else
		{
            var flag = true;
            for(ctr = 0; ctr < data.length;ctr++)
            {
                if(data[ctr].user_name == name )
                {
                    flag = false;
                    break;
                    
                }
            }

            if(flag == false)
            {
                request.flash('fail','Tên đăng nhập đã tồn tại');
                response.redirect('/project/register');
            }

            else
            {
                var query2 = ` insert into users 
                values("${id}", "${name}", "${pass}", "${mobile}", "${email}", "${addr}")`;

                database.query(query2, function(error,data){
                    if(error)
                    {
                        throw error;
                    }
                    else
                    {
                        request.flash('success','Tạo tài khoản thành công');
                        response.redirect('/project');
                    }
                });

            }
        }
    });

}
const getAdminLogin = (request, response, next)=>{
    response.render('admin_login', {message : request.flash()});
  
}
const postAdminLogin = (request, response, next)=>{
    var user_name = request.body.user_name

    var user_password = request.body.user_password;

    if(user_name && user_password)
    {
        query = `
        SELECT * FROM admins
        WHERE admin_username = "${user_name}"
        `;

        database.query(query, function(error, data){

            if(data.length > 0)
            {
                for(var count = 0; count < data.length; count++)
                {
                    if(data[count].admin_password == user_password)
                    {
                        obj.checkadmin=true;
                        read.writeFile('./saved.json' , JSON.stringify(obj) , (err)=>{
                            console.log(err);
                        });
                        response.redirect(`/project/admin_login/admin`);
                    }
                    else
                    {
                        request.flash('fail','Mật khẩu không đúng')
                        response.redirect("/project/admin_cred");
                    }
                }
            }
            else
            {
                request.flash('fail','Tên đăng nhập không đúng');
                response.redirect("/project/admin_cred")
            }
            response.end();
        });
    }
    else
    {
        request.flash('fail','Hãy nhập tên đăng nhập và mật khẩu');
        response.redirect('/project/admin_cred');
    }
}
const postLogout = (request, response, next)=>{
    obj.checkuser=false;
    read.writeFile('./saved.json' , JSON.stringify(obj) , (err)=>{
        console.log(err);
    });
    response.redirect('/');
}
const getUserHomepage = (request, response, next)=>{
    if(obj.checkuser){
    var id = request.params.uid;
    query = `select * from users where user_id = "${id}"`;
    database.query(query, function(error,data){

        if(error)
        {
            throw error;
        }
        else
        {
            response.render('user',{sampleData:data, message : request.flash()});
        }
    })       
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project`);
}
}
const postAdminLogout = (request, response, next)=>{
    obj.checkadmin=false;
    read.writeFile('./saved.json' , JSON.stringify(obj) , (err)=>{
        console.log(err);
    });
    response.redirect('/');
}
const getAdminHome = (request, response, next)=>{
    if(obj.checkadmin){
    query = `select * from admins`

    database.query(query, function(error,data){
        if(error)
        {
            throw error;
        }
        else
        {
            response.render('admin_page',{sampleData:data[0], message : request.flash()})
        }
    })
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project/admin_cred`);
}
}
module.exports = {
    getLogin,
    postLogin,
    getResigter,
    postResigter,
    getAdminLogin,
    postAdminLogin,
    postLogout,
    getUserHomepage,
    postAdminLogout,
    getAdminHome
}