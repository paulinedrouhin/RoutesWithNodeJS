const  mysql = require('mysql');
const  connection = mysql.createConnection({
host :  'localhost', // address of the server
user :  'Pauline', // username
password :  'Poulet01,',
database :  'ApiFilRouge',
});
module.exports = connection;