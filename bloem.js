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

exports.Bloem = Bloem
exports.calculateSize   = calculateSize
exports.calculateSlices = calculateSlices