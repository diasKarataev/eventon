import express from 'express'

const app = express()

const PORT = 8080;
console.log(`Server is running on port ${PORT}...`)
app.listen(PORT)