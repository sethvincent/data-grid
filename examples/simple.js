var through = require('through2')
var debounce = require('lodash.debounce')

var dataGrid = require('../index')({
  appendTo: document.body,
  height: window.innerHeight
})

dataGrid.on('scroll', function (html) {})
dataGrid.on('focus', function (e, property, row) {})
dataGrid.on('blur', function (e, property, row) {})
dataGrid.on('click', function (e, property, row) {})
dataGrid.on('input', function (e, property, row) {})

var render = debounce(dataGrid.render.bind(dataGrid), 100)

var all = []
var model = through.obj(function (chunk, enc, cb) {
  this.push(chunk)
  cb()
})

model.on('data', function (data) {
  all.push(data)
  render(all)
})

for (var i=0;i<=100000;i++) {
  model.write({
    key: i,
    value: {
      title: 'this is title ' + i,
      description: 'this has long text that cuts off its cool this has long text that cuts off its cool this has long text that cuts off its cool this has long text that cuts off its cool this has long text that cuts off its cool ',
      someField: 'this is a field',
      another: '123123'
    }
  })
}
