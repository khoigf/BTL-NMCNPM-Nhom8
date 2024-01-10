var database = require('../database');
var read = require('fs');
let obj;
read.readFile('./saved.json' , 'utf-8' , (err , data)=>{
   // console.log(data);
    //console.log(typeof(data));
    obj = JSON.parse(data);
})

const getMyTickets = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
    var uid = request.params.uid;
    var ob_id = {
        user_id :uid
    } ;

    query = `SELECT bookings.*, users.user_name
        FROM bookings
        JOIN users ON bookings.b_user_id = users.user_id
        WHERE bookings.b_user_id = "${uid}"`;
    
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
    }else{
        request.flash('fail','You have to login');
        response.redirect(`/project`);
    }
}
const getCancelTicket = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
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
            request.flash('info','Your ticket has been cancelled');
            response.redirect(`/project/login/user/${uid}/my_tickets`);
        }
    });}else{
        request.flash('fail','You have to login');
        response.redirect(`/project`);
    }
}
const postFlight = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
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
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project`);
}
}
const getBooking = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
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
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project`);
}
}
const postBooking = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
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
            request.flash('success','Ticket booked successfully');
            response.redirect(`/project/login/user/${user_id}/payment`);
		}

	});
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project`);
}

}
const getMyProfile = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
    var uid = request.params.uid;
    var ob_id = {
        user_id : uid
    };
    query = `SELECT *
        FROM users
        WHERE user_id = "${uid}"`;
    
    database.query(query, function(error,data){

        if(error)
        {
            throw error;
        }
        else
        {
            data.push(ob_id);
            response.render('profile',{sampleData:data, message : request.flash()});
        }
    });
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project`);
}
}
const getUpdateProfile = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
    var uid = request.params.uid;
    var ob_id = {
        user_id : uid
    };
    query = `SELECT *
        FROM users
        WHERE user_id = "${uid}"`;
    
    database.query(query, function(error,data){

        if(error)
        {
            throw error;
        }
        else
        {
            data.push(ob_id);
            response.render('updateprofile',{sampleData:data, message : request.flash()});
        }
    });
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project`);
}
}
const postUpdateProfile = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
    var user_id = request.params.uid;
    var user_email = request.body.userEmail;
    var user_mobile = request.body.userMobile;
	var user_address = request.body.userAddress;

    var query = `update users
                set 
                user_email = "${user_email}",
                user_mobile = "${user_mobile}",
                user_address = "${user_address}"
                where user_id = "${user_id}" `;

    database.query(query, function(error,data){
        if(error)
        {
            throw error;
        }
        else
		{
            request.flash('success','Update Successfully');
            response.redirect(`/project/login/user/${user_id}/my_profile`);
		}
    })
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project`);
}
}
const getSettings = (request, response, next)=>{
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
            response.render('user_settings',{sampleData:data, message : request.flash()});
        }
    })
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project`);
}
}
const postSettings = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
    var user_id = request.params.uid;
    var user_password = request.body.newPassword;

    var query = `update users
                set 
                user_password = "${user_password}"
                where user_id = "${user_id}" `;

    database.query(query, function(error,data){
        if(error)
        {
            throw error;
        }
        else
		{
            obj.checkuser=false;
            obj.uId=0;
            read.writeFile('./saved.json' , JSON.stringify(obj) , (err)=>{
                console.log(err);
            });
            request.flash('success','Update Successfully');
            response.redirect(`/project`);
		}
    })
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project`);
}
}   
const getPayment = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
    var uid = request.params.uid;
    response.render('payment', { user_id: uid, message: request.flash() });
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project`);
}
}
const postPayment = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
    var user_id = request.params.uid;
    var account_number = request.body.account_number;
    var bank_name = request.body.bank_name; // Thêm dòng này để lấy tên hãng tài khoản ngân hàng
    var amount = request.body.amount;
 
    // Thực hiện xử lý thanh toán, có thể gọi đến các hàm xử lý thanh toán hoặc tích hợp cổng thanh toán tại đây
    // Trong trường hợp này, giả sử bạn đang mô phỏng liên kết với tài khoản ngân hàng bằng cách chỉ hiển thị thông báo.
 
    // Mô phỏng thành công
    var successMessage = `Payment of ${amount} VND from account ${account_number} (${bank_name}) successful.`;
 
    // Mô phỏng thất bại
    var failMessage = `Payment failed. Please check your account information.`;
 
    // Hiển thị thông báo
    if (Math.random() < 0.95) {
        request.flash('info', successMessage);
        response.redirect(`/project/login/user/${user_id}`);
    } else {
        request.flash('fail', failMessage);
        response.redirect(`/project/login/user/${user_id}/payment`);
    }
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project`);
}
}
const getTicketInfo = (request, response, next)=>{
    if(obj.checkuser && obj.uId == request.params.uid){
    var uid = request.params.uid;
    var b_id = request.params.b_id;
    var ob_id = {
        user_id :uid
    } ;

    query = `SELECT bookings.*, users.user_name ,flights.*
        FROM bookings
        JOIN users ON bookings.b_user_id = users.user_id
        JOIN flights ON bookings.b_f_id = flights.f_id
        WHERE bookings.b_id = "${b_id}"`;
    
    database.query(query, function(error,data){

        if(error)
        {
            throw error;
        }
        else
        {
            data.push(ob_id);
            response.render('ticketInfo',{sampleData:data, message : request.flash()});
        }
    });
}else{
    request.flash('fail','You have to login');
    response.redirect(`/project`);
}
}
module.exports = {
    getMyTickets,
    getMyProfile,
    getUpdateProfile,
    postUpdateProfile,
    getCancelTicket,
    postFlight,
    getBooking,
    postBooking,
    getSettings,
    postSettings,
    getPayment,
    postPayment,
    getTicketInfo
}