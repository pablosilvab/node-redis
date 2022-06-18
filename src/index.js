const express = require('express')
const axios = require('axios')
const responseTime = require('response-time')
const redis = require('ioredis');

const PORT = process.env.PORT || 3000
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'
const REDIS_PORT = process.env.REDIS_PORT || 6379
const REDIS_PASS = process.env.REDIS_PASS || ''

const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    no_ready_check: true,
    password: 'pM6H4pUuEo4VilW00mpkwNmwwwc1g64I'
})

client.on('connect', () => console.log(`Redis is connected on ${REDIS_HOST}:${REDIS_PORT}`))
client.on("error", (error) => console.error(error))

const app = express()
app.use(responseTime())


app.get('/', async (req, res) => {
    return res.json({message:'Hello world!'})
})

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


app.get('/civilizations/:id', async (req, res) => {
    try {
        const id = req.params.id
        client.get(req.params.id, async (err, reply) => {
            if (reply) return res.json(JSON.parse(reply));

            const response = await axios.get(
                'https://age-of-empires-2-api.herokuapp.com/api/v1/civilization/' + req.params.id
            )
            await client.set(req.params.id, JSON.stringify(response.data), (err, reply) => {
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