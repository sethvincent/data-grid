var http = require('http')
var cuid = require('cuid')
var parseBody = require('body/json')
var JSONStream = require('JSONStream')
var response = require('response')
var cors = require('corsify')
var extend = require('extend')
var router = require('match-routes')()
var db = require('level')('./db')
var dat = require('dat-core')(db, { valueEncoding: 'json' })

router.on('/rows', function (req, res, opts) {
  if (req.method === 'GET') {
    dat.createReadStream()
      .pipe(JSONStream.stringify())
      .pipe(res)
  }

  if (req.method === 'POST') {
    parseBody(req, function (err, body) {
      var key = cuid()
      dat.put(key, body, function (err) {
        dat.get(key, function (err, row) {
          response().json(row).pipe(res)
        })
      })
    })
  }
})

router.on('/rows/:key', function (req, res, opts) {
  if (req.method === 'GET') {
    dat.get(opts.params.key, function (err, row) {
      response().json(row).pipe(res)
    })
  }

  if (req.method === 'PUT') {
    parseBody(req, function (err, body) {
      dat.get(opts.params.key, function (err, row) {
        if (row) body = extend(row, body)
        dat.put(body.key, body.value, function (err) {
          response().json(row).pipe(res)
        })
      })
    })
  }
  
  if (req.method === 'DELETE') {
    dat.del(opts.params.key, function () {
      response().status(204).pipe(res)
    })
  }
})

http.createServer(cors(function (req, res) {
  router.match(req, res)
})).listen(4455)