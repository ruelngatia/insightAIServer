import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import userRouter from './routes/AuthRoute.js'
import { connectToDB } from './config/db.js'
import paymentRouter from './routes/PaymentRoute.js'

const app = express()

app.use(express.json())
app.use(cors({
    origin: [' * ', 'https://insightai-n874.onrender.com']
}))
app.use(express.static('../front'));
app.use(userRouter)
app.use(paymentRouter)

connectToDB()

app.listen(4004, () => console.log('server listening on http://localhost:4004'))