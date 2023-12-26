const mysql = require('mysql2');

var connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    database : 'sys',
    user : 'root',
    password : 'Khoi2003'
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