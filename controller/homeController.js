var database = require('../database');
var read = require('fs');
let obj;
function readSavedData() {
    read.readFile('./saved.json' , 'utf-8' , (err , data)=>{
        // console.log(data);
        //console.log(typeof(data));
        obj = JSON.parse(data);
        //console.log(obj);
    });
}

readSavedData();

const getForgotpassword = (request, response, next) => {
    response.render('forgot_password', { message: request.flash() });
}

// const nodemailer = require('nodemailer');
const sendEmail = require('./sendEmail.js'); 
const postForgotpassword = (request, response, next) => {
    var email = request.body.email;

    if (email) {
        var verificationCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        sendEmail(email, 'Verification Code', `Your verification code is: ${verificationCode}`);
        request.session.resetCode = verificationCode;
        request.session.resetEmail = email;
        response.redirect('/project/verify_reset_code');
    } else {
        request.flash('fail', 'Vui lòng nhập địa chỉ email của bạn.');
        response.redirect('/project/forgot_password');
    }
}

 const { validationResult } = require('express-validator');
// const read = require('fs').promises;

const getVerifyResetCode = (req, res) => {
    res.render('verify_reset_code', { message: req.flash() }); 
};

const postVerifyResetCode = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('verify_reset_code', {
                errors: errors.array(),
            });
        }

        const enteredCode = req.body.resetCode;

        const savedCode = req.session.resetCode;
        const savedEmail = req.session.resetEmail;

        if (enteredCode === savedCode) {
            res.redirect('/project/reset_password');
        } else {
            res.status(400).render('verify_reset_code', {
                errors: [{ msg: 'Mã reset code không hợp lệ.' }],
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};



const getResetPassword = (req, res) => {
    res.render('reset_password', { message: req.flash() });
};
const postResetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('reset_password', {
                errors: errors.array(),
            });
        }

        const newPassword = req.body.newPassword;
        const confirmNewPassword = req.body.confirmNewPassword;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).render('reset_password', {
                errors: [{ msg: 'Mật khẩu mới và xác nhận không khớp.' }],
            });
        }

        const resetEmail = req.session.resetEmail;
        const query = `
            UPDATE users
            SET user_password = "${newPassword}"
            WHERE user_email = "${resetEmail}"
        `;

        database.query(query, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Internal Server Error');
            }

            // Làm sạch session sau khi đã đặt lại mật khẩu
            req.session.resetCode = undefined;
            req.session.resetEmail = undefined;

            res.redirect('/project');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


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
                        obj.uId=data[0].user_id;
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
    obj.uId=0;
    read.writeFile('./saved.json' , JSON.stringify(obj) , (err)=>{
        console.log(err);
    });
    response.redirect('/');
}
const getUserHomepage = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
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
    getAdminHome,
    getForgotpassword,
    postForgotpassword,
    getVerifyResetCode,
    postVerifyResetCode,
    getResetPassword,
    postResetPassword
}