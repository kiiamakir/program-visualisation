const axios = require('axios')
const coursesRouter = require('express').Router()
const Course = require('../models/course')
const jwt = require('jsonwebtoken')

const SISU_API_KEY= process.env.SISU_API_KEY;
const SISU_API_URL= process.env.SISU_API_URL;

const parseSisuData = (data) => {
    const latestInstanceName = data[0].name.en
    const splitName = latestInstanceName.split(',')
    return splitName[0]

}

coursesRouter.get('/:code', async (request, response) => {
    const course = await Course.findOne({ code: request.params.code })
    if (course) {
    response.json(course)
    } else {
    response.status(404).end()
    }
})

coursesRouter.get('/sisu/:code', async (request, response) => {
    
    try {
        const course = await axios.get(
            `${SISU_API_URL}/courseunitrealisations`,
        {
          params: {
            USER_KEY: SISU_API_KEY,
            code: request.params.code
          }
        }
        )

        if(course.data?.error) {
            response.status(404).end()
        } else {
            const parsedData = parseSisuData(course.data)
            response.json(parsedData)
        }

    } catch (e) {
        response.status(404).end()
    }
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

coursesRouter.post('/', async (request, response) => {

    const array = request.body;

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    Course.insertMany(array)
    .then(function (docs) {
        response.json(docs);
    })
    .catch(function (err) {
        response.status(500).send(err);
    });
})

coursesRouter.post('/updateCourse', async (request, response) => {
    const course = request.body;
    console.log(course);

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    Course.updateOne({code: course.code}, {$set: {name: course.name, onlineElements: course.onlineElements}})
    .then(function (docs) {
        response.json(docs);
    })
    .catch(function (err) {
        response.status(500).send(err);
    });
})


module.exports = coursesRouter