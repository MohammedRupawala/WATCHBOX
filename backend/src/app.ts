import express  from 'express'
import  { config } from 'dotenv'
config({path :"./.env"})
import videoRoutes from './routes/videoManage.js'
import userRoutes from './routes/user.js'
import { errorMiddleware } from './middlewares/errorHandler.js'
import { connectDB } from './utils/features.js'
const app = express()
const port = process.env.PORT || 4000;
const mongo_uri = process.env.MONGO_URI || ""
export const secretKey = process.env.JWT_SECRET || "Your Secret Key"

connectDB(mongo_uri)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads/image',express.static('uploads/image'))
app.use('/uploads/video', express.static('uploads/video'))

app.use('/api/v1/video',videoRoutes)
app.use('/api/v1/user',userRoutes)

app.use(errorMiddleware)
app.listen(port,()=>{
    console.log(`Server Listening At http://localhost:${port}`)
})