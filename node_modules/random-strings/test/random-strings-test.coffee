events = require 'events'
vows   = require 'vows'
should = require 'should'
assert = require 'assert'
randomString = (require '../src/random-strings').random

howManyIterations = 100000


vows.describe('A stupid random String')
	.addBatch
		'A Stupid Random String':
			'when created many, many times':
				topic: ()->
					startTime = process.hrtime()
					for [0..howManyIterations]
						for [0..20]
							Math.random()*65
					endTime = process.hrtime()
					return {
						startTime: startTime
						endTime	 : endTime
					}
			
				'takes a short time': (err,topic)->
					#puts topic.endTime[0] - topic.startTime[0]

			'when created with crypto':
				topic: ()->
					crypto = require 'crypto'
					startTime = process.hrtime()
					for [0..howManyIterations]
						crypto.pseudoRandomBytes(20);
						
					endTime = process.hrtime()
					return {
						startTime: startTime
						endTime	 : endTime
					}
				
				'takes a long time': (err,topic)->
					console.log topic.endTime[0] - topic.startTime[0]
					
	.export(module)

vows.describe('A Random String')
	.addBatch 
		'with a length of 20 and alphabet "0123456789"':
			topic: ()->
				return randomString(20,'0123456789')
				
				promise = new events.EventEmitter
					
				randomString(20,'0123456789')
				.then (result)->
					promise.emit 'success', result
				,(error)->
					promise.emit 'error', error
				,(progress)->
					console.log progress
					
				return promise
					
			'is a String': (err,topic)->
				assert.isNull		err
				assert.isString		topic

			'is exactly 20 long': (err,topic)->
				assert.isNull		err
				assert.lengthOf		topic,20

			'contains only 012345678': (err,topic)->
				assert.match topic, /^[0-9]{20}$/

		'when called many, many times':
			topic: ()->
				results = {
					duration: process.hrtime()
					strings: []
				}
				
				for i in [1..howManyIterations]
					results.strings[randomString(20)]=true

				currentTime = process.hrtime()
				results.duration[0] = currentTime[0]-results.duration[0]
				results.duration[1] = currentTime[1]-results.duration[1]
				
				return results

			'creates many, many unique strings': (err,topic)->
				count = 0
				for i of topic.strings
					++count
				assert.equal count,howManyIterations

			'performs in a certain time frame': (err, topic)->
			
	.export(module)