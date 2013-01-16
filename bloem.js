"use strict";

var BitBuffer = require('bitbuffer').BitBuffer
var VNF = require('fnv').FNV

function calculateSize(capacity, error_rate) {
	var log2sq = 0.480453  /* Math.pow(Math.log(2), 2) */
	return Math.ceil(capacity * Math.log(error_rate) / -log2sq)
}

function calculateSlices(size, capacity) {
	return size / capacity * Math.log(2)
}

function calulateHashes(key, size, slices) {
	/* See:
	 * "Less Hashing, Same Performance: Building a Better Bloom Filter"
	 * 2005, Adam Kirsch, Michael Mitzenmacher
	 * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.72.2442
	 */
	function fnv(seed, data) {
		var h = new VNF()
		h.update(seed)
		h.update(data)
		return h.value()
	}
	var h1 = fnv(Buffer("S"), key)
	var h2 = fnv(Buffer("W"), key)
	var hashes = []
	for(var i = 0; i < slices; i++) {
		hashes.push((h1 + i * h2) % size)
	}
	return hashes
}

function Bloem(size, slices) {
	this.size   = size
	this.slices = slices
	this.bitfield = new BitBuffer(size)
}

Bloem.prototype = {
	add: function(key) {
		var hashes = calulateHashes(key, this.size, this.slices)
		for(var i = 0; i < hashes.length; i++) {
			this.bitfield.set(hashes[i], true)
		}
	},
	has: function(key) {
		var hashes = calulateHashes(key, this.size, this.slices)
		for(var i = 0; i < hashes.length; i++) {
			if(!this.bitfield.get(hashes[i])) return false
		}
		return true
	}
}

function SafeBloem(capacity, error_rate) {
	var size   = calculateSize(capacity, error_rate)
	var slices = calculateSlices(size, capacity)
	this.capacity   = capacity
	this.error_rate = error_rate
	this.count  = 0
	this.filter = new Bloem(size, slices)
}

SafeBloem.prototype = {
	add: function(key) {
		if(this.count >= this.capacity) {
			return false
		}
		this.filter.add(key)
		this.count++
		return true
	},
	has: function(key) {
		return this.filter.has(key)
	}
}

function ScalingBloem(error_rate, options) {
	var options = options || {}
	this.error_rate       = error_rate
	this.ratio            = options.ratio || 0.9
	this.scaling          = options.scaling || 2
	this.initial_capacity = options.initial_capacity|| 1000
	this.filters = [new SafeBloem(this.initial_capacity, error_rate * (1 - this.ratio))]
}

ScalingBloem.prototype = {
	add: function(key) {
		var f = this.filters.slice(-1)[0]
		if(f.add(key)) {
			return
		}
		f = new SafeBloem(f.capacity * this.scaling, f.error_rate * this.ratio)
		f.add(key)
		this.filters.push(f)
	},
	has: function(key) {
		for(var i = this.filters.length; i-- > 0; ) {
			if(this.filters[i].has(key)) {
				return true
			}
		}
		return false
	}
}


exports.Bloem = Bloem
exports.SafeBloem = SafeBloem
exports.ScalingBloem = ScalingBloem
exports.calculateSize   = calculateSize
exports.calculateSlices = calculateSlices