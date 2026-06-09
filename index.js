//middleware routes configration

import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './api/route/user.route.js'
import companyRoute from './api/route/company.route.js'
import jobRoute from './api/route/job.route.js'
import applicationRoute from './api/route/application.route.js'
import path from "path";
dotenv.config()
const app = express()

const corsOption = {
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true
}
app.use(cors(corsOption))


//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);


//base route
//Auth Route

app.use("/api/v1/user", authRouter)
//http://localhost:8000/api/v1/user


//company routes

app.use('/api/v1/company', companyRoute)

//jobs ka route

app.use('/api/v1/jobs', jobRoute)

//application 
app.use('/api/v1/application', applicationRoute)

export default app;