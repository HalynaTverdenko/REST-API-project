import Dev from '../models/programuotojas.js'

const handleErrors = (err) => {
    let errors = {vardas: '', tech: '', laisvas: '', location: ''}
    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }
}

export const prog_get = (req, res) => {
    const lng = parseFloat(req.query.lng)
    const lat = parseFloat(req.query.lat)

    console.log('Parsed Coordinates:', lng, lat)

    Dev.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng, lat],
                },
                distanceField: 'distance',
                spherical: true,
                // in meters (100km)
            },
        },
    ])
        .then(devs => {
            console.log('Found Developers:', devs)
            res.send(devs)
        })
        .catch(error => {
            console.error('Error:', error)
            res.status(500).send(error.message)
        })
}

// const dev = new Dev({
//     vardas:req.body.vardas, 
//     tech:req.body.tech, 
//     laisvas:req.body.laisvas, 
//     location:req.body.location

// const vardas = parseFloat(req.query.vardas) 
// const tech = parseFloat(req.query.tech)
// const laisvas = parseFloat(req.query.laisvas)
// const location = parseFloat(req.query.tech)

// const {vardas, tech, laisvas, location} = req.body

export const prog_post = async (req, res) => {
    const {vardas, tech, laisvas, location} = req.body
    let emptyFields = []

    if(!vardas) {emptyFields.push('vardas')}
    if(!tech) {emptyFields.push('tech')}
    if(!laisvas) {emptyFields.push('laisvas')}
    if(!location) {emptyFields.push('location')}
    if(emptyFields.length > 0) {
        return res.status(400).json({error: "please, fill in all fields", emptyFields})
    }

    try {
        const dev = await Dev.create({vardas, tech, laisvas, location})
        res.status(200).json({dev: dev._id})
    } catch(err) {
        const errors = handleErrors(err)
        res.status(400).json({errors}) // дописать варианты ошибок
    } }



export const prog_details = (req, res) => {
    const id = req.params.id
    Dev.findById(id)
    .then(result => res.render('details',  { dev: result, title: 'Information about the programmer' }))
    .catch(err => res.status(404).render('404', {title: 'Puslapis nerastas'}))
}


export const prog_create_get = (req, res) => {
    res.render('add', {title: 'Add new programmer'})
}

export const prog_create_post = (req, res) => {
    const dev = new Dev(req.body)
    dev.save()
    .then(result => res.redirect('/'))
    .catch(error => console.log(error))
}







export const prog_put = (req, res) => {
    Dev.findByIdAndUpdate({_id: req.params.id}, req.body)
        .then(() => {
            Dev.findOne({_id: req.params.id})
                .then(dev => res.send(dev))
        })
        .catch(error => {
            console.error('Error', error)
            res.status(201).send(error.message) //resource is not found
            res.status(204).send(error.message) //no content
        })
}

export const prog_delete = (req, res) => {
    const {id} = req.params.id
    Dev.findByIdAndDelete(id)
        .then(res => res.status(200).json({ redirect: '/home' }))
        .catch(error => {
            console.error('Error', error)
            res.status(202).send(error.message) //Accepted, but not executed yet
            res.status(204).send(error.message) //no content
            res.status(404).send({error: "Post doesn't exist!"})
        })
}