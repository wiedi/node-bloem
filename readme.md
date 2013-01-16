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

#### SafeBloem

	var bloem = require('bloem')
	var filter = new bloem.SafeBloem(2, 0.1)
	filter.add(Buffer("1")) // true
	filter.add(Buffer("2")) // true
	filter.add(Buffer("3")) // false
	
	filter.has(Buffer("3")) // false
	filter.has(Buffer("1")) // true


## API

### Class: Bloem

##### new Bloem(size, slices)

- <code>size</code> Number - bits in the bitfield
- <code>slices</code> Number - how many hashfunctions to use

Create a new Bloem filter object.

##### filter.add(key)

- <code>key</code> Buffer - key to add

Add a key to the set

##### filter.has(key)

- <code>key</code> Buffer

Test if key is in the set


### Class: SafeBloem

##### new SafeBloem(capacity, error_rate)

- <code>capacity</code> Number - capacity of the filter
- <code>error_rate</code> Number

Create a new bloom filter that can hold <code>capacity</code> elements with an error probability of <code>error_rate</code>.

##### filter.add(key)

- <code>key</code> Buffer - key to add

Add a key to the set. Returnes true on success and false if the filter is full.

##### filter.has(key)

- <code>key</code> Buffer

Test if key is in the set


### Class: ScalingBloem

##### new ScalingBloem(error_rate, options)

- <code>error_rate</code> Number

Creates an instance of a scaling bloom filter. Accepts a "options" Object that takes the following values:

- <code>initial_capacity</code> - the capacity of the first filter. Default: 1000
- <code>scaling</code> - the scaling factor. Use 2 here for less space usage but higher cpu usage or 4 for higher space, but lower cpu usage. Default: 2
- <code>ratio</code> - tightening ratio with 0 < ratio < 1. Default: 0.9

##### filter.add(key)

- <code>key</code> Buffer - key to add

Add a key to the set

##### filter.has(key)

- <code>key</code> Buffer

Test if key is in the set



## References


- <a name="lesshash"> [1] <http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.72.2442&rep=rep1&type=pdf>
- <a name="scale"> [2] <http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.62.7953&rep=rep1&type=pdf>