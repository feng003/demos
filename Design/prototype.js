/*  Prototype JavaScript framework, version 1.7.2
 *  (c) 2005-2010 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

/**
 * Prototype
 *
 *  The [[Prototype]] namespace provides fundamental information about the
 *  Prototype library you're using, as well as a central repository(仓库) for default
 *  iterators(迭代器) or functions.
 *
 *  We say "namespace," because the [[Prototype]] object is not intended for
 *  instantiation(实例化), nor for mixing in other objects. It's really just... a
 *  namespace.
 *
 *  ##### Your version of Prototype
 *
 *  Your scripts can check against a particular version of Prototype by
 *  examining [[Prototype.Version]], which is a version [[String]] (e.g.
 *  "<%= PROTOTYPE_VERSION %>"). The famous
 *  [script.aculo.us](http://script.aculo.us) library does this at load time to
 *  ensure it's being used with a reasonably recent version of Prototype, for
 *  instance.
 *
 *  ##### Browser features
 *
 *  Prototype also provides a (nascent) repository of
 *  [[Prototype.BrowserFeatures browser feature information]], which it then
 *  uses here and there in its source code. The idea is, first, to make
 *  Prototype's source code more readable; and second, to centralize whatever
 *  scripting trickery might be necessary to detect the browser feature, in
 *  order to ease maintenance.
 *
 *  ##### Default iterators and functions
 *
 *  Numerous methods in Prototype objects (most notably the [[Enumerable]]
 *  module) let the user pass in a custom iterator, but make it optional by
 *  defaulting to an "identity function" (an iterator that just returns its
 *  argument, untouched). This is the [[Prototype.K]] function, which you'll
 *  see referred to in many places.
 *
 *  Many methods also take it easy by protecting themselves against missing
 *  methods here and there, reverting to empty functions when a supposedly
 *  available method is missing. Such a function simply ignores its potential
 *  arguments, and does nothing whatsoever (which is, oddly enough,
 *  blazing fast). The quintessential empty function sits, unsurprisingly,
 *  at [[Prototype.emptyFunction]] (note the lowercase first letter).
 **/
var Prototype = {

    Version: '1.7.2',


    /**
     *  Prototype.Browser
     *
     *  A collection of [[Boolean]] values indicating the browser which is
     *  currently in use. Available properties are `IE`, `Opera`, `WebKit`,
     *  `MobileSafari` and `Gecko`.
     *
     *  Example
     *
     *      Prototype.Browser.WebKit;
     *      //-> true, when executed in any WebKit-based browser.
     **/
    Browser: (function () {
        var ua = navigator.userAgent;
        //This is a safer inference than plain boolean type conversion of `window.opera`
        var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
        return {
            IE: !!window.attachEvent && !isOpera,
            Opera: isOpera,
            WebKit: ua.indexOf('AppleWebKit/') > -1,
            Gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
            MobileSafari: /Apple.*Mobile/.test(ua)
        }
    })(),

    /**
     *  Prototype.BrowserFeatures
     *
     *  A collection of [[Boolean]] values indicating the presence of specific
     *  browser features.
     **/
    BrowserFeatures: {
        /**
         *  Prototype.BrowserFeatures.XPath -> Boolean
         *
         *  Used internally to detect if the browser supports
         *  [DOM Level 3 XPath](http://www.w3.org/TR/DOM-Level-3-XPath/xpath.html).
         **/
        XPath: !!document.evaluate,

        /**
         *  Prototype.BrowserFeatures.SelectorsAPI -> Boolean
         *
         *  Used internally to detect if the browser supports the
         *  [NodeSelector API](http://www.w3.org/TR/selectors-api/#nodeselector).
         **/
        SelectorsAPI: !!document.querySelector,

        /**
         *  Prototype.BrowserFeatures.ElementExtensions -> Boolean
         *
         *  Used internally to detect if the browser supports extending html element
         *  prototypes.
         **/
        ElementExtensions: (function () {
            var constructor = window.Element || window.HTMLElement;
            return !!(constructor && constructor.prototype);
        })(),
        SpecificElementExtensions: (function () {
            if (typeof window.HTMLDivElement !== 'undefined')
                return true;

            var div = document.createElement('div'),
                form = document.createElement('form'),
                isSupported = false;

            if (div['__proto__'] && (div['__proto__'] !== form['__proto__'])) {
                isSupported = true;
            }

            div = form = null;

            return isSupported;
        })()
    },

    ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script\\s*>',
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,

    /**
     *  Prototype.emptyFunction([argument...]) -> undefined
     *  - argument (Object): Optional arguments
     *
     *  The [[Prototype.emptyFunction]] does nothing... and returns nothing!
     *
     *  It is used thoughout the framework to provide a fallback(回退) function(回调函数) in order
     *  to cut down on conditionals. Typically you'll find it as a default value
     *  for optional callback functions.
     **/
    emptyFunction: function () {
    },

    /**
     *  Prototype.K(argument) -> argument
     *  - argument (Object): Optional argument...
     *
     *  [[Prototype.K]] is Prototype's very own
     *  [identity function](http://en.wikipedia.org/wiki/Identity_function), i.e.
     *  it returns its `argument` untouched.
     *
     *  This is used throughout the framework, most notably in the [[Enumerable]]
     *  module as a default value for iterators.
     *
     *  ##### Examples
     *
     *      Prototype.K('hello world!');
     *      // -> 'hello world!'
     *
     *      Prototype.K(200);
     *      // -> 200
     *
     *      Prototype.K(Prototype.K);
     *      // -> Prototype.K
     **/
    K: function (x) {
        return x
    }
};

if (Prototype.Browser.MobileSafari)
    Prototype.BrowserFeatures.SpecificElementExtensions = false;
/* Based on Alex Arnell's inheritance implementation. */

/** section: Language
 * class Class
 *
 *  Manages Prototype's class-based OOP system.
 *
 *  Refer to Prototype's web site for a [tutorial on classes and
 *  inheritance](http://prototypejs.org/learn/class-inheritance).
 **/
var Class = (function () {

    // Some versions of JScript fail to enumerate over properties, names of which
    // correspond to non-enumerable properties in the prototype chain
    var IS_DONTENUM_BUGGY = (function () {
        for (var p in {toString: 1}) {
            // check actual property name, so that it works with augmented Object.prototype
            if (p === 'toString') return false;
        }
        return true;
    })();

    /**
     *  Class.create([superclass][, methods...]) -> Class
     *    - superclass (Class): The optional superclass to inherit methods from.
     *    - methods (Object): An object whose properties will be "mixed-in" to the
     *        new class. Any number of mixins can be added; later mixins take
     *        precedence.
     *
     *  [[Class.create]] creates a class and returns a constructor function for
     *  instances of the class. Calling the constructor function (typically as
     *  part of a `new` statement) will invoke the class's `initialize` method.
     *
     *  [[Class.create]] accepts two kinds of arguments. If the first argument is
     *  a [[Class]], it's used as the new class's superclass, and all its methods
     *  are inherited. Otherwise, any arguments passed are treated as objects,
     *  and their methods are copied over ("mixed in") as instance methods of the
     *  new class. In cases of method name overlap, later arguments take
     *  precedence over earlier arguments.
     *
     *  If a subclass overrides an instance method declared in a superclass, the
     *  subclass's method can still access the original method. To do so, declare
     *  the subclass's method as normal, but insert `$super` as the first
     *  argument. This makes `$super` available as a method for use within the
     *  function.
     *
     *  To extend a class after it has been defined, use [[Class#addMethods]].
     *
     *  For details, see the
     *  [inheritance tutorial](http://prototypejs.org/learn/class-inheritance)
     *  on the Prototype website.
     **/
    function subclass() {
    };
    function create() {
        var parent = null, properties = $A(arguments);
        if (Object.isFunction(properties[0]))
            parent = properties.shift();

        function klass() {
            this.initialize.apply(this, arguments);
        }

        Object.extend(klass, Class.Methods);
        klass.superclass = parent;
        klass.subclasses = [];

        if (parent) {
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass;
            parent.subclasses.push(klass);
        }

        for (var i = 0, length = properties.length; i < length; i++)
            klass.addMethods(properties[i]);

        if (!klass.prototype.initialize)
            klass.prototype.initialize = Prototype.emptyFunction;

        klass.prototype.constructor = klass;
        return klass;
    }

    /**
     *  Class#addMethods(methods) -> Class
     *    - methods (Object): The methods to add to the class.
     *
     *  Adds methods to an existing class.
     *
     *  [[Class#addMethods]] is a method available on classes that have been
     *  defined with [[Class.create]]. It can be used to add new instance methods
     *  to that class, or overwrite existing methods, after the class has been
     *  defined.
     *
     *  New methods propagate down the inheritance chain. If the class has
     *  subclasses, those subclasses will receive the new methods &mdash; even in
     *  the context of `$super` calls. The new methods also propagate to instances
     *  of the class and of all its subclasses, even those that have already been
     *  instantiated.
     *
     *  ##### Examples
     *
     *      var Animal = Class.create({
   *        initialize: function(name, sound) {
   *          this.name  = name;
   *          this.sound = sound;
   *        },
   *
   *        speak: function() {
   *          alert(this.name + " says: " + this.sound + "!");
   *        }
   *      });
     *
     *      // subclassing Animal
     *      var Snake = Class.create(Animal, {
   *        initialize: function($super, name) {
   *          $super(name, 'hissssssssss');
   *        }
   *      });
     *
     *      var ringneck = new Snake("Ringneck");
     *      ringneck.speak();
     *
     *      //-> alerts "Ringneck says: hissssssss!"
     *
     *      // adding Snake#speak (with a supercall)
     *      Snake.addMethods({
   *        speak: function($super) {
   *          $super();
   *          alert("You should probably run. He looks really mad.");
   *        }
   *      });
     *
     *      ringneck.speak();
     *      //-> alerts "Ringneck says: hissssssss!"
     *      //-> alerts "You should probably run. He looks really mad."
     *
     *      // redefining Animal#speak
     *      Animal.addMethods({
   *        speak: function() {
   *          alert(this.name + 'snarls: ' + this.sound + '!');
   *        }
   *      });
     *
     *      ringneck.speak();
     *      //-> alerts "Ringneck snarls: hissssssss!"
     *      //-> alerts "You should probably run. He looks really mad."
     **/
    function addMethods(source) {
        var ancestor = this.superclass && this.superclass.prototype,
            properties = Object.keys(source);

        if (IS_DONTENUM_BUGGY) {
            if (source.toString != Object.prototype.toString)
                properties.push("toString");
            if (source.valueOf != Object.prototype.valueOf)
                properties.push("valueOf");
        }

        for (var i = 0, length = properties.length; i < length; i++) {
            var property = properties[i], value = source[property];
            if (ancestor && Object.isFunction(value) &&
                value.argumentNames()[0] == "$super") {
                var method = value;
                value = (function (m) {
                    return function () {
                        return ancestor[m].apply(this, arguments);
                    };
                })(property).wrap(method);

                value.valueOf = (function (method) {
                    return function () {
                        return method.valueOf.call(method);
                    };
                })(method);

                value.toString = (function (method) {
                    return function () {
                        return method.toString.call(method);
                    };
                })(method);
            }
            this.prototype[property] = value;
        }

        return this;
    }

    return {
        create: create,
        Methods: {
            addMethods: addMethods
        }
    };
})();

/** section: Language
 * class Object
 *
 *  Extensions to the built-in [[Object]] object.
 *
 *  Because it is dangerous and invasive to augment `Object.prototype` (i.e.,
 *  add instance methods to objects), all these methods are static methods that
 *  take an [[Object]] as their first parameter.
 *
 *  [[Object]] is used by Prototype as a namespace; that is, it just keeps a few
 *  new methods together, which are intended for namespaced access (i.e. starting
 *  with "`Object.`").
 *
 *  For the regular developer (who simply uses Prototype without tweaking(调整) it), the
 *  most commonly used methods are probably [[Object.inspect]] and, to a lesser degree(程度),
 *  [[Object.clone]].
 *
 *  Advanced users, who wish to create their own objects like Prototype does, or
 *  explore(研究) objects as if they were hashes, will turn to [[Object.extend]],
 *  [[Object.keys]], and [[Object.values]].
 **/
(function () {

    var _toString = Object.prototype.toString,
        _hasOwnProperty = Object.prototype.hasOwnProperty,
        NULL_TYPE = 'Null',
        UNDEFINED_TYPE = 'Undefined',
        BOOLEAN_TYPE = 'Boolean',
        NUMBER_TYPE = 'Number',
        STRING_TYPE = 'String',
        OBJECT_TYPE = 'Object',
        FUNCTION_CLASS = '[object Function]',
        BOOLEAN_CLASS = '[object Boolean]',
        NUMBER_CLASS = '[object Number]',
        STRING_CLASS = '[object String]',
        ARRAY_CLASS = '[object Array]',
        DATE_CLASS = '[object Date]',
        NATIVE_JSON_STRINGIFY_SUPPORT = window.JSON &&
            typeof JSON.stringify === 'function' &&
            JSON.stringify(0) === '0' &&
            typeof JSON.stringify(Prototype.K) === 'undefined';


    var DONT_ENUMS = ['toString', 'toLocaleString', 'valueOf',
        'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];

    var IS_DONTENUM_BUGGY = (function () {
        for (var p in {toString: 1}) {
            if (p === 'toString') return false;
        }
        return true;
    })();

    /**
     * 对象类型 判断
     * @param o
     * @returns {*}
     * @constructor
     */
    function Type(o) {
        switch (o) {
            case null:
                return NULL_TYPE;
            case (void 0):
                return UNDEFINED_TYPE;
        }
        var type = typeof o;
        switch (type) {
            case 'boolean':
                return BOOLEAN_TYPE;
            case 'number':
                return NUMBER_TYPE;
            case 'string':
                return STRING_TYPE;
        }
        return OBJECT_TYPE;
    }

    /**
     *  Object.extend(destination, source) -> Object
     *  - destination (Object): The object to receive the new properties.
     *  - source (Object): The object whose properties will be duplicated.
     *
     *  Copies all properties from the source to the destination object. Used by Prototype
     *  to simulate inheritance (rather statically) by copying to prototypes.
     *
     *  Documentation should soon become available that describes how Prototype implements
     *  OOP, where you will find further details on how Prototype uses [[Object.extend]] and
     *  [[Class.create]] (something that may well change in version 2.0). It will be linked
     *  from here.
     *
     *  Do not mistake this method with its quasi-namesake(准同名) [[Element.extend]],
     *  which implements Prototype's (much more complex) DOM extension mechanism(机制).
     **/
    function extend(destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
    }

    /**
     *  Object.inspect(obj) -> String
     *  - object (Object): The item to be inspected.
     *
     *  Returns the debug-oriented string representation of the object.
     *
     *  * `undefined` and `null` are represented as such.
     *  * Other types are looked up for a `inspect` method: if there is one, it is used, otherwise,
     *  it reverts to the `toString` method.
     *
     *  Prototype provides `inspect` methods for many types, both built-in and library-defined,
     *  such as in [[String#inspect]], [[Array#inspect]], [[Enumerable#inspect]] and [[Hash#inspect]],
     *  which attempt to provide most-useful string representations (from a developer's standpoint)
     *  for their respective types.
     *
     *  ##### Examples
     *
     *      Object.inspect();
     *      // -> 'undefined'
     *
     *      Object.inspect(null);
     *      // -> 'null'
     *
     *      Object.inspect(false);
     *      // -> 'false'
     *
     *      Object.inspect([1, 2, 3]);
     *      // -> '[1, 2, 3]'
     *
     *      Object.inspect('hello');
     *      // -> "'hello'"
     **/
    function inspect(object) {
        try {
            if (isUndefined(object)) return 'undefined';
            if (object === null) return 'null';
            return object.inspect ? object.inspect() : String(object);
        } catch (e) {
            console.log(e);
            if (e instanceof RangeError) return '...';
            throw e;
        }
    }

    /**
     *  Object.toJSON(object) -> String
     *  - object (Object): The object to be serialized.
     *
     *  Returns a JSON string.
     *
     *  `undefined` and `function` types have no JSON representation. `boolean`
     *  and `null` are coerced to strings.
     *
     *  For other types, [[Object.toJSON]] looks for a `toJSON` method on `object`.
     *  If there is one, it is used; otherwise the object is treated like a
     *  generic [[Object]].
     *
     *  For more information on Prototype's JSON encoder, hop to our
     *  [tutorial](http://prototypejs.org/learn/json).
     *
     *  ##### Example
     *
     *      var data = {name: 'Violet', occupation: 'character', age: 25, pets: ['frog', 'rabbit']};
     *      Object.toJSON(data);
     *      //-> '{"name": "Violet", "occupation": "character", "age": 25, "pets": ["frog","rabbit"]}'
     **/
    function toJSON(value) {
        return Str('', {'': value}, []);
    }

    /**
     *
     * @param key
     * @param holder
     * @param stack
     * @returns {*}
     * @constructor
     */
    function Str(key, holder, stack) {
        var value = holder[key];
        if (Type(value) === OBJECT_TYPE && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        var _class = _toString.call(value);

        switch (_class) {
            case NUMBER_CLASS:
            case BOOLEAN_CLASS:
            case STRING_CLASS:
                value = value.valueOf();
        }

        switch (value) {
            case null:
                return 'null';
            case true:
                return 'true';
            case false:
                return 'false';
        }

        var type = typeof value;
        switch (type) {
            case 'string':
                return value.inspect(true);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'object':

                for (var i = 0, length = stack.length; i < length; i++) {
                    if (stack[i] === value) {
                        throw new TypeError("Cyclic reference to '" + value + "' in object");
                    }
                }
                stack.push(value);

                var partial = [];
                if (_class === ARRAY_CLASS) {
                    for (var i = 0, length = value.length; i < length; i++) {
                        var str = Str(i, value, stack);
                        partial.push(typeof str === 'undefined' ? 'null' : str);
                    }
                    partial = '[' + partial.join(',') + ']';
                } else {
                    var keys = Object.keys(value);
                    for (var i = 0, length = keys.length; i < length; i++) {
                        var key = keys[i], str = Str(key, value, stack);
                        if (typeof str !== "undefined") {
                            partial.push(key.inspect(true) + ':' + str);
                        }
                    }
                    partial = '{' + partial.join(',') + '}';
                }
                stack.pop();
                return partial;
        }
    }

    function stringify(object) {
        return JSON.stringify(object);
    }

    /**
     *  Object.toQueryString(object) -> String
     *  - object (Object): The object whose property/value pairs will be converted.
     *
     *  Turns an object into its URL-encoded query string representation.
     *
     *  This is a form of serialization, and is mostly useful to provide complex
     *  parameter sets for stuff such as objects in the [[Ajax]] namespace (e.g.
     *  [[Ajax.Request]]).
     *
     *  Undefined-value pairs will be serialized as if empty-valued. Array-valued
     *  pairs will get serialized with one name/value pair per array element. All
     *  values get URI-encoded using JavaScript's native `encodeURIComponent`
     *  function.
     *
     *  The order of pairs in the serialized form is not guaranteed (and mostly
     *  irrelevant anyway) &mdash; except for array-based parts, which are serialized
     *  in array order.
     *
     *  ##### Examples
     *
     *      Object.toQueryString({ action: 'ship', order_id: 123, fees: ['f1', 'f2'], 'label': 'a demo' })
     *      // -> 'action=ship&order_id=123&fees=f1&fees=f2&label=a+demo'
     **/
    function toQueryString(object) {
        return $H(object).toQueryString();
    }

    /**
     *  Object.toHTML(object) -> String
     *  - object (Object): The object to convert to HTML.
     *
     *  Converts the object to its HTML representation.
     *
     *  Returns the return value of `object`'s `toHTML` method if it exists; else
     *  runs `object` through [[String.interpret]].
     *
     *  ##### Examples
     *
     *      var Bookmark = Class.create({
   *        initialize: function(name, url) {
   *          this.name = name;
   *          this.url = url;
   *        },
   *
   *        toHTML: function() {
   *          return '<a href="#{url}">#{name}</a>'.interpolate(this);
   *        }
   *      });
     *
     *      var api = new Bookmark('Prototype API', 'http://prototypejs.org/api');
     *
     *      Object.toHTML(api);
     *      //-> '<a href="http://prototypejs.org/api">Prototype API</a>'
     *
     *      Object.toHTML("Hello world!");
     *      //-> "Hello world!"
     *
     *      Object.toHTML();
     *      //-> ""
     *
     *      Object.toHTML(null);
     *      //-> ""
     *
     *      Object.toHTML(undefined);
     *      //-> ""
     *
     *      Object.toHTML(true);
     *      //-> "true"
     *
     *      Object.toHTML(false);
     *      //-> "false"
     *
     *      Object.toHTML(123);
     *      //-> "123"
     **/
    function toHTML(object) {
        return object && object.toHTML ? object.toHTML() : String.interpret(object);
    }

    /**
     *  Object.keys(object) -> Array
     *  - object (Object): The object to pull keys from.
     *
     *  Returns an array of the object's property names.
     *
     *  Note that the order of the resulting array is browser-dependent &mdash; it
     *  relies on the `for...in` loop, for which the ECMAScript spec does not
     *  prescribe an enumeration order. Sort the resulting array if you wish to
     *  normalize the order of the object keys.
     *
     *  `Object.keys` acts as an ECMAScript 5 [polyfill](http://remysharp.com/2010/10/08/what-is-a-polyfill/).
     *  It is only defined if not already present in the user's browser, and it
     *  is meant to behave like the native version as much as possible. Consult
     *  the [ES5 specification](http://es5.github.com/#x15.2.3.14) for more
     *  information.
     *
     *  ##### Examples
     *
     *      Object.keys();
     *      // -> []
     *
     *      Object.keys({ name: 'Prototype', version: '1.6.1' }).sort();
     *      // -> ['name', 'version']
     **/
    function keys(object) {
        if (Type(object) !== OBJECT_TYPE) {
            throw new TypeError();
        }
        var results = [];
        for (var property in object) {
            //TODO
            if (_hasOwnProperty.call(object, property))
                results.push(property);
        }

        if (IS_DONTENUM_BUGGY) {
            for (var i = 0; property = DONT_ENUMS[i]; i++) {
                if (_hasOwnProperty.call(object, property))
                    results.push(property);
            }
        }

        return results;
    }

    /**
     *  Object.values(object) -> Array
     *  - object (Object): The object to pull values from.
     *
     *  Returns an array of the object's property values.
     *
     *  Note that the order of the resulting array is browser-dependent &mdash; it
     *  relies on the `for...in` loop, for which the ECMAScript spec does not
     *  prescribe an enumeration order.
     *
     *  Also, remember that while property _names_ are unique, property _values_
     *  have no such constraint.
     *
     *  ##### Examples
     *
     *      Object.values();
     *      // -> []
     *
     *      Object.values({ name: 'Prototype', version: '1.6.1' }).sort();
     *      // -> ['1.6.1', 'Prototype']
     **/
    function values(object) {
        var results = [];
        for (var property in object)
            results.push(object[property]);
        return results;
    }

    /**
     *  Object.clone(object) -> Object
     *  - object (Object): The object to clone.
     *
     *  Creates and returns a shallow duplicate of the passed object by copying
     *  all of the original's key/value pairs onto an empty object.
     *
     *  Do note that this is a _shallow_ copy, not a _deep_ copy. Nested objects
     *  will retain their references.
     *
     *  ##### Examples
     *
     *      var original = {name: 'primaryColors', values: ['red', 'green', 'blue']};
     *      var copy = Object.clone(original);
     *
     *      original.name;
     *      // -> "primaryColors"
     *      original.values[0];
     *      // -> "red"
     *      copy.name;
     *      // -> "primaryColors"
     *
     *      copy.name = "secondaryColors";
     *      original.name;
     *      // -> "primaryColors"
     *      copy.name;
     *      // -> "secondaryColors"
     *
     *      copy.values[0] = 'magenta';
     *      copy.values[1] = 'cyan';
     *      copy.values[2] = 'yellow';
     *      original.values[0];
     *      // -> "magenta" (it's a shallow copy, so they share the array)
     **/
    function clone(object) {
        return extend({}, object);
    }

    /**
     *  Object.isElement(object) -> Boolean
     *  - object (Object): The object to test.
     *
     *  Returns `true` if `object` is a DOM node of type 1; `false` otherwise.
     *
     *  ##### Examples
     *
     *      Object.isElement(new Element('div'));
     *      //-> true
     *
     *      Object.isElement(document.createElement('div'));
     *      //-> true
     *
     *      Object.isElement($('id_of_an_exiting_element'));
     *      //-> true
     *
     *      Object.isElement(document.createTextNode('foo'));
     *      //-> false
     **/
    function isElement(object) {
        return !!(object && object.nodeType == 1);
    }

    /**
     *  Object.isArray(object) -> Boolean
     *  - object (Object): The object to test.
     *
     *  Returns `true` if `object` is an [[Array]]; `false` otherwise.
     *
     *  ##### Examples
     *
     *      Object.isArray([]);
     *      //-> true
     *
     *      Object.isArray($w());
     *      //-> true
     *
     *      Object.isArray({ });
     *      //-> false
     **/
    function isArray(object) {
        //TODO call
        return _toString.call(object) === ARRAY_CLASS;
    }

    var hasNativeIsArray = (typeof Array.isArray == 'function')
        && Array.isArray([]) && !Array.isArray({});

    if (hasNativeIsArray) {
        isArray = Array.isArray;
    }

    /**
     *  Object.isHash(object) -> Boolean
     *  - object (Object): The object to test.
     *
     *  Returns `true` if `object` is an instance of the [[Hash]] class; `false`
     *  otherwise.
     *
     *  ##### Examples
     *
     *      Object.isHash(new Hash({ }));
     *      //-> true
     *
     *      Object.isHash($H({ }));
     *      //-> true
     *
     *      Object.isHash({ });
     *      //-> false
     **/
    function isHash(object) {
        return object instanceof Hash;
    }

    /**
     *  Object.isFunction(object) -> Boolean
     *  - object (Object): The object to test.
     *
     *  Returns `true` if `object` is of type [[Function]]; `false` otherwise.
     *
     *  ##### Examples
     *
     *      Object.isFunction($);
     *      //-> true
     *
     *      Object.isFunction(123);
     *      //-> false
     **/
    function isFunction(object) {
        return _toString.call(object) === FUNCTION_CLASS;
    }

    /**
     *  Object.isString(object) -> Boolean
     *  - object (Object): The object to test.
     *
     *  Returns `true` if `object` is of type [[String]]; `false` otherwise.
     *
     *  ##### Examples
     *
     *      Object.isString("foo");
     *      //-> true
     *
     *      Object.isString("");
     *      //-> true
     *
     *      Object.isString(123);
     *      //-> false
     **/
    function isString(object) {
        return _toString.call(object) === STRING_CLASS;
    }

    /**
     *  Object.isNumber(object) -> Boolean
     *  - object (Object): The object to test.
     *
     *  Returns `true` if `object` is of type [[Number]]; `false` otherwise.
     *
     *  ##### Examples
     *
     *      Object.isNumber(0);
     *      //-> true
     *
     *      Object.isNumber(1.2);
     *      //-> true
     *
     *      Object.isNumber("foo");
     *      //-> false
     **/
    function isNumber(object) {
        return _toString.call(object) === NUMBER_CLASS;
    }

    /**
     *  Object.isDate(object) -> Boolean
     *  - object (Object): The object to test.
     *
     *  Returns `true` if `object` is of type [[Date]]; `false` otherwise.
     *
     *  ##### Examples
     *
     *      Object.isDate(new Date);
     *      //-> true
     *
     *      Object.isDate("Dec 25, 1995");
     *      //-> false
     *
     *      Object.isDate(new Date("Dec 25, 1995"));
     *      //-> true
     **/
    function isDate(object) {
        return _toString.call(object) === DATE_CLASS;
    }

    /**
     *  Object.isUndefined(object) -> Boolean
     *  - object (Object): The object to test.
     *
     *  Returns `true` if `object` is of type `undefined`; `false` otherwise.
     *
     *  ##### Examples
     *
     *      Object.isUndefined();
     *      //-> true
     *
     *      Object.isUndefined(undefined);
     *      //-> true
     *
     *      Object.isUndefined(null);
     *      //-> false
     *
     *      Object.isUndefined(0);
     *      //-> false
     *
     *      Object.isUndefined("");
     *      //-> false
     **/
    function isUndefined(object) {
        return typeof object === "undefined";
    }

    extend(Object, {
        extend: extend,
        inspect: inspect,
        toJSON: NATIVE_JSON_STRINGIFY_SUPPORT ? stringify : toJSON,
        toQueryString: toQueryString,
        toHTML: toHTML,
        keys: Object.keys || keys,
        values: values,
        clone: clone,
        isElement: isElement,
        isArray: isArray,
        isHash: isHash,
        isFunction: isFunction,
        isString: isString,
        isNumber: isNumber,
        isDate: isDate,
        isUndefined: isUndefined
    });
})();
Object.extend(Function.prototype, (function () {
    var slice = Array.prototype.slice;

    function update(array, args) {
        var arrayLength = array.length, length = args.length;
        while (length--) array[arrayLength + length] = args[length];
        return array;
    }

    function merge(array, args) {
        array = slice.call(array, 0);
        return update(array, args);
    }

    function argumentNames() {
        var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
            .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
            .replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    }


    function bind(context) {
        if (arguments.length < 2 && Object.isUndefined(arguments[0]))
            return this;

        if (!Object.isFunction(this))
            throw new TypeError("The object is not callable.");

        var nop = function () {
        };
        var __method = this, args = slice.call(arguments, 1);

        var bound = function () {
            var a = merge(args, arguments);
            var c = this instanceof bound ? this : context;
            return __method.apply(c, a);
        };

        nop.prototype = this.prototype;
        bound.prototype = new nop();

        return bound;
    }

    function bindAsEventListener(context) {
        var __method = this, args = slice.call(arguments, 1);
        return function (event) {
            var a = update([event || window.event], args);
            return __method.apply(context, a);
        }
    }

    function curry() {
        if (!arguments.length) return this;
        var __method = this, args = slice.call(arguments, 0);
        return function () {
            var a = merge(args, arguments);
            return __method.apply(this, a);
        }
    }

    function delay(timeout) {
        var __method = this, args = slice.call(arguments, 1);
        timeout = timeout * 1000;
        return window.setTimeout(function () {
            return __method.apply(__method, args);
        }, timeout);
    }

    function defer() {
        var args = update([0.01], arguments);
        return this.delay.apply(this, args);
    }

    function wrap(wrapper) {
        var __method = this;
        return function () {
            var a = update([__method.bind(this)], arguments);
            return wrapper.apply(this, a);
        }
    }

    function methodize() {
        if (this._methodized) return this._methodized;
        var __method = this;
        return this._methodized = function () {
            var a = update([this], arguments);
            return __method.apply(null, a);
        };
    }

    var extensions = {
        argumentNames: argumentNames,
        bindAsEventListener: bindAsEventListener,
        curry: curry,
        delay: delay,
        defer: defer,
        wrap: wrap,
        methodize: methodize
    };

    if (!Function.prototype.bind)
        extensions.bind = bind;

    return extensions;
})());


(function (proto) {


    /**
     *  Date#toISOString() -> String
     *
     *  Produces a string representation of the date in ISO 8601 format.
     *  The time zone is always UTC, as denoted by the suffix "Z".
     *
     *  <h5>Example</h5>
     *
     *      var d = new Date(1969, 11, 31, 19);
     *      d.getTimezoneOffset();
     *      //-> -180 (time offest is given in minutes.)
     *      d.toISOString();
     *      //-> '1969-12-31T16:00:00Z'
     **/
    function toISOString() {
        return this.getUTCFullYear() + '-' +
            (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
            this.getUTCDate().toPaddedString(2) + 'T' +
            this.getUTCHours().toPaddedString(2) + ':' +
            this.getUTCMinutes().toPaddedString(2) + ':' +
            this.getUTCSeconds().toPaddedString(2) + 'Z';
    }


    /**
     *  Date#toJSON() -> String
     *
     *  Internally calls [[Date#toISOString]].
     *
     *  <h5>Example</h5>
     *
     *      var d = new Date(1969, 11, 31, 19);
     *      d.getTimezoneOffset();
     *      //-> -180 (time offest is given in minutes.)
     *      d.toJSON();
     *      //-> '1969-12-31T16:00:00Z'
     **/
    function toJSON() {
        return this.toISOString();
    }

    if (!proto.toISOString) proto.toISOString = toISOString;
    if (!proto.toJSON) proto.toJSON = toJSON;

})(Date.prototype);

/** section: Language
 * class RegExp
 *
 *  Extensions to the built-in `RegExp` object.
 **/

/**
 *  RegExp#match(str) -> Boolean
 *  - str (String): a string against witch to match the regular expression.
 *
 *  Alias of the native `RegExp#test` method. Returns `true`
 *  if `str` matches the regular expression, `false` otherwise.
 **/
RegExp.prototype.match = RegExp.prototype.test;

/**
 *  RegExp.escape(str) -> String
 *  - str (String): A string intended to be used in a `RegExp` constructor.
 *
 *  Escapes any characters in the string that have special meaning in a
 *  regular expression.
 *
 *  Use before passing a string into the `RegExp` constructor.
 **/
RegExp.escape = function (str) {
    return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};

/** section: Language
 * class PeriodicalExecuter(定期的执行)
 *
 *  Oversees the calling of a particular function periodically.
 *
 *  [[PeriodicalExecuter]] shields you from multiple parallel executions of a
 *  `callback` function, should it take longer than the given interval to
 *  execute.
 *
 *  This is especially useful if you use one to interact with the user at
 *  given intervals (e.g. use a prompt or confirm call): this will avoid
 *  multiple message boxes all waiting to be actioned.
 *
 *  ##### Example
 *
 *      new PeriodicalExecuter(function(pe) {
 *        if (!confirm('Want me to annoy you again later?')) {
 *          pe.stop();
 *        }
 *      }, 5);
 **/
var PeriodicalExecuter = Class.create({

    /**
     *  new PeriodicalExecuter(callback, frequency)
     *  - callback (Function): the function to be executed at each interval.
     *  - frequency (Number): the amount of time, in seconds, to wait in between
     *    callbacks.
     *
     *  Creates a [[PeriodicalExecuter]].
     **/
    initialize: function (callback, frequency) {
        this.callback = callback;
        this.frequency = frequency;
        this.currentlyExecuting = false;

        this.registerCallback();
    },

    registerCallback: function () {
        this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
    },

    execute: function () {
        this.callback(this);
    },

    /**
     *  PeriodicalExecuter#stop() -> undefined
     *
     *  Stops the periodical executer (there will be no further triggers).
     *
     *  Once a [[PeriodicalExecuter]] is created, it constitues an infinite loop,
     *  triggering at the given interval until the page unloads. This method lets
     *  you stop it any time you want.
     *
     *  ##### Example
     *
     *  This will only alert 1, 2 and 3, then the [[PeriodicalExecuter]] stops.
     *
     *      var count = 0;
     *      new PeriodicalExecuter(function(pe) {
   *        if (++count > 3) {
   *          pe.stop();
   *        } else {
   *          alert(count);
   *        }
   *      }, 1);
     **/
    stop: function () {
        if (!this.timer) return;
        clearInterval(this.timer);
        this.timer = null;
    },

    onTimerEvent: function () {
        if (!this.currentlyExecuting) {
            // IE doesn't support `finally` statements unless all errors are caught.
            // We mimic the behaviour of `finally` statements by duplicating code
            // that would belong in it. First at the bottom of the `try` statement
            // (for errorless cases). Secondly, inside a `catch` statement which
            // rethrows any caught errors
            try {
                this.currentlyExecuting = true;
                this.execute();
                this.currentlyExecuting = false;
            } catch (e) {
                this.currentlyExecuting = false;
                throw e;
            }
        }
    }
});


/** section: Language
 * class String
 *
 *  Extensions to the built-in `String` class.
 *
 *  Prototype enhances the [[String]] object with a series of useful methods for
 *  ranging from the trivial to the complex. Tired of stripping trailing
 *  whitespace? Try [[String#strip]]. Want to replace `replace`? Have a look at
 *  [[String#sub]] and [[String#gsub]]. Need to parse a query string? We have
 *  [[String#toQueryParams what you need]].
 **/
Object.extend(String, {
    /**
     *  String.interpret(value) -> String
     *
     *  Coerces `value` into a string. Returns an empty string for `null`.
     **/
    interpret: function (value) {
        return value == null ? '' : String(value);
    },
    specialChar: {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '\\': '\\\\'
    }
});

Object.extend(String.prototype, (function () {
    var NATIVE_JSON_PARSE_SUPPORT = window.JSON &&
        typeof JSON.parse === 'function' &&
        JSON.parse('{"test": true}').test;

    function prepareReplacement(replacement) {
        if (Object.isFunction(replacement)) return replacement;
        var template = new Template(replacement);
        return function (match) {
            return template.evaluate(match)
        };
    }

    function isNonEmptyRegExp(regexp) {
        return regexp.source && regexp.source !== '(?:)';
    }


    function gsub(pattern, replacement) {
        var result = '', source = this, match;
        replacement = prepareReplacement(replacement);

        if (Object.isString(pattern))
            pattern = RegExp.escape(pattern);

        if (!(pattern.length || isNonEmptyRegExp(pattern))) {
            replacement = replacement('');
            return replacement + source.split('').join(replacement) + replacement;
        }

        while (source.length > 0) {
            match = source.match(pattern)
            if (match && match[0].length > 0) {
                result += source.slice(0, match.index);
                result += String.interpret(replacement(match));
                source = source.slice(match.index + match[0].length);
            } else {
                result += source, source = '';
            }
        }
        return result;
    }

    function sub(pattern, replacement, count) {
        replacement = prepareReplacement(replacement);
        count = Object.isUndefined(count) ? 1 : count;

        return this.gsub(pattern, function (match) {
            if (--count < 0) return match[0];
            return replacement(match);
        });
    }

    function scan(pattern, iterator) {
        this.gsub(pattern, iterator);
        return String(this);
    }

    function truncate(length, truncation) {
        length = length || 30;
        truncation = Object.isUndefined(truncation) ? '...' : truncation;
        return this.length > length ?
        this.slice(0, length - truncation.length) + truncation : String(this);
    }

    function strip() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function stripTags() {
        return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
    }

    function stripScripts() {
        return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
    }

    function extractScripts() {
        var matchAll = new RegExp(Prototype.ScriptFragment, 'img'),
            matchOne = new RegExp(Prototype.ScriptFragment, 'im');
        return (this.match(matchAll) || []).map(function (scriptTag) {
            return (scriptTag.match(matchOne) || ['', ''])[1];
        });
    }

    function evalScripts() {
        return this.extractScripts().map(function (script) {
            return eval(script);
        });
    }

    function escapeHTML() {
        return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function unescapeHTML() {
        return this.stripTags().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    }


    /**
     *  String#parseQuery([separator = '&']) -> Object
     **/

    /** alias of: String#parseQuery, related to: Hash#toQueryString
     *  String#toQueryParams([separator = '&']) -> Object
     *
     *  Parses a URI-like query string and returns an object composed of
     *  parameter/value pairs.
     *
     *  This method is realy targeted at parsing query strings (hence the default
     *  value of`"&"` for the `separator` argument).
     *
     *  For this reason, it does _not_ consider anything that is either before a
     *  question  mark (which signals the beginning of a query string) or beyond
     *  the hash symbol (`"#"`), and runs `decodeURIComponent()` on each
     *  parameter/value pair.
     *
     *  [[String#toQueryParams]] also aggregates the values of identical keys into
     *  an array of values.
     *
     *  Note that parameters which do not have a specified value will be set to
     *  `undefined`.
     *
     *  ##### Examples
     *
     *      'section=blog&id=45'.toQueryParams();
     *      // -> {section: 'blog', id: '45'}
     *
     *      'section=blog;id=45'.toQueryParams(';');
     *      // -> {section: 'blog', id: '45'}
     *
     *      'http://www.example.com?section=blog&id=45#comments'.toQueryParams();
     *      // -> {section: 'blog', id: '45'}
     *
     *      'section=blog&tag=javascript&tag=prototype&tag=doc'.toQueryParams();
     *      // -> {section: 'blog', tag: ['javascript', 'prototype', 'doc']}
     *
     *      'tag=ruby%20on%20rails'.toQueryParams();
     *      // -> {tag: 'ruby on rails'}
     *
     *      'id=45&raw'.toQueryParams();
     *      // -> {id: '45', raw: undefined}
     **/
    function toQueryParams(separator) {
        var match = this.strip().match(/([^?#]*)(#.*)?$/);
        if (!match) return {};

        return match[1].split(separator || '&').inject({}, function (hash, pair) {
            if ((pair = pair.split('='))[0]) {
                var key = decodeURIComponent(pair.shift()),
                    value = pair.length > 1 ? pair.join('=') : pair[0];

                if (value != undefined) {
                    value = value.gsub('+', ' ');
                    value = decodeURIComponent(value);
                }

                if (key in hash) {
                    if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
                    hash[key].push(value);
                }
                else hash[key] = value;
            }
            return hash;
        });
    }

    function toArray() {
        return this.split('');
    }

    function succ() {
        return this.slice(0, this.length - 1) +
            String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
    }

    function times(count) {
        return count < 1 ? '' : new Array(count + 1).join(this);
    }

    function camelize() {
        return this.replace(/-+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    }

    function capitalize() {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    }

    function underscore() {
        return this.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/-/g, '_')
            .toLowerCase();
    }

    function dasherize() {
        return this.replace(/_/g, '-');
    }

    function inspect(useDoubleQuotes) {
        var escapedString = this.replace(/[\x00-\x1f\\]/g, function (character) {
            if (character in String.specialChar) {
                return String.specialChar[character];
            }
            return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
        });
        if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
        return "'" + escapedString.replace(/'/g, '\\\'') + "'";
    }

    function unfilterJSON(filter) {
        return this.replace(filter || Prototype.JSONFilter, '$1');
    }

    function isJSON() {
        var str = this;
        if (str.blank()) return false;
        str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
        str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        return (/^[\],:{}\s]*$/).test(str);
    }

    function evalJSON(sanitize) {
        var json = this.unfilterJSON(),
            cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        if (cx.test(json)) {
            json = json.replace(cx, function (a) {
                return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }
        try {
            if (!sanitize || json.isJSON()) return eval('(' + json + ')');
        } catch (e) {
        }
        throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
    }

    function parseJSON() {
        var json = this.unfilterJSON();
        return JSON.parse(json);
    }

    function include(pattern) {
        return this.indexOf(pattern) > -1;
    }

    function startsWith(pattern, position) {
        position = Object.isNumber(position) ? position : 0;
        return this.lastIndexOf(pattern, position) === position;
    }

    function endsWith(pattern, position) {
        pattern = String(pattern);
        position = Object.isNumber(position) ? position : this.length;
        if (position < 0) position = 0;
        if (position > this.length) position = this.length;
        var d = position - pattern.length;
        return d >= 0 && this.indexOf(pattern, d) === d;
    }

    function empty() {
        return this == '';
    }

    function blank() {
        return /^\s*$/.test(this);
    }

    function interpolate(object, pattern) {
        return new Template(this, pattern).evaluate(object);
    }

    return {
        gsub: gsub,
        sub: sub,
        scan: scan,
        truncate: truncate,
        strip: String.prototype.trim || strip,
        stripTags: stripTags,
        stripScripts: stripScripts,
        extractScripts: extractScripts,
        evalScripts: evalScripts,
        escapeHTML: escapeHTML,
        unescapeHTML: unescapeHTML,
        toQueryParams: toQueryParams,
        parseQuery: toQueryParams,
        toArray: toArray,
        succ: succ,
        times: times,
        camelize: camelize,
        capitalize: capitalize,
        underscore: underscore,
        dasherize: dasherize,
        inspect: inspect,
        unfilterJSON: unfilterJSON,
        isJSON: isJSON,
        evalJSON: NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
        include: include,
        startsWith: String.prototype.startsWith || startsWith,
        endsWith: String.prototype.endsWith || endsWith,
        empty: empty,
        blank: blank,
        interpolate: interpolate
    };
})());

/** section: Language
 * class Template
 *
 *  A class for sophisticated string interpolation.
 *
 *  Any time you have a group of similar objects and you need to produce
 *  formatted output for these objects, maybe inside a loop, you typically
 *  resort to concatenating string literals with the object's fields:
 *
 *      "The TV show " + title + " was created by " + author + ".";
 *
 *  There's nothing wrong with this approach, except that it is hard to
 *  visualize the output immediately just by glancing at the concatenation
 *  expression. The [[Template]] class provides a much nicer and clearer way of
 *  achieving this formatting.
 *
 *  ##### Straightforward templates
 *
 *  The [[Template]] class uses a basic formatting syntax, similar to what is
 *  used in Ruby. The templates are created from strings that have embedded
 *  symbols in the form (e.g., `#{fieldName}`) that will be replaced by
 *  actual values when the template is applied (evaluated) to an object.
 *
 *      // the template (our formatting expression)
 *      var myTemplate = new Template(
 *       'The TV show #{title} was created by #{author}.');
 *
 *      // our data to be formatted by the template
 *      var show = {
 *        title: 'The Simpsons',
 *        author: 'Matt Groening',
 *        network: 'FOX'
 *      };
 *
 *      // let's format our data
 *      myTemplate.evaluate(show);
 *      // -> "The TV show The Simpsons was created by Matt Groening."
 *
 *  ##### Templates are meant to be reused
 *
 *  As the example illustrates, [[Template]] objects are not tied to specific
 *  data. The data is bound to the template only during the evaluation of the
 *  template, without affecting the template itself. The next example shows the
 *  same template being used with a handful of distinct objects.
 *
 *      // creating a few similar objects
 *      var conversion1 = { from: 'meters', to: 'feet', factor: 3.28 };
 *      var conversion2 = { from: 'kilojoules', to: 'BTUs', factor: 0.9478 };
 *      var conversion3 = { from: 'megabytes', to: 'gigabytes', factor: 1024 };
 *
 *      // the template
 *      var templ = new Template(
 *       'Multiply by #{factor} to convert from #{from} to #{to}.');
 *
 *      // let's format each object
 *      [conversion1, conversion2, conversion3].each( function(conv){
 *          templ.evaluate(conv);
 *      });
 *      // -> Multiply by 3.28 to convert from meters to feet.
 *      // -> Multiply by 0.9478 to convert from kilojoules to BTUs.
 *      // -> Multiply by 1024 to convert from megabytes to gigabytes.
 *
 *  ##### Escape sequence
 *
 *  There's always the chance that one day you'll need to have a literal in your
 *  template that looks like a symbol, but is not supposed to be replaced. For
 *  these situations there's an escape character: the backslash (`\\`).
 *
 *      // NOTE: you're seeing two backslashes here because the backslash
 *      // is also an escape character in JavaScript strings, so a literal
 *      // backslash is represented by two backslashes.
 *      var t = new Template(
 *       'in #{lang} we also use the \\#{variable} syntax for templates.');
 *      var data = { lang:'Ruby', variable: '(not used)' };
 *      t.evaluate(data);
 *      // -> in Ruby we also use the #{variable} syntax for templates.
 *
 *  ##### Custom syntaxes
 *
 *  The default syntax of the template strings will probably be enough for most
 *  scenarios. In the rare occasion where the default Ruby-like syntax is
 *  inadequate, there's a provision for customization. [[Template]]'s
 *  constructor accepts an optional second argument that is a regular expression
 *  object to match the replaceable symbols in the template string. Let's put
 *  together a template that uses a syntax similar to the now ubiquitous `{{ }}`
 *  constructs:
 *
 *      // matches symbols like '{{ field }}'
 *      var syntax = /(^|.|\r|\n)(\{{\s*(\w+)\s*}})/;
 *
 *      var t = new Template(
 *       '<div>Name: <b>{{ name }}</b>, Age: <b>{{ age }}</b></div>',
 *       syntax);
 *      t.evaluate( {name: 'John Smith', age: 26} );
 *      // -> <div>Name: <b>John Smith</b>, Age: <b>26</b></div>
 *
 *  There are important constraints to any custom syntax. Any syntax must
 *  provide at least three groupings in the regular expression. The first
 *  grouping is to capture what comes before the symbol, to detect the backslash
 *  escape character (no, you cannot use a different character). The second
 *  grouping captures the entire symbol and will be completely replaced upon
 *  evaluation. Lastly, the third required grouping captures the name of the
 *  field inside the symbol.
 *
 **/
var Template = Class.create({

    /**
     *  new Template(template[, pattern = Template.Pattern])
     *
     *  Creates a Template object.
     *
     *  The optional `pattern` argument expects a `RegExp` that defines a custom
     *  syntax for the replaceable symbols in `template`.
     **/
    initialize: function (template, pattern) {
        this.template = template.toString();
        this.pattern = pattern || Template.Pattern;
    },


    /**
     *  Template#evaluate(object) -> String
     *
     *  Applies the template to `object`'s data, producing a formatted string
     *  with symbols replaced by `object`'s corresponding properties.
     *
     *  #####  Examples
     *
     *      var hrefTemplate = new Template('/dir/showAll?lang=#{language}&amp;categ=#{category}&amp;lv=#{levels}');
     *      var selection = {category: 'books' , language: 'en-US'};
     *
     *      hrefTemplate.evaluate(selection);
     *      // -> '/dir/showAll?lang=en-US&amp;categ=books&amp;lv='
     *
     *      hrefTemplate.evaluate({language: 'jp', levels: 3, created: '10/12/2005'});
     *      // -> '/dir/showAll?lang=jp&amp;categ=&amp;lv=3'
     *
     *      hrefTemplate.evaluate({});
     *      // -> '/dir/showAll?lang=&amp;categ=&amp;lv='
     *
     *      hrefTemplate.evaluate(null);
     *      // -> error !
     **/
    evaluate: function (object) {
        if (object && Object.isFunction(object.toTemplateReplacements))
            object = object.toTemplateReplacements();

        return this.template.gsub(this.pattern, function (match) {
            if (object == null) return (match[1] + '');

            var before = match[1] || '';
            if (before == '\\') return match[2];

            var ctx = object, expr = match[3],
                pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;

            match = pattern.exec(expr);
            if (match == null) return before;

            while (match != null) {
                var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
                ctx = ctx[comp];
                if (null == ctx || '' == match[3]) break;
                expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
                match = pattern.exec(expr);
            }

            return before + String.interpret(ctx);
        });
    }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

/** section: Language
 * mixin Enumerable(枚举)
 *
 *  [[Enumerable]] provides a large set of useful methods for enumerations &mdash;
 *  objects that act as collections of values. It is a cornerstone of
 *  Prototype.
 *
 *  [[Enumerable]] is a _mixin_: a set of methods intended not for standalone
 *  use, but for incorporation into other objects.
 *
 *  Prototype mixes [[Enumerable]] into several classes. The most visible cases
 *  are [[Array]] and [[Hash]], but you'll find it in less obvious spots as
 *  well, such as in [[ObjectRange]] and various DOM- or Ajax-related objects.
 *
 *  ##### The `context` parameter
 *
 *  Every method of [[Enumerable]] that takes an iterator also takes the "context
 *  object" as the next (optional) parameter. The context object is what the
 *  iterator will be _bound_ to &mdash; what the keyword `this` will refer to inside
 *  the iterator.
 *
 *      var myObject = {};
 *
 *      ['foo', 'bar', 'baz'].each(function(name, index) {
 *        this[name] = index;
 *      }, myObject); // we have specified the context
 *
 *      myObject;
 *      // -> { foo: 0, bar: 1, baz: 2}
 *
 *  If there is no `context` argument, the iterator function will execute in
 *  the scope from which the [[Enumerable]] method itself was called.
 *
 *  ##### Flow control
 *
 *  You might find yourself missing the `break` and `continue` keywords that
 *  are available in ordinary `for` loops. If you need to break out of an
 *  enumeration before it's done, you can throw a special object named
 *  `$break`:
 *
 *      var myObject = {};
 *
 *      ['foo', 'bar', 'baz', 'thud'].each( function(name, index) {
 *        if (name === 'baz') throw $break;
 *        myObject[name] = index;
 *      });
 *
 *      myObject;
 *      // -> { foo: 0, bar: 1 }
 *
 *  Though we're technically throwing an exception, the `each` method knows
 *  to catch a thrown `$break` object and treat it as a command to stop
 *  iterating. (_Any_ exception thrown within an iterator will stop
 *  iteration, but only `$break` will be caught and suppressed.)
 *
 *  If you need `continue`-like behavior, you can simply return early from
 *  your iterator:
 *
 *      var myObject = {};
 *
 *      ['foo', 'bar', 'baz', 'thud'].each( function(name, index) {
 *        if (name === 'baz') return;
 *        myObject[name] = index;
 *      });
 *
 *      myObject;
 *      // -> { foo: 0, bar: 1, thud: 3 }
 *
 *  ##### Mixing [[Enumerable]] into your own objects
 *
 *  So, let's say you've created your very own collection-like object (say,
 *  some sort of Set, or perhaps something that dynamically fetches data
 *  ranges from the server side, lazy-loading style). You want to be able to
 *  mix [[Enumerable]] in (and we commend you for it). How do you go about this?
 *
 *  The Enumerable module basically makes only one requirement on your object:
 *  it must provide a method named `_each` (note the leading underscore) that
 *  will accept a function as its unique argument, and will contain the actual
 *  "raw iteration" algorithm, invoking its argument with each element in turn.
 *
 *  As detailed in the documentation for [[Enumerable#each]], [[Enumerable]]
 *  provides all the extra layers (handling iteration short-circuits, passing
 *  numeric indices, etc.). You just need to implement the actual iteration,
 *  as fits your internal structure.
 *
 *  If you're still confused, just have a look at the Prototype source code for
 *  [[Array]], [[Hash]], or [[ObjectRange]]. They all begin with their own
 *  `_each` method, which should help you grasp the idea.
 *
 *  Once you're done with this, you just need to mix [[Enumerable]] in, which
 *  you'll usually do before defining your methods, so as to make sure whatever
 *  overrides you provide for [[Enumerable]] methods will indeed prevail. In
 *  short, your code will probably end up looking like this:
 *
 *
 *      var YourObject = Class.create(Enumerable, {
 *        initialize: function() { // with whatever constructor arguments you need
 *          // Your construction code
 *        },
 *
 *        _each: function(iterator) {
 *          // Your iteration code, invoking iterator at every turn
 *        },
 *
 *        // Your other methods here, including Enumerable overrides
 *      });
 *
 *  Then, obviously, your object can be used like this:
 *
 *      var obj = new YourObject();
 *      // Populate the collection somehow
 *      obj.pluck('somePropName');
 *      obj.invoke('someMethodName');
 *      obj.size();
 *      // etc.
 *
 **/
var $break = {};

var Enumerable = (function () {

    /**
     *  Enumerable#each(iterator[, context]) -> Enumerable
     *  - iterator (Function): A `Function` that expects an item in the
     *    collection as the first argument and a numerical index as the second.
     *  - context (Object): The scope in which to call `iterator`. Affects what
     *    the keyword `this` means inside `iterator`.
     *
     *  Calls `iterator` for each item in the collection.
     *
     *  ##### Examples
     *
     *      ['one', 'two', 'three'].each(alert);
     *      // Alerts "one", then alerts "two", then alerts "three"
     *
     *  ##### Built-In Variants
     *
     *  Most of the common use cases for `each` are already available pre-coded
     *  as other methods on [[Enumerable]]. Whether you want to find the first
     *  matching item in an enumeration, or transform it, or determine whether it
     *  has any (or all) values matching a particular condition, [[Enumerable]]
     *  has a method to do that for you.
     **/
    function each(iterator, context) {
        try {
            this._each(iterator, context);
        } catch (e) {
            if (e != $break) throw e;
        }
        return this;
    }

    /**
     *  Enumerable#eachSlice(number[, iterator = Prototype.K[, context]]) -> Enumerable
     *  - number (Number): The number of items to include in each slice.
     *  - iterator (Function): An optional function to use to transform each
     *    element before it's included in the slice; if this is not provided,
     *    the element itself is included.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Groups items into chunks of the given size. The final "slice" may have
     *  fewer than `number` items; it won't "pad" the last group with empty
     *  values. For that behavior, use [[Enumerable#inGroupsOf]].
     *
     *  ##### Example
     *
     *      var students = [
     *        { name: 'Sunny', age: 20 },
     *        { name: 'Audrey', age: 21 },
     *        { name: 'Matt', age: 20 },
     *        { name: 'Amelie', age: 26 },
     *        { name: 'Will', age: 21 }
     *      ];
     *
     *      students.eachSlice(3, function(student) {
   *        return student.name;
   *      });
     *      // -> [['Sunny', 'Audrey', 'Matt'], ['Amelie', 'Will']]
     **/
    function eachSlice(number, iterator, context) {
        var index = -number, slices = [], array = this.toArray();
        if (number < 1) return array;
        while ((index += number) < array.length)
            slices.push(array.slice(index, index + number));
        return slices.collect(iterator, context);
    }

    /**
     *  Enumerable#all([iterator = Prototype.K[, context]]) -> Boolean
     *  - iterator (Function): An optional function to use to evaluate
     *    each element in the enumeration; the function should return the value to
     *    test. If this is not provided, the element itself is tested.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Determines whether all the elements are "truthy" (boolean-equivalent to
     *  `true`), either directly or through computation by the provided iterator.
     *  Stops on the first falsy element found (e.g., the first element that
     *  is boolean-equivalent to `false`, such as `undefined`, `0`, or indeed
     *  `false`);
     *
     *  ##### Examples
     *
     *      [].all();
     *      // -> true (empty arrays have no elements that could be falsy)
     *
     *      $R(1, 5).all();
     *      // -> true (all values in [1..5] are truthy)
     *
     *      [0, 1, 2].all();
     *      // -> false (with only one loop cycle: 0 is falsy)
     *
     *      [9, 10, 15].all(function(n) { return n >= 10; });
     *      // -> false (the iterator returns false on 9)
     **/
    function all(iterator, context) {
        iterator = iterator || Prototype.K;
        var result = true;
        this.each(function (value, index) {
            result = result && !!iterator.call(context, value, index, this);
            if (!result) throw $break;
        }, this);
        return result;
    }

    /**
     *  Enumerable#any([iterator = Prototype.K[, context]]) -> Boolean
     *  - iterator (Function): An optional function to use to evaluate each
     *    element in the enumeration; the function should return the value to
     *    test. If this is not provided, the element itself is tested.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Determines whether at least one element is truthy (boolean-equivalent to
     *  `true`), either directly or through computation by the provided iterator.
     *
     *  ##### Examples
     *
     *      [].any();
     *      // -> false (empty arrays have no elements that could be truthy)
     *
     *      $R(0, 2).any();
     *      // -> true (on the second loop, 1 is truthy)
     *
     *      [2, 4, 6, 8, 10].any(function(n) { return n > 5; });
     *      // -> true (the iterator will return true on 6)
     **/
    function any(iterator, context) {
        iterator = iterator || Prototype.K;
        var result = false;
        this.each(function (value, index) {
            if (result = !!iterator.call(context, value, index, this))
                throw $break;
        }, this);
        return result;
    }

    /**
     *  Enumerable#collect([iterator = Prototype.K[, context]]) -> Array
     *  - iterator (Function): The iterator function to apply to each element
     *    in the enumeration.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Returns the result of applying `iterator` to each element. If no
     *  `iterator` is provided, the elements are simply copied to the
     *  returned array.
     *
     *  ##### Examples
     *
     *      ['Hitch', "Hiker's", 'Guide', 'to', 'the', 'Galaxy'].collect(function(s) {
   *        return s.charAt(0).toUpperCase();
   *      });
     *      // -> ['H', 'H', 'G', 'T', 'T', 'G']
     *
     *      $R(1,5).collect(function(n) {
   *        return n * n;
   *      });
     *      // -> [1, 4, 9, 16, 25]
     **/
    function collect(iterator, context) {
        iterator = iterator || Prototype.K;
        var results = [];
        this.each(function (value, index) {
            results.push(iterator.call(context, value, index, this));
        }, this);
        return results;
    }

    /**
     *  Enumerable#detect(iterator[, context]) -> firstElement | undefined
     *  - iterator (Function): The iterator function to apply to each element
     *    in the enumeration.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Returns the first element for which the iterator returns a truthy value.
     *  Aliased by the [[Enumerable#find]] method.
     *
     *  ##### Example
     *
     *      [1, 7, -2, -4, 5].detect(function(n) { return n < 0; });
     *      // -> -2
     **/
    function detect(iterator, context) {
        var result;
        this.each(function (value, index) {
            if (iterator.call(context, value, index, this)) {
                result = value;
                throw $break;
            }
        }, this);
        return result;
    }

    /**
     *  Enumerable#findAll(iterator[, context]) -> Array
     *  - iterator (Function): An iterator function to use to test the elements.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Returns all the elements for which the iterator returned a truthy value.
     *  For the opposite operation, see [[Enumerable#reject]].
     *
     *  ##### Example
     *
     *      [1, 'two', 3, 'four', 5].findAll(Object.isString);
     *      // -> ['two', 'four']
     **/
    function findAll(iterator, context) {
        var results = [];
        this.each(function (value, index) {
            if (iterator.call(context, value, index, this))
                results.push(value);
        }, this);
        return results;
    }

    /**
     *  Enumerable#grep(filter[, iterator = Prototype.K[, context]]) -> Array
     *  - filter (RegExp | String | Object): The filter to apply to elements. This
     *    can be a `RegExp` instance, a regular expression [[String]], or any
     *    object with a `match` function.
     *  - iterator (Function): An optional function to apply to selected elements
     *    before including them in the result.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Returns an array containing all of the elements for which the given
     *  filter returns `true` (or a truthy value). If an iterator is provided,
     *  it is used to produce(产生) the returned value for each selected element; this
     *  is done *after* the element has been selected by the filter.
     *
     *  If the given filter is a [[String]], it is converted into a `RegExp`
     *  object. To select elements, each element is passed into the filter's
     *  `match` function, which should return a truthy value to select the element
     *  or a falsy value not to. Note that the `RegExp` `match` function will
     *  convert elements to Strings to perform matching.
     *
     *  ##### Examples
     *
     *      // Get all strings containing a repeated letter
     *      ['hello', 'world', 'this', 'is', 'cool'].grep(/(.)\1/);
     *      // -> ['hello', 'cool']
     *
     *      // Get all numbers ending with 0 or 5 and subtract 1 from them
     *      $R(1, 30).grep(/[05]$/, function(n) { return n - 1; });
     *      // -> [4, 9, 14, 19, 24, 29]
     **/
    function grep(filter, iterator, context) {
        iterator = iterator || Prototype.K;
        var results = [];

        if (Object.isString(filter))
            filter = new RegExp(RegExp.escape(filter));

        this.each(function (value, index) {
            if (filter.match(value))
                results.push(iterator.call(context, value, index, this));
        }, this);
        return results;
    }

    /**
     *  Enumerable#include(object) -> Boolean
     *  - object (?): The object to look for.
     *
     *  Determines whether a given object is in the enumerable or not,
     *  based on the `==` comparison operator (equality with implicit type
     *  conversion).
     *
     *  ##### Examples
     *
     *      $R(1, 15).include(10);
     *      // -> true
     *
     *      ['hello', 'world'].include('HELLO');
     *      // -> false ('hello' != 'HELLO')
     *
     *      [1, 2, '3', '4', '5'].include(3);
     *      // -> true ('3' == 3)
     **/
    function include(object) {
        if (Object.isFunction(this.indexOf) && this.indexOf(object) != -1)
            return true;

        var found = false;
        this.each(function (value) {
            if (value == object) {
                found = true;
                throw $break;
            }
        });
        return found;
    }

    /**
     *  Enumerable#inGroupsOf(number[, fillWith = null]) -> [group...]
     *  - number (Number): The number of items to include in each group.
     *  - fillWith (Object): An optional filler to use if the last group needs
     *    any; defaults to `null`.
     *
     *  Like [[Enumerable#eachSlice]], but pads out the last chunk with the
     *  specified value if necessary and doesn't support the `iterator` function.
     *
     *  ##### Examples
     *
     *      var students = [
     *        { name: 'Sunny',  age: 20 },
     *        { name: 'Audrey', age: 21 },
     *        { name: 'Matt',   age: 20 },
     *        { name: 'Amelie', age: 26 },
     *        { name: 'Will',   age: 21 }
     *      ];
     *
     *      students.inGroupsOf(2, { name: '', age: 0 });
     *      // -> [
     *      //      [{ name: 'Sunny', age: 20 }, { name: 'Audrey', age: 21 }],
     *      //      [{ name: 'Matt', age: 20 },  { name: 'Amelie', age: 26 }],
     *      //      [{ name: 'Will', age: 21 },  { name: '', age: 0 }]
     *      //    ]
     **/
    function inGroupsOf(number, fillWith) {
        fillWith = Object.isUndefined(fillWith) ? null : fillWith;
        return this.eachSlice(number, function (slice) {
            while (slice.length < number) slice.push(fillWith);
            return slice;
        });
    }

    /**
     *  Enumerable#inject(accumulator, iterator[, context]) -> accumulatedValue
     *  - accumulator (?): The initial value to which the `iterator` adds.
     *  - iterator (Function): An iterator function used to build the accumulated
     *    result.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Incrementally builds a result value based on the successive results
     *  of the iterator. This can be used for array construction, numerical
     *  sums/averages, etc.
     *
     *  The `iterator` function is called once for each element in the
     *  enumeration, receiving the current value of the accumulator as its first
     *  argument, the element as its second argument, and the element's index as
     *  its third. It returns the new value for the accumulator.
     *
     *  ##### Examples
     *
     *      $R(1,10).inject(0, function(acc, n) { return acc + n; });
     *      // -> 55 (sum of 1 to 10)
     *
     *      ['a', 'b', 'c', 'd', 'e'].inject([], function(string, value, index) {
   *        if (index % 2 === 0) { // even numbers
   *          string += value;
   *        }
   *        return string;
   *      });
     *      // -> 'ace'
     **/
    function inject(memo, iterator, context) {
        this.each(function (value, index) {
            memo = iterator.call(context, memo, value, index, this);
        }, this);
        return memo;
    }


    /**
     *  Enumerable#invoke(methodName[, arg...]) -> Array
     *  - methodName (String): The name of the method to invoke.
     *  - args (?): Optional arguments to pass to the method.
     *
     *  Invokes(援引) the same method, with the same arguments, for all items in a
     *  collection. Returns an array of the results of the method calls.
     *
     *  ##### Examples
     *
     *      ['hello', 'world'].invoke('toUpperCase');
     *      // -> ['HELLO', 'WORLD']
     *
     *      ['hello', 'world'].invoke('substring', 0, 3);
     *      // -> ['hel', 'wor']
     *
     *      $$('input').invoke('stopObserving', 'change');
     *      // -> Stops observing the 'change' event on all input elements,
     *      // returns an array of the element references.
     **/
    function invoke(method) {
        var args = $A(arguments).slice(1);
        //console.log(this);console.log(args);
        return this.map(function (value) {
            return value[method].apply(value, args);
        });
    }

    /** related to: Enumerable#min
     *  Enumerable#max([iterator = Prototype.K[, context]]) -> maxValue
     *  - iterator (Function): An optional function to use to evaluate each
     *    element in the enumeration; the function should return the value to
     *    test. If this is not provided, the element itself is tested.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Returns the maximum element (or element-based `iterator` result), or
     *  `undefined` if the enumeration is empty. Elements are either compared
     *  directly, or by first calling `iterator` and comparing returned values.
     *  If multiple "max" elements (or results) are equivalent, the one closest
     *  to the end of the enumeration is returned.
     *
     *  If provided, `iterator` is called with two arguments: The element being
     *  evaluated, and its index in the enumeration; it should return the value
     *  `max` should consider (and potentially return).
     *
     *  ##### Examples
     *
     *      ['c', 'b', 'a'].max();
     *      // -> 'c'
     *
     *      [1, 3, '3', 2].max();
     *      // -> '3' (because both 3 and '3' are "max", and '3' was later)
     *
     *      ['zero', 'one', 'two'].max(function(item) { return item.length; });
     *      // -> 4
     **/
    function max(iterator, context) {
        iterator = iterator || Prototype.K;
        var result;
        this.each(function (value, index) {
            value = iterator.call(context, value, index, this);
            if (result == null || value >= result)
                result = value;
        }, this);
        return result;
    }

    /** related to: Enumerable#max
     *  Enumerable#min([iterator = Prototype.K[, context]]) -> minValue
     *  - iterator (Function): An optional function to use to evaluate each
     *    element in the enumeration; the function should return the value to
     *    test. If this is not provided, the element itself is tested.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Returns the minimum element (or element-based `iterator` result), or
     *  `undefined` if the enumeration is empty. Elements are either compared
     *  directly, or by first calling `iterator` and comparing returned values.
     *  If multiple "min" elements (or results) are equivalent, the one closest
     *  to the *beginning* of the enumeration is returned.
     *
     *  If provided, `iterator` is called with two arguments: The element being
     *  evaluated, and its index in the enumeration; it should return the value
     *  `min` should consider (and potentially return).
     *
     *  ##### Examples
     *
     *      ['c', 'b', 'a'].min();
     *      // -> 'a'
     *
     *      [3, 1, '1', 2].min();
     *      // -> 1 (because both 1 and '1' are "min", and 1 was earlier)
     *
     *      ['un', 'deux', 'trois'].min(function(item) { return item.length; });
     *      // -> 2
     **/
    function min(iterator, context) {
        iterator = iterator || Prototype.K;
        var result;
        this.each(function (value, index) {
            value = iterator.call(context, value, index, this);
            if (result == null || value < result)
                result = value;
        }, this);
        return result;
    }

    /**
     *  Enumerable#partition([iterator = Prototype.K[, context]]) -> [TrueArray, FalseArray]
     *  - iterator (Function): An optional function to use to evaluate each
     *    element in the enumeration; the function should return the value to
     *    test. If this is not provided, the element itself is tested.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Partitions the elements in two groups: those regarded as true, and those
     *  considered false. By default, regular JavaScript boolean equivalence
     *  (e.g., truthiness vs. falsiness) is used, but an iterator can be provided
     *  that computes a boolean representation of the elements.
     *
     *  Using `partition` is more efficient than using [[Enumerable#findAll]] and
     *  then using [[Enumerable#reject]] because the enumeration is only processed
     *  once.
     *
     *  ##### Examples
     *
     *      ['hello', null, 42, false, true, , 17].partition();
     *      // -> [['hello', 42, true, 17], [null, false, undefined]]
     *
     *      $R(1, 10).partition(function(n) {
   *        return 0 == n % 2;
   *      });
     *      // -> [[2, 4, 6, 8, 10], [1, 3, 5, 7, 9]]
     **/
    function partition(iterator, context) {
        iterator = iterator || Prototype.K;
        console.log(iterator);
        var trues = [], falses = [];
        this.each(function (value, index) {
            (iterator.call(context, value, index, this) ?
                trues : falses).push(value);
        }, this);
        return [trues, falses];
    }


    /**
     *  Enumerable#pluck(property) -> Array
     *  - property (String): The name of the property to fetch.
     *
     *  Pre-baked implementation for a common use-case of [[Enumerable#collect]]
     *  and [[Enumerable#each]]: fetching the same property for all of the
     *  elements. Returns an array of the property values.
     *
     *  ##### Example
     *
     *      ['hello', 'world', 'this', 'is', 'nice'].pluck('length');
     *      // -> [5, 5, 4, 2, 4]
     **/
    function pluck(property) {
        var results = [];
        this.each(function (value) {
            results.push(value[property]);
        });
        return results;
    }

    /**
     *  Enumerable#reject(iterator[, context]) -> Array
     *  - iterator (Function): An iterator function to use to test the elements.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Returns all the elements for which the iterator returns a falsy value.
     *  Falsy值包括：false、undefined、null、正负0、NaN、""。
     *  For the opposite operation, see [[Enumerable#findAll]].
     *
     *  ##### Example
     *
     *      [1, "two", 3, "four", 5].reject(Object.isString);
     *      // -> [1, 3, 5]
     **/
    function reject(iterator, context) {
        var results = [];
        this.each(function (value, index) {
            if (!iterator.call(context, value, index, this))
                results.push(value);
        }, this);
        return results;
    }

    /**
     *  Enumerable#sortBy(iterator[, context]) -> Array
     *  - iterator (Function): The function to use to compute the criterion for
     *    each element in the enumeration.
     *  - context (Object): An optional object to use as `this` within
     *    calls to the iterator.
     *
     *  Creates a custom-sorted array of the elements based on the criteria
     *  computed, for each element, by the iterator. Computed criteria must have
     *  well-defined ordering semantics (i.e. the `<` operator must exist between
     *  any two criteria).
     *
     *  [[Enumerable#sortBy]] does not guarantee a *stable* sort; adjacent
     *  equivalent elements may be swapped.
     *
     *  ##### Example
     *
     *      ['hello', 'world', 'this', 'is', 'nice'].sortBy(function(s) {
     *        return s.length;
     *      });
     *      // -> ['is', 'nice', 'this', 'world', 'hello']
     **/
    function sortBy(iterator, context) {
        return this.map(function (value, index) {
            return {
                value: value,
                criteria: iterator.call(context, value, index, this)
            };
        }, this).sort(function (left, right) {
            var a = left.criteria, b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }).pluck('value');
    }

    /**
     *  Enumerable#toArray() -> Array
     *
     *  Returns an Array containing the elements of the enumeration.
     *
     *  ##### Example
     *
     *      $R(1, 5).toArray();
     *      // -> [1, 2, 3, 4, 5]
     *
     *      $H({ name: 'Sunny', age: 20 }).toArray();
     *      // -> [['name', 'Sunny'], ['age', 20]]
     **/
    function toArray() {
        return this.map();
    }

    /**
     *  Enumerable#zip(sequence...[, iterator = Prototype.K]) -> Array
     *  - sequence (Object): A sequence to zip with this enumerable (there can
     *    be several of these if desired).
     *  - iterator (Function): Optional function to use to transform the tuples
     *    once generated; this is always the last argument provided.
     *
     *  Zips together (think of the zipper on a pair of trousers) 2+ sequences,
     *  returning a new array of tuples. Each tuple is an array containing one
     *  value per original sequence. Tuples can be transformed to something else
     *  by applying the optional `iterator` on them.
     *
     *  If supplied, `iterator` is called with each tuple as its only argument
     *  and should return the value to use in place of that tuple.
     *
     *  ##### Examples
     *
     *      var firstNames = ['Jane', 'Nitin', 'Guy'];
     *      var lastNames  = ['Doe',  'Patel', 'Forcier'];
     *      var ages       = [23,     41,      17];
     *
     *      firstNames.zip(lastNames);
     *      // -> [['Jane', 'Doe'], ['Nitin', 'Patel'], ['Guy', 'Forcier']]
     *
     *      firstNames.zip(lastNames, ages);
     *      // -> [['Jane', 'Doe', 23], ['Nitin', 'Patel', 41], ['Guy', 'Forcier', 17]]
     *
     *      firstNames.zip(lastNames, ages, function(tuple) {
   *        return tuple[0] + ' ' + tuple[1] + ' is ' + tuple[2];
   *      });
     *      // -> ['Jane Doe is 23', 'Nitin Patel is 41', 'Guy Forcier is 17']
     **/
    function zip() {
        var iterator = Prototype.K, args = $A(arguments);
        if (Object.isFunction(args.last()))
            iterator = args.pop();

        var collections = [this].concat(args).map($A);
        return this.map(function (value, index) {
            return iterator(collections.pluck(index));
        });
    }

    /**
     *  Enumerable#size() -> Number
     *
     *  Returns the size of the enumeration.
     **/
    function size() {
        return this.toArray().length;
    }

    /**
     *  Enumerable#inspect() -> String
     *
     *  Returns the debug-oriented string representation of the object.
     **/
    function inspect() {
        return '#<Enumerable:' + this.toArray().inspect() + '>';
    }



    return {
        each: each,
        eachSlice: eachSlice,
        all: all,
        every: all,
        any: any,
        some: any,
        collect: collect,
        map: collect,
        detect: detect,
        findAll: findAll,
        select: findAll,
        filter: findAll,
        grep: grep,
        include: include,
        member: include,
        inGroupsOf: inGroupsOf,
        inject: inject,
        invoke: invoke,
        max: max,
        min: min,
        partition: partition,
        pluck: pluck,
        reject: reject,
        sortBy: sortBy,
        toArray: toArray,
        entries: toArray,
        zip: zip,
        size: size,
        inspect: inspect,
        find: detect
    };
})();

/** section: Language, related to: Array
 *  $A(iterable) -> Array
 *
 *  Accepts an array-like collection (anything with numeric indices) and returns
 *  its equivalent as an actual [[Array]] object. This method is a convenience
 *  alias of [[Array.from]], but is the preferred way of casting to an [[Array]].
 *
 *  The primary use of [[$A]] is to obtain an actual [[Array]] object based on
 *  anything that could pass as an array (e.g. the `NodeList` or
 *  `HTMLCollection` objects returned by numerous DOM methods, or the predefined
 *  `arguments` reference within your functions).
 *
 *  The reason you would want an actual [[Array]] is simple:
 *  [[Array Prototype extends Array]] to equip it with numerous extra methods,
 *  and also mixes in the [[Enumerable]] module, which brings in another
 *  boatload of nifty methods. Therefore, in Prototype, actual [[Array]]s trump
 *  any other collection type you might otherwise get.
 *
 *  The conversion performed is rather simple: `null`, `undefined` and `false` become
 *  an empty array; any object featuring an explicit `toArray` method (as many Prototype
 *  objects do) has it invoked; otherwise, we assume the argument "looks like an array"
 *  (e.g. features a `length` property and the `[]` operator), and iterate over its components
 *  in the usual way.
 *
 *  When passed an array, [[$A]] _makes a copy_ of that array and returns it.
 *
 *  ##### Examples
 *
 *  The well-known DOM method [`document.getElementsByTagName()`](http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-A6C9094)
 *  doesn't return an [[Array]], but a `NodeList` object that implements the basic array
 *  "interface." Internet Explorer does not allow us to extend `Enumerable` onto `NodeList.prototype`,
 *  so instead we cast the returned `NodeList` to an [[Array]]:
 *
 *      var paras = $A(document.getElementsByTagName('p'));
 *      paras.each(Element.hide);
 *      $(paras.last()).show();
 *
 *  Notice we had to use [[Enumerable#each each]] and [[Element.hide]] because
 *  [[$A]] doesn't perform DOM extensions, since the array could contain
 *  anything (not just DOM elements). To use the [[Element#hide]] instance
 *  method we first must make sure all the target elements are extended:
 *
 *      $A(document.getElementsByTagName('p')).map(Element.extend).invoke('hide');
 *
 *  Want to display your arguments easily? [[Array]] features a `join` method, but the `arguments`
 *  value that exists in all functions *does not* inherit from [[Array]]. So, the tough
 *  way, or the easy way?
 *
 *      // The hard way...
 *      function showArgs() {
 *        alert(Array.prototype.join.call(arguments, ', '));
 *      }
 *
 *      // The easy way...
 *      function showArgs() {
 *        alert($A(arguments).join(', '));
 *      }
 **/
function $A(iterable) {
    if (!iterable) return [];
    if ('toArray' in Object(iterable)) return iterable.toArray();
    var length = iterable.length || 0, results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
}

/** section: Language, related to: Array
 *  $w(String) -> Array
 *
 *  Splits a string into an [[Array]], treating all whitespace as delimiters. Equivalent
 *  to Ruby's `%w{foo bar}` or Perl's `qw(foo bar)`.
 *
 *  This is one of those life-savers for people who just hate commas(逗号) in literal arrays :-)
 *
 *  ### Examples
 *
 *
 *
 *      // -> ['apples', 'bananas', 'kiwis']
 *
 *  This can slightly shorten code when writing simple iterations:
 *
 *      $w('apples bananas kiwis').each(function(fruit){
 *        var message = 'I like ' + fruit
 *        // do something with the message
 *      })
 *
 *  This also becomes sweet when combined with [[Element]] functions:
 *
 *      $w('ads navbar funkyLinks').each(Element.hide);
 **/
function $w(string) {
    if (!Object.isString(string)) return [];
    string = string.strip();
    return string ? string.split(/\s+/) : [];
}

/** alias of: $A
 *  Array.from(iterable) -> Array
 **/
Array.from = $A;


/** section: Language
 * class Array
 *  includes Enumerable
 *
 *  Prototype extends all native JavaScript arrays with quite a few powerful
 *  methods.
 *
 *  This is done in two ways:
 *
 *  * It mixes in the [[Enumerable]] module, which brings in a ton of methods.
 *  * It adds quite a few extra methods, which are documented in this section.
 *
 *  With Prototype, arrays become much, much more than the trivial objects we
 *  used to manipulate, limiting ourselves to using their `length` property and
 *  their `[]` indexing operator. They become very powerful objects that
 *  greatly simplify the code for 99% of the common use cases involving them.
 *
 *  ##### Why you should stop using for...in to iterate
 *
 *  Many JavaScript authors have been misled into using the `for...in` JavaScript
 *  construct to loop over array elements. This kind of code just won't work
 *  with Prototype.
 *
 *  The ECMA 262 standard, which defines ECMAScript 3rd edition, supposedly
 *  implemented by all major browsers including MSIE, defines ten methods
 *  on [[Array]] (&sect;15.4.4), including nice methods like `concat`, `join`,
 *  `pop`, and `push`.
 *
 *  This same standard explicitly defines that the `for...in` construct (&sect;12.6.4)
 *  exists to enumerate the properties of the object appearing on the right side
 *  of the `in` keyword. Only properties specifically marked as _non-enumerable_
 *  are ignored by such a loop. By default, the `prototype` and `length`
 *  properties are so marked, which prevents you from enumerating over array
 *  methods when using for...in. This comfort led developers to use `for...in` as a
 *  shortcut for indexing loops, when it is not its actual purpose.
 *
 *  However, Prototype has no way to mark the methods it adds to
 *  `Array.prototype` as non-enumerable. Therefore, using `for...in` on arrays
 *  when using Prototype will enumerate all extended methods as well, such as
 *  those coming from the [[Enumerable]] module, and those Prototype puts in the
 *  [[Array]] namespace (listed further below).
 *
 *  ##### What you should use instead
 *
 *  You can revert to vanilla loops:
 *
 *      for (var index = 0; index < myArray.length; ++index) {
 *        var item = myArray[index];
 *        // Your code working on item here...
 *      }
 *
 *  Or you can use iterators, such as [[Array#each]]:
 *
 *      myArray.each(function(item) {
 *        // Your code working on item here...
 *      });
 *
 *  The inability to use `for...in` on arrays is not much of a burden: as you'll
 *  see, most of what you used to loop over arrays for can be concisely done
 *  using the new methods provided by Array or the mixed-in [[Enumerable]]
 *  module. So manual loops should be fairly rare.
 *
 *  ##### A note on performance
 *
 *  Should you have a very large array, using iterators with lexical closures
 *  (anonymous functions that you pass to the iterators and that get invoked at
 *  every loop iteration) in methods like [[Array#each]] &mdash; _or_ relying on
 *  repetitive array construction (such as uniq), may yield unsatisfactory
 *  performance. In such cases, you're better off writing manual indexing loops,
 *  but take care then to cache the length property and use the prefix `++`
 *  operator:
 *
 *      // Custom loop with cached length property: maximum full-loop
 *      // performance on very large arrays!
 *      for (var index = 0, len = myArray.length; index < len; ++index) {
 *        var item = myArray[index];
 *        // Your code working on item here...
 *      }
 *
 **/
(function () {
    var arrayProto = Array.prototype,
        slice = arrayProto.slice,
        _each = arrayProto.forEach; // use native browser JS 1.6 implementation if available

    console.log(this);
    function each(iterator, context) {
        for (var i = 0, length = this.length >>> 0; i < length; i++) {
            if (i in this) iterator.call(context, this[i], i, this);
        }
    }

    /**
     *  Array#clear() -> Array
     *
     *  Clears the array (makes it empty) and returns the array reference.
     *
     *  ##### Example
     *
     *      var guys = ['Sam', 'Justin', 'Andrew', 'Dan'];
     *      guys.clear();
     *      // -> []
     *      guys
     *      // -> []
     **/
    if (!_each) _each = each;

    function clear() {
        this.length = 0;
        return this;
    }

    /**
     *  Array#first() -> ?
     *
     *  Returns the array's first item (e.g., `array[0]`).
     **/
    function first() {
        return this[0];
    }

    /**
     *  Array#last() -> ?
     *
     *  Returns the array's last item (e.g., `array[array.length - 1]`).
     **/
    function last() {
        return this[this.length - 1];
    }

    /**
     *  Array#compact() -> Array
     *
     *  Returns a **copy** of the array without any `null` or `undefined` values.
     *
     *  ##### Example
     *
     *      var orig = [undefined, 'A', undefined, 'B', null, 'C'];
     *      var copy = orig.compact();
     *      // orig -> [undefined, 'A', undefined, 'B', null, 'C'];
     *      // copy -> ['A', 'B', 'C'];
     **/
    function compact() {
        return this.select(function (value) {
            return value != null;
        });
    }

    /**
     *  Array#flatten() -> Array
     *
     *  Returns a flattened (one-dimensional(一维的)) copy of the array, leaving
     *  the original array unchanged.
     *
     *  Nested arrays are recursively injected inline. This can prove very
     *  useful when handling the results of a recursive collection algorithm(递归收集算法),
     *  for instance.
     *
     *  ##### Example
     *
     *      var a = ['frank', ['bob', 'lisa'], ['jill', ['tom', 'sally']]];
     *      var b = a.flatten();
     *      // a -> ['frank', ['bob', 'lisa'], ['jill', ['tom', 'sally']]]
     *      // b -> ['frank', 'bob', 'lisa', 'jill', 'tom', 'sally']
     **/
    function flatten() {
        return this.inject([], function (array, value) {
            if (Object.isArray(value))
                return array.concat(value.flatten());
            array.push(value);
            return array;
        });
    }

    /**
     *  Array#without(value[, value...]) -> Array
     *  - value (?): A value to exclude.
     *
     *  Produces a new version of the array that does not contain any of the
     *  specified values, leaving the original array unchanged.
     *
     *  ##### Examples
     *
     *      [3, 5, 6].without(3)
     *      // -> [5, 6]
     *
     *      [3, 5, 6, 20].without(20, 6)
     *      // -> [3, 5]
     **/
    function without() {
        var values = slice.call(arguments, 0);
        return this.select(function (value) {
            return !values.include(value);
        });
    }

    /**
     *  Array#reverse([inline = true]) -> Array
     *  - inline (Boolean): Whether to modify the array in place. Defaults to `true`.
     *      Clones the original array when `false`.
     *
     *  Reverses the array's contents, optionally cloning it first.
     *
     *  ##### Examples
     *
     *      // Making a copy
     *      var nums = [3, 5, 6, 1, 20];
     *      var rev = nums.reverse(false);
     *      // nums -> [3, 5, 6, 1, 20]
     *      // rev -> [20, 1, 6, 5, 3]
     *
     *      // Working inline
     *      var nums = [3, 5, 6, 1, 20];
     *      nums.reverse();
     *      // nums -> [20, 1, 6, 5, 3]
     **/
    function reverse(inline) {
        return (inline === false ? this.toArray() : this)._reverse();
    }

    /**
     *  Array#uniq([sorted = false]) -> Array
     *  - sorted (Boolean): Whether the array has already been sorted. If `true`,
     *    a less-costly algorithm will be used.
     *
     *  Produces a duplicate-free version of an array. If no duplicates are
     *  found, the original array is returned.
     *
     *  On large arrays when `sorted` is `false`, this method has a potentially
     *  large performance cost.
     *
     *  ##### Examples
     *
     *      [1, 3, 2, 1].uniq();
     *      // -> [1, 2, 3]
     *
     *      ['A', 'a'].uniq();
     *      // -> ['A', 'a'] (because String comparison is case-sensitive)
     **/
    function uniq(sorted) {
        return this.inject([], function (array, value, index) {
            if (0 == index || (sorted ? array.last() != value : !array.include(value)))
                array.push(value);
            return array;
        });
    }

    /**
     *  Array#intersect(array) -> Array
     *  - array (Array): A collection of values.
     *
     *  Returns an array containing every item that is shared between the two
     *  given arrays.
     **/
    function intersect(array) {
        return this.uniq().findAll(function (item) {
            return array.indexOf(item) !== -1;
        });
    }

    /** alias of: Array#clone
     *  Array#toArray() -> Array
     **/

    /**
     *  Array#clone() -> Array
     *
     *  Returns a duplicate of the array, leaving the original array intact.
     **/
    function clone() {
        return slice.call(this, 0);
    }

    /** related to: Enumerable#size
     *  Array#size() -> Number
     *
     *  Returns the size of the array (e.g., `array.length`).
     *
     *  This is just a local optimization of the mixed-in [[Enumerable#size]]
     *  which avoids array cloning and uses the array's native length property.
     **/
    function size() {
        return this.length;
    }


    /** related to: Object.inspect
     *  Array#inspect() -> String
     *
     *  Returns the debug-oriented string representation of an array.
     *
     *  ##### Example
     *
     *      ['Apples', {good: 'yes', bad: 'no'}, 3, 34].inspect()
     *      // -> "['Apples', [object Object], 3, 34]"
     **/
    function inspect() {
        return '[' + this.map(Object.inspect).join(', ') + ']';
    }

    /**
     *  Array#indexOf(item[, offset = 0]) -> Number
     *  - item (?): A value that may or may not be in the array.
     *  - offset (Number): The number of initial items to skip before beginning
     *      the search.
     *
     *  Returns the index of the first occurrence of `item` within the array,
     *  or `-1` if `item` doesn't exist in the array. `Array#indexOf` compares
     *  items using *strict equality* (`===`).
     *
     *  `Array#indexOf` acts as an ECMAScript 5 [polyfill](http://remysharp.com/2010/10/08/what-is-a-polyfill/).
     *  It is only defined if not already present in the user's browser, and it
     *  is meant to behave like the native version as much as possible. Consult
     *  the [ES5 specification](http://es5.github.com/#x15.4.4.14) for more
     *  information.
     *
     *  ##### Examples
     *
     *      [3, 5, 6, 1, 20].indexOf(1)
     *      // -> 3
     *
     *      [3, 5, 6, 1, 20].indexOf(90)
     *      // -> -1 (not found)
     *
     *      ['1', '2', '3'].indexOf(1);
     *      // -> -1 (not found, 1 !== '1')
     **/
    function indexOf(item, i) {
        if (this == null) throw new TypeError();

        var array = Object(this), length = array.length >>> 0;
        if (length === 0) return -1;

        i = Number(i);
        if (isNaN(i)) {
            i = 0;
        } else if (i !== 0 && isFinite(i)) {
            i = (i > 0 ? 1 : -1) * Math.floor(Math.abs(i));
        }

        if (i > length) return -1;

        var k = i >= 0 ? i : Math.max(length - Math.abs(i), 0);
        for (; k < length; k++)
            if (k in array && array[k] === item) return k;
        return -1;
    }

    /** related to: Array#indexOf
     *  Array#lastIndexOf(item[, offset]) -> Number
     *  - item (?): A value that may or may not be in the array.
     *  - offset (Number): The number of items at the end to skip before
     *      beginning the search.
     *
     *  Returns the position of the last occurrence of `item` within the
     *  array &mdash; or `-1` if `item` doesn't exist in the array.
     *
     *  `Array#lastIndexOf` acts as an ECMAScript 5 [polyfill](http://remysharp.com/2010/10/08/what-is-a-polyfill/).
     *  It is only defined if not already present in the user's browser, and it
     *  is meant to behave like the native version as much as possible. Consult
     *  the [ES5 specification](http://es5.github.com/#x15.4.4.15) for more
     *  information.
     **/
    function lastIndexOf(item, i) {
        if (this == null) throw new TypeError();

        var array = Object(this), length = array.length >>> 0;
        if (length === 0) return -1;

        if (!Object.isUndefined(i)) {
            i = Number(i);
            if (isNaN(i)) {
                i = 0;
            } else if (i !== 0 && isFinite(i)) {
                i = (i > 0 ? 1 : -1) * Math.floor(Math.abs(i));
            }
        } else {
            i = length;
        }

        var k = i >= 0 ? Math.min(i, length - 1) :
        length - Math.abs(i);

        for (; k >= 0; k--)
            if (k in array && array[k] === item) return k;
        return -1;
    }

    // Replaces a built-in function. No PDoc needed.
    //
    // Used instead of the broken version of Array#concat in some versions of
    // Opera. Made to be ES5-compliant.
    function concat(_) {
        var array = [], items = slice.call(arguments, 0), item, n = 0;
        items.unshift(this);
        for (var i = 0, length = items.length; i < length; i++) {
            item = items[i];
            if (Object.isArray(item) && !('callee' in item)) {
                for (var j = 0, arrayLength = item.length; j < arrayLength; j++) {
                    if (j in item) array[n] = item[j];
                    n++;
                }
            } else {
                array[n++] = item;
            }
        }
        array.length = n;
        return array;
    }


    function wrapNative(method) {
        return function () {
            if (arguments.length === 0) {
                return method.call(this, Prototype.K);
            } else if (arguments[0] === undefined) {
                var args = slice.call(arguments, 1);
                args.unshift(Prototype.K);
                return method.apply(this, args);
            } else {
                return method.apply(this, arguments);
            }
        };
    }


    function map(iterator) {
        if (this == null) throw new TypeError();
        iterator = iterator || Prototype.K;

        var object = Object(this);
        var results = [], context = arguments[1], n = 0;

        for (var i = 0, length = object.length >>> 0; i < length; i++) {
            if (i in object) {
                results[n] = iterator.call(context, object[i], i, object);
            }
            n++;
        }
        results.length = n;
        return results;
    }

    if (arrayProto.map) {
        map = wrapNative(Array.prototype.map);
    }

    function filter(iterator) {
        if (this == null || !Object.isFunction(iterator))
            throw new TypeError();

        var object = Object(this);
        var results = [], context = arguments[1], value;

        for (var i = 0, length = object.length >>> 0; i < length; i++) {
            if (i in object) {
                value = object[i];
                if (iterator.call(context, value, i, object)) {
                    results.push(value);
                }
            }
        }
        return results;
    }

    if (arrayProto.filter) {
        filter = Array.prototype.filter;
    }

    function some(iterator) {
        if (this == null) throw new TypeError();
        iterator = iterator || Prototype.K;
        var context = arguments[1];

        var object = Object(this);
        for (var i = 0, length = object.length >>> 0; i < length; i++) {
            if (i in object && iterator.call(context, object[i], i, object)) {
                return true;
            }
        }

        return false;
    }

    if (arrayProto.some) {
        var some = wrapNative(Array.prototype.some);
    }


    function every(iterator) {
        if (this == null) throw new TypeError();
        iterator = iterator || Prototype.K;
        var context = arguments[1];

        var object = Object(this);
        for (var i = 0, length = object.length >>> 0; i < length; i++) {
            if (i in object && !iterator.call(context, object[i], i, object)) {
                return false;
            }
        }

        return true;
    }

    if (arrayProto.every) {
        var every = wrapNative(Array.prototype.every);
    }

    var _reduce = arrayProto.reduce;

    function inject(memo, iterator) {
        iterator = iterator || Prototype.K;
        var context = arguments[2];
        return _reduce.call(this, iterator.bind(context), memo);
    }

    if (!arrayProto.reduce) {
        var inject = Enumerable.inject;
    }

    Object.extend(arrayProto, Enumerable);

    if (!arrayProto._reverse)
        arrayProto._reverse = arrayProto.reverse;

    Object.extend(arrayProto, {
        _each: _each,

        map: map,
        collect: map,
        select: filter,
        filter: filter,
        findAll: filter,
        some: some,
        any: some,
        every: every,
        all: every,
        inject: inject,

        clear: clear,
        first: first,
        last: last,
        compact: compact,
        flatten: flatten,
        without: without,
        reverse: reverse,
        uniq: uniq,
        intersect: intersect,
        clone: clone,
        toArray: clone,
        size: size,
        inspect: inspect
    });

    var CONCAT_ARGUMENTS_BUGGY = (function () {
        return [].concat(arguments)[0][0] !== 1;
    })(1, 2);

    if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;

    if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
    if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
})();


/** section: Language, related to: Hash
 *  $H([obj]) -> Hash
 *
 *  Creates a [[Hash]] (which is synonymous to "map" or "associative array"
 *  for our purposes). A convenience wrapper around the [[Hash]] constructor, with a safeguard
 *  that lets you pass an existing [[Hash]] object and get it back untouched (instead of
 *  uselessly cloning it).
 *
 *  The [[$H]] function is the shorter way to obtain a hash (prior to 1.5 final, it was
 *  the *only* proper way of getting one).
 *
 *  ##### Example
 *
 *      var h = $H({name: 'John', age: 26, country: 'Australia'});
 *      // Equivalent to:
 *      var h = new Hash({name: 'John', age: 26, country: 'Australia'});
 *      // Can then be accessed the classic Hash way
 *      h.get('country');
 *      // -> 'Australia'
 **/
function $H(object) {
    return new Hash(object);
};

/** section: Language
 * class Hash
 *  includes Enumerable
 *
 *  A set of key/value pairs.
 *
 *  [[Hash]] can be thought of as an associative array, binding unique keys to
 *  values (which are not necessarily unique), though it can not guarantee
 *  consistent order its elements when iterating. Because of the nature of
 *  JavaScript, every object is in fact a hash; but [[Hash]] adds a number of
 *  methods that let you enumerate keys and values, iterate over key/value
 *  pairs, merge two hashes together, and much more.
 *
 *  ##### Creating a hash
 *
 *  You can create a Hash either via `new Hash()` or the convenience alias
 *  `$H()`; there is **no** difference between them. In either case, you may
 *  optionally pass in an object to seed the [[Hash]]. If you pass in a [[Hash]],
 *  it will be cloned.
 *
 **/
var Hash = Class.create(Enumerable, (function () {
    /**
     *  new Hash([object])
     *
     *  Creates a new [[Hash]]. If `object` is given, the new hash will be populated
     *  with all the object's properties. See [[$H]].
     **/
    function initialize(object) {
        this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
    }


    // Docs for #each even though technically it's implemented by Enumerable
    /**
     *  Hash#each(iterator[, context]) -> Hash
     *  - iterator (Function): A function that expects each item in the [[Hash]]
     *    as the first argument and a numerical index as the second.
     *  - context (Object): The scope in which to call `iterator`. Determines what
     *    `this` means inside `iterator`.
     *
     *  Iterates over the name/value pairs in the hash.
     *
     *  This is actually just the [[Enumerable#each #each]] method from the
     *  mixed-in [[Enumerable]] module. It is documented here to describe the
     *  structure of the elements passed to the iterator and the order of
     *  iteration.
     *
     *  The iterator's first argument (the "item") is an object with two
     *  properties:
     *
     *  - `key`: the key name as a `String`
     *  - `value`: the corresponding value (which may be `undefined`)
     *
     *  The order of iteration is implementation-dependent, as it relies on
     *  the order of the native `for..in` loop. Although most modern
     *  implementations exhibit *ordered* behavior, this is not standardized and
     *  may not always be the case, and so cannot be relied upon.
     *
     *  ##### Example
     *
     *      var h = $H({version: 1.6, author: 'The Core Team'});
     *
     *      h.each(function(pair) {
   *        alert(pair.key + ' = "' + pair.value + '"');
   *      });
     *      // Alerts 'version = "1.6"' and 'author = "The Core Team"'
     *      // -or-
     *      // Alerts 'author = "The Core Team"' and 'version = "1.6"'
     **/
    function _each(iterator, context) {
        var i = 0;
        for (var key in this._object) {
            var value = this._object[key], pair = [key, value];
            pair.key = key;
            pair.value = value;
            iterator.call(context, pair, i);
            i++;
        }
    }

    /**
     *  Hash#set(key, value) -> value
     *  - key (String): The key to use for this value.
     *  - value (?): The value to use for this key.
     *
     *  Stores `value` in the hash using the key `key` and returns `value`.
     *
     *  ##### Example
     *
     *      var h = $H();
     *      h.keys();
     *      // -> [] (initially empty)
     *      h.set('a', 'apple');
     *      // -> "apple"
     *      h.keys();
     *      // -> ["a"] (has the new entry)
     *      h.get('a');
     *      // -> "apple"
     **/
    function set(key, value) {
        return this._object[key] = value;
    }

    function get(key) {
        if (this._object[key] !== Object.prototype[key])
            return this._object[key];
    }

    function unset(key) {
        var value = this._object[key];
        delete this._object[key];
        return value;
    }

    function toObject() {
        return Object.clone(this._object);
    }


    function keys() {
        return this.pluck('key');
    }

    function values() {
        return this.pluck('value');
    }

    function index(value) {
        var match = this.detect(function (pair) {
            return pair.value === value;
        });
        return match && match.key;
    }

    function merge(object) {
        return this.clone().update(object);
    }

    function update(object) {
        return new Hash(object).inject(this, function (result, pair) {
            result.set(pair.key, pair.value);
            return result;
        });
    }

    function toQueryPair(key, value) {
        if (Object.isUndefined(value)) return key;

        value = String.interpret(value);

        value = value.gsub(/(\r)?\n/, '\r\n');
        value = encodeURIComponent(value);
        value = value.gsub(/%20/, '+');
        return key + '=' + value;
    }

    function toQueryString() {
        return this.inject([], function (results, pair) {
            var key = encodeURIComponent(pair.key), values = pair.value;

            if (values && typeof values == 'object') {
                if (Object.isArray(values)) {
                    var queryValues = [];
                    for (var i = 0, len = values.length, value; i < len; i++) {
                        value = values[i];
                        queryValues.push(toQueryPair(key, value));
                    }
                    return results.concat(queryValues);
                }
            } else results.push(toQueryPair(key, values));
            return results;
        }).join('&');
    }

    function inspect() {
        return '#<Hash:{' + this.map(function (pair) {
                return pair.map(Object.inspect).join(': ');
            }).join(', ') + '}>';
    }

    function clone() {
        return new Hash(this);
    }

    return {
        initialize: initialize,
        _each: _each,
        set: set,
        get: get,
        unset: unset,
        toObject: toObject,
        toTemplateReplacements: toObject,
        keys: keys,
        values: values,
        index: index,
        merge: merge,
        update: update,
        toQueryString: toQueryString,
        inspect: inspect,
        toJSON: toObject,
        clone: clone
    };
})());

Hash.from = $H;
Object.extend(Number.prototype, (function () {
    function toColorPart() {
        return this.toPaddedString(2, 16);
    }

    function succ() {
        return this + 1;
    }

    function times(iterator, context) {
        $R(0, this, true).each(iterator, context);
        return this;
    }

    function toPaddedString(length, radix) {
        var string = this.toString(radix || 10);
        return '0'.times(length - string.length) + string;
    }

    function abs() {
        return Math.abs(this);
    }

    function round() {
        return Math.round(this);
    }

    function ceil() {
        return Math.ceil(this);
    }

    function floor() {
        return Math.floor(this);
    }

    return {
        toColorPart: toColorPart,
        succ: succ,
        times: times,
        toPaddedString: toPaddedString,
        abs: abs,
        round: round,
        ceil: ceil,
        floor: floor
    };
})());

/** section: Language
 * class ObjectRange
 *  includes Enumerable(可枚举的)
 *
 *  A succession of values.
 *
 *  An [[ObjectRange]] can model a range of any value that implements a `succ`
 *  method (which links that value to its "successor").
 *
 *  Prototype provides such a method for [[Number]] and [[String]], but you
 *  are (of course) welcome to implement useful semantics in your own objects,
 *  in order to enable ranges based on them.
 *
 *  [[ObjectRange]] mixes in [[Enumerable]], which makes ranges very versatile.
 *  It takes care, however, to override the default code for `include`, to
 *  achieve better efficiency.
 *
 *  While [[ObjectRange]] does provide a constructor, the preferred way to obtain
 *  a range is to use the [[$R]] utility function, which is strictly equivalent
 *  (only way more concise to use).
 *
 *  See [[$R]] for more information.
 **/

/** section: Language
 *  $R(start, end[, exclusive = false]) -> ObjectRange
 *
 *  Creates a new [[ObjectRange]] object. This method is a convenience(方便) wrapper(包装)
 *  around the [[ObjectRange]] constructor, but [[$R]] is the preferred alias.
 *
 *  [[ObjectRange]] instances represent a range of consecutive values, be they
 *  numerical, textual, or of another type that semantically(语义地) supports value
 *  ranges. See the type's documentation for further details, and to discover
 *  how your own objects can support value ranges.
 *
 *  The [[$R]] function takes exactly the same arguments as the original
 *  constructor: the **lower and upper bounds** (value of the same, proper
 *  type), and **whether the upper bound is exclusive** or not. By default, the
 *  upper bound is inclusive.
 *
 *  ##### Examples
 *
 *      $R(0, 10).include(10)
 *      // -> true
 *
 *      $A($R(0, 5)).join(', ')
 *      // -> '0, 1, 2, 3, 4, 5'
 *
 *      $A($R('aa', 'ah')).join(', ')
 *      // -> 'aa, ab, ac, ad, ae, af, ag, ah'
 *
 *      $R(0, 10, true).include(10)
 *      // -> false
 *
 *      $R(0, 10, true).each(function(value) {
 *        // invoked 10 times for value = 0 to 9
 *      });
 *
 *  Note that [[ObjectRange]] mixes in the [[Enumerable]] module: this makes it
 *  easy to convert a range to an [[Array]] ([[Enumerable]] provides the
 *  [[Enumerable#toArray]] method, which makes the [[$A]] conversion
 *  straightforward), or to iterate through values. (Note, however, that getting
 *  the bounds back will be more efficiently done using the
 *  [[ObjectRange#start]] and [[ObjectRange#end]] properties than calling the
 *  [[Enumerable#min]] and [[Enumerable#max]] methods).
 *
 *  ##### Warning
 *
 *  **Be careful with [[String]] ranges**: as described in its [[String#succ]]
 *  method, it does not use alphabetical boundaries, but goes all the way
 *  through the character table:
 *
 *      $A($R('a', 'e'))
 *      // -> ['a', 'b', 'c', 'd', 'e'], no surprise there
 *
 *      $A($R('ax', 'ba'))
 *      // -> Ouch! Humongous array, starting as ['ax', 'ay', 'az', 'a{', 'a|', 'a}', 'a~'...]
 *
 *  See [[ObjectRange]] for more information.
 **/
function $R(start, end, exclusive) {
    return new ObjectRange(start, end, exclusive);
}

var ObjectRange = Class.create(Enumerable, (function () {

    /**
     *  new ObjectRange(start, end[, exclusive = false])
     *
     *  Creates a new [[ObjectRange]].
     *
     *  The `exclusive` argument specifies whether `end` itself is a part of the
     *  range.
     **/
    function initialize(start, end, exclusive) {
        this.start = start;
        this.end = end;
        this.exclusive = exclusive;
    }

    function _each(iterator, context) {
        var value = this.start, i;
        for (i = 0; this.include(value); i++) {
            iterator.call(context, value, i);
            value = value.succ();
        }
    }

    /**
     *  ObjectRange#include(value) -> Boolean
     *
     *  Determines whether the value is included in the range.
     *
     *  This assumes the values in the range have a valid strict weak ordering
     *  (have valid semantics for the `<` operator). While [[ObjectRange]] mixes
     *  in [[Enumerable]], this method overrides the default version of
     *  [[Enumerable#include]], and is much more efficient (it uses a maximum of
     *  two comparisons).
     *
     *  ##### Examples
     *
     *      $R(1, 10).include(5);
     *      // -> true
     *
     *      $R('a', 'h').include('x');
     *      // -> false
     *
     *      $R(1, 10).include(10);
     *      // -> true
     *
     *      $R(1, 10, true).include(10);
     *      // -> false
     **/
    function include(value) {
        if (value < this.start)
            return false;
        if (this.exclusive)
            return value < this.end;
        return value <= this.end;
    }

    return {
        initialize: initialize,
        _each: _each,
        include: include
    };
})());


var Abstract = {};


var Try = {
    these: function () {
        var returnValue;

        for (var i = 0, length = arguments.length; i < length; i++) {
            var lambda = arguments[i];
            try {
                returnValue = lambda();
                break;
            } catch (e) {
            }
        }

        return returnValue;
    }
};

/** section: Ajax
 * Ajax
 **/
var Ajax = {
    getTransport: function () {
        return Try.these(
                function () {
                    return new XMLHttpRequest()
                },
                function () {
                    return new ActiveXObject('Msxml2.XMLHTTP')
                },
                function () {
                    return new ActiveXObject('Microsoft.XMLHTTP')
                }
            ) || false;
    },

    /**
     *  Ajax.activeRequestCount -> Number
     *
     *  Represents the number of active XHR requests triggered through
     *  [[Ajax.Request]], [[Ajax.Updater]], or [[Ajax.PeriodicalUpdater]].
     **/
    activeRequestCount: 0
};

/** section: Ajax
 * Ajax.Responders(响应)
 *  includes Enumerable
 *
 *  A repository of global listeners notified about every step of
 *  Prototype-based Ajax requests.
 *
 *  Sometimes, you need to provide generic(类的) behaviors over all Ajax operations
 *  happening on the page (through [[Ajax.Request]], [[Ajax.Updater]] or
 *  [[Ajax.PeriodicalUpdater]]).
 *
 *  For instance, you might want to automatically show an indicator(指示者) when an
 *  Ajax request is ongoing(不间断的), and hide it when none are. You may well want to
 *  factor out exception handling as well, logging those somewhere on the page
 *  in a custom fashion. The possibilities are myriad(无数的).
 *
 *  To achieve this, Prototype provides `Ajax.Responders`, which lets you
 *  register (and, if you wish, unregister later) _responders_, which are
 *  objects with specially-named methods. These names come from a set of
 *  general callbacks corresponding to different points in time (or outcomes)
 *  of an Ajax request's life cycle.
 *
 *  For instance, Prototype automatically registers a responder that maintains
 *  a nifty variable: [[Ajax.activeRequestCount]]. This represents, at a given
 *  time, the number of currently active Ajax requests &mdash; by monitoring their
 *  `onCreate` and `onComplete` events. The code for this is fairly simple:
 *
 *      Ajax.Responders.register({
 *        onCreate: function() {
 *          Ajax.activeRequestCount++;
 *        },
 *        onComplete: function() {
 *          Ajax.activeRequestCount--;
 *        }
 *      });
 *
 *  ##### Responder callbacks
 *
 *  The callbacks for responders are similar to the callbacks described in
 *  the [[Ajax section]], but take a different signature. They're invoked with
 *  three parameters: the requester object (i.e., the corresponding "instance"
 *  of [[Ajax.Request]]), the `XMLHttpRequest` object, and the result of
 *  evaluating the `X-JSON` response header, if any (can be `null`). They also
 *  execute in the context of the responder, bound to the `this` reference.
 *
 *  * `onCreate`: Triggered whenever a requester object from the `Ajax`
 *    namespace is created, after its parameters are adjusted and before its
 *    XHR connection is opened. This takes *two* arguments: the requester
 *    object and the underlying XHR object.
 *  * `onUninitialized` (*Not guaranteed*):  Invoked just after the XHR object
 *    is created.
 *  * `onLoading` (*Not guaranteed*): Triggered when the underlying XHR object
 *    is being setup, and its connection opened.
 *  * `onLoaded` (*Not guaranteed*): Triggered once the underlying XHR object
 *    is setup, the connection is open, and it is ready to send its actual
 *    request.
 *  * `onInteractive` (*Not guaranteed*): Triggered whenever the requester
 *    receives a part of the response (but not the final part), should it
 *    be sent in several packets.
 *  * `onException`: Triggered whenever an XHR error arises. Has a custom
 *    signature: the first argument is the requester (i.e. an [[Ajax.Request]]
 *    instance), and the second is the exception object.
 *  * `onComplete`: Triggered at the _very end_ of a request's life-cycle, after
 *    the request completes, status-specific callbacks are called, and possible
 *    automatic behaviors are processed. Guaranteed to run regardless of what
 *    happened during the request.
 **/
Ajax.Responders = {
    responders: [],

    _each: function (iterator, context) {
        this.responders._each(iterator, context);
    },


    /**
     *  Ajax.Responders.register(responder) -> undefined
     *  - responder (Object): A list of functions with keys corresponding to the
     *    names of possible callbacks.
     *
     *  Add a group of responders to all Ajax requests.
     **/
    register: function (responder) {
        if (!this.include(responder))
            this.responders.push(responder);
    },

    /**
     *  Ajax.Responders.unregister(responder) -> undefined
     *  - responder (Object): A list of functions with keys corresponding to the
     *    names of possible callbacks.
     *
     *  Remove a previously-added(以前) group of responders.
     *
     *  As always, unregistering something requires you to use the very same
     *  object you used at registration. If you plan to use `unregister`, be sure
     *  to assign your responder to a _variable_ before passing it into
     *  [[Ajax.Responders#register]] &mdash; don't pass it an object literal.
     **/
    unregister: function (responder) {
        this.responders = this.responders.without(responder);
    },

    dispatch: function (callback, request, transport, json) {
        this.each(function (responder) {
            if (Object.isFunction(responder[callback])) {
                try {
                    responder[callback].apply(responder, [request, transport, json]);
                } catch (e) {
                }
            }
        });
    }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
    onCreate: function () {
        Ajax.activeRequestCount++
    },
    onComplete: function () {
        Ajax.activeRequestCount--
    }
});
Ajax.Base = Class.create({
    initialize: function (options) {
        this.options = {
            method: 'post',
            asynchronous: true,
            contentType: 'application/x-www-form-urlencoded',
            encoding: 'UTF-8',
            parameters: '',
            evalJSON: true,
            evalJS: true
        };
        Object.extend(this.options, options || {});

        this.options.method = this.options.method.toLowerCase();

        if (Object.isHash(this.options.parameters))
            this.options.parameters = this.options.parameters.toObject();
    }
});

/** section: Ajax
 *  class Ajax.Request(请求)
 *
 *  Initiates and processes an Ajax request.
 *
 *  [[Ajax.Request]] is a general-purpose class for making HTTP requests which
 *  handles the life-cycle of the request, handles the boilerplate, and lets
 *  you plug in callback functions for your custom needs.
 *
 *  In the optional `options` hash, you usually provide an `onComplete` and/or
 *  `onSuccess` callback, unless you're in the edge case where you're getting a
 *  JavaScript-typed response, that will automatically be `eval`'d.
 *
 *  For a full list of common options and callbacks, see "Ajax options" heading
 *  of the [[Ajax section]].
 *
 *  ##### A basic example
 *
 *      new Ajax.Request('/your/url', {
 *        onSuccess: function(response) {
 *          // Handle the response content...
 *        }
 *      });
 *
 *  ##### Request life-cycle
 *
 *  Underneath our nice requester objects lies, of course, `XMLHttpRequest`. The
 *  defined life-cycle is as follows:
 *
 *  1. Created
 *  2. Initialized
 *  3. Request sent
 *  4. Response being received (can occur many times, as packets come in)
 *  5. Response received, request complete
 *
 *  As you can see under the "Ajax options" heading of the [[Ajax section]],
 *  Prototype's AJAX objects define a whole slew of callbacks, which are
 *  triggered in the following order:
 *
 *  1. `onCreate` (this is actually a callback reserved to [[Ajax.Responders]])
 *  2. `onUninitialized` (maps on Created)
 *  3. `onLoading` (maps on Initialized)
 *  4. `onLoaded` (maps on Request sent)
 *  5. `onInteractive` (maps on Response being received)
 *  6. `on`*XYZ* (numerical response status code), onSuccess or onFailure (see below)
 *  7. `onComplete`
 *
 *  The two last steps both map on *Response received*, in that order. If a
 *  status-specific callback is defined, it gets invoked. Otherwise, if
 *  `onSuccess` is defined and the response is deemed a success (see below), it
 *  is invoked. Otherwise, if `onFailure` is defined and the response is *not*
 *  deemed a success, it is invoked. Only after that potential first callback is
 *  `onComplete` called.
 *
 *  ##### A note on portability
 *
 *  Depending on how your browser implements `XMLHttpRequest`, one or more
 *  callbacks may never be invoked. In particular, `onLoaded` and
 *  `onInteractive` are not a 100% safe bet so far. However, the global
 *  `onCreate`, `onUninitialized` and the two final steps are very much
 *  guaranteed.
 *
 *  ##### `onSuccess` and `onFailure`, the under-used callbacks
 *
 *  Way too many people use [[Ajax.Request]] in a similar manner to raw XHR,
 *  defining only an `onComplete` callback even when they're only interested in
 *  "successful" responses, thereby testing it by hand:
 *
 *      // This is too bad, there's better!
 *      new Ajax.Request('/your/url', {
 *        onComplete: function(response) {
 *          if (200 == response.status)
 *            // yada yada yada
 *        }
 *      });
 *
 *  First, as described below, you could use better "success" detection: success
 *  is generally defined, HTTP-wise, as either no response status or a "2xy"
 *  response status (e.g., 201 is a success, too). See the example below.
 *
 *  Second, you could dispense with status testing altogether! Prototype adds
 *  callbacks specific to success and failure, which we listed above. Here's
 *  what you could do if you're only interested in success, for instance:
 *
 *      new Ajax.Request('/your/url', {
 *        onSuccess: function(response) {
 *            // yada yada yada
 *        }
 *      });
 *
 *  ##### Automatic JavaScript response evaluation
 *
 *  If an Ajax request follows the _same-origin policy_ **and** its response
 *  has a JavaScript-related `Content-type`, the content of the `responseText`
 *  property will automatically be passed to `eval`.
 *
 *  In other words: you don't even need to provide a callback to leverage
 *  pure-JavaScript Ajax responses. This is the convention that drives Rails's
 *  RJS.
 *
 *  The list of JavaScript-related MIME-types handled by Prototype is:
 *
 *  * `application/ecmascript`
 *  * `application/javascript`
 *  * `application/x-ecmascript`
 *  * `application/x-javascript`
 *  * `text/ecmascript`
 *  * `text/javascript`
 *  * `text/x-ecmascript`
 *  * `text/x-javascript`
 *
 *  The MIME-type string is examined in a case-insensitive manner.
 *
 *  ##### Methods you may find useful
 *
 *  Instances of the [[Ajax.Request]] object provide several methods that come
 *  in handy in your callback functions, especially once the request is complete.
 *
 *  ###### Is the response a successful one?
 *
 *  The [[Ajax.Request#success]] method examines the XHR object's `status`
 *  property and follows general HTTP guidelines: unknown status is deemed
 *  successful, as is the whole `2xy` status code family. It's a generally
 *  better way of testing your response than the usual
 *  `200 == transport.status`.
 *
 *  ###### Getting HTTP response headers
 *
 *  While you can obtain response headers from the XHR object using its
 *  `getResponseHeader` method, this makes for verbose code, and several
 *  implementations raise an exception when the header is not found. To make
 *  this easier, you can use the [[Ajax.Response#getHeader]] method, which
 *  delegates to the longer version and returns `null` if an exception occurs:
 *
 *      new Ajax.Request('/your/url', {
 *        onSuccess: function(response) {
 *          // Note how we brace against null values
 *          if ((response.getHeader('Server') || '').match(/Apache/))
 *            ++gApacheCount;
 *          // Remainder of the code
 *        }
 *      });
 *
 *  ##### Evaluating JSON headers
 *
 *  Some backends will return JSON not as response text, but in the `X-JSON`
 *  header. In this case, you don't even need to evaluate the returned JSON
 *  yourself, as Prototype automatically does so. It passes the result as the
 *  `headerJSON` property of the [[Ajax.Response]] object. Note that if there
 *  is no such header &mdash; or its contents are invalid &mdash; `headerJSON`
 *  will be set to `null`.
 *
 *      new Ajax.Request('/your/url', {
 *        onSuccess: function(transport) {
 *          transport.headerJSON
 *        }
 *      });
 **/
Ajax.Request = Class.create(Ajax.Base, {
    _complete: false,


    /**
     *  new Ajax.Request(url[, options])
     *  - url (String): The URL to fetch. When the _same-origin_ policy is in
     *    effect (as it is in most cases), `url` **must** be a relative URL or an
     *    absolute URL that starts with a slash (i.e., it must not begin with
     *    `http`).
     *  - options (Object): Configuration for the request. See the
     *    [[Ajax section]] for more information.
     *
     *  Creates a new `Ajax.Request`.
     **/
    initialize: function ($super, url, options) {
        //console.log($super);console.log(options);console.log(this);
        $super(options);
        this.transport = Ajax.getTransport();
        //console.log(this.transport);
        this.request(url);
    },

    request: function (url) {
        this.url = url;
        this.method = this.options.method;
        var params = Object.isString(this.options.parameters) ?
            this.options.parameters :
            Object.toQueryString(this.options.parameters);

        if (!['get', 'post'].include(this.method)) {
            params += (params ? '&' : '') + "_method=" + this.method;
            this.method = 'post';
        }

        if (params && this.method === 'get') {
            this.url += (this.url.include('?') ? '&' : '?') + params;
        }

        this.parameters = params.toQueryParams();

        try {
            var response = new Ajax.Response(this);
            if (this.options.onCreate) this.options.onCreate(response);
            Ajax.Responders.dispatch('onCreate', this, response);

            this.transport.open(this.method.toUpperCase(), this.url,
                this.options.asynchronous);

            if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();

            this.body = this.method == 'post' ? (this.options.postBody || params) : null;
            this.transport.send(this.body);

            /* Force Firefox to handle ready state 4 for synchronous requests */
            if (!this.options.asynchronous && this.transport.overrideMimeType)
                this.onStateChange();

        }
        catch (e) {
            this.dispatchException(e);
        }
    },

    onStateChange: function () {
        var readyState = this.transport.readyState;
        if (readyState > 1 && !((readyState == 4) && this._complete))
            this.respondToReadyState(this.transport.readyState);
    },

    setRequestHeaders: function () {
        var headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Prototype-Version': Prototype.Version,
            'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
        };

        if (this.method == 'post') {
            headers['Content-type'] = this.options.contentType +
                (this.options.encoding ? '; charset=' + this.options.encoding : '');

            /* Force "Connection: close" for older Mozilla browsers to work
             * around a bug where XMLHttpRequest sends an incorrect
             * Content-length header. See Mozilla Bugzilla #246651.
             */
            if (this.transport.overrideMimeType &&
                (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005)
                headers['Connection'] = 'close';
        }

        if (typeof this.options.requestHeaders == 'object') {
            var extras = this.options.requestHeaders;

            if (Object.isFunction(extras.push))
                for (var i = 0, length = extras.length; i < length; i += 2)
                    headers[extras[i]] = extras[i + 1];
            else
                $H(extras).each(function (pair) {
                    headers[pair.key] = pair.value
                });
        }

        for (var name in headers)
            if (headers[name] != null)
                this.transport.setRequestHeader(name, headers[name]);
    },

    /**
     *  Ajax.Request#success() -> Boolean
     *
     *  Tests whether the request was successful.
     **/
    success: function () {
        var status = this.getStatus();
        return !status || (status >= 200 && status < 300) || status == 304;
    },

    getStatus: function () {
        try {
            if (this.transport.status === 1223) return 204;
            return this.transport.status || 0;
        } catch (e) {
            return 0
        }
    },

    respondToReadyState: function (readyState) {
        var state = Ajax.Request.Events[readyState], response = new Ajax.Response(this);

        if (state == 'Complete') {
            try {
                this._complete = true;
                (this.options['on' + response.status]
                || this.options['on' + (this.success() ? 'Success' : 'Failure')]
                || Prototype.emptyFunction)(response, response.headerJSON);
            } catch (e) {
                this.dispatchException(e);
            }

            var contentType = response.getHeader('Content-type');
            if (this.options.evalJS == 'force'
                || (this.options.evalJS && this.isSameOrigin() && contentType
                && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
                this.evalResponse();
        }

        try {
            (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
            Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
        } catch (e) {
            this.dispatchException(e);
        }

        if (state == 'Complete') {
            this.transport.onreadystatechange = Prototype.emptyFunction;
        }
    },

    isSameOrigin: function () {
        var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
        return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
                protocol: location.protocol,
                domain: document.domain,
                port: location.port ? ':' + location.port : ''
            }));
    },

    /**
     *  Ajax.Request#getHeader(name) -> String | null
     *  - name (String): The name of an HTTP header that may have been part of
     *    the response.
     *
     *  Returns the value of the given response header, or `null` if that header
     *  was not found.
     **/
    getHeader: function (name) {
        try {
            return this.transport.getResponseHeader(name) || null;
        } catch (e) {
            return null;
        }
    },

    evalResponse: function () {
        try {
            return eval((this.transport.responseText || '').unfilterJSON());
        } catch (e) {
            this.dispatchException(e);
        }
    },

    dispatchException: function (exception) {
        (this.options.onException || Prototype.emptyFunction)(this, exception);
        Ajax.Responders.dispatch('onException', this, exception);
    }
});

Ajax.Request.Events =
    ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

/** section: Ajax
 *  class Ajax.Response
 *
 *  A wrapper(封装) class around `XmlHttpRequest` for dealing with HTTP responses
 *  of Ajax requests.
 *
 *  An instance of [[Ajax.Response]] is passed as the first argument of all Ajax
 *  requests' callbacks. You _will not_ need to create instances of
 *  [[Ajax.Response]] yourself.
 **/

/**
 *  Ajax.Response#readyState -> Number
 *
 *  A [[Number]] corresponding to the request's current state.
 *
 *  `0` : `"Uninitialized"`<br />
 *  `1` : `"Loading"`<br />
 *  `2` : `"Loaded"`<br />
 *  `3` : `"Interactive"`<br />
 *  `4` : `"Complete"`
 **/

/**
 *  Ajax.Response#responseText -> String
 *
 *  The text body of the response.
 **/

/**
 *  Ajax.Response#responseXML -> document | null
 *
 *  The XML body of the response if the `Content-type` of the request is set
 *  to `application/xml`; `null` otherwise.
 **/

/**
 *  Ajax.Response#responseJSON -> Object | Array | null
 *
 *  The JSON body of the response if the `Content-type` of the request is set
 *  to `application/json`; `null` otherwise.
 **/

/**
 *  Ajax.Response#headerJSON -> Object | Array | null
 *
 *  Auto-evaluated content of the `X-JSON` header if present; `null` otherwise.
 *  This is useful to transfer _small_ amounts of data.
 **/

/**
 *  Ajax.Response#request -> Ajax.Request | Ajax.Updater
 *
 *  The request object itself (an instance of [[Ajax.Request]] or
 *  [[Ajax.Updater]]).
 **/

/**
 *  Ajax.Response#transport -> XmlHttpRequest
 *
 *  The native `XmlHttpRequest` object itself.
 **/
Ajax.Response = Class.create({
    initialize: function (request) {
        this.request = request;
        var transport = this.transport = request.transport,
            readyState = this.readyState = transport.readyState;

        if ((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
            this.status = this.getStatus();
            this.statusText = this.getStatusText();
            this.responseText = String.interpret(transport.responseText);
            this.headerJSON = this._getHeaderJSON();
        }

        if (readyState == 4) {
            var xml = transport.responseXML;
            this.responseXML = Object.isUndefined(xml) ? null : xml;
            this.responseJSON = this._getResponseJSON();
        }
    },

    /**
     *  Ajax.Response#status -> Number
     *
     *  The HTTP status code sent by the server.
     **/
    status: 0,

    /**
     *  Ajax.Response#statusText -> String
     *
     *  The HTTP status text sent by the server.
     **/
    statusText: '',

    getStatus: Ajax.Request.prototype.getStatus,

    getStatusText: function () {
        try {
            return this.transport.statusText || '';
        } catch (e) {
            return ''
        }
    },

    /**
     *  Ajax.Response#getHeader(name) -> String | null
     *
     *  See [[Ajax.Request#getHeader]].
     **/
    getHeader: Ajax.Request.prototype.getHeader,

    /**
     *  Ajax.Response#getAllHeaders() -> String | null
     *
     *  Returns a [[String]] containing all headers separated by line breaks.
     *  _Does not_ throw errors if no headers are present the way its native
     *  counterpart does.
     **/
    getAllHeaders: function () {
        try {
            return this.getAllResponseHeaders();
        } catch (e) {
            return null
        }
    },

    /**
     *  Ajax.Response#getResponseHeader(name) -> String
     *
     *  Returns the value of the requested header if present; throws an error
     *  otherwise. This is just a wrapper around the `XmlHttpRequest` method of
     *  the same name. Prefer it's shorter counterpart:
     *  [[Ajax.Response#getHeader]].
     **/
    getResponseHeader: function (name) {
        return this.transport.getResponseHeader(name);
    },

    /**
     *  Ajax.Response#getAllResponseHeaders() -> String
     *
     *  Returns a [[String]] containing all headers separated by line breaks; throws
     *  an error if no headers exist. This is just a wrapper around the
     *  `XmlHttpRequest` method of the same name. Prefer it's shorter counterpart:
     *  [[Ajax.Response#getAllHeaders]].
     **/
    getAllResponseHeaders: function () {
        return this.transport.getAllResponseHeaders();
    },

    _getHeaderJSON: function () {
        var json = this.getHeader('X-JSON');
        if (!json) return null;

        try {
            // Browsers expect HTTP headers to be ASCII and nothing else. Running
            // them through `decodeURIComponent` processes them with the page's
            // specified encoding.
            json = decodeURIComponent(escape(json));
        } catch (e) {
            // Except Chrome doesn't seem to need this, and calling
            // `decodeURIComponent` on text that's already in the proper encoding
            // will throw a `URIError`. The ugly solution is to assume that a
            // `URIError` raised here signifies that the text is, in fact, already
            // in the correct encoding, and treat the failure as a good sign.
            //
            // This is ugly, but so too is sending extended characters in an HTTP
            // header with no spec to back you up.
        }

        try {
            return json.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin());
        } catch (e) {
            this.request.dispatchException(e);
        }
    },

    _getResponseJSON: function () {
        var options = this.request.options;
        if (!options.evalJSON || (options.evalJSON != 'force' && !(this.getHeader('Content-type') || '').include('application/json')) ||
            this.responseText.blank())
            return null;
        try {
            return this.responseText.evalJSON(options.sanitizeJSON || !this.request.isSameOrigin());
        } catch (e) {
            this.request.dispatchException(e);
        }
    }
});

/** section: Ajax
 *  class Ajax.Updater < Ajax.Request
 *
 *  A class that performs an Ajax request and updates a container's contents
 *  with the contents of the response.
 *
 *  [[Ajax.Updater]] is a subclass of [[Ajax.Request]] built for a common
 *  use-case.
 *
 *  ##### Example
 *
 *      new Ajax.Updater('items', '/items', {
 *        parameters: { text: $F('text') }
 *      });
 *
 *  This example will make a request to the URL `/items` (with the given
 *  parameters); it will then replace the contents of the element with the ID
 *  of `items` with whatever response it receives.
 *
 *  ##### Callbacks
 *
 *  [[Ajax.Updater]] supports all the callbacks listed in the [[Ajax section]].
 *  Note that the `onComplete` callback will be invoked **after** the element
 *  is updated.
 *
 *  ##### Additional options
 *
 *  [[Ajax.Updater]] has some options of its own apart from the common options
 *  described in the [[Ajax section]]:
 *
 *  * `evalScripts` ([[Boolean]]; defaults to `false`): Whether `<script>`
 *    elements in the response text should be evaluated.
 *  * `insertion` ([[String]]): By default, `Element.update` is used, meaning
 *    the contents of the response will replace the entire contents of the
 *    container. You may _instead_ insert the response text without disrupting
 *    existing contents. The `insertion` option takes one of four strings &mdash;
 *    `top`, `bottom`, `before`, or `after` &mdash; and _inserts_ the contents
 *    of the response in the manner described by [[Element#insert]].
 *
 *  ##### More About `evalScripts`
 *
 *  If you use `evalScripts: true`, any _inline_ `<script>` block will be
 *  evaluated. This **does not** mean it will be evaluated in the global scope;
 *  it won't, and that has important ramifications for your `var` and `function`
 *  statements.  Also note that only inline `<script>` blocks are supported;
 *  external scripts are ignored. See [[String#evalScripts]] for the details.
 *
 *  ##### Single container, or success/failure split?
 *
 *  The examples above all assume you're going to update the same container
 *  whether your request succeeds or fails. Instead, you may want to update
 *  _only_ for successful requests, or update a _different container_ on failed
 *  requests.
 *
 *  To achieve this, you can pass an object instead of a DOM element for the
 *  `container` parameter. This object _must_ have a `success` property whose
 *  value identifies the container to be updated on successful requests.
 *
 *  If you also provide it with a `failure` property, its value will be used as
 *  the container for failed requests.
 *
 *  In the following code, only successful requests get an update:
 *
 *      new Ajax.Updater({ success: 'items' }, '/items', {
 *        parameters: { text: $F('text') },
 *        insertion: 'bottom'
 *      });
 *
 *  This next example assumes failed requests will deliver an error message as
 *  response text &mdash; one that should be shown to the user in another area:
 *
 *      new Ajax.Updater({ success: 'items', failure: 'notice' }, '/items',
 *        parameters: { text: $F('text') },
 *        insertion: 'bottom'
 *      });
 *
 **/
Ajax.Updater = Class.create(Ajax.Request, {

    /**
     *  new Ajax.Updater(container, url[, options])
     *  - container (String | Element): The DOM element whose contents to update
     *    as a result of the Ajax request. Can be a DOM node or a string that
     *    identifies a node's ID.
     *  - url (String): The URL to fetch. When the _same-origin_ policy is in
     *    effect (as it is in most cases), `url` **must** be a relative URL or an
     *    absolute URL that starts with a slash (i.e., it must not begin with
     *    `http`).
     *  - options (Object): Configuration for the request. See the
     *    [[Ajax section]] for more information.
     *
     *  Creates a new `Ajax.Updater`.
     **/
    initialize: function ($super, container, url, options) {
        this.container = {
            success: (container.success || container),
            failure: (container.failure || (container.success ? null : container))
        };

        options = Object.clone(options);
        var onComplete = options.onComplete;
        options.onComplete = (function (response, json) {
            this.updateContent(response.responseText);
            if (Object.isFunction(onComplete)) onComplete(response, json);
        }).bind(this);

        $super(url, options);
    },

    updateContent: function (responseText) {
        var receiver = this.container[this.success() ? 'success' : 'failure'],
            options = this.options;

        if (!options.evalScripts) responseText = responseText.stripScripts();

        if (receiver = $(receiver)) {
            if (options.insertion) {
                if (Object.isString(options.insertion)) {
                    var insertion = {};
                    insertion[options.insertion] = responseText;
                    receiver.insert(insertion);
                }
                else options.insertion(receiver, responseText);
            }
            else receiver.update(responseText);
        }
    }
});

/** section: Ajax
 *  class Ajax.PeriodicalUpdater
 *
 *  Periodically(周期性的) performs(执行) an Ajax request and updates a container's contents
 *  based on the response text.
 *
 *  [[Ajax.PeriodicalUpdater]] behaves like [[Ajax.Updater]], but performs the
 *  update at a prescribed interval, rather than only once. (Note that it is
 *  _not_ a subclass of [[Ajax.Updater]]; it's a wrapper around it.)
 *
 *  This class addresses the common need of periodical update, as required by
 *  all sorts of "polling" mechanisms (e.g., an online chatroom or an online
 *  mail client).
 *
 *  The basic idea is to run a regular [[Ajax.Updater]] at regular intervals,
 *  keeping track of the response text so it can (optionally) react to
 *  receiving the exact same response consecutively.
 *
 *  ##### Additional options
 *
 *  [[Ajax.PeriodicalUpdater]] features all the common options and callbacks
 *  described in the [[Ajax section]] &mdash; _plus_ those added by
 *  [[Ajax.Updater]].
 *
 *  It also provides two new options:
 *
 *  * `frequency` ([[Number]]; default is `2`): How long, in seconds, to wait
 *    between the end of one request and the beginning of the next.
 *  * `decay`(退化机制) ([[Number]]; default is `1`): The rate at which the `frequency`
 *    grows when the response received is _exactly_ the same as the previous.
 *    The default of `1` means `frequency` will never grow; override the
 *    default if a stale response implies it's worthwhile to poll less often.
 *    If `decay` is set to `2`, for instance, `frequency` will double
 *    (2 seconds, 4 seconds, 8 seconds...) each consecutive time the result
 *    is the same; when the result is different once again, `frequency` will
 *    revert to its original value.
 *
 *  ##### Disabling and re-enabling a [[Ajax.PeriodicalUpdater]]
 *
 *  You can hit the brakes on a running [[Ajax.PeriodicalUpdater]] by calling
 *  [[Ajax.PeriodicalUpdater#stop]]. If you wish to re-enable it later, call
 *  [[Ajax.PeriodicalUpdater#start]].
 *
 **/
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
    /**
     *  new Ajax.PeriodicalUpdater(container, url[, options])
     *  - container (String | Element): The DOM element whose contents to update
     *    as a result of the Ajax request. Can be a DOM node or a string that
     *    identifies a node's ID.
     *  - url (String): The URL to fetch. When the _same-origin_ policy is in
     *    effect (as it is in most cases), `url` **must** be a relative URL or an
     *    absolute URL that starts with a slash (i.e., it must not begin with
     *    `http`).
     *  - options (Object): Configuration for the request. See the
     *    [[Ajax section]] for more information.
     *
     *  Creates a new [[Ajax.PeriodicalUpdater]].
     *
     *  Periodically performs an AJAX request and updates a container's contents
     *  based on the response text. Offers a mechanism for "decay," which lets it
     *  trigger at widening intervals while the response is unchanged.
     *
     *  This object addresses the common need of periodical update, which is used
     *  by all sorts of "polling" mechanisms (e.g. in an online chatroom or an
     *  online mail client).
     *
     *  The basic idea is to run a regular [[Ajax.Updater]] at
     *  regular intervals, monitoring changes in the response text if the `decay`
     *  option (see below) is active.
     *
     *  ##### Additional options
     *
     *  [[Ajax.PeriodicalUpdater]] features all the common options and callbacks
     *  (see the [[Ajax section]] for more information), plus those added by
     *  [[Ajax.Updater]]. It also provides two new options that deal with the
     *  original period, and its decay rate (how Rocket Scientist does that make
     *  us sound, uh?!).
     *
     *  <table>
     *  <thead>
     *    <tr>
     *      <th>Option</th>
     *      <th>Default</th>
     *      <th>Description</th>
     *    </tr>
     *  </thead>
     *  <tbody>
     *    <tr>
     *      <th><code>frequency</code></th>
     *      <td><code>2</code></td>
     *  <td>Okay, this is not a frequency (e.g 0.5Hz), but a period (i.e. a number of seconds).
     *  Don't kill me, I didn't write this one! This is the minimum interval at which AJAX
     *  requests are made. You don't want to make it too short (otherwise you may very well
     *  end up with multiple requests in parallel, if they take longer to process and return),
     *  but you technically can provide a number below one, e.g. 0.75 second.</td>
     *    </tr>
     *    <tr>
     *      <th><code>decay</code></th>
     *      <td>1</td>
     *  <td>This controls the rate at which the request interval grows when the response is
     *  unchanged. It is used as a multiplier on the current period (which starts at the original
     *  value of the <code>frequency</code> parameter). Every time a request returns an unchanged
     *  response text, the current period is multiplied by the decay. Therefore, the default
     *  value means regular requests (no change of interval). Values higher than one will
     *  yield growing intervals. Values below one are dangerous: the longer the response text
     *  stays the same, the more often you'll check, until the interval is so short your browser
     *  is left with no other choice than suicide. Note that, as soon as the response text
     *  <em>does</em> change, the current period resets to the original one.</td>
     *    </tr>
     *  </tbody>
     *  </table>
     *
     *  To better understand decay, here is a small sequence of calls from the
     *  following example:
     *
     *      new Ajax.PeriodicalUpdater('items', '/items', {
   *        method: 'get', frequency: 3, decay: 2
   *      });
     *
     *  <table id="decayTable">
     *  <thead>
     *    <tr>
     *      <th>Call#</th>
     *      <th>When?</th>
     *      <th>Decay before</th>
     *      <th>Response changed?</th>
     *      <th>Decay after</th>
     *      <th>Next period</th>
     *      <th>Comments</th>
     *    </tr>
     *  </thead>
     *  <tbody>
     *    <tr>
     *      <td>1</td>
     *      <td>00:00</td>
     *      <td>2</td>
     *      <td>n/a</td>
     *      <td>1</td>
     *      <td>3</td>
     *  <td>Response is deemed changed, since there is no prior response to compare to!</td>
     *    </tr>
     *    <tr>
     *      <td>2</td>
     *      <td>00:03</td>
     *      <td>1</td>
     *      <td>yes</td>
     *      <td>1</td>
     *      <td>3</td>
     *  <td>Response did change again: we "reset" to 1, which was already the decay.</td>
     *    </tr>
     *    <tr>
     *      <td>3</td>
     *      <td>00:06</td>
     *      <td>1</td>
     *      <td>no</td>
     *      <td>2</td>
     *      <td>6</td>
     *  <td>Response didn't change: decay augments by the <code>decay</code> option factor:
     *  we're waiting longer now&#8230;</td>
     *    </tr>
     *    <tr>
     *      <td>4</td>
     *      <td>00:12</td>
     *      <td>2</td>
     *      <td>no</td>
     *      <td>4</td>
     *      <td>12</td>
     *      <td>Still no change, doubling again.</td>
     *    </tr>
     *    <tr>
     *      <td>5</td>
     *      <td>00:24</td>
     *      <td>4</td>
     *      <td>no</td>
     *      <td>8</td>
     *      <td>24</td>
     *      <td>Jesus, is this thing going to change or what?</td>
     *    </tr>
     *    <tr>
     *      <td>6</td>
     *      <td>00:48</td>
     *      <td>8</td>
     *      <td>yes</td>
     *      <td>1</td>
     *      <td>3</td>
     *  <td>Ah, finally! Resetting decay to 1, and therefore using the original period.</td>
     *    </tr>
     *  </tbody>
     *  </table>
     *
     *  ##### Disabling and re-enabling a [[Ajax.PeriodicalUpdater]]
     *
     *  You can pull the brake on a running [[Ajax.PeriodicalUpdater]] by simply
     *  calling its `stop` method. If you wish to re-enable it later, just call
     *  its `start` method. Both take no argument.
     *
     *  ##### Beware!  Not a specialization!
     *
     *  [[Ajax.PeriodicalUpdater]] is not a specialization of [[Ajax.Updater]],
     *  despite its name. When using it, do not expect to be able to use methods
     *  normally provided by [[Ajax.Request]] and "inherited" by [[Ajax.Updater]],
     *  such as `evalJSON` or `getHeader`. Also the `onComplete` callback is
     *  hijacked to be used for update management, so if you wish to be notified
     *  of every successful request, use `onSuccess` instead (beware: it will get
     *  called *before* the update is performed).
     **/
    initialize: function ($super, container, url, options) {
        $super(options);
        this.onComplete = this.options.onComplete;

        this.frequency = (this.options.frequency || 2);
        this.decay = (this.options.decay || 1);

        this.updater = {};
        this.container = container;
        this.url = url;

        this.start();
    },

    /**
     *  Ajax.PeriodicalUpdater#start() -> undefined
     *
     *  Starts the periodical updater (if it had previously(事先) been stopped with
     *  [[Ajax.PeriodicalUpdater#stop]]).
     **/
    start: function () {
        this.options.onComplete = this.updateComplete.bind(this);
        this.onTimerEvent();
    },

    /**
     *  Ajax.PeriodicalUpdater#stop() -> undefined
     *
     *  Stops the periodical updater.
     *
     *  Also calls the `onComplete` callback, if one has been defined.
     **/
    stop: function () {
        this.updater.options.onComplete = undefined;
        clearTimeout(this.timer);
        (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
    },

    updateComplete: function (response) {
        if (this.options.decay) {
            this.decay = (response.responseText == this.lastText ?
            this.decay * this.options.decay : 1);

            this.lastText = response.responseText;
        }
        this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
    },

    onTimerEvent: function () {
        this.updater = new Ajax.Updater(this.container, this.url, this.options);
    }
});

(function (GLOBAL) {

    var UNDEFINED;
    var SLICE = Array.prototype.slice;

    var DIV = document.createElement('div');


    /** section: DOM
     * class Element
     **/

    /** section: DOM, related to: Element
     *  $(id) -> Element
     *  $(id...) -> [Element...]
     *    - id (String | Element): A DOM node or a string that references a node's
     *      ID.
     *
     *  If provided with a string, returns the element in the document with
     *  matching ID; otherwise returns the passed element.
     *
     *  Takes in an arbitrary number of arguments. Returns one [[Element]] if
     *  given one argument; otherwise returns an [[Array]] of [[Element]]s.
     *
     *  All elements returned by the function are "extended" with [[Element]]
     *  instance methods.
     *
     *  ##### More Information
     *
     *  The [[$]] function is the cornerstone of Prototype. Not only does it
     *  provide a handy alias for `document.getElementById`, it also lets you pass
     *  indifferently IDs (strings) or DOM node references to your functions:
     *
     *      function foo(element) {
   *          element = $(element);
   *          //  rest of the function...
   *      }
     *
     *  Code written this way is flexible — you can pass it the ID of the element
     *  or the element itself without any type sniffing.
     *
     *  Invoking it with only one argument returns the [[Element]], while invoking it
     *  with multiple arguments returns an [[Array]] of [[Element]]s (and this
     *  works recursively: if you're twisted, you could pass it an array
     *  containing some arrays, and so forth). As this is dependent on
     *  `getElementById`, [W3C specs](http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-getElBId)
     *  apply: nonexistent IDs will yield `null` and IDs present multiple times in
     *  the DOM will yield erratic results. *If you're assigning the same ID to
     *  multiple elements, you're doing it wrong!*
     *
     *  The function also *extends every returned element* with [[Element.extend]]
     *  so you can use Prototype's DOM extensions on it. In the following code,
     *  the two lines are equivalent. However, the second one feels significantly
     *  more object-oriented:
     *
     *      // Note quite OOP-like...
     *      Element.hide('itemId');
     *      // A cleaner feel, thanks to guaranted extension
     *      $('itemId').hide();
     *
     *  However, when using iterators, leveraging the [[$]] function makes for
     *  more elegant, more concise, and also more efficient code:
     *
     *      ['item1', 'item2', 'item3'].each(Element.hide);
     *      // The better way:
     *      $('item1', 'item2', 'item3').invoke('hide');
     *
     *  See [How Prototype extends the DOM](http://prototypejs.org/learn/extensions)
     *  for more info.
     **/
    function $(element) {
        if (arguments.length > 1) {
            for (var i = 0, elements = [], length = arguments.length; i < length; i++)
                elements.push($(arguments[i]));
            return elements;
        }

        if (Object.isString(element))
            element = document.getElementById(element);
        return Element.extend(element);
    }

    GLOBAL.$ = $;


    if (!GLOBAL.Node) GLOBAL.Node = {};

    if (!GLOBAL.Node.ELEMENT_NODE) {
        Object.extend(GLOBAL.Node, {
            ELEMENT_NODE: 1,
            ATTRIBUTE_NODE: 2,
            TEXT_NODE: 3,
            CDATA_SECTION_NODE: 4,
            ENTITY_REFERENCE_NODE: 5,
            ENTITY_NODE: 6,
            PROCESSING_INSTRUCTION_NODE: 7,
            COMMENT_NODE: 8,
            DOCUMENT_NODE: 9,
            DOCUMENT_TYPE_NODE: 10,
            DOCUMENT_FRAGMENT_NODE: 11,
            NOTATION_NODE: 12
        });
    }

    var ELEMENT_CACHE = {};

    function shouldUseCreationCache(tagName, attributes) {
        if (tagName === 'select') return false;
        if ('type' in attributes) return false;
        return true;
    }

    var HAS_EXTENDED_CREATE_ELEMENT_SYNTAX = (function () {
        try {
            var el = document.createElement('<input name="x">');
            return el.tagName.toLowerCase() === 'input' && el.name === 'x';
        }
        catch (err) {
            return false;
        }
    })();


    var oldElement = GLOBAL.Element;

    function Element(tagName, attributes) {
        attributes = attributes || {};
        tagName = tagName.toLowerCase();

        if (HAS_EXTENDED_CREATE_ELEMENT_SYNTAX && attributes.name) {
            tagName = '<' + tagName + ' name="' + attributes.name + '">';
            delete attributes.name;
            return Element.writeAttribute(document.createElement(tagName), attributes);
        }

        if (!ELEMENT_CACHE[tagName])
            ELEMENT_CACHE[tagName] = Element.extend(document.createElement(tagName));

        var node = shouldUseCreationCache(tagName, attributes) ?
            ELEMENT_CACHE[tagName].cloneNode(false) : document.createElement(tagName);

        return Element.writeAttribute(node, attributes);
    }

    GLOBAL.Element = Element;

    Object.extend(GLOBAL.Element, oldElement || {});
    if (oldElement) GLOBAL.Element.prototype = oldElement.prototype;

    Element.Methods = {ByTag: {}, Simulated: {}};

    var methods = {};

    var INSPECT_ATTRIBUTES = {id: 'id', className: 'class'};

    function inspect(element) {
        element = $(element);
        var result = '<' + element.tagName.toLowerCase();

        var attribute, value;
        for (var property in INSPECT_ATTRIBUTES) {
            attribute = INSPECT_ATTRIBUTES[property];
            value = (element[property] || '').toString();
            if (value) result += ' ' + attribute + '=' + value.inspect(true);
        }

        return result + '>';
    }

    methods.inspect = inspect;


    function visible(element) {
        return $(element).style.display !== 'none';
    }

    function toggle(element, bool) {
        element = $(element);
        if (Object.isUndefined(bool))
            bool = !Element.visible(element);
        Element[bool ? 'show' : 'hide'](element);

        return element;
    }

    function hide(element) {
        element = $(element);
        element.style.display = 'none';
        return element;
    }

    function show(element) {
        element = $(element);
        element.style.display = '';
        return element;
    }


    Object.extend(methods, {
        visible: visible,
        toggle: toggle,
        hide: hide,
        show: show
    });


    function remove(element) {
        element = $(element);
        element.parentNode.removeChild(element);
        return element;
    }

    var SELECT_ELEMENT_INNERHTML_BUGGY = (function () {
        var el = document.createElement("select"),
            isBuggy = true;
        el.innerHTML = "<option value=\"test\">test</option>";
        if (el.options && el.options[0]) {
            isBuggy = el.options[0].nodeName.toUpperCase() !== "OPTION";
        }
        el = null;
        return isBuggy;
    })();

    var TABLE_ELEMENT_INNERHTML_BUGGY = (function () {
        try {
            var el = document.createElement("table");
            if (el && el.tBodies) {
                el.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
                var isBuggy = typeof el.tBodies[0] == "undefined";
                el = null;
                return isBuggy;
            }
        } catch (e) {
            return true;
        }
    })();

    var LINK_ELEMENT_INNERHTML_BUGGY = (function () {
        try {
            var el = document.createElement('div');
            el.innerHTML = "<link />";
            var isBuggy = (el.childNodes.length === 0);
            el = null;
            return isBuggy;
        } catch (e) {
            return true;
        }
    })();

    var ANY_INNERHTML_BUGGY = SELECT_ELEMENT_INNERHTML_BUGGY ||
        TABLE_ELEMENT_INNERHTML_BUGGY || LINK_ELEMENT_INNERHTML_BUGGY;

    var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function () {
        var s = document.createElement("script"),
            isBuggy = false;
        try {
            s.appendChild(document.createTextNode(""));
            isBuggy = !s.firstChild ||
                s.firstChild && s.firstChild.nodeType !== 3;
        } catch (e) {
            isBuggy = true;
        }
        s = null;
        return isBuggy;
    })();

    function update(element, content) {
        element = $(element);

        var descendants = element.getElementsByTagName('*'),
            i = descendants.length;
        while (i--) purgeElement(descendants[i]);

        if (content && content.toElement)
            content = content.toElement();

        if (Object.isElement(content))
            return element.update().insert(content);


        content = Object.toHTML(content);
        var tagName = element.tagName.toUpperCase();

        if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
            element.text = content;
            return element;
        }

        if (ANY_INNERHTML_BUGGY) {
            if (tagName in INSERTION_TRANSLATIONS.tags) {
                while (element.firstChild)
                    element.removeChild(element.firstChild);

                var nodes = getContentFromAnonymousElement(tagName, content.stripScripts());
                for (var i = 0, node; node = nodes[i]; i++)
                    element.appendChild(node);

            } else if (LINK_ELEMENT_INNERHTML_BUGGY && Object.isString(content) && content.indexOf('<link') > -1) {
                while (element.firstChild)
                    element.removeChild(element.firstChild);

                var nodes = getContentFromAnonymousElement(tagName,
                    content.stripScripts(), true);

                for (var i = 0, node; node = nodes[i]; i++)
                    element.appendChild(node);
            } else {
                element.innerHTML = content.stripScripts();
            }
        } else {
            element.innerHTML = content.stripScripts();
        }

        content.evalScripts.bind(content).defer();
        return element;
    }

    function replace(element, content) {
        element = $(element);

        if (content && content.toElement) {
            content = content.toElement();
        } else if (!Object.isElement(content)) {
            content = Object.toHTML(content);
            var range = element.ownerDocument.createRange();
            range.selectNode(element);
            content.evalScripts.bind(content).defer();
            content = range.createContextualFragment(content.stripScripts());
        }

        element.parentNode.replaceChild(content, element);
        return element;
    }

    var INSERTION_TRANSLATIONS = {
        before: function (element, node) {
            element.parentNode.insertBefore(node, element);
        },
        top: function (element, node) {
            element.insertBefore(node, element.firstChild);
        },
        bottom: function (element, node) {
            element.appendChild(node);
        },
        after: function (element, node) {
            element.parentNode.insertBefore(node, element.nextSibling);
        },

        tags: {
            TABLE: ['<table>', '</table>', 1],
            TBODY: ['<table><tbody>', '</tbody></table>', 2],
            TR: ['<table><tbody><tr>', '</tr></tbody></table>', 3],
            TD: ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
            SELECT: ['<select>', '</select>', 1]
        }
    };

    var tags = INSERTION_TRANSLATIONS.tags;

    Object.extend(tags, {
        THEAD: tags.TBODY,
        TFOOT: tags.TBODY,
        TH: tags.TD
    });

    function replace_IE(element, content) {
        element = $(element);
        if (content && content.toElement)
            content = content.toElement();
        if (Object.isElement(content)) {
            element.parentNode.replaceChild(content, element);
            return element;
        }

        content = Object.toHTML(content);
        var parent = element.parentNode, tagName = parent.tagName.toUpperCase();

        if (tagName in INSERTION_TRANSLATIONS.tags) {
            var nextSibling = Element.next(element);
            var fragments = getContentFromAnonymousElement(
                tagName, content.stripScripts());

            parent.removeChild(element);

            var iterator;
            if (nextSibling)
                iterator = function (node) {
                    parent.insertBefore(node, nextSibling)
                };
            else
                iterator = function (node) {
                    parent.appendChild(node);
                }

            fragments.each(iterator);
        } else {
            element.outerHTML = content.stripScripts();
        }

        content.evalScripts.bind(content).defer();
        return element;
    }

    if ('outerHTML' in document.documentElement)
        replace = replace_IE;

    function isContent(content) {
        if (Object.isUndefined(content) || content === null) return false;

        if (Object.isString(content) || Object.isNumber(content)) return true;
        if (Object.isElement(content)) return true;
        if (content.toElement || content.toHTML) return true;

        return false;
    }

    function insertContentAt(element, content, position) {
        position = position.toLowerCase();
        var method = INSERTION_TRANSLATIONS[position];

        if (content && content.toElement) content = content.toElement();
        if (Object.isElement(content)) {
            method(element, content);
            return element;
        }

        content = Object.toHTML(content);
        var tagName = ((position === 'before' || position === 'after') ?
            element.parentNode : element).tagName.toUpperCase();

        var childNodes = getContentFromAnonymousElement(tagName, content.stripScripts());

        if (position === 'top' || position === 'after') childNodes.reverse();

        for (var i = 0, node; node = childNodes[i]; i++)
            method(element, node);

        content.evalScripts.bind(content).defer();
    }

    function insert(element, insertions) {
        element = $(element);

        if (isContent(insertions))
            insertions = {bottom: insertions};

        for (var position in insertions)
            insertContentAt(element, insertions[position], position);

        return element;
    }

    function wrap(element, wrapper, attributes) {
        element = $(element);

        if (Object.isElement(wrapper)) {
            $(wrapper).writeAttribute(attributes || {});
        } else if (Object.isString(wrapper)) {
            wrapper = new Element(wrapper, attributes);
        } else {
            wrapper = new Element('div', wrapper);
        }

        if (element.parentNode)
            element.parentNode.replaceChild(wrapper, element);

        wrapper.appendChild(element);

        return wrapper;
    }

    function cleanWhitespace(element) {
        element = $(element);
        var node = element.firstChild;

        while (node) {
            var nextNode = node.nextSibling;
            if (node.nodeType === Node.TEXT_NODE && !/\S/.test(node.nodeValue))
                element.removeChild(node);
            node = nextNode;
        }
        return element;
    }

    function empty(element) {
        return $(element).innerHTML.blank();
    }

    function getContentFromAnonymousElement(tagName, html, force) {
        var t = INSERTION_TRANSLATIONS.tags[tagName], div = DIV;

        var workaround = !!t;
        if (!workaround && force) {
            workaround = true;
            t = ['', '', 0];
        }

        if (workaround) {
            div.innerHTML = '&#160;' + t[0] + html + t[1];
            div.removeChild(div.firstChild);
            for (var i = t[2]; i--;)
                div = div.firstChild;
        } else {
            div.innerHTML = html;
        }

        return $A(div.childNodes);
    }

    function clone(element, deep) {
        if (!(element = $(element))) return;
        var clone = element.cloneNode(deep);
        if (!HAS_UNIQUE_ID_PROPERTY) {
            clone._prototypeUID = UNDEFINED;
            if (deep) {
                var descendants = Element.select(clone, '*'),
                    i = descendants.length;
                while (i--)
                    descendants[i]._prototypeUID = UNDEFINED;
            }
        }
        return Element.extend(clone);
    }

    function purgeElement(element) {
        var uid = getUniqueElementID(element);
        if (uid) {
            Element.stopObserving(element);
            if (!HAS_UNIQUE_ID_PROPERTY)
                element._prototypeUID = UNDEFINED;
            delete Element.Storage[uid];
        }
    }

    function purgeCollection(elements) {
        var i = elements.length;
        while (i--)
            purgeElement(elements[i]);
    }

    function purgeCollection_IE(elements) {
        var i = elements.length, element, uid;
        while (i--) {
            element = elements[i];
            uid = getUniqueElementID(element);
            delete Element.Storage[uid];
            delete Event.cache[uid];
        }
    }

    if (HAS_UNIQUE_ID_PROPERTY) {
        purgeCollection = purgeCollection_IE;
    }


    function purge(element) {
        if (!(element = $(element))) return;
        purgeElement(element);

        var descendants = element.getElementsByTagName('*'),
            i = descendants.length;

        while (i--) purgeElement(descendants[i]);

        return null;
    }

    Object.extend(methods, {
        remove: remove,
        update: update,
        replace: replace,
        insert: insert,
        wrap: wrap,
        cleanWhitespace: cleanWhitespace,
        empty: empty,
        clone: clone,
        purge: purge
    });


    function recursivelyCollect(element, property, maximumLength) {
        element = $(element);
        maximumLength = maximumLength || -1;
        var elements = [];

        while (element = element[property]) {
            if (element.nodeType === Node.ELEMENT_NODE)
                elements.push(Element.extend(element));

            if (elements.length === maximumLength) break;
        }

        return elements;
    }


    function ancestors(element) {
        return recursivelyCollect(element, 'parentNode');
    }

    function descendants(element) {
        return Element.select(element, '*');
    }

    function firstDescendant(element) {
        element = $(element).firstChild;
        while (element && element.nodeType !== Node.ELEMENT_NODE)
            element = element.nextSibling;

        return $(element);
    }

    function immediateDescendants(element) {
        var results = [], child = $(element).firstChild;

        while (child) {
            if (child.nodeType === Node.ELEMENT_NODE)
                results.push(Element.extend(child));

            child = child.nextSibling;
        }

        return results;
    }

    function previousSiblings(element) {
        return recursivelyCollect(element, 'previousSibling');
    }

    function nextSiblings(element) {
        return recursivelyCollect(element, 'nextSibling');
    }

    function siblings(element) {
        element = $(element);
        var previous = previousSiblings(element),
            next = nextSiblings(element);
        return previous.reverse().concat(next);
    }

    function match(element, selector) {
        element = $(element);

        if (Object.isString(selector))
            return Prototype.Selector.match(element, selector);

        return selector.match(element);
    }


    function _recursivelyFind(element, property, expression, index) {
        element = $(element), expression = expression || 0, index = index || 0;
        if (Object.isNumber(expression)) {
            index = expression, expression = null;
        }

        while (element = element[property]) {
            if (element.nodeType !== 1) continue;
            if (expression && !Prototype.Selector.match(element, expression))
                continue;
            if (--index >= 0) continue;

            return Element.extend(element);
        }
    }


    function up(element, expression, index) {
        element = $(element);

        if (arguments.length === 1) return $(element.parentNode);
        return _recursivelyFind(element, 'parentNode', expression, index);
    }

    function down(element, expression, index) {
        if (arguments.length === 1) return firstDescendant(element);
        element = $(element), expression = expression || 0, index = index || 0;

        if (Object.isNumber(expression))
            index = expression, expression = '*';

        var node = Prototype.Selector.select(expression, element)[index];
        return Element.extend(node);
    }

    function previous(element, expression, index) {
        return _recursivelyFind(element, 'previousSibling', expression, index);
    }

    function next(element, expression, index) {
        return _recursivelyFind(element, 'nextSibling', expression, index);
    }

    function select(element) {
        element = $(element);
        var expressions = SLICE.call(arguments, 1).join(', ');
        return Prototype.Selector.select(expressions, element);
    }

    function adjacent(element) {
        element = $(element);
        var expressions = SLICE.call(arguments, 1).join(', ');
        var siblings = Element.siblings(element), results = [];
        for (var i = 0, sibling; sibling = siblings[i]; i++) {
            if (Prototype.Selector.match(sibling, expressions))
                results.push(sibling);
        }

        return results;
    }

    function descendantOf_DOM(element, ancestor) {
        element = $(element), ancestor = $(ancestor);
        while (element = element.parentNode)
            if (element === ancestor) return true;
        return false;
    }

    function descendantOf_contains(element, ancestor) {
        element = $(element), ancestor = $(ancestor);
        if (!ancestor.contains) return descendantOf_DOM(element, ancestor);
        return ancestor.contains(element) && ancestor !== element;
    }

    function descendantOf_compareDocumentPosition(element, ancestor) {
        element = $(element), ancestor = $(ancestor);
        return (element.compareDocumentPosition(ancestor) & 8) === 8;
    }

    var descendantOf;
    if (DIV.compareDocumentPosition) {
        descendantOf = descendantOf_compareDocumentPosition;
    } else if (DIV.contains) {
        descendantOf = descendantOf_contains;
    } else {
        descendantOf = descendantOf_DOM;
    }


    Object.extend(methods, {
        recursivelyCollect: recursivelyCollect,
        ancestors: ancestors,
        descendants: descendants,
        firstDescendant: firstDescendant,
        immediateDescendants: immediateDescendants,
        previousSiblings: previousSiblings,
        nextSiblings: nextSiblings,
        siblings: siblings,
        match: match,
        up: up,
        down: down,
        previous: previous,
        next: next,
        select: select,
        adjacent: adjacent,
        descendantOf: descendantOf,

        getElementsBySelector: select,

        childElements: immediateDescendants
    });


    var idCounter = 1;

    function identify(element) {
        element = $(element);
        var id = Element.readAttribute(element, 'id');
        if (id) return id;

        do {
            id = 'anonymous_element_' + idCounter++
        } while ($(id));

        Element.writeAttribute(element, 'id', id);
        return id;
    }


    function readAttribute(element, name) {
        return $(element).getAttribute(name);
    }

    function readAttribute_IE(element, name) {
        element = $(element);

        var table = ATTRIBUTE_TRANSLATIONS.read;
        if (table.values[name])
            return table.values[name](element, name);

        if (table.names[name]) name = table.names[name];

        if (name.include(':')) {
            if (!element.attributes || !element.attributes[name]) return null;
            return element.attributes[name].value;
        }

        return element.getAttribute(name);
    }

    function readAttribute_Opera(element, name) {
        if (name === 'title') return element.title;
        return element.getAttribute(name);
    }

    var PROBLEMATIC_ATTRIBUTE_READING = (function () {
        DIV.setAttribute('onclick', []);
        var value = DIV.getAttribute('onclick');
        var isFunction = Object.isArray(value);
        DIV.removeAttribute('onclick');
        return isFunction;
    })();

    if (PROBLEMATIC_ATTRIBUTE_READING) {
        readAttribute = readAttribute_IE;
    } else if (Prototype.Browser.Opera) {
        readAttribute = readAttribute_Opera;
    }


    function writeAttribute(element, name, value) {
        element = $(element);
        var attributes = {}, table = ATTRIBUTE_TRANSLATIONS.write;

        if (typeof name === 'object') {
            attributes = name;
        } else {
            attributes[name] = Object.isUndefined(value) ? true : value;
        }

        for (var attr in attributes) {
            name = table.names[attr] || attr;
            value = attributes[attr];
            if (table.values[attr])
                name = table.values[attr](element, value) || name;
            if (value === false || value === null)
                element.removeAttribute(name);
            else if (value === true)
                element.setAttribute(name, name);
            else element.setAttribute(name, value);
        }

        return element;
    }

    var PROBLEMATIC_HAS_ATTRIBUTE_WITH_CHECKBOXES = (function () {
        if (!HAS_EXTENDED_CREATE_ELEMENT_SYNTAX) {
            return false;
        }
        var checkbox = document.createElement('<input type="checkbox">');
        checkbox.checked = true;
        var node = checkbox.getAttributeNode('checked');
        return !node || !node.specified;
    })();

    function hasAttribute(element, attribute) {
        attribute = ATTRIBUTE_TRANSLATIONS.has[attribute] || attribute;
        var node = $(element).getAttributeNode(attribute);
        return !!(node && node.specified);
    }

    function hasAttribute_IE(element, attribute) {
        if (attribute === 'checked') {
            return element.checked;
        }
        return hasAttribute(element, attribute);
    }

    GLOBAL.Element.Methods.Simulated.hasAttribute =
        PROBLEMATIC_HAS_ATTRIBUTE_WITH_CHECKBOXES ?
            hasAttribute_IE : hasAttribute;

    function classNames(element) {
        return new Element.ClassNames(element);
    }

    var regExpCache = {};

    function getRegExpForClassName(className) {
        if (regExpCache[className]) return regExpCache[className];

        var re = new RegExp("(^|\\s+)" + className + "(\\s+|$)");
        regExpCache[className] = re;
        return re;
    }

    function hasClassName(element, className) {
        if (!(element = $(element))) return;

        var elementClassName = element.className;

        if (elementClassName.length === 0) return false;
        if (elementClassName === className) return true;

        return getRegExpForClassName(className).test(elementClassName);
    }

    function addClassName(element, className) {
        if (!(element = $(element))) return;

        if (!hasClassName(element, className))
            element.className += (element.className ? ' ' : '') + className;

        return element;
    }

    function removeClassName(element, className) {
        if (!(element = $(element))) return;

        element.className = element.className.replace(
            getRegExpForClassName(className), ' ').strip();

        return element;
    }

    function toggleClassName(element, className, bool) {
        if (!(element = $(element))) return;

        if (Object.isUndefined(bool))
            bool = !hasClassName(element, className);

        var method = Element[bool ? 'addClassName' : 'removeClassName'];
        return method(element, className);
    }

    var ATTRIBUTE_TRANSLATIONS = {};

    var classProp = 'className', forProp = 'for';

    DIV.setAttribute(classProp, 'x');
    if (DIV.className !== 'x') {
        DIV.setAttribute('class', 'x');
        if (DIV.className === 'x')
            classProp = 'class';
    }

    var LABEL = document.createElement('label');
    LABEL.setAttribute(forProp, 'x');
    if (LABEL.htmlFor !== 'x') {
        LABEL.setAttribute('htmlFor', 'x');
        if (LABEL.htmlFor === 'x')
            forProp = 'htmlFor';
    }
    LABEL = null;

    function _getAttr(element, attribute) {
        return element.getAttribute(attribute);
    }

    function _getAttr2(element, attribute) {
        return element.getAttribute(attribute, 2);
    }

    function _getAttrNode(element, attribute) {
        var node = element.getAttributeNode(attribute);
        return node ? node.value : '';
    }

    function _getFlag(element, attribute) {
        return $(element).hasAttribute(attribute) ? attribute : null;
    }

    DIV.onclick = Prototype.emptyFunction;
    var onclickValue = DIV.getAttribute('onclick');

    var _getEv;

    if (String(onclickValue).indexOf('{') > -1) {
        _getEv = function (element, attribute) {
            var value = element.getAttribute(attribute);
            if (!value) return null;
            value = value.toString();
            value = value.split('{')[1];
            value = value.split('}')[0];
            return value.strip();
        };
    }
    else if (onclickValue === '') {
        _getEv = function (element, attribute) {
            var value = element.getAttribute(attribute);
            if (!value) return null;
            return value.strip();
        };
    }

    ATTRIBUTE_TRANSLATIONS.read = {
        names: {
            'class': classProp,
            'className': classProp,
            'for': forProp,
            'htmlFor': forProp
        },

        values: {
            style: function (element) {
                return element.style.cssText.toLowerCase();
            },
            title: function (element) {
                return element.title;
            }
        }
    };

    ATTRIBUTE_TRANSLATIONS.write = {
        names: {
            className: 'class',
            htmlFor: 'for',
            cellpadding: 'cellPadding',
            cellspacing: 'cellSpacing'
        },

        values: {
            checked: function (element, value) {
                element.checked = !!value;
            },

            style: function (element, value) {
                element.style.cssText = value ? value : '';
            }
        }
    };

    ATTRIBUTE_TRANSLATIONS.has = {names: {}};

    Object.extend(ATTRIBUTE_TRANSLATIONS.write.names,
        ATTRIBUTE_TRANSLATIONS.read.names);

    var CAMEL_CASED_ATTRIBUTE_NAMES = $w('colSpan rowSpan vAlign dateTime ' +
        'accessKey tabIndex encType maxLength readOnly longDesc frameBorder');

    for (var i = 0, attr; attr = CAMEL_CASED_ATTRIBUTE_NAMES[i]; i++) {
        ATTRIBUTE_TRANSLATIONS.write.names[attr.toLowerCase()] = attr;
        ATTRIBUTE_TRANSLATIONS.has.names[attr.toLowerCase()] = attr;
    }

    Object.extend(ATTRIBUTE_TRANSLATIONS.read.values, {
        href: _getAttr2,
        src: _getAttr2,
        type: _getAttr,
        action: _getAttrNode,
        disabled: _getFlag,
        checked: _getFlag,
        readonly: _getFlag,
        multiple: _getFlag,
        onload: _getEv,
        onunload: _getEv,
        onclick: _getEv,
        ondblclick: _getEv,
        onmousedown: _getEv,
        onmouseup: _getEv,
        onmouseover: _getEv,
        onmousemove: _getEv,
        onmouseout: _getEv,
        onfocus: _getEv,
        onblur: _getEv,
        onkeypress: _getEv,
        onkeydown: _getEv,
        onkeyup: _getEv,
        onsubmit: _getEv,
        onreset: _getEv,
        onselect: _getEv,
        onchange: _getEv
    });


    Object.extend(methods, {
        identify: identify,
        readAttribute: readAttribute,
        writeAttribute: writeAttribute,
        classNames: classNames,
        hasClassName: hasClassName,
        addClassName: addClassName,
        removeClassName: removeClassName,
        toggleClassName: toggleClassName
    });


    function normalizeStyleName(style) {
        if (style === 'float' || style === 'styleFloat')
            return 'cssFloat';
        return style.camelize();
    }

    function normalizeStyleName_IE(style) {
        if (style === 'float' || style === 'cssFloat')
            return 'styleFloat';
        return style.camelize();
    }

    function setStyle(element, styles) {
        element = $(element);
        var elementStyle = element.style, match;

        if (Object.isString(styles)) {
            elementStyle.cssText += ';' + styles;
            if (styles.include('opacity')) {
                var opacity = styles.match(/opacity:\s*(\d?\.?\d*)/)[1];
                Element.setOpacity(element, opacity);
            }
            return element;
        }

        for (var property in styles) {
            if (property === 'opacity') {
                Element.setOpacity(element, styles[property]);
            } else {
                var value = styles[property];
                if (property === 'float' || property === 'cssFloat') {
                    property = Object.isUndefined(elementStyle.styleFloat) ?
                        'cssFloat' : 'styleFloat';
                }
                elementStyle[property] = value;
            }
        }

        return element;
    }


    function getStyle(element, style) {
        element = $(element);
        style = normalizeStyleName(style);

        var value = element.style[style];
        if (!value || value === 'auto') {
            var css = document.defaultView.getComputedStyle(element, null);
            value = css ? css[style] : null;
        }

        if (style === 'opacity') return value ? parseFloat(value) : 1.0;
        return value === 'auto' ? null : value;
    }

    function getStyle_Opera(element, style) {
        switch (style) {
            case 'height':
            case 'width':
                if (!Element.visible(element)) return null;

                var dim = parseInt(getStyle(element, style), 10);

                if (dim !== element['offset' + style.capitalize()])
                    return dim + 'px';

                return Element.measure(element, style);

            default:
                return getStyle(element, style);
        }
    }

    function getStyle_IE(element, style) {
        element = $(element);
        style = normalizeStyleName_IE(style);

        var value = element.style[style];
        if (!value && element.currentStyle) {
            value = element.currentStyle[style];
        }

        if (style === 'opacity' && !STANDARD_CSS_OPACITY_SUPPORTED)
            return getOpacity_IE(element);

        if (value === 'auto') {
            if ((style === 'width' || style === 'height') && Element.visible(element))
                return Element.measure(element, style) + 'px';
            return null;
        }

        return value;
    }

    function stripAlphaFromFilter_IE(filter) {
        return (filter || '').replace(/alpha\([^\)]*\)/gi, '');
    }

    function hasLayout_IE(element) {
        if (!element.currentStyle || !element.currentStyle.hasLayout)
            element.style.zoom = 1;
        return element;
    }

    var STANDARD_CSS_OPACITY_SUPPORTED = (function () {
        DIV.style.cssText = "opacity:.55";
        return /^0.55/.test(DIV.style.opacity);
    })();

    function setOpacity(element, value) {
        element = $(element);
        if (value == 1 || value === '') value = '';
        else if (value < 0.00001) value = 0;
        element.style.opacity = value;
        return element;
    }

    function setOpacity_IE(element, value) {
        if (STANDARD_CSS_OPACITY_SUPPORTED)
            return setOpacity(element, value);

        element = hasLayout_IE($(element));
        var filter = Element.getStyle(element, 'filter'),
            style = element.style;

        if (value == 1 || value === '') {
            filter = stripAlphaFromFilter_IE(filter);
            if (filter) style.filter = filter;
            else style.removeAttribute('filter');
            return element;
        }

        if (value < 0.00001) value = 0;

        style.filter = stripAlphaFromFilter_IE(filter) +
            'alpha(opacity=' + (value * 100) + ')';

        return element;
    }


    function getOpacity(element) {
        return Element.getStyle(element, 'opacity');
    }

    function getOpacity_IE(element) {
        if (STANDARD_CSS_OPACITY_SUPPORTED)
            return getOpacity(element);

        var filter = Element.getStyle(element, 'filter');
        if (filter.length === 0) return 1.0;
        var match = (filter || '').match(/alpha\(opacity=(.*)\)/);
        if (match && match[1]) return parseFloat(match[1]) / 100;
        return 1.0;
    }


    Object.extend(methods, {
        setStyle: setStyle,
        getStyle: getStyle,
        setOpacity: setOpacity,
        getOpacity: getOpacity
    });

    if ('styleFloat' in DIV.style) {
        methods.getStyle = getStyle_IE;
        methods.setOpacity = setOpacity_IE;
        methods.getOpacity = getOpacity_IE;
    }

    var UID = 0;

    GLOBAL.Element.Storage = {UID: 1};

    function getUniqueElementID(element) {
        if (element === window) return 0;

        if (typeof element._prototypeUID === 'undefined')
            element._prototypeUID = Element.Storage.UID++;
        return element._prototypeUID;
    }

    function getUniqueElementID_IE(element) {
        if (element === window) return 0;
        if (element == document) return 1;
        return element.uniqueID;
    }

    var HAS_UNIQUE_ID_PROPERTY = ('uniqueID' in DIV);
    if (HAS_UNIQUE_ID_PROPERTY)
        getUniqueElementID = getUniqueElementID_IE;

    function getStorage(element) {
        if (!(element = $(element))) return;

        var uid = getUniqueElementID(element);

        if (!Element.Storage[uid])
            Element.Storage[uid] = $H();

        return Element.Storage[uid];
    }

    function store(element, key, value) {
        if (!(element = $(element))) return;
        var storage = getStorage(element);
        if (arguments.length === 2) {
            storage.update(key);
        } else {
            storage.set(key, value);
        }
        return element;
    }

    function retrieve(element, key, defaultValue) {
        if (!(element = $(element))) return;
        var storage = getStorage(element), value = storage.get(key);

        if (Object.isUndefined(value)) {
            storage.set(key, defaultValue);
            value = defaultValue;
        }

        return value;
    }


    Object.extend(methods, {
        getStorage: getStorage,
        store: store,
        retrieve: retrieve
    });


    var Methods = {}, ByTag = Element.Methods.ByTag,
        F = Prototype.BrowserFeatures;

    if (!F.ElementExtensions && ('__proto__' in DIV)) {
        GLOBAL.HTMLElement = {};
        GLOBAL.HTMLElement.prototype = DIV['__proto__'];
        F.ElementExtensions = true;
    }

    function checkElementPrototypeDeficiency(tagName) {
        if (typeof window.Element === 'undefined') return false;
        if (!HAS_EXTENDED_CREATE_ELEMENT_SYNTAX) return false;
        var proto = window.Element.prototype;
        if (proto) {
            var id = '_' + (Math.random() + '').slice(2),
                el = document.createElement(tagName);
            proto[id] = 'x';
            var isBuggy = (el[id] !== 'x');
            delete proto[id];
            el = null;
            return isBuggy;
        }

        return false;
    }

    var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY =
        checkElementPrototypeDeficiency('object');

    function extendElementWith(element, methods) {
        for (var property in methods) {
            var value = methods[property];
            if (Object.isFunction(value) && !(property in element))
                element[property] = value.methodize();
        }
    }

    var EXTENDED = {};

    function elementIsExtended(element) {
        var uid = getUniqueElementID(element);
        return (uid in EXTENDED);
    }

    function extend(element) {
        if (!element || elementIsExtended(element)) return element;
        if (element.nodeType !== Node.ELEMENT_NODE || element == window)
            return element;

        var methods = Object.clone(Methods),
            tagName = element.tagName.toUpperCase();

        if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);

        extendElementWith(element, methods);
        EXTENDED[getUniqueElementID(element)] = true;
        return element;
    }

    function extend_IE8(element) {
        if (!element || elementIsExtended(element)) return element;

        var t = element.tagName;
        if (t && (/^(?:object|applet|embed)$/i.test(t))) {
            extendElementWith(element, Element.Methods);
            extendElementWith(element, Element.Methods.Simulated);
            extendElementWith(element, Element.Methods.ByTag[t.toUpperCase()]);
        }

        return element;
    }

    if (F.SpecificElementExtensions) {
        extend = HTMLOBJECTELEMENT_PROTOTYPE_BUGGY ? extend_IE8 : Prototype.K;
    }

    function addMethodsToTagName(tagName, methods) {
        tagName = tagName.toUpperCase();
        if (!ByTag[tagName]) ByTag[tagName] = {};
        Object.extend(ByTag[tagName], methods);
    }

    function mergeMethods(destination, methods, onlyIfAbsent) {
        if (Object.isUndefined(onlyIfAbsent)) onlyIfAbsent = false;
        for (var property in methods) {
            var value = methods[property];
            if (!Object.isFunction(value)) continue;
            if (!onlyIfAbsent || !(property in destination))
                destination[property] = value.methodize();
        }
    }

    function findDOMClass(tagName) {
        var klass;
        var trans = {
            "OPTGROUP": "OptGroup",
            "TEXTAREA": "TextArea",
            "P": "Paragraph",
            "FIELDSET": "FieldSet",
            "UL": "UList",
            "OL": "OList",
            "DL": "DList",
            "DIR": "Directory",
            "H1": "Heading",
            "H2": "Heading",
            "H3": "Heading",
            "H4": "Heading",
            "H5": "Heading",
            "H6": "Heading",
            "Q": "Quote",
            "INS": "Mod",
            "DEL": "Mod",
            "A": "Anchor",
            "IMG": "Image",
            "CAPTION": "TableCaption",
            "COL": "TableCol",
            "COLGROUP": "TableCol",
            "THEAD": "TableSection",
            "TFOOT": "TableSection",
            "TBODY": "TableSection",
            "TR": "TableRow",
            "TH": "TableCell",
            "TD": "TableCell",
            "FRAMESET": "FrameSet",
            "IFRAME": "IFrame"
        };
        if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
        if (window[klass]) return window[klass];
        klass = 'HTML' + tagName + 'Element';
        if (window[klass]) return window[klass];
        klass = 'HTML' + tagName.capitalize() + 'Element';
        if (window[klass]) return window[klass];

        var element = document.createElement(tagName),
            proto = element['__proto__'] || element.constructor.prototype;

        element = null;
        return proto;
    }

    /**
     *  Element.addMethods(methods) -> undefined
     *  Element.addMethods(tagName, methods) -> undefined
     *  - tagName (String): (Optional) The name of the HTML tag for which the
     *    methods should be available; if not given, all HTML elements will have
     *    the new methods.
     *  - methods (Object): A hash of methods to add.
     *
     *  [[Element.addMethods]] makes it possible to mix your *own* methods into the
     *  [[Element]] object and extended element instances (all of them, or only ones
     *  with the given HTML tag if you specify `tagName`).
     *
     *  You define the methods in a hash that you provide to [[Element.addMethods]].
     *  Here's an example adding two methods:
     *
     *      Element.addMethods({
   *
   *        // myOwnMethod: Do something cool with the element
   *        myOwnMethod: function(element) {
   *          if (!(element = $(element))) return;
   *          // ...do smething with 'element'...
   *          return element;
   *        },
   *
   *        // wrap: Wrap the element in a new element using the given tag
   *        wrap: function(element, tagName) {
   *          var wrapper;
   *          if (!(element = $(element))) return;
   *          wrapper = new Element(tagName);
   *          element.parentNode.replaceChild(wrapper, element);
   *          wrapper.appendChild(element);
   *          return wrapper;
   *        }
   *
   *      });
     *
     *  Once added, those can be used either via [[Element]]:
     *
     *      // Wrap the element with the ID 'foo' in a div
     *      Element.wrap('foo', 'div');
     *
     *  ...or as instance methods of extended elements:
     *
     *      // Wrap the element with the ID 'foo' in a div
     *      $('foo').wrap('div');
     *
     *  Note the following requirements and conventions for methods added to
     *  [[Element]]:
     *
     *  - The first argument is *always* an element or ID, by convention this
     *    argument is called `element`.
     *  - The method passes the `element` argument through [[$]] and typically
     *    returns if the result is undefined.
     *  - Barring a good reason to return something else, the method returns the
     *    extended element to enable chaining.
     *
     *  Our `myOwnMethod` method above returns the element because it doesn't have
     *  a good reason to return anything else. Our `wrap` method returns the
     *  wrapper, because that makes more sense for that method.
     *
     *  ##### Extending only specific elements
     *
     *  If you call [[Element.addMethods]] with *two* arguments, it will apply the
     *  methods only to elements with the given HTML tag:
     *
     *      Element.addMethods('DIV', my_div_methods);
     *      // the given methods are now available on DIV elements, but not others
     *
     *  You can also pass an *[[Array]]* of tag names as the first argument:
     *
     *      Element.addMethods(['DIV', 'SPAN'], my_additional_methods);
     *      // DIV and SPAN now both have the given methods
     *
     *  (Tag names in the first argument are not case sensitive.)
     *
     *  Note: [[Element.addMethods]] has built-in security which prevents you from
     *  overriding native element methods or properties (like `getAttribute` or
     *  `innerHTML`), but nothing prevents you from overriding one of Prototype's
     *  methods. Prototype uses a lot of its methods internally; overriding its
     *  methods is best avoided or at least done only with great care.
     *
     *  ##### Example 1
     *
     *  Our `wrap` method earlier was a complete example. For instance, given this
     *  paragraph:
     *
     *      language: html
     *      <p id="first">Some content...</p>
     *
     *  ...we might wrap it in a `div`:
     *
     *      $('first').wrap('div');
     *
     *  ...or perhaps wrap it and apply some style to the `div` as well:
     *
     *      $('first').wrap('div').setStyle({
   *        backgroundImage: 'url(images/rounded-corner-top-left.png) top left'
   *      });
     *
     *  ##### Example 2
     *
     *  We can add a method to elements that makes it a bit easier to update them
     *  via [[Ajax.Updater]]:
     *
     *      Element.addMethods({
   *        ajaxUpdate: function(element, url, options) {
   *          if (!(element = $(element))) return;
   *          element.update('<img src="/images/spinner.gif" alt="Loading...">');
   *          options = options || {};
   *          options.onFailure = options.onFailure || defaultFailureHandler.curry(element);
   *          new Ajax.Updater(element, url, options);
   *          return element;
   *        }
   *      });
     *
     *  Now we can update an element via an Ajax call much more concisely than
     *  before:
     *
     *      $('foo').ajaxUpdate('/new/content');
     *
     *  That will use [[Ajax.Updater]] to load new content into the 'foo' element,
     *  showing a spinner while the call is in progress. It even applies a default
     *  failure handler (since we didn't supply one).
     **/
    function addMethods(methods) {
        if (arguments.length === 0) addFormMethods();

        if (arguments.length === 2) {
            var tagName = methods;
            methods = arguments[1];
        }

        if (!tagName) {
            Object.extend(Element.Methods, methods || {});
        } else {
            if (Object.isArray(tagName)) {
                for (var i = 0, tag; tag = tagName[i]; i++)
                    addMethodsToTagName(tag, methods);
            } else {
                addMethodsToTagName(tagName, methods);
            }
        }

        var ELEMENT_PROTOTYPE = window.HTMLElement ? HTMLElement.prototype :
            Element.prototype;

        if (F.ElementExtensions) {
            mergeMethods(ELEMENT_PROTOTYPE, Element.Methods);
            mergeMethods(ELEMENT_PROTOTYPE, Element.Methods.Simulated, true);
        }

        if (F.SpecificElementExtensions) {
            for (var tag in Element.Methods.ByTag) {
                var klass = findDOMClass(tag);
                if (Object.isUndefined(klass)) continue;
                mergeMethods(klass.prototype, ByTag[tag]);
            }
        }

        Object.extend(Element, Element.Methods);
        Object.extend(Element, Element.Methods.Simulated);
        delete Element.ByTag;
        delete Element.Simulated;

        Element.extend.refresh();

        ELEMENT_CACHE = {};
    }

    Object.extend(GLOBAL.Element, {
        extend: extend,
        addMethods: addMethods
    });

    if (extend === Prototype.K) {
        GLOBAL.Element.extend.refresh = Prototype.emptyFunction;
    } else {
        GLOBAL.Element.extend.refresh = function () {
            if (Prototype.BrowserFeatures.ElementExtensions) return;
            Object.extend(Methods, Element.Methods);
            Object.extend(Methods, Element.Methods.Simulated);

            EXTENDED = {};
        };
    }

    function addFormMethods() {
        Object.extend(Form, Form.Methods);
        Object.extend(Form.Element, Form.Element.Methods);
        Object.extend(Element.Methods.ByTag, {
            "FORM": Object.clone(Form.Methods),
            "INPUT": Object.clone(Form.Element.Methods),
            "SELECT": Object.clone(Form.Element.Methods),
            "TEXTAREA": Object.clone(Form.Element.Methods),
            "BUTTON": Object.clone(Form.Element.Methods)
        });
    }

    Element.addMethods(methods);

    function destroyCache_IE() {
        DIV = null;
        ELEMENT_CACHE = null;
    }

    if (window.attachEvent)
        window.attachEvent('onunload', destroyCache_IE);

})(this);
(function () {

    function toDecimal(pctString) {
        var match = pctString.match(/^(\d+)%?$/i);
        if (!match) return null;
        return (Number(match[1]) / 100);
    }

    function getRawStyle(element, style) {
        element = $(element);

        var value = element.style[style];
        if (!value || value === 'auto') {
            var css = document.defaultView.getComputedStyle(element, null);
            value = css ? css[style] : null;
        }

        if (style === 'opacity') return value ? parseFloat(value) : 1.0;
        return value === 'auto' ? null : value;
    }

    function getRawStyle_IE(element, style) {
        var value = element.style[style];
        if (!value && element.currentStyle) {
            value = element.currentStyle[style];
        }
        return value;
    }

    function getContentWidth(element, context) {
        var boxWidth = element.offsetWidth;

        var bl = getPixelValue(element, 'borderLeftWidth', context) || 0;
        var br = getPixelValue(element, 'borderRightWidth', context) || 0;
        var pl = getPixelValue(element, 'paddingLeft', context) || 0;
        var pr = getPixelValue(element, 'paddingRight', context) || 0;

        return boxWidth - bl - br - pl - pr;
    }

    if ('currentStyle' in document.documentElement) {
        getRawStyle = getRawStyle_IE;
    }


    function getPixelValue(value, property, context) {
        var element = null;
        if (Object.isElement(value)) {
            element = value;
            value = getRawStyle(element, property);
        }

        if (value === null || Object.isUndefined(value)) {
            return null;
        }

        if ((/^(?:-)?\d+(\.\d+)?(px)?$/i).test(value)) {
            return window.parseFloat(value);
        }

        var isPercentage = value.include('%'), isViewport = (context === document.viewport);

        if (/\d/.test(value) && element && element.runtimeStyle && !(isPercentage && isViewport)) {
            var style = element.style.left, rStyle = element.runtimeStyle.left;
            element.runtimeStyle.left = element.currentStyle.left;
            element.style.left = value || 0;
            value = element.style.pixelLeft;
            element.style.left = style;
            element.runtimeStyle.left = rStyle;

            return value;
        }

        if (element && isPercentage) {
            context = context || element.parentNode;
            var decimal = toDecimal(value), whole = null;

            var isHorizontal = property.include('left') || property.include('right') ||
                property.include('width');

            var isVertical = property.include('top') || property.include('bottom') ||
                property.include('height');

            if (context === document.viewport) {
                if (isHorizontal) {
                    whole = document.viewport.getWidth();
                } else if (isVertical) {
                    whole = document.viewport.getHeight();
                }
            } else {
                if (isHorizontal) {
                    whole = $(context).measure('width');
                } else if (isVertical) {
                    whole = $(context).measure('height');
                }
            }

            return (whole === null) ? 0 : whole * decimal;
        }

        return 0;
    }

    function toCSSPixels(number) {
        if (Object.isString(number) && number.endsWith('px'))
            return number;
        return number + 'px';
    }

    function isDisplayed(element) {
        while (element && element.parentNode) {
            var display = element.getStyle('display');
            if (display === 'none') {
                return false;
            }
            element = $(element.parentNode);
        }
        return true;
    }

    var hasLayout = Prototype.K;
    if ('currentStyle' in document.documentElement) {
        hasLayout = function (element) {
            if (!element.currentStyle.hasLayout) {
                element.style.zoom = 1;
            }
            return element;
        };
    }

    function cssNameFor(key) {
        if (key.include('border')) key = key + '-width';
        return key.camelize();
    }

    Element.Layout = Class.create(Hash, {
        initialize: function ($super, element, preCompute) {
            $super();
            this.element = $(element);

            Element.Layout.PROPERTIES.each(function (property) {
                this._set(property, null);
            }, this);

            if (preCompute) {
                this._preComputing = true;
                this._begin();
                Element.Layout.PROPERTIES.each(this._compute, this);
                this._end();
                this._preComputing = false;
            }
        },

        _set: function (property, value) {
            return Hash.prototype.set.call(this, property, value);
        },

        set: function (property, value) {
            throw "Properties of Element.Layout are read-only.";
        },

        get: function ($super, property) {
            var value = $super(property);
            return value === null ? this._compute(property) : value;
        },

        _begin: function () {
            if (this._isPrepared()) return;

            var element = this.element;
            if (isDisplayed(element)) {
                this._setPrepared(true);
                return;
            }


            var originalStyles = {
                position: element.style.position || '',
                width: element.style.width || '',
                visibility: element.style.visibility || '',
                display: element.style.display || ''
            };

            element.store('prototype_original_styles', originalStyles);

            var position = getRawStyle(element, 'position'), width = element.offsetWidth;

            if (width === 0 || width === null) {
                element.style.display = 'block';
                width = element.offsetWidth;
            }

            var context = (position === 'fixed') ? document.viewport :
                element.parentNode;

            var tempStyles = {
                visibility: 'hidden',
                display: 'block'
            };

            if (position !== 'fixed') tempStyles.position = 'absolute';

            element.setStyle(tempStyles);

            var positionedWidth = element.offsetWidth, newWidth;
            if (width && (positionedWidth === width)) {
                newWidth = getContentWidth(element, context);
            } else if (position === 'absolute' || position === 'fixed') {
                newWidth = getContentWidth(element, context);
            } else {
                var parent = element.parentNode, pLayout = $(parent).getLayout();

                newWidth = pLayout.get('width') -
                    this.get('margin-left') -
                    this.get('border-left') -
                    this.get('padding-left') -
                    this.get('padding-right') -
                    this.get('border-right') -
                    this.get('margin-right');
            }

            element.setStyle({width: newWidth + 'px'});

            this._setPrepared(true);
        },

        _end: function () {
            var element = this.element;
            var originalStyles = element.retrieve('prototype_original_styles');
            element.store('prototype_original_styles', null);
            element.setStyle(originalStyles);
            this._setPrepared(false);
        },

        _compute: function (property) {
            var COMPUTATIONS = Element.Layout.COMPUTATIONS;
            if (!(property in COMPUTATIONS)) {
                throw "Property not found.";
            }

            return this._set(property, COMPUTATIONS[property].call(this, this.element));
        },

        _isPrepared: function () {
            return this.element.retrieve('prototype_element_layout_prepared', false);
        },

        _setPrepared: function (bool) {
            return this.element.store('prototype_element_layout_prepared', bool);
        },

        toObject: function () {
            var args = $A(arguments);
            var keys = (args.length === 0) ? Element.Layout.PROPERTIES :
                args.join(' ').split(' ');
            var obj = {};
            keys.each(function (key) {
                if (!Element.Layout.PROPERTIES.include(key)) return;
                var value = this.get(key);
                if (value != null) obj[key] = value;
            }, this);
            return obj;
        },

        toHash: function () {
            var obj = this.toObject.apply(this, arguments);
            return new Hash(obj);
        },

        toCSS: function () {
            var args = $A(arguments);
            var keys = (args.length === 0) ? Element.Layout.PROPERTIES :
                args.join(' ').split(' ');
            var css = {};

            keys.each(function (key) {
                if (!Element.Layout.PROPERTIES.include(key)) return;
                if (Element.Layout.COMPOSITE_PROPERTIES.include(key)) return;

                var value = this.get(key);
                if (value != null) css[cssNameFor(key)] = value + 'px';
            }, this);
            return css;
        },

        inspect: function () {
            return "#<Element.Layout>";
        }
    });

    Object.extend(Element.Layout, {
        PROPERTIES: $w('height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height'),

        COMPOSITE_PROPERTIES: $w('padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height'),

        COMPUTATIONS: {
            'height': function (element) {
                if (!this._preComputing) this._begin();

                var bHeight = this.get('border-box-height');
                if (bHeight <= 0) {
                    if (!this._preComputing) this._end();
                    return 0;
                }

                var bTop = this.get('border-top'),
                    bBottom = this.get('border-bottom');

                var pTop = this.get('padding-top'),
                    pBottom = this.get('padding-bottom');

                if (!this._preComputing) this._end();

                return bHeight - bTop - bBottom - pTop - pBottom;
            },

            'width': function (element) {
                if (!this._preComputing) this._begin();

                var bWidth = this.get('border-box-width');
                if (bWidth <= 0) {
                    if (!this._preComputing) this._end();
                    return 0;
                }

                var bLeft = this.get('border-left'),
                    bRight = this.get('border-right');

                var pLeft = this.get('padding-left'),
                    pRight = this.get('padding-right');

                if (!this._preComputing) this._end();
                return bWidth - bLeft - bRight - pLeft - pRight;
            },

            'padding-box-height': function (element) {
                var height = this.get('height'),
                    pTop = this.get('padding-top'),
                    pBottom = this.get('padding-bottom');

                return height + pTop + pBottom;
            },

            'padding-box-width': function (element) {
                var width = this.get('width'),
                    pLeft = this.get('padding-left'),
                    pRight = this.get('padding-right');

                return width + pLeft + pRight;
            },

            'border-box-height': function (element) {
                if (!this._preComputing) this._begin();
                var height = element.offsetHeight;
                if (!this._preComputing) this._end();
                return height;
            },

            'border-box-width': function (element) {
                if (!this._preComputing) this._begin();
                var width = element.offsetWidth;
                if (!this._preComputing) this._end();
                return width;
            },

            'margin-box-height': function (element) {
                var bHeight = this.get('border-box-height'),
                    mTop = this.get('margin-top'),
                    mBottom = this.get('margin-bottom');

                if (bHeight <= 0) return 0;

                return bHeight + mTop + mBottom;
            },

            'margin-box-width': function (element) {
                var bWidth = this.get('border-box-width'),
                    mLeft = this.get('margin-left'),
                    mRight = this.get('margin-right');

                if (bWidth <= 0) return 0;

                return bWidth + mLeft + mRight;
            },

            'top': function (element) {
                var offset = element.positionedOffset();
                return offset.top;
            },

            'bottom': function (element) {
                var offset = element.positionedOffset(),
                    parent = element.getOffsetParent(),
                    pHeight = parent.measure('height');

                var mHeight = this.get('border-box-height');

                return pHeight - mHeight - offset.top;
            },

            'left': function (element) {
                var offset = element.positionedOffset();
                return offset.left;
            },

            'right': function (element) {
                var offset = element.positionedOffset(),
                    parent = element.getOffsetParent(),
                    pWidth = parent.measure('width');

                var mWidth = this.get('border-box-width');

                return pWidth - mWidth - offset.left;
            },

            'padding-top': function (element) {
                return getPixelValue(element, 'paddingTop');
            },

            'padding-bottom': function (element) {
                return getPixelValue(element, 'paddingBottom');
            },

            'padding-left': function (element) {
                return getPixelValue(element, 'paddingLeft');
            },

            'padding-right': function (element) {
                return getPixelValue(element, 'paddingRight');
            },

            'border-top': function (element) {
                return getPixelValue(element, 'borderTopWidth');
            },

            'border-bottom': function (element) {
                return getPixelValue(element, 'borderBottomWidth');
            },

            'border-left': function (element) {
                return getPixelValue(element, 'borderLeftWidth');
            },

            'border-right': function (element) {
                return getPixelValue(element, 'borderRightWidth');
            },

            'margin-top': function (element) {
                return getPixelValue(element, 'marginTop');
            },

            'margin-bottom': function (element) {
                return getPixelValue(element, 'marginBottom');
            },

            'margin-left': function (element) {
                return getPixelValue(element, 'marginLeft');
            },

            'margin-right': function (element) {
                return getPixelValue(element, 'marginRight');
            }
        }
    });

    if ('getBoundingClientRect' in document.documentElement) {
        Object.extend(Element.Layout.COMPUTATIONS, {
            'right': function (element) {
                var parent = hasLayout(element.getOffsetParent());
                var rect = element.getBoundingClientRect(),
                    pRect = parent.getBoundingClientRect();

                return (pRect.right - rect.right).round();
            },

            'bottom': function (element) {
                var parent = hasLayout(element.getOffsetParent());
                var rect = element.getBoundingClientRect(),
                    pRect = parent.getBoundingClientRect();

                return (pRect.bottom - rect.bottom).round();
            }
        });
    }

    Element.Offset = Class.create({
        initialize: function (left, top) {
            this.left = left.round();
            this.top = top.round();

            this[0] = this.left;
            this[1] = this.top;
        },

        relativeTo: function (offset) {
            return new Element.Offset(
                this.left - offset.left,
                this.top - offset.top
            );
        },

        inspect: function () {
            return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this);
        },

        toString: function () {
            return "[#{left}, #{top}]".interpolate(this);
        },

        toArray: function () {
            return [this.left, this.top];
        }
    });

    function getLayout(element, preCompute) {
        return new Element.Layout(element, preCompute);
    }

    function measure(element, property) {
        return $(element).getLayout().get(property);
    }

    function getHeight(element) {
        return Element.getDimensions(element).height;
    }

    function getWidth(element) {
        return Element.getDimensions(element).width;
    }

    function getDimensions(element) {
        element = $(element);
        var display = Element.getStyle(element, 'display');

        if (display && display !== 'none') {
            return {width: element.offsetWidth, height: element.offsetHeight};
        }

        var style = element.style;
        var originalStyles = {
            visibility: style.visibility,
            position: style.position,
            display: style.display
        };

        var newStyles = {
            visibility: 'hidden',
            display: 'block'
        };

        if (originalStyles.position !== 'fixed')
            newStyles.position = 'absolute';

        Element.setStyle(element, newStyles);

        var dimensions = {
            width: element.offsetWidth,
            height: element.offsetHeight
        };

        Element.setStyle(element, originalStyles);

        return dimensions;
    }

    function getOffsetParent(element) {
        element = $(element);

        if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
            return $(document.body);

        var isInline = (Element.getStyle(element, 'display') === 'inline');
        if (!isInline && element.offsetParent) return $(element.offsetParent);

        while ((element = element.parentNode) && element !== document.body) {
            if (Element.getStyle(element, 'position') !== 'static') {
                return isHtml(element) ? $(document.body) : $(element);
            }
        }

        return $(document.body);
    }


    function cumulativeOffset(element) {
        element = $(element);
        var valueT = 0, valueL = 0;
        if (element.parentNode) {
            do {
                valueT += element.offsetTop || 0;
                valueL += element.offsetLeft || 0;
                element = element.offsetParent;
            } while (element);
        }
        return new Element.Offset(valueL, valueT);
    }

    function positionedOffset(element) {
        element = $(element);

        var layout = element.getLayout();

        var valueT = 0, valueL = 0;
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            element = element.offsetParent;
            if (element) {
                if (isBody(element)) break;
                var p = Element.getStyle(element, 'position');
                if (p !== 'static') break;
            }
        } while (element);

        valueL -= layout.get('margin-top');
        valueT -= layout.get('margin-left');

        return new Element.Offset(valueL, valueT);
    }

    function cumulativeScrollOffset(element) {
        var valueT = 0, valueL = 0;
        do {
            if (element === document.body) {
                var bodyScrollNode = document.documentElement || document.body.parentNode || document.body;
                valueT += !Object.isUndefined(window.pageYOffset) ? window.pageYOffset : bodyScrollNode.scrollTop || 0;
                valueL += !Object.isUndefined(window.pageXOffset) ? window.pageXOffset : bodyScrollNode.scrollLeft || 0;
                break;
            } else {
                valueT += element.scrollTop || 0;
                valueL += element.scrollLeft || 0;
                element = element.parentNode;
            }
        } while (element);
        return new Element.Offset(valueL, valueT);
    }

    function viewportOffset(forElement) {
        var valueT = 0, valueL = 0, docBody = document.body;

        forElement = $(forElement);
        var element = forElement;
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            if (element.offsetParent == docBody &&
                Element.getStyle(element, 'position') == 'absolute') break;
        } while (element = element.offsetParent);

        element = forElement;
        do {
            if (element != docBody) {
                valueT -= element.scrollTop || 0;
                valueL -= element.scrollLeft || 0;
            }
        } while (element = element.parentNode);
        return new Element.Offset(valueL, valueT);
    }

    function absolutize(element) {
        element = $(element);

        if (Element.getStyle(element, 'position') === 'absolute') {
            return element;
        }

        var offsetParent = getOffsetParent(element);
        var eOffset = element.viewportOffset(),
            pOffset = offsetParent.viewportOffset();

        var offset = eOffset.relativeTo(pOffset);
        var layout = element.getLayout();

        element.store('prototype_absolutize_original_styles', {
            position: element.getStyle('position'),
            left: element.getStyle('left'),
            top: element.getStyle('top'),
            width: element.getStyle('width'),
            height: element.getStyle('height')
        });

        element.setStyle({
            position: 'absolute',
            top: offset.top + 'px',
            left: offset.left + 'px',
            width: layout.get('width') + 'px',
            height: layout.get('height') + 'px'
        });

        return element;
    }

    function relativize(element) {
        element = $(element);
        if (Element.getStyle(element, 'position') === 'relative') {
            return element;
        }

        var originalStyles =
            element.retrieve('prototype_absolutize_original_styles');

        if (originalStyles) element.setStyle(originalStyles);
        return element;
    }


    function scrollTo(element) {
        element = $(element);
        var pos = Element.cumulativeOffset(element);
        window.scrollTo(pos.left, pos.top);
        return element;
    }


    function makePositioned(element) {
        element = $(element);
        var position = Element.getStyle(element, 'position'), styles = {};
        if (position === 'static' || !position) {
            styles.position = 'relative';
            if (Prototype.Browser.Opera) {
                styles.top = 0;
                styles.left = 0;
            }
            Element.setStyle(element, styles);
            Element.store(element, 'prototype_made_positioned', true);
        }
        return element;
    }

    function undoPositioned(element) {
        element = $(element);
        var storage = Element.getStorage(element),
            madePositioned = storage.get('prototype_made_positioned');

        if (madePositioned) {
            storage.unset('prototype_made_positioned');
            Element.setStyle(element, {
                position: '',
                top: '',
                bottom: '',
                left: '',
                right: ''
            });
        }
        return element;
    }

    function makeClipping(element) {
        element = $(element);

        var storage = Element.getStorage(element),
            madeClipping = storage.get('prototype_made_clipping');

        if (Object.isUndefined(madeClipping)) {
            var overflow = Element.getStyle(element, 'overflow');
            storage.set('prototype_made_clipping', overflow);
            if (overflow !== 'hidden')
                element.style.overflow = 'hidden';
        }

        return element;
    }

    function undoClipping(element) {
        element = $(element);
        var storage = Element.getStorage(element),
            overflow = storage.get('prototype_made_clipping');

        if (!Object.isUndefined(overflow)) {
            storage.unset('prototype_made_clipping');
            element.style.overflow = overflow || '';
        }

        return element;
    }

    function clonePosition(element, source, options) {
        options = Object.extend({
            setLeft: true,
            setTop: true,
            setWidth: true,
            setHeight: true,
            offsetTop: 0,
            offsetLeft: 0
        }, options || {});

        source = $(source);
        element = $(element);
        var p, delta, layout, styles = {};

        if (options.setLeft || options.setTop) {
            p = Element.viewportOffset(source);
            delta = [0, 0];
            if (Element.getStyle(element, 'position') === 'absolute') {
                var parent = Element.getOffsetParent(element);
                if (parent !== document.body) delta = Element.viewportOffset(parent);
            }
        }

        if (options.setWidth || options.setHeight) {
            layout = Element.getLayout(source);
        }

        if (options.setLeft)
            styles.left = (p[0] - delta[0] + options.offsetLeft) + 'px';
        if (options.setTop)
            styles.top = (p[1] - delta[1] + options.offsetTop) + 'px';

        if (options.setWidth)
            styles.width = layout.get('border-box-width') + 'px';
        if (options.setHeight)
            styles.height = layout.get('border-box-height') + 'px';

        return Element.setStyle(element, styles);
    }


    if (Prototype.Browser.IE) {
        getOffsetParent = getOffsetParent.wrap(
            function (proceed, element) {
                element = $(element);

                if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
                    return $(document.body);

                var position = element.getStyle('position');
                if (position !== 'static') return proceed(element);

                element.setStyle({position: 'relative'});
                var value = proceed(element);
                element.setStyle({position: position});
                return value;
            }
        );

        positionedOffset = positionedOffset.wrap(function (proceed, element) {
            element = $(element);
            if (!element.parentNode) return new Element.Offset(0, 0);
            var position = element.getStyle('position');
            if (position !== 'static') return proceed(element);

            var offsetParent = element.getOffsetParent();
            if (offsetParent && offsetParent.getStyle('position') === 'fixed')
                hasLayout(offsetParent);

            element.setStyle({position: 'relative'});
            var value = proceed(element);
            element.setStyle({position: position});
            return value;
        });
    } else if (Prototype.Browser.Webkit) {
        cumulativeOffset = function (element) {
            element = $(element);
            var valueT = 0, valueL = 0;
            do {
                valueT += element.offsetTop || 0;
                valueL += element.offsetLeft || 0;
                if (element.offsetParent == document.body) {
                    if (Element.getStyle(element, 'position') == 'absolute') break;
                }

                element = element.offsetParent;
            } while (element);

            return new Element.Offset(valueL, valueT);
        };
    }


    Element.addMethods({
        getLayout: getLayout,
        measure: measure,
        getWidth: getWidth,
        getHeight: getHeight,
        getDimensions: getDimensions,
        getOffsetParent: getOffsetParent,
        cumulativeOffset: cumulativeOffset,
        positionedOffset: positionedOffset,
        cumulativeScrollOffset: cumulativeScrollOffset,
        viewportOffset: viewportOffset,
        absolutize: absolutize,
        relativize: relativize,
        scrollTo: scrollTo,
        makePositioned: makePositioned,
        undoPositioned: undoPositioned,
        makeClipping: makeClipping,
        undoClipping: undoClipping,
        clonePosition: clonePosition
    });

    function isBody(element) {
        return element.nodeName.toUpperCase() === 'BODY';
    }

    function isHtml(element) {
        return element.nodeName.toUpperCase() === 'HTML';
    }

    function isDocument(element) {
        return element.nodeType === Node.DOCUMENT_NODE;
    }

    function isDetached(element) {
        return element !== document.body && !Element.descendantOf(element, document.body);
    }

    if ('getBoundingClientRect' in document.documentElement) {
        Element.addMethods({
            viewportOffset: function (element) {
                element = $(element);
                if (isDetached(element)) return new Element.Offset(0, 0);

                var rect = element.getBoundingClientRect(),
                    docEl = document.documentElement;
                return new Element.Offset(rect.left - docEl.clientLeft,
                    rect.top - docEl.clientTop);
            }
        });
    }


})();

(function () {

    var IS_OLD_OPERA = Prototype.Browser.Opera &&
        (window.parseFloat(window.opera.version()) < 9.5);
    var ROOT = null;

    function getRootElement() {
        if (ROOT) return ROOT;
        ROOT = IS_OLD_OPERA ? document.body : document.documentElement;
        return ROOT;
    }

    function getDimensions() {
        return {width: this.getWidth(), height: this.getHeight()};
    }

    function getWidth() {
        return getRootElement().clientWidth;
    }

    function getHeight() {
        return getRootElement().clientHeight;
    }

    function getScrollOffsets() {
        var x = window.pageXOffset || document.documentElement.scrollLeft ||
            document.body.scrollLeft;
        var y = window.pageYOffset || document.documentElement.scrollTop ||
            document.body.scrollTop;

        return new Element.Offset(x, y);
    }

    document.viewport = {
        getDimensions: getDimensions,
        getWidth: getWidth,
        getHeight: getHeight,
        getScrollOffsets: getScrollOffsets
    };

})();
window.$$ = function () {
    var expression = $A(arguments).join(', ');
    return Prototype.Selector.select(expression, document);
};

Prototype.Selector = (function () {

    function select() {
        throw new Error('Method "Prototype.Selector.select" must be defined.');
    }

    function match() {
        throw new Error('Method "Prototype.Selector.match" must be defined.');
    }

    function find(elements, expression, index) {
        index = index || 0;
        var match = Prototype.Selector.match, length = elements.length, matchIndex = 0, i;

        for (i = 0; i < length; i++) {
            if (match(elements[i], expression) && index == matchIndex++) {
                return Element.extend(elements[i]);
            }
        }
    }

    function extendElements(elements) {
        for (var i = 0, length = elements.length; i < length; i++) {
            Element.extend(elements[i]);
        }
        return elements;
    }


    var K = Prototype.K;

    return {
        select: select,
        match: match,
        find: find,
        extendElements: (Element.extend === K) ? K : extendElements,
        extendElement: Element.extend
    };
})();
Prototype._original_property = window.Sizzle;
/*!
 * Sizzle CSS Selector Engine v@VERSION
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: @DATE
 */
(function (window) {

    var i,
        support,
        Expr,
        getText,
        isXML,
        compile,
        select,
        outermostContext,
        sortInput,
        hasDuplicate,

        setDocument,
        document,
        docElem,
        documentIsHTML,
        rbuggyQSA,
        rbuggyMatches,
        matches,
        contains,

        expando = "sizzle" + -(new Date()),
        preferredDoc = window.document,
        dirruns = 0,
        done = 0,
        classCache = createCache(),
        tokenCache = createCache(),
        compilerCache = createCache(),
        sortOrder = function (a, b) {
            if (a === b) {
                hasDuplicate = true;
            }
            return 0;
        },

        strundefined = typeof undefined,
        MAX_NEGATIVE = 1 << 31,

        hasOwn = ({}).hasOwnProperty,
        arr = [],
        pop = arr.pop,
        push_native = arr.push,
        push = arr.push,
        slice = arr.slice,
        indexOf = arr.indexOf || function (elem) {
                var i = 0,
                    len = this.length;
                for (; i < len; i++) {
                    if (this[i] === elem) {
                        return i;
                    }
                }
                return -1;
            },

        booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",


        whitespace = "[\\x20\\t\\r\\n\\f]",
        characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

        identifier = characterEncoding.replace("w", "w#"),

        attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
            "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

        pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace(3, 8) + ")*)|.*)\\)|)",

        rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

        rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
        rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),

        rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),

        rpseudo = new RegExp(pseudos),
        ridentifier = new RegExp("^" + identifier + "$"),

        matchExpr = {
            "ID": new RegExp("^#(" + characterEncoding + ")"),
            "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
            "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
            "ATTR": new RegExp("^" + attributes),
            "PSEUDO": new RegExp("^" + pseudos),
            "CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            "bool": new RegExp("^(?:" + booleans + ")$", "i"),
            "needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        },

        rinputs = /^(?:input|select|textarea|button)$/i,
        rheader = /^h\d$/i,

        rnative = /^[^{]+\{\s*\[native \w/,

        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

        rsibling = /[+~]/,
        rescape = /'|\\/g,

        runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
        funescape = function (_, escaped, escapedWhitespace) {
            var high = "0x" + escaped - 0x10000;
            return high !== high || escapedWhitespace ?
                escaped :
                high < 0 ?
                    String.fromCharCode(high + 0x10000) :
                    String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
        };

    try {
        push.apply(
            (arr = slice.call(preferredDoc.childNodes)),
            preferredDoc.childNodes
        );
        arr[preferredDoc.childNodes.length].nodeType;
    } catch (e) {
        push = {
            apply: arr.length ?

                function (target, els) {
                    push_native.apply(target, slice.call(els));
                } :

                function (target, els) {
                    var j = target.length,
                        i = 0;
                    while ((target[j++] = els[i++])) {
                    }
                    target.length = j - 1;
                }
        };
    }

    function Sizzle(selector, context, results, seed) {
        var match, elem, m, nodeType,
            i, groups, old, nid, newContext, newSelector;

        if (( context ? context.ownerDocument || context : preferredDoc ) !== document) {
            setDocument(context);
        }

        context = context || document;
        results = results || [];

        if (!selector || typeof selector !== "string") {
            return results;
        }

        if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
            return [];
        }

        if (documentIsHTML && !seed) {

            if ((match = rquickExpr.exec(selector))) {
                if ((m = match[1])) {
                    if (nodeType === 9) {
                        elem = context.getElementById(m);
                        if (elem && elem.parentNode) {
                            if (elem.id === m) {
                                results.push(elem);
                                return results;
                            }
                        } else {
                            return results;
                        }
                    } else {
                        if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) &&
                            contains(context, elem) && elem.id === m) {
                            results.push(elem);
                            return results;
                        }
                    }

                } else if (match[2]) {
                    push.apply(results, context.getElementsByTagName(selector));
                    return results;

                } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
                    push.apply(results, context.getElementsByClassName(m));
                    return results;
                }
            }

            if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                nid = old = expando;
                newContext = context;
                newSelector = nodeType === 9 && selector;

                if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                    groups = tokenize(selector);

                    if ((old = context.getAttribute("id"))) {
                        nid = old.replace(rescape, "\\$&");
                    } else {
                        context.setAttribute("id", nid);
                    }
                    nid = "[id='" + nid + "'] ";

                    i = groups.length;
                    while (i--) {
                        groups[i] = nid + toSelector(groups[i]);
                    }
                    newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                    newSelector = groups.join(",");
                }

                if (newSelector) {
                    try {
                        push.apply(results,
                            newContext.querySelectorAll(newSelector)
                        );
                        return results;
                    } catch (qsaError) {
                    } finally {
                        if (!old) {
                            context.removeAttribute("id");
                        }
                    }
                }
            }
        }

        return select(selector.replace(rtrim, "$1"), context, results, seed);
    }

    /**
     * Create key-value caches of limited size
     * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
     *    property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *    deleting the oldest entry
     */
    function createCache() {
        var keys = [];

        function cache(key, value) {
            if (keys.push(key + " ") > Expr.cacheLength) {
                delete cache[keys.shift()];
            }
            return (cache[key + " "] = value);
        }

        return cache;
    }

    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */
    function markFunction(fn) {
        fn[expando] = true;
        return fn;
    }

    /**
     * Support testing using an element
     * @param {Function} fn Passed the created div and expects a boolean result
     */
    function assert(fn) {
        var div = document.createElement("div");

        try {
            return !!fn(div);
        } catch (e) {
            return false;
        } finally {
            if (div.parentNode) {
                div.parentNode.removeChild(div);
            }
            div = null;
        }
    }

    /**
     * Adds the same handler for all of the specified attrs
     * @param {String} attrs Pipe-separated list of attributes
     * @param {Function} handler The method that will be applied
     */
    function addHandle(attrs, handler) {
        var arr = attrs.split("|"),
            i = attrs.length;

        while (i--) {
            Expr.attrHandle[arr[i]] = handler;
        }
    }

    /**
     * Checks document order of two siblings
     * @param {Element} a
     * @param {Element} b
     * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */
    function siblingCheck(a, b) {
        var cur = b && a,
            diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
                ( ~b.sourceIndex || MAX_NEGATIVE ) -
                ( ~a.sourceIndex || MAX_NEGATIVE );

        if (diff) {
            return diff;
        }

        if (cur) {
            while ((cur = cur.nextSibling)) {
                if (cur === b) {
                    return -1;
                }
            }
        }

        return a ? 1 : -1;
    }

    /**
     * Returns a function to use in pseudos for input types
     * @param {String} type
     */
    function createInputPseudo(type) {
        return function (elem) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && elem.type === type;
        };
    }

    /**
     * Returns a function to use in pseudos for buttons
     * @param {String} type
     */
    function createButtonPseudo(type) {
        return function (elem) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && elem.type === type;
        };
    }

    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */
    function createPositionalPseudo(fn) {
        return markFunction(function (argument) {
            argument = +argument;
            return markFunction(function (seed, matches) {
                var j,
                    matchIndexes = fn([], seed.length, argument),
                    i = matchIndexes.length;

                while (i--) {
                    if (seed[(j = matchIndexes[i])]) {
                        seed[j] = !(matches[j] = seed[j]);
                    }
                }
            });
        });
    }

    /**
     * Checks a node for validity as a Sizzle context
     * @param {Element|Object=} context
     * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
     */
    function testContext(context) {
        return context && typeof context.getElementsByTagName !== strundefined && context;
    }

    support = Sizzle.support = {};

    /**
     * Detects XML nodes
     * @param {Element|Object} elem An element or a document
     * @returns {Boolean} True iff elem is a non-HTML XML node
     */
    isXML = Sizzle.isXML = function (elem) {
        var documentElement = elem && (elem.ownerDocument || elem).documentElement;
        return documentElement ? documentElement.nodeName !== "HTML" : false;
    };

    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */
    setDocument = Sizzle.setDocument = function (node) {
        var hasCompare,
            doc = node ? node.ownerDocument || node : preferredDoc,
            parent = doc.defaultView;

        if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
            return document;
        }

        document = doc;
        docElem = doc.documentElement;

        documentIsHTML = !isXML(doc);

        if (parent && parent !== parent.top) {
            if (parent.addEventListener) {
                parent.addEventListener("unload", function () {
                    setDocument();
                }, false);
            } else if (parent.attachEvent) {
                parent.attachEvent("onunload", function () {
                    setDocument();
                });
            }
        }

        /* Attributes
         ---------------------------------------------------------------------- */

        support.attributes = assert(function (div) {
            div.className = "i";
            return !div.getAttribute("className");
        });

        /* getElement(s)By*
         ---------------------------------------------------------------------- */

        support.getElementsByTagName = assert(function (div) {
            div.appendChild(doc.createComment(""));
            return !div.getElementsByTagName("*").length;
        });

        support.getElementsByClassName = rnative.test(doc.getElementsByClassName) && assert(function (div) {
                div.innerHTML = "<div class='a'></div><div class='a i'></div>";

                div.firstChild.className = "i";
                return div.getElementsByClassName("i").length === 2;
            });

        support.getById = assert(function (div) {
            docElem.appendChild(div).id = expando;
            return !doc.getElementsByName || !doc.getElementsByName(expando).length;
        });

        if (support.getById) {
            Expr.find["ID"] = function (id, context) {
                if (typeof context.getElementById !== strundefined && documentIsHTML) {
                    var m = context.getElementById(id);
                    return m && m.parentNode ? [m] : [];
                }
            };
            Expr.filter["ID"] = function (id) {
                var attrId = id.replace(runescape, funescape);
                return function (elem) {
                    return elem.getAttribute("id") === attrId;
                };
            };
        } else {
            delete Expr.find["ID"];

            Expr.filter["ID"] = function (id) {
                var attrId = id.replace(runescape, funescape);
                return function (elem) {
                    var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                    return node && node.value === attrId;
                };
            };
        }

        Expr.find["TAG"] = support.getElementsByTagName ?
            function (tag, context) {
                if (typeof context.getElementsByTagName !== strundefined) {
                    return context.getElementsByTagName(tag);
                }
            } :
            function (tag, context) {
                var elem,
                    tmp = [],
                    i = 0,
                    results = context.getElementsByTagName(tag);

                if (tag === "*") {
                    while ((elem = results[i++])) {
                        if (elem.nodeType === 1) {
                            tmp.push(elem);
                        }
                    }

                    return tmp;
                }
                return results;
            };

        Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
                if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) {
                    return context.getElementsByClassName(className);
                }
            };

        /* QSA/matchesSelector
         ---------------------------------------------------------------------- */


        rbuggyMatches = [];

        rbuggyQSA = [];

        if ((support.qsa = rnative.test(doc.querySelectorAll))) {
            assert(function (div) {
                div.innerHTML = "<select t=''><option selected=''></option></select>";

                if (div.querySelectorAll("[t^='']").length) {
                    rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
                }

                if (!div.querySelectorAll("[selected]").length) {
                    rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                }

                if (!div.querySelectorAll(":checked").length) {
                    rbuggyQSA.push(":checked");
                }
            });

            assert(function (div) {
                var input = doc.createElement("input");
                input.setAttribute("type", "hidden");
                div.appendChild(input).setAttribute("name", "D");

                if (div.querySelectorAll("[name=d]").length) {
                    rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
                }

                if (!div.querySelectorAll(":enabled").length) {
                    rbuggyQSA.push(":enabled", ":disabled");
                }

                div.querySelectorAll("*,:x");
                rbuggyQSA.push(",.*:");
            });
        }

        if ((support.matchesSelector = rnative.test((matches = docElem.webkitMatchesSelector ||
                docElem.mozMatchesSelector ||
                docElem.oMatchesSelector ||
                docElem.msMatchesSelector)))) {

            assert(function (div) {
                support.disconnectedMatch = matches.call(div, "div");

                matches.call(div, "[s!='']:x");
                rbuggyMatches.push("!=", pseudos);
            });
        }

        rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
        rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

        /* Contains
         ---------------------------------------------------------------------- */
        hasCompare = rnative.test(docElem.compareDocumentPosition);

        contains = hasCompare || rnative.test(docElem.contains) ?
            function (a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a,
                    bup = b && b.parentNode;
                return a === bup || !!( bup && bup.nodeType === 1 && (
                        adown.contains ?
                            adown.contains(bup) :
                        a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
                    ));
            } :
            function (a, b) {
                if (b) {
                    while ((b = b.parentNode)) {
                        if (b === a) {
                            return true;
                        }
                    }
                }
                return false;
            };

        /* Sorting
         ---------------------------------------------------------------------- */

        sortOrder = hasCompare ?
            function (a, b) {

                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }

                var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                if (compare) {
                    return compare;
                }

                compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
                    a.compareDocumentPosition(b) :

                    1;

                if (compare & 1 ||
                    (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {

                    if (a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
                        return -1;
                    }
                    if (b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
                        return 1;
                    }

                    return sortInput ?
                        ( indexOf.call(sortInput, a) - indexOf.call(sortInput, b) ) :
                        0;
                }

                return compare & 4 ? -1 : 1;
            } :
            function (a, b) {
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }

                var cur,
                    i = 0,
                    aup = a.parentNode,
                    bup = b.parentNode,
                    ap = [a],
                    bp = [b];

                if (!aup || !bup) {
                    return a === doc ? -1 :
                        b === doc ? 1 :
                            aup ? -1 :
                                bup ? 1 :
                                    sortInput ?
                                        ( indexOf.call(sortInput, a) - indexOf.call(sortInput, b) ) :
                                        0;

                } else if (aup === bup) {
                    return siblingCheck(a, b);
                }

                cur = a;
                while ((cur = cur.parentNode)) {
                    ap.unshift(cur);
                }
                cur = b;
                while ((cur = cur.parentNode)) {
                    bp.unshift(cur);
                }

                while (ap[i] === bp[i]) {
                    i++;
                }

                return i ?
                    siblingCheck(ap[i], bp[i]) :

                    ap[i] === preferredDoc ? -1 :
                        bp[i] === preferredDoc ? 1 :
                            0;
            };

        return doc;
    };

    Sizzle.matches = function (expr, elements) {
        return Sizzle(expr, null, null, elements);
    };

    Sizzle.matchesSelector = function (elem, expr) {
        if (( elem.ownerDocument || elem ) !== document) {
            setDocument(elem);
        }

        expr = expr.replace(rattributeQuotes, "='$1']");

        if (support.matchesSelector && documentIsHTML &&
            ( !rbuggyMatches || !rbuggyMatches.test(expr) ) &&
            ( !rbuggyQSA || !rbuggyQSA.test(expr) )) {

            try {
                var ret = matches.call(elem, expr);

                if (ret || support.disconnectedMatch ||
                    elem.document && elem.document.nodeType !== 11) {
                    return ret;
                }
            } catch (e) {
            }
        }

        return Sizzle(expr, document, null, [elem]).length > 0;
    };

    Sizzle.contains = function (context, elem) {
        if (( context.ownerDocument || context ) !== document) {
            setDocument(context);
        }
        return contains(context, elem);
    };

    Sizzle.attr = function (elem, name) {
        if (( elem.ownerDocument || elem ) !== document) {
            setDocument(elem);
        }

        var fn = Expr.attrHandle[name.toLowerCase()],
            val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
                fn(elem, name, !documentIsHTML) :
                undefined;

        return val !== undefined ?
            val :
            support.attributes || !documentIsHTML ?
                elem.getAttribute(name) :
                (val = elem.getAttributeNode(name)) && val.specified ?
                    val.value :
                    null;
    };

    Sizzle.error = function (msg) {
        throw new Error("Syntax error, unrecognized expression: " + msg);
    };

    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */
    Sizzle.uniqueSort = function (results) {
        var elem,
            duplicates = [],
            j = 0,
            i = 0;

        hasDuplicate = !support.detectDuplicates;
        sortInput = !support.sortStable && results.slice(0);
        results.sort(sortOrder);

        if (hasDuplicate) {
            while ((elem = results[i++])) {
                if (elem === results[i]) {
                    j = duplicates.push(i);
                }
            }
            while (j--) {
                results.splice(duplicates[j], 1);
            }
        }

        sortInput = null;

        return results;
    };

    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    getText = Sizzle.getText = function (elem) {
        var node,
            ret = "",
            i = 0,
            nodeType = elem.nodeType;

        if (!nodeType) {
            while ((node = elem[i++])) {
                ret += getText(node);
            }
        } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
            if (typeof elem.textContent === "string") {
                return elem.textContent;
            } else {
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    ret += getText(elem);
                }
            }
        } else if (nodeType === 3 || nodeType === 4) {
            return elem.nodeValue;
        }

        return ret;
    };

    Expr = Sizzle.selectors = {

        cacheLength: 50,

        createPseudo: markFunction,

        match: matchExpr,

        attrHandle: {},

        find: {},

        relative: {
            ">": {dir: "parentNode", first: true},
            " ": {dir: "parentNode"},
            "+": {dir: "previousSibling", first: true},
            "~": {dir: "previousSibling"}
        },

        preFilter: {
            "ATTR": function (match) {
                match[1] = match[1].replace(runescape, funescape);

                match[3] = ( match[4] || match[5] || "" ).replace(runescape, funescape);

                if (match[2] === "~=") {
                    match[3] = " " + match[3] + " ";
                }

                return match.slice(0, 4);
            },

            "CHILD": function (match) {
                /* matches from matchExpr["CHILD"]
                 1 type (only|nth|...)
                 2 what (child|of-type)
                 3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                 4 xn-component of xn+y argument ([+-]?\d*n|)
                 5 sign of xn-component
                 6 x of xn-component
                 7 sign of y-component
                 8 y of y-component
                 */
                match[1] = match[1].toLowerCase();

                if (match[1].slice(0, 3) === "nth") {
                    if (!match[3]) {
                        Sizzle.error(match[0]);
                    }

                    match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
                    match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

                } else if (match[3]) {
                    Sizzle.error(match[0]);
                }

                return match;
            },

            "PSEUDO": function (match) {
                var excess,
                    unquoted = !match[5] && match[2];

                if (matchExpr["CHILD"].test(match[0])) {
                    return null;
                }

                if (match[3] && match[4] !== undefined) {
                    match[2] = match[4];

                } else if (unquoted && rpseudo.test(unquoted) &&
                    (excess = tokenize(unquoted, true)) &&
                    (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

                    match[0] = match[0].slice(0, excess);
                    match[2] = unquoted.slice(0, excess);
                }

                return match.slice(0, 3);
            }
        },

        filter: {

            "TAG": function (nodeNameSelector) {
                var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                return nodeNameSelector === "*" ?
                    function () {
                        return true;
                    } :
                    function (elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
            },

            "CLASS": function (className) {
                var pattern = classCache[className + " "];

                return pattern ||
                    (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
                    classCache(className, function (elem) {
                        return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
                    });
            },

            "ATTR": function (name, operator, check) {
                return function (elem) {
                    var result = Sizzle.attr(elem, name);

                    if (result == null) {
                        return operator === "!=";
                    }
                    if (!operator) {
                        return true;
                    }

                    result += "";

                    return operator === "=" ? result === check :
                        operator === "!=" ? result !== check :
                            operator === "^=" ? check && result.indexOf(check) === 0 :
                                operator === "*=" ? check && result.indexOf(check) > -1 :
                                    operator === "$=" ? check && result.slice(-check.length) === check :
                                        operator === "~=" ? ( " " + result + " " ).indexOf(check) > -1 :
                                            operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
                                                false;
                };
            },

            "CHILD": function (type, what, argument, first, last) {
                var simple = type.slice(0, 3) !== "nth",
                    forward = type.slice(-4) !== "last",
                    ofType = what === "of-type";

                return first === 1 && last === 0 ?

                    function (elem) {
                        return !!elem.parentNode;
                    } :

                    function (elem, context, xml) {
                        var cache, outerCache, node, diff, nodeIndex, start,
                            dir = simple !== forward ? "nextSibling" : "previousSibling",
                            parent = elem.parentNode,
                            name = ofType && elem.nodeName.toLowerCase(),
                            useCache = !xml && !ofType;

                        if (parent) {

                            if (simple) {
                                while (dir) {
                                    node = elem;
                                    while ((node = node[dir])) {
                                        if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                                            return false;
                                        }
                                    }
                                    start = dir = type === "only" && !start && "nextSibling";
                                }
                                return true;
                            }

                            start = [forward ? parent.firstChild : parent.lastChild];

                            if (forward && useCache) {
                                outerCache = parent[expando] || (parent[expando] = {});
                                cache = outerCache[type] || [];
                                nodeIndex = cache[0] === dirruns && cache[1];
                                diff = cache[0] === dirruns && cache[2];
                                node = nodeIndex && parent.childNodes[nodeIndex];

                                while ((node = ++nodeIndex && node && node[dir] ||

                                    (diff = nodeIndex = 0) || start.pop())) {

                                    if (node.nodeType === 1 && ++diff && node === elem) {
                                        outerCache[type] = [dirruns, nodeIndex, diff];
                                        break;
                                    }
                                }

                            } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                                diff = cache[1];

                            } else {
                                while ((node = ++nodeIndex && node && node[dir] ||
                                    (diff = nodeIndex = 0) || start.pop())) {

                                    if (( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff) {
                                        if (useCache) {
                                            (node[expando] || (node[expando] = {}))[type] = [dirruns, diff];
                                        }

                                        if (node === elem) {
                                            break;
                                        }
                                    }
                                }
                            }

                            diff -= last;
                            return diff === first || ( diff % first === 0 && diff / first >= 0 );
                        }
                    };
            },

            "PSEUDO": function (pseudo, argument) {
                var args,
                    fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
                        Sizzle.error("unsupported pseudo: " + pseudo);

                if (fn[expando]) {
                    return fn(argument);
                }

                if (fn.length > 1) {
                    args = [pseudo, pseudo, "", argument];
                    return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
                        markFunction(function (seed, matches) {
                            var idx,
                                matched = fn(seed, argument),
                                i = matched.length;
                            while (i--) {
                                idx = indexOf.call(seed, matched[i]);
                                seed[idx] = !( matches[idx] = matched[i] );
                            }
                        }) :
                        function (elem) {
                            return fn(elem, 0, args);
                        };
                }

                return fn;
            }
        },

        pseudos: {
            "not": markFunction(function (selector) {
                var input = [],
                    results = [],
                    matcher = compile(selector.replace(rtrim, "$1"));

                return matcher[expando] ?
                    markFunction(function (seed, matches, context, xml) {
                        var elem,
                            unmatched = matcher(seed, null, xml, []),
                            i = seed.length;

                        while (i--) {
                            if ((elem = unmatched[i])) {
                                seed[i] = !(matches[i] = elem);
                            }
                        }
                    }) :
                    function (elem, context, xml) {
                        input[0] = elem;
                        matcher(input, null, xml, results);
                        return !results.pop();
                    };
            }),

            "has": markFunction(function (selector) {
                return function (elem) {
                    return Sizzle(selector, elem).length > 0;
                };
            }),

            "contains": markFunction(function (text) {
                return function (elem) {
                    return ( elem.textContent || elem.innerText || getText(elem) ).indexOf(text) > -1;
                };
            }),

            "lang": markFunction(function (lang) {
                if (!ridentifier.test(lang || "")) {
                    Sizzle.error("unsupported lang: " + lang);
                }
                lang = lang.replace(runescape, funescape).toLowerCase();
                return function (elem) {
                    var elemLang;
                    do {
                        if ((elemLang = documentIsHTML ?
                                elem.lang :
                            elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {

                            elemLang = elemLang.toLowerCase();
                            return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                        }
                    } while ((elem = elem.parentNode) && elem.nodeType === 1);
                    return false;
                };
            }),

            "target": function (elem) {
                var hash = window.location && window.location.hash;
                return hash && hash.slice(1) === elem.id;
            },

            "root": function (elem) {
                return elem === docElem;
            },

            "focus": function (elem) {
                return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
            },

            "enabled": function (elem) {
                return elem.disabled === false;
            },

            "disabled": function (elem) {
                return elem.disabled === true;
            },

            "checked": function (elem) {
                var nodeName = elem.nodeName.toLowerCase();
                return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
            },

            "selected": function (elem) {
                if (elem.parentNode) {
                    elem.parentNode.selectedIndex;
                }

                return elem.selected === true;
            },

            "empty": function (elem) {
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    if (elem.nodeType < 6) {
                        return false;
                    }
                }
                return true;
            },

            "parent": function (elem) {
                return !Expr.pseudos["empty"](elem);
            },

            "header": function (elem) {
                return rheader.test(elem.nodeName);
            },

            "input": function (elem) {
                return rinputs.test(elem.nodeName);
            },

            "button": function (elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === "button" || name === "button";
            },

            "text": function (elem) {
                var attr;
                return elem.nodeName.toLowerCase() === "input" &&
                    elem.type === "text" &&

                    ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
            },

            "first": createPositionalPseudo(function () {
                return [0];
            }),

            "last": createPositionalPseudo(function (matchIndexes, length) {
                return [length - 1];
            }),

            "eq": createPositionalPseudo(function (matchIndexes, length, argument) {
                return [argument < 0 ? argument + length : argument];
            }),

            "even": createPositionalPseudo(function (matchIndexes, length) {
                var i = 0;
                for (; i < length; i += 2) {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            }),

            "odd": createPositionalPseudo(function (matchIndexes, length) {
                var i = 1;
                for (; i < length; i += 2) {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            }),

            "lt": createPositionalPseudo(function (matchIndexes, length, argument) {
                var i = argument < 0 ? argument + length : argument;
                for (; --i >= 0;) {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            }),

            "gt": createPositionalPseudo(function (matchIndexes, length, argument) {
                var i = argument < 0 ? argument + length : argument;
                for (; ++i < length;) {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            })
        }
    };

    Expr.pseudos["nth"] = Expr.pseudos["eq"];

    for (i in {radio: true, checkbox: true, file: true, password: true, image: true}) {
        Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in {submit: true, reset: true}) {
        Expr.pseudos[i] = createButtonPseudo(i);
    }

    function setFilters() {
    }

    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();

    function tokenize(selector, parseOnly) {
        var matched, match, tokens, type,
            soFar, groups, preFilters,
            cached = tokenCache[selector + " "];

        if (cached) {
            return parseOnly ? 0 : cached.slice(0);
        }

        soFar = selector;
        groups = [];
        preFilters = Expr.preFilter;

        while (soFar) {

            if (!matched || (match = rcomma.exec(soFar))) {
                if (match) {
                    soFar = soFar.slice(match[0].length) || soFar;
                }
                groups.push((tokens = []));
            }

            matched = false;

            if ((match = rcombinators.exec(soFar))) {
                matched = match.shift();
                tokens.push({
                    value: matched,
                    type: match[0].replace(rtrim, " ")
                });
                soFar = soFar.slice(matched.length);
            }

            for (type in Expr.filter) {
                if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
                    (match = preFilters[type](match)))) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        type: type,
                        matches: match
                    });
                    soFar = soFar.slice(matched.length);
                }
            }

            if (!matched) {
                break;
            }
        }

        return parseOnly ?
            soFar.length :
            soFar ?
                Sizzle.error(selector) :
                tokenCache(selector, groups).slice(0);
    }

    function toSelector(tokens) {
        var i = 0,
            len = tokens.length,
            selector = "";
        for (; i < len; i++) {
            selector += tokens[i].value;
        }
        return selector;
    }

    function addCombinator(matcher, combinator, base) {
        var dir = combinator.dir,
            checkNonElements = base && dir === "parentNode",
            doneName = done++;

        return combinator.first ?
            function (elem, context, xml) {
                while ((elem = elem[dir])) {
                    if (elem.nodeType === 1 || checkNonElements) {
                        return matcher(elem, context, xml);
                    }
                }
            } :

            function (elem, context, xml) {
                var oldCache, outerCache,
                    newCache = [dirruns, doneName];

                if (xml) {
                    while ((elem = elem[dir])) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            if (matcher(elem, context, xml)) {
                                return true;
                            }
                        }
                    }
                } else {
                    while ((elem = elem[dir])) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            outerCache = elem[expando] || (elem[expando] = {});
                            if ((oldCache = outerCache[dir]) &&
                                oldCache[0] === dirruns && oldCache[1] === doneName) {

                                return (newCache[2] = oldCache[2]);
                            } else {
                                outerCache[dir] = newCache;

                                if ((newCache[2] = matcher(elem, context, xml))) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            };
    }

    function elementMatcher(matchers) {
        return matchers.length > 1 ?
            function (elem, context, xml) {
                var i = matchers.length;
                while (i--) {
                    if (!matchers[i](elem, context, xml)) {
                        return false;
                    }
                }
                return true;
            } :
            matchers[0];
    }

    function multipleContexts(selector, contexts, results) {
        var i = 0,
            len = contexts.length;
        for (; i < len; i++) {
            Sizzle(selector, contexts[i], results);
        }
        return results;
    }

    function condense(unmatched, map, filter, context, xml) {
        var elem,
            newUnmatched = [],
            i = 0,
            len = unmatched.length,
            mapped = map != null;

        for (; i < len; i++) {
            if ((elem = unmatched[i])) {
                if (!filter || filter(elem, context, xml)) {
                    newUnmatched.push(elem);
                    if (mapped) {
                        map.push(i);
                    }
                }
            }
        }

        return newUnmatched;
    }

    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
        if (postFilter && !postFilter[expando]) {
            postFilter = setMatcher(postFilter);
        }
        if (postFinder && !postFinder[expando]) {
            postFinder = setMatcher(postFinder, postSelector);
        }
        return markFunction(function (seed, results, context, xml) {
            var temp, i, elem,
                preMap = [],
                postMap = [],
                preexisting = results.length,

                elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),

                matcherIn = preFilter && ( seed || !selector ) ?
                    condense(elems, preMap, preFilter, context, xml) :
                    elems,

                matcherOut = matcher ?
                    postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                        [] :

                        results :
                    matcherIn;

            if (matcher) {
                matcher(matcherIn, matcherOut, context, xml);
            }

            if (postFilter) {
                temp = condense(matcherOut, postMap);
                postFilter(temp, [], context, xml);

                i = temp.length;
                while (i--) {
                    if ((elem = temp[i])) {
                        matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                    }
                }
            }

            if (seed) {
                if (postFinder || preFilter) {
                    if (postFinder) {
                        temp = [];
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i])) {
                                temp.push((matcherIn[i] = elem));
                            }
                        }
                        postFinder(null, (matcherOut = []), temp, xml);
                    }

                    i = matcherOut.length;
                    while (i--) {
                        if ((elem = matcherOut[i]) &&
                            (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {

                            seed[temp] = !(results[temp] = elem);
                        }
                    }
                }

            } else {
                matcherOut = condense(
                    matcherOut === results ?
                        matcherOut.splice(preexisting, matcherOut.length) :
                        matcherOut
                );
                if (postFinder) {
                    postFinder(null, results, matcherOut, xml);
                } else {
                    push.apply(results, matcherOut);
                }
            }
        });
    }

    function matcherFromTokens(tokens) {
        var checkContext, matcher, j,
            len = tokens.length,
            leadingRelative = Expr.relative[tokens[0].type],
            implicitRelative = leadingRelative || Expr.relative[" "],
            i = leadingRelative ? 1 : 0,

            matchContext = addCombinator(function (elem) {
                return elem === checkContext;
            }, implicitRelative, true),
            matchAnyContext = addCombinator(function (elem) {
                return indexOf.call(checkContext, elem) > -1;
            }, implicitRelative, true),
            matchers = [function (elem, context, xml) {
                return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                        (checkContext = context).nodeType ?
                            matchContext(elem, context, xml) :
                            matchAnyContext(elem, context, xml) );
            }];

        for (; i < len; i++) {
            if ((matcher = Expr.relative[tokens[i].type])) {
                matchers = [addCombinator(elementMatcher(matchers), matcher)];
            } else {
                matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

                if (matcher[expando]) {
                    j = ++i;
                    for (; j < len; j++) {
                        if (Expr.relative[tokens[j].type]) {
                            break;
                        }
                    }
                    return setMatcher(
                        i > 1 && elementMatcher(matchers),
                        i > 1 && toSelector(
                            tokens.slice(0, i - 1).concat({value: tokens[i - 2].type === " " ? "*" : ""})
                        ).replace(rtrim, "$1"),
                        matcher,
                        i < j && matcherFromTokens(tokens.slice(i, j)),
                        j < len && matcherFromTokens((tokens = tokens.slice(j))),
                        j < len && toSelector(tokens)
                    );
                }
                matchers.push(matcher);
            }
        }

        return elementMatcher(matchers);
    }

    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
        var bySet = setMatchers.length > 0,
            byElement = elementMatchers.length > 0,
            superMatcher = function (seed, context, xml, results, outermost) {
                var elem, j, matcher,
                    matchedCount = 0,
                    i = "0",
                    unmatched = seed && [],
                    setMatched = [],
                    contextBackup = outermostContext,
                    elems = seed || byElement && Expr.find["TAG"]("*", outermost),
                    dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                    len = elems.length;

                if (outermost) {
                    outermostContext = context !== document && context;
                }

                for (; i !== len && (elem = elems[i]) != null; i++) {
                    if (byElement && elem) {
                        j = 0;
                        while ((matcher = elementMatchers[j++])) {
                            if (matcher(elem, context, xml)) {
                                results.push(elem);
                                break;
                            }
                        }
                        if (outermost) {
                            dirruns = dirrunsUnique;
                        }
                    }

                    if (bySet) {
                        if ((elem = !matcher && elem)) {
                            matchedCount--;
                        }

                        if (seed) {
                            unmatched.push(elem);
                        }
                    }
                }

                matchedCount += i;
                if (bySet && i !== matchedCount) {
                    j = 0;
                    while ((matcher = setMatchers[j++])) {
                        matcher(unmatched, setMatched, context, xml);
                    }

                    if (seed) {
                        if (matchedCount > 0) {
                            while (i--) {
                                if (!(unmatched[i] || setMatched[i])) {
                                    setMatched[i] = pop.call(results);
                                }
                            }
                        }

                        setMatched = condense(setMatched);
                    }

                    push.apply(results, setMatched);

                    if (outermost && !seed && setMatched.length > 0 &&
                        ( matchedCount + setMatchers.length ) > 1) {

                        Sizzle.uniqueSort(results);
                    }
                }

                if (outermost) {
                    dirruns = dirrunsUnique;
                    outermostContext = contextBackup;
                }

                return unmatched;
            };

        return bySet ?
            markFunction(superMatcher) :
            superMatcher;
    }

    compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
        var i,
            setMatchers = [],
            elementMatchers = [],
            cached = compilerCache[selector + " "];

        if (!cached) {
            if (!match) {
                match = tokenize(selector);
            }
            i = match.length;
            while (i--) {
                cached = matcherFromTokens(match[i]);
                if (cached[expando]) {
                    setMatchers.push(cached);
                } else {
                    elementMatchers.push(cached);
                }
            }

            cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

            cached.selector = selector;
        }
        return cached;
    };

    /**
     * A low-level selection function that works with Sizzle's compiled
     *  selector functions
     * @param {String|Function} selector A selector or a pre-compiled
     *  selector function built with Sizzle.compile
     * @param {Element} context
     * @param {Array} [results]
     * @param {Array} [seed] A set of elements to match against
     */
    select = Sizzle.select = function (selector, context, results, seed) {
        var i, tokens, token, type, find,
            compiled = typeof selector === "function" && selector,
            match = !seed && tokenize((selector = compiled.selector || selector));

        results = results || [];

        if (match.length === 1) {

            tokens = match[0] = match[0].slice(0);
            if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                support.getById && context.nodeType === 9 && documentIsHTML &&
                Expr.relative[tokens[1].type]) {

                context = ( Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [] )[0];
                if (!context) {
                    return results;

                } else if (compiled) {
                    context = context.parentNode;
                }

                selector = selector.slice(tokens.shift().value.length);
            }

            i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
            while (i--) {
                token = tokens[i];

                if (Expr.relative[(type = token.type)]) {
                    break;
                }
                if ((find = Expr.find[type])) {
                    if ((seed = find(
                            token.matches[0].replace(runescape, funescape),
                            rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                        ))) {

                        tokens.splice(i, 1);
                        selector = seed.length && toSelector(tokens);
                        if (!selector) {
                            push.apply(results, seed);
                            return results;
                        }

                        break;
                    }
                }
            }
        }

        ( compiled || compile(selector, match) )(
            seed,
            context,
            !documentIsHTML,
            results,
            rsibling.test(selector) && testContext(context.parentNode) || context
        );
        return results;
    };


    support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

    support.detectDuplicates = !!hasDuplicate;

    setDocument();

    support.sortDetached = assert(function (div1) {
        return div1.compareDocumentPosition(document.createElement("div")) & 1;
    });

    if (!assert(function (div) {
            div.innerHTML = "<a href='#'></a>";
            return div.firstChild.getAttribute("href") === "#";
        })) {
        addHandle("type|href|height|width", function (elem, name, isXML) {
            if (!isXML) {
                return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
            }
        });
    }

    if (!support.attributes || !assert(function (div) {
            div.innerHTML = "<input/>";
            div.firstChild.setAttribute("value", "");
            return div.firstChild.getAttribute("value") === "";
        })) {
        addHandle("value", function (elem, name, isXML) {
            if (!isXML && elem.nodeName.toLowerCase() === "input") {
                return elem.defaultValue;
            }
        });
    }

    if (!assert(function (div) {
            return div.getAttribute("disabled") == null;
        })) {
        addHandle(booleans, function (elem, name, isXML) {
            var val;
            if (!isXML) {
                return elem[name] === true ? name.toLowerCase() :
                    (val = elem.getAttributeNode(name)) && val.specified ?
                        val.value :
                        null;
            }
        });
    }

    if (typeof define === "function" && define.amd) {
        define(function () {
            return Sizzle;
        });
    } else if (typeof module !== "undefined" && module.exports) {
        module.exports = Sizzle;
    } else {
        window.Sizzle = Sizzle;
    }

})(window);

;(function (engine) {
    var extendElements = Prototype.Selector.extendElements;

    function select(selector, scope) {
        return extendElements(engine(selector, scope || document));
    }

    function match(element, selector) {
        return engine.matches(selector, [element]).length == 1;
    }

    Prototype.Selector.engine = engine;
    Prototype.Selector.select = select;
    Prototype.Selector.match = match;
})(Sizzle);

window.Sizzle = Prototype._original_property;
delete Prototype._original_property;

var Form = {
    reset: function (form) {
        form = $(form);
        form.reset();
        return form;
    },

    serializeElements: function (elements, options) {
        if (typeof options != 'object') options = {hash: !!options};
        else if (Object.isUndefined(options.hash)) options.hash = true;
        var key, value, submitted = false, submit = options.submit, accumulator, initial;

        if (options.hash) {
            initial = {};
            accumulator = function (result, key, value) {
                if (key in result) {
                    if (!Object.isArray(result[key])) result[key] = [result[key]];
                    result[key] = result[key].concat(value);
                } else result[key] = value;
                return result;
            };
        } else {
            initial = '';
            accumulator = function (result, key, values) {
                if (!Object.isArray(values)) {
                    values = [values];
                }
                if (!values.length) {
                    return result;
                }
                var encodedKey = encodeURIComponent(key).gsub(/%20/, '+');
                return result + (result ? "&" : "") + values.map(function (value) {
                        value = value.gsub(/(\r)?\n/, '\r\n');
                        value = encodeURIComponent(value);
                        value = value.gsub(/%20/, '+');
                        return encodedKey + "=" + value;
                    }).join("&");
            };
        }

        return elements.inject(initial, function (result, element) {
            if (!element.disabled && element.name) {
                key = element.name;
                value = $(element).getValue();
                if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted &&
                    submit !== false && (!submit || key == submit) && (submitted = true)))) {
                    result = accumulator(result, key, value);
                }
            }
            return result;
        });
    }
};

Form.Methods = {
    serialize: function (form, options) {
        return Form.serializeElements(Form.getElements(form), options);
    },


    getElements: function (form) {
        var elements = $(form).getElementsByTagName('*');
        var element, results = [], serializers = Form.Element.Serializers;

        for (var i = 0; element = elements[i]; i++) {
            if (serializers[element.tagName.toLowerCase()])
                results.push(Element.extend(element));
        }
        return results;
    },

    getInputs: function (form, typeName, name) {
        form = $(form);
        var inputs = form.getElementsByTagName('input');

        if (!typeName && !name) return $A(inputs).map(Element.extend);

        for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
            var input = inputs[i];
            if ((typeName && input.type != typeName) || (name && input.name != name))
                continue;
            matchingInputs.push(Element.extend(input));
        }

        return matchingInputs;
    },

    disable: function (form) {
        form = $(form);
        Form.getElements(form).invoke('disable');
        return form;
    },

    enable: function (form) {
        form = $(form);
        Form.getElements(form).invoke('enable');
        return form;
    },

    findFirstElement: function (form) {
        var elements = $(form).getElements().findAll(function (element) {
            return 'hidden' != element.type && !element.disabled;
        });
        var firstByIndex = elements.findAll(function (element) {
            return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
        }).sortBy(function (element) {
            return element.tabIndex
        }).first();

        return firstByIndex ? firstByIndex : elements.find(function (element) {
            return /^(?:input|select|textarea)$/i.test(element.tagName);
        });
    },

    focusFirstElement: function (form) {
        form = $(form);
        var element = form.findFirstElement();
        if (element) element.activate();
        return form;
    },

    request: function (form, options) {
        form = $(form), options = Object.clone(options || {});

        var params = options.parameters, action = form.readAttribute('action') || '';
        if (action.blank()) action = window.location.href;
        options.parameters = form.serialize(true);

        if (params) {
            if (Object.isString(params)) params = params.toQueryParams();
            Object.extend(options.parameters, params);
        }

        if (form.hasAttribute('method') && !options.method)
            options.method = form.method;

        return new Ajax.Request(action, options);
    }
};

/*--------------------------------------------------------------------------*/


Form.Element = {
    focus: function (element) {
        $(element).focus();
        return element;
    },

    select: function (element) {
        $(element).select();
        return element;
    }
};

Form.Element.Methods = {

    serialize: function (element) {
        element = $(element);
        if (!element.disabled && element.name) {
            var value = element.getValue();
            if (value != undefined) {
                var pair = {};
                pair[element.name] = value;
                return Object.toQueryString(pair);
            }
        }
        return '';
    },

    getValue: function (element) {
        element = $(element);
        var method = element.tagName.toLowerCase();
        return Form.Element.Serializers[method](element);
    },

    setValue: function (element, value) {
        element = $(element);
        var method = element.tagName.toLowerCase();
        Form.Element.Serializers[method](element, value);
        return element;
    },

    clear: function (element) {
        $(element).value = '';
        return element;
    },

    present: function (element) {
        return $(element).value != '';
    },

    activate: function (element) {
        element = $(element);
        try {
            element.focus();
            if (element.select && (element.tagName.toLowerCase() != 'input' || !(/^(?:button|reset|submit)$/i.test(element.type))))
                element.select();
        } catch (e) {
        }
        return element;
    },

    disable: function (element) {
        element = $(element);
        element.disabled = true;
        return element;
    },

    enable: function (element) {
        element = $(element);
        element.disabled = false;
        return element;
    }
};

/*--------------------------------------------------------------------------*/

var Field = Form.Element;

var $F = Form.Element.Methods.getValue;

/*--------------------------------------------------------------------------*/

Form.Element.Serializers = (function () {
    function input(element, value) {
        switch (element.type.toLowerCase()) {
            case 'checkbox':
            case 'radio':
                return inputSelector(element, value);
            default:
                return valueSelector(element, value);
        }
    }

    function inputSelector(element, value) {
        if (Object.isUndefined(value))
            return element.checked ? element.value : null;
        else element.checked = !!value;
    }

    function valueSelector(element, value) {
        if (Object.isUndefined(value)) return element.value;
        else element.value = value;
    }

    function select(element, value) {
        if (Object.isUndefined(value))
            return (element.type === 'select-one' ? selectOne : selectMany)(element);

        var opt, currentValue, single = !Object.isArray(value);
        for (var i = 0, length = element.length; i < length; i++) {
            opt = element.options[i];
            currentValue = this.optionValue(opt);
            if (single) {
                if (currentValue == value) {
                    opt.selected = true;
                    return;
                }
            }
            else opt.selected = value.include(currentValue);
        }
    }

    function selectOne(element) {
        var index = element.selectedIndex;
        return index >= 0 ? optionValue(element.options[index]) : null;
    }

    function selectMany(element) {
        var values, length = element.length;
        if (!length) return null;

        for (var i = 0, values = []; i < length; i++) {
            var opt = element.options[i];
            if (opt.selected) values.push(optionValue(opt));
        }
        return values;
    }

    function optionValue(opt) {
        return Element.hasAttribute(opt, 'value') ? opt.value : opt.text;
    }

    return {
        input: input,
        inputSelector: inputSelector,
        textarea: valueSelector,
        select: select,
        selectOne: selectOne,
        selectMany: selectMany,
        optionValue: optionValue,
        button: valueSelector
    };
})();

/*--------------------------------------------------------------------------*/


Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
    initialize: function ($super, element, frequency, callback) {
        $super(callback, frequency);
        this.element = $(element);
        this.lastValue = this.getValue();
    },

    execute: function () {
        var value = this.getValue();
        if (Object.isString(this.lastValue) && Object.isString(value) ?
            this.lastValue != value : String(this.lastValue) != String(value)) {
            this.callback(this.element, value);
            this.lastValue = value;
        }
    }
});

Form.Element.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function () {
        return Form.Element.getValue(this.element);
    }
});

Form.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function () {
        return Form.serialize(this.element);
    }
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = Class.create({
    initialize: function (element, callback) {
        this.element = $(element);
        this.callback = callback;

        this.lastValue = this.getValue();
        if (this.element.tagName.toLowerCase() == 'form')
            this.registerFormCallbacks();
        else
            this.registerCallback(this.element);
    },

    onElementEvent: function () {
        var value = this.getValue();
        if (this.lastValue != value) {
            this.callback(this.element, value);
            this.lastValue = value;
        }
    },

    registerFormCallbacks: function () {
        Form.getElements(this.element).each(this.registerCallback, this);
    },

    registerCallback: function (element) {
        if (element.type) {
            switch (element.type.toLowerCase()) {
                case 'checkbox':
                case 'radio':
                    Event.observe(element, 'click', this.onElementEvent.bind(this));
                    break;
                default:
                    Event.observe(element, 'change', this.onElementEvent.bind(this));
                    break;
            }
        }
    }
});

Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function () {
        return Form.Element.getValue(this.element);
    }
});

Form.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function () {
        return Form.serialize(this.element);
    }
});
(function (GLOBAL) {
    var DIV = document.createElement('div');
    var docEl = document.documentElement;
    var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
        && 'onmouseleave' in docEl;

    var Event = {
        KEY_BACKSPACE: 8,
        KEY_TAB: 9,
        KEY_RETURN: 13,
        KEY_ESC: 27,
        KEY_LEFT: 37,
        KEY_UP: 38,
        KEY_RIGHT: 39,
        KEY_DOWN: 40,
        KEY_DELETE: 46,
        KEY_HOME: 36,
        KEY_END: 35,
        KEY_PAGEUP: 33,
        KEY_PAGEDOWN: 34,
        KEY_INSERT: 45
    };


    var isIELegacyEvent = function (event) {
        return false;
    };

    if (window.attachEvent) {
        if (window.addEventListener) {
            isIELegacyEvent = function (event) {
                return !(event instanceof window.Event);
            };
        } else {
            isIELegacyEvent = function (event) {
                return true;
            };
        }
    }

    var _isButton;

    function _isButtonForDOMEvents(event, code) {
        return event.which ? (event.which === code + 1) : (event.button === code);
    }

    var legacyButtonMap = {0: 1, 1: 4, 2: 2};

    function _isButtonForLegacyEvents(event, code) {
        return event.button === legacyButtonMap[code];
    }

    function _isButtonForWebKit(event, code) {
        switch (code) {
            case 0:
                return event.which == 1 && !event.metaKey;
            case 1:
                return event.which == 2 || (event.which == 1 && event.metaKey);
            case 2:
                return event.which == 3;
            default:
                return false;
        }
    }

    if (window.attachEvent) {
        if (!window.addEventListener) {
            _isButton = _isButtonForLegacyEvents;
        } else {
            _isButton = function (event, code) {
                return isIELegacyEvent(event) ? _isButtonForLegacyEvents(event, code) :
                    _isButtonForDOMEvents(event, code);
            }
        }
    } else if (Prototype.Browser.WebKit) {
        _isButton = _isButtonForWebKit;
    } else {
        _isButton = _isButtonForDOMEvents;
    }

    function isLeftClick(event) {
        return _isButton(event, 0)
    }

    function isMiddleClick(event) {
        return _isButton(event, 1)
    }

    function isRightClick(event) {
        return _isButton(event, 2)
    }

    function element(event) {
        return Element.extend(_element(event));
    }

    function _element(event) {
        event = Event.extend(event);

        var node = event.target, type = event.type,
            currentTarget = event.currentTarget;

        if (currentTarget && currentTarget.tagName) {
            if (type === 'load' || type === 'error' ||
                (type === 'click' && currentTarget.tagName.toLowerCase() === 'input'
                && currentTarget.type === 'radio'))
                node = currentTarget;
        }

        return node.nodeType == Node.TEXT_NODE ? node.parentNode : node;
    }

    function findElement(event, expression) {
        var element = _element(event), selector = Prototype.Selector;
        if (!expression) return Element.extend(element);
        while (element) {
            if (Object.isElement(element) && selector.match(element, expression))
                return Element.extend(element);
            element = element.parentNode;
        }
    }

    function pointer(event) {
        return {x: pointerX(event), y: pointerY(event)};
    }

    function pointerX(event) {
        var docElement = document.documentElement,
            body = document.body || {scrollLeft: 0};

        return event.pageX || (event.clientX +
            (docElement.scrollLeft || body.scrollLeft) -
            (docElement.clientLeft || 0));
    }

    function pointerY(event) {
        var docElement = document.documentElement,
            body = document.body || {scrollTop: 0};

        return event.pageY || (event.clientY +
            (docElement.scrollTop || body.scrollTop) -
            (docElement.clientTop || 0));
    }


    function stop(event) {
        Event.extend(event);
        event.preventDefault();
        event.stopPropagation();

        event.stopped = true;
    }


    Event.Methods = {
        isLeftClick: isLeftClick,
        isMiddleClick: isMiddleClick,
        isRightClick: isRightClick,

        element: element,
        findElement: findElement,

        pointer: pointer,
        pointerX: pointerX,
        pointerY: pointerY,

        stop: stop
    };

    var methods = Object.keys(Event.Methods).inject({}, function (m, name) {
        m[name] = Event.Methods[name].methodize();
        return m;
    });

    if (window.attachEvent) {
        function _relatedTarget(event) {
            var element;
            switch (event.type) {
                case 'mouseover':
                case 'mouseenter':
                    element = event.fromElement;
                    break;
                case 'mouseout':
                case 'mouseleave':
                    element = event.toElement;
                    break;
                default:
                    return null;
            }
            return Element.extend(element);
        }

        var additionalMethods = {
            stopPropagation: function () {
                this.cancelBubble = true
            },
            preventDefault: function () {
                this.returnValue = false
            },
            inspect: function () {
                return '[object Event]'
            }
        };

        Event.extend = function (event, element) {
            if (!event) return false;

            if (!isIELegacyEvent(event)) return event;

            if (event._extendedByPrototype) return event;
            event._extendedByPrototype = Prototype.emptyFunction;

            var pointer = Event.pointer(event);

            Object.extend(event, {
                target: event.srcElement || element,
                relatedTarget: _relatedTarget(event),
                pageX: pointer.x,
                pageY: pointer.y
            });

            Object.extend(event, methods);
            Object.extend(event, additionalMethods);

            return event;
        };
    } else {
        Event.extend = Prototype.K;
    }

    if (window.addEventListener) {
        Event.prototype = window.Event.prototype || document.createEvent('HTMLEvents').__proto__;
        Object.extend(Event.prototype, methods);
    }

    var EVENT_TRANSLATIONS = {
        mouseenter: 'mouseover',
        mouseleave: 'mouseout'
    };

    function getDOMEventName(eventName) {
        return EVENT_TRANSLATIONS[eventName] || eventName;
    }

    if (MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED)
        getDOMEventName = Prototype.K;

    function getUniqueElementID(element) {
        if (element === window) return 0;

        if (typeof element._prototypeUID === 'undefined')
            element._prototypeUID = Element.Storage.UID++;
        return element._prototypeUID;
    }

    function getUniqueElementID_IE(element) {
        if (element === window) return 0;
        if (element == document) return 1;
        return element.uniqueID;
    }

    if ('uniqueID' in DIV)
        getUniqueElementID = getUniqueElementID_IE;

    function isCustomEvent(eventName) {
        return eventName.include(':');
    }

    Event._isCustomEvent = isCustomEvent;

    function getRegistryForElement(element, uid) {
        var CACHE = GLOBAL.Event.cache;
        if (Object.isUndefined(uid))
            uid = getUniqueElementID(element);
        if (!CACHE[uid]) CACHE[uid] = {element: element};
        return CACHE[uid];
    }

    function destroyRegistryForElement(element, uid) {
        if (Object.isUndefined(uid))
            uid = getUniqueElementID(element);
        delete GLOBAL.Event.cache[uid];
    }


    function register(element, eventName, handler) {
        var registry = getRegistryForElement(element);
        if (!registry[eventName]) registry[eventName] = [];
        var entries = registry[eventName];

        var i = entries.length;
        while (i--)
            if (entries[i].handler === handler) return null;

        var uid = getUniqueElementID(element);
        var responder = GLOBAL.Event._createResponder(uid, eventName, handler);
        var entry = {
            responder: responder,
            handler: handler
        };

        entries.push(entry);
        return entry;
    }

    function unregister(element, eventName, handler) {
        var registry = getRegistryForElement(element);
        var entries = registry[eventName];
        if (!entries) return;

        var i = entries.length, entry;
        while (i--) {
            if (entries[i].handler === handler) {
                entry = entries[i];
                break;
            }
        }

        if (!entry) return;

        var index = entries.indexOf(entry);
        entries.splice(index, 1);

        return entry;
    }


    function observe(element, eventName, handler) {
        element = $(element);
        var entry = register(element, eventName, handler);

        if (entry === null) return element;

        var responder = entry.responder;
        if (isCustomEvent(eventName))
            observeCustomEvent(element, eventName, responder);
        else
            observeStandardEvent(element, eventName, responder);

        return element;
    }

    function observeStandardEvent(element, eventName, responder) {
        var actualEventName = getDOMEventName(eventName);
        if (element.addEventListener) {
            element.addEventListener(actualEventName, responder, false);
        } else {
            element.attachEvent('on' + actualEventName, responder);
        }
    }

    function observeCustomEvent(element, eventName, responder) {
        if (element.addEventListener) {
            element.addEventListener('dataavailable', responder, false);
        } else {
            element.attachEvent('ondataavailable', responder);
            element.attachEvent('onlosecapture', responder);
        }
    }

    function stopObserving(element, eventName, handler) {
        element = $(element);
        var handlerGiven = !Object.isUndefined(handler),
            eventNameGiven = !Object.isUndefined(eventName);

        if (!eventNameGiven && !handlerGiven) {
            stopObservingElement(element);
            return element;
        }

        if (!handlerGiven) {
            stopObservingEventName(element, eventName);
            return element;
        }

        var entry = unregister(element, eventName, handler);

        if (!entry) return element;
        removeEvent(element, eventName, entry.responder);
        return element;
    }

    function stopObservingStandardEvent(element, eventName, responder) {
        var actualEventName = getDOMEventName(eventName);
        if (element.removeEventListener) {
            element.removeEventListener(actualEventName, responder, false);
        } else {
            element.detachEvent('on' + actualEventName, responder);
        }
    }

    function stopObservingCustomEvent(element, eventName, responder) {
        if (element.removeEventListener) {
            element.removeEventListener('dataavailable', responder, false);
        } else {
            element.detachEvent('ondataavailable', responder);
            element.detachEvent('onlosecapture', responder);
        }
    }


    function stopObservingElement(element) {
        var uid = getUniqueElementID(element), registry = GLOBAL.Event.cache[uid];
        if (!registry) return;

        destroyRegistryForElement(element, uid);

        var entries, i;
        for (var eventName in registry) {
            if (eventName === 'element') continue;

            entries = registry[eventName];
            i = entries.length;
            while (i--)
                removeEvent(element, eventName, entries[i].responder);
        }
    }

    function stopObservingEventName(element, eventName) {
        var registry = getRegistryForElement(element);
        var entries = registry[eventName];
        if (!entries) return;
        delete registry[eventName];

        var i = entries.length;
        while (i--)
            removeEvent(element, eventName, entries[i].responder);
    }


    function removeEvent(element, eventName, handler) {
        if (isCustomEvent(eventName))
            stopObservingCustomEvent(element, eventName, handler);
        else
            stopObservingStandardEvent(element, eventName, handler);
    }


    function getFireTarget(element) {
        if (element !== document) return element;
        if (document.createEvent && !element.dispatchEvent)
            return document.documentElement;
        return element;
    }

    function fire(element, eventName, memo, bubble) {
        element = getFireTarget($(element));
        if (Object.isUndefined(bubble)) bubble = true;
        memo = memo || {};

        var event = fireEvent(element, eventName, memo, bubble);
        return Event.extend(event);
    }

    function fireEvent_DOM(element, eventName, memo, bubble) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent('dataavailable', bubble, true);

        event.eventName = eventName;
        event.memo = memo;

        element.dispatchEvent(event);
        return event;
    }

    function fireEvent_IE(element, eventName, memo, bubble) {
        var event = document.createEventObject();
        event.eventType = bubble ? 'ondataavailable' : 'onlosecapture';

        event.eventName = eventName;
        event.memo = memo;

        element.fireEvent(event.eventType, event);
        return event;
    }

    var fireEvent = document.createEvent ? fireEvent_DOM : fireEvent_IE;


    Event.Handler = Class.create({
        initialize: function (element, eventName, selector, callback) {
            this.element = $(element);
            this.eventName = eventName;
            this.selector = selector;
            this.callback = callback;
            this.handler = this.handleEvent.bind(this);
        },


        start: function () {
            Event.observe(this.element, this.eventName, this.handler);
            return this;
        },

        stop: function () {
            Event.stopObserving(this.element, this.eventName, this.handler);
            return this;
        },

        handleEvent: function (event) {
            var element = Event.findElement(event, this.selector);
            if (element) this.callback.call(this.element, event, element);
        }
    });

    function on(element, eventName, selector, callback) {
        element = $(element);
        if (Object.isFunction(selector) && Object.isUndefined(callback)) {
            callback = selector, selector = null;
        }

        return new Event.Handler(element, eventName, selector, callback).start();
    }

    Object.extend(Event, Event.Methods);

    Object.extend(Event, {
        fire: fire,
        observe: observe,
        stopObserving: stopObserving,
        on: on
    });

    Element.addMethods({
        fire: fire,

        observe: observe,

        stopObserving: stopObserving,

        on: on
    });

    Object.extend(document, {
        fire: fire.methodize(),

        observe: observe.methodize(),

        stopObserving: stopObserving.methodize(),

        on: on.methodize(),

        loaded: false
    });

    if (GLOBAL.Event) Object.extend(window.Event, Event);
    else GLOBAL.Event = Event;

    GLOBAL.Event.cache = {};

    function destroyCache_IE() {
        GLOBAL.Event.cache = null;
    }

    if (window.attachEvent)
        window.attachEvent('onunload', destroyCache_IE);

    DIV = null;
    docEl = null;
})(this);

(function (GLOBAL) {
    /* Code for creating leak-free event responders is based on work by
     John-David Dalton. */

    var docEl = document.documentElement;
    var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl
        && 'onmouseleave' in docEl;

    function isSimulatedMouseEnterLeaveEvent(eventName) {
        return !MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED &&
            (eventName === 'mouseenter' || eventName === 'mouseleave');
    }

    function createResponder(uid, eventName, handler) {
        if (Event._isCustomEvent(eventName))
            return createResponderForCustomEvent(uid, eventName, handler);
        if (isSimulatedMouseEnterLeaveEvent(eventName))
            return createMouseEnterLeaveResponder(uid, eventName, handler);

        return function (event) {
            if (!Event.cache) return;

            var element = Event.cache[uid].element;
            Event.extend(event, element);
            handler.call(element, event);
        };
    }

    function createResponderForCustomEvent(uid, eventName, handler) {
        return function (event) {
            var element = Event.cache[uid].element;

            if (Object.isUndefined(event.eventName))
                return false;

            if (event.eventName !== eventName)
                return false;

            Event.extend(event, element);
            handler.call(element, event);
        };
    }

    function createMouseEnterLeaveResponder(uid, eventName, handler) {
        return function (event) {
            var element = Event.cache[uid].element;

            Event.extend(event, element);
            var parent = event.relatedTarget;

            while (parent && parent !== element) {
                try {
                    parent = parent.parentNode;
                }
                catch (e) {
                    parent = element;
                }
            }

            if (parent === element) return;
            handler.call(element, event);
        }
    }

    GLOBAL.Event._createResponder = createResponder;
    docEl = null;
})(this);

(function (GLOBAL) {
    /* Support for the DOMContentLoaded event is based on work by Dan Webb,
     Matthias Miller, Dean Edwards, John Resig, and Diego Perini. */

    var TIMER;

    function fireContentLoadedEvent() {
        if (document.loaded) return;
        if (TIMER) window.clearTimeout(TIMER);
        document.loaded = true;
        document.fire('dom:loaded');
    }

    function checkReadyState() {
        if (document.readyState === 'complete') {
            document.detachEvent('onreadystatechange', checkReadyState);
            fireContentLoadedEvent();
        }
    }

    function pollDoScroll() {
        try {
            document.documentElement.doScroll('left');
        } catch (e) {
            TIMER = pollDoScroll.defer();
            return;
        }

        fireContentLoadedEvent();
    }


    if (document.readyState === 'complete') {
        fireContentLoadedEvent();
        return;
    }

    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
    } else {
        document.attachEvent('onreadystatechange', checkReadyState);
        if (window == top) TIMER = pollDoScroll.defer();
    }

    Event.observe(window, 'load', fireContentLoadedEvent);
})(this);


Element.addMethods();
/*------------------------------- DEPRECATED -------------------------------*/

Hash.toQueryString = Object.toQueryString;

var Toggle = {display: Element.toggle};

Element.Methods.childOf = Element.Methods.descendantOf;

var Insertion = {
    Before: function (element, content) {
        return Element.insert(element, {before: content});
    },

    Top: function (element, content) {
        return Element.insert(element, {top: content});
    },

    Bottom: function (element, content) {
        return Element.insert(element, {bottom: content});
    },

    After: function (element, content) {
        return Element.insert(element, {after: content});
    }
};

var $continue = new Error('"throw $continue" is deprecated, use "return" instead');

var Position = {
    includeScrollOffsets: false,

    prepare: function () {
        this.deltaX = window.pageXOffset
            || document.documentElement.scrollLeft
            || document.body.scrollLeft
            || 0;
        this.deltaY = window.pageYOffset
            || document.documentElement.scrollTop
            || document.body.scrollTop
            || 0;
    },

    within: function (element, x, y) {
        if (this.includeScrollOffsets)
            return this.withinIncludingScrolloffsets(element, x, y);
        this.xcomp = x;
        this.ycomp = y;
        this.offset = Element.cumulativeOffset(element);

        return (y >= this.offset[1] &&
        y < this.offset[1] + element.offsetHeight &&
        x >= this.offset[0] &&
        x < this.offset[0] + element.offsetWidth);
    },

    withinIncludingScrolloffsets: function (element, x, y) {
        var offsetcache = Element.cumulativeScrollOffset(element);

        this.xcomp = x + offsetcache[0] - this.deltaX;
        this.ycomp = y + offsetcache[1] - this.deltaY;
        this.offset = Element.cumulativeOffset(element);

        return (this.ycomp >= this.offset[1] &&
        this.ycomp < this.offset[1] + element.offsetHeight &&
        this.xcomp >= this.offset[0] &&
        this.xcomp < this.offset[0] + element.offsetWidth);
    },

    overlap: function (mode, element) {
        if (!mode) return 0;
        if (mode == 'vertical')
            return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
                element.offsetHeight;
        if (mode == 'horizontal')
            return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
                element.offsetWidth;
    },


    cumulativeOffset: Element.Methods.cumulativeOffset,

    positionedOffset: Element.Methods.positionedOffset,

    absolutize: function (element) {
        Position.prepare();
        return Element.absolutize(element);
    },

    relativize: function (element) {
        Position.prepare();
        return Element.relativize(element);
    },

    realOffset: Element.Methods.cumulativeScrollOffset,

    offsetParent: Element.Methods.getOffsetParent,

    page: Element.Methods.viewportOffset,

    clone: function (source, target, options) {
        options = options || {};
        return Element.clonePosition(target, source, options);
    }
};

/*--------------------------------------------------------------------------*/

if (!document.getElementsByClassName) document.getElementsByClassName = function (instanceMethods) {
    function iter(name) {
        return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
    }

    instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ?
        function (element, className) {
            className = className.toString().strip();
            var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
            return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
        } : function (element, className) {
        className = className.toString().strip();
        var elements = [], classNames = (/\s/.test(className) ? $w(className) : null);
        if (!classNames && !className) return elements;

        var nodes = $(element).getElementsByTagName('*');
        className = ' ' + className + ' ';

        for (var i = 0, child, cn; child = nodes[i]; i++) {
            if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) ||
                (classNames && classNames.all(function (name) {
                    return !name.toString().blank() && cn.include(' ' + name + ' ');
                }))))
                elements.push(Element.extend(child));
        }
        return elements;
    };

    return function (className, parentElement) {
        return $(parentElement || document.body).getElementsByClassName(className);
    };
}(Element.Methods);

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
    initialize: function (element) {
        this.element = $(element);
    },

    _each: function (iterator, context) {
        this.element.className.split(/\s+/).select(function (name) {
            return name.length > 0;
        })._each(iterator, context);
    },

    set: function (className) {
        this.element.className = className;
    },

    add: function (classNameToAdd) {
        if (this.include(classNameToAdd)) return;
        this.set($A(this).concat(classNameToAdd).join(' '));
    },

    remove: function (classNameToRemove) {
        if (!this.include(classNameToRemove)) return;
        this.set($A(this).without(classNameToRemove).join(' '));
    },

    toString: function () {
        return $A(this).join(' ');
    }
};

Object.extend(Element.ClassNames.prototype, Enumerable);

/*--------------------------------------------------------------------------*/

(function () {
    window.Selector = Class.create({
        initialize: function (expression) {
            this.expression = expression.strip();
        },

        findElements: function (rootElement) {
            return Prototype.Selector.select(this.expression, rootElement);
        },

        match: function (element) {
            return Prototype.Selector.match(element, this.expression);
        },

        toString: function () {
            return this.expression;
        },

        inspect: function () {
            return "#<Selector: " + this.expression + ">";
        }
    });

    Object.extend(Selector, {
        matchElements: function (elements, expression) {
            var match = Prototype.Selector.match,
                results = [];

            for (var i = 0, length = elements.length; i < length; i++) {
                var element = elements[i];
                if (match(element, expression)) {
                    results.push(Element.extend(element));
                }
            }
            return results;
        },

        findElement: function (elements, expression, index) {
            index = index || 0;
            var matchIndex = 0, element;
            for (var i = 0, length = elements.length; i < length; i++) {
                element = elements[i];
                if (Prototype.Selector.match(element, expression) && index === matchIndex++) {
                    return Element.extend(element);
                }
            }
        },

        findChildElements: function (element, expressions) {
            var selector = expressions.toArray().join(', ');
            return Prototype.Selector.select(selector, element || document);
        }
    });
})();