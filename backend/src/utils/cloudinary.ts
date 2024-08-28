import  {v2 as cloudinary} from 'cloudinary'
import { config } from 'dotenv'

config()
 const cloudName = process.env.CLOUD_NAME || "Your Cloudinary Name"
 const cloudinaryKey = process.env.CLOUDINARY_API_KEY || "Your Cloudinary Key"
 const cloudinarySecret = process.env.CLOUDINARY_API_SECRET || "Your Cloudinary Secret"

cloudinary.config({
    cloud_name : cloudName,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

export default cloudinary