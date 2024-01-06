const mysql = require('mysql2');

var connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    database : 'hust_airline',
    user : 'root',
    password : 'Ruby5819'
});

connection.connect(function(error){
    if(error)
    {
        throw error;
    }
    else
    {
        console.log('MySQL Database is connected Successfully');
    }
})

module.exports= connection; 