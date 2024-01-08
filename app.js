import express from 'express'
import mongoose from 'mongoose'
import apiRoutes from './routes/apiRoutes.js'

const app = express()
app.use(express.json())
app.use(express.static('public'))

const dbURI = 'mongodb+srv://node1user:1234567Gala@node1.992ut2g.mongodb.net/restapi'
mongoose.connect(dbURI)
    .then(result => app.listen(3003))
    .catch(err => console.log(err))

app.set('view engine', 'ejs')

//routes
app.get('/', (req, res) => res.render('home'))
app.get('/showAll', (req, res) => res.render('showAll'))
app.get('/add', (req, res) => res.render('add'))
app.use('/api', apiRoutes)
