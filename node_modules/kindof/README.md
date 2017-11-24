Kindof.js
=====================
[![NPM version](https://badge.fury.io/js/kindof.png)](http://badge.fury.io/js/kindof)
[![Build status](https://travis-ci.org/moll/js-kindof.png?branch=master)](https://travis-ci.org/moll/js-kindof)

Kindof.js **provides a single `kindof` function** that does what you'd expect from `typeof` — gives you the proper semantic type regardless if the variable was a primitive literal (`"Hello"`), a boxed object (`new String("Hello")`) or came from another execution context (e.g. an array from another `<iframe>`).

## Tour
When and why should you use `kindof` over `typeof`?

- When you need a type check that returns `"null"` given the `null` value.  
  You might remember, JavaScript's `typeof` says `null` is an object.
- When you want to **handle both literal primitives** `42` and **objects** `new Number(42)` (for robustness) the same way.  
  A single `kindof(num) == "number"` check makes that easy.  
  Be sure to compare with `==` to allow for coercion in that case.
- When there's a chance you might get an object from **another execution context**.  
  In the browser that might mean an object from another `<frame>`.  
  Different execution contexts have different built-in class instances, so you can't do `obj instanceof Date` safely.

Kindof.js supports all ECMAScript **built-in types and classes**: `undefined`, `null`, `Boolean`, `Number`, `String`, `RegExp`, `Date`, `Array`, `Function` and plain old `Object`. Others, e.g. `Math` and `JSON`, are considered just objects. In general, objects that behave like **value objects** (numbers, dates etc.) or proper arrays have a kind other than `object`.

Please see the table below for the full list of kinds.


Installing
----------
**Note**: Kindof.js follows [semantic versioning](http://semver.org/).

### Installing for the browser
Take the `kindof.js` file and source it at will.

### Installing on Node
Install with `npm install kindof`.  
And require with `var kindof = require("kindof")`.

Using
-----
Pass any object to `kindof` and compare its output to what you expect:
```javascript
kindof("Hello") // => "string"
kindof(new String("Hello")) // => "string"
```

A switch statement might help:
```javascript
switch (kindof(obj)) {
  case "null":   this.name = "Alfred"; break
  case "string": this.name = obj; break
  case "number": this.age = obj; break
  default: throw new TypeError("Pardon, sir, came upon an unexpected type.")
}
```


Kinds
-----
The pattern is simple — all built-in objects that behave like **value objects** (numbers, strings, dates etc.) or are **real arrays** are said to be of a kind other than `object`. The `arguments` object, however, is not a proper array, so it therefore is an `object`.

Value                 | Kindof
----------------------|----------
`undefined           `| undefined
`null                `| null
`true                `| boolean
`false               `| boolean
`new Boolean(true)   `| boolean
`42                  `| number
`new Number(42)      `| number
`NaN                 `| number
`Infinity            `| number
`"Hello"             `| string
`new String("Hello") `| string
`/.*/                `| regexp
`new RegExp(".*")    `| regexp
`new Date            `| date
`[42, 69]            `| array
`function() {}       `| function
`{}                  `| object
`arguments           `| object
`new MyClass         `| object
`new Error           `| object
`Math                `| object
`JSON                `| object

**Subclassed objects**, such as subclassed arrays, are considered to be `object` unless their internal `[[Class]]` property remains that of the original. For ways to subclass properly, please see further reading below.


Further Reading
---------------
- The [`typeof` operator in ECMAScript 5.1][1].
- The [`typeof` operator as implemented by Firefox][2].
- Article on [subclassing `Array`][3] by [Juriy Zaytsev][4].

[1]: http://www.ecma-international.org/ecma-262/5.1/#sec-11.4.3
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
[3]: http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
[4]: http://perfectionkills.com


License
-------
Kindof.js is released under a *Lesser GNU Affero General Public License*, which in summary means:

- You **can** use this program for **no cost**.
- You **can** use this program for **both personal and commercial reasons**.
- You **do not have to share your own program's code** which uses this program.
- You **have to share modifications** (e.g bug-fixes) you've made to this program.

For more convoluted language, see the `LICENSE` file.


About
-----
**[Andri Möll](http://themoll.com)** typed this and the code.  
[Monday Calendar](https://mondayapp.com) supported the engineering work.

If you find Kindof.js needs improving, please don't hesitate to type to me now at [andri@dot.ee](mailto:andri@dot.ee) or [create an issue online](https://github.com/moll/js-kindof/issues).
