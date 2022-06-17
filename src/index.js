const express = require('express')
const axios = require('axios')
const responseTime = require('response-time')

const app = express()
app.use(responseTime())

app.get('/civilizations', async (req, res) => {
    const response = await axios.get('https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations')
    res.json(response.data)
})


app.listen(3000)
console.log('Server running on port 3000')