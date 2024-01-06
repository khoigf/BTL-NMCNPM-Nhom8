var express = require('express');
var read = require('fs');
var router = express.Router();
var database = require('../database');
const { count } = require('console');
const { response } = require('../app');
let obj;
read.readFile('./saved.json' , 'utf-8' , (err , data)=>{
   // console.log(data);
    //console.log(typeof(data));
    obj = JSON.parse(data);
    //console.log(obj);
})


router.get("/", function(request, response, next){

    response.render('project', {message : request.flash()});       
  
});

router.post("/login", function(request, response, next){

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
                        response.redirect(`/project/login/user/${data[0].user_id}`);
                    }
                    else
                    {
                        request.flash('fail','Incorrect Password')
                        response.redirect("/project");
                    }

            }
            else
            {
                request.flash('fail','Incorrect Email Address');
                response.redirect("/project")
            }
            response.end();
        });
    }
    else
    {
        request.flash('fail','Please Enter Email Address and Password Details');
        response.redirect('/project');
    }

});


router.get("/register", function(request, response, next){

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

});

router.post("/register", function(request, response, next){

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
                request.flash('fail','Username already taken');
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
                        request.flash('success','New User Created Successfully');
                        response.redirect('/project');
                    }
                });

            }
        }
    });

    

});


router.get("/admin_cred", function(request, response, next){

    response.render('admin_login', {message : request.flash()});  

      
});


router.post("/admin_login", function(request, response, next){

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
                        // response.redirect(`/project/admin_login/admin`);
                        response.redirect(`/project/admin_login/admin_page`)
                    }
                    else
                    {
                        request.flash('fail','Incorrect Password')
                        response.redirect("/project/admin_cred");
                    }
                }
            }
            else
            {
                request.flash('fail','Incorrect Username');
                response.redirect("/project/admin_cred")
            }
            response.end();
        });
    }
    else
    {
        request.flash('fail','Please Enter Email Address and Password Details');
        response.redirect('/project/admin_cred');
    }

});

router.get("/admin_login/admin_page", function(request, response, next){
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
});

router.get('/admin_login/admin_edit_flight', function(request, response) {
    let query = 'SELECT * FROM flights';

    database.query(query, function(error, data) {
        if (error) {
            throw error;
        } else {
            response.render('admin_edit_flight', { flights: data, message: request.flash() });
        }
    });
  });




    router.get('/admin_login/admin_edit_user', function(request, response) {
        let query = 'SELECT * FROM users';
    
        database.query(query, function(error, data) {
            if (error) {
                throw error;
            } else {
                response.render('admin_edit_user', { users: data, message: request.flash() });
            }
        });
    });



router.get("/login/user/:uid", function(request, response, next){

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

});

router.get("/login/user/:uid/my_tickets", function(request, response, next){

    var uid = request.params.uid;
    var ob_id = {
        user_id :uid
    } ;

    query = `select * from bookings where b_user_id = "${uid}"`;
    
    database.query(query, function(error,data){

        if(error)
        {
            throw error;
        }
        else
        {
            data.push(ob_id);
            response.render('my_tickets',{sampleData:data, message : request.flash()});
        }
    });

});

router.get("/login/user/:uid/my_tickets/cancel/:bid", function(request, response, next){

    var uid = request.params.uid;
    var bid = request.params.bid;

    query1 = `select * from bookings where b_id = "${bid}"`;

    database.query(query1 , function(error,data){
        if(error)
        {
            throw error;
        }

        else
        {
            query3 = `update flights
                      set f_remseats = f_remseats+1
                      where f_id = "${data[0].b_f_id}"`;
            
            database.query(query3, function(error,data){
                if(error)
                {
                    throw error;
                }
            });
        }
    });

    query2 = `delete from bookings where b_id = "${bid}"`;
    
    database.query(query2, function(error,data){

        if(error)
        {
            throw error;
        }
        else
        {
            request.flash('info','Your ticket has been cancelled')
            response.redirect(`/project/login/user/${uid}/my_tickets`);
        }
    });

});


router.post("/login/user/:uid/form_submit", function(request, response, next){

    let uid = request.params.uid;
    var ob_id = {
        user_id :uid
    } ;
    var data1;
	var source = request.body.from;

	var dest = request.body.to;
    
    var date = request.body.date;

	var query = `
	select * from flights
	where 
    f_source = "${source}"
    and
    f_dest = "${dest}"
    and
    f_date = "${date}"
	`;


	database.query(query, function(error, data){

		if(error)
		{
			throw error;
		}	

        else{
            data.push(ob_id);
            response.render('user_results',{sampleData:data, message: request.flash()});
        }
	});

});


router.get("/login/user/:uid/form_submit/booking/:fid", function(request, response, next){

    let uid = request.params.uid;

    var ob_id = {
        user_id : uid
    };

	var fid = request.params.fid;

    query = `select * from flights where f_id = "${fid}"`;

    database.query(query, function(error,data){
        
        if(error)
        {
            throw error;
        }
        else
        {
            if(data[0].f_remseats == 0)
            {
                request.flash('fail','No tickets avaialable in this flight');
                response.redirect(`/project/login/user/${uid}`);
            }
            else
            {
                data.push(ob_id);
                response.render('booking',{sampleData:data, message : request.flash()});
            }
        }
    });

});

router.post("/login/user/:uid/form_submit/booking/:fid", function(request, response, next){

    var f_id = request.params.fid;
    var user_id = request.params.uid;
    var f_num = request.body.f_no;
    var f_type = request.body.type;
	var f_date = request.body.date;
    
	var pas_name = request.body.name;

    obj.book_id = obj.book_id +1;

    read.writeFile('./saved.json' , JSON.stringify(obj) , (err)=>{
        console.log(err);
    });

	var pas_age = request.body.age;

	var pas_gender = request.body.gender;

    var query1 = `update flights
                  set f_remseats = f_remseats - 1 
                  where f_id = "${f_id}" `;

    database.query(query1, function(error,data){
        if(error)
        {
            throw error;
        }

    })


	var query2 = `
	INSERT INTO bookings
	VALUES ("${obj.book_id}", "${user_id}", "${f_id}", "${f_num}", "${f_type}", "${f_date}", "${pas_name}", "${pas_age}", "${pas_gender}")
	`;

	database.query(query2, function(error, data){

		if(error)
		{
			throw error;
		}	
		else
		{
            request.flash('success','Ticket booked successfully')
            response.redirect(`/project/login/user/${user_id}`)
		}

	});


});


module.exports = router;