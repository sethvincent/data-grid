var through = require('through2')
var debounce = require('lodash.debounce')
var raf = require('raf')

var dataGrid = require('../index')({
  appendTo: document.body,
  height: window.innerHeight
})

dataGrid.on('click', function (e, row) {
  console.log('ya clicked', row)
})

dataGrid.on('input', function (e, value, row) {
  console.log('ya inputted', value, row)
  render(all)
})

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
