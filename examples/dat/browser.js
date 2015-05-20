var through = require('through2')
var debounce = require('lodash.debounce')
var on = require('dom-event')
var cuid = require('cuid')

var client = require('./api-client')()

var dataGrid = require('../../index')({
  appendTo: document.getElementById('grid'),
  height: window.innerHeight
})

var properties = ['food', 'pets', 'hobbies']

dataGrid.on('input', function (e, property, row) {
  client.put(row.key, row, function (err, res) {
    console.log(err, res)
  })
})

window.render = debounce(dataGrid.render.bind(dataGrid), 10)

window.all = []
var model = through.obj(function (chunk, enc, cb) {
  this.push(chunk)
  cb()
})

model.on('data', function (data) {
  all.push(data)
  render(all)
})

client.list(function (err, res) {
  res.forEach(function (item) {
    model.write(item)
  })
})

on(document.getElementById('new-row'), 'click', function (e) {
  var row = {}
  properties.forEach(function (prop) {
    row[prop] = null
  })

  model.write({ key: cuid(), value: row })
})