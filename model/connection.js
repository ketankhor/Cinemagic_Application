const mongoose=require('mongoose')
const DB="mongodb://127.0.0.1:27017/MovieDB";
let connection;
mongoose.connect(DB).then((conn)=>{
    console.log('connect to DB');
    connection=conn;
})
module.exports=connection;

