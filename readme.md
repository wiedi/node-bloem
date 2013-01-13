# Bloem - Bloom Filter for node.js

Bloem implements a Bloom Filter for node.js.
It uses the FNV Hash function and the optimization described in [[1](#lesshash)] by Kirsch and Mitzenmacher.


## Install

	npm install bloem

## Usage

	var Bloem = require('bloem')
	var filter = new Bloem.Bloem(16, 2)
	filter.has(Buffer("foobar")) // false
	filter.add(Buffer("foobar"))
	filter.has(Buffer("foobar")) // true
	filter.has(Buffer("hello world")) // false

## References

<a name="lesshash">
[1] <http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.72.2442&rep=rep1&type=pdf>