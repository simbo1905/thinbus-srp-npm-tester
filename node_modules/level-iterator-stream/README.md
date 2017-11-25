
# level-iterator-stream

<img alt="LevelDB Logo" height="100" src="http://leveldb.org/img/logo.svg">

> Turn a leveldown iterator into a readable stream

[![Build Status](https://travis-ci.org/Level/iterator-stream.png)](https://travis-ci.org/Level/iterator-stream) [![Greenkeeper badge](https://badges.greenkeeper.io/Level/iterator-stream.svg)](https://greenkeeper.io/)

## Example

```js
const iteratorStream = require('level-iterator-stream')
const leveldown = require('leveldown')

const db = leveldown(__dirname + '/db')
db.open(function (err) {
  if (err) throw err

  const stream = iteratorStream(db.iterator())
  stream.on('data', function (kv) {
    console.log('%s -> %s', kv.key, kv.value)
  })
})
```

## Installation

```bash
$ npm install level-iterator-stream
```

## API

### iteratorStream(iterator[, options])

  Create a readable stream from `iterator`. `options` are passed down to the
  `require('readable-stream').Readable` constructor, with `objectMode` forced
  to `true`.

  Set `options.keys` or `options.values` to `false` to only get values / keys. Otherwise receive `{ key, value }` objects.

  When the stream ends, the `iterator` will be closed and afterwards a
  `"close"` event emitted.

  `.destroy()` will force close the underlying iterator.

## Publishers

* [@juliangruber](https://github.com/juliangruber)
* [@ralphtheninja](https://github.com/ralphtheninja)

## License &amp; copyright

Copyright (c) 2012-2017 LevelUP contributors.

LevelUP is licensed under the MIT license. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE.md file for more details.
