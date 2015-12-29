var Benchmark = require('benchmark')
var bloem = require('./bloem')
var suite = new Benchmark.Suite


var serializeTest = new bloem.Bloem(8, 2)
serializeTest.add(Buffer("foo"))

suite
    .add('json serialization', function() {
        bloem.Bloem.destringify(JSON.parse(JSON.stringify(serializeTest)))
    }).add('binary serialization', function() {
        serializeTest.serialize(function (err, data) {
            bloem.Bloem.deserialize({ data: data }, function () {});
        });
    }).on('cycle', function(event) {
        console.log(String(event.target))
    }).run()
