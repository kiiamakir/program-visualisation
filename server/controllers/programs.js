const programsRouter = require('express').Router()
const Program = require('../models/program')

programsRouter.get('/:name', async (request, response) => {
    const course = await Program.findOne({ name: request.params.name })
    if (course) {
    response.json(course)
    } else {
    response.status(404).end()
    }
})

programsRouter.post('/updateValue', async (request, response) => {
    const program = request.body;
    console.log(program);

    Program.updateOne({name: program.name}, {$set: {value: program.value}})
    .then(function (docs) {
        response.json(docs);
    })
    .catch(function (err) {
        response.status(500).send(err);
    });
})

module.exports = programsRouter