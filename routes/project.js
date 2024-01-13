var express = require('express');
var read = require('fs');
let obj;
var router = express.Router();
const { getForgotpassword, postForgotpassword, getVerifyResetCode, postVerifyResetCode, getResetPassword, postResetPassword } = require('../controller/homeController');
const {getLogin,postLogin,getResigter,postResigter,getAdminLogin,postAdminLogin, postLogout, getUserHomepage, postAdminLogout, getAdminHome} = require('../controller/homeController');
const { count } = require('console');
const { getMyTickets, getMyProfile, getUpdateProfile, postUpdateProfile, getCancelTicket, postFlight, getBooking,
         postBooking,
         getSettings,
         postSettings,
         getPayment,
         postPayment,
         getTicketInfo} = require('../controller/userController');
const { getEditFlight, getEditUser, getEditTicket, getUpdateFlight, postUpdateFlight, getAddFlight, postAddFlight, getUpdateUser, postUpdateUser, postDeleteFilght, postTicketByUId, postDeleteTicket, getAddUser, postAddUser, getUpdateTicket, postUpdateTicket, } = require('../controller/adminController');
read.readFile('./saved.json' , 'utf-8' , (err , data)=>{
   // console.log(data);
    //console.log(typeof(data));
    obj = JSON.parse(data);
    if (obj) {
        console.log("Book ID:", obj.book_id);
        console.log("Check Admin:", obj.checkadmin);
        console.log("Check User:", obj.checkuser);
        console.log("ID User:", obj.uId);
    } else {
        console.error("Dữ liệu JSON không được đọc đúng cách.");
    }
})

router.get("/", getLogin);

router.post("/login", postLogin);

router.get("/register", getResigter);

router.post("/register", postResigter);

router.get("/admin_cred", getAdminLogin);

router.post("/admin_login", postAdminLogin);

router.get("/admin_login/admin", getAdminHome);

router.get('/admin_login/admin_edit_flight', getEditFlight);

router.get('/admin_login/admin_edit_user',getEditUser);

router.get('/admin_login/admin_edit_ticket',getEditTicket);

router.get('/admin_login/add_flight',getAddFlight);

router.post('/admin_login/add_flight',postAddFlight);

router.get('/admin_login/edit_flight/:fid',getUpdateFlight);

router.post('/admin_login/edit_flight/:fid',postUpdateFlight);

router.get('/admin_login/add_user',getAddUser);

router.post('/admin_login/add_user',postAddUser);

router.get('/admin_login/edit_user/:userid',getUpdateUser);

router.post('/admin_login/edit_user/:userid',postUpdateUser);

router.get('/admin_login/edit_ticket/:bid',getUpdateTicket);

router.post('/admin_login/edit_ticket/:bid',postUpdateTicket);

router.post("/admin_login/deleteflight/:fid",postDeleteFilght);

router.post("/admin_login/findticket",postTicketByUId);

router.post("/admin_login/deleteticket/:bid",postDeleteTicket);

router.get("/login/user/:uid", getUserHomepage);

router.get("/login/user/:uid/my_tickets", getMyTickets);

router.get("/login/user/:uid/my_tickets/cancel/:bid", getCancelTicket);

router.get("/login/user/:uid/my_profile",getMyProfile);

router.get("/login/user/:uid/update_profile",getUpdateProfile)

router.post("/login/user/:uid/update_profile",postUpdateProfile)

router.post("/login/user/:uid/form_submit", postFlight);

router.get("/login/user/:uid/form_submit/booking/:fid", getBooking);

router.post("/login/user/:uid/form_submit/booking/:fid", postBooking);

router.get("/login/user/:uid/setting",getSettings);

router.post("/login/user/:uid/setting",postSettings);

router.get("/login/user/:uid/payment",getPayment);

router.post("/login/user/:uid/payment",postPayment);

router.get("/login/user/:uid/:b_id/ticketInfo",getTicketInfo);

router.post("/logout",postLogout);

router.post("/admin/logout",postAdminLogout);

router.get('/forgot_password', getForgotpassword);

router.post('/forgot_password', postForgotpassword);

router.get('/verify_reset_code', getVerifyResetCode);

router.post('/verify_reset_code', postVerifyResetCode);

router.get('/reset_password', getResetPassword);

router.post('/reset_password', postResetPassword);

module.exports = router;