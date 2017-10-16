## npm 模块学习

> String

1. decamelize Convert a camelized string into a lowercased one with a custom separator: unicornRainbow → unicorn_rainbow

2. pad-left Left pad a string with zeros or a specified string

3. to-camel-case Convert a string to a camel case

4. to-space-case Convert a string to a space case

5. to-no-case Remove any existing casing from a string

6. to-capital-case Convert a string to a capital case

7. to-constant-case Convert a string to a constant case

8. to-snake-case Convert a string to a snake case

9. to-dot-case Convert a string to a dot case

10. to-pascal-case Convert a string to a pascal case

11. to-sentence-case Convert a string to a sentence case

12. to-title-case Convert a string to a title case

13. escape-regexp-component Escape regular expression special characters

14. node-slug slugifies even utf-8 chars

15. unidecode Unidecode takes UTF-8 data and tries to represent it in US-ASCII characters

16. rtrim Strip whitespace - or other characters - from the end of a string

17. slice.js Javascript library to engance String.substring / Array.slice with python slice style


> array

1. is-sorted A small module to check if an Array is sorted

2. array-first Get the first element or first n elements of an array

3. arr-flatten Recursively flatten an array or arrays

4. dedupe Remove duplicates from an array

5. array-range Creates a new array with given range

6. arr-diff Returns an array with only the unique values from the first array, by excluding all values from additional arrays using strict equality for comparisons

7. filled-array Returns an array filled with the specified input

8. map-array Map object keys and values into an array

9.in-array Return true if any of passed values exists in array - faster than using indexOf

10. unordered-array-remove Efficiently remove an element from an unordered array without doing a splice.

11. array-swap Swap position of two items in an array

12. mirrarray Creates a keymirror object from an array of valid keys

> data && time

1. pretty-ms Convert milliseconds to a human readable string

2. hirestime A wrapper around the built-in high resolution timer which simplifies the calculation of timestamps

3. periods Defined time-periods constants for Javascript, in milliseconds

4. fecha Javascript Date formatting and parsing

5. akamai-time-reference Get reference time using Akamai's time reference service

6. timeago.js A tiny library used to format date with *** time ago statement.

> object

1. has-own-property 判断某个对象是否含有指定的属性

2. missing-deep-keys Tells you what keys from one object are missing in another

        deepKeys(obj, stack, parent, intermediate)
        difference(array, values)
        
3. static-props defines static object attributes using Object.defineProperties
        
        staticProps(obj)(props[, enumerable]).
        
4. sorted-object Get a Version of an Object with Sorted Keys

5. stringify-object Stringify an object/array like JSON.stringify just without all the double-quotes

6. is-empty-object Check if an object is empty

7. has-key-deep Determines if an object has a deeply-nested key (Question)

8. has-value Returns true if a value exists, false if empty. Works with deeply nested values using object paths

9. get-value Use property paths (a.b.c) to get a nested value from an object

10. set-value Create nested values and any intermediaries using dot notation ('a.b.c') paths

> math

1. is_number Returns true if the value is a number

2. kind-of Get the native type of a value

> function

1. compose function Compose a new function from smaller functions `f(g(x))

2. curry A curry function without anything too clever

3. once Run a function exactly one time

4. wrappy Callback wrapping utility

> generator

1. is-generator Check whether a given value is a generator function

> promise

1. pify Promisify a callback-style function

2. is-promise Test whether an object looks like a promises-a+ promise

3. sleep-promise  Resolves a promise after a specified delay

4. promise-all-props Like Promise.all but for object properties

> File System

1. rimraf A deep deletion module for node (like rm -rf)

2. mkdirp Recursively mkdir, like mkdir -p

3. tmp Temporary file and directory creator for node.js

4. file-size Lightweight filesize to human-readable / proportions w/o dependencies

5. du A simple JavaScript implementation of du -sb

6. fs-promise Node fs methods as Promise/A+ (optional fs-extra, graceful-fs)

7. mz Modernize node.js

> Stream

1. through2 Tiny wrapper around Node streams2 Transform to avoid explicit subclassing noise





[npm](https://github.com/feng003/awesome-micro-npm-packages)

[hasOwnProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)