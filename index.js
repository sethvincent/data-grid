var ViewList = require('view-list')
var h = require('virtual-dom/h')
var extend = require('extend')
var value = require('dom-value')
var dataset = require('data-set')
var siblings = require('siblings')

module.exports = function (opts) {
  var options = extend({
    className: 'data-grid-list',
    eachrow: rows,
    editable: true,
    properties: {}
  }, opts)

  var list = ViewList(options)

  function rows (row) {
    var properties = Object.keys(row.value)
    var elements = properties.map(element)

    function element (key) {
      function getProperty (target) {
        var property = {}
        var ds = dataset(target)
        property[ds.key] = value(target)
        return property
      }

      function onclick (e) {
        var property = getProperty(e.target)
        list.send('click', e, property, row)
      }

      function oninput (e) {
        if (options.editable) {
          var property = getProperty(e.target)
          row.value = extend(row.value, property)
          list.send('input', e, property, row)
        }
      }

      function onfocus (e) {
        var property = getProperty(e.target)
        list.send('focus', e, property, row)
      }

      function onblur (e) {
        var property = getProperty(e.target)
        list.send('blur', e, property, row)
      }

      var propertyOptions = {
        value: row.value[key],
        attributes: { 
          'data-type': 'string', // todo: use property type from options.properties
          'data-key': key
        },
        onclick: onclick,
        oninput: oninput,
        onfocus: onfocus,
        onblur: onblur
      }

      if (!options.editable) {
        propertyOptions.attributes.readonly = true
      }

      return h('li.data-grid-property', [
        h('textarea.data-grid-property-value', propertyOptions),
        h('a.expand-editor', { 
          href: '#', 
          onclick: function (e) {
            var el = siblings(e.target.parentNode)[0]
            var property = getProperty(el)
            var key = Object.keys(property)[0]
            list.send('expand', e, el, property, row, key)
          }
        }, [h('i.fa.fa-edit', '')])
      ])
    }

    var rowOptions = { attributes: { 'data-key': row.key } }

    return h('li.data-grid-row', rowOptions, [
      h('ul.data-grid-properties', elements)
    ])
  }

  return list
}
