var database = require('../database');
var read = require('fs');
let obj;
read.readFile('./saved.json' , 'utf-8' , (err , data)=>{
   // console.log(data);
    //console.log(typeof(data));
    obj = JSON.parse(data);
    //console.log(obj);
})


const getEditFlight = (request, response, next)=>{
    if(obj.checkadmin){
    let query = 'SELECT * FROM flights';

    database.query(query, function(error, data) {
        if (error) {
            throw error;
        } else {
            response.render('admin_edit_flight', { flights: data, message: request.flash() });
        }
    });
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project/admin_cred`);
}
}
const getEditUser = (request, response, next)=>{
    if(obj.checkadmin){
    let query = 'SELECT * FROM users';

    database.query(query, function(error, data) {
        if (error) {
            throw error;
        } else {
            response.render('admin_edit_user', { users: data, message: request.flash() });
        }
    });
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project/admin_cred`);
}
}
const getEditTicket = (request, response, next)=>{
    if(obj.checkadmin){
    let query = 'SELECT * FROM bookings';

    database.query(query, function(error, data) {
        if (error) {
            throw error;
        } else {
            response.render('admin_edit_ticket', { tickets: data, message: request.flash() });
        }
    });
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project/admin_cred`);
}
}
const getAddFlight = (request, response, next)=>{
    if(obj.checkadmin){
        let query = `SELECT * FROM flights`;

        database.query(query, function(error, data) {
        if (error) {
            throw error;
        } else {
            response.render('add_flight', { flight: data, message: request.flash() });
        }
    });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
const postAddFlight = (request, response, next)=>{
    if(obj.checkadmin){
        var f_id = request.body.f_id;
    var f_number = request.body.f_number;
    var f_type = request.body.f_type;
    var f_date = request.body.f_date;
    var f_source = request.body.f_source;
    var f_dest = request.body.f_dest;
    var f_dept_time = request.body.f_dept_time;
    var f_arr_time = request.body.f_arr_time;
    var f_fare = request.body.f_fare;
    var f_remseats = request.body.f_remseats;

    // Validate the input if needed

    // Construct the SQL query to insert the new flight
    var query = `
        INSERT INTO flights
        (f_id, f_number, f_type, f_date, f_source, f_dest, f_dept_time, f_arr_time, f_fare, f_remseats)
        VALUES
        ("${f_id}","${f_number}", "${f_type}", "${f_date}", "${f_source}", "${f_dest}", "${f_dept_time}", "${f_arr_time}", "${f_fare}", "${f_remseats}")
    `;

    // Execute the query
    database.query(query, function(error, data) {
        if (error) {
            throw error;
        } else {
            request.flash('success', 'Flight added successfully');
            response.redirect('/project/admin_login/admin');
        }
    });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
const getUpdateFlight = (request, response, next)=>{
    if(obj.checkadmin){
        let fid = request.params.fid;

    // Fetch the flight details based on the flight ID
    let query = `SELECT * FROM flights WHERE f_id = "${fid}"`;

    database.query(query, function(error, data) {
        if (error) {
            throw error;
        } else {
            response.render('edit_flight', { flight: data[0], message: request.flash() });
        }
    });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
const postUpdateFlight = (request, response, next)=>{
    if(obj.checkadmin){
        let fid = request.params.fid;

    let query = `
        UPDATE flights
        SET
            f_number = "${request.body.f_number}",
            f_type = "${request.body.f_type}",
            f_date = "${request.body.f_date}",
            f_source = "${request.body.f_source}",
            f_dest = "${request.body.f_dest}",
            f_dept_time = "${request.body.f_dept_time}",
            f_arr_time = "${request.body.f_arr_time}",
            f_fare = "${request.body.f_fare}",
            f_remseats = "${request.body.f_remseats}"
        WHERE f_id = "${fid}"
    `;

    database.query(query, function(error, data) {
        if (error) {
            throw error;
        } else {
            let query1 = `
        UPDATE bookings
        SET
            b_f_number = "${request.body.f_number}",
            b_f_type = "${request.body.f_type}",
            b_f_date = "${request.body.f_date}"
        WHERE b_f_id = "${fid}"
        `;
            database.query(query1, function(error, data) {
                if (error) {
                    throw error;
                } else {
                    request.flash('success', 'Flight details updated successfully');
                    response.redirect('/project/admin_login/admin');
                }
            });
        }
    });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
const getUpdateUser = (request, response, next)=>{
    if(obj.checkadmin){
        let userid = request.params.userid;
    
        // Fetch the flight details based on the flight ID
        let query = `SELECT * FROM users WHERE user_id = "${userid}"`;
    
        database.query(query, function(error, data) {
            if (error) {
                throw error;
            } else {
                response.render('edit_user', { users: data[0], message: request.flash() });
            }
        });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
const postUpdateUser = (request, response, next)=>{
    if(obj.checkadmin){
        let userid = request.params.userid;
    
        // Update the flight details in the database based on the form submission
        let query = `
            UPDATE users
            SET
                user_name = "${request.body.user_name}",
                user_mobile = "${request.body.user_mobile}",
                user_email = "${request.body.user_email}",
                user_address = "${request.body.user_address}"
            WHERE user_id = "${userid}"
        `;
    
        database.query(query, function(error, data) {
            if (error) {
                throw error;
            } else {
                request.flash('success', 'User details updated successfully');
                response.redirect('/project/admin_login/admin');
            }
        });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
const postDeleteFilght = (request, response, next)=>{
    if(obj.checkadmin){
        var f_id = request.params.fid;

    query = `DELETE FROM bookings 
              WHERE b_f_id ="${f_id}"`;

    database.query(query, function(error, data){
        if (error) {
            console.log("Loi database");
            throw error;
        }
        else {
            query1 = `DELETE FROM flights 
              WHERE f_id ="${f_id}"`;

    database.query(query1, function(error, data){
        if (error) {
            console.log("Loi database");
            throw error;
        }
        else {
            request.flash('success', 'Flight delete successfully');
            response.redirect('/project/admin_login/admin');
        }
    });
        }
    });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
const postTicketByUId = (request, response, next)=>{
    if(obj.checkadmin){
        var userId = request.body.uid;
    var query7 = `SELECT * FROM bookings WHERE b_user_id = "${userId}"`;
    database.query(query7, (err, data) => {
          if (err) {
            console.error('Error fetching bookings by user ID:', err);
            return response.status(500).send('Internal Server Error');
          }
          response.render('admin_findbyuid', { tickets: data, message: request.flash() });
        });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
const postDeleteTicket = (request, response, next)=>{
    if(obj.checkadmin){
        var bId = request.params.bid;
  
    var query = `DELETE FROM bookings WHERE b_id = ${bId}`;
  
    database.query(query, (err, data) => {
        if (err) {
            throw err;
        }
        else {
            request.flash('success', 'Booking delete successfully');
            response.redirect('/project/admin_login/admin');
        }
    });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
const getAddUser = (request, response, next)=>{
    if(obj.checkadmin){
        let query = `SELECT * FROM users`;

        database.query(query, function(error, data) {
        if (error) {
            throw error;
        } else {
            response.render('add_user', { users: data, message: request.flash() });
        }
    });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
const postAddUser = (request, response, next)=>{
    if(obj.checkadmin){
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
                response.redirect('/project//admin_login/add_user');
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
                        request.flash('success','Tạo người dùng thành công');
                        response.redirect('/project/admin_login/admin');
                    }
                });

            }
        }
    });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
const getUpdateTicket = (request, response, next)=>{
    if(obj.checkadmin){
        let bid = request.params.bid;

        let query = `SELECT * FROM bookings WHERE b_id = "${bid}"`;
    
        database.query(query, function(error, data) {
            if (error) {
                throw error;
            } else {
                response.render('edit_ticket', { ticket: data[0], message: request.flash() });
            }
        });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
const postUpdateTicket = (request, response, next)=>{
    if(obj.checkadmin){
        let bid = request.params.bid;
    
        // Update the flight details in the database based on the form submission
        let query = `
            UPDATE bookings
            SET
                b_pas_name = "${request.body.name}",
                b_pas_age = "${request.body.age}",
                b_pas_gender = "${request.body.gender}",
                b_user_id = "${request.body.uid}"
            WHERE b_id = "${bid}"
        `;
    
        database.query(query, function(error, data) {
            if (error) {
                throw error;
            } else {
                request.flash('success', 'Ticket updated successfully');
                response.redirect('/project/admin_login/admin');
            }
        });
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project/admin_cred`);
    }
}
module.exports = {
    getEditFlight,
    getEditUser,
    getEditTicket,
    getAddFlight,
    postAddFlight,
    getUpdateFlight,
    postUpdateFlight,
    getUpdateUser,
    postUpdateUser,
    postDeleteFilght,
    postTicketByUId,
    postDeleteTicket,
    getAddUser,
    postAddUser,
    getUpdateTicket,
    postUpdateTicket
}