//localhost database

import app from './index.js'
import {db} from './utils/db.js'

db()
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`The server running on ${PORT}`)
})

