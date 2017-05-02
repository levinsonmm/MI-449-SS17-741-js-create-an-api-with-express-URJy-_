var express = require('express')
var app = express()
var port = process.env.PORT || 8080
var products = require('./products.js')
var bodyParser = require('body-parser')
app.use(bodyParser.json())

app.get('/', function (request, response) {
  response.json({
    welcome: 'welcome to my API!'
  })
})

app.get('/products', function (request, response) {
  response.json(products)
})

app.get('/products/:slug', function (request, response) {
  if (!products[request.params.slug]) {
    response.status(404).end('sorry, no such product: ' + request.params.slug)
    return
  }
  response.json(products[request.params.slug])
})

app.post('/products', function (request, response) {
  var slug = request.body.name.trim().toLowerCase().split(' ').join('-')
  products[slug] = {
    name: request.body.name.trim(),
    price: '$' + parseFloat(request.body.price).toFixed(2)
  }
  response.redirect('/products/' + slug)
})

app.delete('/products/:slug', function (request, response) {
  if (!products[request.params.slug]) {
    response.status(404).end('sorry, no such product: ' + request.params.slug)
    return
  }
  delete products[request.params.slug]
  response.redirect('/products')
})

app.put('/products/:slug', function (request, response) {
  var product = products[request.params.slug]
  if (!products[request.params.slug]) {
    response.status(404).end('sorry, no such product: ' + request.params.slug)
    return
  }
  if (request.body.name !== undefined) {
    product.name = request.body.name.trim()
  }
  if (request.body.price !== undefined) {
    product.price = '$' + parseFloat(request.body.price).toFixed(2)
  }
  response.redirect('/products')
})

app.use(function (request, response, next) {
  response.status(404).end(request.url + ' not found')
})

app.listen(port)
