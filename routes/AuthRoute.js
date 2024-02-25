import express from 'express';
import multer from 'multer'
import { getUserDetails, login, signup, updateRequests, verifyEmail, verifyLoginCode, upload } from '../controller/AuthController.js';
import { signupSchema, validateRequest } from '../middleware/validateRequest.js';

const storage = multer.memoryStorage();
const upld = multer({ storage: storage });
const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/signup', validateRequest(signupSchema), signup);
userRouter.get('/user', getUserDetails);
userRouter.get('/update-requests', updateRequests);
userRouter.get('/verify', verifyEmail);
userRouter.post('/verify-login', verifyLoginCode);
userRouter.post('/upload',upld.single('pdfFile'),upload);


export default userRouter