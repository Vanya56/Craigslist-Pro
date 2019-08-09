const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();

app.use(cors());

app.use(morgan('tiny'));

function getResults(body) {
    const $ = cheerio.load(body);
    const rows = $('li.result-row');
    const results = [];

    rows.each((index, element) => {
        const result = $(element);
        const title = result.find('.result-title').text();
        const price = $(result.find('.result-price').get(0)).text();
        const imageData = result.find('a.result-image').attr('data-ids');
        let images = [];
        if (imageData) {
            const parts = imageData.split(',');
            images = parts.map((id) => {
                return `https://images.craigslist.org/${id.split(':')[1]}_300x300.jpg`;
            });
        
        }
        results.push({
            title,
            price,
            images
        });
    });
    return results;
}

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
            const results = getResults(body);
            response.json({
                results
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