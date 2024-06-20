const express=require('express')
require('dotenv').config({path:'./config.env'});
const app=express();
const cookieParser=require('cookie-parser')

const userRoutes=require('./routes/userRoutes');
const movieRoutes=require('./routes/movieRoutes');

const AppError = require('./util/appError');
const globalErrorHandler=require('./controller/errController')


app.use(express.json());
app.use(cookieParser());
app.use(express.static(process.env.PUBLIC_FOLDER))
app.use((req,res,next)=>{console.log(req.url);next()})

app.get('/',(req,res)=>{
    res.sendFile(process.env.PUBLIC_FOLDER+'/home.html');
})

app.use('/api/user',userRoutes)
app.use('/api/movies',movieRoutes);

app.all('*',(req,res,next)=>next(new AppError(`path : ${req.url} not found`,400)));

app.use(globalErrorHandler)

app.listen(3000,()=>console.log('listening at port 3000'))