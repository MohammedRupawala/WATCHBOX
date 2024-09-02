import express from 'express'
import isAuthenticated from '../middlewares/userMiddleware.js';
import { deleteVideo, getAllSubject, getAllVideo, getSearchResult, getUserVideo, getVideo, updateVideo, uploadVideo } from '../controllers/video.js';
import { uploadFiles } from '../middlewares/fileHandling.js';
const app =express()

app.get('/all',getAllVideo)
app.get('/all-subjects',getAllSubject)
app.get('/search-result',getSearchResult)
app.get('/user-video',isAuthenticated,getUserVideo)
app.post('/upload-video',isAuthenticated,uploadFiles,uploadVideo)
app.delete('/delete-video/:id',isAuthenticated,deleteVideo)
app.put('/update-video/:id',isAuthenticated,updateVideo)
app.get('/:id',getVideo)

export default app;