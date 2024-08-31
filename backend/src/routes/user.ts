import express from 'express'
import { newUser, userSignIn } from '../controllers/user.js';
//import { singleUpload } from '../middlewares/fileHandling.js';
const app = express()
//app.post('/new-user',singleUpload,newUser)
app.post('/signin-user',userSignIn)
export default app;