# Bloem - Bloom Filter for node.js

Bloem implements three Bloom Filters for node.js.
All use the FNV Hash function and the optimization described in [[1](#lesshash)] by Kirsch and Mitzenmacher.

- Bloem, a classic bloom filter dimensioned by the size of the bitfield and the number of hash functions
- SafeBloem, enforces a given false positive error probabilty for a given capacity
- ScalingBloem, a scaling bloom filter (SBF) as described by Almeida et al. in [[2](#scale)]

## Install

	npm install bloem

## Usage

#### Bloem

	var bloem = require('bloem')
	var filter = new bloem.Bloem(16, 2)
	filter.has(Buffer("foobar")) // false
	filter.add(Buffer("foobar"))
	filter.has(Buffer("foobar")) // true
	filter.has(Buffer("hello world")) // false

##### SafeBloem

	var bloem = require('bloem')
	var filter = new bloem.SafeBloem(2, 0.1)
	filter.add(Buffer("1")) // true
	filter.add(Buffer("2")) // true
	filter.add(Buffer("3")) // false
	
	filter.has(Buffer("3")) // false
	filter.has(Buffer("1")) // true

## References


- <a name="lesshash"> [1] <http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.72.2442&rep=rep1&type=pdf>
- <a name="scale"> [2] <http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.62.7953&rep=rep1&type=pdf>