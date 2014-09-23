"use strict"
var assert = require("assert")
var bloem = require('./bloem')

suite('Bloem')

test('#empty', function() {
	var f = new bloem.Bloem(8, 2)
	assert.equal(f.has(Buffer("foo")), false)
})

test('#add', function() {
	var f = new bloem.Bloem(8, 2)
	assert.equal(f.has(Buffer("foo")), false)
	f.add(Buffer("foo"))
	assert.equal(f.has(Buffer("foo")), true)
	assert.equal(f.has(Buffer("bar")), false)
})

test('#destringify', function() {
	var f = new bloem.Bloem(8, 2)
	f.add(Buffer("foo"))
	f = bloem.Bloem.destringify(JSON.parse(JSON.stringify(f)))
	assert.equal(f.has(Buffer("foo")), true)
	assert.equal(f.has(Buffer("bar")), false)
})


suite('SafeBloem')

test('#empty', function() {
	var f = new bloem.SafeBloem(10, 0.01)
	assert.equal(f.has(Buffer("foo")), false)
})

test('#add-and-stop', function() {
	var f = new bloem.SafeBloem(10, 0.02)
	for(var i = 0; i < 10; i++) {
		var b = Buffer(i.toString())
		assert.equal(f.has(b), false)
		assert.equal(f.add(b), true)
		assert.equal(f.has(b), true)
	}
	for(var i = 10; i < 15; i++) {
		var b = Buffer(i.toString())
		assert.equal(f.has(b), false)
		assert.equal(f.add(b), false)
		assert.equal(f.has(b), false)
	}
})

test('#destringify', function() {
	var f = new bloem.SafeBloem(3, 0.002)
	assert.equal(f.add("one"), true)
	assert.equal(f.add("two"), true)
	f = bloem.SafeBloem.destringify(JSON.parse(JSON.stringify(f)))
	assert.equal(f.has("one"), true)
	assert.equal(f.has("two"), true)

	assert.equal(f.has("three"), false)
	assert.equal(f.add("three"), true)
	assert.equal(f.has("three"), true)

	assert.equal(f.has("four"), false)
	assert.equal(f.add("four"), false)
})


suite('ScalingBloem')

test('#empty', function() {
	var f = new bloem.ScalingBloem(0.01)
	assert.equal(f.has(Buffer("foo")), false)
})

test('#add-and-grow', function() {
	var f = new bloem.ScalingBloem(0.0005, {initial_capacity: 20})
	for(var i = 0; i < 100; i++) {
		var b = Buffer(i.toString())
		assert.equal(f.has(b), false)
		f.add(b)
		assert.equal(f.has(b), true)
	}
	for(var i = 0; i < 100; i++) {
		assert.equal(f.has(b), true)
	}
	for(var i = 100; i < 200; i++) {
		var b = Buffer(i.toString())
		assert.equal(f.has(b), false)
	}
	assert.equal(f.filters.length, 3)
})

test('#destringify', function() {
	var f = new bloem.ScalingBloem(0.02, {initial_capacity: 2})
	f.add("one")
	f.add("two")
	f.add("three")
	f = bloem.ScalingBloem.destringify(JSON.parse(JSON.stringify(f)))
	assert.equal(f.has("one"), true)
	assert.equal(f.has("two"), true)
	assert.equal(f.has("three"), true)
	assert.equal(f.has("four"), false)

	f.add("four")
	f.add("five")
	f.add("six")
	f.add("seven")

	assert.equal(f.has("seven"), true)
	assert.equal(f.filters.length, 3)
})
