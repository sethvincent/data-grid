var ViewList = require('view-list')
var h = require('virtual-dom/h')
var extend = require('extend')
var value = require('dom-value')
var dataset = require('data-set')

module.exports = function (opts) {
  var options = extend({
    className: 'data-grid-list',
    eachrow: rows,
    editable: true
  }, opts)
  
  var list = ViewList(options)

  function rows (row) {
    if (!row.value) row = { value: row }
    var properties = Object.keys(row.value)

    var elements = properties.map(function (key) {

      function onclick (e) {
        list.send('click', e, row)
      }

      function oninput (e) {
        if (options.editable) {
          var val = value(e.target)
          var ds = dataset(e.target)
          row.value[ds.key] = val
          list.send('input', e, val, row)
        }
      }

      var attributes = { 
        'data-type': 'string',
        'data-key': key
      }

      return h('li.data-grid-property', [
        h('textarea.data-grid-property-value', {
          attributes: attributes,
          onclick: onclick,
          oninput: oninput
        }, [row.value[key]])
      ])
    })

    return h('li.data-grid-row', {
      attributes: { 'data-key': row.key }
    }, [
      h('ul.data-grid-properties', elements)
    ])
  }

  return list 
}
