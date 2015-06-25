var through = require('through2')
var debounce = require('lodash.debounce')
var on = require('dom-event')
var cuid = require('cuid')
var dataSchema = require('data-schema')
var createElement = require('base-element')
var extend = require('extend')

var client = require('./api-client')()

var gridEl = document.getElementById('grid')
var dataGrid = require('../../index')({
  appendTo: gridEl,
  height: 600
})

var gridHeader = require('./lib/grid-header')(document.getElementById('grid-header'))
var headers = []

dataGrid.on('input', function (e, property, row) {
  client.put(row.key, row, function (err, res) {
    console.log(err, res)
  })
})

var render = debounce(dataGrid.render.bind(dataGrid), 10)

var all = []
var model = through.obj(function (chunk, enc, cb) {
  this.push(chunk)
  cb()
})

model.on('data', function (data) {
  all.push(data)
  render(all)
})

client.list(function (err, res) {
  headers = Object.keys(res[0].value)
  gridHeader.render(headers)

  res.forEach(function (item) {
    headers.forEach(function (header) {
      if (!item[header]) item[header] = ''
    })
    model.write(item)
  })
})

on(document.getElementById('new-row'), 'click', function (e) {
  var row = {}
  headers.forEach(function (header) {
    row[header] = null
  })
  model.write({ key: cuid(), value: row })
})

on(document.getElementById('new-column'), 'click', function (e) {
  var name = window.prompt('new column')
  headers.push(name)
  gridHeader.render(headers)
  all.forEach(function (item) {
    item.value[name] = null
  })
  render(all)
  client.bulkUpdate(all, function (err, res) {
    console.log(err, res)
  })
})