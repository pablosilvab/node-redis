const express = require('express')
const axios = require('axios')
const responseTime = require('response-time')
const redis = require('ioredis');

const PORT = process.env.PORT || 3000
const REDIS_PORT = process.env.REDIS_PORT || 6379

const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
})

client.on('connect', () => console.log(`Redis is connected on port ${REDIS_PORT}`))
client.on("error", (error) => console.error(error))

const app = express()
app.use(responseTime())

app.get('/civilizations', async (req, res) => {
    try {
        client.get('civilizations', async (err, reply) => {
            if (reply) return res.json(JSON.parse(reply));
            
            const response = await axios.get('https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations')
            await client.set('civilizations', JSON.stringify(response.data), (err, reply) => {
                if (err) {
                    console.log('error')
                }
            });
            return res.json(response.data)

        });
    } catch (err) {
        return res.status(500).json({ message: 'Error! Try again later' })
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
module.exports = app