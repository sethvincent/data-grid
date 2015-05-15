# data-cards

Simple & performant grid editor/viewer for tabular data. 

Demo: [sethvincent.com/data-grid](http://sethvincent.com/data-grid/)

## Status

This module is currently unfinished! It's being developed for use with [flatsheet](http://github.com/flatsheet/flatsheet) and [dat](http://github.com/maxogden/dat).


## API

### `var Grid = require('data-grid')`

### `var grid = Cards([options])`

**options**

-  
-  
-  

Any options you can pass to the [view-list](https://github.com/shama/view-list) and [virtual-dom](https://github.com/Matt-Esch/virtual-dom) modules.

### `grid.render([data])`

## Examples

### Example html output:

```html
<ul class="data-grid-list">
  <li class="data-grid-row" data-key="[key]">
    <ul class="data-grid-properties">
      <li class="data-grid-property" data-key="[key]">
        <input type="text" class="data-grid-property-value data-type-string" data-type="string">
      </li>
    </ul>
  </li>
</ul>
```

### Example usage:

```js
var through = require('through2')
var debounce = require('lodash.debounce')
var raf = require('raf')

var dataGrid = require('../index')({
  appendTo: document.body,
  height: window.innerHeight
})

dataGrid.on('click', function (e) {
  console.log('ya clicked')
})

dataGrid.on('input', function (e) {
  console.log('ya inputted')
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
```

## See also

- [data-ui](https://github.com/sethvincent/data-ui) – a collection of resources & modules for building interfaces for managing data
- [data-cards](https://github.com/sethvincent/data-cards) – a similar project that puts data into cards instead of a grid
- [view-list](https://github.com/shama/view-list) – this project is a thin wrapper around the view-list module
- [virtual-dom](https://github.com/Matt-Esch/virtual-dom) – data-grid & view-list are created using the virtual-dom module

## Contributing

See the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

[MIT](LICENSE.md)