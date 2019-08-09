const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fetch = require('node-fetch');
const cherio = require('cherio');

const app = express();

app.use(cors());

app.use(morgan('tiny'));

app.get('/', (request, response) => {
    response.json({
        message: 'Hello World'
    });
});

app.get('/search/:location/:search_term', (request, response) => {
    console.log(request.params);
    const location = request.params.location;
    const search_term = request.params.search_term;

    const url = `https://${location}.craigslist.org/search/sss?query=${search_term}`
// Gets the html text form the page
    fetch(url)
        .then(response => response.text())
        .then(body => {
            response.json({
                results: [],
                body
            });
        });
});

app.use((request, response, next) => {
    const error = new Error('Not found');
    response.status(404);
    next(error);
});

app.use((error, request, response, next) => {
    response.status(response.statusCode || 500);
    response.json({
        message: error.message
    })
})

app.listen(3000, () => {
    console.log('Listening on port 3000');

})