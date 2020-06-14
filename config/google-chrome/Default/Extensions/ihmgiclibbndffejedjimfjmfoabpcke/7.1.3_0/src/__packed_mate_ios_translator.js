/*
 * Mate's Safari Extension v1.1.0
 * Created: 09/19
 * Gikken UG, Twopeople Software eU (c)
 */

/**
 * Creates a Ping instance.
 * @returns {Ping}
 * @constructor
 */
var Ping = function (opt) {
    this.opt = opt || {};
    this.favicon = this.opt.favicon || "/favicon.ico";
    this.timeout = this.opt.timeout || 0;
};

/**
 * Pings source and triggers a callback when completed.
 * @param source Source of the website or server, including protocol and port.
 * @param callback Callback function to trigger when completed. Returns error and ping value.
 * @param timeout Optional number of milliseconds to wait before aborting.
 */
Ping.prototype.ping = function (source, callback) {
    try {
        this.img = new Image();
        var timer;

        var start = new Date();
        this.img.onload = pingCheck;
        this.img.onerror = pingCheck;
        if (this.timeout) {
            timer = setTimeout(pingCheck, this.timeout);
        }

        /**
         * Times ping and triggers callback.
         */
        function pingCheck(e) {
            if (timer) {
                clearTimeout(timer);
            }
            var pong = new Date() - start;

            if (typeof callback === "function") {
                if (e.type === "error") {
                    //console.log("error loading resource");
                    return callback("error", pong);
                }

                return callback(null, pong);
            }
        }


        this.img.src = source + this.favicon + "?" + (+new Date()); // Trigger image load with cache buster
    } catch (e) {
    }
};

/*!
 * jQuery JavaScript Library v3.4.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2019-05-01T21:04Z
 */
( function( global, factory ) {

    "use strict";

    if ( typeof module === "object" && typeof module.exports === "object" ) {

        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jQuery.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var jQuery = require("jquery")(window);
        // See ticket #14549 for more info.
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "jQuery requires a window with a document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
    "use strict";

    var arr = [];

    var document = window.document;

    var getProto = Object.getPrototypeOf;

    var slice = arr.slice;

    var concat = arr.concat;

    var push = arr.push;

    var indexOf = arr.indexOf;

    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;

    var fnToString = hasOwn.toString;

    var ObjectFunctionString = fnToString.call( Object );

    var support = {};

    var isFunction = function isFunction( obj ) {

        // Support: Chrome <=57, Firefox <=52
        // In some browsers, typeof returns "function" for HTML <object> elements
        // (i.e., `typeof document.createElement( "object" ) === "function"`).
        // We don't want to classify *any* DOM node as a function.
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    };


    var isWindow = function isWindow( obj ) {
        return obj != null && obj === obj.window;
    };




    var preservedScriptAttributes = {
        type: true,
        src: true,
        nonce: true,
        noModule: true
    };

    function DOMEval( code, node, doc ) {
        doc = doc || document;

        var i, val,
            script = doc.createElement( "script" );

        script.text = code;
        if ( node ) {
            for ( i in preservedScriptAttributes ) {

                // Support: Firefox 64+, Edge 18+
                // Some browsers don't support the "nonce" property on scripts.
                // On the other hand, just using `getAttribute` is not enough as
                // the `nonce` attribute is reset to an empty string whenever it
                // becomes browsing-context connected.
                // See https://github.com/whatwg/html/issues/2369
                // See https://html.spec.whatwg.org/#nonce-attributes
                // The `node.getAttribute` check was added for the sake of
                // `jQuery.globalEval` so that it can fake a nonce-containing node
                // via an object.
                val = node[ i ] || node.getAttribute && node.getAttribute( i );
                if ( val ) {
                    script.setAttribute( i, val );
                }
            }
        }
        doc.head.appendChild( script ).parentNode.removeChild( script );
    }


    function toType( obj ) {
        if ( obj == null ) {
            return obj + "";
        }

        // Support: Android <=2.3 only (functionish RegExp)
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[ toString.call( obj ) ] || "object" :
            typeof obj;
    }
    /* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



    var
        version = "3.4.1",

        // Define a local copy of jQuery
        jQuery = function( selector, context ) {

            // The jQuery object is actually just the init constructor 'enhanced'
            // Need init if jQuery is called (just allow error to be thrown if not included)
            return new jQuery.fn.init( selector, context );
        },

        // Support: Android <=4.0 only
        // Make sure we trim BOM and NBSP
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    jQuery.fn = jQuery.prototype = {

        // The current version of jQuery being used
        jquery: version,

        constructor: jQuery,

        // The default length of a jQuery object is 0
        length: 0,

        toArray: function() {
            return slice.call( this );
        },

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function( num ) {

            // Return all the elements in a clean array
            if ( num == null ) {
                return slice.call( this );
            }

            // Return just the one element from the set
            return num < 0 ? this[ num + this.length ] : this[ num ];
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function( elems ) {

            // Build a new jQuery matched element set
            var ret = jQuery.merge( this.constructor(), elems );

            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;

            // Return the newly-formed element set
            return ret;
        },

        // Execute a callback for every element in the matched set.
        each: function( callback ) {
            return jQuery.each( this, callback );
        },

        map: function( callback ) {
            return this.pushStack( jQuery.map( this, function( elem, i ) {
                return callback.call( elem, i, elem );
            } ) );
        },

        slice: function() {
            return this.pushStack( slice.apply( this, arguments ) );
        },

        first: function() {
            return this.eq( 0 );
        },

        last: function() {
            return this.eq( -1 );
        },

        eq: function( i ) {
            var len = this.length,
                j = +i + ( i < 0 ? len : 0 );
            return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
        },

        end: function() {
            return this.prevObject || this.constructor();
        },

        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: push,
        sort: arr.sort,
        splice: arr.splice
    };

    jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[ 0 ] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;

            // Skip the boolean and the target
            target = arguments[ i ] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !isFunction( target ) ) {
            target = {};
        }

        // Extend jQuery itself if only one argument is passed
        if ( i === length ) {
            target = this;
            i--;
        }

        for ( ; i < length; i++ ) {

            // Only deal with non-null/undefined values
            if ( ( options = arguments[ i ] ) != null ) {

                // Extend the base object
                for ( name in options ) {
                    copy = options[ name ];

                    // Prevent Object.prototype pollution
                    // Prevent never-ending loop
                    if ( name === "__proto__" || target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
                        ( copyIsArray = Array.isArray( copy ) ) ) ) {
                        src = target[ name ];

                        // Ensure proper type for the source value
                        if ( copyIsArray && !Array.isArray( src ) ) {
                            clone = [];
                        } else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
                            clone = {};
                        } else {
                            clone = src;
                        }
                        copyIsArray = false;

                        // Never move original objects, clone them
                        target[ name ] = jQuery.extend( deep, clone, copy );

                        // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    jQuery.extend( {

        // Unique for each copy of jQuery on the page
        expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

        // Assume jQuery is ready without the ready module
        isReady: true,

        error: function( msg ) {
            throw new Error( msg );
        },

        noop: function() {},

        isPlainObject: function( obj ) {
            var proto, Ctor;

            // Detect obvious negatives
            // Use toString instead of jQuery.type to catch host objects
            if ( !obj || toString.call( obj ) !== "[object Object]" ) {
                return false;
            }

            proto = getProto( obj );

            // Objects with no prototype (e.g., `Object.create( null )`) are plain
            if ( !proto ) {
                return true;
            }

            // Objects with prototype are plain iff they were constructed by a global Object function
            Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
            return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
        },

        isEmptyObject: function( obj ) {
            var name;

            for ( name in obj ) {
                return false;
            }
            return true;
        },

        // Evaluates a script in a global context
        globalEval: function( code, options ) {
            DOMEval( code, { nonce: options && options.nonce } );
        },

        each: function( obj, callback ) {
            var length, i = 0;

            if ( isArrayLike( obj ) ) {
                length = obj.length;
                for ( ; i < length; i++ ) {
                    if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                        break;
                    }
                }
            } else {
                for ( i in obj ) {
                    if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                        break;
                    }
                }
            }

            return obj;
        },

        // Support: Android <=4.0 only
        trim: function( text ) {
            return text == null ?
                "" :
                ( text + "" ).replace( rtrim, "" );
        },

        // results is for internal usage only
        makeArray: function( arr, results ) {
            var ret = results || [];

            if ( arr != null ) {
                if ( isArrayLike( Object( arr ) ) ) {
                    jQuery.merge( ret,
                        typeof arr === "string" ?
                            [ arr ] : arr
                    );
                } else {
                    push.call( ret, arr );
                }
            }

            return ret;
        },

        inArray: function( elem, arr, i ) {
            return arr == null ? -1 : indexOf.call( arr, elem, i );
        },

        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        merge: function( first, second ) {
            var len = +second.length,
                j = 0,
                i = first.length;

            for ( ; j < len; j++ ) {
                first[ i++ ] = second[ j ];
            }

            first.length = i;

            return first;
        },

        grep: function( elems, callback, invert ) {
            var callbackInverse,
                matches = [],
                i = 0,
                length = elems.length,
                callbackExpect = !invert;

            // Go through the array, only saving the items
            // that pass the validator function
            for ( ; i < length; i++ ) {
                callbackInverse = !callback( elems[ i ], i );
                if ( callbackInverse !== callbackExpect ) {
                    matches.push( elems[ i ] );
                }
            }

            return matches;
        },

        // arg is for internal usage only
        map: function( elems, callback, arg ) {
            var length, value,
                i = 0,
                ret = [];

            // Go through the array, translating each of the items to their new values
            if ( isArrayLike( elems ) ) {
                length = elems.length;
                for ( ; i < length; i++ ) {
                    value = callback( elems[ i ], i, arg );

                    if ( value != null ) {
                        ret.push( value );
                    }
                }

                // Go through every key on the object,
            } else {
                for ( i in elems ) {
                    value = callback( elems[ i ], i, arg );

                    if ( value != null ) {
                        ret.push( value );
                    }
                }
            }

            // Flatten any nested arrays
            return concat.apply( [], ret );
        },

        // A global GUID counter for objects
        guid: 1,

        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support: support
    } );

    if ( typeof Symbol === "function" ) {
        jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
    }

// Populate the class2type map
    jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
        function( i, name ) {
            class2type[ "[object " + name + "]" ] = name.toLowerCase();
        } );

    function isArrayLike( obj ) {

        // Support: real iOS 8.2 only (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var length = !!obj && "length" in obj && obj.length,
            type = toType( obj );

        if ( isFunction( obj ) || isWindow( obj ) ) {
            return false;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in obj;
    }
    var Sizzle =
        /*!
 * Sizzle CSS Selector Engine v2.3.4
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2019-04-08
 */
        (function( window ) {

            var i,
                support,
                Expr,
                getText,
                isXML,
                tokenize,
                compile,
                select,
                outermostContext,
                sortInput,
                hasDuplicate,

                // Local document vars
                setDocument,
                document,
                docElem,
                documentIsHTML,
                rbuggyQSA,
                rbuggyMatches,
                matches,
                contains,

                // Instance-specific data
                expando = "sizzle" + 1 * new Date(),
                preferredDoc = window.document,
                dirruns = 0,
                done = 0,
                classCache = createCache(),
                tokenCache = createCache(),
                compilerCache = createCache(),
                nonnativeSelectorCache = createCache(),
                sortOrder = function( a, b ) {
                    if ( a === b ) {
                        hasDuplicate = true;
                    }
                    return 0;
                },

                // Instance methods
                hasOwn = ({}).hasOwnProperty,
                arr = [],
                pop = arr.pop,
                push_native = arr.push,
                push = arr.push,
                slice = arr.slice,
                // Use a stripped-down indexOf as it's faster than native
                // https://jsperf.com/thor-indexof-vs-for/5
                indexOf = function( list, elem ) {
                    var i = 0,
                        len = list.length;
                    for ( ; i < len; i++ ) {
                        if ( list[i] === elem ) {
                            return i;
                        }
                    }
                    return -1;
                },

                booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

                // Regular expressions

                // http://www.w3.org/TR/css3-selectors/#whitespace
                whitespace = "[\\x20\\t\\r\\n\\f]",

                // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
                identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

                // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
                attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
                    // Operator (capture 2)
                    "*([*^$|!~]?=)" + whitespace +
                    // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
                    "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
                    "*\\]",

                pseudos = ":(" + identifier + ")(?:\\((" +
                    // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
                    // 1. quoted (capture 3; capture 4 or capture 5)
                    "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
                    // 2. simple (capture 6)
                    "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
                    // 3. anything else (capture 2)
                    ".*" +
                    ")\\)|)",

                // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
                rwhitespace = new RegExp( whitespace + "+", "g" ),
                rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

                rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
                rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
                rdescend = new RegExp( whitespace + "|>" ),

                rpseudo = new RegExp( pseudos ),
                ridentifier = new RegExp( "^" + identifier + "$" ),

                matchExpr = {
                    "ID": new RegExp( "^#(" + identifier + ")" ),
                    "CLASS": new RegExp( "^\\.(" + identifier + ")" ),
                    "TAG": new RegExp( "^(" + identifier + "|[*])" ),
                    "ATTR": new RegExp( "^" + attributes ),
                    "PSEUDO": new RegExp( "^" + pseudos ),
                    "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                        "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                        "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
                    "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
                    // For use in libraries implementing .is()
                    // We use this for POS matching in `select`
                    "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                        whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
                },

                rhtml = /HTML$/i,
                rinputs = /^(?:input|select|textarea|button)$/i,
                rheader = /^h\d$/i,

                rnative = /^[^{]+\{\s*\[native \w/,

                // Easily-parseable/retrievable ID or TAG or CLASS selectors
                rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

                rsibling = /[+~]/,

                // CSS escapes
                // http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
                runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
                funescape = function( _, escaped, escapedWhitespace ) {
                    var high = "0x" + escaped - 0x10000;
                    // NaN means non-codepoint
                    // Support: Firefox<24
                    // Workaround erroneous numeric interpretation of +"0x"
                    return high !== high || escapedWhitespace ?
                        escaped :
                        high < 0 ?
                            // BMP codepoint
                            String.fromCharCode( high + 0x10000 ) :
                            // Supplemental Plane codepoint (surrogate pair)
                            String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
                },

                // CSS string/identifier serialization
                // https://drafts.csswg.org/cssom/#common-serializing-idioms
                rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
                fcssescape = function( ch, asCodePoint ) {
                    if ( asCodePoint ) {

                        // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
                        if ( ch === "\0" ) {
                            return "\uFFFD";
                        }

                        // Control characters and (dependent upon position) numbers get escaped as code points
                        return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
                    }

                    // Other potentially-special ASCII characters get backslash-escaped
                    return "\\" + ch;
                },

                // Used for iframes
                // See setDocument()
                // Removing the function wrapper causes a "Permission Denied"
                // error in IE
                unloadHandler = function() {
                    setDocument();
                },

                inDisabledFieldset = addCombinator(
                    function( elem ) {
                        return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
                    },
                    { dir: "parentNode", next: "legend" }
                );

// Optimize for push.apply( _, NodeList )
            try {
                push.apply(
                    (arr = slice.call( preferredDoc.childNodes )),
                    preferredDoc.childNodes
                );
                // Support: Android<4.0
                // Detect silently failing push.apply
                arr[ preferredDoc.childNodes.length ].nodeType;
            } catch ( e ) {
                push = { apply: arr.length ?

                        // Leverage slice if possible
                        function( target, els ) {
                            push_native.apply( target, slice.call(els) );
                        } :

                        // Support: IE<9
                        // Otherwise append directly
                        function( target, els ) {
                            var j = target.length,
                                i = 0;
                            // Can't trust NodeList.length
                            while ( (target[j++] = els[i++]) ) {}
                            target.length = j - 1;
                        }
                };
            }

            function Sizzle( selector, context, results, seed ) {
                var m, i, elem, nid, match, groups, newSelector,
                    newContext = context && context.ownerDocument,

                    // nodeType defaults to 9, since context defaults to document
                    nodeType = context ? context.nodeType : 9;

                results = results || [];

                // Return early from calls with invalid selector or context
                if ( typeof selector !== "string" || !selector ||
                    nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

                    return results;
                }

                // Try to shortcut find operations (as opposed to filters) in HTML documents
                if ( !seed ) {

                    if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
                        setDocument( context );
                    }
                    context = context || document;

                    if ( documentIsHTML ) {

                        // If the selector is sufficiently simple, try using a "get*By*" DOM method
                        // (excepting DocumentFragment context, where the methods don't exist)
                        if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

                            // ID selector
                            if ( (m = match[1]) ) {

                                // Document context
                                if ( nodeType === 9 ) {
                                    if ( (elem = context.getElementById( m )) ) {

                                        // Support: IE, Opera, Webkit
                                        // TODO: identify versions
                                        // getElementById can match elements by name instead of ID
                                        if ( elem.id === m ) {
                                            results.push( elem );
                                            return results;
                                        }
                                    } else {
                                        return results;
                                    }

                                    // Element context
                                } else {

                                    // Support: IE, Opera, Webkit
                                    // TODO: identify versions
                                    // getElementById can match elements by name instead of ID
                                    if ( newContext && (elem = newContext.getElementById( m )) &&
                                        contains( context, elem ) &&
                                        elem.id === m ) {

                                        results.push( elem );
                                        return results;
                                    }
                                }

                                // Type selector
                            } else if ( match[2] ) {
                                push.apply( results, context.getElementsByTagName( selector ) );
                                return results;

                                // Class selector
                            } else if ( (m = match[3]) && support.getElementsByClassName &&
                                context.getElementsByClassName ) {

                                push.apply( results, context.getElementsByClassName( m ) );
                                return results;
                            }
                        }

                        // Take advantage of querySelectorAll
                        if ( support.qsa &&
                            !nonnativeSelectorCache[ selector + " " ] &&
                            (!rbuggyQSA || !rbuggyQSA.test( selector )) &&

                            // Support: IE 8 only
                            // Exclude object elements
                            (nodeType !== 1 || context.nodeName.toLowerCase() !== "object") ) {

                            newSelector = selector;
                            newContext = context;

                            // qSA considers elements outside a scoping root when evaluating child or
                            // descendant combinators, which is not what we want.
                            // In such cases, we work around the behavior by prefixing every selector in the
                            // list with an ID selector referencing the scope context.
                            // Thanks to Andrew Dupont for this technique.
                            if ( nodeType === 1 && rdescend.test( selector ) ) {

                                // Capture the context ID, setting it first if necessary
                                if ( (nid = context.getAttribute( "id" )) ) {
                                    nid = nid.replace( rcssescape, fcssescape );
                                } else {
                                    context.setAttribute( "id", (nid = expando) );
                                }

                                // Prefix every selector in the list
                                groups = tokenize( selector );
                                i = groups.length;
                                while ( i-- ) {
                                    groups[i] = "#" + nid + " " + toSelector( groups[i] );
                                }
                                newSelector = groups.join( "," );

                                // Expand context for sibling selectors
                                newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
                                    context;
                            }

                            try {
                                push.apply( results,
                                    newContext.querySelectorAll( newSelector )
                                );
                                return results;
                            } catch ( qsaError ) {
                                nonnativeSelectorCache( selector, true );
                            } finally {
                                if ( nid === expando ) {
                                    context.removeAttribute( "id" );
                                }
                            }
                        }
                    }
                }

                // All others
                return select( selector.replace( rtrim, "$1" ), context, results, seed );
            }

            /**
             * Create key-value caches of limited size
             * @returns {function(string, object)} Returns the Object data after storing it on itself with
             *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
             *	deleting the oldest entry
             */
            function createCache() {
                var keys = [];

                function cache( key, value ) {
                    // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                    if ( keys.push( key + " " ) > Expr.cacheLength ) {
                        // Only keep the most recent entries
                        delete cache[ keys.shift() ];
                    }
                    return (cache[ key + " " ] = value);
                }
                return cache;
            }

            /**
             * Mark a function for special use by Sizzle
             * @param {Function} fn The function to mark
             */
            function markFunction( fn ) {
                fn[ expando ] = true;
                return fn;
            }

            /**
             * Support testing using an element
             * @param {Function} fn Passed the created element and returns a boolean result
             */
            function assert( fn ) {
                var el = document.createElement("fieldset");

                try {
                    return !!fn( el );
                } catch (e) {
                    return false;
                } finally {
                    // Remove from its parent by default
                    if ( el.parentNode ) {
                        el.parentNode.removeChild( el );
                    }
                    // release memory in IE
                    el = null;
                }
            }

            /**
             * Adds the same handler for all of the specified attrs
             * @param {String} attrs Pipe-separated list of attributes
             * @param {Function} handler The method that will be applied
             */
            function addHandle( attrs, handler ) {
                var arr = attrs.split("|"),
                    i = arr.length;

                while ( i-- ) {
                    Expr.attrHandle[ arr[i] ] = handler;
                }
            }

            /**
             * Checks document order of two siblings
             * @param {Element} a
             * @param {Element} b
             * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
             */
            function siblingCheck( a, b ) {
                var cur = b && a,
                    diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
                        a.sourceIndex - b.sourceIndex;

                // Use IE sourceIndex if available on both nodes
                if ( diff ) {
                    return diff;
                }

                // Check if b follows a
                if ( cur ) {
                    while ( (cur = cur.nextSibling) ) {
                        if ( cur === b ) {
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
            function createInputPseudo( type ) {
                return function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === type;
                };
            }

            /**
             * Returns a function to use in pseudos for buttons
             * @param {String} type
             */
            function createButtonPseudo( type ) {
                return function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return (name === "input" || name === "button") && elem.type === type;
                };
            }

            /**
             * Returns a function to use in pseudos for :enabled/:disabled
             * @param {Boolean} disabled true for :disabled; false for :enabled
             */
            function createDisabledPseudo( disabled ) {

                // Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
                return function( elem ) {

                    // Only certain elements can match :enabled or :disabled
                    // https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
                    // https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
                    if ( "form" in elem ) {

                        // Check for inherited disabledness on relevant non-disabled elements:
                        // * listed form-associated elements in a disabled fieldset
                        //   https://html.spec.whatwg.org/multipage/forms.html#category-listed
                        //   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
                        // * option elements in a disabled optgroup
                        //   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
                        // All such elements have a "form" property.
                        if ( elem.parentNode && elem.disabled === false ) {

                            // Option elements defer to a parent optgroup if present
                            if ( "label" in elem ) {
                                if ( "label" in elem.parentNode ) {
                                    return elem.parentNode.disabled === disabled;
                                } else {
                                    return elem.disabled === disabled;
                                }
                            }

                            // Support: IE 6 - 11
                            // Use the isDisabled shortcut property to check for disabled fieldset ancestors
                            return elem.isDisabled === disabled ||

                                // Where there is no isDisabled, check manually
                                /* jshint -W018 */
                                elem.isDisabled !== !disabled &&
                                inDisabledFieldset( elem ) === disabled;
                        }

                        return elem.disabled === disabled;

                        // Try to winnow out elements that can't be disabled before trusting the disabled property.
                        // Some victims get caught in our net (label, legend, menu, track), but it shouldn't
                        // even exist on them, let alone have a boolean value.
                    } else if ( "label" in elem ) {
                        return elem.disabled === disabled;
                    }

                    // Remaining elements are neither :enabled nor :disabled
                    return false;
                };
            }

            /**
             * Returns a function to use in pseudos for positionals
             * @param {Function} fn
             */
            function createPositionalPseudo( fn ) {
                return markFunction(function( argument ) {
                    argument = +argument;
                    return markFunction(function( seed, matches ) {
                        var j,
                            matchIndexes = fn( [], seed.length, argument ),
                            i = matchIndexes.length;

                        // Match elements found at the specified indexes
                        while ( i-- ) {
                            if ( seed[ (j = matchIndexes[i]) ] ) {
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
            function testContext( context ) {
                return context && typeof context.getElementsByTagName !== "undefined" && context;
            }

// Expose support vars for convenience
            support = Sizzle.support = {};

            /**
             * Detects XML nodes
             * @param {Element|Object} elem An element or a document
             * @returns {Boolean} True iff elem is a non-HTML XML node
             */
            isXML = Sizzle.isXML = function( elem ) {
                var namespace = elem.namespaceURI,
                    docElem = (elem.ownerDocument || elem).documentElement;

                // Support: IE <=8
                // Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
                // https://bugs.jquery.com/ticket/4833
                return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
            };

            /**
             * Sets document-related variables once based on the current document
             * @param {Element|Object} [doc] An element or document object to use to set the document
             * @returns {Object} Returns the current document
             */
            setDocument = Sizzle.setDocument = function( node ) {
                var hasCompare, subWindow,
                    doc = node ? node.ownerDocument || node : preferredDoc;

                // Return early if doc is invalid or already selected
                if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
                    return document;
                }

                // Update global variables
                document = doc;
                docElem = document.documentElement;
                documentIsHTML = !isXML( document );

                // Support: IE 9-11, Edge
                // Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
                if ( preferredDoc !== document &&
                    (subWindow = document.defaultView) && subWindow.top !== subWindow ) {

                    // Support: IE 11, Edge
                    if ( subWindow.addEventListener ) {
                        subWindow.addEventListener( "unload", unloadHandler, false );

                        // Support: IE 9 - 10 only
                    } else if ( subWindow.attachEvent ) {
                        subWindow.attachEvent( "onunload", unloadHandler );
                    }
                }

                /* Attributes
	---------------------------------------------------------------------- */

                // Support: IE<8
                // Verify that getAttribute really returns attributes and not properties
                // (excepting IE8 booleans)
                support.attributes = assert(function( el ) {
                    el.className = "i";
                    return !el.getAttribute("className");
                });

                /* getElement(s)By*
	---------------------------------------------------------------------- */

                // Check if getElementsByTagName("*") returns only elements
                support.getElementsByTagName = assert(function( el ) {
                    el.appendChild( document.createComment("") );
                    return !el.getElementsByTagName("*").length;
                });

                // Support: IE<9
                support.getElementsByClassName = rnative.test( document.getElementsByClassName );

                // Support: IE<10
                // Check if getElementById returns elements by name
                // The broken getElementById methods don't pick up programmatically-set names,
                // so use a roundabout getElementsByName test
                support.getById = assert(function( el ) {
                    docElem.appendChild( el ).id = expando;
                    return !document.getElementsByName || !document.getElementsByName( expando ).length;
                });

                // ID filter and find
                if ( support.getById ) {
                    Expr.filter["ID"] = function( id ) {
                        var attrId = id.replace( runescape, funescape );
                        return function( elem ) {
                            return elem.getAttribute("id") === attrId;
                        };
                    };
                    Expr.find["ID"] = function( id, context ) {
                        if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
                            var elem = context.getElementById( id );
                            return elem ? [ elem ] : [];
                        }
                    };
                } else {
                    Expr.filter["ID"] =  function( id ) {
                        var attrId = id.replace( runescape, funescape );
                        return function( elem ) {
                            var node = typeof elem.getAttributeNode !== "undefined" &&
                                elem.getAttributeNode("id");
                            return node && node.value === attrId;
                        };
                    };

                    // Support: IE 6 - 7 only
                    // getElementById is not reliable as a find shortcut
                    Expr.find["ID"] = function( id, context ) {
                        if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
                            var node, i, elems,
                                elem = context.getElementById( id );

                            if ( elem ) {

                                // Verify the id attribute
                                node = elem.getAttributeNode("id");
                                if ( node && node.value === id ) {
                                    return [ elem ];
                                }

                                // Fall back on getElementsByName
                                elems = context.getElementsByName( id );
                                i = 0;
                                while ( (elem = elems[i++]) ) {
                                    node = elem.getAttributeNode("id");
                                    if ( node && node.value === id ) {
                                        return [ elem ];
                                    }
                                }
                            }

                            return [];
                        }
                    };
                }

                // Tag
                Expr.find["TAG"] = support.getElementsByTagName ?
                    function( tag, context ) {
                        if ( typeof context.getElementsByTagName !== "undefined" ) {
                            return context.getElementsByTagName( tag );

                            // DocumentFragment nodes don't have gEBTN
                        } else if ( support.qsa ) {
                            return context.querySelectorAll( tag );
                        }
                    } :

                    function( tag, context ) {
                        var elem,
                            tmp = [],
                            i = 0,
                            // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                            results = context.getElementsByTagName( tag );

                        // Filter out possible comments
                        if ( tag === "*" ) {
                            while ( (elem = results[i++]) ) {
                                if ( elem.nodeType === 1 ) {
                                    tmp.push( elem );
                                }
                            }

                            return tmp;
                        }
                        return results;
                    };

                // Class
                Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
                    if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
                        return context.getElementsByClassName( className );
                    }
                };

                /* QSA/matchesSelector
	---------------------------------------------------------------------- */

                // QSA and matchesSelector support

                // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
                rbuggyMatches = [];

                // qSa(:focus) reports false when true (Chrome 21)
                // We allow this because of a bug in IE8/9 that throws an error
                // whenever `document.activeElement` is accessed on an iframe
                // So, we allow :focus to pass through QSA all the time to avoid the IE error
                // See https://bugs.jquery.com/ticket/13378
                rbuggyQSA = [];

                if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
                    // Build QSA regex
                    // Regex strategy adopted from Diego Perini
                    assert(function( el ) {
                        // Select is set to empty string on purpose
                        // This is to test IE's treatment of not explicitly
                        // setting a boolean content attribute,
                        // since its presence should be enough
                        // https://bugs.jquery.com/ticket/12359
                        docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
                            "<select id='" + expando + "-\r\\' msallowcapture=''>" +
                            "<option selected=''></option></select>";

                        // Support: IE8, Opera 11-12.16
                        // Nothing should be selected when empty strings follow ^= or $= or *=
                        // The test attribute must be unknown in Opera but "safe" for WinRT
                        // https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
                        if ( el.querySelectorAll("[msallowcapture^='']").length ) {
                            rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
                        }

                        // Support: IE8
                        // Boolean attributes and "value" are not treated correctly
                        if ( !el.querySelectorAll("[selected]").length ) {
                            rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
                        }

                        // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
                        if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
                            rbuggyQSA.push("~=");
                        }

                        // Webkit/Opera - :checked should return selected option elements
                        // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                        // IE8 throws error here and will not see later tests
                        if ( !el.querySelectorAll(":checked").length ) {
                            rbuggyQSA.push(":checked");
                        }

                        // Support: Safari 8+, iOS 8+
                        // https://bugs.webkit.org/show_bug.cgi?id=136851
                        // In-page `selector#id sibling-combinator selector` fails
                        if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
                            rbuggyQSA.push(".#.+[+~]");
                        }
                    });

                    assert(function( el ) {
                        el.innerHTML = "<a href='' disabled='disabled'></a>" +
                            "<select disabled='disabled'><option/></select>";

                        // Support: Windows 8 Native Apps
                        // The type and name attributes are restricted during .innerHTML assignment
                        var input = document.createElement("input");
                        input.setAttribute( "type", "hidden" );
                        el.appendChild( input ).setAttribute( "name", "D" );

                        // Support: IE8
                        // Enforce case-sensitivity of name attribute
                        if ( el.querySelectorAll("[name=d]").length ) {
                            rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
                        }

                        // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                        // IE8 throws error here and will not see later tests
                        if ( el.querySelectorAll(":enabled").length !== 2 ) {
                            rbuggyQSA.push( ":enabled", ":disabled" );
                        }

                        // Support: IE9-11+
                        // IE's :disabled selector does not pick up the children of disabled fieldsets
                        docElem.appendChild( el ).disabled = true;
                        if ( el.querySelectorAll(":disabled").length !== 2 ) {
                            rbuggyQSA.push( ":enabled", ":disabled" );
                        }

                        // Opera 10-11 does not throw on post-comma invalid pseudos
                        el.querySelectorAll("*,:x");
                        rbuggyQSA.push(",.*:");
                    });
                }

                if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
                    docElem.webkitMatchesSelector ||
                    docElem.mozMatchesSelector ||
                    docElem.oMatchesSelector ||
                    docElem.msMatchesSelector) )) ) {

                    assert(function( el ) {
                        // Check to see if it's possible to do matchesSelector
                        // on a disconnected node (IE 9)
                        support.disconnectedMatch = matches.call( el, "*" );

                        // This should fail with an exception
                        // Gecko does not error, returns false instead
                        matches.call( el, "[s!='']:x" );
                        rbuggyMatches.push( "!=", pseudos );
                    });
                }

                rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
                rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

                /* Contains
	---------------------------------------------------------------------- */
                hasCompare = rnative.test( docElem.compareDocumentPosition );

                // Element contains another
                // Purposefully self-exclusive
                // As in, an element does not contain itself
                contains = hasCompare || rnative.test( docElem.contains ) ?
                    function( a, b ) {
                        var adown = a.nodeType === 9 ? a.documentElement : a,
                            bup = b && b.parentNode;
                        return a === bup || !!( bup && bup.nodeType === 1 && (
                            adown.contains ?
                                adown.contains( bup ) :
                                a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
                        ));
                    } :
                    function( a, b ) {
                        if ( b ) {
                            while ( (b = b.parentNode) ) {
                                if ( b === a ) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };

                /* Sorting
	---------------------------------------------------------------------- */

                // Document order sorting
                sortOrder = hasCompare ?
                    function( a, b ) {

                        // Flag for duplicate removal
                        if ( a === b ) {
                            hasDuplicate = true;
                            return 0;
                        }

                        // Sort on method existence if only one input has compareDocumentPosition
                        var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                        if ( compare ) {
                            return compare;
                        }

                        // Calculate position if both inputs belong to the same document
                        compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
                            a.compareDocumentPosition( b ) :

                            // Otherwise we know they are disconnected
                            1;

                        // Disconnected nodes
                        if ( compare & 1 ||
                            (!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

                            // Choose the first element that is related to our preferred document
                            if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
                                return -1;
                            }
                            if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
                                return 1;
                            }

                            // Maintain original order
                            return sortInput ?
                                ( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
                                0;
                        }

                        return compare & 4 ? -1 : 1;
                    } :
                    function( a, b ) {
                        // Exit early if the nodes are identical
                        if ( a === b ) {
                            hasDuplicate = true;
                            return 0;
                        }

                        var cur,
                            i = 0,
                            aup = a.parentNode,
                            bup = b.parentNode,
                            ap = [ a ],
                            bp = [ b ];

                        // Parentless nodes are either documents or disconnected
                        if ( !aup || !bup ) {
                            return a === document ? -1 :
                                b === document ? 1 :
                                    aup ? -1 :
                                        bup ? 1 :
                                            sortInput ?
                                                ( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
                                                0;

                            // If the nodes are siblings, we can do a quick check
                        } else if ( aup === bup ) {
                            return siblingCheck( a, b );
                        }

                        // Otherwise we need full lists of their ancestors for comparison
                        cur = a;
                        while ( (cur = cur.parentNode) ) {
                            ap.unshift( cur );
                        }
                        cur = b;
                        while ( (cur = cur.parentNode) ) {
                            bp.unshift( cur );
                        }

                        // Walk down the tree looking for a discrepancy
                        while ( ap[i] === bp[i] ) {
                            i++;
                        }

                        return i ?
                            // Do a sibling check if the nodes have a common ancestor
                            siblingCheck( ap[i], bp[i] ) :

                            // Otherwise nodes in our document sort first
                            ap[i] === preferredDoc ? -1 :
                                bp[i] === preferredDoc ? 1 :
                                    0;
                    };

                return document;
            };

            Sizzle.matches = function( expr, elements ) {
                return Sizzle( expr, null, null, elements );
            };

            Sizzle.matchesSelector = function( elem, expr ) {
                // Set document vars if needed
                if ( ( elem.ownerDocument || elem ) !== document ) {
                    setDocument( elem );
                }

                if ( support.matchesSelector && documentIsHTML &&
                    !nonnativeSelectorCache[ expr + " " ] &&
                    ( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
                    ( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

                    try {
                        var ret = matches.call( elem, expr );

                        // IE 9's matchesSelector returns false on disconnected nodes
                        if ( ret || support.disconnectedMatch ||
                            // As well, disconnected nodes are said to be in a document
                            // fragment in IE 9
                            elem.document && elem.document.nodeType !== 11 ) {
                            return ret;
                        }
                    } catch (e) {
                        nonnativeSelectorCache( expr, true );
                    }
                }

                return Sizzle( expr, document, null, [ elem ] ).length > 0;
            };

            Sizzle.contains = function( context, elem ) {
                // Set document vars if needed
                if ( ( context.ownerDocument || context ) !== document ) {
                    setDocument( context );
                }
                return contains( context, elem );
            };

            Sizzle.attr = function( elem, name ) {
                // Set document vars if needed
                if ( ( elem.ownerDocument || elem ) !== document ) {
                    setDocument( elem );
                }

                var fn = Expr.attrHandle[ name.toLowerCase() ],
                    // Don't get fooled by Object.prototype properties (jQuery #13807)
                    val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
                        fn( elem, name, !documentIsHTML ) :
                        undefined;

                return val !== undefined ?
                    val :
                    support.attributes || !documentIsHTML ?
                        elem.getAttribute( name ) :
                        (val = elem.getAttributeNode(name)) && val.specified ?
                            val.value :
                            null;
            };

            Sizzle.escape = function( sel ) {
                return (sel + "").replace( rcssescape, fcssescape );
            };

            Sizzle.error = function( msg ) {
                throw new Error( "Syntax error, unrecognized expression: " + msg );
            };

            /**
             * Document sorting and removing duplicates
             * @param {ArrayLike} results
             */
            Sizzle.uniqueSort = function( results ) {
                var elem,
                    duplicates = [],
                    j = 0,
                    i = 0;

                // Unless we *know* we can detect duplicates, assume their presence
                hasDuplicate = !support.detectDuplicates;
                sortInput = !support.sortStable && results.slice( 0 );
                results.sort( sortOrder );

                if ( hasDuplicate ) {
                    while ( (elem = results[i++]) ) {
                        if ( elem === results[ i ] ) {
                            j = duplicates.push( i );
                        }
                    }
                    while ( j-- ) {
                        results.splice( duplicates[ j ], 1 );
                    }
                }

                // Clear input after sorting to release objects
                // See https://github.com/jquery/sizzle/pull/225
                sortInput = null;

                return results;
            };

            /**
             * Utility function for retrieving the text value of an array of DOM nodes
             * @param {Array|Element} elem
             */
            getText = Sizzle.getText = function( elem ) {
                var node,
                    ret = "",
                    i = 0,
                    nodeType = elem.nodeType;

                if ( !nodeType ) {
                    // If no nodeType, this is expected to be an array
                    while ( (node = elem[i++]) ) {
                        // Do not traverse comment nodes
                        ret += getText( node );
                    }
                } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
                    // Use textContent for elements
                    // innerText usage removed for consistency of new lines (jQuery #11153)
                    if ( typeof elem.textContent === "string" ) {
                        return elem.textContent;
                    } else {
                        // Traverse its children
                        for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                            ret += getText( elem );
                        }
                    }
                } else if ( nodeType === 3 || nodeType === 4 ) {
                    return elem.nodeValue;
                }
                // Do not include comment or processing instruction nodes

                return ret;
            };

            Expr = Sizzle.selectors = {

                // Can be adjusted by the user
                cacheLength: 50,

                createPseudo: markFunction,

                match: matchExpr,

                attrHandle: {},

                find: {},

                relative: {
                    ">": { dir: "parentNode", first: true },
                    " ": { dir: "parentNode" },
                    "+": { dir: "previousSibling", first: true },
                    "~": { dir: "previousSibling" }
                },

                preFilter: {
                    "ATTR": function( match ) {
                        match[1] = match[1].replace( runescape, funescape );

                        // Move the given value to match[3] whether quoted or unquoted
                        match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

                        if ( match[2] === "~=" ) {
                            match[3] = " " + match[3] + " ";
                        }

                        return match.slice( 0, 4 );
                    },

                    "CHILD": function( match ) {
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

                        if ( match[1].slice( 0, 3 ) === "nth" ) {
                            // nth-* requires argument
                            if ( !match[3] ) {
                                Sizzle.error( match[0] );
                            }

                            // numeric x and y parameters for Expr.filter.CHILD
                            // remember that false/true cast respectively to 0/1
                            match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
                            match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

                            // other types prohibit arguments
                        } else if ( match[3] ) {
                            Sizzle.error( match[0] );
                        }

                        return match;
                    },

                    "PSEUDO": function( match ) {
                        var excess,
                            unquoted = !match[6] && match[2];

                        if ( matchExpr["CHILD"].test( match[0] ) ) {
                            return null;
                        }

                        // Accept quoted arguments as-is
                        if ( match[3] ) {
                            match[2] = match[4] || match[5] || "";

                            // Strip excess characters from unquoted arguments
                        } else if ( unquoted && rpseudo.test( unquoted ) &&
                            // Get excess from tokenize (recursively)
                            (excess = tokenize( unquoted, true )) &&
                            // advance to the next closing parenthesis
                            (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

                            // excess is a negative index
                            match[0] = match[0].slice( 0, excess );
                            match[2] = unquoted.slice( 0, excess );
                        }

                        // Return only captures needed by the pseudo filter method (type and argument)
                        return match.slice( 0, 3 );
                    }
                },

                filter: {

                    "TAG": function( nodeNameSelector ) {
                        var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
                        return nodeNameSelector === "*" ?
                            function() { return true; } :
                            function( elem ) {
                                return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                            };
                    },

                    "CLASS": function( className ) {
                        var pattern = classCache[ className + " " ];

                        return pattern ||
                            (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
                            classCache( className, function( elem ) {
                                return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
                            });
                    },

                    "ATTR": function( name, operator, check ) {
                        return function( elem ) {
                            var result = Sizzle.attr( elem, name );

                            if ( result == null ) {
                                return operator === "!=";
                            }
                            if ( !operator ) {
                                return true;
                            }

                            result += "";

                            return operator === "=" ? result === check :
                                operator === "!=" ? result !== check :
                                    operator === "^=" ? check && result.indexOf( check ) === 0 :
                                        operator === "*=" ? check && result.indexOf( check ) > -1 :
                                            operator === "$=" ? check && result.slice( -check.length ) === check :
                                                operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
                                                    operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
                                                        false;
                        };
                    },

                    "CHILD": function( type, what, argument, first, last ) {
                        var simple = type.slice( 0, 3 ) !== "nth",
                            forward = type.slice( -4 ) !== "last",
                            ofType = what === "of-type";

                        return first === 1 && last === 0 ?

                            // Shortcut for :nth-*(n)
                            function( elem ) {
                                return !!elem.parentNode;
                            } :

                            function( elem, context, xml ) {
                                var cache, uniqueCache, outerCache, node, nodeIndex, start,
                                    dir = simple !== forward ? "nextSibling" : "previousSibling",
                                    parent = elem.parentNode,
                                    name = ofType && elem.nodeName.toLowerCase(),
                                    useCache = !xml && !ofType,
                                    diff = false;

                                if ( parent ) {

                                    // :(first|last|only)-(child|of-type)
                                    if ( simple ) {
                                        while ( dir ) {
                                            node = elem;
                                            while ( (node = node[ dir ]) ) {
                                                if ( ofType ?
                                                    node.nodeName.toLowerCase() === name :
                                                    node.nodeType === 1 ) {

                                                    return false;
                                                }
                                            }
                                            // Reverse direction for :only-* (if we haven't yet done so)
                                            start = dir = type === "only" && !start && "nextSibling";
                                        }
                                        return true;
                                    }

                                    start = [ forward ? parent.firstChild : parent.lastChild ];

                                    // non-xml :nth-child(...) stores cache data on `parent`
                                    if ( forward && useCache ) {

                                        // Seek `elem` from a previously-cached index

                                        // ...in a gzip-friendly way
                                        node = parent;
                                        outerCache = node[ expando ] || (node[ expando ] = {});

                                        // Support: IE <9 only
                                        // Defend against cloned attroperties (jQuery gh-1709)
                                        uniqueCache = outerCache[ node.uniqueID ] ||
                                            (outerCache[ node.uniqueID ] = {});

                                        cache = uniqueCache[ type ] || [];
                                        nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
                                        diff = nodeIndex && cache[ 2 ];
                                        node = nodeIndex && parent.childNodes[ nodeIndex ];

                                        while ( (node = ++nodeIndex && node && node[ dir ] ||

                                            // Fallback to seeking `elem` from the start
                                            (diff = nodeIndex = 0) || start.pop()) ) {

                                            // When found, cache indexes on `parent` and break
                                            if ( node.nodeType === 1 && ++diff && node === elem ) {
                                                uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
                                                break;
                                            }
                                        }

                                    } else {
                                        // Use previously-cached element index if available
                                        if ( useCache ) {
                                            // ...in a gzip-friendly way
                                            node = elem;
                                            outerCache = node[ expando ] || (node[ expando ] = {});

                                            // Support: IE <9 only
                                            // Defend against cloned attroperties (jQuery gh-1709)
                                            uniqueCache = outerCache[ node.uniqueID ] ||
                                                (outerCache[ node.uniqueID ] = {});

                                            cache = uniqueCache[ type ] || [];
                                            nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
                                            diff = nodeIndex;
                                        }

                                        // xml :nth-child(...)
                                        // or :nth-last-child(...) or :nth(-last)?-of-type(...)
                                        if ( diff === false ) {
                                            // Use the same loop as above to seek `elem` from the start
                                            while ( (node = ++nodeIndex && node && node[ dir ] ||
                                                (diff = nodeIndex = 0) || start.pop()) ) {

                                                if ( ( ofType ?
                                                    node.nodeName.toLowerCase() === name :
                                                    node.nodeType === 1 ) &&
                                                    ++diff ) {

                                                    // Cache the index of each encountered element
                                                    if ( useCache ) {
                                                        outerCache = node[ expando ] || (node[ expando ] = {});

                                                        // Support: IE <9 only
                                                        // Defend against cloned attroperties (jQuery gh-1709)
                                                        uniqueCache = outerCache[ node.uniqueID ] ||
                                                            (outerCache[ node.uniqueID ] = {});

                                                        uniqueCache[ type ] = [ dirruns, diff ];
                                                    }

                                                    if ( node === elem ) {
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // Incorporate the offset, then check against cycle size
                                    diff -= last;
                                    return diff === first || ( diff % first === 0 && diff / first >= 0 );
                                }
                            };
                    },

                    "PSEUDO": function( pseudo, argument ) {
                        // pseudo-class names are case-insensitive
                        // http://www.w3.org/TR/selectors/#pseudo-classes
                        // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                        // Remember that setFilters inherits from pseudos
                        var args,
                            fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                                Sizzle.error( "unsupported pseudo: " + pseudo );

                        // The user may use createPseudo to indicate that
                        // arguments are needed to create the filter function
                        // just as Sizzle does
                        if ( fn[ expando ] ) {
                            return fn( argument );
                        }

                        // But maintain support for old signatures
                        if ( fn.length > 1 ) {
                            args = [ pseudo, pseudo, "", argument ];
                            return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                                markFunction(function( seed, matches ) {
                                    var idx,
                                        matched = fn( seed, argument ),
                                        i = matched.length;
                                    while ( i-- ) {
                                        idx = indexOf( seed, matched[i] );
                                        seed[ idx ] = !( matches[ idx ] = matched[i] );
                                    }
                                }) :
                                function( elem ) {
                                    return fn( elem, 0, args );
                                };
                        }

                        return fn;
                    }
                },

                pseudos: {
                    // Potentially complex pseudos
                    "not": markFunction(function( selector ) {
                        // Trim the selector passed to compile
                        // to avoid treating leading and trailing
                        // spaces as combinators
                        var input = [],
                            results = [],
                            matcher = compile( selector.replace( rtrim, "$1" ) );

                        return matcher[ expando ] ?
                            markFunction(function( seed, matches, context, xml ) {
                                var elem,
                                    unmatched = matcher( seed, null, xml, [] ),
                                    i = seed.length;

                                // Match elements unmatched by `matcher`
                                while ( i-- ) {
                                    if ( (elem = unmatched[i]) ) {
                                        seed[i] = !(matches[i] = elem);
                                    }
                                }
                            }) :
                            function( elem, context, xml ) {
                                input[0] = elem;
                                matcher( input, null, xml, results );
                                // Don't keep the element (issue #299)
                                input[0] = null;
                                return !results.pop();
                            };
                    }),

                    "has": markFunction(function( selector ) {
                        return function( elem ) {
                            return Sizzle( selector, elem ).length > 0;
                        };
                    }),

                    "contains": markFunction(function( text ) {
                        text = text.replace( runescape, funescape );
                        return function( elem ) {
                            return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
                        };
                    }),

                    // "Whether an element is represented by a :lang() selector
                    // is based solely on the element's language value
                    // being equal to the identifier C,
                    // or beginning with the identifier C immediately followed by "-".
                    // The matching of C against the element's language value is performed case-insensitively.
                    // The identifier C does not have to be a valid language name."
                    // http://www.w3.org/TR/selectors/#lang-pseudo
                    "lang": markFunction( function( lang ) {
                        // lang value must be a valid identifier
                        if ( !ridentifier.test(lang || "") ) {
                            Sizzle.error( "unsupported lang: " + lang );
                        }
                        lang = lang.replace( runescape, funescape ).toLowerCase();
                        return function( elem ) {
                            var elemLang;
                            do {
                                if ( (elemLang = documentIsHTML ?
                                    elem.lang :
                                    elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

                                    elemLang = elemLang.toLowerCase();
                                    return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
                                }
                            } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
                            return false;
                        };
                    }),

                    // Miscellaneous
                    "target": function( elem ) {
                        var hash = window.location && window.location.hash;
                        return hash && hash.slice( 1 ) === elem.id;
                    },

                    "root": function( elem ) {
                        return elem === docElem;
                    },

                    "focus": function( elem ) {
                        return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                    },

                    // Boolean properties
                    "enabled": createDisabledPseudo( false ),
                    "disabled": createDisabledPseudo( true ),

                    "checked": function( elem ) {
                        // In CSS3, :checked should return both checked and selected elements
                        // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                        var nodeName = elem.nodeName.toLowerCase();
                        return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                    },

                    "selected": function( elem ) {
                        // Accessing this property makes selected-by-default
                        // options in Safari work properly
                        if ( elem.parentNode ) {
                            elem.parentNode.selectedIndex;
                        }

                        return elem.selected === true;
                    },

                    // Contents
                    "empty": function( elem ) {
                        // http://www.w3.org/TR/selectors/#empty-pseudo
                        // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                        //   but not by others (comment: 8; processing instruction: 7; etc.)
                        // nodeType < 6 works because attributes (2) do not appear as children
                        for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                            if ( elem.nodeType < 6 ) {
                                return false;
                            }
                        }
                        return true;
                    },

                    "parent": function( elem ) {
                        return !Expr.pseudos["empty"]( elem );
                    },

                    // Element/input types
                    "header": function( elem ) {
                        return rheader.test( elem.nodeName );
                    },

                    "input": function( elem ) {
                        return rinputs.test( elem.nodeName );
                    },

                    "button": function( elem ) {
                        var name = elem.nodeName.toLowerCase();
                        return name === "input" && elem.type === "button" || name === "button";
                    },

                    "text": function( elem ) {
                        var attr;
                        return elem.nodeName.toLowerCase() === "input" &&
                            elem.type === "text" &&

                            // Support: IE<8
                            // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                            ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
                    },

                    // Position-in-collection
                    "first": createPositionalPseudo(function() {
                        return [ 0 ];
                    }),

                    "last": createPositionalPseudo(function( matchIndexes, length ) {
                        return [ length - 1 ];
                    }),

                    "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
                        return [ argument < 0 ? argument + length : argument ];
                    }),

                    "even": createPositionalPseudo(function( matchIndexes, length ) {
                        var i = 0;
                        for ( ; i < length; i += 2 ) {
                            matchIndexes.push( i );
                        }
                        return matchIndexes;
                    }),

                    "odd": createPositionalPseudo(function( matchIndexes, length ) {
                        var i = 1;
                        for ( ; i < length; i += 2 ) {
                            matchIndexes.push( i );
                        }
                        return matchIndexes;
                    }),

                    "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                        var i = argument < 0 ?
                            argument + length :
                            argument > length ?
                                length :
                                argument;
                        for ( ; --i >= 0; ) {
                            matchIndexes.push( i );
                        }
                        return matchIndexes;
                    }),

                    "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                        var i = argument < 0 ? argument + length : argument;
                        for ( ; ++i < length; ) {
                            matchIndexes.push( i );
                        }
                        return matchIndexes;
                    })
                }
            };

            Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
            for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
                Expr.pseudos[ i ] = createInputPseudo( i );
            }
            for ( i in { submit: true, reset: true } ) {
                Expr.pseudos[ i ] = createButtonPseudo( i );
            }

// Easy API for creating new setFilters
            function setFilters() {}
            setFilters.prototype = Expr.filters = Expr.pseudos;
            Expr.setFilters = new setFilters();

            tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
                var matched, match, tokens, type,
                    soFar, groups, preFilters,
                    cached = tokenCache[ selector + " " ];

                if ( cached ) {
                    return parseOnly ? 0 : cached.slice( 0 );
                }

                soFar = selector;
                groups = [];
                preFilters = Expr.preFilter;

                while ( soFar ) {

                    // Comma and first run
                    if ( !matched || (match = rcomma.exec( soFar )) ) {
                        if ( match ) {
                            // Don't consume trailing commas as valid
                            soFar = soFar.slice( match[0].length ) || soFar;
                        }
                        groups.push( (tokens = []) );
                    }

                    matched = false;

                    // Combinators
                    if ( (match = rcombinators.exec( soFar )) ) {
                        matched = match.shift();
                        tokens.push({
                            value: matched,
                            // Cast descendant combinators to space
                            type: match[0].replace( rtrim, " " )
                        });
                        soFar = soFar.slice( matched.length );
                    }

                    // Filters
                    for ( type in Expr.filter ) {
                        if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                            (match = preFilters[ type ]( match ))) ) {
                            matched = match.shift();
                            tokens.push({
                                value: matched,
                                type: type,
                                matches: match
                            });
                            soFar = soFar.slice( matched.length );
                        }
                    }

                    if ( !matched ) {
                        break;
                    }
                }

                // Return the length of the invalid excess
                // if we're just parsing
                // Otherwise, throw an error or return tokens
                return parseOnly ?
                    soFar.length :
                    soFar ?
                        Sizzle.error( selector ) :
                        // Cache the tokens
                        tokenCache( selector, groups ).slice( 0 );
            };

            function toSelector( tokens ) {
                var i = 0,
                    len = tokens.length,
                    selector = "";
                for ( ; i < len; i++ ) {
                    selector += tokens[i].value;
                }
                return selector;
            }

            function addCombinator( matcher, combinator, base ) {
                var dir = combinator.dir,
                    skip = combinator.next,
                    key = skip || dir,
                    checkNonElements = base && key === "parentNode",
                    doneName = done++;

                return combinator.first ?
                    // Check against closest ancestor/preceding element
                    function( elem, context, xml ) {
                        while ( (elem = elem[ dir ]) ) {
                            if ( elem.nodeType === 1 || checkNonElements ) {
                                return matcher( elem, context, xml );
                            }
                        }
                        return false;
                    } :

                    // Check against all ancestor/preceding elements
                    function( elem, context, xml ) {
                        var oldCache, uniqueCache, outerCache,
                            newCache = [ dirruns, doneName ];

                        // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
                        if ( xml ) {
                            while ( (elem = elem[ dir ]) ) {
                                if ( elem.nodeType === 1 || checkNonElements ) {
                                    if ( matcher( elem, context, xml ) ) {
                                        return true;
                                    }
                                }
                            }
                        } else {
                            while ( (elem = elem[ dir ]) ) {
                                if ( elem.nodeType === 1 || checkNonElements ) {
                                    outerCache = elem[ expando ] || (elem[ expando ] = {});

                                    // Support: IE <9 only
                                    // Defend against cloned attroperties (jQuery gh-1709)
                                    uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

                                    if ( skip && skip === elem.nodeName.toLowerCase() ) {
                                        elem = elem[ dir ] || elem;
                                    } else if ( (oldCache = uniqueCache[ key ]) &&
                                        oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

                                        // Assign to newCache so results back-propagate to previous elements
                                        return (newCache[ 2 ] = oldCache[ 2 ]);
                                    } else {
                                        // Reuse newcache so results back-propagate to previous elements
                                        uniqueCache[ key ] = newCache;

                                        // A match means we're done; a fail means we have to keep checking
                                        if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                        return false;
                    };
            }

            function elementMatcher( matchers ) {
                return matchers.length > 1 ?
                    function( elem, context, xml ) {
                        var i = matchers.length;
                        while ( i-- ) {
                            if ( !matchers[i]( elem, context, xml ) ) {
                                return false;
                            }
                        }
                        return true;
                    } :
                    matchers[0];
            }

            function multipleContexts( selector, contexts, results ) {
                var i = 0,
                    len = contexts.length;
                for ( ; i < len; i++ ) {
                    Sizzle( selector, contexts[i], results );
                }
                return results;
            }

            function condense( unmatched, map, filter, context, xml ) {
                var elem,
                    newUnmatched = [],
                    i = 0,
                    len = unmatched.length,
                    mapped = map != null;

                for ( ; i < len; i++ ) {
                    if ( (elem = unmatched[i]) ) {
                        if ( !filter || filter( elem, context, xml ) ) {
                            newUnmatched.push( elem );
                            if ( mapped ) {
                                map.push( i );
                            }
                        }
                    }
                }

                return newUnmatched;
            }

            function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
                if ( postFilter && !postFilter[ expando ] ) {
                    postFilter = setMatcher( postFilter );
                }
                if ( postFinder && !postFinder[ expando ] ) {
                    postFinder = setMatcher( postFinder, postSelector );
                }
                return markFunction(function( seed, results, context, xml ) {
                    var temp, i, elem,
                        preMap = [],
                        postMap = [],
                        preexisting = results.length,

                        // Get initial elements from seed or context
                        elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

                        // Prefilter to get matcher input, preserving a map for seed-results synchronization
                        matcherIn = preFilter && ( seed || !selector ) ?
                            condense( elems, preMap, preFilter, context, xml ) :
                            elems,

                        matcherOut = matcher ?
                            // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                            postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

                                // ...intermediate processing is necessary
                                [] :

                                // ...otherwise use results directly
                                results :
                            matcherIn;

                    // Find primary matches
                    if ( matcher ) {
                        matcher( matcherIn, matcherOut, context, xml );
                    }

                    // Apply postFilter
                    if ( postFilter ) {
                        temp = condense( matcherOut, postMap );
                        postFilter( temp, [], context, xml );

                        // Un-match failing elements by moving them back to matcherIn
                        i = temp.length;
                        while ( i-- ) {
                            if ( (elem = temp[i]) ) {
                                matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                            }
                        }
                    }

                    if ( seed ) {
                        if ( postFinder || preFilter ) {
                            if ( postFinder ) {
                                // Get the final matcherOut by condensing this intermediate into postFinder contexts
                                temp = [];
                                i = matcherOut.length;
                                while ( i-- ) {
                                    if ( (elem = matcherOut[i]) ) {
                                        // Restore matcherIn since elem is not yet a final match
                                        temp.push( (matcherIn[i] = elem) );
                                    }
                                }
                                postFinder( null, (matcherOut = []), temp, xml );
                            }

                            // Move matched elements from seed to results to keep them synchronized
                            i = matcherOut.length;
                            while ( i-- ) {
                                if ( (elem = matcherOut[i]) &&
                                    (temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

                                    seed[temp] = !(results[temp] = elem);
                                }
                            }
                        }

                        // Add elements to results, through postFinder if defined
                    } else {
                        matcherOut = condense(
                            matcherOut === results ?
                                matcherOut.splice( preexisting, matcherOut.length ) :
                                matcherOut
                        );
                        if ( postFinder ) {
                            postFinder( null, results, matcherOut, xml );
                        } else {
                            push.apply( results, matcherOut );
                        }
                    }
                });
            }

            function matcherFromTokens( tokens ) {
                var checkContext, matcher, j,
                    len = tokens.length,
                    leadingRelative = Expr.relative[ tokens[0].type ],
                    implicitRelative = leadingRelative || Expr.relative[" "],
                    i = leadingRelative ? 1 : 0,

                    // The foundational matcher ensures that elements are reachable from top-level context(s)
                    matchContext = addCombinator( function( elem ) {
                        return elem === checkContext;
                    }, implicitRelative, true ),
                    matchAnyContext = addCombinator( function( elem ) {
                        return indexOf( checkContext, elem ) > -1;
                    }, implicitRelative, true ),
                    matchers = [ function( elem, context, xml ) {
                        var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                            (checkContext = context).nodeType ?
                                matchContext( elem, context, xml ) :
                                matchAnyContext( elem, context, xml ) );
                        // Avoid hanging onto element (issue #299)
                        checkContext = null;
                        return ret;
                    } ];

                for ( ; i < len; i++ ) {
                    if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
                        matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
                    } else {
                        matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

                        // Return special upon seeing a positional matcher
                        if ( matcher[ expando ] ) {
                            // Find the next relative operator (if any) for proper handling
                            j = ++i;
                            for ( ; j < len; j++ ) {
                                if ( Expr.relative[ tokens[j].type ] ) {
                                    break;
                                }
                            }
                            return setMatcher(
                                i > 1 && elementMatcher( matchers ),
                                i > 1 && toSelector(
                                // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                                tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
                                ).replace( rtrim, "$1" ),
                                matcher,
                                i < j && matcherFromTokens( tokens.slice( i, j ) ),
                                j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                                j < len && toSelector( tokens )
                            );
                        }
                        matchers.push( matcher );
                    }
                }

                return elementMatcher( matchers );
            }

            function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
                var bySet = setMatchers.length > 0,
                    byElement = elementMatchers.length > 0,
                    superMatcher = function( seed, context, xml, results, outermost ) {
                        var elem, j, matcher,
                            matchedCount = 0,
                            i = "0",
                            unmatched = seed && [],
                            setMatched = [],
                            contextBackup = outermostContext,
                            // We must always have either seed elements or outermost context
                            elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
                            // Use integer dirruns iff this is the outermost matcher
                            dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                            len = elems.length;

                        if ( outermost ) {
                            outermostContext = context === document || context || outermost;
                        }

                        // Add elements passing elementMatchers directly to results
                        // Support: IE<9, Safari
                        // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                        for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
                            if ( byElement && elem ) {
                                j = 0;
                                if ( !context && elem.ownerDocument !== document ) {
                                    setDocument( elem );
                                    xml = !documentIsHTML;
                                }
                                while ( (matcher = elementMatchers[j++]) ) {
                                    if ( matcher( elem, context || document, xml) ) {
                                        results.push( elem );
                                        break;
                                    }
                                }
                                if ( outermost ) {
                                    dirruns = dirrunsUnique;
                                }
                            }

                            // Track unmatched elements for set filters
                            if ( bySet ) {
                                // They will have gone through all possible matchers
                                if ( (elem = !matcher && elem) ) {
                                    matchedCount--;
                                }

                                // Lengthen the array for every element, matched or not
                                if ( seed ) {
                                    unmatched.push( elem );
                                }
                            }
                        }

                        // `i` is now the count of elements visited above, and adding it to `matchedCount`
                        // makes the latter nonnegative.
                        matchedCount += i;

                        // Apply set filters to unmatched elements
                        // NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
                        // equals `i`), unless we didn't visit _any_ elements in the above loop because we have
                        // no element matchers and no seed.
                        // Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
                        // case, which will result in a "00" `matchedCount` that differs from `i` but is also
                        // numerically zero.
                        if ( bySet && i !== matchedCount ) {
                            j = 0;
                            while ( (matcher = setMatchers[j++]) ) {
                                matcher( unmatched, setMatched, context, xml );
                            }

                            if ( seed ) {
                                // Reintegrate element matches to eliminate the need for sorting
                                if ( matchedCount > 0 ) {
                                    while ( i-- ) {
                                        if ( !(unmatched[i] || setMatched[i]) ) {
                                            setMatched[i] = pop.call( results );
                                        }
                                    }
                                }

                                // Discard index placeholder values to get only actual matches
                                setMatched = condense( setMatched );
                            }

                            // Add matches to results
                            push.apply( results, setMatched );

                            // Seedless set matches succeeding multiple successful matchers stipulate sorting
                            if ( outermost && !seed && setMatched.length > 0 &&
                                ( matchedCount + setMatchers.length ) > 1 ) {

                                Sizzle.uniqueSort( results );
                            }
                        }

                        // Override manipulation of globals by nested matchers
                        if ( outermost ) {
                            dirruns = dirrunsUnique;
                            outermostContext = contextBackup;
                        }

                        return unmatched;
                    };

                return bySet ?
                    markFunction( superMatcher ) :
                    superMatcher;
            }

            compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
                var i,
                    setMatchers = [],
                    elementMatchers = [],
                    cached = compilerCache[ selector + " " ];

                if ( !cached ) {
                    // Generate a function of recursive functions that can be used to check each element
                    if ( !match ) {
                        match = tokenize( selector );
                    }
                    i = match.length;
                    while ( i-- ) {
                        cached = matcherFromTokens( match[i] );
                        if ( cached[ expando ] ) {
                            setMatchers.push( cached );
                        } else {
                            elementMatchers.push( cached );
                        }
                    }

                    // Cache the compiled function
                    cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

                    // Save selector and tokenization
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
            select = Sizzle.select = function( selector, context, results, seed ) {
                var i, tokens, token, type, find,
                    compiled = typeof selector === "function" && selector,
                    match = !seed && tokenize( (selector = compiled.selector || selector) );

                results = results || [];

                // Try to minimize operations if there is only one selector in the list and no seed
                // (the latter of which guarantees us context)
                if ( match.length === 1 ) {

                    // Reduce context if the leading compound selector is an ID
                    tokens = match[0] = match[0].slice( 0 );
                    if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                        context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

                        context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
                        if ( !context ) {
                            return results;

                            // Precompiled matchers will still verify ancestry, so step up a level
                        } else if ( compiled ) {
                            context = context.parentNode;
                        }

                        selector = selector.slice( tokens.shift().value.length );
                    }

                    // Fetch a seed set for right-to-left matching
                    i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
                    while ( i-- ) {
                        token = tokens[i];

                        // Abort if we hit a combinator
                        if ( Expr.relative[ (type = token.type) ] ) {
                            break;
                        }
                        if ( (find = Expr.find[ type ]) ) {
                            // Search, expanding context for leading sibling combinators
                            if ( (seed = find(
                                token.matches[0].replace( runescape, funescape ),
                                rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
                            )) ) {

                                // If seed is empty or no tokens remain, we can return early
                                tokens.splice( i, 1 );
                                selector = seed.length && toSelector( tokens );
                                if ( !selector ) {
                                    push.apply( results, seed );
                                    return results;
                                }

                                break;
                            }
                        }
                    }
                }

                // Compile and execute a filtering function if one is not provided
                // Provide `match` to avoid retokenization if we modified the selector above
                ( compiled || compile( selector, match ) )(
                    seed,
                    context,
                    !documentIsHTML,
                    results,
                    !context || rsibling.test( selector ) && testContext( context.parentNode ) || context
                );
                return results;
            };

// One-time assignments

// Sort stability
            support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
            support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
            setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
            support.sortDetached = assert(function( el ) {
                // Should return 1, but returns 4 (following)
                return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
            });

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
            if ( !assert(function( el ) {
                el.innerHTML = "<a href='#'></a>";
                return el.firstChild.getAttribute("href") === "#" ;
            }) ) {
                addHandle( "type|href|height|width", function( elem, name, isXML ) {
                    if ( !isXML ) {
                        return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
                    }
                });
            }

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
            if ( !support.attributes || !assert(function( el ) {
                el.innerHTML = "<input/>";
                el.firstChild.setAttribute( "value", "" );
                return el.firstChild.getAttribute( "value" ) === "";
            }) ) {
                addHandle( "value", function( elem, name, isXML ) {
                    if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
                        return elem.defaultValue;
                    }
                });
            }

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
            if ( !assert(function( el ) {
                return el.getAttribute("disabled") == null;
            }) ) {
                addHandle( booleans, function( elem, name, isXML ) {
                    var val;
                    if ( !isXML ) {
                        return elem[ name ] === true ? name.toLowerCase() :
                            (val = elem.getAttributeNode( name )) && val.specified ?
                                val.value :
                                null;
                    }
                });
            }

            return Sizzle;

        })( window );



    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;

// Deprecated
    jQuery.expr[ ":" ] = jQuery.expr.pseudos;
    jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
    jQuery.escapeSelector = Sizzle.escape;




    var dir = function( elem, dir, until ) {
        var matched = [],
            truncate = until !== undefined;

        while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
            if ( elem.nodeType === 1 ) {
                if ( truncate && jQuery( elem ).is( until ) ) {
                    break;
                }
                matched.push( elem );
            }
        }
        return matched;
    };


    var siblings = function( n, elem ) {
        var matched = [];

        for ( ; n; n = n.nextSibling ) {
            if ( n.nodeType === 1 && n !== elem ) {
                matched.push( n );
            }
        }

        return matched;
    };


    var rneedsContext = jQuery.expr.match.needsContext;



    function nodeName( elem, name ) {

        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

    };
    var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
    function winnow( elements, qualifier, not ) {
        if ( isFunction( qualifier ) ) {
            return jQuery.grep( elements, function( elem, i ) {
                return !!qualifier.call( elem, i, elem ) !== not;
            } );
        }

        // Single element
        if ( qualifier.nodeType ) {
            return jQuery.grep( elements, function( elem ) {
                return ( elem === qualifier ) !== not;
            } );
        }

        // Arraylike of elements (jQuery, arguments, Array)
        if ( typeof qualifier !== "string" ) {
            return jQuery.grep( elements, function( elem ) {
                return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
            } );
        }

        // Filtered directly for both simple and complex selectors
        return jQuery.filter( qualifier, elements, not );
    }

    jQuery.filter = function( expr, elems, not ) {
        var elem = elems[ 0 ];

        if ( not ) {
            expr = ":not(" + expr + ")";
        }

        if ( elems.length === 1 && elem.nodeType === 1 ) {
            return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
        }

        return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
            return elem.nodeType === 1;
        } ) );
    };

    jQuery.fn.extend( {
        find: function( selector ) {
            var i, ret,
                len = this.length,
                self = this;

            if ( typeof selector !== "string" ) {
                return this.pushStack( jQuery( selector ).filter( function() {
                    for ( i = 0; i < len; i++ ) {
                        if ( jQuery.contains( self[ i ], this ) ) {
                            return true;
                        }
                    }
                } ) );
            }

            ret = this.pushStack( [] );

            for ( i = 0; i < len; i++ ) {
                jQuery.find( selector, self[ i ], ret );
            }

            return len > 1 ? jQuery.uniqueSort( ret ) : ret;
        },
        filter: function( selector ) {
            return this.pushStack( winnow( this, selector || [], false ) );
        },
        not: function( selector ) {
            return this.pushStack( winnow( this, selector || [], true ) );
        },
        is: function( selector ) {
            return !!winnow(
                this,

                // If this is a positional/relative selector, check membership in the returned set
                // so $("p:first").is("p:last") won't return true for a doc with two "p".
                typeof selector === "string" && rneedsContext.test( selector ) ?
                    jQuery( selector ) :
                    selector || [],
                false
            ).length;
        }
    } );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
    var rootjQuery,

        // A simple way to check for HTML strings
        // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
        // Strict HTML recognition (#11290: must start with <)
        // Shortcut simple #id case for speed
        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

        init = jQuery.fn.init = function( selector, context, root ) {
            var match, elem;

            // HANDLE: $(""), $(null), $(undefined), $(false)
            if ( !selector ) {
                return this;
            }

            // Method init() accepts an alternate rootjQuery
            // so migrate can support jQuery.sub (gh-2101)
            root = root || rootjQuery;

            // Handle HTML strings
            if ( typeof selector === "string" ) {
                if ( selector[ 0 ] === "<" &&
                    selector[ selector.length - 1 ] === ">" &&
                    selector.length >= 3 ) {

                    // Assume that strings that start and end with <> are HTML and skip the regex check
                    match = [ null, selector, null ];

                } else {
                    match = rquickExpr.exec( selector );
                }

                // Match html or make sure no context is specified for #id
                if ( match && ( match[ 1 ] || !context ) ) {

                    // HANDLE: $(html) -> $(array)
                    if ( match[ 1 ] ) {
                        context = context instanceof jQuery ? context[ 0 ] : context;

                        // Option to run scripts is true for back-compat
                        // Intentionally let the error be thrown if parseHTML is not present
                        jQuery.merge( this, jQuery.parseHTML(
                            match[ 1 ],
                            context && context.nodeType ? context.ownerDocument || context : document,
                            true
                        ) );

                        // HANDLE: $(html, props)
                        if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
                            for ( match in context ) {

                                // Properties of context are called as methods if possible
                                if ( isFunction( this[ match ] ) ) {
                                    this[ match ]( context[ match ] );

                                    // ...and otherwise set as attributes
                                } else {
                                    this.attr( match, context[ match ] );
                                }
                            }
                        }

                        return this;

                        // HANDLE: $(#id)
                    } else {
                        elem = document.getElementById( match[ 2 ] );

                        if ( elem ) {

                            // Inject the element directly into the jQuery object
                            this[ 0 ] = elem;
                            this.length = 1;
                        }
                        return this;
                    }

                    // HANDLE: $(expr, $(...))
                } else if ( !context || context.jquery ) {
                    return ( context || root ).find( selector );

                    // HANDLE: $(expr, context)
                    // (which is just equivalent to: $(context).find(expr)
                } else {
                    return this.constructor( context ).find( selector );
                }

                // HANDLE: $(DOMElement)
            } else if ( selector.nodeType ) {
                this[ 0 ] = selector;
                this.length = 1;
                return this;

                // HANDLE: $(function)
                // Shortcut for document ready
            } else if ( isFunction( selector ) ) {
                return root.ready !== undefined ?
                    root.ready( selector ) :

                    // Execute immediately if ready is not present
                    selector( jQuery );
            }

            return jQuery.makeArray( selector, this );
        };

// Give the init function the jQuery prototype for later instantiation
    init.prototype = jQuery.fn;

// Initialize central reference
    rootjQuery = jQuery( document );


    var rparentsprev = /^(?:parents|prev(?:Until|All))/,

        // Methods guaranteed to produce a unique set when starting from a unique set
        guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };

    jQuery.fn.extend( {
        has: function( target ) {
            var targets = jQuery( target, this ),
                l = targets.length;

            return this.filter( function() {
                var i = 0;
                for ( ; i < l; i++ ) {
                    if ( jQuery.contains( this, targets[ i ] ) ) {
                        return true;
                    }
                }
            } );
        },

        closest: function( selectors, context ) {
            var cur,
                i = 0,
                l = this.length,
                matched = [],
                targets = typeof selectors !== "string" && jQuery( selectors );

            // Positional selectors never match, since there's no _selection_ context
            if ( !rneedsContext.test( selectors ) ) {
                for ( ; i < l; i++ ) {
                    for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

                        // Always skip document fragments
                        if ( cur.nodeType < 11 && ( targets ?
                            targets.index( cur ) > -1 :

                            // Don't pass non-elements to Sizzle
                            cur.nodeType === 1 &&
                            jQuery.find.matchesSelector( cur, selectors ) ) ) {

                            matched.push( cur );
                            break;
                        }
                    }
                }
            }

            return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
        },

        // Determine the position of an element within the set
        index: function( elem ) {

            // No argument, return index in parent
            if ( !elem ) {
                return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
            }

            // Index in selector
            if ( typeof elem === "string" ) {
                return indexOf.call( jQuery( elem ), this[ 0 ] );
            }

            // Locate the position of the desired element
            return indexOf.call( this,

                // If it receives a jQuery object, the first element is used
                elem.jquery ? elem[ 0 ] : elem
            );
        },

        add: function( selector, context ) {
            return this.pushStack(
                jQuery.uniqueSort(
                    jQuery.merge( this.get(), jQuery( selector, context ) )
                )
            );
        },

        addBack: function( selector ) {
            return this.add( selector == null ?
                this.prevObject : this.prevObject.filter( selector )
            );
        }
    } );

    function sibling( cur, dir ) {
        while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
        return cur;
    }

    jQuery.each( {
        parent: function( elem ) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function( elem ) {
            return dir( elem, "parentNode" );
        },
        parentsUntil: function( elem, i, until ) {
            return dir( elem, "parentNode", until );
        },
        next: function( elem ) {
            return sibling( elem, "nextSibling" );
        },
        prev: function( elem ) {
            return sibling( elem, "previousSibling" );
        },
        nextAll: function( elem ) {
            return dir( elem, "nextSibling" );
        },
        prevAll: function( elem ) {
            return dir( elem, "previousSibling" );
        },
        nextUntil: function( elem, i, until ) {
            return dir( elem, "nextSibling", until );
        },
        prevUntil: function( elem, i, until ) {
            return dir( elem, "previousSibling", until );
        },
        siblings: function( elem ) {
            return siblings( ( elem.parentNode || {} ).firstChild, elem );
        },
        children: function( elem ) {
            return siblings( elem.firstChild );
        },
        contents: function( elem ) {
            if ( typeof elem.contentDocument !== "undefined" ) {
                return elem.contentDocument;
            }

            // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
            // Treat the template element as a regular one in browsers that
            // don't support it.
            if ( nodeName( elem, "template" ) ) {
                elem = elem.content || elem;
            }

            return jQuery.merge( [], elem.childNodes );
        }
    }, function( name, fn ) {
        jQuery.fn[ name ] = function( until, selector ) {
            var matched = jQuery.map( this, fn, until );

            if ( name.slice( -5 ) !== "Until" ) {
                selector = until;
            }

            if ( selector && typeof selector === "string" ) {
                matched = jQuery.filter( selector, matched );
            }

            if ( this.length > 1 ) {

                // Remove duplicates
                if ( !guaranteedUnique[ name ] ) {
                    jQuery.uniqueSort( matched );
                }

                // Reverse order for parents* and prev-derivatives
                if ( rparentsprev.test( name ) ) {
                    matched.reverse();
                }
            }

            return this.pushStack( matched );
        };
    } );
    var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
    function createOptions( options ) {
        var object = {};
        jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
            object[ flag ] = true;
        } );
        return object;
    }

    /*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
    jQuery.Callbacks = function( options ) {

        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === "string" ?
            createOptions( options ) :
            jQuery.extend( {}, options );

        var // Flag to know if list is currently firing
            firing,

            // Last fire value for non-forgettable lists
            memory,

            // Flag to know if list was already fired
            fired,

            // Flag to prevent firing
            locked,

            // Actual callback list
            list = [],

            // Queue of execution data for repeatable lists
            queue = [],

            // Index of currently firing callback (modified by add/remove as needed)
            firingIndex = -1,

            // Fire callbacks
            fire = function() {

                // Enforce single-firing
                locked = locked || options.once;

                // Execute callbacks for all pending executions,
                // respecting firingIndex overrides and runtime changes
                fired = firing = true;
                for ( ; queue.length; firingIndex = -1 ) {
                    memory = queue.shift();
                    while ( ++firingIndex < list.length ) {

                        // Run callback and check for early termination
                        if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
                            options.stopOnFalse ) {

                            // Jump to end and forget the data so .add doesn't re-fire
                            firingIndex = list.length;
                            memory = false;
                        }
                    }
                }

                // Forget the data if we're done with it
                if ( !options.memory ) {
                    memory = false;
                }

                firing = false;

                // Clean up if we're done firing for good
                if ( locked ) {

                    // Keep an empty list if we have data for future add calls
                    if ( memory ) {
                        list = [];

                        // Otherwise, this object is spent
                    } else {
                        list = "";
                    }
                }
            },

            // Actual Callbacks object
            self = {

                // Add a callback or a collection of callbacks to the list
                add: function() {
                    if ( list ) {

                        // If we have memory from a past run, we should fire after adding
                        if ( memory && !firing ) {
                            firingIndex = list.length - 1;
                            queue.push( memory );
                        }

                        ( function add( args ) {
                            jQuery.each( args, function( _, arg ) {
                                if ( isFunction( arg ) ) {
                                    if ( !options.unique || !self.has( arg ) ) {
                                        list.push( arg );
                                    }
                                } else if ( arg && arg.length && toType( arg ) !== "string" ) {

                                    // Inspect recursively
                                    add( arg );
                                }
                            } );
                        } )( arguments );

                        if ( memory && !firing ) {
                            fire();
                        }
                    }
                    return this;
                },

                // Remove a callback from the list
                remove: function() {
                    jQuery.each( arguments, function( _, arg ) {
                        var index;
                        while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
                            list.splice( index, 1 );

                            // Handle firing indexes
                            if ( index <= firingIndex ) {
                                firingIndex--;
                            }
                        }
                    } );
                    return this;
                },

                // Check if a given callback is in the list.
                // If no argument is given, return whether or not list has callbacks attached.
                has: function( fn ) {
                    return fn ?
                        jQuery.inArray( fn, list ) > -1 :
                        list.length > 0;
                },

                // Remove all callbacks from the list
                empty: function() {
                    if ( list ) {
                        list = [];
                    }
                    return this;
                },

                // Disable .fire and .add
                // Abort any current/pending executions
                // Clear all callbacks and values
                disable: function() {
                    locked = queue = [];
                    list = memory = "";
                    return this;
                },
                disabled: function() {
                    return !list;
                },

                // Disable .fire
                // Also disable .add unless we have memory (since it would have no effect)
                // Abort any pending executions
                lock: function() {
                    locked = queue = [];
                    if ( !memory && !firing ) {
                        list = memory = "";
                    }
                    return this;
                },
                locked: function() {
                    return !!locked;
                },

                // Call all callbacks with the given context and arguments
                fireWith: function( context, args ) {
                    if ( !locked ) {
                        args = args || [];
                        args = [ context, args.slice ? args.slice() : args ];
                        queue.push( args );
                        if ( !firing ) {
                            fire();
                        }
                    }
                    return this;
                },

                // Call all the callbacks with the given arguments
                fire: function() {
                    self.fireWith( this, arguments );
                    return this;
                },

                // To know if the callbacks have already been called at least once
                fired: function() {
                    return !!fired;
                }
            };

        return self;
    };


    function Identity( v ) {
        return v;
    }
    function Thrower( ex ) {
        throw ex;
    }

    function adoptValue( value, resolve, reject, noValue ) {
        var method;

        try {

            // Check for promise aspect first to privilege synchronous behavior
            if ( value && isFunction( ( method = value.promise ) ) ) {
                method.call( value ).done( resolve ).fail( reject );

                // Other thenables
            } else if ( value && isFunction( ( method = value.then ) ) ) {
                method.call( value, resolve, reject );

                // Other non-thenables
            } else {

                // Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
                // * false: [ value ].slice( 0 ) => resolve( value )
                // * true: [ value ].slice( 1 ) => resolve()
                resolve.apply( undefined, [ value ].slice( noValue ) );
            }

            // For Promises/A+, convert exceptions into rejections
            // Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
            // Deferred#then to conditionally suppress rejection.
        } catch ( value ) {

            // Support: Android 4.0 only
            // Strict mode functions invoked without .call/.apply get global-object context
            reject.apply( undefined, [ value ] );
        }
    }

    jQuery.extend( {

        Deferred: function( func ) {
            var tuples = [

                    // action, add listener, callbacks,
                    // ... .then handlers, argument index, [final state]
                    [ "notify", "progress", jQuery.Callbacks( "memory" ),
                        jQuery.Callbacks( "memory" ), 2 ],
                    [ "resolve", "done", jQuery.Callbacks( "once memory" ),
                        jQuery.Callbacks( "once memory" ), 0, "resolved" ],
                    [ "reject", "fail", jQuery.Callbacks( "once memory" ),
                        jQuery.Callbacks( "once memory" ), 1, "rejected" ]
                ],
                state = "pending",
                promise = {
                    state: function() {
                        return state;
                    },
                    always: function() {
                        deferred.done( arguments ).fail( arguments );
                        return this;
                    },
                    "catch": function( fn ) {
                        return promise.then( null, fn );
                    },

                    // Keep pipe for back-compat
                    pipe: function( /* fnDone, fnFail, fnProgress */ ) {
                        var fns = arguments;

                        return jQuery.Deferred( function( newDefer ) {
                            jQuery.each( tuples, function( i, tuple ) {

                                // Map tuples (progress, done, fail) to arguments (done, fail, progress)
                                var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

                                // deferred.progress(function() { bind to newDefer or newDefer.notify })
                                // deferred.done(function() { bind to newDefer or newDefer.resolve })
                                // deferred.fail(function() { bind to newDefer or newDefer.reject })
                                deferred[ tuple[ 1 ] ]( function() {
                                    var returned = fn && fn.apply( this, arguments );
                                    if ( returned && isFunction( returned.promise ) ) {
                                        returned.promise()
                                            .progress( newDefer.notify )
                                            .done( newDefer.resolve )
                                            .fail( newDefer.reject );
                                    } else {
                                        newDefer[ tuple[ 0 ] + "With" ](
                                            this,
                                            fn ? [ returned ] : arguments
                                        );
                                    }
                                } );
                            } );
                            fns = null;
                        } ).promise();
                    },
                    then: function( onFulfilled, onRejected, onProgress ) {
                        var maxDepth = 0;
                        function resolve( depth, deferred, handler, special ) {
                            return function() {
                                var that = this,
                                    args = arguments,
                                    mightThrow = function() {
                                        var returned, then;

                                        // Support: Promises/A+ section 2.3.3.3.3
                                        // https://promisesaplus.com/#point-59
                                        // Ignore double-resolution attempts
                                        if ( depth < maxDepth ) {
                                            return;
                                        }

                                        returned = handler.apply( that, args );

                                        // Support: Promises/A+ section 2.3.1
                                        // https://promisesaplus.com/#point-48
                                        if ( returned === deferred.promise() ) {
                                            throw new TypeError( "Thenable self-resolution" );
                                        }

                                        // Support: Promises/A+ sections 2.3.3.1, 3.5
                                        // https://promisesaplus.com/#point-54
                                        // https://promisesaplus.com/#point-75
                                        // Retrieve `then` only once
                                        then = returned &&

                                            // Support: Promises/A+ section 2.3.4
                                            // https://promisesaplus.com/#point-64
                                            // Only check objects and functions for thenability
                                            ( typeof returned === "object" ||
                                                typeof returned === "function" ) &&
                                            returned.then;

                                        // Handle a returned thenable
                                        if ( isFunction( then ) ) {

                                            // Special processors (notify) just wait for resolution
                                            if ( special ) {
                                                then.call(
                                                    returned,
                                                    resolve( maxDepth, deferred, Identity, special ),
                                                    resolve( maxDepth, deferred, Thrower, special )
                                                );

                                                // Normal processors (resolve) also hook into progress
                                            } else {

                                                // ...and disregard older resolution values
                                                maxDepth++;

                                                then.call(
                                                    returned,
                                                    resolve( maxDepth, deferred, Identity, special ),
                                                    resolve( maxDepth, deferred, Thrower, special ),
                                                    resolve( maxDepth, deferred, Identity,
                                                        deferred.notifyWith )
                                                );
                                            }

                                            // Handle all other returned values
                                        } else {

                                            // Only substitute handlers pass on context
                                            // and multiple values (non-spec behavior)
                                            if ( handler !== Identity ) {
                                                that = undefined;
                                                args = [ returned ];
                                            }

                                            // Process the value(s)
                                            // Default process is resolve
                                            ( special || deferred.resolveWith )( that, args );
                                        }
                                    },

                                    // Only normal processors (resolve) catch and reject exceptions
                                    process = special ?
                                        mightThrow :
                                        function() {
                                            try {
                                                mightThrow();
                                            } catch ( e ) {

                                                if ( jQuery.Deferred.exceptionHook ) {
                                                    jQuery.Deferred.exceptionHook( e,
                                                        process.stackTrace );
                                                }

                                                // Support: Promises/A+ section 2.3.3.3.4.1
                                                // https://promisesaplus.com/#point-61
                                                // Ignore post-resolution exceptions
                                                if ( depth + 1 >= maxDepth ) {

                                                    // Only substitute handlers pass on context
                                                    // and multiple values (non-spec behavior)
                                                    if ( handler !== Thrower ) {
                                                        that = undefined;
                                                        args = [ e ];
                                                    }

                                                    deferred.rejectWith( that, args );
                                                }
                                            }
                                        };

                                // Support: Promises/A+ section 2.3.3.3.1
                                // https://promisesaplus.com/#point-57
                                // Re-resolve promises immediately to dodge false rejection from
                                // subsequent errors
                                if ( depth ) {
                                    process();
                                } else {

                                    // Call an optional hook to record the stack, in case of exception
                                    // since it's otherwise lost when execution goes async
                                    if ( jQuery.Deferred.getStackHook ) {
                                        process.stackTrace = jQuery.Deferred.getStackHook();
                                    }
                                    window.setTimeout( process );
                                }
                            };
                        }

                        return jQuery.Deferred( function( newDefer ) {

                            // progress_handlers.add( ... )
                            tuples[ 0 ][ 3 ].add(
                                resolve(
                                    0,
                                    newDefer,
                                    isFunction( onProgress ) ?
                                        onProgress :
                                        Identity,
                                    newDefer.notifyWith
                                )
                            );

                            // fulfilled_handlers.add( ... )
                            tuples[ 1 ][ 3 ].add(
                                resolve(
                                    0,
                                    newDefer,
                                    isFunction( onFulfilled ) ?
                                        onFulfilled :
                                        Identity
                                )
                            );

                            // rejected_handlers.add( ... )
                            tuples[ 2 ][ 3 ].add(
                                resolve(
                                    0,
                                    newDefer,
                                    isFunction( onRejected ) ?
                                        onRejected :
                                        Thrower
                                )
                            );
                        } ).promise();
                    },

                    // Get a promise for this deferred
                    // If obj is provided, the promise aspect is added to the object
                    promise: function( obj ) {
                        return obj != null ? jQuery.extend( obj, promise ) : promise;
                    }
                },
                deferred = {};

            // Add list-specific methods
            jQuery.each( tuples, function( i, tuple ) {
                var list = tuple[ 2 ],
                    stateString = tuple[ 5 ];

                // promise.progress = list.add
                // promise.done = list.add
                // promise.fail = list.add
                promise[ tuple[ 1 ] ] = list.add;

                // Handle state
                if ( stateString ) {
                    list.add(
                        function() {

                            // state = "resolved" (i.e., fulfilled)
                            // state = "rejected"
                            state = stateString;
                        },

                        // rejected_callbacks.disable
                        // fulfilled_callbacks.disable
                        tuples[ 3 - i ][ 2 ].disable,

                        // rejected_handlers.disable
                        // fulfilled_handlers.disable
                        tuples[ 3 - i ][ 3 ].disable,

                        // progress_callbacks.lock
                        tuples[ 0 ][ 2 ].lock,

                        // progress_handlers.lock
                        tuples[ 0 ][ 3 ].lock
                    );
                }

                // progress_handlers.fire
                // fulfilled_handlers.fire
                // rejected_handlers.fire
                list.add( tuple[ 3 ].fire );

                // deferred.notify = function() { deferred.notifyWith(...) }
                // deferred.resolve = function() { deferred.resolveWith(...) }
                // deferred.reject = function() { deferred.rejectWith(...) }
                deferred[ tuple[ 0 ] ] = function() {
                    deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
                    return this;
                };

                // deferred.notifyWith = list.fireWith
                // deferred.resolveWith = list.fireWith
                // deferred.rejectWith = list.fireWith
                deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
            } );

            // Make the deferred a promise
            promise.promise( deferred );

            // Call given func if any
            if ( func ) {
                func.call( deferred, deferred );
            }

            // All done!
            return deferred;
        },

        // Deferred helper
        when: function( singleValue ) {
            var

                // count of uncompleted subordinates
                remaining = arguments.length,

                // count of unprocessed arguments
                i = remaining,

                // subordinate fulfillment data
                resolveContexts = Array( i ),
                resolveValues = slice.call( arguments ),

                // the master Deferred
                master = jQuery.Deferred(),

                // subordinate callback factory
                updateFunc = function( i ) {
                    return function( value ) {
                        resolveContexts[ i ] = this;
                        resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
                        if ( !( --remaining ) ) {
                            master.resolveWith( resolveContexts, resolveValues );
                        }
                    };
                };

            // Single- and empty arguments are adopted like Promise.resolve
            if ( remaining <= 1 ) {
                adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
                    !remaining );

                // Use .then() to unwrap secondary thenables (cf. gh-3000)
                if ( master.state() === "pending" ||
                    isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

                    return master.then();
                }
            }

            // Multiple arguments are aggregated like Promise.all array elements
            while ( i-- ) {
                adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
            }

            return master.promise();
        }
    } );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
    var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

    jQuery.Deferred.exceptionHook = function( error, stack ) {

        // Support: IE 8 - 9 only
        // Console exists when dev tools are open, which can happen at any time
        if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
            window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
        }
    };




    jQuery.readyException = function( error ) {
        window.setTimeout( function() {
            throw error;
        } );
    };




// The deferred used on DOM ready
    var readyList = jQuery.Deferred();

    jQuery.fn.ready = function( fn ) {

        readyList
            .then( fn )

            // Wrap jQuery.readyException in a function so that the lookup
            // happens at the time of error handling instead of callback
            // registration.
            .catch( function( error ) {
                jQuery.readyException( error );
            } );

        return this;
    };

    jQuery.extend( {

        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,

        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,

        // Handle when the DOM is ready
        ready: function( wait ) {

            // Abort if there are pending holds or we're already ready
            if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
                return;
            }

            // Remember that the DOM is ready
            jQuery.isReady = true;

            // If a normal DOM Ready event fired, decrement, and wait if need be
            if ( wait !== true && --jQuery.readyWait > 0 ) {
                return;
            }

            // If there are functions bound, to execute
            readyList.resolveWith( document, [ jQuery ] );
        }
    } );

    jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
    function completed() {
        document.removeEventListener( "DOMContentLoaded", completed );
        window.removeEventListener( "load", completed );
        jQuery.ready();
    }

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
    if ( document.readyState === "complete" ||
        ( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

        // Handle it asynchronously to allow scripts the opportunity to delay ready
        window.setTimeout( jQuery.ready );

    } else {

        // Use the handy event callback
        document.addEventListener( "DOMContentLoaded", completed );

        // A fallback to window.onload, that will always work
        window.addEventListener( "load", completed );
    }




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
    var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
        var i = 0,
            len = elems.length,
            bulk = key == null;

        // Sets many values
        if ( toType( key ) === "object" ) {
            chainable = true;
            for ( i in key ) {
                access( elems, fn, i, key[ i ], true, emptyGet, raw );
            }

            // Sets one value
        } else if ( value !== undefined ) {
            chainable = true;

            if ( !isFunction( value ) ) {
                raw = true;
            }

            if ( bulk ) {

                // Bulk operations run against the entire set
                if ( raw ) {
                    fn.call( elems, value );
                    fn = null;

                    // ...except when executing function values
                } else {
                    bulk = fn;
                    fn = function( elem, key, value ) {
                        return bulk.call( jQuery( elem ), value );
                    };
                }
            }

            if ( fn ) {
                for ( ; i < len; i++ ) {
                    fn(
                        elems[ i ], key, raw ?
                            value :
                            value.call( elems[ i ], i, fn( elems[ i ], key ) )
                    );
                }
            }
        }

        if ( chainable ) {
            return elems;
        }

        // Gets
        if ( bulk ) {
            return fn.call( elems );
        }

        return len ? fn( elems[ 0 ], key ) : emptyGet;
    };


// Matches dashed string for camelizing
    var rmsPrefix = /^-ms-/,
        rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
    function fcamelCase( all, letter ) {
        return letter.toUpperCase();
    }

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
    function camelCase( string ) {
        return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    }
    var acceptData = function( owner ) {

        // Accepts only:
        //  - Node
        //    - Node.ELEMENT_NODE
        //    - Node.DOCUMENT_NODE
        //  - Object
        //    - Any
        return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
    };




    function Data() {
        this.expando = jQuery.expando + Data.uid++;
    }

    Data.uid = 1;

    Data.prototype = {

        cache: function( owner ) {

            // Check if the owner object already has a cache
            var value = owner[ this.expando ];

            // If not, create one
            if ( !value ) {
                value = {};

                // We can accept data for non-element nodes in modern browsers,
                // but we should not, see #8335.
                // Always return an empty object.
                if ( acceptData( owner ) ) {

                    // If it is a node unlikely to be stringify-ed or looped over
                    // use plain assignment
                    if ( owner.nodeType ) {
                        owner[ this.expando ] = value;

                        // Otherwise secure it in a non-enumerable property
                        // configurable must be true to allow the property to be
                        // deleted when data is removed
                    } else {
                        Object.defineProperty( owner, this.expando, {
                            value: value,
                            configurable: true
                        } );
                    }
                }
            }

            return value;
        },
        set: function( owner, data, value ) {
            var prop,
                cache = this.cache( owner );

            // Handle: [ owner, key, value ] args
            // Always use camelCase key (gh-2257)
            if ( typeof data === "string" ) {
                cache[ camelCase( data ) ] = value;

                // Handle: [ owner, { properties } ] args
            } else {

                // Copy the properties one-by-one to the cache object
                for ( prop in data ) {
                    cache[ camelCase( prop ) ] = data[ prop ];
                }
            }
            return cache;
        },
        get: function( owner, key ) {
            return key === undefined ?
                this.cache( owner ) :

                // Always use camelCase key (gh-2257)
                owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
        },
        access: function( owner, key, value ) {

            // In cases where either:
            //
            //   1. No key was specified
            //   2. A string key was specified, but no value provided
            //
            // Take the "read" path and allow the get method to determine
            // which value to return, respectively either:
            //
            //   1. The entire cache object
            //   2. The data stored at the key
            //
            if ( key === undefined ||
                ( ( key && typeof key === "string" ) && value === undefined ) ) {

                return this.get( owner, key );
            }

            // When the key is not a string, or both a key and value
            // are specified, set or extend (existing objects) with either:
            //
            //   1. An object of properties
            //   2. A key and value
            //
            this.set( owner, key, value );

            // Since the "set" path can have two possible entry points
            // return the expected data based on which path was taken[*]
            return value !== undefined ? value : key;
        },
        remove: function( owner, key ) {
            var i,
                cache = owner[ this.expando ];

            if ( cache === undefined ) {
                return;
            }

            if ( key !== undefined ) {

                // Support array or space separated string of keys
                if ( Array.isArray( key ) ) {

                    // If key is an array of keys...
                    // We always set camelCase keys, so remove that.
                    key = key.map( camelCase );
                } else {
                    key = camelCase( key );

                    // If a key with the spaces exists, use it.
                    // Otherwise, create an array by matching non-whitespace
                    key = key in cache ?
                        [ key ] :
                        ( key.match( rnothtmlwhite ) || [] );
                }

                i = key.length;

                while ( i-- ) {
                    delete cache[ key[ i ] ];
                }
            }

            // Remove the expando if there's no more data
            if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

                // Support: Chrome <=35 - 45
                // Webkit & Blink performance suffers when deleting properties
                // from DOM nodes, so set to undefined instead
                // https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
                if ( owner.nodeType ) {
                    owner[ this.expando ] = undefined;
                } else {
                    delete owner[ this.expando ];
                }
            }
        },
        hasData: function( owner ) {
            var cache = owner[ this.expando ];
            return cache !== undefined && !jQuery.isEmptyObject( cache );
        }
    };
    var dataPriv = new Data();

    var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

    var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        rmultiDash = /[A-Z]/g;

    function getData( data ) {
        if ( data === "true" ) {
            return true;
        }

        if ( data === "false" ) {
            return false;
        }

        if ( data === "null" ) {
            return null;
        }

        // Only convert to a number if it doesn't change the string
        if ( data === +data + "" ) {
            return +data;
        }

        if ( rbrace.test( data ) ) {
            return JSON.parse( data );
        }

        return data;
    }

    function dataAttr( elem, key, data ) {
        var name;

        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if ( data === undefined && elem.nodeType === 1 ) {
            name = "data-" + key.replace( rmultiDash, "-{{jquery}}" ).toLowerCase();
            data = elem.getAttribute( name );

            if ( typeof data === "string" ) {
                try {
                    data = getData( data );
                } catch ( e ) {}

                // Make sure we set the data so it isn't changed later
                dataUser.set( elem, key, data );
            } else {
                data = undefined;
            }
        }
        return data;
    }

    jQuery.extend( {
        hasData: function( elem ) {
            return dataUser.hasData( elem ) || dataPriv.hasData( elem );
        },

        data: function( elem, name, data ) {
            return dataUser.access( elem, name, data );
        },

        removeData: function( elem, name ) {
            dataUser.remove( elem, name );
        },

        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function( elem, name, data ) {
            return dataPriv.access( elem, name, data );
        },

        _removeData: function( elem, name ) {
            dataPriv.remove( elem, name );
        }
    } );

    jQuery.fn.extend( {
        data: function( key, value ) {
            var i, name, data,
                elem = this[ 0 ],
                attrs = elem && elem.attributes;

            // Gets all values
            if ( key === undefined ) {
                if ( this.length ) {
                    data = dataUser.get( elem );

                    if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
                        i = attrs.length;
                        while ( i-- ) {

                            // Support: IE 11 only
                            // The attrs elements can be null (#14894)
                            if ( attrs[ i ] ) {
                                name = attrs[ i ].name;
                                if ( name.indexOf( "data-" ) === 0 ) {
                                    name = camelCase( name.slice( 5 ) );
                                    dataAttr( elem, name, data[ name ] );
                                }
                            }
                        }
                        dataPriv.set( elem, "hasDataAttrs", true );
                    }
                }

                return data;
            }

            // Sets multiple values
            if ( typeof key === "object" ) {
                return this.each( function() {
                    dataUser.set( this, key );
                } );
            }

            return access( this, function( value ) {
                var data;

                // The calling jQuery object (element matches) is not empty
                // (and therefore has an element appears at this[ 0 ]) and the
                // `value` parameter was not undefined. An empty jQuery object
                // will result in `undefined` for elem = this[ 0 ] which will
                // throw an exception if an attempt to read a data cache is made.
                if ( elem && value === undefined ) {

                    // Attempt to get data from the cache
                    // The key will always be camelCased in Data
                    data = dataUser.get( elem, key );
                    if ( data !== undefined ) {
                        return data;
                    }

                    // Attempt to "discover" the data in
                    // HTML5 custom data-* attrs
                    data = dataAttr( elem, key );
                    if ( data !== undefined ) {
                        return data;
                    }

                    // We tried really hard, but the data doesn't exist.
                    return;
                }

                // Set the data...
                this.each( function() {

                    // We always store the camelCased key
                    dataUser.set( this, key, value );
                } );
            }, null, value, arguments.length > 1, null, true );
        },

        removeData: function( key ) {
            return this.each( function() {
                dataUser.remove( this, key );
            } );
        }
    } );


    jQuery.extend( {
        queue: function( elem, type, data ) {
            var queue;

            if ( elem ) {
                type = ( type || "fx" ) + "queue";
                queue = dataPriv.get( elem, type );

                // Speed up dequeue by getting out quickly if this is just a lookup
                if ( data ) {
                    if ( !queue || Array.isArray( data ) ) {
                        queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
                    } else {
                        queue.push( data );
                    }
                }
                return queue || [];
            }
        },

        dequeue: function( elem, type ) {
            type = type || "fx";

            var queue = jQuery.queue( elem, type ),
                startLength = queue.length,
                fn = queue.shift(),
                hooks = jQuery._queueHooks( elem, type ),
                next = function() {
                    jQuery.dequeue( elem, type );
                };

            // If the fx queue is dequeued, always remove the progress sentinel
            if ( fn === "inprogress" ) {
                fn = queue.shift();
                startLength--;
            }

            if ( fn ) {

                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if ( type === "fx" ) {
                    queue.unshift( "inprogress" );
                }

                // Clear up the last queue stop function
                delete hooks.stop;
                fn.call( elem, next, hooks );
            }

            if ( !startLength && hooks ) {
                hooks.empty.fire();
            }
        },

        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function( elem, type ) {
            var key = type + "queueHooks";
            return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
                empty: jQuery.Callbacks( "once memory" ).add( function() {
                    dataPriv.remove( elem, [ type + "queue", key ] );
                } )
            } );
        }
    } );

    jQuery.fn.extend( {
        queue: function( type, data ) {
            var setter = 2;

            if ( typeof type !== "string" ) {
                data = type;
                type = "fx";
                setter--;
            }

            if ( arguments.length < setter ) {
                return jQuery.queue( this[ 0 ], type );
            }

            return data === undefined ?
                this :
                this.each( function() {
                    var queue = jQuery.queue( this, type, data );

                    // Ensure a hooks for this queue
                    jQuery._queueHooks( this, type );

                    if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
                        jQuery.dequeue( this, type );
                    }
                } );
        },
        dequeue: function( type ) {
            return this.each( function() {
                jQuery.dequeue( this, type );
            } );
        },
        clearQueue: function( type ) {
            return this.queue( type || "fx", [] );
        },

        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function( type, obj ) {
            var tmp,
                count = 1,
                defer = jQuery.Deferred(),
                elements = this,
                i = this.length,
                resolve = function() {
                    if ( !( --count ) ) {
                        defer.resolveWith( elements, [ elements ] );
                    }
                };

            if ( typeof type !== "string" ) {
                obj = type;
                type = undefined;
            }
            type = type || "fx";

            while ( i-- ) {
                tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
                if ( tmp && tmp.empty ) {
                    count++;
                    tmp.empty.add( resolve );
                }
            }
            resolve();
            return defer.promise( obj );
        }
    } );
    var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

    var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


    var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

    var documentElement = document.documentElement;



    var isAttached = function( elem ) {
            return jQuery.contains( elem.ownerDocument, elem );
        },
        composed = { composed: true };

    // Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
    // Check attachment across shadow DOM boundaries when possible (gh-3504)
    // Support: iOS 10.0-10.2 only
    // Early iOS 10 versions support `attachShadow` but not `getRootNode`,
    // leading to errors. We need to check for `getRootNode`.
    if ( documentElement.getRootNode ) {
        isAttached = function( elem ) {
            return jQuery.contains( elem.ownerDocument, elem ) ||
                elem.getRootNode( composed ) === elem.ownerDocument;
        };
    }
    var isHiddenWithinTree = function( elem, el ) {

        // isHiddenWithinTree might be called from jQuery#filter function;
        // in that case, element will be second argument
        elem = el || elem;

        // Inline style trumps all
        return elem.style.display === "none" ||
            elem.style.display === "" &&

            // Otherwise, check computed style
            // Support: Firefox <=43 - 45
            // Disconnected elements can have computed display: none, so first confirm that elem is
            // in the document.
            isAttached( elem ) &&

            jQuery.css( elem, "display" ) === "none";
    };

    var swap = function( elem, options, callback, args ) {
        var ret, name,
            old = {};

        // Remember the old values, and insert the new ones
        for ( name in options ) {
            old[ name ] = elem.style[ name ];
            elem.style[ name ] = options[ name ];
        }

        ret = callback.apply( elem, args || [] );

        // Revert the old values
        for ( name in options ) {
            elem.style[ name ] = old[ name ];
        }

        return ret;
    };




    function adjustCSS( elem, prop, valueParts, tween ) {
        var adjusted, scale,
            maxIterations = 20,
            currentValue = tween ?
                function() {
                    return tween.cur();
                } :
                function() {
                    return jQuery.css( elem, prop, "" );
                },
            initial = currentValue(),
            unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

            // Starting value computation is required for potential unit mismatches
            initialInUnit = elem.nodeType &&
                ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
                rcssNum.exec( jQuery.css( elem, prop ) );

        if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

            // Support: Firefox <=54
            // Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
            initial = initial / 2;

            // Trust units reported by jQuery.css
            unit = unit || initialInUnit[ 3 ];

            // Iteratively approximate from a nonzero starting point
            initialInUnit = +initial || 1;

            while ( maxIterations-- ) {

                // Evaluate and update our best guess (doubling guesses that zero out).
                // Finish if the scale equals or crosses 1 (making the old*new product non-positive).
                jQuery.style( elem, prop, initialInUnit + unit );
                if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
                    maxIterations = 0;
                }
                initialInUnit = initialInUnit / scale;

            }

            initialInUnit = initialInUnit * 2;
            jQuery.style( elem, prop, initialInUnit + unit );

            // Make sure we update the tween properties later on
            valueParts = valueParts || [];
        }

        if ( valueParts ) {
            initialInUnit = +initialInUnit || +initial || 0;

            // Apply relative offset (+=/-=) if specified
            adjusted = valueParts[ 1 ] ?
                initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
                +valueParts[ 2 ];
            if ( tween ) {
                tween.unit = unit;
                tween.start = initialInUnit;
                tween.end = adjusted;
            }
        }
        return adjusted;
    }


    var defaultDisplayMap = {};

    function getDefaultDisplay( elem ) {
        var temp,
            doc = elem.ownerDocument,
            nodeName = elem.nodeName,
            display = defaultDisplayMap[ nodeName ];

        if ( display ) {
            return display;
        }

        temp = doc.body.appendChild( doc.createElement( nodeName ) );
        display = jQuery.css( temp, "display" );

        temp.parentNode.removeChild( temp );

        if ( display === "none" ) {
            display = "block";
        }
        defaultDisplayMap[ nodeName ] = display;

        return display;
    }

    function showHide( elements, show ) {
        var display, elem,
            values = [],
            index = 0,
            length = elements.length;

        // Determine new display value for elements that need to change
        for ( ; index < length; index++ ) {
            elem = elements[ index ];
            if ( !elem.style ) {
                continue;
            }

            display = elem.style.display;
            if ( show ) {

                // Since we force visibility upon cascade-hidden elements, an immediate (and slow)
                // check is required in this first loop unless we have a nonempty display value (either
                // inline or about-to-be-restored)
                if ( display === "none" ) {
                    values[ index ] = dataPriv.get( elem, "display" ) || null;
                    if ( !values[ index ] ) {
                        elem.style.display = "";
                    }
                }
                if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
                    values[ index ] = getDefaultDisplay( elem );
                }
            } else {
                if ( display !== "none" ) {
                    values[ index ] = "none";

                    // Remember what we're overwriting
                    dataPriv.set( elem, "display", display );
                }
            }
        }

        // Set the display of the elements in a second loop to avoid constant reflow
        for ( index = 0; index < length; index++ ) {
            if ( values[ index ] != null ) {
                elements[ index ].style.display = values[ index ];
            }
        }

        return elements;
    }

    jQuery.fn.extend( {
        show: function() {
            return showHide( this, true );
        },
        hide: function() {
            return showHide( this );
        },
        toggle: function( state ) {
            if ( typeof state === "boolean" ) {
                return state ? this.show() : this.hide();
            }

            return this.each( function() {
                if ( isHiddenWithinTree( this ) ) {
                    jQuery( this ).show();
                } else {
                    jQuery( this ).hide();
                }
            } );
        }
    } );
    var rcheckableType = ( /^(?:checkbox|radio)$/i );

    var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

    var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
    var wrapMap = {

        // Support: IE <=9 only
        option: [ 1, "<select multiple='multiple'>", "</select>" ],

        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [ 1, "<table>", "</table>" ],
        col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

        _default: [ 0, "", "" ]
    };

// Support: IE <=9 only
    wrapMap.optgroup = wrapMap.option;

    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;


    function getAll( context, tag ) {

        // Support: IE <=9 - 11 only
        // Use typeof to avoid zero-argument method invocation on host objects (#15151)
        var ret;

        if ( typeof context.getElementsByTagName !== "undefined" ) {
            ret = context.getElementsByTagName( tag || "*" );

        } else if ( typeof context.querySelectorAll !== "undefined" ) {
            ret = context.querySelectorAll( tag || "*" );

        } else {
            ret = [];
        }

        if ( tag === undefined || tag && nodeName( context, tag ) ) {
            return jQuery.merge( [ context ], ret );
        }

        return ret;
    }


// Mark scripts as having already been evaluated
    function setGlobalEval( elems, refElements ) {
        var i = 0,
            l = elems.length;

        for ( ; i < l; i++ ) {
            dataPriv.set(
                elems[ i ],
                "globalEval",
                !refElements || dataPriv.get( refElements[ i ], "globalEval" )
            );
        }
    }


    var rhtml = /<|&#?\w+;/;

    function buildFragment( elems, context, scripts, selection, ignored ) {
        var elem, tmp, tag, wrap, attached, j,
            fragment = context.createDocumentFragment(),
            nodes = [],
            i = 0,
            l = elems.length;

        for ( ; i < l; i++ ) {
            elem = elems[ i ];

            if ( elem || elem === 0 ) {

                // Add nodes directly
                if ( toType( elem ) === "object" ) {

                    // Support: Android <=4.0 only, PhantomJS 1 only
                    // push.apply(_, arraylike) throws on ancient WebKit
                    jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

                    // Convert non-html into a text node
                } else if ( !rhtml.test( elem ) ) {
                    nodes.push( context.createTextNode( elem ) );

                    // Convert html into DOM nodes
                } else {
                    tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

                    // Deserialize a standard representation
                    tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
                    wrap = wrapMap[ tag ] || wrapMap._default;
                    tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

                    // Descend through wrappers to the right content
                    j = wrap[ 0 ];
                    while ( j-- ) {
                        tmp = tmp.lastChild;
                    }

                    // Support: Android <=4.0 only, PhantomJS 1 only
                    // push.apply(_, arraylike) throws on ancient WebKit
                    jQuery.merge( nodes, tmp.childNodes );

                    // Remember the top-level container
                    tmp = fragment.firstChild;

                    // Ensure the created nodes are orphaned (#12392)
                    tmp.textContent = "";
                }
            }
        }

        // Remove wrapper from fragment
        fragment.textContent = "";

        i = 0;
        while ( ( elem = nodes[ i++ ] ) ) {

            // Skip elements already in the context collection (trac-4087)
            if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
                if ( ignored ) {
                    ignored.push( elem );
                }
                continue;
            }

            attached = isAttached( elem );

            // Append to fragment
            tmp = getAll( fragment.appendChild( elem ), "script" );

            // Preserve script evaluation history
            if ( attached ) {
                setGlobalEval( tmp );
            }

            // Capture executables
            if ( scripts ) {
                j = 0;
                while ( ( elem = tmp[ j++ ] ) ) {
                    if ( rscriptType.test( elem.type || "" ) ) {
                        scripts.push( elem );
                    }
                }
            }
        }

        return fragment;
    }


    ( function() {
        var fragment = document.createDocumentFragment(),
            div = fragment.appendChild( document.createElement( "div" ) ),
            input = document.createElement( "input" );

        // Support: Android 4.0 - 4.3 only
        // Check state lost if the name is set (#11217)
        // Support: Windows Web Apps (WWA)
        // `name` and `type` must use .setAttribute for WWA (#14901)
        input.setAttribute( "type", "radio" );
        input.setAttribute( "checked", "checked" );
        input.setAttribute( "name", "t" );

        div.appendChild( input );

        // Support: Android <=4.1 only
        // Older WebKit doesn't clone checked state correctly in fragments
        support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

        // Support: IE <=11 only
        // Make sure textarea (and checkbox) defaultValue is properly cloned
        div.innerHTML = "<textarea>x</textarea>";
        support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
    } )();


    var
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
    function expectSync( elem, type ) {
        return ( elem === safeActiveElement() ) === ( type === "focus" );
    }

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
    function safeActiveElement() {
        try {
            return document.activeElement;
        } catch ( err ) { }
    }

    function on( elem, types, selector, data, fn, one ) {
        var origFn, type;

        // Types can be a map of types/handlers
        if ( typeof types === "object" ) {

            // ( types-Object, selector, data )
            if ( typeof selector !== "string" ) {

                // ( types-Object, data )
                data = data || selector;
                selector = undefined;
            }
            for ( type in types ) {
                on( elem, type, selector, data, types[ type ], one );
            }
            return elem;
        }

        if ( data == null && fn == null ) {

            // ( types, fn )
            fn = selector;
            data = selector = undefined;
        } else if ( fn == null ) {
            if ( typeof selector === "string" ) {

                // ( types, selector, fn )
                fn = data;
                data = undefined;
            } else {

                // ( types, data, fn )
                fn = data;
                data = selector;
                selector = undefined;
            }
        }
        if ( fn === false ) {
            fn = returnFalse;
        } else if ( !fn ) {
            return elem;
        }

        if ( one === 1 ) {
            origFn = fn;
            fn = function( event ) {

                // Can use an empty set, since event contains the info
                jQuery().off( event );
                return origFn.apply( this, arguments );
            };

            // Use same guid so caller can remove using origFn
            fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
        }
        return elem.each( function() {
            jQuery.event.add( this, types, fn, data, selector );
        } );
    }

    /*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
    jQuery.event = {

        global: {},

        add: function( elem, types, handler, data, selector ) {

            var handleObjIn, eventHandle, tmp,
                events, t, handleObj,
                special, handlers, type, namespaces, origType,
                elemData = dataPriv.get( elem );

            // Don't attach events to noData or text/comment nodes (but allow plain objects)
            if ( !elemData ) {
                return;
            }

            // Caller can pass in an object of custom data in lieu of the handler
            if ( handler.handler ) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }

            // Ensure that invalid selectors throw exceptions at attach time
            // Evaluate against documentElement in case elem is a non-element node (e.g., document)
            if ( selector ) {
                jQuery.find.matchesSelector( documentElement, selector );
            }

            // Make sure that the handler has a unique ID, used to find/remove it later
            if ( !handler.guid ) {
                handler.guid = jQuery.guid++;
            }

            // Init the element's event structure and main handler, if this is the first
            if ( !( events = elemData.events ) ) {
                events = elemData.events = {};
            }
            if ( !( eventHandle = elemData.handle ) ) {
                eventHandle = elemData.handle = function( e ) {

                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
                        jQuery.event.dispatch.apply( elem, arguments ) : undefined;
                };
            }

            // Handle multiple events separated by a space
            types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
            t = types.length;
            while ( t-- ) {
                tmp = rtypenamespace.exec( types[ t ] ) || [];
                type = origType = tmp[ 1 ];
                namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

                // There *must* be a type, no attaching namespace-only handlers
                if ( !type ) {
                    continue;
                }

                // If event changes its type, use the special event handlers for the changed type
                special = jQuery.event.special[ type ] || {};

                // If selector defined, determine special event api type, otherwise given type
                type = ( selector ? special.delegateType : special.bindType ) || type;

                // Update special based on newly reset type
                special = jQuery.event.special[ type ] || {};

                // handleObj is passed to all event handlers
                handleObj = jQuery.extend( {
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
                    namespace: namespaces.join( "." )
                }, handleObjIn );

                // Init the event handler queue if we're the first
                if ( !( handlers = events[ type ] ) ) {
                    handlers = events[ type ] = [];
                    handlers.delegateCount = 0;

                    // Only use addEventListener if the special events handler returns false
                    if ( !special.setup ||
                        special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

                        if ( elem.addEventListener ) {
                            elem.addEventListener( type, eventHandle );
                        }
                    }
                }

                if ( special.add ) {
                    special.add.call( elem, handleObj );

                    if ( !handleObj.handler.guid ) {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                // Add to the element's handler list, delegates in front
                if ( selector ) {
                    handlers.splice( handlers.delegateCount++, 0, handleObj );
                } else {
                    handlers.push( handleObj );
                }

                // Keep track of which events have ever been used, for event optimization
                jQuery.event.global[ type ] = true;
            }

        },

        // Detach an event or set of events from an element
        remove: function( elem, types, handler, selector, mappedTypes ) {

            var j, origCount, tmp,
                events, t, handleObj,
                special, handlers, type, namespaces, origType,
                elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

            if ( !elemData || !( events = elemData.events ) ) {
                return;
            }

            // Once for each type.namespace in types; type may be omitted
            types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
            t = types.length;
            while ( t-- ) {
                tmp = rtypenamespace.exec( types[ t ] ) || [];
                type = origType = tmp[ 1 ];
                namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

                // Unbind all events (on this namespace, if provided) for the element
                if ( !type ) {
                    for ( type in events ) {
                        jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
                    }
                    continue;
                }

                special = jQuery.event.special[ type ] || {};
                type = ( selector ? special.delegateType : special.bindType ) || type;
                handlers = events[ type ] || [];
                tmp = tmp[ 2 ] &&
                    new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

                // Remove matching events
                origCount = j = handlers.length;
                while ( j-- ) {
                    handleObj = handlers[ j ];

                    if ( ( mappedTypes || origType === handleObj.origType ) &&
                        ( !handler || handler.guid === handleObj.guid ) &&
                        ( !tmp || tmp.test( handleObj.namespace ) ) &&
                        ( !selector || selector === handleObj.selector ||
                            selector === "**" && handleObj.selector ) ) {
                        handlers.splice( j, 1 );

                        if ( handleObj.selector ) {
                            handlers.delegateCount--;
                        }
                        if ( special.remove ) {
                            special.remove.call( elem, handleObj );
                        }
                    }
                }

                // Remove generic event handler if we removed something and no more handlers exist
                // (avoids potential for endless recursion during removal of special event handlers)
                if ( origCount && !handlers.length ) {
                    if ( !special.teardown ||
                        special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

                        jQuery.removeEvent( elem, type, elemData.handle );
                    }

                    delete events[ type ];
                }
            }

            // Remove data and the expando if it's no longer used
            if ( jQuery.isEmptyObject( events ) ) {
                dataPriv.remove( elem, "handle events" );
            }
        },

        dispatch: function( nativeEvent ) {

            // Make a writable jQuery.Event from the native event object
            var event = jQuery.event.fix( nativeEvent );

            var i, j, ret, matched, handleObj, handlerQueue,
                args = new Array( arguments.length ),
                handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
                special = jQuery.event.special[ event.type ] || {};

            // Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[ 0 ] = event;

            for ( i = 1; i < arguments.length; i++ ) {
                args[ i ] = arguments[ i ];
            }

            event.delegateTarget = this;

            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
                return;
            }

            // Determine handlers
            handlerQueue = jQuery.event.handlers.call( this, event, handlers );

            // Run delegates first; they may want to stop propagation beneath us
            i = 0;
            while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
                event.currentTarget = matched.elem;

                j = 0;
                while ( ( handleObj = matched.handlers[ j++ ] ) &&
                !event.isImmediatePropagationStopped() ) {

                    // If the event is namespaced, then each handler is only invoked if it is
                    // specially universal or its namespaces are a superset of the event's.
                    if ( !event.rnamespace || handleObj.namespace === false ||
                        event.rnamespace.test( handleObj.namespace ) ) {

                        event.handleObj = handleObj;
                        event.data = handleObj.data;

                        ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
                            handleObj.handler ).apply( matched.elem, args );

                        if ( ret !== undefined ) {
                            if ( ( event.result = ret ) === false ) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }

            // Call the postDispatch hook for the mapped type
            if ( special.postDispatch ) {
                special.postDispatch.call( this, event );
            }

            return event.result;
        },

        handlers: function( event, handlers ) {
            var i, handleObj, sel, matchedHandlers, matchedSelectors,
                handlerQueue = [],
                delegateCount = handlers.delegateCount,
                cur = event.target;

            // Find delegate handlers
            if ( delegateCount &&

                // Support: IE <=9
                // Black-hole SVG <use> instance trees (trac-13180)
                cur.nodeType &&

                // Support: Firefox <=42
                // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
                // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
                // Support: IE 11 only
                // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
                !( event.type === "click" && event.button >= 1 ) ) {

                for ( ; cur !== this; cur = cur.parentNode || this ) {

                    // Don't check non-elements (#13208)
                    // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                    if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
                        matchedHandlers = [];
                        matchedSelectors = {};
                        for ( i = 0; i < delegateCount; i++ ) {
                            handleObj = handlers[ i ];

                            // Don't conflict with Object.prototype properties (#13203)
                            sel = handleObj.selector + " ";

                            if ( matchedSelectors[ sel ] === undefined ) {
                                matchedSelectors[ sel ] = handleObj.needsContext ?
                                    jQuery( sel, this ).index( cur ) > -1 :
                                    jQuery.find( sel, this, null, [ cur ] ).length;
                            }
                            if ( matchedSelectors[ sel ] ) {
                                matchedHandlers.push( handleObj );
                            }
                        }
                        if ( matchedHandlers.length ) {
                            handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
                        }
                    }
                }
            }

            // Add the remaining (directly-bound) handlers
            cur = this;
            if ( delegateCount < handlers.length ) {
                handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
            }

            return handlerQueue;
        },

        addProp: function( name, hook ) {
            Object.defineProperty( jQuery.Event.prototype, name, {
                enumerable: true,
                configurable: true,

                get: isFunction( hook ) ?
                    function() {
                        if ( this.originalEvent ) {
                            return hook( this.originalEvent );
                        }
                    } :
                    function() {
                        if ( this.originalEvent ) {
                            return this.originalEvent[ name ];
                        }
                    },

                set: function( value ) {
                    Object.defineProperty( this, name, {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: value
                    } );
                }
            } );
        },

        fix: function( originalEvent ) {
            return originalEvent[ jQuery.expando ] ?
                originalEvent :
                new jQuery.Event( originalEvent );
        },

        special: {
            load: {

                // Prevent triggered image.load events from bubbling to window.load
                noBubble: true
            },
            click: {

                // Utilize native event to ensure correct state for checkable inputs
                setup: function( data ) {

                    // For mutual compressibility with _default, replace `this` access with a local var.
                    // `|| data` is dead code meant only to preserve the variable through minification.
                    var el = this || data;

                    // Claim the first handler
                    if ( rcheckableType.test( el.type ) &&
                        el.click && nodeName( el, "input" ) ) {

                        // dataPriv.set( el, "click", ... )
                        leverageNative( el, "click", returnTrue );
                    }

                    // Return false to allow normal processing in the caller
                    return false;
                },
                trigger: function( data ) {

                    // For mutual compressibility with _default, replace `this` access with a local var.
                    // `|| data` is dead code meant only to preserve the variable through minification.
                    var el = this || data;

                    // Force setup before triggering a click
                    if ( rcheckableType.test( el.type ) &&
                        el.click && nodeName( el, "input" ) ) {

                        leverageNative( el, "click" );
                    }

                    // Return non-false to allow normal event-path propagation
                    return true;
                },

                // For cross-browser consistency, suppress native .click() on links
                // Also prevent it if we're currently inside a leveraged native-event stack
                _default: function( event ) {
                    var target = event.target;
                    return rcheckableType.test( target.type ) &&
                        target.click && nodeName( target, "input" ) &&
                        dataPriv.get( target, "click" ) ||
                        nodeName( target, "a" );
                }
            },

            beforeunload: {
                postDispatch: function( event ) {

                    // Support: Firefox 20+
                    // Firefox doesn't alert if the returnValue field is not set.
                    if ( event.result !== undefined && event.originalEvent ) {
                        event.originalEvent.returnValue = event.result;
                    }
                }
            }
        }
    };

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
    function leverageNative( el, type, expectSync ) {

        // Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
        if ( !expectSync ) {
            if ( dataPriv.get( el, type ) === undefined ) {
                jQuery.event.add( el, type, returnTrue );
            }
            return;
        }

        // Register the controller as a special universal handler for all event namespaces
        dataPriv.set( el, type, false );
        jQuery.event.add( el, type, {
            namespace: false,
            handler: function( event ) {
                var notAsync, result,
                    saved = dataPriv.get( this, type );

                if ( ( event.isTrigger & 1 ) && this[ type ] ) {

                    // Interrupt processing of the outer synthetic .trigger()ed event
                    // Saved data should be false in such cases, but might be a leftover capture object
                    // from an async native handler (gh-4350)
                    if ( !saved.length ) {

                        // Store arguments for use when handling the inner native event
                        // There will always be at least one argument (an event object), so this array
                        // will not be confused with a leftover capture object.
                        saved = slice.call( arguments );
                        dataPriv.set( this, type, saved );

                        // Trigger the native event and capture its result
                        // Support: IE <=9 - 11+
                        // focus() and blur() are asynchronous
                        notAsync = expectSync( this, type );
                        this[ type ]();
                        result = dataPriv.get( this, type );
                        if ( saved !== result || notAsync ) {
                            dataPriv.set( this, type, false );
                        } else {
                            result = {};
                        }
                        if ( saved !== result ) {

                            // Cancel the outer synthetic event
                            event.stopImmediatePropagation();
                            event.preventDefault();
                            return result.value;
                        }

                        // If this is an inner synthetic event for an event with a bubbling surrogate
                        // (focus or blur), assume that the surrogate already propagated from triggering the
                        // native event and prevent that from happening again here.
                        // This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
                        // bubbling surrogate propagates *after* the non-bubbling base), but that seems
                        // less bad than duplication.
                    } else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
                        event.stopPropagation();
                    }

                    // If this is a native event triggered above, everything is now in order
                    // Fire an inner synthetic event with the original arguments
                } else if ( saved.length ) {

                    // ...and capture the result
                    dataPriv.set( this, type, {
                        value: jQuery.event.trigger(

                            // Support: IE <=9 - 11+
                            // Extend with the prototype to reset the above stopImmediatePropagation()
                            jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
                            saved.slice( 1 ),
                            this
                        )
                    } );

                    // Abort handling of the native event
                    event.stopImmediatePropagation();
                }
            }
        } );
    }

    jQuery.removeEvent = function( elem, type, handle ) {

        // This "if" is needed for plain objects
        if ( elem.removeEventListener ) {
            elem.removeEventListener( type, handle );
        }
    };

    jQuery.Event = function( src, props ) {

        // Allow instantiation without the 'new' keyword
        if ( !( this instanceof jQuery.Event ) ) {
            return new jQuery.Event( src, props );
        }

        // Event object
        if ( src && src.type ) {
            this.originalEvent = src;
            this.type = src.type;

            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = src.defaultPrevented ||
            src.defaultPrevented === undefined &&

            // Support: Android <=2.3 only
            src.returnValue === false ?
                returnTrue :
                returnFalse;

            // Create target properties
            // Support: Safari <=6 - 7 only
            // Target should not be a text node (#504, #13143)
            this.target = ( src.target && src.target.nodeType === 3 ) ?
                src.target.parentNode :
                src.target;

            this.currentTarget = src.currentTarget;
            this.relatedTarget = src.relatedTarget;

            // Event type
        } else {
            this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if ( props ) {
            jQuery.extend( this, props );
        }

        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || Date.now();

        // Mark it as fixed
        this[ jQuery.expando ] = true;
    };

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        constructor: jQuery.Event,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        isSimulated: false,

        preventDefault: function() {
            var e = this.originalEvent;

            this.isDefaultPrevented = returnTrue;

            if ( e && !this.isSimulated ) {
                e.preventDefault();
            }
        },
        stopPropagation: function() {
            var e = this.originalEvent;

            this.isPropagationStopped = returnTrue;

            if ( e && !this.isSimulated ) {
                e.stopPropagation();
            }
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;

            this.isImmediatePropagationStopped = returnTrue;

            if ( e && !this.isSimulated ) {
                e.stopImmediatePropagation();
            }

            this.stopPropagation();
        }
    };

// Includes all common event props including KeyEvent and MouseEvent specific props
    jQuery.each( {
        altKey: true,
        bubbles: true,
        cancelable: true,
        changedTouches: true,
        ctrlKey: true,
        detail: true,
        eventPhase: true,
        metaKey: true,
        pageX: true,
        pageY: true,
        shiftKey: true,
        view: true,
        "char": true,
        code: true,
        charCode: true,
        key: true,
        keyCode: true,
        button: true,
        buttons: true,
        clientX: true,
        clientY: true,
        offsetX: true,
        offsetY: true,
        pointerId: true,
        pointerType: true,
        screenX: true,
        screenY: true,
        targetTouches: true,
        toElement: true,
        touches: true,

        which: function( event ) {
            var button = event.button;

            // Add which for key events
            if ( event.which == null && rkeyEvent.test( event.type ) ) {
                return event.charCode != null ? event.charCode : event.keyCode;
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
                if ( button & 1 ) {
                    return 1;
                }

                if ( button & 2 ) {
                    return 3;
                }

                if ( button & 4 ) {
                    return 2;
                }

                return 0;
            }

            return event.which;
        }
    }, jQuery.event.addProp );

    jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
        jQuery.event.special[ type ] = {

            // Utilize native event if possible so blur/focus sequence is correct
            setup: function() {

                // Claim the first handler
                // dataPriv.set( this, "focus", ... )
                // dataPriv.set( this, "blur", ... )
                leverageNative( this, type, expectSync );

                // Return false to allow normal processing in the caller
                return false;
            },
            trigger: function() {

                // Force setup before trigger
                leverageNative( this, type );

                // Return non-false to allow normal event-path propagation
                return true;
            },

            delegateType: delegateType
        };
    } );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
    jQuery.each( {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function( orig, fix ) {
        jQuery.event.special[ orig ] = {
            delegateType: fix,
            bindType: fix,

            handle: function( event ) {
                var ret,
                    target = this,
                    related = event.relatedTarget,
                    handleObj = event.handleObj;

                // For mouseenter/leave call the handler if related is outside the target.
                // NB: No relatedTarget if the mouse left/entered the browser window
                if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply( this, arguments );
                    event.type = fix;
                }
                return ret;
            }
        };
    } );

    jQuery.fn.extend( {

        on: function( types, selector, data, fn ) {
            return on( this, types, selector, data, fn );
        },
        one: function( types, selector, data, fn ) {
            return on( this, types, selector, data, fn, 1 );
        },
        off: function( types, selector, fn ) {
            var handleObj, type;
            if ( types && types.preventDefault && types.handleObj ) {

                // ( event )  dispatched jQuery.Event
                handleObj = types.handleObj;
                jQuery( types.delegateTarget ).off(
                    handleObj.namespace ?
                        handleObj.origType + "." + handleObj.namespace :
                        handleObj.origType,
                    handleObj.selector,
                    handleObj.handler
                );
                return this;
            }
            if ( typeof types === "object" ) {

                // ( types-object [, selector] )
                for ( type in types ) {
                    this.off( type, selector, types[ type ] );
                }
                return this;
            }
            if ( selector === false || typeof selector === "function" ) {

                // ( types [, fn] )
                fn = selector;
                selector = undefined;
            }
            if ( fn === false ) {
                fn = returnFalse;
            }
            return this.each( function() {
                jQuery.event.remove( this, types, fn, selector );
            } );
        }
    } );


    var

        /* eslint-disable max-len */

        // See https://github.com/eslint/eslint/issues/3229
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

        /* eslint-enable */

        // Support: IE <=10 - 11, Edge 12 - 13 only
        // In IE/Edge using regex groups here causes severe slowdowns.
        // See https://connect.microsoft.com/IE/feedback/details/1736512/
        rnoInnerhtml = /<script|<style|<link/i,

        // checked="checked" or checked
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
    function manipulationTarget( elem, content ) {
        if ( nodeName( elem, "table" ) &&
            nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

            return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
        }

        return elem;
    }

// Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript( elem ) {
        elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
        return elem;
    }
    function restoreScript( elem ) {
        if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
            elem.type = elem.type.slice( 5 );
        } else {
            elem.removeAttribute( "type" );
        }

        return elem;
    }

    function cloneCopyEvent( src, dest ) {
        var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

        if ( dest.nodeType !== 1 ) {
            return;
        }

        // 1. Copy private data: events, handlers, etc.
        if ( dataPriv.hasData( src ) ) {
            pdataOld = dataPriv.access( src );
            pdataCur = dataPriv.set( dest, pdataOld );
            events = pdataOld.events;

            if ( events ) {
                delete pdataCur.handle;
                pdataCur.events = {};

                for ( type in events ) {
                    for ( i = 0, l = events[ type ].length; i < l; i++ ) {
                        jQuery.event.add( dest, type, events[ type ][ i ] );
                    }
                }
            }
        }

        // 2. Copy user data
        if ( dataUser.hasData( src ) ) {
            udataOld = dataUser.access( src );
            udataCur = jQuery.extend( {}, udataOld );

            dataUser.set( dest, udataCur );
        }
    }

// Fix IE bugs, see support tests
    function fixInput( src, dest ) {
        var nodeName = dest.nodeName.toLowerCase();

        // Fails to persist the checked state of a cloned checkbox or radio button.
        if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
            dest.checked = src.checked;

            // Fails to return the selected option to the default selected state when cloning options
        } else if ( nodeName === "input" || nodeName === "textarea" ) {
            dest.defaultValue = src.defaultValue;
        }
    }

    function domManip( collection, args, callback, ignored ) {

        // Flatten any nested arrays
        args = concat.apply( [], args );

        var fragment, first, scripts, hasScripts, node, doc,
            i = 0,
            l = collection.length,
            iNoClone = l - 1,
            value = args[ 0 ],
            valueIsFunction = isFunction( value );

        // We can't cloneNode fragments that contain checked, in WebKit
        if ( valueIsFunction ||
            ( l > 1 && typeof value === "string" &&
                !support.checkClone && rchecked.test( value ) ) ) {
            return collection.each( function( index ) {
                var self = collection.eq( index );
                if ( valueIsFunction ) {
                    args[ 0 ] = value.call( this, index, self.html() );
                }
                domManip( self, args, callback, ignored );
            } );
        }

        if ( l ) {
            fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
            first = fragment.firstChild;

            if ( fragment.childNodes.length === 1 ) {
                fragment = first;
            }

            // Require either new content or an interest in ignored elements to invoke the callback
            if ( first || ignored ) {
                scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
                hasScripts = scripts.length;

                // Use the original fragment for the last item
                // instead of the first because it can end up
                // being emptied incorrectly in certain situations (#8070).
                for ( ; i < l; i++ ) {
                    node = fragment;

                    if ( i !== iNoClone ) {
                        node = jQuery.clone( node, true, true );

                        // Keep references to cloned scripts for later restoration
                        if ( hasScripts ) {

                            // Support: Android <=4.0 only, PhantomJS 1 only
                            // push.apply(_, arraylike) throws on ancient WebKit
                            jQuery.merge( scripts, getAll( node, "script" ) );
                        }
                    }

                    callback.call( collection[ i ], node, i );
                }

                if ( hasScripts ) {
                    doc = scripts[ scripts.length - 1 ].ownerDocument;

                    // Reenable scripts
                    jQuery.map( scripts, restoreScript );

                    // Evaluate executable scripts on first document insertion
                    for ( i = 0; i < hasScripts; i++ ) {
                        node = scripts[ i ];
                        if ( rscriptType.test( node.type || "" ) &&
                            !dataPriv.access( node, "globalEval" ) &&
                            jQuery.contains( doc, node ) ) {

                            if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

                                // Optional AJAX dependency, but won't run scripts if not present
                                if ( jQuery._evalUrl && !node.noModule ) {
                                    jQuery._evalUrl( node.src, {
                                        nonce: node.nonce || node.getAttribute( "nonce" )
                                    } );
                                }
                            } else {
                                DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
                            }
                        }
                    }
                }
            }
        }

        return collection;
    }

    function remove( elem, selector, keepData ) {
        var node,
            nodes = selector ? jQuery.filter( selector, elem ) : elem,
            i = 0;

        for ( ; ( node = nodes[ i ] ) != null; i++ ) {
            if ( !keepData && node.nodeType === 1 ) {
                jQuery.cleanData( getAll( node ) );
            }

            if ( node.parentNode ) {
                if ( keepData && isAttached( node ) ) {
                    setGlobalEval( getAll( node, "script" ) );
                }
                node.parentNode.removeChild( node );
            }
        }

        return elem;
    }

    jQuery.extend( {
        htmlPrefilter: function( html ) {
            return html.replace( rxhtmlTag, "<$1></$2>" );
        },

        clone: function( elem, dataAndEvents, deepDataAndEvents ) {
            var i, l, srcElements, destElements,
                clone = elem.cloneNode( true ),
                inPage = isAttached( elem );

            // Fix IE cloning issues
            if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
                !jQuery.isXMLDoc( elem ) ) {

                // We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
                destElements = getAll( clone );
                srcElements = getAll( elem );

                for ( i = 0, l = srcElements.length; i < l; i++ ) {
                    fixInput( srcElements[ i ], destElements[ i ] );
                }
            }

            // Copy the events from the original to the clone
            if ( dataAndEvents ) {
                if ( deepDataAndEvents ) {
                    srcElements = srcElements || getAll( elem );
                    destElements = destElements || getAll( clone );

                    for ( i = 0, l = srcElements.length; i < l; i++ ) {
                        cloneCopyEvent( srcElements[ i ], destElements[ i ] );
                    }
                } else {
                    cloneCopyEvent( elem, clone );
                }
            }

            // Preserve script evaluation history
            destElements = getAll( clone, "script" );
            if ( destElements.length > 0 ) {
                setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
            }

            // Return the cloned set
            return clone;
        },

        cleanData: function( elems ) {
            var data, elem, type,
                special = jQuery.event.special,
                i = 0;

            for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
                if ( acceptData( elem ) ) {
                    if ( ( data = elem[ dataPriv.expando ] ) ) {
                        if ( data.events ) {
                            for ( type in data.events ) {
                                if ( special[ type ] ) {
                                    jQuery.event.remove( elem, type );

                                    // This is a shortcut to avoid jQuery.event.remove's overhead
                                } else {
                                    jQuery.removeEvent( elem, type, data.handle );
                                }
                            }
                        }

                        // Support: Chrome <=35 - 45+
                        // Assign undefined instead of using delete, see Data#remove
                        elem[ dataPriv.expando ] = undefined;
                    }
                    if ( elem[ dataUser.expando ] ) {

                        // Support: Chrome <=35 - 45+
                        // Assign undefined instead of using delete, see Data#remove
                        elem[ dataUser.expando ] = undefined;
                    }
                }
            }
        }
    } );

    jQuery.fn.extend( {
        detach: function( selector ) {
            return remove( this, selector, true );
        },

        remove: function( selector ) {
            return remove( this, selector );
        },

        text: function( value ) {
            return access( this, function( value ) {
                return value === undefined ?
                    jQuery.text( this ) :
                    this.empty().each( function() {
                        if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                            this.textContent = value;
                        }
                    } );
            }, null, value, arguments.length );
        },

        append: function() {
            return domManip( this, arguments, function( elem ) {
                if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                    var target = manipulationTarget( this, elem );
                    target.appendChild( elem );
                }
            } );
        },

        prepend: function() {
            return domManip( this, arguments, function( elem ) {
                if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                    var target = manipulationTarget( this, elem );
                    target.insertBefore( elem, target.firstChild );
                }
            } );
        },

        before: function() {
            return domManip( this, arguments, function( elem ) {
                if ( this.parentNode ) {
                    this.parentNode.insertBefore( elem, this );
                }
            } );
        },

        after: function() {
            return domManip( this, arguments, function( elem ) {
                if ( this.parentNode ) {
                    this.parentNode.insertBefore( elem, this.nextSibling );
                }
            } );
        },

        empty: function() {
            var elem,
                i = 0;

            for ( ; ( elem = this[ i ] ) != null; i++ ) {
                if ( elem.nodeType === 1 ) {

                    // Prevent memory leaks
                    jQuery.cleanData( getAll( elem, false ) );

                    // Remove any remaining nodes
                    elem.textContent = "";
                }
            }

            return this;
        },

        clone: function( dataAndEvents, deepDataAndEvents ) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map( function() {
                return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
            } );
        },

        html: function( value ) {
            return access( this, function( value ) {
                var elem = this[ 0 ] || {},
                    i = 0,
                    l = this.length;

                if ( value === undefined && elem.nodeType === 1 ) {
                    return elem.innerHTML;
                }

                // See if we can take a shortcut and just use innerHTML
                if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
                    !wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

                    value = jQuery.htmlPrefilter( value );

                    try {
                        for ( ; i < l; i++ ) {
                            elem = this[ i ] || {};

                            // Remove element nodes and prevent memory leaks
                            if ( elem.nodeType === 1 ) {
                                jQuery.cleanData( getAll( elem, false ) );
                                elem.innerHTML = value;
                            }
                        }

                        elem = 0;

                        // If using innerHTML throws an exception, use the fallback method
                    } catch ( e ) {}
                }

                if ( elem ) {
                    this.empty().append( value );
                }
            }, null, value, arguments.length );
        },

        replaceWith: function() {
            var ignored = [];

            // Make the changes, replacing each non-ignored context element with the new content
            return domManip( this, arguments, function( elem ) {
                var parent = this.parentNode;

                if ( jQuery.inArray( this, ignored ) < 0 ) {
                    jQuery.cleanData( getAll( this ) );
                    if ( parent ) {
                        parent.replaceChild( elem, this );
                    }
                }

                // Force callback invocation
            }, ignored );
        }
    } );

    jQuery.each( {
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function( name, original ) {
        jQuery.fn[ name ] = function( selector ) {
            var elems,
                ret = [],
                insert = jQuery( selector ),
                last = insert.length - 1,
                i = 0;

            for ( ; i <= last; i++ ) {
                elems = i === last ? this : this.clone( true );
                jQuery( insert[ i ] )[ original ]( elems );

                // Support: Android <=4.0 only, PhantomJS 1 only
                // .get() because push.apply(_, arraylike) throws on ancient WebKit
                push.apply( ret, elems.get() );
            }

            return this.pushStack( ret );
        };
    } );
    var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

    var getStyles = function( elem ) {

        // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
        // IE throws on elements created in popups
        // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
        var view = elem.ownerDocument.defaultView;

        if ( !view || !view.opener ) {
            view = window;
        }

        return view.getComputedStyle( elem );
    };

    var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



    ( function() {

        // Executing both pixelPosition & boxSizingReliable tests require only one layout
        // so they're executed at the same time to save the second computation.
        function computeStyleTests() {

            // This is a singleton, we need to execute it only once
            if ( !div ) {
                return;
            }

            container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
                "margin-top:1px;padding:0;border:0";
            div.style.cssText =
                "position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
                "margin:auto;border:1px;padding:1px;" +
                "width:60%;top:1%";
            documentElement.appendChild( container ).appendChild( div );

            var divStyle = window.getComputedStyle( div );
            pixelPositionVal = divStyle.top !== "1%";

            // Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
            reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

            // Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
            // Some styles come back with percentage values, even though they shouldn't
            div.style.right = "60%";
            pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

            // Support: IE 9 - 11 only
            // Detect misreporting of content dimensions for box-sizing:border-box elements
            boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

            // Support: IE 9 only
            // Detect overflow:scroll screwiness (gh-3699)
            // Support: Chrome <=64
            // Don't get tricked when zoom affects offsetWidth (gh-4029)
            div.style.position = "absolute";
            scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

            documentElement.removeChild( container );

            // Nullify the div so it wouldn't be stored in the memory and
            // it will also be a sign that checks already performed
            div = null;
        }

        function roundPixelMeasures( measure ) {
            return Math.round( parseFloat( measure ) );
        }

        var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
            reliableMarginLeftVal,
            container = document.createElement( "div" ),
            div = document.createElement( "div" );

        // Finish early in limited (non-browser) environments
        if ( !div.style ) {
            return;
        }

        // Support: IE <=9 - 11 only
        // Style of cloned element affects source element cloned (#8908)
        div.style.backgroundClip = "content-box";
        div.cloneNode( true ).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";

        jQuery.extend( support, {
            boxSizingReliable: function() {
                computeStyleTests();
                return boxSizingReliableVal;
            },
            pixelBoxStyles: function() {
                computeStyleTests();
                return pixelBoxStylesVal;
            },
            pixelPosition: function() {
                computeStyleTests();
                return pixelPositionVal;
            },
            reliableMarginLeft: function() {
                computeStyleTests();
                return reliableMarginLeftVal;
            },
            scrollboxSize: function() {
                computeStyleTests();
                return scrollboxSizeVal;
            }
        } );
    } )();


    function curCSS( elem, name, computed ) {
        var width, minWidth, maxWidth, ret,

            // Support: Firefox 51+
            // Retrieving style before computed somehow
            // fixes an issue with getting wrong values
            // on detached elements
            style = elem.style;

        computed = computed || getStyles( elem );

        // getPropertyValue is needed for:
        //   .css('filter') (IE 9 only, #12537)
        //   .css('--customProperty) (#3144)
        if ( computed ) {
            ret = computed.getPropertyValue( name ) || computed[ name ];

            if ( ret === "" && !isAttached( elem ) ) {
                ret = jQuery.style( elem, name );
            }

            // A tribute to the "awesome hack by Dean Edwards"
            // Android Browser returns percentage for some values,
            // but width seems to be reliably pixels.
            // This is against the CSSOM draft spec:
            // https://drafts.csswg.org/cssom/#resolved-values
            if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

                // Remember the original values
                width = style.width;
                minWidth = style.minWidth;
                maxWidth = style.maxWidth;

                // Put in the new values to get a computed value out
                style.minWidth = style.maxWidth = style.width = ret;
                ret = computed.width;

                // Revert the changed values
                style.width = width;
                style.minWidth = minWidth;
                style.maxWidth = maxWidth;
            }
        }

        return ret !== undefined ?

            // Support: IE <=9 - 11 only
            // IE returns zIndex value as an integer.
            ret + "" :
            ret;
    }


    function addGetHookIf( conditionFn, hookFn ) {

        // Define the hook, we'll check on the first run if it's really needed.
        return {
            get: function() {
                if ( conditionFn() ) {

                    // Hook not needed (or it's not possible to use it due
                    // to missing dependency), remove it.
                    delete this.get;
                    return;
                }

                // Hook needed; redefine it so that the support test is not executed again.
                return ( this.get = hookFn ).apply( this, arguments );
            }
        };
    }


    var cssPrefixes = [ "Webkit", "Moz", "ms" ],
        emptyStyle = document.createElement( "div" ).style,
        vendorProps = {};

// Return a vendor-prefixed property or undefined
    function vendorPropName( name ) {

        // Check for vendor prefixed names
        var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
            i = cssPrefixes.length;

        while ( i-- ) {
            name = cssPrefixes[ i ] + capName;
            if ( name in emptyStyle ) {
                return name;
            }
        }
    }

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
    function finalPropName( name ) {
        var final = jQuery.cssProps[ name ] || vendorProps[ name ];

        if ( final ) {
            return final;
        }
        if ( name in emptyStyle ) {
            return name;
        }
        return vendorProps[ name ] = vendorPropName( name ) || name;
    }


    var

        // Swappable if display is none or starts with table
        // except "table", "table-cell", or "table-caption"
        // See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
        rdisplayswap = /^(none|table(?!-c[ea]).+)/,
        rcustomProp = /^--/,
        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
        cssNormalTransform = {
            letterSpacing: "0",
            fontWeight: "400"
        };

    function setPositiveNumber( elem, value, subtract ) {

        // Any relative (+/-) values have already been
        // normalized at this point
        var matches = rcssNum.exec( value );
        return matches ?

            // Guard against undefined "subtract", e.g., when used as in cssHooks
            Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
            value;
    }

    function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
        var i = dimension === "width" ? 1 : 0,
            extra = 0,
            delta = 0;

        // Adjustment may not be necessary
        if ( box === ( isBorderBox ? "border" : "content" ) ) {
            return 0;
        }

        for ( ; i < 4; i += 2 ) {

            // Both box models exclude margin
            if ( box === "margin" ) {
                delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
            }

            // If we get here with a content-box, we're seeking "padding" or "border" or "margin"
            if ( !isBorderBox ) {

                // Add padding
                delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

                // For "border" or "margin", add border
                if ( box !== "padding" ) {
                    delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

                    // But still keep track of it otherwise
                } else {
                    extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
                }

                // If we get here with a border-box (content + padding + border), we're seeking "content" or
                // "padding" or "margin"
            } else {

                // For "content", subtract padding
                if ( box === "content" ) {
                    delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
                }

                // For "content" or "padding", subtract border
                if ( box !== "margin" ) {
                    delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
                }
            }
        }

        // Account for positive content-box scroll gutter when requested by providing computedVal
        if ( !isBorderBox && computedVal >= 0 ) {

            // offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
            // Assuming integer scroll gutter, subtract the rest and round down
            delta += Math.max( 0, Math.ceil(
                elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
                computedVal -
                delta -
                extra -
                0.5

                // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
                // Use an explicit zero to avoid NaN (gh-3964)
            ) ) || 0;
        }

        return delta;
    }

    function getWidthOrHeight( elem, dimension, extra ) {

        // Start with computed style
        var styles = getStyles( elem ),

            // To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
            // Fake content-box until we know it's needed to know the true value.
            boxSizingNeeded = !support.boxSizingReliable() || extra,
            isBorderBox = boxSizingNeeded &&
                jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
            valueIsBorderBox = isBorderBox,

            val = curCSS( elem, dimension, styles ),
            offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

        // Support: Firefox <=54
        // Return a confounding non-pixel value or feign ignorance, as appropriate.
        if ( rnumnonpx.test( val ) ) {
            if ( !extra ) {
                return val;
            }
            val = "auto";
        }


        // Fall back to offsetWidth/offsetHeight when value is "auto"
        // This happens for inline elements with no explicit setting (gh-3571)
        // Support: Android <=4.1 - 4.3 only
        // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
        // Support: IE 9-11 only
        // Also use offsetWidth/offsetHeight for when box sizing is unreliable
        // We use getClientRects() to check for hidden/disconnected.
        // In those cases, the computed value can be trusted to be border-box
        if ( ( !support.boxSizingReliable() && isBorderBox ||
            val === "auto" ||
            !parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&
            elem.getClientRects().length ) {

            isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

            // Where available, offsetWidth/offsetHeight approximate border box dimensions.
            // Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
            // retrieved value as a content box dimension.
            valueIsBorderBox = offsetProp in elem;
            if ( valueIsBorderBox ) {
                val = elem[ offsetProp ];
            }
        }

        // Normalize "" and auto
        val = parseFloat( val ) || 0;

        // Adjust for the element's box model
        return ( val +
            boxModelAdjustment(
                elem,
                dimension,
                extra || ( isBorderBox ? "border" : "content" ),
                valueIsBorderBox,
                styles,

                // Provide the current computed size to request scroll gutter calculation (gh-3589)
                val
            )
        ) + "px";
    }

    jQuery.extend( {

        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function( elem, computed ) {
                    if ( computed ) {

                        // We should always get a number back from opacity
                        var ret = curCSS( elem, "opacity" );
                        return ret === "" ? "1" : ret;
                    }
                }
            }
        },

        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
            "animationIterationCount": true,
            "columnCount": true,
            "fillOpacity": true,
            "flexGrow": true,
            "flexShrink": true,
            "fontWeight": true,
            "gridArea": true,
            "gridColumn": true,
            "gridColumnEnd": true,
            "gridColumnStart": true,
            "gridRow": true,
            "gridRowEnd": true,
            "gridRowStart": true,
            "lineHeight": true,
            "opacity": true,
            "order": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {},

        // Get and set the style property on a DOM Node
        style: function( elem, name, value, extra ) {

            // Don't set styles on text and comment nodes
            if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
                return;
            }

            // Make sure that we're working with the right name
            var ret, type, hooks,
                origName = camelCase( name ),
                isCustomProp = rcustomProp.test( name ),
                style = elem.style;

            // Make sure that we're working with the right name. We don't
            // want to query the value if it is a CSS custom property
            // since they are user-defined.
            if ( !isCustomProp ) {
                name = finalPropName( origName );
            }

            // Gets hook for the prefixed version, then unprefixed version
            hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

            // Check if we're setting a value
            if ( value !== undefined ) {
                type = typeof value;

                // Convert "+=" or "-=" to relative numbers (#7345)
                if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
                    value = adjustCSS( elem, name, ret );

                    // Fixes bug #9237
                    type = "number";
                }

                // Make sure that null and NaN values aren't set (#7116)
                if ( value == null || value !== value ) {
                    return;
                }

                // If a number was passed in, add the unit (except for certain CSS properties)
                // The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
                // "px" to a few hardcoded values.
                if ( type === "number" && !isCustomProp ) {
                    value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
                }

                // background-* props affect original clone's values
                if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
                    style[ name ] = "inherit";
                }

                // If a hook was provided, use that value, otherwise just set the specified value
                if ( !hooks || !( "set" in hooks ) ||
                    ( value = hooks.set( elem, value, extra ) ) !== undefined ) {

                    if ( isCustomProp ) {
                        style.setProperty( name, value );
                    } else {
                        style[ name ] = value;
                    }
                }

            } else {

                // If a hook was provided get the non-computed value from there
                if ( hooks && "get" in hooks &&
                    ( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[ name ];
            }
        },

        css: function( elem, name, extra, styles ) {
            var val, num, hooks,
                origName = camelCase( name ),
                isCustomProp = rcustomProp.test( name );

            // Make sure that we're working with the right name. We don't
            // want to modify the value if it is a CSS custom property
            // since they are user-defined.
            if ( !isCustomProp ) {
                name = finalPropName( origName );
            }

            // Try prefixed name followed by the unprefixed name
            hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

            // If a hook was provided get the computed value from there
            if ( hooks && "get" in hooks ) {
                val = hooks.get( elem, true, extra );
            }

            // Otherwise, if a way to get the computed value exists, use that
            if ( val === undefined ) {
                val = curCSS( elem, name, styles );
            }

            // Convert "normal" to computed value
            if ( val === "normal" && name in cssNormalTransform ) {
                val = cssNormalTransform[ name ];
            }

            // Make numeric if forced or a qualifier was provided and val looks numeric
            if ( extra === "" || extra ) {
                num = parseFloat( val );
                return extra === true || isFinite( num ) ? num || 0 : val;
            }

            return val;
        }
    } );

    jQuery.each( [ "height", "width" ], function( i, dimension ) {
        jQuery.cssHooks[ dimension ] = {
            get: function( elem, computed, extra ) {
                if ( computed ) {

                    // Certain elements can have dimension info if we invisibly show them
                    // but it must have a current display style that would benefit
                    return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

                    // Support: Safari 8+
                    // Table columns in Safari have non-zero offsetWidth & zero
                    // getBoundingClientRect().width unless display is changed.
                    // Support: IE <=11 only
                    // Running getBoundingClientRect on a disconnected node
                    // in IE throws an error.
                    ( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
                        swap( elem, cssShow, function() {
                            return getWidthOrHeight( elem, dimension, extra );
                        } ) :
                        getWidthOrHeight( elem, dimension, extra );
                }
            },

            set: function( elem, value, extra ) {
                var matches,
                    styles = getStyles( elem ),

                    // Only read styles.position if the test has a chance to fail
                    // to avoid forcing a reflow.
                    scrollboxSizeBuggy = !support.scrollboxSize() &&
                        styles.position === "absolute",

                    // To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
                    boxSizingNeeded = scrollboxSizeBuggy || extra,
                    isBorderBox = boxSizingNeeded &&
                        jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
                    subtract = extra ?
                        boxModelAdjustment(
                            elem,
                            dimension,
                            extra,
                            isBorderBox,
                            styles
                        ) :
                        0;

                // Account for unreliable border-box dimensions by comparing offset* to computed and
                // faking a content-box to get border and padding (gh-3699)
                if ( isBorderBox && scrollboxSizeBuggy ) {
                    subtract -= Math.ceil(
                        elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
                        parseFloat( styles[ dimension ] ) -
                        boxModelAdjustment( elem, dimension, "border", false, styles ) -
                        0.5
                    );
                }

                // Convert to pixels if value adjustment is needed
                if ( subtract && ( matches = rcssNum.exec( value ) ) &&
                    ( matches[ 3 ] || "px" ) !== "px" ) {

                    elem.style[ dimension ] = value;
                    value = jQuery.css( elem, dimension );
                }

                return setPositiveNumber( elem, value, subtract );
            }
        };
    } );

    jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
        function( elem, computed ) {
            if ( computed ) {
                return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
                    elem.getBoundingClientRect().left -
                    swap( elem, { marginLeft: 0 }, function() {
                        return elem.getBoundingClientRect().left;
                    } )
                ) + "px";
            }
        }
    );

// These hooks are used by animate to expand properties
    jQuery.each( {
        margin: "",
        padding: "",
        border: "Width"
    }, function( prefix, suffix ) {
        jQuery.cssHooks[ prefix + suffix ] = {
            expand: function( value ) {
                var i = 0,
                    expanded = {},

                    // Assumes a single number if not a string
                    parts = typeof value === "string" ? value.split( " " ) : [ value ];

                for ( ; i < 4; i++ ) {
                    expanded[ prefix + cssExpand[ i ] + suffix ] =
                        parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
                }

                return expanded;
            }
        };

        if ( prefix !== "margin" ) {
            jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
        }
    } );

    jQuery.fn.extend( {
        css: function( name, value ) {
            return access( this, function( elem, name, value ) {
                var styles, len,
                    map = {},
                    i = 0;

                if ( Array.isArray( name ) ) {
                    styles = getStyles( elem );
                    len = name.length;

                    for ( ; i < len; i++ ) {
                        map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
                    }

                    return map;
                }

                return value !== undefined ?
                    jQuery.style( elem, name, value ) :
                    jQuery.css( elem, name );
            }, name, value, arguments.length > 1 );
        }
    } );


    function Tween( elem, options, prop, end, easing ) {
        return new Tween.prototype.init( elem, options, prop, end, easing );
    }
    jQuery.Tween = Tween;

    Tween.prototype = {
        constructor: Tween,
        init: function( elem, options, prop, end, easing, unit ) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || jQuery.easing._default;
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
        },
        cur: function() {
            var hooks = Tween.propHooks[ this.prop ];

            return hooks && hooks.get ?
                hooks.get( this ) :
                Tween.propHooks._default.get( this );
        },
        run: function( percent ) {
            var eased,
                hooks = Tween.propHooks[ this.prop ];

            if ( this.options.duration ) {
                this.pos = eased = jQuery.easing[ this.easing ](
                    percent, this.options.duration * percent, 0, 1, this.options.duration
                );
            } else {
                this.pos = eased = percent;
            }
            this.now = ( this.end - this.start ) * eased + this.start;

            if ( this.options.step ) {
                this.options.step.call( this.elem, this.now, this );
            }

            if ( hooks && hooks.set ) {
                hooks.set( this );
            } else {
                Tween.propHooks._default.set( this );
            }
            return this;
        }
    };

    Tween.prototype.init.prototype = Tween.prototype;

    Tween.propHooks = {
        _default: {
            get: function( tween ) {
                var result;

                // Use a property on the element directly when it is not a DOM element,
                // or when there is no matching style property that exists.
                if ( tween.elem.nodeType !== 1 ||
                    tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
                    return tween.elem[ tween.prop ];
                }

                // Passing an empty string as a 3rd parameter to .css will automatically
                // attempt a parseFloat and fallback to a string if the parse fails.
                // Simple values such as "10px" are parsed to Float;
                // complex values such as "rotate(1rad)" are returned as-is.
                result = jQuery.css( tween.elem, tween.prop, "" );

                // Empty strings, null, undefined and "auto" are converted to 0.
                return !result || result === "auto" ? 0 : result;
            },
            set: function( tween ) {

                // Use step hook for back compat.
                // Use cssHook if its there.
                // Use .style if available and use plain properties where available.
                if ( jQuery.fx.step[ tween.prop ] ) {
                    jQuery.fx.step[ tween.prop ]( tween );
                } else if ( tween.elem.nodeType === 1 && (
                    jQuery.cssHooks[ tween.prop ] ||
                    tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
                    jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
                } else {
                    tween.elem[ tween.prop ] = tween.now;
                }
            }
        }
    };

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function( tween ) {
            if ( tween.elem.nodeType && tween.elem.parentNode ) {
                tween.elem[ tween.prop ] = tween.now;
            }
        }
    };

    jQuery.easing = {
        linear: function( p ) {
            return p;
        },
        swing: function( p ) {
            return 0.5 - Math.cos( p * Math.PI ) / 2;
        },
        _default: "swing"
    };

    jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
    jQuery.fx.step = {};




    var
        fxNow, inProgress,
        rfxtypes = /^(?:toggle|show|hide)$/,
        rrun = /queueHooks$/;

    function schedule() {
        if ( inProgress ) {
            if ( document.hidden === false && window.requestAnimationFrame ) {
                window.requestAnimationFrame( schedule );
            } else {
                window.setTimeout( schedule, jQuery.fx.interval );
            }

            jQuery.fx.tick();
        }
    }

// Animations created synchronously will run synchronously
    function createFxNow() {
        window.setTimeout( function() {
            fxNow = undefined;
        } );
        return ( fxNow = Date.now() );
    }

// Generate parameters to create a standard animation
    function genFx( type, includeWidth ) {
        var which,
            i = 0,
            attrs = { height: type };

        // If we include width, step value is 1 to do all cssExpand values,
        // otherwise step value is 2 to skip over Left and Right
        includeWidth = includeWidth ? 1 : 0;
        for ( ; i < 4; i += 2 - includeWidth ) {
            which = cssExpand[ i ];
            attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
        }

        if ( includeWidth ) {
            attrs.opacity = attrs.width = type;
        }

        return attrs;
    }

    function createTween( value, prop, animation ) {
        var tween,
            collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
            index = 0,
            length = collection.length;
        for ( ; index < length; index++ ) {
            if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

                // We're done with this property
                return tween;
            }
        }
    }

    function defaultPrefilter( elem, props, opts ) {
        var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
            isBox = "width" in props || "height" in props,
            anim = this,
            orig = {},
            style = elem.style,
            hidden = elem.nodeType && isHiddenWithinTree( elem ),
            dataShow = dataPriv.get( elem, "fxshow" );

        // Queue-skipping animations hijack the fx hooks
        if ( !opts.queue ) {
            hooks = jQuery._queueHooks( elem, "fx" );
            if ( hooks.unqueued == null ) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function() {
                    if ( !hooks.unqueued ) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;

            anim.always( function() {

                // Ensure the complete handler is called before this completes
                anim.always( function() {
                    hooks.unqueued--;
                    if ( !jQuery.queue( elem, "fx" ).length ) {
                        hooks.empty.fire();
                    }
                } );
            } );
        }

        // Detect show/hide animations
        for ( prop in props ) {
            value = props[ prop ];
            if ( rfxtypes.test( value ) ) {
                delete props[ prop ];
                toggle = toggle || value === "toggle";
                if ( value === ( hidden ? "hide" : "show" ) ) {

                    // Pretend to be hidden if this is a "show" and
                    // there is still data from a stopped show/hide
                    if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
                        hidden = true;

                        // Ignore all other no-op show/hide data
                    } else {
                        continue;
                    }
                }
                orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
            }
        }

        // Bail out if this is a no-op like .hide().hide()
        propTween = !jQuery.isEmptyObject( props );
        if ( !propTween && jQuery.isEmptyObject( orig ) ) {
            return;
        }

        // Restrict "overflow" and "display" styles during box animations
        if ( isBox && elem.nodeType === 1 ) {

            // Support: IE <=9 - 11, Edge 12 - 15
            // Record all 3 overflow attributes because IE does not infer the shorthand
            // from identically-valued overflowX and overflowY and Edge just mirrors
            // the overflowX value there.
            opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

            // Identify a display type, preferring old show/hide data over the CSS cascade
            restoreDisplay = dataShow && dataShow.display;
            if ( restoreDisplay == null ) {
                restoreDisplay = dataPriv.get( elem, "display" );
            }
            display = jQuery.css( elem, "display" );
            if ( display === "none" ) {
                if ( restoreDisplay ) {
                    display = restoreDisplay;
                } else {

                    // Get nonempty value(s) by temporarily forcing visibility
                    showHide( [ elem ], true );
                    restoreDisplay = elem.style.display || restoreDisplay;
                    display = jQuery.css( elem, "display" );
                    showHide( [ elem ] );
                }
            }

            // Animate inline elements as inline-block
            if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
                if ( jQuery.css( elem, "float" ) === "none" ) {

                    // Restore the original display value at the end of pure show/hide animations
                    if ( !propTween ) {
                        anim.done( function() {
                            style.display = restoreDisplay;
                        } );
                        if ( restoreDisplay == null ) {
                            display = style.display;
                            restoreDisplay = display === "none" ? "" : display;
                        }
                    }
                    style.display = "inline-block";
                }
            }
        }

        if ( opts.overflow ) {
            style.overflow = "hidden";
            anim.always( function() {
                style.overflow = opts.overflow[ 0 ];
                style.overflowX = opts.overflow[ 1 ];
                style.overflowY = opts.overflow[ 2 ];
            } );
        }

        // Implement show/hide animations
        propTween = false;
        for ( prop in orig ) {

            // General show/hide setup for this element animation
            if ( !propTween ) {
                if ( dataShow ) {
                    if ( "hidden" in dataShow ) {
                        hidden = dataShow.hidden;
                    }
                } else {
                    dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
                }

                // Store hidden/visible for toggle so `.stop().toggle()` "reverses"
                if ( toggle ) {
                    dataShow.hidden = !hidden;
                }

                // Show elements before animating them
                if ( hidden ) {
                    showHide( [ elem ], true );
                }

                /* eslint-disable no-loop-func */

                anim.done( function() {

                    /* eslint-enable no-loop-func */

                    // The final step of a "hide" animation is actually hiding the element
                    if ( !hidden ) {
                        showHide( [ elem ] );
                    }
                    dataPriv.remove( elem, "fxshow" );
                    for ( prop in orig ) {
                        jQuery.style( elem, prop, orig[ prop ] );
                    }
                } );
            }

            // Per-property setup
            propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
            if ( !( prop in dataShow ) ) {
                dataShow[ prop ] = propTween.start;
                if ( hidden ) {
                    propTween.end = propTween.start;
                    propTween.start = 0;
                }
            }
        }
    }

    function propFilter( props, specialEasing ) {
        var index, name, easing, value, hooks;

        // camelCase, specialEasing and expand cssHook pass
        for ( index in props ) {
            name = camelCase( index );
            easing = specialEasing[ name ];
            value = props[ index ];
            if ( Array.isArray( value ) ) {
                easing = value[ 1 ];
                value = props[ index ] = value[ 0 ];
            }

            if ( index !== name ) {
                props[ name ] = value;
                delete props[ index ];
            }

            hooks = jQuery.cssHooks[ name ];
            if ( hooks && "expand" in hooks ) {
                value = hooks.expand( value );
                delete props[ name ];

                // Not quite $.extend, this won't overwrite existing keys.
                // Reusing 'index' because we have the correct "name"
                for ( index in value ) {
                    if ( !( index in props ) ) {
                        props[ index ] = value[ index ];
                        specialEasing[ index ] = easing;
                    }
                }
            } else {
                specialEasing[ name ] = easing;
            }
        }
    }

    function Animation( elem, properties, options ) {
        var result,
            stopped,
            index = 0,
            length = Animation.prefilters.length,
            deferred = jQuery.Deferred().always( function() {

                // Don't match elem in the :animated selector
                delete tick.elem;
            } ),
            tick = function() {
                if ( stopped ) {
                    return false;
                }
                var currentTime = fxNow || createFxNow(),
                    remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

                    // Support: Android 2.3 only
                    // Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
                    temp = remaining / animation.duration || 0,
                    percent = 1 - temp,
                    index = 0,
                    length = animation.tweens.length;

                for ( ; index < length; index++ ) {
                    animation.tweens[ index ].run( percent );
                }

                deferred.notifyWith( elem, [ animation, percent, remaining ] );

                // If there's more to do, yield
                if ( percent < 1 && length ) {
                    return remaining;
                }

                // If this was an empty animation, synthesize a final progress notification
                if ( !length ) {
                    deferred.notifyWith( elem, [ animation, 1, 0 ] );
                }

                // Resolve the animation and report its conclusion
                deferred.resolveWith( elem, [ animation ] );
                return false;
            },
            animation = deferred.promise( {
                elem: elem,
                props: jQuery.extend( {}, properties ),
                opts: jQuery.extend( true, {
                    specialEasing: {},
                    easing: jQuery.easing._default
                }, options ),
                originalProperties: properties,
                originalOptions: options,
                startTime: fxNow || createFxNow(),
                duration: options.duration,
                tweens: [],
                createTween: function( prop, end ) {
                    var tween = jQuery.Tween( elem, animation.opts, prop, end,
                        animation.opts.specialEasing[ prop ] || animation.opts.easing );
                    animation.tweens.push( tween );
                    return tween;
                },
                stop: function( gotoEnd ) {
                    var index = 0,

                        // If we are going to the end, we want to run all the tweens
                        // otherwise we skip this part
                        length = gotoEnd ? animation.tweens.length : 0;
                    if ( stopped ) {
                        return this;
                    }
                    stopped = true;
                    for ( ; index < length; index++ ) {
                        animation.tweens[ index ].run( 1 );
                    }

                    // Resolve when we played the last frame; otherwise, reject
                    if ( gotoEnd ) {
                        deferred.notifyWith( elem, [ animation, 1, 0 ] );
                        deferred.resolveWith( elem, [ animation, gotoEnd ] );
                    } else {
                        deferred.rejectWith( elem, [ animation, gotoEnd ] );
                    }
                    return this;
                }
            } ),
            props = animation.props;

        propFilter( props, animation.opts.specialEasing );

        for ( ; index < length; index++ ) {
            result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
            if ( result ) {
                if ( isFunction( result.stop ) ) {
                    jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
                        result.stop.bind( result );
                }
                return result;
            }
        }

        jQuery.map( props, createTween, animation );

        if ( isFunction( animation.opts.start ) ) {
            animation.opts.start.call( elem, animation );
        }

        // Attach callbacks from options
        animation
            .progress( animation.opts.progress )
            .done( animation.opts.done, animation.opts.complete )
            .fail( animation.opts.fail )
            .always( animation.opts.always );

        jQuery.fx.timer(
            jQuery.extend( tick, {
                elem: elem,
                anim: animation,
                queue: animation.opts.queue
            } )
        );

        return animation;
    }

    jQuery.Animation = jQuery.extend( Animation, {

        tweeners: {
            "*": [ function( prop, value ) {
                var tween = this.createTween( prop, value );
                adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
                return tween;
            } ]
        },

        tweener: function( props, callback ) {
            if ( isFunction( props ) ) {
                callback = props;
                props = [ "*" ];
            } else {
                props = props.match( rnothtmlwhite );
            }

            var prop,
                index = 0,
                length = props.length;

            for ( ; index < length; index++ ) {
                prop = props[ index ];
                Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
                Animation.tweeners[ prop ].unshift( callback );
            }
        },

        prefilters: [ defaultPrefilter ],

        prefilter: function( callback, prepend ) {
            if ( prepend ) {
                Animation.prefilters.unshift( callback );
            } else {
                Animation.prefilters.push( callback );
            }
        }
    } );

    jQuery.speed = function( speed, easing, fn ) {
        var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
            complete: fn || !fn && easing ||
                isFunction( speed ) && speed,
            duration: speed,
            easing: fn && easing || easing && !isFunction( easing ) && easing
        };

        // Go to the end state if fx are off
        if ( jQuery.fx.off ) {
            opt.duration = 0;

        } else {
            if ( typeof opt.duration !== "number" ) {
                if ( opt.duration in jQuery.fx.speeds ) {
                    opt.duration = jQuery.fx.speeds[ opt.duration ];

                } else {
                    opt.duration = jQuery.fx.speeds._default;
                }
            }
        }

        // Normalize opt.queue - true/undefined/null -> "fx"
        if ( opt.queue == null || opt.queue === true ) {
            opt.queue = "fx";
        }

        // Queueing
        opt.old = opt.complete;

        opt.complete = function() {
            if ( isFunction( opt.old ) ) {
                opt.old.call( this );
            }

            if ( opt.queue ) {
                jQuery.dequeue( this, opt.queue );
            }
        };

        return opt;
    };

    jQuery.fn.extend( {
        fadeTo: function( speed, to, easing, callback ) {

            // Show any hidden elements after setting opacity to 0
            return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

            // Animate to the value specified
                .end().animate( { opacity: to }, speed, easing, callback );
        },
        animate: function( prop, speed, easing, callback ) {
            var empty = jQuery.isEmptyObject( prop ),
                optall = jQuery.speed( speed, easing, callback ),
                doAnimation = function() {

                    // Operate on a copy of prop so per-property easing won't be lost
                    var anim = Animation( this, jQuery.extend( {}, prop ), optall );

                    // Empty animations, or finishing resolves immediately
                    if ( empty || dataPriv.get( this, "finish" ) ) {
                        anim.stop( true );
                    }
                };
            doAnimation.finish = doAnimation;

            return empty || optall.queue === false ?
                this.each( doAnimation ) :
                this.queue( optall.queue, doAnimation );
        },
        stop: function( type, clearQueue, gotoEnd ) {
            var stopQueue = function( hooks ) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop( gotoEnd );
            };

            if ( typeof type !== "string" ) {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if ( clearQueue && type !== false ) {
                this.queue( type || "fx", [] );
            }

            return this.each( function() {
                var dequeue = true,
                    index = type != null && type + "queueHooks",
                    timers = jQuery.timers,
                    data = dataPriv.get( this );

                if ( index ) {
                    if ( data[ index ] && data[ index ].stop ) {
                        stopQueue( data[ index ] );
                    }
                } else {
                    for ( index in data ) {
                        if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
                            stopQueue( data[ index ] );
                        }
                    }
                }

                for ( index = timers.length; index--; ) {
                    if ( timers[ index ].elem === this &&
                        ( type == null || timers[ index ].queue === type ) ) {

                        timers[ index ].anim.stop( gotoEnd );
                        dequeue = false;
                        timers.splice( index, 1 );
                    }
                }

                // Start the next in the queue if the last step wasn't forced.
                // Timers currently will call their complete callbacks, which
                // will dequeue but only if they were gotoEnd.
                if ( dequeue || !gotoEnd ) {
                    jQuery.dequeue( this, type );
                }
            } );
        },
        finish: function( type ) {
            if ( type !== false ) {
                type = type || "fx";
            }
            return this.each( function() {
                var index,
                    data = dataPriv.get( this ),
                    queue = data[ type + "queue" ],
                    hooks = data[ type + "queueHooks" ],
                    timers = jQuery.timers,
                    length = queue ? queue.length : 0;

                // Enable finishing flag on private data
                data.finish = true;

                // Empty the queue first
                jQuery.queue( this, type, [] );

                if ( hooks && hooks.stop ) {
                    hooks.stop.call( this, true );
                }

                // Look for any active animations, and finish them
                for ( index = timers.length; index--; ) {
                    if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
                        timers[ index ].anim.stop( true );
                        timers.splice( index, 1 );
                    }
                }

                // Look for any animations in the old queue and finish them
                for ( index = 0; index < length; index++ ) {
                    if ( queue[ index ] && queue[ index ].finish ) {
                        queue[ index ].finish.call( this );
                    }
                }

                // Turn off finishing flag
                delete data.finish;
            } );
        }
    } );

    jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
        var cssFn = jQuery.fn[ name ];
        jQuery.fn[ name ] = function( speed, easing, callback ) {
            return speed == null || typeof speed === "boolean" ?
                cssFn.apply( this, arguments ) :
                this.animate( genFx( name, true ), speed, easing, callback );
        };
    } );

// Generate shortcuts for custom animations
    jQuery.each( {
        slideDown: genFx( "show" ),
        slideUp: genFx( "hide" ),
        slideToggle: genFx( "toggle" ),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function( name, props ) {
        jQuery.fn[ name ] = function( speed, easing, callback ) {
            return this.animate( props, speed, easing, callback );
        };
    } );

    jQuery.timers = [];
    jQuery.fx.tick = function() {
        var timer,
            i = 0,
            timers = jQuery.timers;

        fxNow = Date.now();

        for ( ; i < timers.length; i++ ) {
            timer = timers[ i ];

            // Run the timer and safely remove it when done (allowing for external removal)
            if ( !timer() && timers[ i ] === timer ) {
                timers.splice( i--, 1 );
            }
        }

        if ( !timers.length ) {
            jQuery.fx.stop();
        }
        fxNow = undefined;
    };

    jQuery.fx.timer = function( timer ) {
        jQuery.timers.push( timer );
        jQuery.fx.start();
    };

    jQuery.fx.interval = 13;
    jQuery.fx.start = function() {
        if ( inProgress ) {
            return;
        }

        inProgress = true;
        schedule();
    };

    jQuery.fx.stop = function() {
        inProgress = null;
    };

    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,

        // Default speed
        _default: 400
    };


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
    jQuery.fn.delay = function( time, type ) {
        time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
        type = type || "fx";

        return this.queue( type, function( next, hooks ) {
            var timeout = window.setTimeout( next, time );
            hooks.stop = function() {
                window.clearTimeout( timeout );
            };
        } );
    };


    ( function() {
        var input = document.createElement( "input" ),
            select = document.createElement( "select" ),
            opt = select.appendChild( document.createElement( "option" ) );

        input.type = "checkbox";

        // Support: Android <=4.3 only
        // Default value for a checkbox should be "on"
        support.checkOn = input.value !== "";

        // Support: IE <=11 only
        // Must access selectedIndex to make default options select
        support.optSelected = opt.selected;

        // Support: IE <=11 only
        // An input loses its value after becoming a radio
        input = document.createElement( "input" );
        input.value = "t";
        input.type = "radio";
        support.radioValue = input.value === "t";
    } )();


    var boolHook,
        attrHandle = jQuery.expr.attrHandle;

    jQuery.fn.extend( {
        attr: function( name, value ) {
            return access( this, jQuery.attr, name, value, arguments.length > 1 );
        },

        removeAttr: function( name ) {
            return this.each( function() {
                jQuery.removeAttr( this, name );
            } );
        }
    } );

    jQuery.extend( {
        attr: function( elem, name, value ) {
            var ret, hooks,
                nType = elem.nodeType;

            // Don't get/set attributes on text, comment and attribute nodes
            if ( nType === 3 || nType === 8 || nType === 2 ) {
                return;
            }

            // Fallback to prop when attributes are not supported
            if ( typeof elem.getAttribute === "undefined" ) {
                return jQuery.prop( elem, name, value );
            }

            // Attribute hooks are determined by the lowercase version
            // Grab necessary hook if one is defined
            if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
                hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
                    ( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
            }

            if ( value !== undefined ) {
                if ( value === null ) {
                    jQuery.removeAttr( elem, name );
                    return;
                }

                if ( hooks && "set" in hooks &&
                    ( ret = hooks.set( elem, value, name ) ) !== undefined ) {
                    return ret;
                }

                elem.setAttribute( name, value + "" );
                return value;
            }

            if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
                return ret;
            }

            ret = jQuery.find.attr( elem, name );

            // Non-existent attributes return null, we normalize to undefined
            return ret == null ? undefined : ret;
        },

        attrHooks: {
            type: {
                set: function( elem, value ) {
                    if ( !support.radioValue && value === "radio" &&
                        nodeName( elem, "input" ) ) {
                        var val = elem.value;
                        elem.setAttribute( "type", value );
                        if ( val ) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            }
        },

        removeAttr: function( elem, value ) {
            var name,
                i = 0,

                // Attribute names can contain non-HTML whitespace characters
                // https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
                attrNames = value && value.match( rnothtmlwhite );

            if ( attrNames && elem.nodeType === 1 ) {
                while ( ( name = attrNames[ i++ ] ) ) {
                    elem.removeAttribute( name );
                }
            }
        }
    } );

// Hooks for boolean attributes
    boolHook = {
        set: function( elem, value, name ) {
            if ( value === false ) {

                // Remove boolean attributes when set to false
                jQuery.removeAttr( elem, name );
            } else {
                elem.setAttribute( name, name );
            }
            return name;
        }
    };

    jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
        var getter = attrHandle[ name ] || jQuery.find.attr;

        attrHandle[ name ] = function( elem, name, isXML ) {
            var ret, handle,
                lowercaseName = name.toLowerCase();

            if ( !isXML ) {

                // Avoid an infinite loop by temporarily removing this function from the getter
                handle = attrHandle[ lowercaseName ];
                attrHandle[ lowercaseName ] = ret;
                ret = getter( elem, name, isXML ) != null ?
                    lowercaseName :
                    null;
                attrHandle[ lowercaseName ] = handle;
            }
            return ret;
        };
    } );




    var rfocusable = /^(?:input|select|textarea|button)$/i,
        rclickable = /^(?:a|area)$/i;

    jQuery.fn.extend( {
        prop: function( name, value ) {
            return access( this, jQuery.prop, name, value, arguments.length > 1 );
        },

        removeProp: function( name ) {
            return this.each( function() {
                delete this[ jQuery.propFix[ name ] || name ];
            } );
        }
    } );

    jQuery.extend( {
        prop: function( elem, name, value ) {
            var ret, hooks,
                nType = elem.nodeType;

            // Don't get/set properties on text, comment and attribute nodes
            if ( nType === 3 || nType === 8 || nType === 2 ) {
                return;
            }

            if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

                // Fix name and attach hooks
                name = jQuery.propFix[ name ] || name;
                hooks = jQuery.propHooks[ name ];
            }

            if ( value !== undefined ) {
                if ( hooks && "set" in hooks &&
                    ( ret = hooks.set( elem, value, name ) ) !== undefined ) {
                    return ret;
                }

                return ( elem[ name ] = value );
            }

            if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
                return ret;
            }

            return elem[ name ];
        },

        propHooks: {
            tabIndex: {
                get: function( elem ) {

                    // Support: IE <=9 - 11 only
                    // elem.tabIndex doesn't always return the
                    // correct value when it hasn't been explicitly set
                    // https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    // Use proper attribute retrieval(#12072)
                    var tabindex = jQuery.find.attr( elem, "tabindex" );

                    if ( tabindex ) {
                        return parseInt( tabindex, 10 );
                    }

                    if (
                        rfocusable.test( elem.nodeName ) ||
                        rclickable.test( elem.nodeName ) &&
                        elem.href
                    ) {
                        return 0;
                    }

                    return -1;
                }
            }
        },

        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    } );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
    if ( !support.optSelected ) {
        jQuery.propHooks.selected = {
            get: function( elem ) {

                /* eslint no-unused-expressions: "off" */

                var parent = elem.parentNode;
                if ( parent && parent.parentNode ) {
                    parent.parentNode.selectedIndex;
                }
                return null;
            },
            set: function( elem ) {

                /* eslint no-unused-expressions: "off" */

                var parent = elem.parentNode;
                if ( parent ) {
                    parent.selectedIndex;

                    if ( parent.parentNode ) {
                        parent.parentNode.selectedIndex;
                    }
                }
            }
        };
    }

    jQuery.each( [
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
    ], function() {
        jQuery.propFix[ this.toLowerCase() ] = this;
    } );




    // Strip and collapse whitespace according to HTML spec
    // https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
    function stripAndCollapse( value ) {
        var tokens = value.match( rnothtmlwhite ) || [];
        return tokens.join( " " );
    }


    function getClass( elem ) {
        return elem.getAttribute && elem.getAttribute( "class" ) || "";
    }

    function classesToArray( value ) {
        if ( Array.isArray( value ) ) {
            return value;
        }
        if ( typeof value === "string" ) {
            return value.match( rnothtmlwhite ) || [];
        }
        return [];
    }

    jQuery.fn.extend( {
        addClass: function( value ) {
            var classes, elem, cur, curValue, clazz, j, finalValue,
                i = 0;

            if ( isFunction( value ) ) {
                return this.each( function( j ) {
                    jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
                } );
            }

            classes = classesToArray( value );

            if ( classes.length ) {
                while ( ( elem = this[ i++ ] ) ) {
                    curValue = getClass( elem );
                    cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

                    if ( cur ) {
                        j = 0;
                        while ( ( clazz = classes[ j++ ] ) ) {
                            if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
                                cur += clazz + " ";
                            }
                        }

                        // Only assign if different to avoid unneeded rendering.
                        finalValue = stripAndCollapse( cur );
                        if ( curValue !== finalValue ) {
                            elem.setAttribute( "class", finalValue );
                        }
                    }
                }
            }

            return this;
        },

        removeClass: function( value ) {
            var classes, elem, cur, curValue, clazz, j, finalValue,
                i = 0;

            if ( isFunction( value ) ) {
                return this.each( function( j ) {
                    jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
                } );
            }

            if ( !arguments.length ) {
                return this.attr( "class", "" );
            }

            classes = classesToArray( value );

            if ( classes.length ) {
                while ( ( elem = this[ i++ ] ) ) {
                    curValue = getClass( elem );

                    // This expression is here for better compressibility (see addClass)
                    cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

                    if ( cur ) {
                        j = 0;
                        while ( ( clazz = classes[ j++ ] ) ) {

                            // Remove *all* instances
                            while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
                                cur = cur.replace( " " + clazz + " ", " " );
                            }
                        }

                        // Only assign if different to avoid unneeded rendering.
                        finalValue = stripAndCollapse( cur );
                        if ( curValue !== finalValue ) {
                            elem.setAttribute( "class", finalValue );
                        }
                    }
                }
            }

            return this;
        },

        toggleClass: function( value, stateVal ) {
            var type = typeof value,
                isValidValue = type === "string" || Array.isArray( value );

            if ( typeof stateVal === "boolean" && isValidValue ) {
                return stateVal ? this.addClass( value ) : this.removeClass( value );
            }

            if ( isFunction( value ) ) {
                return this.each( function( i ) {
                    jQuery( this ).toggleClass(
                        value.call( this, i, getClass( this ), stateVal ),
                        stateVal
                    );
                } );
            }

            return this.each( function() {
                var className, i, self, classNames;

                if ( isValidValue ) {

                    // Toggle individual class names
                    i = 0;
                    self = jQuery( this );
                    classNames = classesToArray( value );

                    while ( ( className = classNames[ i++ ] ) ) {

                        // Check each className given, space separated list
                        if ( self.hasClass( className ) ) {
                            self.removeClass( className );
                        } else {
                            self.addClass( className );
                        }
                    }

                    // Toggle whole class name
                } else if ( value === undefined || type === "boolean" ) {
                    className = getClass( this );
                    if ( className ) {

                        // Store className if set
                        dataPriv.set( this, "__className__", className );
                    }

                    // If the element has a class name or if we're passed `false`,
                    // then remove the whole classname (if there was one, the above saved it).
                    // Otherwise bring back whatever was previously saved (if anything),
                    // falling back to the empty string if nothing was stored.
                    if ( this.setAttribute ) {
                        this.setAttribute( "class",
                            className || value === false ?
                                "" :
                                dataPriv.get( this, "__className__" ) || ""
                        );
                    }
                }
            } );
        },

        hasClass: function( selector ) {
            var className, elem,
                i = 0;

            className = " " + selector + " ";
            while ( ( elem = this[ i++ ] ) ) {
                if ( elem.nodeType === 1 &&
                    ( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
                    return true;
                }
            }

            return false;
        }
    } );




    var rreturn = /\r/g;

    jQuery.fn.extend( {
        val: function( value ) {
            var hooks, ret, valueIsFunction,
                elem = this[ 0 ];

            if ( !arguments.length ) {
                if ( elem ) {
                    hooks = jQuery.valHooks[ elem.type ] ||
                        jQuery.valHooks[ elem.nodeName.toLowerCase() ];

                    if ( hooks &&
                        "get" in hooks &&
                        ( ret = hooks.get( elem, "value" ) ) !== undefined
                    ) {
                        return ret;
                    }

                    ret = elem.value;

                    // Handle most common string cases
                    if ( typeof ret === "string" ) {
                        return ret.replace( rreturn, "" );
                    }

                    // Handle cases where value is null/undef or number
                    return ret == null ? "" : ret;
                }

                return;
            }

            valueIsFunction = isFunction( value );

            return this.each( function( i ) {
                var val;

                if ( this.nodeType !== 1 ) {
                    return;
                }

                if ( valueIsFunction ) {
                    val = value.call( this, i, jQuery( this ).val() );
                } else {
                    val = value;
                }

                // Treat null/undefined as ""; convert numbers to string
                if ( val == null ) {
                    val = "";

                } else if ( typeof val === "number" ) {
                    val += "";

                } else if ( Array.isArray( val ) ) {
                    val = jQuery.map( val, function( value ) {
                        return value == null ? "" : value + "";
                    } );
                }

                hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

                // If set returns undefined, fall back to normal setting
                if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
                    this.value = val;
                }
            } );
        }
    } );

    jQuery.extend( {
        valHooks: {
            option: {
                get: function( elem ) {

                    var val = jQuery.find.attr( elem, "value" );
                    return val != null ?
                        val :

                        // Support: IE <=10 - 11 only
                        // option.text throws exceptions (#14686, #14858)
                        // Strip and collapse whitespace
                        // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                        stripAndCollapse( jQuery.text( elem ) );
                }
            },
            select: {
                get: function( elem ) {
                    var value, option, i,
                        options = elem.options,
                        index = elem.selectedIndex,
                        one = elem.type === "select-one",
                        values = one ? null : [],
                        max = one ? index + 1 : options.length;

                    if ( index < 0 ) {
                        i = max;

                    } else {
                        i = one ? index : 0;
                    }

                    // Loop through all the selected options
                    for ( ; i < max; i++ ) {
                        option = options[ i ];

                        // Support: IE <=9 only
                        // IE8-9 doesn't update selected after form reset (#2551)
                        if ( ( option.selected || i === index ) &&

                            // Don't return options that are disabled or in a disabled optgroup
                            !option.disabled &&
                            ( !option.parentNode.disabled ||
                                !nodeName( option.parentNode, "optgroup" ) ) ) {

                            // Get the specific value for the option
                            value = jQuery( option ).val();

                            // We don't need an array for one selects
                            if ( one ) {
                                return value;
                            }

                            // Multi-Selects return an array
                            values.push( value );
                        }
                    }

                    return values;
                },

                set: function( elem, value ) {
                    var optionSet, option,
                        options = elem.options,
                        values = jQuery.makeArray( value ),
                        i = options.length;

                    while ( i-- ) {
                        option = options[ i ];

                        /* eslint-disable no-cond-assign */

                        if ( option.selected =
                            jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
                        ) {
                            optionSet = true;
                        }

                        /* eslint-enable no-cond-assign */
                    }

                    // Force browsers to behave consistently when non-matching value is set
                    if ( !optionSet ) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        }
    } );

// Radios and checkboxes getter/setter
    jQuery.each( [ "radio", "checkbox" ], function() {
        jQuery.valHooks[ this ] = {
            set: function( elem, value ) {
                if ( Array.isArray( value ) ) {
                    return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
                }
            }
        };
        if ( !support.checkOn ) {
            jQuery.valHooks[ this ].get = function( elem ) {
                return elem.getAttribute( "value" ) === null ? "on" : elem.value;
            };
        }
    } );




// Return jQuery for attributes-only inclusion


    support.focusin = "onfocusin" in window;


    var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        stopPropagationCallback = function( e ) {
            e.stopPropagation();
        };

    jQuery.extend( jQuery.event, {

        trigger: function( event, data, elem, onlyHandlers ) {

            var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
                eventPath = [ elem || document ],
                type = hasOwn.call( event, "type" ) ? event.type : event,
                namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

            cur = lastElement = tmp = elem = elem || document;

            // Don't do events on text and comment nodes
            if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
                return;
            }

            // focus/blur morphs to focusin/out; ensure we're not firing them right now
            if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
                return;
            }

            if ( type.indexOf( "." ) > -1 ) {

                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split( "." );
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf( ":" ) < 0 && "on" + type;

            // Caller can pass in a jQuery.Event object, Object, or just an event type string
            event = event[ jQuery.expando ] ?
                event :
                new jQuery.Event( type, typeof event === "object" && event );

            // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join( "." );
            event.rnamespace = event.namespace ?
                new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
                null;

            // Clean up the event in case it is being reused
            event.result = undefined;
            if ( !event.target ) {
                event.target = elem;
            }

            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data == null ?
                [ event ] :
                jQuery.makeArray( data, [ event ] );

            // Allow special events to draw outside the lines
            special = jQuery.event.special[ type ] || {};
            if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
                return;
            }

            // Determine event propagation path in advance, per W3C events spec (#9951)
            // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
            if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

                bubbleType = special.delegateType || type;
                if ( !rfocusMorph.test( bubbleType + type ) ) {
                    cur = cur.parentNode;
                }
                for ( ; cur; cur = cur.parentNode ) {
                    eventPath.push( cur );
                    tmp = cur;
                }

                // Only add window if we got to document (e.g., not plain obj or detached DOM)
                if ( tmp === ( elem.ownerDocument || document ) ) {
                    eventPath.push( tmp.defaultView || tmp.parentWindow || window );
                }
            }

            // Fire handlers on the event path
            i = 0;
            while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
                lastElement = cur;
                event.type = i > 1 ?
                    bubbleType :
                    special.bindType || type;

                // jQuery handler
                handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
                    dataPriv.get( cur, "handle" );
                if ( handle ) {
                    handle.apply( cur, data );
                }

                // Native handler
                handle = ontype && cur[ ontype ];
                if ( handle && handle.apply && acceptData( cur ) ) {
                    event.result = handle.apply( cur, data );
                    if ( event.result === false ) {
                        event.preventDefault();
                    }
                }
            }
            event.type = type;

            // If nobody prevented the default action, do it now
            if ( !onlyHandlers && !event.isDefaultPrevented() ) {

                if ( ( !special._default ||
                    special._default.apply( eventPath.pop(), data ) === false ) &&
                    acceptData( elem ) ) {

                    // Call a native DOM method on the target with the same name as the event.
                    // Don't do default actions on window, that's where global variables be (#6170)
                    if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

                        // Don't re-trigger an onFOO event when we call its FOO() method
                        tmp = elem[ ontype ];

                        if ( tmp ) {
                            elem[ ontype ] = null;
                        }

                        // Prevent re-triggering of the same event, since we already bubbled it above
                        jQuery.event.triggered = type;

                        if ( event.isPropagationStopped() ) {
                            lastElement.addEventListener( type, stopPropagationCallback );
                        }

                        elem[ type ]();

                        if ( event.isPropagationStopped() ) {
                            lastElement.removeEventListener( type, stopPropagationCallback );
                        }

                        jQuery.event.triggered = undefined;

                        if ( tmp ) {
                            elem[ ontype ] = tmp;
                        }
                    }
                }
            }

            return event.result;
        },

        // Piggyback on a donor event to simulate a different one
        // Used only for `focus(in | out)` events
        simulate: function( type, elem, event ) {
            var e = jQuery.extend(
                new jQuery.Event(),
                event,
                {
                    type: type,
                    isSimulated: true
                }
            );

            jQuery.event.trigger( e, null, elem );
        }

    } );

    jQuery.fn.extend( {

        trigger: function( type, data ) {
            return this.each( function() {
                jQuery.event.trigger( type, data, this );
            } );
        },
        triggerHandler: function( type, data ) {
            var elem = this[ 0 ];
            if ( elem ) {
                return jQuery.event.trigger( type, data, elem, true );
            }
        }
    } );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
    if ( !support.focusin ) {
        jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

            // Attach a single capturing handler on the document while someone wants focusin/focusout
            var handler = function( event ) {
                jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
            };

            jQuery.event.special[ fix ] = {
                setup: function() {
                    var doc = this.ownerDocument || this,
                        attaches = dataPriv.access( doc, fix );

                    if ( !attaches ) {
                        doc.addEventListener( orig, handler, true );
                    }
                    dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
                },
                teardown: function() {
                    var doc = this.ownerDocument || this,
                        attaches = dataPriv.access( doc, fix ) - 1;

                    if ( !attaches ) {
                        doc.removeEventListener( orig, handler, true );
                        dataPriv.remove( doc, fix );

                    } else {
                        dataPriv.access( doc, fix, attaches );
                    }
                }
            };
        } );
    }
    var location = window.location;

    var nonce = Date.now();

    var rquery = ( /\?/ );



// Cross-browser xml parsing
    jQuery.parseXML = function( data ) {
        var xml;
        if ( !data || typeof data !== "string" ) {
            return null;
        }

        // Support: IE 9 - 11 only
        // IE throws on parseFromString with invalid input.
        try {
            xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
        } catch ( e ) {
            xml = undefined;
        }

        if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
            jQuery.error( "Invalid XML: " + data );
        }
        return xml;
    };


    var
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i;

    function buildParams( prefix, obj, traditional, add ) {
        var name;

        if ( Array.isArray( obj ) ) {

            // Serialize array item.
            jQuery.each( obj, function( i, v ) {
                if ( traditional || rbracket.test( prefix ) ) {

                    // Treat each array item as a scalar.
                    add( prefix, v );

                } else {

                    // Item is non-scalar (array or object), encode its numeric index.
                    buildParams(
                        prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
                        v,
                        traditional,
                        add
                    );
                }
            } );

        } else if ( !traditional && toType( obj ) === "object" ) {

            // Serialize object item.
            for ( name in obj ) {
                buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
            }

        } else {

            // Serialize scalar item.
            add( prefix, obj );
        }
    }

// Serialize an array of form elements or a set of
// key/values into a query string
    jQuery.param = function( a, traditional ) {
        var prefix,
            s = [],
            add = function( key, valueOrFunction ) {

                // If value is a function, invoke it and use its return value
                var value = isFunction( valueOrFunction ) ?
                    valueOrFunction() :
                    valueOrFunction;

                s[ s.length ] = encodeURIComponent( key ) + "=" +
                    encodeURIComponent( value == null ? "" : value );
            };

        if ( a == null ) {
            return "";
        }

        // If an array was passed in, assume that it is an array of form elements.
        if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

            // Serialize the form elements
            jQuery.each( a, function() {
                add( this.name, this.value );
            } );

        } else {

            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for ( prefix in a ) {
                buildParams( prefix, a[ prefix ], traditional, add );
            }
        }

        // Return the resulting serialization
        return s.join( "&" );
    };

    jQuery.fn.extend( {
        serialize: function() {
            return jQuery.param( this.serializeArray() );
        },
        serializeArray: function() {
            return this.map( function() {

                // Can add propHook for "elements" to filter or add form elements
                var elements = jQuery.prop( this, "elements" );
                return elements ? jQuery.makeArray( elements ) : this;
            } )
                .filter( function() {
                    var type = this.type;

                    // Use .is( ":disabled" ) so that fieldset[disabled] works
                    return this.name && !jQuery( this ).is( ":disabled" ) &&
                        rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
                        ( this.checked || !rcheckableType.test( type ) );
                } )
                .map( function( i, elem ) {
                    var val = jQuery( this ).val();

                    if ( val == null ) {
                        return null;
                    }

                    if ( Array.isArray( val ) ) {
                        return jQuery.map( val, function( val ) {
                            return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                        } );
                    }

                    return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                } ).get();
        }
    } );


    var
        r20 = /%20/g,
        rhash = /#.*$/,
        rantiCache = /([?&])_=[^&]*/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

        // #7653, #8125, #8152: local protocol detection
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,

        /* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
        prefilters = {},

        /* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
        transports = {},

        // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
        allTypes = "*/".concat( "*" ),

        // Anchor tag for parsing the document origin
        originAnchor = document.createElement( "a" );
    originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports( structure ) {

        // dataTypeExpression is optional and defaults to "*"
        return function( dataTypeExpression, func ) {

            if ( typeof dataTypeExpression !== "string" ) {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            var dataType,
                i = 0,
                dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

            if ( isFunction( func ) ) {

                // For each dataType in the dataTypeExpression
                while ( ( dataType = dataTypes[ i++ ] ) ) {

                    // Prepend if requested
                    if ( dataType[ 0 ] === "+" ) {
                        dataType = dataType.slice( 1 ) || "*";
                        ( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

                        // Otherwise append
                    } else {
                        ( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
                    }
                }
            }
        };
    }

// Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

        var inspected = {},
            seekingTransport = ( structure === transports );

        function inspect( dataType ) {
            var selected;
            inspected[ dataType ] = true;
            jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
                var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
                if ( typeof dataTypeOrTransport === "string" &&
                    !seekingTransport && !inspected[ dataTypeOrTransport ] ) {

                    options.dataTypes.unshift( dataTypeOrTransport );
                    inspect( dataTypeOrTransport );
                    return false;
                } else if ( seekingTransport ) {
                    return !( selected = dataTypeOrTransport );
                }
            } );
            return selected;
        }

        return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
    }

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
    function ajaxExtend( target, src ) {
        var key, deep,
            flatOptions = jQuery.ajaxSettings.flatOptions || {};

        for ( key in src ) {
            if ( src[ key ] !== undefined ) {
                ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
            }
        }
        if ( deep ) {
            jQuery.extend( true, target, deep );
        }

        return target;
    }

    /* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
    function ajaxHandleResponses( s, jqXHR, responses ) {

        var ct, type, finalDataType, firstDataType,
            contents = s.contents,
            dataTypes = s.dataTypes;

        // Remove auto dataType and get content-type in the process
        while ( dataTypes[ 0 ] === "*" ) {
            dataTypes.shift();
            if ( ct === undefined ) {
                ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
            }
        }

        // Check if we're dealing with a known content-type
        if ( ct ) {
            for ( type in contents ) {
                if ( contents[ type ] && contents[ type ].test( ct ) ) {
                    dataTypes.unshift( type );
                    break;
                }
            }
        }

        // Check to see if we have a response for the expected dataType
        if ( dataTypes[ 0 ] in responses ) {
            finalDataType = dataTypes[ 0 ];
        } else {

            // Try convertible dataTypes
            for ( type in responses ) {
                if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
                    finalDataType = type;
                    break;
                }
                if ( !firstDataType ) {
                    firstDataType = type;
                }
            }

            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if ( finalDataType ) {
            if ( finalDataType !== dataTypes[ 0 ] ) {
                dataTypes.unshift( finalDataType );
            }
            return responses[ finalDataType ];
        }
    }

    /* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
    function ajaxConvert( s, response, jqXHR, isSuccess ) {
        var conv2, current, conv, tmp, prev,
            converters = {},

            // Work with a copy of dataTypes in case we need to modify it for conversion
            dataTypes = s.dataTypes.slice();

        // Create converters map with lowercased keys
        if ( dataTypes[ 1 ] ) {
            for ( conv in s.converters ) {
                converters[ conv.toLowerCase() ] = s.converters[ conv ];
            }
        }

        current = dataTypes.shift();

        // Convert to each sequential dataType
        while ( current ) {

            if ( s.responseFields[ current ] ) {
                jqXHR[ s.responseFields[ current ] ] = response;
            }

            // Apply the dataFilter if provided
            if ( !prev && isSuccess && s.dataFilter ) {
                response = s.dataFilter( response, s.dataType );
            }

            prev = current;
            current = dataTypes.shift();

            if ( current ) {

                // There's only work to do if current dataType is non-auto
                if ( current === "*" ) {

                    current = prev;

                    // Convert response if prev dataType is non-auto and differs from current
                } else if ( prev !== "*" && prev !== current ) {

                    // Seek a direct converter
                    conv = converters[ prev + " " + current ] || converters[ "* " + current ];

                    // If none found, seek a pair
                    if ( !conv ) {
                        for ( conv2 in converters ) {

                            // If conv2 outputs current
                            tmp = conv2.split( " " );
                            if ( tmp[ 1 ] === current ) {

                                // If prev can be converted to accepted input
                                conv = converters[ prev + " " + tmp[ 0 ] ] ||
                                    converters[ "* " + tmp[ 0 ] ];
                                if ( conv ) {

                                    // Condense equivalence converters
                                    if ( conv === true ) {
                                        conv = converters[ conv2 ];

                                        // Otherwise, insert the intermediate dataType
                                    } else if ( converters[ conv2 ] !== true ) {
                                        current = tmp[ 0 ];
                                        dataTypes.unshift( tmp[ 1 ] );
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    // Apply converter (if not an equivalence)
                    if ( conv !== true ) {

                        // Unless errors are allowed to bubble, catch and return them
                        if ( conv && s.throws ) {
                            response = conv( response );
                        } else {
                            try {
                                response = conv( response );
                            } catch ( e ) {
                                return {
                                    state: "parsererror",
                                    error: conv ? e : "No conversion from " + prev + " to " + current
                                };
                            }
                        }
                    }
                }
            }
        }

        return { state: "success", data: response };
    }

    jQuery.extend( {

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},

        ajaxSettings: {
            url: location.href,
            type: "GET",
            isLocal: rlocalProtocol.test( location.protocol ),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",

            /*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },

            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },

            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },

            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {

                // Convert anything to text
                "* text": String,

                // Text to html (true = no transformation)
                "text html": true,

                // Evaluate text as a json expression
                "text json": JSON.parse,

                // Parse text as xml
                "text xml": jQuery.parseXML
            },

            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                url: true,
                context: true
            }
        },

        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function( target, settings ) {
            return settings ?

                // Building a settings object
                ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

                // Extending ajaxSettings
                ajaxExtend( jQuery.ajaxSettings, target );
        },

        ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
        ajaxTransport: addToPrefiltersOrTransports( transports ),

        // Main method
        ajax: function( url, options ) {

            // If url is an object, simulate pre-1.5 signature
            if ( typeof url === "object" ) {
                options = url;
                url = undefined;
            }

            // Force options to be an object
            options = options || {};

            var transport,

                // URL without anti-cache param
                cacheURL,

                // Response headers
                responseHeadersString,
                responseHeaders,

                // timeout handle
                timeoutTimer,

                // Url cleanup var
                urlAnchor,

                // Request state (becomes false upon send and true upon completion)
                completed,

                // To know if global events are to be dispatched
                fireGlobals,

                // Loop variable
                i,

                // uncached part of the url
                uncached,

                // Create the final options object
                s = jQuery.ajaxSetup( {}, options ),

                // Callbacks context
                callbackContext = s.context || s,

                // Context for global events is callbackContext if it is a DOM node or jQuery collection
                globalEventContext = s.context &&
                ( callbackContext.nodeType || callbackContext.jquery ) ?
                    jQuery( callbackContext ) :
                    jQuery.event,

                // Deferreds
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery.Callbacks( "once memory" ),

                // Status-dependent callbacks
                statusCode = s.statusCode || {},

                // Headers (they are sent all at once)
                requestHeaders = {},
                requestHeadersNames = {},

                // Default abort message
                strAbort = "canceled",

                // Fake xhr
                jqXHR = {
                    readyState: 0,

                    // Builds headers hashtable if needed
                    getResponseHeader: function( key ) {
                        var match;
                        if ( completed ) {
                            if ( !responseHeaders ) {
                                responseHeaders = {};
                                while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
                                    responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
                                        ( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
                                            .concat( match[ 2 ] );
                                }
                            }
                            match = responseHeaders[ key.toLowerCase() + " " ];
                        }
                        return match == null ? null : match.join( ", " );
                    },

                    // Raw string
                    getAllResponseHeaders: function() {
                        return completed ? responseHeadersString : null;
                    },

                    // Caches the header
                    setRequestHeader: function( name, value ) {
                        if ( completed == null ) {
                            name = requestHeadersNames[ name.toLowerCase() ] =
                                requestHeadersNames[ name.toLowerCase() ] || name;
                            requestHeaders[ name ] = value;
                        }
                        return this;
                    },

                    // Overrides response content-type header
                    overrideMimeType: function( type ) {
                        if ( completed == null ) {
                            s.mimeType = type;
                        }
                        return this;
                    },

                    // Status-dependent callbacks
                    statusCode: function( map ) {
                        var code;
                        if ( map ) {
                            if ( completed ) {

                                // Execute the appropriate callbacks
                                jqXHR.always( map[ jqXHR.status ] );
                            } else {

                                // Lazy-add the new callbacks in a way that preserves old ones
                                for ( code in map ) {
                                    statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
                                }
                            }
                        }
                        return this;
                    },

                    // Cancel the request
                    abort: function( statusText ) {
                        var finalText = statusText || strAbort;
                        if ( transport ) {
                            transport.abort( finalText );
                        }
                        done( 0, finalText );
                        return this;
                    }
                };

            // Attach deferreds
            deferred.promise( jqXHR );

            // Add protocol if not provided (prefilters might expect it)
            // Handle falsy url in the settings object (#10093: consistency with old signature)
            // We also use the url parameter if available
            s.url = ( ( url || s.url || location.href ) + "" )
                .replace( rprotocol, location.protocol + "//" );

            // Alias method option to type as per ticket #12004
            s.type = options.method || options.type || s.method || s.type;

            // Extract dataTypes list
            s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

            // A cross-domain request is in order when the origin doesn't match the current origin.
            if ( s.crossDomain == null ) {
                urlAnchor = document.createElement( "a" );

                // Support: IE <=8 - 11, Edge 12 - 15
                // IE throws exception on accessing the href property if url is malformed,
                // e.g. http://example.com:80x/
                try {
                    urlAnchor.href = s.url;

                    // Support: IE <=8 - 11 only
                    // Anchor's host property isn't correctly set when s.url is relative
                    urlAnchor.href = urlAnchor.href;
                    s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
                        urlAnchor.protocol + "//" + urlAnchor.host;
                } catch ( e ) {

                    // If there is an error parsing the URL, assume it is crossDomain,
                    // it can be rejected by the transport if it is invalid
                    s.crossDomain = true;
                }
            }

            // Convert data if not already a string
            if ( s.data && s.processData && typeof s.data !== "string" ) {
                s.data = jQuery.param( s.data, s.traditional );
            }

            // Apply prefilters
            inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

            // If request was aborted inside a prefilter, stop there
            if ( completed ) {
                return jqXHR;
            }

            // We can fire global events as of now if asked to
            // Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
            fireGlobals = jQuery.event && s.global;

            // Watch for a new set of requests
            if ( fireGlobals && jQuery.active++ === 0 ) {
                jQuery.event.trigger( "ajaxStart" );
            }

            // Uppercase the type
            s.type = s.type.toUpperCase();

            // Determine if request has content
            s.hasContent = !rnoContent.test( s.type );

            // Save the URL in case we're toying with the If-Modified-Since
            // and/or If-None-Match header later on
            // Remove hash to simplify url manipulation
            cacheURL = s.url.replace( rhash, "" );

            // More options handling for requests with no content
            if ( !s.hasContent ) {

                // Remember the hash so we can put it back
                uncached = s.url.slice( cacheURL.length );

                // If data is available and should be processed, append data to url
                if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
                    cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

                    // #9682: remove data so that it's not used in an eventual retry
                    delete s.data;
                }

                // Add or update anti-cache param if needed
                if ( s.cache === false ) {
                    cacheURL = cacheURL.replace( rantiCache, "$1" );
                    uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
                }

                // Put hash and anti-cache on the URL that will be requested (gh-1732)
                s.url = cacheURL + uncached;

                // Change '%20' to '+' if this is encoded form body content (gh-2658)
            } else if ( s.data && s.processData &&
                ( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
                s.data = s.data.replace( r20, "+" );
            }

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if ( s.ifModified ) {
                if ( jQuery.lastModified[ cacheURL ] ) {
                    jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
                }
                if ( jQuery.etag[ cacheURL ] ) {
                    jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
                }
            }

            // Set the correct header, if data is being sent
            if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
                jqXHR.setRequestHeader( "Content-Type", s.contentType );
            }

            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader(
                "Accept",
                s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
                    s.accepts[ s.dataTypes[ 0 ] ] +
                    ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                    s.accepts[ "*" ]
            );

            // Check for headers option
            for ( i in s.headers ) {
                jqXHR.setRequestHeader( i, s.headers[ i ] );
            }

            // Allow custom headers/mimetypes and early abort
            if ( s.beforeSend &&
                ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

                // Abort if not done already and return
                return jqXHR.abort();
            }

            // Aborting is no longer a cancellation
            strAbort = "abort";

            // Install callbacks on deferreds
            completeDeferred.add( s.complete );
            jqXHR.done( s.success );
            jqXHR.fail( s.error );

            // Get transport
            transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

            // If no transport, we auto-abort
            if ( !transport ) {
                done( -1, "No Transport" );
            } else {
                jqXHR.readyState = 1;

                // Send global event
                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
                }

                // If request was aborted inside ajaxSend, stop there
                if ( completed ) {
                    return jqXHR;
                }

                // Timeout
                if ( s.async && s.timeout > 0 ) {
                    timeoutTimer = window.setTimeout( function() {
                        jqXHR.abort( "timeout" );
                    }, s.timeout );
                }

                try {
                    completed = false;
                    transport.send( requestHeaders, done );
                } catch ( e ) {

                    // Rethrow post-completion exceptions
                    if ( completed ) {
                        throw e;
                    }

                    // Propagate others as results
                    done( -1, e );
                }
            }

            // Callback for when everything is done
            function done( status, nativeStatusText, responses, headers ) {
                var isSuccess, success, error, response, modified,
                    statusText = nativeStatusText;

                // Ignore repeat invocations
                if ( completed ) {
                    return;
                }

                completed = true;

                // Clear timeout if it exists
                if ( timeoutTimer ) {
                    window.clearTimeout( timeoutTimer );
                }

                // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined;

                // Cache response headers
                responseHeadersString = headers || "";

                // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0;

                // Determine if successful
                isSuccess = status >= 200 && status < 300 || status === 304;

                // Get response data
                if ( responses ) {
                    response = ajaxHandleResponses( s, jqXHR, responses );
                }

                // Convert no matter what (that way responseXXX fields are always set)
                response = ajaxConvert( s, response, jqXHR, isSuccess );

                // If successful, handle type chaining
                if ( isSuccess ) {

                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if ( s.ifModified ) {
                        modified = jqXHR.getResponseHeader( "Last-Modified" );
                        if ( modified ) {
                            jQuery.lastModified[ cacheURL ] = modified;
                        }
                        modified = jqXHR.getResponseHeader( "etag" );
                        if ( modified ) {
                            jQuery.etag[ cacheURL ] = modified;
                        }
                    }

                    // if no content
                    if ( status === 204 || s.type === "HEAD" ) {
                        statusText = "nocontent";

                        // if not modified
                    } else if ( status === 304 ) {
                        statusText = "notmodified";

                        // If we have data, let's convert it
                    } else {
                        statusText = response.state;
                        success = response.data;
                        error = response.error;
                        isSuccess = !error;
                    }
                } else {

                    // Extract error from statusText and normalize for non-aborts
                    error = statusText;
                    if ( status || !statusText ) {
                        statusText = "error";
                        if ( status < 0 ) {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = ( nativeStatusText || statusText ) + "";

                // Success/Error
                if ( isSuccess ) {
                    deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
                } else {
                    deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
                }

                // Status-dependent callbacks
                jqXHR.statusCode( statusCode );
                statusCode = undefined;

                if ( fireGlobals ) {
                    globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
                        [ jqXHR, s, isSuccess ? success : error ] );
                }

                // Complete
                completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

                    // Handle the global AJAX counter
                    if ( !( --jQuery.active ) ) {
                        jQuery.event.trigger( "ajaxStop" );
                    }
                }
            }

            return jqXHR;
        },

        getJSON: function( url, data, callback ) {
            return jQuery.get( url, data, callback, "json" );
        },

        getScript: function( url, callback ) {
            return jQuery.get( url, undefined, callback, "script" );
        }
    } );

    jQuery.each( [ "get", "post" ], function( i, method ) {
        jQuery[ method ] = function( url, data, callback, type ) {

            // Shift arguments if data argument was omitted
            if ( isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            // The url can be an options object (which then must have .url)
            return jQuery.ajax( jQuery.extend( {
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            }, jQuery.isPlainObject( url ) && url ) );
        };
    } );


    jQuery._evalUrl = function( url, options ) {
        return jQuery.ajax( {
            url: url,

            // Make this explicit, since user can override this through ajaxSetup (#11264)
            type: "GET",
            dataType: "script",
            cache: true,
            async: false,
            global: false,

            // Only evaluate the response if it is successful (gh-4126)
            // dataFilter is not invoked for failure responses, so using it instead
            // of the default converter is kludgy but it works.
            converters: {
                "text script": function() {}
            },
            dataFilter: function( response ) {
                jQuery.globalEval( response, options );
            }
        } );
    };


    jQuery.fn.extend( {
        wrapAll: function( html ) {
            var wrap;

            if ( this[ 0 ] ) {
                if ( isFunction( html ) ) {
                    html = html.call( this[ 0 ] );
                }

                // The elements to wrap the target around
                wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

                if ( this[ 0 ].parentNode ) {
                    wrap.insertBefore( this[ 0 ] );
                }

                wrap.map( function() {
                    var elem = this;

                    while ( elem.firstElementChild ) {
                        elem = elem.firstElementChild;
                    }

                    return elem;
                } ).append( this );
            }

            return this;
        },

        wrapInner: function( html ) {
            if ( isFunction( html ) ) {
                return this.each( function( i ) {
                    jQuery( this ).wrapInner( html.call( this, i ) );
                } );
            }

            return this.each( function() {
                var self = jQuery( this ),
                    contents = self.contents();

                if ( contents.length ) {
                    contents.wrapAll( html );

                } else {
                    self.append( html );
                }
            } );
        },

        wrap: function( html ) {
            var htmlIsFunction = isFunction( html );

            return this.each( function( i ) {
                jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
            } );
        },

        unwrap: function( selector ) {
            this.parent( selector ).not( "body" ).each( function() {
                jQuery( this ).replaceWith( this.childNodes );
            } );
            return this;
        }
    } );


    jQuery.expr.pseudos.hidden = function( elem ) {
        return !jQuery.expr.pseudos.visible( elem );
    };
    jQuery.expr.pseudos.visible = function( elem ) {
        return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
    };




    jQuery.ajaxSettings.xhr = function() {
        try {
            return new window.XMLHttpRequest();
        } catch ( e ) {}
    };

    var xhrSuccessStatus = {

            // File protocol always yields status code 0, assume 200
            0: 200,

            // Support: IE <=9 only
            // #1450: sometimes IE returns 1223 when it should be 204
            1223: 204
        },
        xhrSupported = jQuery.ajaxSettings.xhr();

    support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
    support.ajax = xhrSupported = !!xhrSupported;

    jQuery.ajaxTransport( function( options ) {
        var callback, errorCallback;

        // Cross domain only allowed if supported through XMLHttpRequest
        if ( support.cors || xhrSupported && !options.crossDomain ) {
            return {
                send: function( headers, complete ) {
                    var i,
                        xhr = options.xhr();

                    xhr.open(
                        options.type,
                        options.url,
                        options.async,
                        options.username,
                        options.password
                    );

                    // Apply custom fields if provided
                    if ( options.xhrFields ) {
                        for ( i in options.xhrFields ) {
                            xhr[ i ] = options.xhrFields[ i ];
                        }
                    }

                    // Override mime type if needed
                    if ( options.mimeType && xhr.overrideMimeType ) {
                        xhr.overrideMimeType( options.mimeType );
                    }

                    // X-Requested-With header
                    // For cross-domain requests, seeing as conditions for a preflight are
                    // akin to a jigsaw puzzle, we simply never set it to be sure.
                    // (it can always be set on a per-request basis or even using ajaxSetup)
                    // For same-domain requests, won't change header if already provided.
                    if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
                        headers[ "X-Requested-With" ] = "XMLHttpRequest";
                    }

                    // Set headers
                    for ( i in headers ) {
                        xhr.setRequestHeader( i, headers[ i ] );
                    }

                    // Callback
                    callback = function( type ) {
                        return function() {
                            if ( callback ) {
                                callback = errorCallback = xhr.onload =
                                    xhr.onerror = xhr.onabort = xhr.ontimeout =
                                        xhr.onreadystatechange = null;

                                if ( type === "abort" ) {
                                    xhr.abort();
                                } else if ( type === "error" ) {

                                    // Support: IE <=9 only
                                    // On a manual native abort, IE9 throws
                                    // errors on any property access that is not readyState
                                    if ( typeof xhr.status !== "number" ) {
                                        complete( 0, "error" );
                                    } else {
                                        complete(

                                            // File: protocol always yields status 0; see #8605, #14207
                                            xhr.status,
                                            xhr.statusText
                                        );
                                    }
                                } else {
                                    complete(
                                        xhrSuccessStatus[ xhr.status ] || xhr.status,
                                        xhr.statusText,

                                        // Support: IE <=9 only
                                        // IE9 has no XHR2 but throws on binary (trac-11426)
                                        // For XHR2 non-text, let the caller handle it (gh-2498)
                                        ( xhr.responseType || "text" ) !== "text"  ||
                                        typeof xhr.responseText !== "string" ?
                                            { binary: xhr.response } :
                                            { text: xhr.responseText },
                                        xhr.getAllResponseHeaders()
                                    );
                                }
                            }
                        };
                    };

                    // Listen to events
                    xhr.onload = callback();
                    errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

                    // Support: IE 9 only
                    // Use onreadystatechange to replace onabort
                    // to handle uncaught aborts
                    if ( xhr.onabort !== undefined ) {
                        xhr.onabort = errorCallback;
                    } else {
                        xhr.onreadystatechange = function() {

                            // Check readyState before timeout as it changes
                            if ( xhr.readyState === 4 ) {

                                // Allow onerror to be called first,
                                // but that will not handle a native abort
                                // Also, save errorCallback to a variable
                                // as xhr.onerror cannot be accessed
                                window.setTimeout( function() {
                                    if ( callback ) {
                                        errorCallback();
                                    }
                                } );
                            }
                        };
                    }

                    // Create the abort callback
                    callback = callback( "abort" );

                    try {

                        // Do send the request (this may raise an exception)
                        xhr.send( options.hasContent && options.data || null );
                    } catch ( e ) {

                        // #14683: Only rethrow if this hasn't been notified as an error yet
                        if ( callback ) {
                            throw e;
                        }
                    }
                },

                abort: function() {
                    if ( callback ) {
                        callback();
                    }
                }
            };
        }
    } );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
    jQuery.ajaxPrefilter( function( s ) {
        if ( s.crossDomain ) {
            s.contents.script = false;
        }
    } );

// Install script dataType
    jQuery.ajaxSetup( {
        accepts: {
            script: "text/javascript, application/javascript, " +
                "application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function( text ) {
                jQuery.globalEval( text );
                return text;
            }
        }
    } );

// Handle cache's special case and crossDomain
    jQuery.ajaxPrefilter( "script", function( s ) {
        if ( s.cache === undefined ) {
            s.cache = false;
        }
        if ( s.crossDomain ) {
            s.type = "GET";
        }
    } );

// Bind script tag hack transport
    jQuery.ajaxTransport( "script", function( s ) {

        // This transport only deals with cross domain or forced-by-attrs requests
        if ( s.crossDomain || s.scriptAttrs ) {
            var script, callback;
            return {
                send: function( _, complete ) {
                    script = jQuery( "<script>" )
                        .attr( s.scriptAttrs || {} )
                        .prop( { charset: s.scriptCharset, src: s.url } )
                        .on( "load error", callback = function( evt ) {
                            script.remove();
                            callback = null;
                            if ( evt ) {
                                complete( evt.type === "error" ? 404 : 200, evt.type );
                            }
                        } );

                    // Use native DOM manipulation to avoid our domManip AJAX trickery
                    document.head.appendChild( script[ 0 ] );
                },
                abort: function() {
                    if ( callback ) {
                        callback();
                    }
                }
            };
        }
    } );




    var oldCallbacks = [],
        rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
    jQuery.ajaxSetup( {
        jsonp: "callback",
        jsonpCallback: function() {
            var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
            this[ callback ] = true;
            return callback;
        }
    } );

// Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

        var callbackName, overwritten, responseContainer,
            jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
                    "url" :
                    typeof s.data === "string" &&
                    ( s.contentType || "" )
                        .indexOf( "application/x-www-form-urlencoded" ) === 0 &&
                    rjsonp.test( s.data ) && "data"
            );

        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

            // Get callback name, remembering preexisting value associated with it
            callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
                s.jsonpCallback() :
                s.jsonpCallback;

            // Insert callback into url or form data
            if ( jsonProp ) {
                s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
            } else if ( s.jsonp !== false ) {
                s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
            }

            // Use data converter to retrieve json after script execution
            s.converters[ "script json" ] = function() {
                if ( !responseContainer ) {
                    jQuery.error( callbackName + " was not called" );
                }
                return responseContainer[ 0 ];
            };

            // Force json dataType
            s.dataTypes[ 0 ] = "json";

            // Install callback
            overwritten = window[ callbackName ];
            window[ callbackName ] = function() {
                responseContainer = arguments;
            };

            // Clean-up function (fires after converters)
            jqXHR.always( function() {

                // If previous value didn't exist - remove it
                if ( overwritten === undefined ) {
                    jQuery( window ).removeProp( callbackName );

                    // Otherwise restore preexisting value
                } else {
                    window[ callbackName ] = overwritten;
                }

                // Save back as free
                if ( s[ callbackName ] ) {

                    // Make sure that re-using the options doesn't screw things around
                    s.jsonpCallback = originalSettings.jsonpCallback;

                    // Save the callback name for future use
                    oldCallbacks.push( callbackName );
                }

                // Call if it was a function and we have a response
                if ( responseContainer && isFunction( overwritten ) ) {
                    overwritten( responseContainer[ 0 ] );
                }

                responseContainer = overwritten = undefined;
            } );

            // Delegate to script
            return "script";
        }
    } );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
    support.createHTMLDocument = ( function() {
        var body = document.implementation.createHTMLDocument( "" ).body;
        body.innerHTML = "<form></form><form></form>";
        return body.childNodes.length === 2;
    } )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
    jQuery.parseHTML = function( data, context, keepScripts ) {
        if ( typeof data !== "string" ) {
            return [];
        }
        if ( typeof context === "boolean" ) {
            keepScripts = context;
            context = false;
        }

        var base, parsed, scripts;

        if ( !context ) {

            // Stop scripts or inline event handlers from being executed immediately
            // by using document.implementation
            if ( support.createHTMLDocument ) {
                context = document.implementation.createHTMLDocument( "" );

                // Set the base href for the created document
                // so any parsed elements with URLs
                // are based on the document's URL (gh-2965)
                base = context.createElement( "base" );
                base.href = document.location.href;
                context.head.appendChild( base );
            } else {
                context = document;
            }
        }

        parsed = rsingleTag.exec( data );
        scripts = !keepScripts && [];

        // Single tag
        if ( parsed ) {
            return [ context.createElement( parsed[ 1 ] ) ];
        }

        parsed = buildFragment( [ data ], context, scripts );

        if ( scripts && scripts.length ) {
            jQuery( scripts ).remove();
        }

        return jQuery.merge( [], parsed.childNodes );
    };


    /**
     * Load a url into a page
     */
    jQuery.fn.load = function( url, params, callback ) {
        var selector, type, response,
            self = this,
            off = url.indexOf( " " );

        if ( off > -1 ) {
            selector = stripAndCollapse( url.slice( off ) );
            url = url.slice( 0, off );
        }

        // If it's a function
        if ( isFunction( params ) ) {

            // We assume that it's the callback
            callback = params;
            params = undefined;

            // Otherwise, build a param string
        } else if ( params && typeof params === "object" ) {
            type = "POST";
        }

        // If we have elements to modify, make the request
        if ( self.length > 0 ) {
            jQuery.ajax( {
                url: url,

                // If "type" variable is undefined, then "GET" method will be used.
                // Make value of this field explicit since
                // user can override it through ajaxSetup method
                type: type || "GET",
                dataType: "html",
                data: params
            } ).done( function( responseText ) {

                // Save response for use in complete callback
                response = arguments;

                self.html( selector ?

                    // If a selector was specified, locate the right elements in a dummy div
                    // Exclude scripts to avoid IE 'Permission Denied' errors
                    jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

                    // Otherwise use the full result
                    responseText );

                // If the request succeeds, this function gets "data", "status", "jqXHR"
                // but they are ignored because response was set above.
                // If it fails, this function gets "jqXHR", "status", "error"
            } ).always( callback && function( jqXHR, status ) {
                self.each( function() {
                    callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
                } );
            } );
        }

        return this;
    };




// Attach a bunch of functions for handling common AJAX events
    jQuery.each( [
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
    ], function( i, type ) {
        jQuery.fn[ type ] = function( fn ) {
            return this.on( type, fn );
        };
    } );




    jQuery.expr.pseudos.animated = function( elem ) {
        return jQuery.grep( jQuery.timers, function( fn ) {
            return elem === fn.elem;
        } ).length;
    };




    jQuery.offset = {
        setOffset: function( elem, options, i ) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
                position = jQuery.css( elem, "position" ),
                curElem = jQuery( elem ),
                props = {};

            // Set position first, in-case top/left are set even on static elem
            if ( position === "static" ) {
                elem.style.position = "relative";
            }

            curOffset = curElem.offset();
            curCSSTop = jQuery.css( elem, "top" );
            curCSSLeft = jQuery.css( elem, "left" );
            calculatePosition = ( position === "absolute" || position === "fixed" ) &&
                ( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

            // Need to be able to calculate position if either
            // top or left is auto and position is either absolute or fixed
            if ( calculatePosition ) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;

            } else {
                curTop = parseFloat( curCSSTop ) || 0;
                curLeft = parseFloat( curCSSLeft ) || 0;
            }

            if ( isFunction( options ) ) {

                // Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
                options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
            }

            if ( options.top != null ) {
                props.top = ( options.top - curOffset.top ) + curTop;
            }
            if ( options.left != null ) {
                props.left = ( options.left - curOffset.left ) + curLeft;
            }

            if ( "using" in options ) {
                options.using.call( elem, props );

            } else {
                curElem.css( props );
            }
        }
    };

    jQuery.fn.extend( {

        // offset() relates an element's border box to the document origin
        offset: function( options ) {

            // Preserve chaining for setter
            if ( arguments.length ) {
                return options === undefined ?
                    this :
                    this.each( function( i ) {
                        jQuery.offset.setOffset( this, options, i );
                    } );
            }

            var rect, win,
                elem = this[ 0 ];

            if ( !elem ) {
                return;
            }

            // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
            // Support: IE <=11 only
            // Running getBoundingClientRect on a
            // disconnected node in IE throws an error
            if ( !elem.getClientRects().length ) {
                return { top: 0, left: 0 };
            }

            // Get document-relative position by adding viewport scroll to viewport-relative gBCR
            rect = elem.getBoundingClientRect();
            win = elem.ownerDocument.defaultView;
            return {
                top: rect.top + win.pageYOffset,
                left: rect.left + win.pageXOffset
            };
        },

        // position() relates an element's margin box to its offset parent's padding box
        // This corresponds to the behavior of CSS absolute positioning
        position: function() {
            if ( !this[ 0 ] ) {
                return;
            }

            var offsetParent, offset, doc,
                elem = this[ 0 ],
                parentOffset = { top: 0, left: 0 };

            // position:fixed elements are offset from the viewport, which itself always has zero offset
            if ( jQuery.css( elem, "position" ) === "fixed" ) {

                // Assume position:fixed implies availability of getBoundingClientRect
                offset = elem.getBoundingClientRect();

            } else {
                offset = this.offset();

                // Account for the *real* offset parent, which can be the document or its root element
                // when a statically positioned element is identified
                doc = elem.ownerDocument;
                offsetParent = elem.offsetParent || doc.documentElement;
                while ( offsetParent &&
                ( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
                jQuery.css( offsetParent, "position" ) === "static" ) {

                    offsetParent = offsetParent.parentNode;
                }
                if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

                    // Incorporate borders into its offset, since they are outside its content origin
                    parentOffset = jQuery( offsetParent ).offset();
                    parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
                    parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
                }
            }

            // Subtract parent offsets and element margins
            return {
                top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
                left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
            };
        },

        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function() {
            return this.map( function() {
                var offsetParent = this.offsetParent;

                while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
                    offsetParent = offsetParent.offsetParent;
                }

                return offsetParent || documentElement;
            } );
        }
    } );

// Create scrollLeft and scrollTop methods
    jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
        var top = "pageYOffset" === prop;

        jQuery.fn[ method ] = function( val ) {
            return access( this, function( elem, method, val ) {

                // Coalesce documents and windows
                var win;
                if ( isWindow( elem ) ) {
                    win = elem;
                } else if ( elem.nodeType === 9 ) {
                    win = elem.defaultView;
                }

                if ( val === undefined ) {
                    return win ? win[ prop ] : elem[ method ];
                }

                if ( win ) {
                    win.scrollTo(
                        !top ? val : win.pageXOffset,
                        top ? val : win.pageYOffset
                    );

                } else {
                    elem[ method ] = val;
                }
            }, method, val, arguments.length );
        };
    } );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
    jQuery.each( [ "top", "left" ], function( i, prop ) {
        jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
            function( elem, computed ) {
                if ( computed ) {
                    computed = curCSS( elem, prop );

                    // If curCSS returns percentage, fallback to offset
                    return rnumnonpx.test( computed ) ?
                        jQuery( elem ).position()[ prop ] + "px" :
                        computed;
                }
            }
        );
    } );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
        jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
            function( defaultExtra, funcName ) {

                // Margin is only for outerHeight, outerWidth
                jQuery.fn[ funcName ] = function( margin, value ) {
                    var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
                        extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

                    return access( this, function( elem, type, value ) {
                        var doc;

                        if ( isWindow( elem ) ) {

                            // $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
                            return funcName.indexOf( "outer" ) === 0 ?
                                elem[ "inner" + name ] :
                                elem.document.documentElement[ "client" + name ];
                        }

                        // Get document width or height
                        if ( elem.nodeType === 9 ) {
                            doc = elem.documentElement;

                            // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
                            // whichever is greatest
                            return Math.max(
                                elem.body[ "scroll" + name ], doc[ "scroll" + name ],
                                elem.body[ "offset" + name ], doc[ "offset" + name ],
                                doc[ "client" + name ]
                            );
                        }

                        return value === undefined ?

                            // Get width or height on the element, requesting but not forcing parseFloat
                            jQuery.css( elem, type, extra ) :

                            // Set width or height on the element
                            jQuery.style( elem, type, value, extra );
                    }, type, chainable ? margin : undefined, chainable );
                };
            } );
    } );


    jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup contextmenu" ).split( " " ),
        function( i, name ) {

            // Handle event binding
            jQuery.fn[ name ] = function( data, fn ) {
                return arguments.length > 0 ?
                    this.on( name, null, data, fn ) :
                    this.trigger( name );
            };
        } );

    jQuery.fn.extend( {
        hover: function( fnOver, fnOut ) {
            return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
        }
    } );




    jQuery.fn.extend( {

        bind: function( types, data, fn ) {
            return this.on( types, null, data, fn );
        },
        unbind: function( types, fn ) {
            return this.off( types, null, fn );
        },

        delegate: function( selector, types, data, fn ) {
            return this.on( types, selector, data, fn );
        },
        undelegate: function( selector, types, fn ) {

            // ( namespace ) or ( selector, types [, fn] )
            return arguments.length === 1 ?
                this.off( selector, "**" ) :
                this.off( types, selector || "**", fn );
        }
    } );

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
    jQuery.proxy = function( fn, context ) {
        var tmp, args, proxy;

        if ( typeof context === "string" ) {
            tmp = fn[ context ];
            context = fn;
            fn = tmp;
        }

        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if ( !isFunction( fn ) ) {
            return undefined;
        }

        // Simulated bind
        args = slice.call( arguments, 2 );
        proxy = function() {
            return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
        };

        // Set the guid of unique handler to the same of original handler, so it can be removed
        proxy.guid = fn.guid = fn.guid || jQuery.guid++;

        return proxy;
    };

    jQuery.holdReady = function( hold ) {
        if ( hold ) {
            jQuery.readyWait++;
        } else {
            jQuery.ready( true );
        }
    };
    jQuery.isArray = Array.isArray;
    jQuery.parseJSON = JSON.parse;
    jQuery.nodeName = nodeName;
    jQuery.isFunction = isFunction;
    jQuery.isWindow = isWindow;
    jQuery.camelCase = camelCase;
    jQuery.type = toType;

    jQuery.now = Date.now;

    jQuery.isNumeric = function( obj ) {

        // As of jQuery 3.0, isNumeric is limited to
        // strings and numbers (primitives or objects)
        // that can be coerced to finite numbers (gh-2662)
        var type = jQuery.type( obj );
        return ( type === "number" || type === "string" ) &&

            // parseFloat NaNs numeric-cast false positives ("")
            // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
            // subtraction forces infinities to NaN
            !isNaN( obj - parseFloat( obj ) );
    };




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

    if ( typeof define === "function" && define.amd ) {
        define( "jquery", [], function() {
            return jQuery;
        } );
    }




    var

        // Map over jQuery in case of overwrite
        _jQuery = window.jQuery,

        // Map over the $ in case of overwrite
        _$ = window.$;

    jQuery.noConflict = function( deep ) {
        if ( window.$ === jQuery ) {
            window.$ = _$;
        }

        if ( deep && window.jQuery === jQuery ) {
            window.jQuery = _jQuery;
        }

        return jQuery;
    };

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
    if ( !noGlobal ) {
        window.jQuery = window.$ = jQuery;
    }




    return jQuery;
} );

function fpTranslate() {

    //var BFI_APPID = 'nil';
    var BFI_DONEMSG = 'nil';
    var BFI_TOLANG = 'nil';
    var BFI_SAMELANGMSG = 'nil';
    var BFI_LOADINGLANGMSG = 'nil';
    var BFI_CANCEL = 'nil';

    /* Copyright 2010 Microsoft Corporation */
    window['_mstConfig'] = {
        //appId: 'ThItpYrZC8u7LA_4XaMM9h1vkkDbKII4khHm2jXmvMYo\x2a',
        appId:'NTBD',
        rootURL: 'https\x3a\x2f\x2fwww.microsofttranslator.com\x2f',
        baseURL: 'https\x3a\x2f\x2fwww.microsofttranslator.com\x2fajax\x2fv3\x2fwidgetV3.ashx\x3fsettings\x3dmanual',
        serviceURL: 'https\x3a\x2f\x2fapi.microsofttranslator.com\x2fv2\x2fajax.svc',
        imagePath: 'https\x3a\x2f\x2fwww.microsofttranslator.com\x2fstatic\x2f197997\x2fimg\x2f',
        debug: false,
        locale: 'en',
        country: '',
        category: '',
        ref: 'WidgetV3',
        service: 'WG3',
        maxChars: 1000000000,
        noAuto: ["facebook.", "youtube."],
        escapeNonAscii: false,
        requestGroup: '',
        preTrans: false
    };
    window._mstConfig['SignIn'] = '<a href="https://login.live.com/login.srf?wa=wsignin1.0&amp;rpsnv=12&amp;ct=1401208142&amp;rver=6.0.5276.0&amp;wp=LBI&amp;wreply=http:%2F%2Fwww.microsofttranslator.com%2Fajax%2Fv2%2Fauth.aspx%3Fpru%3Dhttp%253a%252f%252fwww.microsofttranslator.com%252fajax%252fv3%252fwidgetV3.ashx&amp;lc=1033&amp;id=268160">Sign in</a>';

    if (!this.Microsoft) this.Microsoft = {};
    if (!this.Microsoft.Translator) this.Microsoft.Translator = {};
    if (Microsoft.Translator.Reset) Microsoft.Translator.Reset();

    Microsoft.Translator = new function () {
        var gb = "WidgetFloaterPanels",
            n = 7e3,
            T = "block",
            S = "4px 4px 4px 4px",
            J = "pointer",
            X = "2147483647",
            W = "absolute",
            O = "inline-block",
            bb = "direction",
            H = "lang",
            l = ">",
            N = "font",
            t = "img",
            M = "false",
            A = "left",
            K = "right",
            p = 100,
            z = "visible",
            s = 255,
            x = "div",
            L = "inline",
            ab = "position",
            k = 400,
            I = "select",
            q = "px",
            D = "0px",
            fb = "languageMappings",
            kb = "localizedLangs",
            r = "es",
            G = "no",
            Z = "de",
            V = "fr",
            eb = "zh-cht",
            jb = "zh-chs",
            v = "ar",
            e = "ltr",
            o = "rtl",
            F = "none",
            R = "iframe",
            d = 16,
            i = true,
            C = "number",
            Q = "function",
            E = "undefined",
            P = "head",
            c = -1,
            u = "/",
            U = "_mstConfig",
            g = "en",
            h = false,
            cb = "/static/img/",
            b = "",
            j = null,
            m = this;
        m.AddTranslation = function (i, b, a, j, m, h, c, e, k, l, d, f, g) {
            return new w("AddTranslation", {
                appId: i,
                originalText: b,
                translatedText: a,
                from: j,
                to: m,
                rating: h,
                contentType: c,
                category: e,
                user: k,
                uri: l
            }, d, f, g)
        };
        m.BreakSentences = function (e, f, b, a, c, d) {
            return new w("BreakSentences", {
                appId: e,
                text: f,
                language: b
            }, a, c, d)
        };
        m.Detect = function (d, e, a, b, c) {
            return new w("Detect", {
                appId: d,
                text: e
            }, a, b, c)
        };
        m.DetectArray = function (d, e, a, b, c) {
            return new w("DetectArray", {
                appId: d,
                texts: e
            }, a, b, c)
        };
        m.GetAppIdToken = function (g, c, a, b, d, e, f) {
            return new w("GetAppIdToken", {
                appId: g,
                minRatingRead: c,
                maxRatingWrite: a,
                expireSeconds: b
            }, d, e, f)
        };
        m.GetLanguageNames = function (f, e, a, b, c, d) {
            return new w("GetLanguageNames", {
                appId: f,
                locale: e,
                languageCodes: a
            }, b, c, d)
        };
        m.GetLanguagesForSpeak = function (d, a, b, c) {
            return new w("GetLanguagesForSpeak", {
                appId: d
            }, a, b, c)
        };
        m.GetLanguagesForTranslate = function (d, a, b, c) {
            return new w("GetLanguagesForTranslate", {
                appId: d
            }, a, b, c)
        };
        m.GetTranslations = function (f, h, g, i, a, d, b, c, e) {
            return new w("GetTranslations", {
                appId: f,
                text: h,
                from: g,
                to: i,
                maxTranslations: a,
                options: d
            }, b, c, e)
        };
        m.Translate = function (f, h, g, i, a, c, b, d, e) {
            return new w("Translate", {
                appId: f,
                text: h,
                from: g,
                to: i,
                contentType: a,
                category: c
            }, b, d, e)
        };
        m.AddTranslationArray = function (f, a, g, h, d, b, c, e) {
            return new w("AddTranslationArray", {
                appId: f,
                translations: a,
                from: g,
                to: h,
                options: d
            }, b, c, e)
        };
        m.GetTranslationsArray = function (f, g, h, i, a, d, b, c, e) {
            return new w("GetTranslationsArray", {
                appId: f,
                texts: g,
                from: h,
                to: i,
                maxTranslations: a,
                options: d
            }, b, c, e)
        };
        m.Speak = function (g, h, b, f, d, a, c, e) {
            return new w("Speak", {
                appId: g,
                text: h,
                language: b,
                format: f,
                options: d
            }, a, c, e)
        };
        m.TranslateArray = function (e, f, g, h, c, a, b, d) {
            return new w("TranslateArray", {
                appId: e,
                texts: f,
                from: g,
                to: h,
                options: c
            }, a, b, d)
        };
        m.TranslateArray2 = function (e, f, g, h, c, a, b, d) {
            return new w("TranslateArray2", {
                appId: e,
                texts: f,
                from: g,
                to: h,
                options: c
            }, a, b, d)
        };
        var a = {
            serviceClient: j,
            appId: b,
            lpURL: "https://www.bing.com/translator",
            rootURL: "https://www.microsofttranslator.com/",
            baseURL: "https://www.microsofttranslator.com/Ajax/V2/Toolkit.ashx",
            serviceURL: "https://api.microsofttranslator.com/V2/Ajax.svc",
            imagePath: cb,
            debug: h,
            locale: g,
            country: b,
            category: b,
            ref: b,
            service: b,
            maxChars: 1e9,
            noAuto: [],
            escapeNonAscii: h,
            requestGroup: b,
            preTrans: h
        };
        a.serviceClient = m;
        if (window[U]) {
            for (var mb in a)
                if (!window[U][mb]) window[U][mb] = a[mb];
            a = window[U]
        } else window[U] = a;
        var db = a.serviceClient.LoadScript = new function () {
                function d(f, k) {
                    var c = this,
                        a = f.toString().match(/^([^:]*:\/\/[^\/]*)(\/[^\?\#]*)([\?][^#]*)*/);
                    if (a) {
                        c.auth = a[1] || b;
                        c.path = a[2] || b;
                        c.query = a[3] || b
                    } else {
                        a = k.toString().match(/^([^:]*:\/\/[^\/]*)(\/[^\?\#]*)([\?][^#]*)*/);
                        var h = a[1] || b,
                            i = a[2] || b,
                            d = f.substr(0, 1) == u ? [] : i.split(u);
                        a = f.match(/^([^?]*)([\?][^#]*)*$/);
                        var e = (a[1] || b).split(u),
                            j = a[2] || b;
                        if (d.length > 0 && e.length > 0 && e[0] != ".") d.pop();
                        while (e.length > 0) {
                            var g = e.shift();
                            switch (g) {
                                case ".":
                                    break;
                                case "..":
                                    if (d.length) d.pop();
                                    break;
                                default:
                                    d.push(g)
                            }
                        }
                        c.auth = h;
                        c.path = d.join(u);
                        c.query = j
                    }
                    c.toString = function () {
                        return this.auth + this.path + this.query
                    };
                    return c
                }
                return function (f, i, b) {
                    f = (new d(f, i ? i : new d(a.baseURL))).toString();
                    b = b ? b : document;
                    var g = encodeURIComponent(f).replace(/%\w\w/g, " ").length;
                    if (navigator.userAgent.indexOf("MSIE") > c && g > 2048 || g > 8192) return j;
                    var e = b.createElement("script");
                    e.type = "text/javascript";
                    e.charset = "utf-8";
                    e.src = f;
                    var h = b.getElementsByTagName(P)[0];
                    if (h) h.appendChild(e);
                    else b.documentElement.insertBefore(e, b.documentElement.firstChild);
                    return e
                }
            },
            rb = new function () {
                var b = {
                        1: "Array",
                        2: "Boolean",
                        3: "Date",
                        4: "Function",
                        5: "Number",
                        6: "Object",
                        7: "RegExp",
                        8: "String"
                    },
                    c = {
                        1: "element",
                        2: "attribute",
                        3: "text",
                        4: "cdata",
                        5: "entityReference",
                        6: "entity",
                        7: "instruction",
                        8: "comment",
                        9: "document",
                        10: "documentType",
                        11: "documentFragment",
                        12: "notation"
                    },
                    a = {};
                for (var d in b) a[window[b[d]]] = b[d].toLowerCase();
                return function (b) {
                    if (b === undefined) return E;
                    else if (b === j) return "null";
                    else if (typeof b.constructor === Q && a[b.constructor]) return a[b.constructor];
                    else if (typeof b.nodeType === C && c[b.nodeType]) return c[b.nodeType];
                    return typeof b
                }
            },
            ib = new function () {
                var e = j;
                if (navigator.userAgent.toLowerCase().indexOf("msie 6.") > c || navigator.userAgent.toLowerCase().indexOf("webkit") > c && (document.charset || document.characterSet || b).toLowerCase().indexOf("utf") == c) a.escapeNonAscii = i;
                var f = "\\u0000",
                    q = '"#%&+:;=?@\\',
                    m = ["\\x00-\\x1F", "\\x7F-\\xA0"],
                    l = ["\\u02B0-\\u038F", "\\u2000-\\u20FF", "\\u3000-\\u303F"],
                    k = {
                        '"': '\\"',
                        "\\": "\\\\"
                    },
                    g;

                function s() {
                    g = new RegExp("[\\s" + q.replace(/./g, function (b) {
                        var a = b.charCodeAt(0).toString(d);
                        return f.substr(0, f.length - a.length) + a
                    }) + m.join(b) + (a.escapeNonAscii ? "\\x7B-\\uFFFF" : l.join(b)) + "]", "g");
                    g.compile(g.source, "g")
                }

                function r(b) {
                    if (k[b]) return k[b];
                    if (b.match(/[\s\xA0]/)) return "+";
                    var c = b.charCodeAt(0),
                        e = c.toString(d),
                        g = encodeURIComponent(b),
                        h = f.substr(0, f.length - e.length) + e;
                    if (g.length < h.length && c > 34 || a.escapeNonAscii && c > 122) return g;
                    else return h
                }

                function h(a) {
                    return a.toString().replace(g, r)
                }

                function o(a) {
                    return '"' + h(a) + '"'
                }

                function p(d) {
                    var b = [];
                    for (var a = 0; a < d.length; ++a) {
                        var c = ib(d[a]);
                        if (c !== e) b.push(c)
                    }
                    return "[" + b.join(",") + "]"
                }

                function n(c) {
                    var b = [];
                    for (var a in c) {
                        var d = ib(c[a]);
                        if (d !== e) b.push('"' + a + '":' + d)
                    }
                    return "{" + b.join(",") + "}"
                }
                return function (a) {
                    s();
                    switch (rb(a)) {
                        case E:
                            return e;
                        case "null":
                            return e;
                        case "boolean":
                            return h(a.toString());
                        case C:
                            return h(a.toString());
                        case "string":
                            return o(a);
                        case "array":
                            return p(a);
                        default:
                            return n(a)
                    }
                }
            },
            w = new function () {
                var k, g = 0,
                    e = window,
                    f = (document.charset || document.characterSet || b).toLowerCase();
                if (f.indexOf("utf") == c && f.indexOf("unicode") == c) try {
                    a.escapeNonAscii = i;
                    var d = document.createElement(R);
                    d.id = "MstReqFrm";
                    d.style.display = F;
                    d.translate = h;
                    document.documentElement.insertBefore(d, document.documentElement.firstChild);
                    d.contentWindow.document.open("text/html", "replace");
                    d.contentWindow.document.write('<html><head><meta charset="utf-8"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body></body></html>');
                    d.contentWindow.document.close();
                    e = d.contentWindow
                } catch (k) {
                    if (a.debug);
                }
                return function (w, m, k, p, q) {
                    var s = Q,
                        d = ++g,
                        o, f, l = h,
                        u = h,
                        t = b,
                        y = e["_mstc" + d] = function (a) {
                            if (validTranslation) return;
                            validTranslation = true;
                            //console.log("SUCCESS " + d);
                            setTimeout(function () {
                                if (u) {
                                    n(t);
                                    return
                                }
                                if (l) return;
                                setTimeout(v, 0);
                                if (k && typeof k === s) k(a)
                            }, 0)
                        },
                        n = e["_mste" + d] = function (a) {
                            setTimeout(function () {
                                if (l) return;
                                setTimeout(v, 0);
                                if (p && typeof p === s) p(a)
                            }, 0)
                        },
                        validPage = false,
                        validTranslation = false;

                    if (window.location.href === 'http://mi.fujigen.co.jp/collection/ser_expert_flame.html') {
                        setTimeout(function(a) {
                            if (validTranslation) return;
                            //document.body.style.backgroundColor = 'red';
                            if (d === 1) {
                                console.log("MOCK SEND");
                                window["_mstc1"]([{"From":"ja","OriginalTextSentenceLengths":[10],"TranslatedText":"COLLECTION","TranslatedTextSentenceLengths":[10]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"Guitar","TranslatedTextSentenceLengths":[6]},{"From":"ja","OriginalTextSentenceLengths":[4],"TranslatedText":"Bass","TranslatedTextSentenceLengths":[4]},{"From":"ja","OriginalTextSentenceLengths":[9],"TranslatedText":"Accessory","TranslatedTextSentenceLengths":[9]},{"From":"ja","OriginalTextSentenceLengths":[17],"TranslatedText":"WEB DEISGN SYSTEM","TranslatedTextSentenceLengths":[17]},{"From":"ja","OriginalTextSentenceLengths":[11],"TranslatedText":"ONLINE SHOP","TranslatedTextSentenceLengths":[11]},{"From":"ja","OriginalTextSentenceLengths":[13],"TranslatedText":"COMMUNICATION","TranslatedTextSentenceLengths":[13]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"Artist","TranslatedTextSentenceLengths":[6]},{"From":"ja","OriginalTextSentenceLengths":[10],"TranslatedText":"Technology","TranslatedTextSentenceLengths":[10]},{"From":"ja","OriginalTextSentenceLengths":[7],"TranslatedText":"Dealers","TranslatedTextSentenceLengths":[7]},{"From":"ja","OriginalTextSentenceLengths":[8],"TranslatedText":"About Us","TranslatedTextSentenceLengths":[8]},{"From":"ja","OriginalTextSentenceLengths":[40],"TranslatedText":"<b10> GUITAR</b10> &gt;&gt; EXPERT SERIES","TranslatedTextSentenceLengths":[41]},{"From":"ja","OriginalTextSentenceLengths":[12],"TranslatedText":"Expert FLAME","TranslatedTextSentenceLengths":[12]},{"From":"ja","OriginalTextSentenceLengths":[8],"TranslatedText":"FEATURES","TranslatedTextSentenceLengths":[8]},{"From":"ja","OriginalTextSentenceLengths":[17],"TranslatedText":"Circles fretting system","TranslatedTextSentenceLengths":[23]},{"From":"ja","OriginalTextSentenceLengths":[45,36],"TranslatedText":"Hitting the fret in an arc-shaped, each chord and each fret and intersect at right angles and minimizes contact surface. Delivers clear and of good, rich sound sustain.","TranslatedTextSentenceLengths":[121,47]},{"From":"ja","OriginalTextSentenceLengths":[57],"TranslatedText":" FUJIGEN, FGN all electric guitars, electric bass circles fretting system adopted.","TranslatedTextSentenceLengths":[82]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"For more information, click here.","TranslatedTextSentenceLengths":[33]},{"From":"ja","OriginalTextSentenceLengths":[17],"TranslatedText":"Low set-up set up","TranslatedTextSentenceLengths":[17]},{"From":"ja","OriginalTextSentenceLengths":[71,29],"TranslatedText":"Without lowering the frets to compared to traditional electric guitar neck to set about 1 mm deeper body, has shortened the distance between the strings and body top. Expert OS expert FL, NST to adoption.","TranslatedTextSentenceLengths":[167,37]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"For more information, click here.","TranslatedTextSentenceLengths":[33]},{"From":"ja","OriginalTextSentenceLengths":[15],"TranslatedText":"Expert fret edges","TranslatedTextSentenceLengths":[17]},{"From":"ja","OriginalTextSentenceLengths":[51],"TranslatedText":"Fret edges by craftsmen hand-made finish contributes to the smooth, smooth fingering.","TranslatedTextSentenceLengths":[85]},{"From":"ja","OriginalTextSentenceLengths":[24],"TranslatedText":"Natural satin finish neck back","TranslatedTextSentenceLengths":[30]},{"From":"ja","OriginalTextSentenceLengths":[61],"TranslatedText":"Natural satin FI 2 she to achieve smooth and comfortable playability sweating hands neck and back....","TranslatedTextSentenceLengths":[101]},{"From":"ja","OriginalTextSentenceLengths":[18],"TranslatedText":"Smooth heel neck joints","TranslatedTextSentenceLengths":[23]}]);
                            }
                            else if (d === 2) {
                                window["_mstc2"]([{"From":"ja","OriginalTextSentenceLengths":[43],"TranslatedText":"It is possible a smooth access to the fretboard smooth heel neck joints.","TranslatedTextSentenceLengths":[72]},{"From":"ja","OriginalTextSentenceLengths":[11],"TranslatedText":"FJTP tailpiece","TranslatedTextSentenceLengths":[14]},{"From":"ja","OriginalTextSentenceLengths":[57],"TranslatedText":"FGN オリジナルテイル piece FJTP through body style, stop tail style 2 type is selectable.","TranslatedTextSentenceLengths":[81]},{"From":"ja","OriginalTextSentenceLengths":[19],"TranslatedText":"Expert FLAME LINEUP","TranslatedTextSentenceLengths":[19]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"EFL-FM","TranslatedTextSentenceLengths":[6]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"EFL-DE","TranslatedTextSentenceLengths":[6]},{"From":"ja","OriginalTextSentenceLengths":[6],"TranslatedText":"EFL-HM","TranslatedTextSentenceLengths":[6]},{"From":"ja","OriginalTextSentenceLengths":[8],"TranslatedText":"PAGE TOP","TranslatedTextSentenceLengths":[8]},{"From":"ja","OriginalTextSentenceLengths":[11],"TranslatedText":"ONLINE SHOP","TranslatedTextSentenceLengths":[11]},{"From":"ja","OriginalTextSentenceLengths":[5],"TranslatedText":"LINKS","TranslatedTextSentenceLengths":[5]},{"From":"ja","OriginalTextSentenceLengths":[7],"TranslatedText":"CONTACT","TranslatedTextSentenceLengths":[7]},{"From":"ja","OriginalTextSentenceLengths":[10],"TranslatedText":"SITEPOLICY","TranslatedTextSentenceLengths":[10]},{"From":"ja","OriginalTextSentenceLengths":[7],"TranslatedText":"SITEMAP","TranslatedTextSentenceLengths":[7]},{"From":"ja","OriginalTextSentenceLengths":[35],"TranslatedText":"All copyright reserved Fujigen Inc.","TranslatedTextSentenceLengths":[35]}]);
                            }
                            console.log("TIMEOUT RECEIVED SEND MOCK");
                            validTranslation = true;
                        }, 5000);
                    }

                    function v() {
                        try {
                            //delete e["_mstc" + d]
                        } catch (a) {}
                        try {
                            //delete e["_mste" + d]
                        } catch (a) {}
                        try {
                            if (f) f.parentNode.removeChild(f)
                        } catch (a) {}
                        try {
                            if (o) clearTimeout(o)
                        } catch (a) {}
                        l = i
                    }
                    this.abort = function (a) {
                        u = i;
                        t = "The request has been aborted" + (a ? ": " + a : b)
                    };
                    var c = [];
                    for (var r in m)
                        if (m[r] != j) c.push(r + "=" + ib(m[r]));
                    c.push("oncomplete=_mstc" + d);
                    c.push("onerror=_mste" + d);
                    c.push("loc=" + encodeURIComponent(a.locale));
                    c.push("ctr=" + encodeURIComponent(a.country));
                    if (a.ref) c.push("ref=" + encodeURIComponent(a.ref));
                    c.push("rgp=" + encodeURIComponent(a.requestGroup));
                    var x = "./" + w + "?" + c.join("&");
                    f = db(x, a.serviceURL, e.document);
                    if (f) {
                        if (typeof q === C && q > 0) o = setTimeout(function () {
                            n("The request has timed out")
                        }, q)
                    } else {
                        if (a.debug);
                        n("The script could not be loaded")
                    }
                    return this
                }
            },
            pb = {
                ar: "العربية",
                bg: "Български",
                ca: "Català",
                "zh-CHS": "简体中文",
                "zh-CHT": "繁體中文",
                cs: "Čeština",
                da: "Dansk",
                nl: "Nederlands",
                en: "English",
                et: "Eesti",
                fi: "Suomi",
                fr: "Français",
                de: "Deutsch",
                el: "Ελληνικά",
                ht: "Haitian Creole",
                he: "עברית",
                hi: "हिंदी",
                mww: "Hmong Daw",
                hu: "Magyar",
                id: "Indonesia",
                it: "Italiano",
                ja: "日本語",
                tlh: "Klingon",
                ko: "한국어",
                lv: "Latviešu",
                lt: "Lietuvių",
                ms: "Melayu",
                mt: "Il-Malti",
                no: "Norsk",
                fa: "Persian",
                pl: "Polski",
                pt: "Português",
                ro: "Română",
                ru: "Русский",
                sk: "Slovenčina",
                sl: "Slovenščina",
                es: "Español",
                sv: "Svenska",
                th: "ไทย",
                tr: "Türkçe",
                uk: "Українська",
                ur: "اردو",
                vi: "Tiếng Việt",
                cy: "Welsh"
            },
            hb = {
                ar: o,
                bg: e,
                ca: e,
                "zh-chs": e,
                "zh-cht": e,
                cs: e,
                da: e,
                nl: e,
                en: e,
                et: e,
                fi: e,
                fr: e,
                de: e,
                el: e,
                ht: e,
                he: o,
                hi: e,
                mww: e,
                hu: e,
                id: e,
                it: e,
                ja: e,
                tlh: e,
                "tlh-qaak": e,
                ko: e,
                lv: e,
                lt: e,
                ms: e,
                mt: e,
                no: e,
                fa: o,
                pl: e,
                pt: e,
                ro: e,
                ru: e,
                sk: e,
                sl: e,
                es: e,
                sv: e,
                th: e,
                tr: e,
                uk: e,
                ur: o,
                vi: e,
                cy: e
            },
            Y = {
                "ar-sa": v,
                ar: v,
                "ar-iq": v,
                "ar-eg": v,
                "ar-ly": v,
                "ar-dz": v,
                "ar-ma": v,
                "ar-tn": v,
                "ar-om": v,
                "ar-ye": v,
                "ar-sy": v,
                "ar-jo": v,
                "ar-lb": v,
                "ar-kw": v,
                "ar-ae": v,
                "ar-bh": v,
                "ar-qa": v,
                "bg-bg": "bg",
                bg: "bg",
                "ca-es": "ca",
                ca: "ca",
                "ca-es-valencia": "ca",
                "zh-cn": jb,
                "zh-chs": jb,
                "zh-sg": jb,
                "zh-tw": eb,
                "zh-cht": eb,
                "zh-hk": eb,
                "zh-mo": eb,
                "cs-cz": "cs",
                cs: "cs",
                "da-dk": "da",
                da: "da",
                "nl-nl": "nl",
                nl: "nl",
                "nl-be": "nl",
                "en-us": g,
                en: g,
                "en-gb": g,
                "en-au": g,
                "en-ca": g,
                "en-nz": g,
                "en-ie": g,
                "en-za": g,
                "en-jm": g,
                "en-029": g,
                "en-bz": g,
                "en-tt": g,
                "en-zw": g,
                "en-ph": g,
                "en-in": g,
                "en-my": g,
                "en-sg": g,
                "et-ee": "et",
                et: "et",
                "fi-fi": "fi",
                fi: "fi",
                "fr-fr": V,
                fr: V,
                "fr-be": V,
                "fr-ca": V,
                "fr-ch": V,
                "fr-lu": V,
                "fr-mc": V,
                "de-de": Z,
                de: Z,
                "de-ch": Z,
                "de-at": Z,
                "de-lu": Z,
                "de-li": Z,
                "el-gr": "el",
                el: "el",
                "he-il": "he",
                he: "he",
                "hi-in": "hi",
                hi: "hi",
                "hu-hu": "hu",
                hu: "hu",
                "id-id": "id",
                id: "id",
                "it-it": "it",
                it: "it",
                "it-ch": "it",
                "ja-jp": "ja",
                ja: "ja",
                "ko-kr": "ko",
                ko: "ko",
                "lv-lv": "lv",
                lv: "lv",
                "lt-lt": "lt",
                lt: "lt",
                "ms-my": "ms",
                ms: "ms",
                "ms-bn": "ms",
                "mt-mt": "mt",
                mt: "mt",
                "nb-no": G,
                nb: G,
                no: G,
                "nn-no": G,
                nn: G,
                "fa-ir": "fa",
                fa: "fa",
                "pl-pl": "pl",
                pl: "pl",
                "pt-br": "pt",
                pt: "pt",
                "pt-pt": "pt",
                "ro-ro": "ro",
                ro: "ro",
                "ru-ru": "ru",
                ru: "ru",
                "sk-sk": "sk",
                sk: "sk",
                "sl-si": "sl",
                sl: "sl",
                "es-mx": r,
                es: r,
                "es-es": r,
                "es-gt": r,
                "es-cr": r,
                "es-pa": r,
                "es-do": r,
                "es-ve": r,
                "es-co": r,
                "es-pe": r,
                "es-ar": r,
                "es-ec": r,
                "es-cl": r,
                "es-uy": r,
                "es-py": r,
                "es-bo": r,
                "es-sv": r,
                "es-hn": r,
                "es-ni": r,
                "es-pr": r,
                "es-us": r,
                "sv-se": "sv",
                sv: "sv",
                "sv-fi": "sv",
                "th-th": "th",
                th: "th",
                "tr-tr": "tr",
                tr: "tr",
                "uk-ua": "uk",
                uk: "uk",
                "ur-pk": "ur",
                ur: "ur",
                "vi-vn": "vi",
                vi: "vi",
                "cy-gb": "cy",
                cy: "cy"
            };
        window[kb] = pb;
        window["languageDirs"] = hb;
        window[fb] = Y;
        var f = new function () {
            var v = "100%",
                n = D,
                m = q,
                p = h,
                l = "0",
                e = this,
                B = [66, 77, 0, 0, 0, 0, 0, 0, 0, 0, 54, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                o = [],
                w = [{
                    a: "A",
                    l: 26
                }, {
                    a: "a",
                    l: 26
                }, {
                    a: l,
                    l: 10
                }, {
                    a: "+",
                    l: 1
                }, {
                    a: u,
                    l: 1
                }];
            for (var t = 0; t < w.length; ++t)
                for (var y = 0; y < w[t].l; ++y) o.push(String.fromCharCode(w[t].a.charCodeAt(0) + y));
            e.addEvent = function (a, c, d, e) {
                var b = function () {
                    return d(a, e)
                };
                if (a.addEventListener) a.addEventListener(c, b, p);
                else if (a.attachEvent) a.attachEvent("on" + c, b);
                return b
            };
            e.removeEvent = function (a, c, b) {
                if (a.removeEventListener) a.removeEventListener(c, b, p);
                else if (a.detachEvent) a.detachEvent("on" + c, b)
            };
            var g = e.getStyleValue = function (c, a) {
                    if (c.style[a]) return c.style[a];
                    if (c.currentStyle) return !c.currentStyle[a] ? b : c.currentStyle[a];
                    if (document.defaultView && document.defaultView.getComputedStyle) {
                        a = a.replace(/([A-Z])/g, "-$1").toLowerCase();
                        var d = document.defaultView.getComputedStyle(c, b);
                        return d && d.getPropertyValue(a)
                    }
                    return b
                },
                Q = e.fixIEQuirks = function (a) {
                    if (a.tagName.toLowerCase() === I) return;
                    var e = g(a, "width");
                    if (e && e.indexOf(m) > c) a.style.width = parseInt(e) + parseInt(l + g(a, "borderLeftWidth")) + parseInt(l + g(a, "borderRightWidth")) + parseInt(l + g(a, "paddingLeft")) + parseInt(l + g(a, "paddingRight")) + m;
                    var d = g(a, "height");
                    if (d && d.indexOf(m) > c) a.style.height = parseInt(d) + parseInt(l + g(a, "borderTopWidth")) + parseInt(l + g(a, "borderBottomWidth")) + parseInt(l + g(a, "paddingTop")) + parseInt(l + g(a, "paddingBottom")) + m;
                    for (var b = 0; b < a.childNodes.length; ++b)
                        if (a.childNodes[b].nodeType === 1) Q(a.childNodes[b])
                };
            e.absXPos = function (a) {
                if (a.getBoundingClientRect) return a.getBoundingClientRect().left + (Math.max(a.ownerDocument.documentElement.scrollLeft, a.ownerDocument.body.scrollLeft) - Math.max(a.ownerDocument.documentElement.clientLeft, a.ownerDocument.documentElement.offsetLeft));
                else return C(a) + E(a)
            };

            function C(a) {
                return a.offsetLeft + (a.offsetParent && a.offsetParent.nodeType == 1 ? C(a.offsetParent) : 0)
            }

            function E(a) {
                return (a.parentNode && a.parentNode.nodeType == 1 ? E(a.parentNode) : 0) + (a.nodeName.toLowerCase() != "html" && a.nodeName.toLowerCase() != "body" && a.scrollLeft ? -a.scrollLeft : 0)
            }
            e.absYPos = function (a) {
                if (a.getBoundingClientRect) return a.getBoundingClientRect().top + (Math.max(a.ownerDocument.documentElement.scrollTop, a.ownerDocument.body.scrollTop) - Math.max(a.ownerDocument.documentElement.clientTop, a.ownerDocument.documentElement.offsetTop));
                else return G(a) + H(a)
            };

            function G(a) {
                return a.offsetTop + (a.offsetParent && a.offsetParent.nodeType == 1 ? G(a.offsetParent) : 0)
            }

            function H(a) {
                return (a.parentNode && a.parentNode.nodeType == 1 ? H(a.parentNode) : 0) + (a.nodeName.toLowerCase() != "html" && a.nodeName.toLowerCase() != "body" && a.scrollTop ? -a.scrollTop : 0)
            }
            e.getVisibleWidth = function (b) {
                var a = k;
                if (window.innerWidth && window.innerWidth > a) a = window.innerWidth;
                else if (b.documentElement.clientWidth && b.documentElement.clientWidth > a) a = b.documentElement.clientWidth;
                else if (b.body.clientWidth && b.body.clientWidth > a) a = b.body.clientWidth;
                return a
            };
            e.getVisibleHeight = function (a) {
                return P(a) ? a.body.clientHeight : a.documentElement.clientHeight
            };
            e.getStringByteCount = function (b) {
                return a.escapeNonAscii ? encodeURIComponent(b).length : encodeURIComponent(b).replace(/%\w\w/g, " ").length
            };
            var N = e.getBlockParent = function (a) {
                    var b = a._display = a._display || f.getStyleValue(a, "display"),
                        c = a._position = a._position || f.getStyleValue(a, ab);
                    return b && b.toLowerCase() == L && c.toLowerCase() == "static" && a.parentNode && a.parentNode.nodeType == 1 ? N(a.parentNode) : a
                },
                P = e.isQuirksMode = function (a) {
                    if (a.compatMode && a.compatMode.indexOf("CSS") != c) return p;
                    else return i
                },
                J = e.isInternetExplorer11OrHigher = function () {
                    var a = p;
                    if (navigator.appName == "Netscape") {
                        var c = navigator.userAgent,
                            b = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
                        if (b.exec(c) != j) {
                            rv = parseFloat(RegExp.$1);
                            if (rv >= 11) a = i
                        }
                    }
                    return a
                },
                S = e.isInternetExplorerAnyVersion = function () {
                    var a = A(),
                        b = J();
                    return a || b
                },
                A = e.isInternetExplorer = function () {
                    return window.navigator.userAgent.toUpperCase().indexOf("MSIE") > c
                };
            e.setGradient = function (a, b, c, d) {
                if (!d) d = a.offsetHeight;
                if (a._mstGradCol1 != b.toString() || a._mstGradCol2 != c.toString()) {
                    if (a._mstGradElem && a._mstGradElem.parentNode == a) a.removeChild(a._mstGradElem);
                    if (b.toString() == c.toString()) a.style.backgroundColor = "#" + b.toString();
                    else if (A() && (!document.documentMode || document.documentMode < 8)) M(a, b, c, d);
                    else {
                        a.style.backgroundRepeat = "repeat-x";
                        a.style.backgroundImage = "url('data:image/x-ms-bmp;base64," + O(K(b, c, d)) + "')"
                    }
                    a._mstGradCol1 = b.toString();
                    a._mstGradCol2 = c.toString()
                }
            };

            function M(a, b, c, f) {
                var e = ",endColorStr=#FF",
                    d = "progid:DXImageTransform.Microsoft.Gradient(startColorStr=#FF";
                a._mstGradElem = document.createElement(x);
                a._mstGradElem.style.fontSize = n;
                a._mstGradElem.style.width = v;
                a._mstGradElem.style.height = f + m;
                a._mstGradElem.style.marginBottom = "-" + a._mstGradElem.style.height;
                a.insertBefore(a._mstGradElem, a.firstChild);
                a._mstGradElem.appendChild(document.createElement(x));
                a._mstGradElem.appendChild(document.createElement(x));
                a._mstGradElem.firstChild.style.width = a._mstGradElem.lastChild.style.width = v;
                a._mstGradElem.firstChild.style.height = a._mstGradElem.lastChild.style.height = f / 2 + m;
                a._mstGradElem.firstChild.style.fontSize = a._mstGradElem.lastChild.style.fontSize = n;
                a._mstGradElem.firstChild.style.filter = d + c + e + c.interpolate(b, .5) + ")";
                a._mstGradElem.lastChild.style.filter = d + b + e + b.interpolate(c, .5) + ")"
            }

            function K(f, g, c) {
                var e = 1 * c,
                    a = [];
                for (var b = 0; b < B.length; ++b) a.push(B[b]);
                r(a, 2, 54 + e * 4);
                r(a, 18, 1);
                r(a, 22, c);
                r(a, 34, e * 4);
                for (var b = 0; b < c; ++b) {
                    var d = b < c / 2 ? f.interpolate(g, .5 - b / c) : f.interpolate(g, b / c);
                    a.push(d.b);
                    a.push(d.g);
                    a.push(d.r);
                    a.push(s)
                }
                return a
            }

            function r(a, b, c) {
                a.splice(b, 1, c & s);
                a.splice(b + 1, 1, c >>> 8 & s);
                a.splice(b + 2, 1, c >>> d & s);
                a.splice(b + 3, 1, c >>> 24 & s)
            }
            e.applyProtectiveCss = function (a) {
                var d = "content-box",
                    c = "normal",
                    b = F;
                a.style.backgroundAttachment = "scroll";
                a.style.backgroundColor = "Transparent";
                a.style.backgroundImage = b;
                a.style.color = "White";
                a.style.fontStyle = c;
                a.style.fontVariant = c;
                a.style.fontWeight = c;
                a.style.letterSpacing = c;
                a.style.lineHeight = c;
                a.style.margin = n;
                a.style.outline = b;
                a.style.overflow = z;
                a.style.padding = n;
                a.style.verticalAlign = "baseline";
                a.style.wordSpacing = c;
                a.style.fontFamily = '"Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif';
                try {
                    a.style.fontSize = "inherit"
                } catch (e) {
                    a.style.fontSize = v
                }
                a.style.textTransform = b;
                a.style.textDecoration = b;
                a.style.border = n;
                a.style.boxSizing = d;
                a.style.MozBoxSizing = d;
                a.style.float = b;
                a.style.maxWidth = b
            };

            function O(c) {
                var e = 1048576,
                    d = [];
                while (c.length) {
                    var a = [];
                    a.push(c.shift());
                    d.push(o[a[0] >> 2 & 63]);
                    a.push(c.length > 0 ? c.shift() : e);
                    a.push(c.length > 0 ? c.shift() : e);
                    d.push(o[(a[0] << 4 | a[1] >>> 4) & 63]);
                    d.push(a[1] == e ? "=" : o[(a[1] << 2 | a[2] >>> 6) & 63]);
                    d.push(a[2] == e ? "=" : o[a[2] & 63])
                }
                return d.join(b)
            }
            var R = e.clone = function (a) {
                var c = {};
                for (var b in a)
                    if (typeof a[b] === "object" && a !== j) c[b] = this.clone(a);
                    else c[b] = a[b];
                return c
            };
            e.compress = function (i) {
                var d = {},
                    g = 0,
                    h = 0,
                    a = b,
                    c, e, f = [];
                while (c = i.charAt(h++)) {
                    d[c] = c.charCodeAt(0);
                    e = a + c;
                    if (d[e]) a = e;
                    else {
                        d[e] = --g;
                        f.push(d[a]);
                        a = c
                    }
                }
                if (a) f.push(d[a]);
                return f
            };
            e.decompress = function (f) {
                var d = {},
                    e = 0,
                    g = 0,
                    c = String.fromCharCode(f[g++]),
                    a, b, h = c;
                while (a = f[g++]) {
                    if (a > 0) d[a] = String.fromCharCode(a);
                    if (d[a]) b = d[a];
                    else if (a + 1 == e) b = c + c.charAt(0);
                    else throw "Invalid input data";
                    h += b;
                    d[--e] = c + b.charAt(0);
                    c = b
                }
                return h
            };
            return e
        };

        function y(f, e, c) {
            var a = this;
            a.r = f;
            a.g = e;
            a.b = c;
            for (var b in a) a[b] = a[b] > s ? s : a[b] < 0 ? 0 : a[b];
            a.toString = function () {
                var c = "0" + this.r.toString(d),
                    b = "0" + this.g.toString(d),
                    a = "0" + this.b.toString(d);
                return (c.substr(c.length - 2) + b.substr(b.length - 2) + a.substr(a.length - 2)).toUpperCase()
            };
            a.interpolate = function (b, c) {
                var a = this;
                if (a.toString() == b.toString()) return new y(a.r, a.g, a.b);
                return new y(Math.round(a.r + c * (b.r - a.r)), Math.round(a.g + c * (b.g - a.g)), Math.round(a.b + c * (b.b - a.b)))
            };
            return a
        }
        y.parse = function (a) {
            var b = a.match(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/i);
            if (b) return new y(parseInt(b[1], 10), parseInt(b[2], 10), parseInt(b[3], 10));
            a = a.split(" ")[0];
            if (a.substr(0, 1) == "#") {
                if (a.length == 4) return new y(d * parseInt(a.substr(1, 1), d), d * parseInt(a.substr(2, 1), d), d * parseInt(a.substr(3, 1), d));
                else if (a.length == 7) return new y(parseInt(a.substr(1, 2), d), parseInt(a.substr(3, 2), d), parseInt(a.substr(5, 2), d))
            } else if (y.nameTable[a.toLowerCase()]) return y.parse(y.nameTable[a.toLowerCase()]);
            else throw "Color format not suported: " + a;
        };
        y.nameTable = {
            Black: "#000000",
            Navy: "#000080",
            DarkBlue: "#00008B",
            MediumBlue: "#0000CD",
            Blue: "#0000FF",
            DarkGreen: "#006400",
            Green: "#008000",
            Teal: "#008080",
            DarkCyan: "#008B8B",
            DeepSkyBlue: "#00BFFF",
            DarkTurquoise: "#00CED1",
            MediumSpringGreen: "#00FA9A",
            Lime: "#00FF00",
            SpringGreen: "#00FF7F",
            Aqua: "#00FFFF",
            Cyan: "#00FFFF",
            MidnightBlue: "#191970",
            DodgerBlue: "#1E90FF",
            LightSeaGreen: "#20B2AA",
            ForestGreen: "#228B22",
            SeaGreen: "#2E8B57",
            DarkSlateGray: "#2F4F4F",
            LimeGreen: "#32CD32",
            MediumSeaGreen: "#3CB371",
            Turquoise: "#40E0D0",
            RoyalBlue: "#4169E1",
            SteelBlue: "#4682B4",
            DarkSlateBlue: "#483D8B",
            MediumTurquoise: "#48D1CC",
            "Indigo ": "#4B0082",
            DarkOliveGreen: "#556B2F",
            CadetBlue: "#5F9EA0",
            CornflowerBlue: "#6495ED",
            MediumAquaMarine: "#66CDAA",
            DimGray: "#696969",
            SlateBlue: "#6A5ACD",
            OliveDrab: "#6B8E23",
            SlateGray: "#708090",
            LightSlateGray: "#778899",
            MediumSlateBlue: "#7B68EE",
            LawnGreen: "#7CFC00",
            Chartreuse: "#7FFF00",
            Aquamarine: "#7FFFD4",
            Maroon: "#800000",
            Purple: "#800080",
            Olive: "#808000",
            Gray: "#808080",
            SkyBlue: "#87CEEB",
            LightSkyBlue: "#87CEFA",
            BlueViolet: "#8A2BE2",
            DarkRed: "#8B0000",
            DarkMagenta: "#8B008B",
            SaddleBrown: "#8B4513",
            DarkSeaGreen: "#8FBC8F",
            LightGreen: "#90EE90",
            MediumPurple: "#9370D8",
            DarkViolet: "#9400D3",
            PaleGreen: "#98FB98",
            DarkOrchid: "#9932CC",
            YellowGreen: "#9ACD32",
            Sienna: "#A0522D",
            Brown: "#A52A2A",
            DarkGray: "#A9A9A9",
            LightBlue: "#ADD8E6",
            GreenYellow: "#ADFF2F",
            PaleTurquoise: "#AFEEEE",
            LightSteelBlue: "#B0C4DE",
            PowderBlue: "#B0E0E6",
            FireBrick: "#B22222",
            DarkGoldenRod: "#B8860B",
            MediumOrchid: "#BA55D3",
            RosyBrown: "#BC8F8F",
            DarkKhaki: "#BDB76B",
            Silver: "#C0C0C0",
            MediumVioletRed: "#C71585",
            "IndianRed ": "#CD5C5C",
            Peru: "#CD853F",
            Chocolate: "#D2691E",
            Tan: "#D2B48C",
            LightGrey: "#D3D3D3",
            PaleVioletRed: "#D87093",
            Thistle: "#D8BFD8",
            Orchid: "#DA70D6",
            GoldenRod: "#DAA520",
            Crimson: "#DC143C",
            Gainsboro: "#DCDCDC",
            Plum: "#DDA0DD",
            BurlyWood: "#DEB887",
            LightCyan: "#E0FFFF",
            Lavender: "#E6E6FA",
            DarkSalmon: "#E9967A",
            Violet: "#EE82EE",
            PaleGoldenRod: "#EEE8AA",
            LightCoral: "#F08080",
            Khaki: "#F0E68C",
            AliceBlue: "#F0F8FF",
            HoneyDew: "#F0FFF0",
            Azure: "#F0FFFF",
            SandyBrown: "#F4A460",
            Wheat: "#F5DEB3",
            Beige: "#F5F5DC",
            WhiteSmoke: "#F5F5F5",
            MintCream: "#F5FFFA",
            GhostWhite: "#F8F8FF",
            Salmon: "#FA8072",
            AntiqueWhite: "#FAEBD7",
            Linen: "#FAF0E6",
            LightGoldenRodYellow: "#FAFAD2",
            OldLace: "#FDF5E6",
            Red: "#FF0000",
            Fuchsia: "#FF00FF",
            Magenta: "#FF00FF",
            DeepPink: "#FF1493",
            OrangeRed: "#FF4500",
            Tomato: "#FF6347",
            HotPink: "#FF69B4",
            Coral: "#FF7F50",
            Darkorange: "#FF8C00",
            LightSalmon: "#FFA07A",
            Orange: "#FFA500",
            LightPink: "#FFB6C1",
            Pink: "#FFC0CB",
            Gold: "#FFD700",
            PeachPuff: "#FFDAB9",
            NavajoWhite: "#FFDEAD",
            Moccasin: "#FFE4B5",
            Bisque: "#FFE4C4",
            MistyRose: "#FFE4E1",
            BlanchedAlmond: "#FFEBCD",
            PapayaWhip: "#FFEFD5",
            LavenderBlush: "#FFF0F5",
            SeaShell: "#FFF5EE",
            Cornsilk: "#FFF8DC",
            LemonChiffon: "#FFFACD",
            FloralWhite: "#FFFAF0",
            Snow: "#FFFAFA",
            Yellow: "#FFFF00",
            LightYellow: "#FFFFE0",
            Ivory: "#FFFFF0",
            White: "#FFFFFF"
        };
        new function () {
            var a = {};
            for (var b in y.nameTable) a[b.toLowerCase()] = y.nameTable[b];
            y.nameTable = a
        };

        function qb(Hb, qb, tb, rb, eb, Dc, zc, J, G, Ic) {
            var fc = "Element too deep",
                I = "b",
                Ib = "LP",
                vb = C,
                x = b,
                m = j,
                Zb = "scroll",
                Yb = P,
                jb = " ",
                v = h,
                n = i,
                y = this,
                q = y,
                O = tb,
                Q = rb,
                r = qb,
                Ub = eb,
                sc = Dc,
                nb = zc,
                Ob = [],
                E, bb, mc = G ? n : v,
                kb = n,
                Bc;
            window.Microsoft.Translator.APIRequests = 0;
            window.Microsoft.Translator.APIResponses = 0;
            var Jb = !Ic && !G,
                F = 0,
                D = 9,
                W = 0,
                ec = 15,
                dc = p;
            if (navigator.userAgent && (navigator.userAgent.indexOf("Chrome") > c || navigator.userAgent.indexOf("Mobile") > c)) {
                ec /= 3;
                D /= 2;
                dc /= 3;
                W = 0; /* APPLE OVERRIDE */
            }
            nb = nb * D;
            var Nb = [],
                Pb = [],
                w = {};
            w.size = 0;
            var yb = [],
                T;
            a.requestGroup = Math.floor(Math.random() * 1e9).toString(d);
            a.from = tb;
            a.to = rb;
            if (qb.nodeType != 1) throw new Error("Invalid input type");
            if (tb == rb) {
                Mb(1);
                if (eb) eb(qb);
                return y
            }
            if (!r.innerHTML || !r.innerText && !r.textContent) {
                if (eb) eb(qb);
                return y
            }
            var pb, cb, gb = 1400,
                pc = 1600,
                oc = (r.innerText || r.textContent).replace(/\s+/g, jb),
                Db = 0,
                Qb = 0,
                xb = r.innerHTML.length,
                ic = 0,
                g = [r],
                V = [0],
                u = [{
                    o: xb,
                    p: 0
                }],
                Sb = [],
                S = [],
                kc = [],
                z = [],
                lb = [],
                Fb = v,
                fb = v,
                nc = v,
                Gb = v;
            y.text = oc;
            y.textLength = oc.length;
            y.showTooltips = n;
            y.showHighlight = n;
            y.sourceFrame = J ? n : v;
            y.detectedLanguage;
            y.transItems = [];
            var U = [],
                Bb, Eb = 0,
                sb = 0;
            if (kb && r.ownerDocument && r.ownerDocument.documentElement && r == r.ownerDocument.documentElement) {
                var tc = r.ownerDocument.getElementsByTagName(Yb)[0];
                if (tc) {
                    xb -= tc.innerHTML.length;
                    u[0].o = xb
                }
            }
            if (window.translatorOnBegin || document.translatorOnBegin) try {
                (window.translatorOnBegin || document.translatorOnBegin)()
            } catch (Bc) {}

            function Xb() {
                nc = n;
                if (Gb) {
                    Gb = v;
                    if (w.size < D)
                        if (G && J) B();
                        else setTimeout(function () {
                            B()
                        }, W)
                }
            }
            f.addEvent(r.ownerDocument.defaultView || r.ownerDocument.parentWindow, Zb, Xb);
            var Cc = y.cancel = function () {
                if (Microsoft.TranslatorOverride && Microsoft.TranslatorOverride.hideTooltip) Microsoft.TranslatorOverride.hideTooltip();
                if (!r) return;
                Fb = n;
                if (pb) pb.abort("canceled by user.");
                Rb(r);
                r = m
            };
            try {
                if (!toolbar || !toolbar.addExitEvent || !toolbar.setProgress || !toolbar.setLanguagePair) toolbar = m
            } catch (Fc) {
                toolbar = m
            }
            var Mc = y.exit = function () {
                Cc();
                if (toolbar) toolbar.hide()
            };

            function lc(a) {
                a = Math.max(a, 0);
                a = Math.min(a, p);
                for (var b = 0; b < Ob.length; ++b) Ob[b](a)
            }
            y.addProgressEvent = function (a) {
                Ob.push(a)
            };
            if (!q.sourceFrame)
                if (toolbar && toolbar.setProgress) q.addProgressEvent(toolbar.setProgress);
            y.setParallel = function (a) {
                E = a
            };
            if (toolbar) {
                toolbar.addExitEvent(y.exit);
                toolbar.setProgress(0);
                toolbar.setLanguagePair(O, Q)
            }
            var s = {
                    Inherit: 0,
                    On: 1,
                    Off: 2,
                    Skip: 3
                },
                cc = {
                    google: {
                        value: {
                            notranslate: s.Off
                        },
                        content: {
                            notranslate: s.Off
                        }
                    },
                    microsoft: {
                        value: {
                            notranslate: s.Off
                        },
                        content: {
                            notranslate: s.Off
                        }
                    }
                },
                ac = {
                    translate: {
                        "true": s.On,
                        yes: s.On,
                        "false": s.Off,
                        no: s.Off,
                        skip: s.Skip
                    }
                },
                bc = {
                    notranslate: s.Off,
                    skiptranslate: s.Skip
                };
            if (Hc(r) == s.Off) {
                if (eb) eb(qb);
                return
            }
            g.top = V.top = u.top = function () {
                return this[this.length - 1]
            };
            var vc = {
                    head: 1,
                    script: 1,
                    style: 1,
                    code: 1,
                    samp: 1,
                    "var": 1,
                    kbd: 1,
                    pre: 1,
                    input: 1,
                    object: 1,
                    address: 1,
                    textarea: 1,
                    noscript: 1
                },
                ub = {
                    hr: 1,
                    option: 1,
                    title: 1,
                    br: 1,
                    frame: 1,
                    iframe: 1
                };
            for (var Ac in vc) ub[Ac] = 1;
            delete ub["code"];
            delete ub["samp"];
            delete ub["var"];

            function Ab(b) {
                var a;
                if (hb[b] == o) a = {
                    direction: o,
                    textAlign: K
                };
                else a = {
                    direction: e,
                    textAlign: A
                };
                return a
            }
            if (!J && !G) bb = Ab(rb);

            function wc() {
                var b = [];
                for (var a = g.length - 2; a >= 0; --a)
                    if (g[a].id) {
                        b.unshift(g[a].id.toString());
                        break
                    } else b.unshift((g[a].nodeName && g[a].nodeName.toLowerCase ? g[a].nodeName.toLowerCase() : x) + "-" + V[a].toString());
                return b.join("_")
            }

            function B() {
                var b = "len";
                if (a.maxChars && a.maxChars < ic && !nc && !q.sourceFrame) {
                    if (!Gb) {
                        uc();
                        Gb = n
                    }
                    return
                }
                var e = [],
                    d = v,
                    h = m;
                if (kb && u.length) {
                    var k = 0;
                    for (var i = 0; i < u.length; ++i) k += parseInt(u[i].p);
                    lc(Math.min(99.999 * (k - Qb) / (xb - Qb), 99.999))
                }
                while (g.length > 0 && (Db < gb || e.length)) {
                    if (g.length && qc(g.top()) && Z(g.top())) {
                        g.push(g.top().contentWindow.document.documentElement);
                        V.push(0);
                        u.push({
                            o: 0,
                            p: 0
                        });
                        d = n;
                        f.addEvent(g.top().ownerDocument.defaultView || g.top().ownerDocument.parentWindow, Zb, Xb);
                        if (kb) {
                            var c = typeof g.top().length == vb ? g.top().length : g.top().getAttribute(b) || (g.top().innerHTML && g.top().innerHTML.length ? g.top().innerHTML.length : 0);
                            try {
                                if (!g.top().length && !g.top().getAttribute(b)) g.top().setAttribute(b, c)
                            } catch (j) {}
                            u[u.length - 1].o = c;
                            xb += c
                        }
                    } else if (g.length && g.top().firstChild && g.top().firstChild.parentNode == g.top() && !mb(g.top()) && Z(g.top())) {
                        g.push(g.top().firstChild);
                        V.push(0);
                        u.push({
                            o: 0,
                            p: 0
                        });
                        d = n;
                        if (kb) {
                            var c = typeof g.top().length == vb ? g.top().length : g.top().getAttribute(b) || (g.top().innerHTML && g.top().innerHTML.length ? g.top().innerHTML.length : 0);
                            try {
                                if (!g.top().length && !g.top().getAttribute(b)) g.top().setAttribute(b, c)
                            } catch (j) {}
                            u[u.length - 1].o = c
                        }
                    } else {
                        while (g.length && (!g.top().nextSibling && !g.top().nextElementSibling)) {
                            g.pop();
                            V.pop();
                            u.pop();
                            d = n
                        }
                        if (g.length > 1) {
                            if (kb && g.top().nodeName.toLowerCase() != Yb) u[u.length - 2].p += parseInt(u[u.length - 1].o);
                            g.push(g.pop().nextSibling);
                            u[u.length - 1] = {
                                o: 0,
                                p: 0
                            };
                            if (!mb(g.top())) d = n;
                            if (kb) {
                                var c = typeof g.top().length == vb ? g.top().length : g.top().getAttribute(b) || (g.top().innerHTML && g.top().innerHTML.length ? g.top().innerHTML.length : 0);
                                try {
                                    if (!g.top().length && !g.top().getAttribute(b)) g.top().setAttribute(b, c)
                                } catch (j) {}
                                u[u.length - 1].o = c
                            }
                        } else {
                            g.pop();
                            V.pop();
                            u.pop();
                            d = n
                        }
                    } if (d || g.length > 0 && !mb(g.top())) {
                        if (e.length) try {
                            Lc(e, h)
                        } catch (l) {
                            if (a.debug);
                        }
                        d = v;
                        h = m
                    }
                    if (g.length) {
                        if (g.top().clientHeight < g.top().scrollHeight) f.addEvent(g.top(), Zb, Xb);
                        if (mb(g.top())) {
                            if (!h) h = wc();
                            ++V[V.length - 1];
                            e.push(g.top())
                        }
                        if (g.top().nodeName.toLowerCase() != Yb && !Z(g.top())) Qb += parseInt(u.top().o);
                        Tb(g.top())
                    }
                }
                if (Db > 0 || yb.length > 0) xc();
                else {
                    if (w.size > 0 || yb.length > 0) return;
                    lc(p);
                    Mb(1);
                    if (Ub) Ub(r);
                    Ub = m;
                    if (Microsoft.TranslatorOverride && Microsoft.TranslatorOverride.showHighlight) Microsoft.TranslatorOverride.showHighlight(q, O, Q);
                    if (window.translatorOnComplete || document.translatorOnComplete) try {
                        (window.translatorOnComplete || document.translatorOnComplete)()
                    } catch (l) {
                        if (a.debug);
                    }
                    uc()
                }
            }

            function Tb(b) {
                var g = "adjustalign";
                try {
                    if (!b.getAttribute) return;
                    b.adjustAlign = b.getAttribute(g) && !(b.getAttribute(g).toLowerCase() == M);
                    if (b.adjustAlign == m) b.adjustAlign = b.parentNode.adjustAlign;
                    if (b.adjustAlign == undefined || b.adjustAlign == m) b.adjustAlign = n;
                    if (bb && b && b.style && Z(b) && !q.sourceFrame && a.service != Ib && b.adjustAlign)
                        for (var d in bb) try {
                            var e = f.getStyleValue(b, d);
                            if (e != bb[d]) {
                                if (d == "textAlign" && (e && e.toLowerCase().indexOf("center") != c || b.tagName && b.tagName.toLowerCase() == "center")) continue;
                                if (Jb) {
                                    if (!b._mstStyle) b._mstStyle = {};
                                    if (b.style[d]) b._mstStyle[d] = b.style[d];
                                    else b._mstStyle[d] = e
                                }
                                b.style[d] = bb[d]
                            }
                        } catch (h) {
                            console.error(h)
                        }
                } catch (i) {
                    console.error(i)
                }
            }

            function Mb(e) {
                var b = "_mssrc";
                if (!T)
                    if (r.getElementsByTagName) T = r.getElementsByTagName(t);
                    else if (r.documentElement.getElementsByTagName) T = r.documentElement.getElementsByTagName(t);
                    else if (r.ownerDocument.documentElement.getElementsByTagName) T = r.ownerDocument.documentElement.getElementsByTagName(t);
                var a;
                if (T && T.length > 0) var d = 0;
                for (var c = 0; c < T.length && d < Math.max(1, T.length * e); c++) {
                    a = T[c];
                    if (a.getAttribute(b)) {
                        a.src = a.getAttribute(b);
                        a.removeAttribute(b);
                        d++
                    }
                }
            }

            function uc() {
                if (!E || !q.sourceFrame) {
                    var b = [];
                    b.push("svc=" + encodeURIComponent(a.service));
                    b.push("loc=" + encodeURIComponent(a.locale));
                    b.push("ref=" + encodeURIComponent(a.ref));
                    b.push("from=" + encodeURIComponent(O ? O : x));
                    b.push("to=" + encodeURIComponent(Q ? Q : x));
                    b.push("dtc=" + encodeURIComponent(q.detectedLanguage ? q.detectedLanguage : x));
                    var d = lb.join(" | "),
                        e = f.getStringByteCount(d);
                    if (e > 128) d = d.substr(0, Math.round(d.length * 128 / e)) + "...";
                    b.push("text=" + ib(d ? d : x));
                    for (var c = 0; c < U.length && c < 64; ++c) b.push(c.toString() + "=" + [U[c].r, U[c].c, U[c].s, U[c].e, U[c].l].join("_"));
                    db("/sync.ashx?" + b.join("&"));
                    lb = [];
                    U = []
                }
            }

            function Z(b) {
                if (b.nodeType == 3) return n;
                if (b.nodeType != 1) return v;
                if (!b.hasChildNodes() && !qc(b)) return v;
                var c;
                try {
                    c = gc(b)
                } catch (d) {
                    if (a.debug);
                }
                if (c == s.Off || c == s.Skip) return v;
                if (vc[b.nodeName.toLowerCase()]) return v;
                if (!b.innerHTML || !Kb(b.innerHTML)) return v;
                return n
            }

            function mb(a) {
                if (a.nodeType == 3) return n;
                else if (a.nodeType != 1 || a._mstChunk || f.getStyleValue(a, "display").toLowerCase() != L || f.getStyleValue(a, ab).toLowerCase() != "static" || ub[a.nodeName.toLowerCase()]) return v;
                for (var b = 0; b < a.childNodes.length; ++b)
                    if (!mb(a.childNodes[b])) return v;
                return n
            }

            function qc(b) {
                try {
                    if (b.contentWindow && b.contentWindow.document && b.contentWindow.document.documentElement) return n
                } catch (c) {
                    if (a.debug);
                }
                return v
            }

            function gc(b) {
                var a = s.Inherit;
                if (!b.getAttribute) return a;
                for (var g in ac) {
                    var e = wb(b, g);
                    if (e != m) {
                        var i = ac[g],
                            f = i[e.toString().toLowerCase()];
                        a = f || a;
                        if (a == s.Off || a == s.Skip) return a
                    }
                }
                var d = wb(b, "class") || wb(b, "className");
                if (d != m) {
                    var h = d.toString().split(jb);
                    for (var c = 0; c < h.length; c++) {
                        var j = h[c],
                            f = bc[j.toLowerCase()];
                        a = f || a;
                        if (a == s.Off) return a
                    }
                }
                return a
            }

            function wb(c, b) {
                try {
                    return c.getAttribute(b) || c[b]
                } catch (d) {
                    if (a.debug);
                    return m
                }
            }

            function Hc(l) {
                var b = s.Inherit,
                    j = l.ownerDocument.getElementsByTagName("meta");
                for (var d = 0; d < j.length; d++) {
                    var k = j[d],
                        c = wb(k, "name");
                    if (c != m)
                        if (cc[c.toString().toLowerCase()] != m) {
                            var f = cc[c.toString().toLowerCase()];
                            for (var g in f) {
                                var a = wb(k, g);
                                if (a != m) {
                                    a = a.toString().toLowerCase();
                                    var h = f[g][a];
                                    if (h != m) {
                                        b = h || b;
                                        if (b == s.Off) return b
                                    }
                                    if (a.match(/^notranslateclasses\s/i)) {
                                        var i = a.split(/\s+/);
                                        for (var e = 1; e < i.length; e++) bc[i[e]] = s.Off
                                    }
                                }
                            }
                        }
                }
                return b
            }

            function Lc(d, e) {
                yc(d);
                var b = Wb(d);
                if (b && Z(b)) {
                    b._mstHash = Ec(e);
                    while (q[b._mstHash])++b._mstHash;
                    q[b._mstHash] = b;
                    if (mc && !q.sourceFrame)
                        if (mc && E && E[b._mstHash]) {
                            var c = X(E[b._mstHash], I),
                                g = X(b, I);
                            if (c.split(/<b\d+/g).length != g.split(/<b\d+/g).length) {
                                if (a.debug);
                                return
                            }
                        } else {
                            if (a.debug);
                            return
                        } else var c = X(b, I); if (Kb(c)) {
                        Db += f.getStringByteCount(c);
                        Sb.push(b);
                        S.push(c)
                    }
                }
            }

            function Wb(a) {
                var b = m;
                if (a.length > 0)
                    if (a.length == 1 && a[0].nodeType == 1) b = a.pop();
                    else if (a[0].parentNode && a.length == a[0].parentNode.childNodes.length) {
                        b = a.pop().parentNode;
                        while (a.length > 0) a.pop()
                    } else {
                        b = a[0].ownerDocument.createElement(N);
                        b._mstChunk = n;
                        if (a[0].parentNode) a[0].parentNode.insertBefore(b, a[0]);
                        while (a.length > 0) b.appendChild(a.shift())
                    }
                return b
            }

            function yc(a) {
                var c = n;
                while (c) {
                    c = v;
                    if (a.length == 1 && !Z(a[0])) return;
                    if (a.length == 1 && a[0].nodeType == 1 && a[0].childNodes.length > 0) {
                        var e = a.pop();
                        for (var d = 0; d < e.childNodes.length; d++) a.push(e.childNodes[d]);
                        c = n
                    }
                    if (a.length > 0)
                        if (!Vb(a[0])) {
                            var b = a.shift();
                            if (b.nodeType == 3 && !b.nodeValue) b.parentNode.removeChild(b);
                            c = n
                        } else if (!Vb(a[a.length - 1])) {
                            var b = a.pop();
                            if (b.nodeType == 3 && !b.nodeValue) b.parentNode.removeChild(b);
                            c = n
                        }
                }
                if (a.length == 1 && !Vb(a[0])) a.pop()
            }

            function Kb(a) {
                return !!(a.match(/[a-zA-Z0-9\xC0-\uFFFF]/) || G && a.replace(/[\r\n\s]/g, x).length > 0)
            }

            function Vb(a) {
                if (!mb(a)) return n;
                var b = x;
                switch (a.nodeType) {
                    case 1:
                        b = a.innerText || a.textContent || x;
                        break;
                    case 3:
                        b = a.nodeValue || x
                }
                if (b.match(/^[\s\xA0]*$/)) return v;
                if (Kb(b)) return n;
                return v
            }

            function X(b, i, e) {
                e = e ? e : 1;
                if (e > 9) throw new Error(fc);
                var d = [],
                    f = 0,
                    m = 0;
                for (var c = 0; c < b.childNodes.length; ++c) switch (b.childNodes[c].nodeType) {
                    case 1:
                        var j = i + e.toString() + f.toString();
                        try {
                            var g = gc(b.childNodes[c])
                        } catch (k) {
                            if (a.debug);
                        }
                        if (g == s.Skip && b.childNodes[c].previousSibling && b.childNodes[c].previousSibling.nodeType == 1) b.childNodes[c].previousSibling._mstSkipNext = f;
                        else if (g == s.Skip && b.childNodes[c].nextSibling && b.childNodes[c].nextSibling.nodeType == 1) b.childNodes[c].nextSibling._mstSkipPrev = f;
                        else {
                            d.push("<");
                            d.push(j);
                            d.push(l);
                            if (g != s.Skip) d.push(X(b.childNodes[c], i, e + 1));
                            d.push("</");
                            d.push(j);
                            d.push(l)
                        }++f;
                        break;
                    case 3:
                        if (b.childNodes[c].nodeValue) {
                            var h = b.childNodes[c].nodeValue.replace(/[\s\xA0]+/g, jb);
                            if (h != b.childNodes[c].nodeValue) b.replaceChild(b.ownerDocument.createTextNode(h), b.childNodes[c]);
                            d.push(Kc(h))
                        }
                }
                return d.join(x)
            }

            function Y(a, f, i, b, c, g) {
                if (!g) g = 1;
                if (g > 9) throw new Error(fc);
                var j = [];
                for (var h = 0; h < a.childNodes.length; ++h) {
                    if (a.childNodes[h].parentNode != a) a.appendChild(a.childNodes[h--]);
                    if (a.childNodes[h].nodeType == 1) j.push(a.childNodes[h])
                }
                var e = 0,
                    d = 0;
                f.replace(new RegExp("<" + i + g + "(\\d+)>(.*)<\\/" + i + g + "\\1>", "gi"), function (l, q, o, k) {
                    while (b && b[0] <= k - e) {
                        var n = a.ownerDocument.createTextNode(Cb(f.substr(e, b[0])));
                        c[c.length - 1].push(n);
                        c.push([]);
                        a.insertBefore(n, d < a.childNodes.length ? a.childNodes[d] : m);
                        ++d;
                        e += b[0];
                        b.shift()
                    }
                    if (e < k) {
                        var n = a.ownerDocument.createTextNode(Cb(f.substr(e, k - e)));
                        if (b) {
                            c[c.length - 1].push(n);
                            b[0] -= k - e
                        }
                        a.insertBefore(n, d < a.childNodes.length ? a.childNodes[d] : m);
                        ++d;
                        e = k
                    }
                    var h = j[parseInt(q)];
                    if (h != a.childNodes[d]) a.insertBefore(h, a.childNodes[d]);
                    ++d;
                    if (typeof h._mstSkipPrev == vb) {
                        var s = j[h._mstSkipPrev];
                        a.insertBefore(s, h);
                        ++d;
                        if (b) c[c.length - 1].push(s);
                        h._mstSkipPrev = x
                    }
                    if (Z(h))
                        if (b)
                            if (b[0] < l.length) {
                                c.push([]);
                                b[0] -= 4 + q.length;
                                Y(h, o, i, b, c, g + 1);
                                b[0] -= 5 + q.length
                            } else {
                                c[c.length - 1].push(h);
                                Y(h, o, i, m, m, g + 1);
                                b[0] -= l.length
                            } else Y(h, o, i, m, m, g + 1);
                    else if (b) {
                        if (b[0] < l.length) c.push([h], []);
                        else c[c.length - 1].push(h);
                        for (var p = l.length; p > b[0]; b.shift()) p -= b[0];
                        b[0] -= p
                    }
                    if (typeof h._mstSkipNext == vb) {
                        var r = j[h._mstSkipNext];
                        a.insertBefore(r, h.nextSibling);
                        ++d;
                        if (b) c[c.length - 1].push(r);
                        h._mstSkipNext = x
                    }
                    e += l.length
                });
                while (b && b[0] <= f.length - e) {
                    var k = a.ownerDocument.createTextNode(Cb(f.substr(e, b[0])));
                    c[c.length - 1].push(k);
                    c.push([]);
                    a.insertBefore(k, d < a.childNodes.length ? a.childNodes[d] : m);
                    ++d;
                    e += b[0];
                    b.shift()
                }
                if (e < f.length) {
                    var k = a.ownerDocument.createTextNode(Cb(f.substr(e, f.length - e)));
                    a.insertBefore(k, d < a.childNodes.length ? a.childNodes[d] : m);
                    ++d;
                    if (b) {
                        c[c.length - 1].push(k);
                        b[0] -= f.length - e
                    }
                }
                while (d < a.childNodes.length) a.removeChild(a.childNodes[d]);
                if (c && c[c.length - 1].length) c.push([])
            }

            function Kc(b) {
                if (a.service == Ib && Default.Globals.PhraseAlignment) return b.replace(/[\s\xA0]/g, jb);
                else return b.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/[\s\xA0]/g, jb)
            }

            function Cb(b) {
                if (a.service == Ib && Default.Globals.PhraseAlignment) return b;
                else return b.replace(/<\w+>/g, x).replace(/<\/\w+>/g, x).replace(/&gt;/gi, l).replace(/&lt;/gi, "<").replace(/&amp;/gi, "&")
            }

            function Ec(a) {
                a = a.replace(/[\s\xA0]/g, x);
                var c = 0;
                for (var b = 0; b < a.length; ++b) c += a.charCodeAt(b) * 13 * (b + 7);
                return c
            }

            function xc() {
                var h = [],
                    c = [],
                    b = 0,
                    g = f.getStringByteCount(S[0]);
                if (yb.length > 0 && !fb) {
                    fb = n;
                    var i = yb.shift();
                    z = i.txt;
                    b = i.length;
                    kc = i.dom;
                    var e = z[0],
                        d = Math.floor(e.length * gb / b);
                    z = [e.substr(0, d), e];
                    while (f.getStringByteCount(z[0]) > gb && d > k) {
                        d = Math.floor(d / 2);
                        z = [e.substr(0, d), e]
                    }
                    cb = {
                        aTxt: [],
                        aSrcSnt: [],
                        aTgtSnt: []
                    };
                    Bb = new Date;
                    Eb = z[0].length;
                    sb = 1;
                    pb = a.serviceClient.TranslateArray(BFI_APPID, [z[0]], O, Q, a.category ? {
                        Category: a.category
                    } : m, jc, zb, nb);
                    window.Microsoft.Translator.APIRequests++;
                    return
                }
                do {
                    if (S.length == 0) break;
                    if (lb.length && lb[0].length < 32 && S[0].length > 32) lb = [];
                    lb.push(S[0].replace(/<[^>]*>/g, jb).replace(/[\s\xA0]+/g, jb));
                    Db -= g;
                    b += g;
                    ic += S[0].length;
                    h.push(Sb.shift());
                    c.push(S.shift());
                    g = S.length > 0 ? f.getStringByteCount(S[0]) : 0
                } while (Sb.length > 0 && b < gb && b + g + (c.length + 1) * f.getStringByteCount('"",') <= pc);
                if (b > pc && (!E || !q.sourceFrame)) {
                    yb.push({
                        dom: h,
                        txt: c,
                        length: b
                    });
                    B()
                } else if (b > 0 && (!E || !q.sourceFrame)) {
                    Bb = new Date;
                    Eb = b;
                    sb = c.length;
                    Nb[F] = function (a) {
                        return function (b) {
                            Jc(b, a)
                        }
                    }(F);
                    Pb[F] = function (a) {
                        return function (b) {
                            zb(b, a)
                        }
                    }(F);
                    w[F] = {
                        Dom: h,
                        Txt: c
                    };
                    w.size++;
                    if (a.service == Ib) pb = a.serviceClient.TranslateArray2(BFI_APPID, c, O, Q, a.category ? {
                        Category: a.category
                    } : m, Nb[F], Pb[F], nb);
                    else pb = a.serviceClient.TranslateArray(BFI_APPID, c, O, Q, a.category ? {
                        Category: a.category
                    } : m, Nb[F], Pb[F], nb);
                    F++;
                    window.Microsoft.Translator.APIRequests++;
                    Gc();
                    if (w.size < D)
                        if (G && J) B();
                        else setTimeout(function () {
                            B()
                        }, W)
                } else if (w.size < D)
                    if (G && J) B();
                    else setTimeout(function () {
                        B()
                    }, W)
            }

            function jc(b) {
                if (Fb) return;
                if (!fb) return;
                fb = v;
                window.Microsoft.Translator.APIResponses++;
                q.detectedLanguage = b && b[0] && b[0].From ? b[0].From.toLowerCase() : q.detectedLanguage;
                var o = b[0].TranslatedText,
                    g = b[0].OriginalTextSentenceLengths,
                    h = b[0].TranslatedTextSentenceLengths,
                    j = 0,
                    l = 0;
                if (!(o && g && h)) {
                    fb = n;
                    zb(b[0].Error);
                    return
                }
                Lb(b);
                for (var d = 0; d < (z.length > 1 ? Math.max(g.length - 2, 1) : g.length); ++d) {
                    cb.aTxt.push(o.substr(l, h[d]));
                    cb.aSrcSnt.push(g[d]);
                    cb.aTgtSnt.push(h[d]);
                    j += g[d];
                    l += h[d]
                }
                if (z.length > 1)
                    if (g.length < 1) B();
                    else {
                        var c = z[1].substr(j),
                            r = f.getStringByteCount(c),
                            e = Math.floor(c.length * gb / r);
                        z = e > gb ? [c.substr(0, e), c] : [c];
                        while (f.getStringByteCount(z[0]) > gb && e > k) {
                            e = Math.floor(e / 2);
                            z = [c.substr(0, e), c]
                        }
                        if (fb) return;
                        fb = n;
                        Bb = new Date;
                        Eb = z[0].length;
                        sb = 1;
                        pb = a.serviceClient.TranslateArray(BFI_APPID, [z[0]], O, Q, m, jc, zb, nb)
                    } else {
                    var i = kc.shift(),
                        s = tb || q.detectedLanguage;
                    if (!J && !G) {
                        bb = Ab(rb);
                        Tb(i)
                    }
                    try {
                        hc(i, X(i, I), cb.aTxt.join(x), cb.aSrcSnt, cb.aTgtSnt)
                    } catch (p) {
                        if (a.debug);
                    }
                    if (w.size < D)
                        if (G && J) B();
                        else setTimeout(function () {
                            B()
                        }, W)
                }
            }

            function Jc(c, b) {
                if (Fb) return;
                window.Microsoft.Translator.APIResponses++;
                if (w[b] && c.length != w[b].Dom.length) {
                    zb("Inconsistent Data", b);
                    return
                }
                Lb(c);
                q.detectedLanguage = c && c[0] && c[0].From ? c[0].From.toLowerCase() : q.detectedLanguage;
                var i = tb || q.detectedLanguage;
                if (!J && !G) {
                    bb = Ab(rb);
                    Tb(w[b].Dom)
                }
                var e = x;
                for (var f = w[b].Dom.shift(), g = w[b].Txt.shift(), d = c.shift(); f && d; f = w[b].Dom.shift(), (g = w[b].Txt.shift(), d = c.shift())) {
                    if (d.Alignment) {
                        if (e.length != 0) e += "|";
                        e += d.Alignment
                    }
                    try {
                        hc(f, g, d.TranslatedText, d.OriginalTextSentenceLengths, d.TranslatedTextSentenceLengths)
                    } catch (h) {
                        if (a.debug);
                    }
                }
                if (e.length != 0) qb.setAttribute("mstAlign", e);
                delete w[b];
                w.size--;
                if (w.size < D)
                    if (G && J) B();
                    else setTimeout(function () {
                        B()
                    }, W)
            }

            function Gc() {
                if (F > dc) {
                    D = 1;
                    W = 500
                } else if (D > 2 && F % ec == 0) {
                    D = D - parseInt(D / 3);
                    W += 10;
                    Mb(.1)
                }
            }

            function zb(c, b) {
                if (b) {
                    delete w[b];
                    w.size--
                }
                if (Fb) return;
                if (a.debug);
                window.Microsoft.Translator.APIResponses++;
                Lb(m);
                if (sc) sc(c);
                if (w.size < D) B()
            }

            function Lb(a) {
                var e = new Date,
                    b = e.getTime() - Bb.getTime();
                if (b > 13000) b = 13000;
                var c = 0;
                if (a)
                    for (var d = 0; d < a.length; ++d) c += a[d].OriginalTextSentenceLengths.length;
                else c = sb;
                U.push({
                    r: a ? "S" : "E",
                    c: Eb,
                    s: c,
                    e: sb,
                    l: b
                })
            }
            var hc = y.translateElement = function (b, k, j, h, i) {
                b._mstSrcHtml = b.innerHTML;
                if (b.nodeName.toLowerCase() == "option") {
                    Y(b, j, I, m, m);
                    return
                }
                var d, g = b._mstHash;
                if (q.sourceFrame) d = b.cloneNode(n);
                else {
                    d = b;
                    b = d.cloneNode(n)
                }
                var l = h ? h.slice(0) : [],
                    o = i ? i.slice(0) : [],
                    e = [
                        []
                    ],
                    f = [
                        []
                    ];
                try {
                    Y(b, k, I, l, e);
                    Y(d, j, I, o, f)
                } catch (p) {
                    if (a.debug);
                }
                if (e.length > 2 && f.length > 2) {
                    b._mstSrcHtml = b.innerHTML;
                    for (var c = 0; c < e.length && c < f.length; ++c) rc(Wb(e[c]), Wb(f[c]), g * (c + 1))
                } else rc(b, d, g); if (E && E[g] && !q.sourceFrame) E.translateElement(E[g], k, j, h, i)
            };

            function rc(b, c, d) {
                if (!(b && c)) return;
                var g = b.textContent || b.innerText || x,
                    h = c.textContent || c.innerText || x;
                if (!g.match(/[a-zA-Z0-9\xC0-\uFFFF]/) && !h.match(/[a-zA-Z0-9\xC0-\uFFFF]/)) return;
                b._mstHash = c._mstHash = d;
                if (Jb) c._mstSrcHtml = b.innerHTML;
                try {
                    b.setAttribute(H, O);
                    c.setAttribute(H, Q)
                } catch (e) {
                    if (a.debug);
                }
                b._mstNormalize = function () {
                    return X(b, I)
                };
                c._mstNormalize = function () {
                    return X(c, I)
                };
                c._mstDenormalize = function (d) {
                    var c = b.cloneNode(n);
                    c._mstNormalize = function () {
                        return X(c, I)
                    };
                    try {
                        Y(c, d, I)
                    } catch (e) {
                        if (a.debug);
                    }
                    return c
                };
                try {
                    if (q.sourceFrame) {
                        q[d] = b;
                        new ob(b, c, f.getBlockParent(b), Ab(Q), q, E)
                    } else {
                        q[d] = c;
                        new ob(c, b, f.getBlockParent(c), Ab(O || q.detectedLanguage), q, E)
                    }
                } catch (i) {}
                q.transItems.push({
                    src: b,
                    tgt: c
                })
            }

            function Rb(b) {
                if (!Jb) throw new Error("Untranslate feature was turned off, please consider modifying the parameter in the constructor!");
                if (b.nodeName.toLowerCase() == "frame" || b.nodeName.toLowerCase() == R) try {
                    Rb(b.contentWindow.document.documentElement)
                } catch (c) {
                    if (a.debug);
                } else {
                    if (b._mstStyle)
                        for (var e in b._mstStyle) try {
                            b.style[e] = b._mstStyle[e]
                        } catch (c) {
                            if (a.debug);
                        }
                    b._mstStyle = m;
                    if (b._mstSrcHtml) {
                        b.innerHTML = b._mstSrcHtml;
                        if (b._mstTooltip) b._mstTooltip.detach()
                    } else
                        for (var d = 0; d < b.childNodes.length; ++d) try {
                            Rb(b.childNodes[d])
                        } catch (c) {
                            if (a.debug);
                        }
                }
            }
            if (G && J) {
                B();
                if (toolbar) toolbar.show()
            } else {
                setTimeout(B, 0);
                if (toolbar) setTimeout(toolbar.show, 10)
            }
            return y
        }
        var nb = function () {
                function a(b, a) {
                    this.Name = b;
                    this.Code = a
                }
                return a
            }(),
            tb = function () {
                function a(b, a, c) {
                    this.SignIn = b;
                    this.SignOut = a;
                    this.Help = c
                }
                return a
            }(),
            sb = function () {
                var l = "object",
                    k = C,
                    n = "onComplete",
                    e = Q,
                    g = "string",
                    a = h,
                    d = i,
                    m = kb,
                    f = j;

                function c() {
                    var c = "UserName",
                        a = this;
                    a.languageNames = [];
                    a.langLocalized = f;
                    a.appId = window._mstConfig.appId;
                    a.unTranslateDelegate = f;
                    a.Links = new tb(window._mstConfig["SignIn"] ? window._mstConfig["SignIn"] : b, window._mstConfig["SignOut"] ? window._mstConfig["SignOut"] : b, "https://go.microsoft.com/?linkid=9722454");
                    a.UserName = window._mstConfig[c] ? window._mstConfig[c] : b;
                    a.languageCodes = [];
                    for (var d in window[m]) a.languageCodes[a.languageCodes.length] = d
                }
                c.prototype.Translate = function (g, h, c, e, b, a, f) {
                    this.TranslateElement(g, h, document.documentElement, c, e, b, a, f, false)
                };
                c.prototype.TranslateElement = function (u, m, i, r, h, q, o, l, c) {
                    var s = E,
                        b = this;
                    if (typeof i === s) i = document.documentElement;
                    if (typeof c === s) c = d;
                    b.validate(u, "from", a, g);
                    b.validate(m, "to", d, g);
                    if (!b.isElement(i) && !b.isNode(i)) throw new Error("Invalid DomElement");
                    b.validate(r, "onProgress", a, e);
                    b.validate(h, "onError", a, e);
                    b.validate(q, n, a, e);
                    b.validate(o, "onRestoreOriginal", a, e);
                    b.validate(l, "timeOut", a, k, d);
                    b.validate(c, "showFloater", a, "boolean");
                    var j = a;
                    b.lastToLanguage = m;
                    if (b.domTranslator != f && b.domTranslator.cancel) b.domTranslator.cancel();
                    if (c) B.Show(m);
                    var w = function () {
                            t(p);
                            j = d;
                            try {
                                if (c) B.TranslationComplete()
                            } catch (a) {
                                console.error(a)
                            }
                            try {
                                if (q) q()
                            } catch (a) {
                                console.error(a)
                            }
                        },
                        x = function (b) {
                            try {
                                if (c) B.TranslationError(b)
                            } catch (a) {
                                console.error(a)
                            }
                            try {
                                if (h) h(b)
                            } catch (a) {
                                console.error(a)
                            }
                        },
                        t = function (b) {
                            if (j) return;
                            if (b == p) j = d;
                            try {
                                if (c) B.TranslationProgress(b)
                            } catch (a) {
                                console.error(a)
                            }
                            try {
                                if (r) r(b)
                            } catch (a) {
                                console.error(a)
                            }
                        };
                    b.domTranslator = new qb(b.appId, i, u, m, w, h, l, a, a);
                    if (b.domTranslator.addProgressEvent) b.domTranslator.addProgressEvent(t);
                    if (o) b.unTranslateDelegate = o;
                    if (h && l) {
                        var v = b.domTranslator;
                        setTimeout(function () {
                            if (!j) {
                                h("Timout expired before translation could be finished");
                                if (v.cancel) v.cancel()
                            }
                        }, l)
                    }
                };
                c.prototype.validate = function (a, c, f, b, e) {
                    var d = " should be of type ";
                    if (f) {
                        if (!a) throw new Error(c + " is required");
                        if (typeof a != b) throw new Error(c + d + b);
                    } else if (a && typeof a != b) throw new Error(c + d + b);
                    if (b == k && e && a && a < 0) throw new Error(c + " should be a positive number");
                };
                c.prototype.isNode = function (a) {
                    return typeof Node === l ? a instanceof Node : a && typeof a === l && typeof a.nodeType === k && typeof a.nodeName === g
                };
                c.prototype.isElement = function (a) {
                    return typeof HTMLElement === l ? a instanceof HTMLElement : a && typeof a === l && a !== f && a.nodeType === 1 && typeof a.nodeName === g
                };
                c.prototype.RestoreOriginal = function () {
                    var a = this;
                    if (!a.domTranslator) throw new Error("Can not RestoreOriginal before making a translation");
                    if (a.domTranslator.cancel) a.domTranslator.cancel();
                    if (a.unTranslateDelegate) try {
                        a.unTranslateDelegate(a.lastToLanguage)
                    } catch (b) {
                        console.error(b)
                    }
                };
                c.prototype.GetLanguagesForTranslate = function (c, h, i, j) {
                    var b = this;
                    b.validate(c, "locale", d, g);
                    b.validate(h, n, d, e);
                    b.validate(i, "onError", a, e);
                    b.validate(j, "timeOut", a, k, d);
                    if (b.languageNames[c] != f) {
                        try {
                            h(b.languageNames[c])
                        } catch (l) {
                            console.error(l)
                        }
                        return
                    }


                    Microsoft.Translator.Widget.GetLanguageNamesCallBack(["Arabic","Bulgarian","Catalan","Chinese Simplified","Chinese Traditional","Czech","Danish","Dutch","English","Estonian","Finnish","French","German","Greek","Haitian Creole","Hebrew","Hindi","Hmong Daw","Hungarian","Indonesian","Italian","Japanese","Klingon","Korean","Latvian","Lithuanian","Malay","Maltese","Norwegian","Persian","Polish","Portuguese","Romanian","Russian","Slovak","Slovenian","Spanish","Swedish","Thai","Turkish","Ukrainian","Urdu","Vietnamese","Welsh"], c, h, i);
                    //Microsoft.Translator.GetLanguageNames(b.appId, c, b.languageCodes, function (a) {
                    //                                      Microsoft.Translator.Widget.GetLanguageNamesCallBack(a, c, h, i)
                    //                                      }, i, j)
                };
                c.prototype.GetLanguageNamesCallBack = function (b, e, g, d) {
                    if (!b || !b[0]) {
                        if (d) d("Invalid locale " + e);
                        return
                    }
                    var c = [];
                    for (var a = 0; a < b.length; a++) c[a] = new nb(b[a], this.languageCodes[a]);
                    this.languageNames[e] = c;
                    try {
                        g(c)
                    } catch (f) {
                        console.error(f)
                    }
                };
                c.prototype.GetLanguagesForTranslateLocalized = function () {
                    var a = this;
                    if (!a.langLocalized) {
                        a.langLocalized = [];
                        for (var b in window[m]) a.langLocalized[a.langLocalized.length] = new nb(window[m][b], b)
                    }
                    return a.langLocalized
                };
                c.prototype.GetAutoDetectedLanguage = function () {
                    if (!this.domTranslator || !this.domTranslator.detectedLanguage) throw new Error("Can not return auto detected language before making a translation with 'from' parameter set to null ");
                    return this.domTranslator.detectedLanguage
                };
                return c
            }();
        m.Widget = new sb;
        var ob = new function () {
                var c = h,
                    j = c,
                    n = 600,
                    l = 430,
                    p = "#0F0F5F",
                    m = "#F0F0A0",
                    r;
                return function (r, E, s, Q, z, u) {
                    var M = "mouseout",
                        L = "mouseover",
                        C = F,
                        B = i,
                        v = this;
                    if (r._mstTooltip) try {
                        r._mstTooltip.detach()
                    } catch (ab) {}
                    r._mstTooltip = E._mstTooltip = v;
                    if (!s) s = r;
                    var w = c,
                        D = c,
                        I = r.style.color,
                        H = r.style.backgroundColor,
                        h = r.ownerDocument,
                        R = v.hover = function (d) {
                            if (j) return;
                            if (z.showHighlight) {
                                var b = r.style.color;
                                try {
                                    b = "#" + y.parse(r.style.color).toString()
                                } catch (c) {}
                                if (b != p) I = r.style.color;
                                var a = r.style.backgroundColor;
                                try {
                                    a = "#" + y.parse(r.style.backgroundColor).toString()
                                } catch (c) {}
                                if (a != m) H = r.style.backgroundColor;
                                r.style.color = p;
                                r.style.backgroundColor = m
                            }
                            if (z.showTooltips && d) {
                                w = B;
                                setTimeout(P, n)
                            }
                            if (d && u && u[r._mstHash] && u[r._mstHash]._mstTooltip) u[r._mstHash]._mstTooltip.hover()
                        },
                        Z = v.unhover = function (a) {
                            if (j) return;
                            if (z.showHighlight) {
                                r.style.color = I;
                                r.style.backgroundColor = H
                            }
                            if (z.showTooltips && a) {
                                w = c;
                                setTimeout(N, n)
                            }
                            if (a && u && u[r._mstHash] && u[r._mstHash]._mstTooltip) u[r._mstHash]._mstTooltip.unhover()
                        };

                    function P() {
                        if (j) return;
                        if (w) fb()
                    }
                    var fb = v.show = function () {
                        var gb = bb,
                            I = g,
                            eb = "none 0px",
                            db = O,
                            ab = K,
                            F = "normal",
                            fb = "0px 0px 0px 0px",
                            y = x,
                            v = o;
                        if (D) return;
                        else D = B; if (!h._mstTooltip) {
                            var lb = a.baseURL.substr(0, 8) + a.baseURL.substr(8).replace(/\/.*$/, cb),
                                Z = c;
                            if (Y[a.locale] && hb[Y[a.locale]] && hb[Y[a.locale]] == v) Z = B;
                            h._mstTooltip = h.createElement(y);
                            h._mstTooltip.translate = c;
                            h._mstTooltip.setAttribute("translate", G);
                            h._mstTooltip.style.display = C;
                            h._mstTooltip.style.position = W;
                            h._mstTooltip.style.zIndex = X;
                            h._mstTooltip.style.margin = fb;
                            h._mstTooltip.style.border = "2px solid #D2D2D2";
                            h._mstTooltip.style.padding = fb;
                            h._mstTooltip.style.color = "#000000";
                            h._mstTooltip.style.backgroundColor = "#E6E6E6";
                            h._mstTooltip.style.fontFamily = "Arial, Helvetica, Sans-Serif";
                            h._mstTooltip.style.fontStyle = F;
                            h._mstTooltip.style.fontVariant = F;
                            h._mstTooltip.style.fontWeight = F;
                            h._mstTooltip.style.fontSize = "12px";
                            h._mstTooltip.style.lineHeight = F;
                            if (!Z) {
                                h._mstTooltip.style.direction = e;
                                h._mstTooltip.style.textAlign = A
                            } else {
                                h._mstTooltip.style.direction = v;
                                h._mstTooltip.style.textAlign = ab
                            }
                            var n = h.createElement(y);
                            if (!Z) n.style.styleFloat = n.style.cssFloat = ab;
                            else n.style.styleFloat = n.style.cssFloat = A;
                            var j = h.createElement("a");
                            j.href = a.lpURL;
                            j.target = "_blank";
                            j.style.display = db;
                            j.style.margin = "4px 4px 0px 4px";
                            j.style.border = eb;
                            j.style.cursor = J;
                            j.style.textDecoration = C;
                            var V = h.createElement(t);
                            // a.imagePath is no longer valid
                            V.src = a.imagePath + "binglogo_ctf.png";
                            V.style.border = eb;
                            // Don't add the link to Bing Translator to the popover
                            // j.appendChild(V);
                            n.appendChild(j);
                            h._mstTooltip.cl = h.createElement("a");
                            h._mstTooltip.cl.style.display = db;
                            h._mstTooltip.cl.style.cursor = J;
                            h._mstTooltip.cl.style.textDecoration = C;
                            h._mstTooltip.cl.style.verticalAlign = "top";
                            h._mstTooltip.cl.style.border = eb;
                            h._mstTooltip.cl.style.padding = S;
                            var ib = h.createElement(t);
                            // a.imagePath is no longer valid
                            // ib.src = a.imagePath + "tooltip_close.gif";
                            ib.src = "http://az577702.vo.msecnd.net/images/cancel.png"
                            h._mstTooltip.cl.appendChild(ib);
                            n.appendChild(h._mstTooltip.cl);
                            h._mstTooltip.appendChild(n);
                            var m = h.createElement(y);
                            m.style.margin = "4px 4px 8px 4px";
                            m.style.fontWeight = "bold";
                            m.style.fontFamily = "Segoe UI";
                            m.style.fontSize = "10px";
                            m.style.letterSpacing = "1px";
                            m.style.textTransform = "uppercase";
                            m.style.color = "#4D4D4D";
                            if (!z.sourceFrame) {
                                var u = "Original";
                                try {
                                    u = localizedOriginal[Y[a.locale || I] || I] || u
                                } catch (M) {}
                            } else {
                                var u = "Translation";
                                try {
                                    u = localizedTranslation[Y[a.locale || I] || I] || u
                                } catch (M) {}
                            }
                            m.appendChild(h.createTextNode(u));
                            h._mstTooltip.appendChild(m);
                            h._mstTooltip.cp = h.createElement(y);
                            h._mstTooltip.appendChild(h._mstTooltip.cp);
                            h._mstTooltip.cb = h.createElement("span");
                            h._mstTooltip.cb.style.display = db;
                            h._mstTooltip.cb.style.margin = "0px 4px 4px 4px";
                            h._mstTooltip.cb.style.fontFamily = "Arial";
                            h._mstTooltip.cb.style.fontSize = "12px";
                            h._mstTooltip.cb.style.color = "black";
                            h._mstTooltip.cp.appendChild(h._mstTooltip.cb);
                            h.body.appendChild(h._mstTooltip)
                        }
                        h._mstTooltip.cl.onclick = U;
                        h._mstTooltip.style.width = b;
                        h._mstTooltip.cb.style.whiteSpace = "nowrap";
                        h._mstTooltip.cb.innerHTML = b;
                        h._mstTooltip.cb.appendChild(h.createTextNode(E.innerText || E.textContent));
                        h._mstTooltip.style.display = T;
                        for (var jb in Q) try {
                            h._mstTooltip.cp.style[jb] = Q[jb]
                        } catch (M) {
                            if (a.debug);
                        }
                        h._mstTooltip.onmouseover = function () {
                            w = B;
                            R();
                            P()
                        };
                        h._mstTooltip.onmouseout = function () {
                            w = c;
                            setTimeout(N, k)
                        };
                        var H = Math.max(f.getVisibleWidth(h), k),
                            L = window.pageXOffset || h.documentElement.scrollLeft || h.body.scrollLeft,
                            kb = Math.max(h.documentElement.scrollWidth, h.body.scrollWidth);
                        if (Microsoft.TranslatorOverride && Microsoft.TranslatorOverride.showTooltip) try {
                            Microsoft.TranslatorOverride.showTooltip(E, r, h._mstTooltip);
                            l = 430
                        } catch (M) {}
                        var p = h._mstTooltip.cb.offsetWidth + 12;
                        if (p > s.offsetWidth) p = s.offsetWidth;
                        if (p > H - d) p = H - d;
                        if (p < l) p = l;
                        h._mstTooltip.style.width = p.toString() + q;
                        h._mstTooltip.cb.style.whiteSpace = b;
                        var i;
                        if (f.getStyleValue(r, gb) == v || f.getStyleValue(r, "text-align") == ab) i = f.absXPos(r) + r.offsetWidth - h._mstTooltip.offsetWidth;
                        else i = f.absXPos(r); if (i + h._mstTooltip.offsetWidth > f.absXPos(s) + s.offsetWidth) i = f.absXPos(s) + s.offsetWidth - h._mstTooltip.offsetWidth;
                        if (i < f.absXPos(s)) i = f.absXPos(s);
                        if (f.getStyleValue(r, gb) != v) {
                            if (i + h._mstTooltip.offsetWidth > H + L - 8) i = H + L - 8 - h._mstTooltip.offsetWidth;
                            if (i < L + 8) i = L + 8
                        }
                        h._mstTooltip.style.left = i + q;
                        h._mstTooltip.style.top = Math.max(f.absYPos(r) - (h._mstTooltip.offsetHeight + 8), 8) + q
                    };

                    function N() {
                        if (j) return;
                        if (!w) U()
                    }
                    var U = v.hide = function () {
                            V(c);
                            if (!D) return;
                            else D = c; if (z.showHighlight) {
                                r.style.color = I;
                                r.style.backgroundColor = H
                            }
                            if (h._mstTooltip) h._mstTooltip.style.display = C
                        },
                        V = v.setLock = function (a) {
                            j = a
                        },
                        gb = v.detach = function () {
                            f.removeEvent(r, L, db);
                            f.removeEvent(r, M, eb)
                        },
                        db = f.addEvent(r, L, R),
                        eb = f.addEvent(r, M, Z)
                }
            },
            ub = new function (xb) {
                var Gb = 1600,
                    Vb = "white",
                    Ab = "#E6E6E6",
                    Wb = bb,
                    wb = t,
                    kb = "span",
                    eb = x,
                    w = q,
                    s = b,
                    L = j,
                    g = F,
                    v = T,
                    vb = "hidden",
                    fb = O,
                    ec = "MSTCTransPanel",
                    E = i,
                    e = h,
                    mb = this,
                    qc = 0,
                    Ub, ub, Z, Pb, lb, y, yb, Db, Hb, Rb, P, hb, Nb, Jb, Ib, Fb, Eb, gc, Cb, gb, Mb, Kb, lc, jc, Qb, nb, sb, pb, rb, ob, Sb, dc, r, qb, cb, ic, Y, bc, B, tc, m = e,
                    Zb = E,
                    rc = 1e6,
                    Q, U = 0,
                    ac, tb;
                window._mstCmCb = function () {
                    a.appId = document.getElementById("MSTCAppIdToken").innerHTML;
                    cb = parseInt(document.getElementById("MSTCMaxRating").innerHTML);
                    ic = document.getElementById("MSTCImagePath").innerHTML;
                    Y = document.getElementById("MSTCAuthLang").innerHTML.toLowerCase();
                    bc = document.getElementById("MSTCDashboardUrl").href;
                    yb = document.getElementById("MSTCContent");
                    Db = document.getElementById("MSTCExpandLink");
                    Hb = document.getElementById("MSTCRootPanel");
                    Rb = document.getElementById("MSTCLoading");
                    P = document.getElementById("MSTCSubmitting");
                    hb = document.getElementById(ec);
                    Nb = document.getElementById("MSTCPrevNextPanel");
                    Jb = document.getElementById("MSTCPrevLink");
                    Ib = document.getElementById("MSTCNextLink");
                    Fb = document.getElementById("MSTCPrevCount");
                    Eb = document.getElementById("MSTCNextCount");
                    gc = document.getElementById("MSTCFooterPanel");
                    Cb = document.getElementById("MSTCDashboardLink");
                    Qb = document.getElementById("MSTCApprove");
                    nb = document.getElementById("MSTCApproveTooltip");
                    sb = document.getElementById("MSTCReject");
                    pb = document.getElementById("MSTCRejectTooltip");
                    rb = document.getElementById("MSTCRestore");
                    ob = document.getElementById("MSTCRestoreTooltip");
                    Sb = document.getElementById("MSTCUserID");
                    dc = document.getElementById("MSTCButtonPanel");
                    gb = document.getElementById("MSTCTransPanelError");
                    Mb = document.getElementById("MSTCTransPanelErrorMsg");
                    Kb = document.getElementById("MSTCOKImgBtn");
                    lc = document.getElementById("MSTCHelpImgBtn");
                    if (Kb) Kb.onclick = Bb;
                    if (f.isInternetExplorer() && f.isQuirksMode(document)) f.fixIEQuirks(y);
                    Jb.onclick = function () {
                        Ob(-3);
                        return e
                    };
                    Ib.onclick = function () {
                        Ob(3);
                        return e
                    };
                    if (Cb)
                        if (Zb) {
                            Cb.onclick = cc;
                            var b = document.getElementById("MSTTDashboardLink");
                            if (b) {
                                b.parentNode.style.display = fb;
                                b.onclick = cc;
                                b.href = "javascript: " + b.title
                            }
                        } else Cb.style.visibility = vb;
                    if (!window.Microsoft) window.Microsoft = {};
                    window.Microsoft.TranslatorOverride = {
                        showTooltip: hc,
                        hideTooltip: ib
                    };
                    if (cb >= 5) window.Microsoft.TranslatorOverride.showHighlight = fc
                };
                var hc = mb.showTooltip = function (a, b, c) {
                        if (!y || y.ownerDocument != c.ownerDocument) return;
                        B = a._mstTooltip;
                        ub = a.getAttribute(H);
                        Z = b.getAttribute(H);
                        Pb = a;
                        lb = b;
                        m = e;
                        Db.onclick = Yb;
                        y.style.display = v;
                        Hb.style.display = g;
                        hb.style.display = g;
                        Bb();
                        c.appendChild(y)
                    },
                    Yb = mb.showTranslations = function () {
                        Db.onclick = Xb;
                        Hb.style.display = v;
                        Rb.style.display = v;
                        hb.style.display = g;
                        Bb();
                        Nb.style.display = g;
                        a.serviceClient.GetTranslations(a.appId, Pb._mstNormalize(), ub, Z, 24, a.category ? {
                            Category: a.category
                        } : L, mc, nc, n);
                        return e
                    };

                function mc(b) {
                    Rb.style.display = g;
                    hb.innerHTML = s;
                    hb.style.display = v;
                    if (b.Translations.length > 3) Nb.style.display = v;
                    var q = cb >= 5 && cb >= Math.abs(b.Translations[0].Rating) && (!Y || Y == Z.toLowerCase()),
                        k = b.Translations.length > 0 && b.Translations[0].Rating >= 5,
                        r = !b.NoEdit && b.Translations.length == 1,
                        o = b.Reject,
                        f, l = b.Translations.length;
                    for (f = 0; f < l; f++)
                        if (b.Translations[f].Rating == 5) break;
                    if (f != l) {
                        var m = b.Translations[f].TranslatedText;
                        for (var d = 0; d < b.Translations.length; d++) {
                            if (d == f) continue;
                            if (m == b.Translations[d].TranslatedText) {
                                if (d < f) f--;
                                b.Translations.splice(d, 1);
                                d--
                            }
                        }
                    }
                    var h = c,
                        j = c;
                    for (var d = 0; d < b.Translations.length; ++d) {
                        if (h == c && b.Translations[d].Rating < 5) h = d;
                        if (h != c && b.Translations[d].Rating > -5) j = d
                    }
                    if (h >= 0 && j > h)
                        for (var d = h; d < j; ++d)
                            for (var i = d + 1; i <= j; ++i)
                                if (b.Translations[d].Count < b.Translations[i].Count) {
                                    var t = b.Translations[d];
                                    b.Translations[d] = b.Translations[i];
                                    b.Translations[i] = t
                                }
                    Q = [];
                    while (b.Translations.length > 0) {
                        var n = b.Translations.shift();
                        try {
                            Q.push(new pc(n, hb, q, k, r, o))
                        } catch (p) {
                            if (a.debug);
                            continue
                        }
                        if (k) k = e
                    }
                    if (b.Hover && Q.length && Q[0].hover) Q[0].hover();
                    U = 0;
                    Ob();
                    if (document._mstTooltip && (document._mstTooltip.style.display == g || y.style.display == g)) ib();
                    return Q.slice(0)
                }

                function oc(a, b) {
                    Mb.textContent = Mb.innerText = b;
                    gb.style.width = a.offsetWidth - 20 + w;
                    gb.style.height = a.offsetHeight + w;
                    gb.style.left = a.offsetLeft + w;
                    gb.style.top = a.offsetTop + w;
                    gb.style.display = s
                }

                function Bb() {
                    gb.style.display = g
                }

                function nc() {
                    if (a.debug);
                    Xb()
                }

                function Xb() {
                    m = e;
                    B.setLock(e);
                    Db.onclick = Yb;
                    y.style.display = v;
                    Hb.style.display = g;
                    hb.style.display = g;
                    Bb();
                    return e
                }

                function Ob(b) {
                    if (m) return e;
                    if (!b) U = 0;
                    else U += b; if (U < 0) U = 0;
                    else if (U >= Q.length) U -= 3;
                    B.setLock(E);
                    for (var a = 0; a < Q.length; ++a)
                        if (a >= U && a < U + 3) Q[a].panel.style.display = v;
                        else Q[a].panel.style.display = g;
                    var d = U,
                        c = Math.max(Q.length - (U + 3), 0);
                    Fb.innerHTML = "(" + d.toString() + ")";
                    Eb.innerHTML = "(" + c.toString() + ")";
                    if (d > 0) {
                        Jb.style.color = "#59F";
                        Fb.style.display = s
                    } else {
                        Jb.style.color = "#999";
                        Fb.style.display = g
                    } if (c > 0) {
                        Ib.style.color = "#59F";
                        Eb.style.display = s
                    } else {
                        Ib.style.color = "#999";
                        Eb.style.display = g
                    }
                    setTimeout(function () {
                        B.setLock(e)
                    }, 500)
                }

                function pc(d, Bb, tb, xb, qb, R) {
                    var gb = "MSTCCancelButton",
                        db = "MSTCSubmitButton",
                        U = "MSTCReportButton",
                        bb = "MSTCSelectButton",
                        ab = "MSTCEditButton",
                        X = "4px 1px 0px 3px",
                        W = "4px 3px 0px 1px",
                        T = "ctfbadge.gif",
                        K = this,
                        b = K.panel = document.createElement(eb);
                    b.className = ec;
                    Bb.appendChild(b);
                    d.OriginalText = Pb._mstNormalize();
                    var hb = lb._mstDenormalize(d.TranslatedText),
                        k = document.createElement(eb);
                    k.className = "MSTCTransBox";
                    if (xb) k.style.color = "#009345";
                    k.appendChild(document.createTextNode(hb.innerText || hb.textContent));
                    b.appendChild(k);
                    var r = document.createElement(eb);
                    r.className = "MSTCStatsTab";
                    b.insertBefore(r, b.firstChild);
                    var A = document.createElement(eb);
                    A.className = "MSTCVoteCount";
                    r.appendChild(A);
                    if (d.Rating > 5) {
                        var G = document.createElement(kb),
                            M = document.createElement(wb);
                        M.src = a.imagePath + T;
                        M.style.margin = "4px 5px 0px 5px";
                        G.appendChild(M);
                        A.appendChild(G);
                        if (d.Rating >= 10) G.style.backgroundColor = "#F2C341";
                        else if (d.Rating >= 8) G.style.backgroundColor = "#B2B2B2";
                        else if (d.Rating >= 6) G.style.backgroundColor = "#8C7853"
                    } else if (d.Rating == 5) {
                        var mb = document.createElement(kb),
                            x = document.createElement(wb);
                        x.src = a.imagePath + "ctfmt.gif";
                        x.style.margin = "2px 2px 0px 3px";
                        mb.appendChild(x);
                        A.appendChild(mb)
                    } else if (d.Count) {
                        var Q = document.createElement(kb),
                            F = document.createElement(N);
                        F.style.display = fb;
                        F.appendChild(document.createTextNode(d.Count));
                        Q.appendChild(F);
                        var x = document.createElement(wb);
                        x.src = a.imagePath + "ctfvotes.gif";
                        Q.appendChild(x);
                        A.appendChild(Q);
                        if (f.getStyleValue(yb, Wb) == o) {
                            F.style.margin = W;
                            x.style.margin = "7px 1px 0px 3px"
                        } else {
                            F.style.margin = X;
                            x.style.margin = "3px 3px 0px 1px"
                        }
                    } else r.parentNode.removeChild(r); if (d.Flags) {
                        var H = document.createElement(eb);
                        H.className = "MSTCFlagCount";
                        H.style.marginTop = "2px";
                        r.appendChild(H);
                        var J = document.createElement(kb);
                        J.style.width = J.style.minWidth = "1px";
                        J.style.height = "19px";
                        H.appendChild(J);
                        var O = document.createElement(kb),
                            D = document.createElement(N);
                        D.style.display = fb;
                        D.appendChild(document.createTextNode(d.Flags));
                        O.appendChild(D);
                        var I = document.createElement(wb);
                        I.src = a.imagePath + "ctfflags.gif";
                        O.appendChild(I);
                        H.appendChild(O);
                        if (f.getStyleValue(yb, Wb) == o) {
                            D.style.margin = W;
                            I.style.margin = "7px 1px 0px 2px"
                        } else {
                            D.style.margin = X;
                            I.style.margin = "7px 2px 0px 1px"
                        }
                    }
                    r.style.marginTop = (b.offsetHeight - r.offsetHeight) / 2 + w;
                    var c = dc.cloneNode(E);
                    c.style.visibility = vb;
                    b.insertBefore(c, b.firstChild);
                    if (tb) {
                        var j = new V(C(c, ab)),
                            i = new V(C(c, bb), Qb.innerText || Qb.textContent, nb.innerText || nb.textContent);
                        if (d.Rating > -5) var h = new V(C(c, U), sb.innerText || sb.textContent, pb.innerText || pb.textContent);
                        else {
                            var h = new V(C(c, U), rb.innerText || rb.textContent, ob.innerText || ob.textContent);
                            k.style.color = "#A6A6A6"
                        }
                        var t = new V(C(c, db), L, nb.innerText || nb.textContent),
                            q = new V(C(c, gb));
                        i.setIcon(T);
                        t.setIcon(T)
                    } else var j = new V(C(c, ab)),
                        i = new V(C(c, bb), L, L, d.Count),
                        h = new V(C(c, U)),
                        t = new V(C(c, db)),
                        q = new V(C(c, gb));
                    var u, l, y;
                    if (!R) {
                        i.hover();
                        j.collapse();
                        h.collapse()
                    } else {
                        i.collapse();
                        j.collapse();
                        h.hover()
                    }
                    K.hover = b.onmouseover = function () {
                        if (m) return;
                        b.className = b.className + " MSTCTransPanelHover";
                        r.style.visibility = vb;
                        c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                        c.style.visibility = z
                    };
                    K.unhover = b.onmouseout = function () {
                        if (m) return;
                        b.className = b.className.replace(/\s+/g, " ").replace(/MSTCTransPanelHover/g, s);
                        r.style.visibility = z;
                        c.style.visibility = vb
                    };
                    c.onmouseover = function () {
                        if (m) return;
                        j.expand();
                        i.expand();
                        h.expand()
                    };
                    c.onmouseout = function () {
                        if (m) return;
                        if (!R) {
                            i.hover();
                            j.collapse();
                            h.collapse()
                        } else {
                            i.collapse();
                            j.collapse();
                            h.hover()
                        }
                    };
                    j.setCallback(function () {
                        if (m) return e;
                        m = E;
                        B.setLock(E);
                        if (!l) {
                            u = document.createElement(eb);
                            u.style.padding = "14px 4px 14px 4px";
                            l = document.createElement("textarea");
                            l.className = "MSTCTransEdit";
                            l.style.width = (b.offsetWidth - 116).toString() + w;
                            l.style.height = (b.offsetHeight - 38).toString() + w;
                            l.style.padding = S;
                            l.onkeypress = function (a) {
                                a = a || window.event;
                                if (a.keyCode == 13) {
                                    t.doCallback();
                                    return e
                                } else if (a.keyCode == 27) {
                                    q.doCallback();
                                    return e
                                }
                            };
                            u.appendChild(l);
                            b.appendChild(u)
                        }
                        k.style.display = g;
                        u.style.display = v;
                        j.hide();
                        i.hide();
                        h.hide();
                        t.show();
                        q.show();
                        c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                        l.value = kc(d.TranslatedText);
                        l.focus();
                        l.select();
                        return e
                    });
                    j.setHover(function () {
                        i.unhover();
                        h.unhover()
                    });
                    i.setCallback(function () {
                        if (m) return e;
                        j.hide();
                        i.hide();
                        h.hide();
                        t.hide();
                        q.show();
                        c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                        b.style.backgroundColor = Ab;
                        k.style.display = g;
                        b.appendChild(P);
                        P.style.display = v;
                        m = E;
                        B.setLock(E);
                        y = setTimeout(function () {
                            m = e;
                            ib();
                            b.removeChild(P);
                            b.style.backgroundColor = s;
                            k.style.display = v;
                            b.onmouseout();
                            j.show();
                            i.show();
                            h.show();
                            t.hide();
                            q.hide();
                            var c = cb;
                            if (Y && Y != Z.toLowerCase()) c = 2;
                            var o = Tb(),
                                f = jb(d.OriginalText),
                                g = jb(d.TranslatedText);
                            a.serviceClient.AddTranslation(a.appId, f, g, ub, Z, c, L, a.category ? a.category : L, zb(), o, function () {}, function () {}, n);
                            if (d.Callback) d.Callback(c);
                            try {
                                lb.innerHTML = lb._mstDenormalize(d.TranslatedText).innerHTML
                            } catch (l) {}
                        }, 1e3);
                        return e
                    });
                    i.setHover(function () {
                        j.unhover();
                        h.unhover()
                    });
                    h.setCallback(function () {
                        if (m) return e;
                        j.hide();
                        i.hide();
                        h.hide();
                        t.hide();
                        q.show();
                        c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                        b.style.backgroundColor = Ab;
                        k.style.display = g;
                        b.appendChild(P);
                        P.style.display = v;
                        m = E;
                        B.setLock(E);
                        y = setTimeout(function () {
                            m = e;
                            B.setLock(e);
                            b.removeChild(P);
                            k.style.display = v;
                            P.style.display = g;
                            r.style.display = g;
                            q.hide();
                            var l = zb();
                            if (cb >= 5 && (!Y || Y == Z.toLowerCase())) l = "authuser";
                            var f = cb;
                            if (Y && Y != Z.toLowerCase()) f = 2;
                            else if (d.Rating < -5) f = 0;
                            var t = Tb(),
                                o = jb(d.OriginalText),
                                p = jb(d.TranslatedText);
                            a.serviceClient.AddTranslation(a.appId, o, p, ub, Z, -f, L, a.category ? a.category : L, l, t, function () {}, function () {}, n);
                            if (d.Callback) d.Callback(f);
                            if (f > 5 || f == 0) {
                                d.Rating = -f;
                                j.show();
                                i.show();
                                h.show();
                                c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                                if (f == 0) {
                                    h.setLabel(sb.innerText || sb.textContent, pb.innerText || pb.textContent);
                                    k.style.color = s
                                } else {
                                    h.setLabel(rb.innerText || rb.textContent, ob.innerText || ob.textContent);
                                    k.style.color = "#A6A6A6"
                                }
                                b.style.backgroundColor = s
                            }
                        }, 1e3);
                        return e
                    });
                    h.setHover(function () {
                        j.unhover();
                        i.unhover()
                    });
                    t.setCallback(function () {
                        if (!l.value) return;
                        if (!l.value.replace(/\s/g, s)) return;
                        k.style.display = v;
                        u.style.display = g;
                        j.hide();
                        i.hide();
                        h.hide();
                        t.hide();
                        q.show();
                        c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                        b.style.backgroundColor = Ab;
                        k.style.display = g;
                        b.appendChild(P);
                        P.style.display = v;
                        m = E;
                        B.setLock(E);
                        y = setTimeout(function () {
                            var c = cb;
                            if (Y && Y != Z.toLowerCase()) c = 2;
                            var p = Tb(),
                                f = jb(d.OriginalText),
                                o = jb(l.value);
                            a.serviceClient.AddTranslation(a.appId, f, o, ub, Z, c, L, a.category ? a.category : L, zb(), p, function () {
                                m = e;
                                ib();
                                b.removeChild(P);
                                b.style.backgroundColor = s;
                                k.style.display = v;
                                b.onmouseout();
                                j.show();
                                i.show();
                                h.show();
                                t.hide();
                                q.hide();
                                if (d.Callback) d.Callback(c);
                                try {
                                    lb.innerHTML = lb._mstDenormalize(jb(l.value)).innerHTML
                                } catch (a) {
                                    alert("The translation could not be displayed.  Please try again later.")
                                }
                            }, function (a) {
                                q.hide();
                                if (a.indexOf("InvalidRequest_MismatchedTags") >= 0) {
                                    oc(b, "The translation could not be added. Please check that the tags are preserved and try again.");
                                    b.style.backgroundColor = s;
                                    k.style.display = s;
                                    P.style.display = g;
                                    m = e;
                                    j.doCallback()
                                } else {
                                    alert("The translation could not be added.  Please try again later.");
                                    ib()
                                }
                            }, n)
                        }, 1e3);
                        return e
                    });
                    q.setCallback(function () {
                        if (y) {
                            clearTimeout(y);
                            y = L
                        }
                        b.style.backgroundColor = s;
                        k.style.display = v;
                        if (u) u.style.display = g;
                        P.style.display = g;
                        j.show();
                        i.show();
                        h.show();
                        t.hide();
                        q.hide();
                        try {
                            b.removeChild(P)
                        } catch (a) {}
                        c.style.marginTop = (b.offsetHeight - c.offsetHeight) / 2 + w;
                        setTimeout(function () {
                            m = e;
                            B.setLock(e);
                            if (qb) ib()
                        }, p);
                        return e
                    });
                    if (!R) {
                        b.title = i.tooltip;
                        b.onclick = function () {
                            i.doCallback();
                            return e
                        }
                    } else {
                        b.title = h.tooltip;
                        b.onclick = function () {
                            h.doCallback();
                            return e
                        }
                    } if (qb) {
                        b.onmouseover();
                        j.doCallback()
                    }
                    return K
                }

                function V(z, y, w, l) {
                    var d = this,
                        a = z,
                        n = C(a, "MSTCButtonIcon"),
                        j = C(a, "MSTCVoteCountSelect"),
                        i = C(a, "MSTCButtonImg"),
                        b = C(a, "MSTCButtonLabel"),
                        x = f.getStyleValue(b, "color"),
                        p = f.getStyleValue(b, "backgroundColor"),
                        k = i.src.match(/^(.*)(\.[^\.]*)$/)[1],
                        t = f.getStyleValue(yb, Wb) == o ? "borderRightColor" : "borderLeftColor",
                        q, u, r, h = e;
                    if (y) {
                        b.innerHTML = s;
                        b.appendChild(document.createTextNode(y))
                    }
                    if (w) a.title = w;
                    if (l)
                        if (l.toString().length <= 2) j.appendChild(document.createTextNode(l));
                        else {
                            j.title = l;
                            j.appendChild(document.createTextNode(l.toString().substr(0, 1) + "x"))
                        }
                    d.tooltip = a.title;
                    b.style[t] = Vb;
                    var m = document.createElement(kb);
                    m.style.display = fb;
                    m.style.width = "1px";
                    m.style.height = "19px";
                    m.style.backgroundColor = p;
                    a.insertBefore(m, a.firstChild);
                    d.setIcon = function (a) {
                        k = i.src.match(/^(.*\/)([^\/]*)$/)[1] + a.match(/^(.*)(\.[^\.]*)$/)[1];
                        i.src = k + ".gif"
                    };
                    d.setCallback = function (b) {
                        q = a.onclick = b
                    };
                    d.doCallback = function () {
                        if (q && !h) {
                            h = E;
                            q();
                            h = e
                        }
                    };
                    d.hover = a.onmouseover = function () {
                        n.style.color = b.style.color = p;
                        n.style.backgroundColor = b.style.backgroundColor = x;
                        b.style[t] = s;
                        i.src = k + "_h.gif";
                        if (k.indexOf(I) > c) {
                            i.style.marginLeft = "-3px";
                            i.style.marginTop = "2px"
                        }
                        if (j) j.style.display = fb;
                        if (u && !h) {
                            h = E;
                            u();
                            h = e
                        }
                    };
                    d.unhover = a.onmouseout = function () {
                        n.style.color = b.style.color = x;
                        n.style.backgroundColor = b.style.backgroundColor = p;
                        b.style[t] = Vb;
                        i.src = k + ".gif";
                        if (k.indexOf(I) > c) {
                            i.style.marginLeft = D;
                            i.style.marginTop = D
                        }
                        if (j) j.style.display = g;
                        if (r && !h) {
                            h = E;
                            r();
                            h = e
                        }
                    };
                    d.setHover = function (a) {
                        u = a
                    };
                    d.setUnhover = function (a) {
                        r = a
                    };
                    d.show = function () {
                        a.style.display = v
                    };
                    d.hide = function () {
                        a.style.display = g
                    };
                    d.expand = function () {
                        b.style.display = s
                    };
                    d.collapse = function () {
                        b.style.display = g
                    };
                    d.setLabel = function (d, c) {
                        if (d) {
                            b.innerHTML = s;
                            b.appendChild(document.createTextNode(d))
                        }
                        if (c) a.title = c;
                        this.tooltip = a.title
                    }
                }
                var ib = mb.hideTooltip = function () {
                    m = e;
                    y.style.display = g;
                    if (B) B.hide();
                    if (r && r.parentNode == document.body) try {
                        document.body.removeChild(r)
                    } catch (a) {}
                };

                function C(b, g, e) {
                    if (!e) e = 0;
                    if (e > 40) return L;
                    var d;
                    for (var a = 0; a < b.childNodes.length; ++a) {
                        var f = b.childNodes[a];
                        if (f.className && f.className.indexOf(g) > c) d = b.childNodes[a];
                        else if (b.childNodes[a].nodeType == 1 && b.childNodes[a].childNodes) d = C(b.childNodes[a], g, e + 1);
                        if (d) break
                    }
                    return d
                }
                var cc = mb.showDashboard = function () {
                    var i = W;
                    ib();
                    if (B) B.setLock(E);
                    r = document.createElement(eb);
                    r.style.position = i;
                    r.style.zIndex = X;
                    r.style.width = "97%";
                    r.style.margin = "44px 8px";
                    r.style.borderRight = r.style.borderBottom = "solid 0px black";
                    r.style.backgroundColor = Vb;
                    var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || k;
                    if (h < k) h = k;
                    h -= 60;
                    var g = document.createElement(R);
                    g.style.width = "100%";
                    g.style.height = h.toString() + w;
                    g.src = 'javascript:document.write("Loading...")';
                    r.appendChild(g);
                    var b = document.createElement("a");
                    try {
                        f.applyProtectiveCss(b)
                    } catch (j) {
                        if (a.debug);
                    }
                    b.style.display = fb;
                    b.style.position = i;
                    b.style.styleFloat = K;
                    b.style.top = "4px";
                    b.style.cursor = J;
                    b.title = "Close dashboard";
                    var d = document.createElement(kb);
                    d.style.display = fb;
                    d.style.width = "28px";
                    d.style.height = "28px";
                    d.style.marginRight = "16px";
                    b.appendChild(d);
                    var c = document.createElement(wb);
                    try {
                        f.applyProtectiveCss(c)
                    } catch (j) {
                        if (a.debug);
                    }
                    c.src = a.imagePath + "ctfdashboardclose.gif";
                    c.style.display = fb;
                    c.style.marginTop = "8px";
                    c.style.marginLeft = "8px";
                    c.style.border = D;
                    d.appendChild(c);
                    b.onclick = function () {
                        if (B) B.setLock(e);
                        document.body.removeChild(r)
                    };
                    r.appendChild(b);
                    r.style.height = h.toString() + w;
                    r.style.overflow = vb;
                    r.style.textAlign = A;
                    window.scrollTo(0, 0);
                    document.body.insertBefore(r, document.body.firstChild);
                    setTimeout(function () {
                        b.style.right = "4px";
                        if (!f.isInternetExplorer()) b.style.left = (r.offsetWidth - b.offsetWidth).toString() + w;
                        var c = encodeURIComponent(location.href);
                        if (c.lenght > Gb) c = c.substr(0, Gb);
                        var d = bc + "?siteData=" + qb + "&url=" + c + "&from=" + encodeURIComponent(a.from) + "&to=" + encodeURIComponent(a.to) + "&category=" + encodeURIComponent(a.category) + "&usr=" + encodeURIComponent(zb());
                        g.src = d
                    }, 0);
                    return e
                };

                function kc(a) {
                    return a.replace(/<([a-zA-Z]*)(\d*)>/g, function (b, c, a) {
                        return "<tag" + a + l
                    }).replace(/<\/([a-zA-Z]*)(\d*)>/g, function (b, c, a) {
                        return "</tag" + a + l
                    })
                }

                function jb(a) {
                    return a.replace(/<([a-zA-Z]*)(\d*)>/g, function (b, c, a) {
                        return "<b" + a + l
                    }).replace(/<\/([a-zA-Z]*)(\d*)>/g, function (b, c, a) {
                        return "</b" + a + l
                    })
                }

                function Tb() {
                    var c = document.location.href;
                    if (document.location.href.indexOf(a.rootURL) == 0) {
                        var b = document.location.href.match(/url=([^&]+)/);
                        if (b) c = decodeURIComponent(b[1])
                    }
                    return c
                }
                var ab = 0;

                function fc(a, b, c) {
                    if (!a.transItems || !a.transItems.length) return;
                    ab = 0;
                    Lb(a, b, c)
                }

                function Lb(b, g, h) {
                    if (ab >= b.transItems.length) return;
                    var c = [],
                        e = 0;
                    for (var d = ab; d < b.transItems.length && e < Gb && d - ab < 10; ++d) {
                        var i = b.transItems[d].src._mstNormalize();
                        e += f.getStringByteCount(i);
                        c.push(i)
                    }
                    if (e >= Gb) c.pop();
                    a.serviceClient.GetTranslationsArray(a.appId, c, g, h, 3, a.category ? {
                        Category: a.category
                    } : L, function (d) {
                        for (var a = 0; a < d.length; ++a)
                            if (d[a].Translations.length > 1)
                                if (d[a].Translations[0].Rating > 5) b.transItems[ab + a].tgt.style.backgroundColor = Ab;
                                else if (d[a].Translations[1].Count < 0) b.transItems[ab + a].tgt.style.backgroundColor = "#E5917F";
                                else b.transItems[ab + a].tgt.style.backgroundColor = "#B9E4FC";
                        ab += c.length;
                        Lb(b, g, h)
                    }, function () {
                        ab += c.length > 1 ? c.length : 1;
                        Lb(b, g, h)
                    }, n)
                }
                var sc = mb.forceLoad = function () {
                    if (tb) tb()
                };

                function zb() {
                    var a = Sb.innerText || Sb.textContent;
                    if (!a) {
                        var b = document.cookie.match(/mstcid=([^;]+)/i);
                        if (b) a = b[1];
                        else {
                            a = Math.floor(Math.random() * 1e9).toString(d);
                            document.cookie = "mstcid=" + a + "; expires=Sun, 01-Jan-2040 01:01:01 GMT; path=" + ((location.host.indexOf("bing") > c && location.pathname.indexOf("/translator")) > c ? location.pathname : u)
                        }
                    }
                    return a
                }
                new function () {
                    var b, c;
                    b = xb.match(/siteData=([^&]*)/);
                    if (b) qb = b[1];
                    Ub = a.locale;
                    b = xb.match(/loc=([^&]+)/);
                    if (b) Ub = b[1];
                    b = xb.match(/ctfLanguages=([^&]*)/);
                    if (b) c = b[1];
                    b = xb.match(/showDashboard=([^&]*)/);
                    if (b && (b[1].toLowerCase() == M || b[1].toLowerCase() == G)) Zb = e;
                    if (c) {
                        ac = {};
                        var h = c.split(",");
                        for (var d = 0; d < h.length; ++d) ac[h[d].toLowerCase()] = 1
                    }
                    if (qb) tb = function () {
                        var b = "MicrosoftTranslatorCommunity";
                        if (!tb) return;
                        tb = L;
                        y = document.getElementById(b);
                        if (y) y.parentNode.removeChild(y);
                        y = document.createElement(eb);
                        y.id = b;
                        y.style.display = g;
                        document.body.insertBefore(y, document.body.firstChild);
                        var c = s;
                        if (f.isInternetExplorer() && f.isQuirksMode(document)) c = "&inrt=1";
                        jc = db("/ajax/v3/community.aspx?fmt=js&loc=" + Ub + c + "&siteData=" + qb, a.rootURL)
                    };
                    if (a.tokRef) {
                        window._mstRefTok = function (b) {
                            a.appId = b
                        };
                        setInterval(function () {
                            if (_eTokenScript) _eTokenScript.parentNode.removeChild(_eTokenScript);
                            _eTokenScript = db("/ajax/v3/community.aspx?reftok=1&siteData=" + qb, a.rootURL)
                        }, a.tokRef * 1e3)
                    }
                };
                a.serviceClient.Community = mb
            }(a.baseURL),
            B;
        (function (l) {
            var eb = "dragging",
                cb = "__mstto=",
                u = "value",
                B = "{0}",
                Y = "style",
                f = "LanguageMenu",
                t = T,
                bb = "title",
                o = F,
                Z = U,
                ab = "href",
                m = i,
                d = h,
                x = j,
                v = {},
                N, e, s = x,
                w = x,
                D = d,
                H, k, J, V, S, R, r, W, X, nb = d,
                lb = m,
                C = d,
                G = m,
                kb = d,
                mb = d,
                Q;

            function vb(u, i, e) {
                var g = "_bwmid",
                    p = "Microsoft.Translator.OnMouseOverFloater()",
                    n = "onmouseover",
                    a = "SignOutSpan",
                    f = "SignInSpan",
                    l = E;
                if (typeof i === l) i = "true";
                if (typeof e === l) e = b;
                H = Util.GetElement("WidgetFloater");
                k = Util.GetElement(gb);
                J = Util.GetElement("WidgetFloaterCollapsed");
                V = Util.GetElement("FloaterSharePanel");
                S = Util.GetElement("FloaterEmbed");
                R = Util.GetElement("FloaterProgressBar");
                Q = e == b;
                s = e;
                //var h = document.createElement("link");
                //h.setAttribute(ab, window[Z].floaterStylePath);
                //h.setAttribute("rel", "stylesheet");
                var q = document.getElementsByTagName(P)[0];
                //q.insertBefore(h, q.firstChild);
                Util.GetElement("HelpLink").setAttribute(ab, Microsoft.Translator.Widget.Links.Help);
                if (Util.GetElement("CTFAuthPanel")) {
                    Util.GetElement(f).style.display = o;
                    Util.GetElement(a).style.display = o;
                    if (Microsoft.Translator.Widget.Links.SignIn) {
                        Util.GetElement(f).innerHTML = Microsoft.Translator.Widget.Links.SignIn;
                        Util.GetElement(f).style.display = L
                    } else if (Microsoft.Translator.Widget.Links.SignOut) {
                        Util.GetElement(a).style.display = O;
                        Util.GetElement("UsernameLink").innerHTML = Microsoft.Translator.Widget.UserName;
                        Util.GetElement(a).innerHTML += "<span> | </span>" + Microsoft.Translator.Widget.Links.SignOut;
                        var c = Util.GetElement(a).children[Util.GetElement(a).children.length - 1];
                        if (c.innerText) c.setAttribute(bb, c.innerText);
                        else c.setAttribute(bb, c.textContent)
                    }
                }
                k.onmousedown = ub;
                H.setAttribute(n, p);
                H.setAttribute("onmouseout", "Microsoft.Translator.OnMouseOutFloater()");
                J.setAttribute(n, p);
                N = u;
                Microsoft.Translator.Widget.GetLanguagesForTranslate(u, ib, hb);
                var r = k.getElementsByTagName("input");
                for (var j = 0; j < r.length; j++) {
                    var t = r[j];
                    if (t.getAttribute("type").toLowerCase() == "text") t.setAttribute("onclick", "this.select()")
                }
                if (i.toLowerCase() == M) lb = d;
                kb = m;
                if (window[g]) window[g] += ",translator";
                else window[g] = "translator";
                //db("widget/metrics.js", (document.location.protocol == "https:" ? "https://ssl" : "http://www") + ".bing.com/")
            }
            l.Initialize = vb;

            function jb() {
                k.style.display = t
            }

            function A(g) {
                if (!kb) {
                    setTimeout(function () {
                        A(g)
                    }, 50);
                    return
                }
                var d;
                if (!mb)
                    if (d = document.getElementById("WidgetLauncher")) {
                        var c = d.getBoundingClientRect();
                        if (window["Util"].IsElementInViewport(d))
                            if (c.left == 0 && c.top == 0) setTimeout(function () {
                                c = d.getBoundingClientRect();
                                I(c.left, c.top)
                            }, 200);
                            else I(c.left, c.top);
                        else I(50, 50)
                    } else if (!d) I(50, 50);
                mb = m;
                y();
                jb();
                H.style.display = t;
                e = window[fb][g.toLowerCase()];
                if (!e) e = g;
                var h = setInterval(function () {
                    if (window[f]) {
                        window[f].onChanged = tb;
                        try {
                            try {
                                window[f].setValue(e)
                            } catch (a) {
                                console.error(a)
                            }
                            r = Util.GetElement("OriginalLanguageSpan");
                            if (s == b) r.parentNode[Y].display = o;
                            else {
                                r.parentNode[Y].display = t;
                                if (Q) r.innerHTML = window[Z].autoDetected.replace(B, v[s]);
                                else r.innerHTML = v[s]
                            }
                        } catch (a) {
                            console.warn(a)
                        }
                        clearInterval(h)
                    }
                }, 1);
                G = m;
                if (w) clearTimeout(w);
                if (!C) {
                    D = m;
                    K()
                }
                if (!nb && lb) {
                    a.serviceClient.Community.forceLoad();
                    nb = m
                }
            }
            l.Show = A;

            function ob() {
                k.style.display = o
            }

            function y() {
                H.style.display = o;
                V.style.display = o;
                J.style.display = o;
                S.style.display = o;
                G = d;
                clearTimeout(w)
            }

            function I(a, b) {
                k.style.top = b + q;
                k.style.left = a + q
            }

            function Bb() {
                pb();
                D = m;
                K()
            }
            l.TranslationComplete = Bb;

            function Cb(g) {
                if (g >= 0 && g < p) {
                    D = d;
                    clearTimeout(w);
                    qb();
                    rb(g)
                }
                var e = x;
                try {
                    e = Microsoft.Translator.Widget.GetAutoDetectedLanguage()
                } catch (l) {}
                if (e && window[f] && window[f].getValue) {
                    s = e;
                    r.parentNode[Y].display = t;
                    if (Q) r.innerHTML = window[Z].autoDetected.replace(B, v[s]);
                    else r.innerHTML = v[s];
                    var k = v[e],
                        h = v[window[f].getValue()],
                        i = location.href.substr(0, location.href.length - (location.hash || b).length),
                        j = document.location.search.length == 0 ? "?" : "&",
                        a = Util.GetElement("EmailSubject").getAttribute(u);
                    a = a.replace(B, h);
                    a = a.replace("{1}", k);
                    var c = Util.GetElement("EmailBody").getAttribute(u);
                    c = c.replace(B, encodeURIComponent(i + j + cb + window[f].getValue()));
                    c = c.replace("{1}", encodeURIComponent(i));
                    Util.GetElement("EmailLink").setAttribute(ab, "mailto:?charset=utf-8&subject=" + a + "&body=" + c);
                    Util.GetElement("ShareHelpLink").setAttribute(bb, Util.GetElement("ShareHelpText").getAttribute(u).replace(B, h));
                    window["Util"].SetCookie("mstto", window[f].getValue(), d)
                }
            }
            l.TranslationProgress = Cb;

            function Hb(a) {
                console.log(a)
            }
            l.TranslationError = Hb;

            function yb() {
                Microsoft.Translator.Widget.RestoreOriginal();
                ob()
            }
            l.OnClose = yb;

            function Gb() {
                y();
                A(e)
            }
            l.OnShareBackClick = Gb;

            function Fb() {
                y();
                A(e)
            }
            l.OnEmbedBackClick = Fb;

            function Db() {
                clearTimeout(w);
                C = m;
                A(e)
            }
            l.OnMouseOverFloater = Db;

            function Eb() {
                C = d;
                if (G) K()
            }
            l.OnMouseOutFloater = Eb;

            function K() {
                if (D && !C && G) w = setTimeout(function () {
                    Ab()
                }, n)
            }

            function sb() {
                var d = "ShareTextbox";
                y();
                jb();
                var a = location.href.substr(0, location.href.length - (location.hash || b).length);
                if (location.search.length == 0) Util.GetElement(d).setAttribute(u, a + "?__mstto=" + e);
                else if (location.search.indexOf("__mstto") != c) {
                    if (a.match(/__mstto=(.+)([&]+)/i)) Util.GetElement(d).setAttribute(u, a.replace(/__mstto=(.+)([&&]+)/i, cb + e + "&"));
                    else if (a.match(/__mstto=(.+)/i)) Util.GetElement(d).setAttribute(u, a.replace(/__mstto=(.+)/i, cb + e))
                } else Util.GetElement(d).setAttribute(u, a + "&amp;__mstto=" + e);
                V.style.display = t
            }
            l.ShowSharePanel = sb;

            function xb() {
                y();
                S.style.display = t
            }
            l.ShowEmbed = xb;

            function Ab() {
                if (D && !C && G) {
                    y();
                    J.style.display = t
                }
            }

            function ib(b) {
                for (var a = 0; a < b.length; a++) v[b[a].Code] = b[a].Name
            }

            function hb() {
                if (N != g) {
                    N = g;
                    Microsoft.Translator.Widget.GetLanguagesForTranslate(g, ib, hb)
                }
            }

            function rb(a) {
                Util.GetElement("ProgressFill").style.width = a + "%"
            }

            function pb() {
                R.style.visibility = "hidden"
            }

            function qb() {
                R.style.visibility = z
            }

            function tb() {
                if (e.toLowerCase() != window[f].getValue().toLowerCase()) {
                    clearTimeout(w);
                    Microsoft.Translator.Widget.Translate(s, window[f].getValue());
                    e = window[f].getValue();
                    window[f].elemHeader.focus()
                }
            }

            function ub(a) {
                a = a || event;
                W = a.clientX;
                X = a.clientY;
                document.onmousemove = zb;
                document.onmouseup = wb;
                document.body.focus();
                document.onselectstart = function () {
                    return d
                };
                k.ondragstart = function () {
                    return d
                };
                Util.addClass(k, eb);
                return d
            }

            function zb(a) {
                a = a || event;
                var b = Util.getPosition(k),
                    c = a.clientX - W,
                    e = a.clientY - X;
                I(parseInt(b.left) + c, parseInt(b.top) + e);
                W = a.clientX;
                X = a.clientY;
                return d
            }

            function wb(a) {
                a = a || event;
                document.onmousemove = x;
                document.onselectstart = x;
                k.ondragstart = x;
                Util.removeClass(k, eb);
                return d
            }
        })(B || (B = {}));
        m.FloaterInitialize = function (b, a, c) {
            B.Initialize(b, a, c)
        };
        m.FloaterShowSharePanel = function () {
            B.ShowSharePanel()
        };
        m.FloaterShowEmbed = function () {
            B.ShowEmbed()
        };
        m.FloaterOnClose = function () {
            B.OnClose();
            return h
        };
        m.FloaterOnShareBackClick = function () {
            B.OnShareBackClick()
        };
        m.FloaterOnEmbedBackClick = function () {
            B.OnEmbedBackClick()
        };
        m.OnMouseOverFloater = function () {
            B.OnMouseOverFloater();
            return h
        };
        m.OnMouseOutFloater = function () {
            B.OnMouseOutFloater();
            return h
        };
        var lb = document.getElementById(gb);
        if (lb != j) lb.parentNode.removeChild(lb)
    };

    function CUtil() {
        var d = "character",
            b = null,
            c = -1,
            a = this,
            e = navigator.userAgent.toLowerCase();
        a.MSIE = e.indexOf("msie") != c && e.indexOf("opera") == c;
        a.MSIE6 = a.MSIE && e.indexOf("msie 6.") != c;
        a.MSIE7 = a.MSIE && e.indexOf("msie 7.") != c;
        a.FIREFOX = e.indexOf("firefox") != c;
        a.SAFARI = e.indexOf("applewebkit") != c;
        a.GetPath = function () {
            var a = "/";
            if (location.pathname) {
                a = location.pathname.match(/\/\w*/i);
                if (a) a = a[0]
            }
            return a
        };
        a.AddFavorites = function () {
            var a = document.title,
                b = window.location.href;
            if (this.FIREFOX) window.sidebar.addPanel(a, b, "");
            else window.external.AddFavorite(b, a)
        };
        a.SetCookie = function (c, b, d, a) {
            if (!a) a = "/";
            document.cookie = c + "=" + b + (d ? "; expires=Sun, 01-Jan-2040 01:01:01 GMT" : "") + "; path=" + a
        };
        a.DeleteCookie = function (b, a) {
            if (!a) a = "/";
            document.cookie = b + "=;Thu, 01 Jan 1970 00:00:01 GMT; path=" + a
        };
        a.GetCookie = function (d) {
            var c = "document.cookie.match(/",
                a = eval(c + d + "s*=([^;]*)(;|$)/);");
            if (a != b) return a[1];
            else {
                a = eval(c + d + "s*([^;]*)(;|$)/);");
                if (a != b) return a[1];
                else return b
            }
        };
        a.AddEvent = function (a, b, c) {
            if (a.addEventListener) a.addEventListener(b, c, false);
            else if (a.attachEvent) a.attachEvent("on" + b, c)
        };
        a.AbsXPos = function (a) {
            return a.offsetLeft + (a.offsetParent != b ? this.AbsXPos(a.offsetParent) : 0)
        };
        a.AbsYPos = function (a) {
            return a.offsetTop + (a.offsetParent != b ? this.AbsYPos(a.offsetParent) : 0)
        };
        a.SetDDLByVal = function (c, b) {
            for (var a = 0; a < b.options.length; a++)
                if (b.options[a].value == c) {
                    b.options[a].selected = true;
                    return
                }
        };
        a.GetElement = function (a) {
            if (arguments.length <= 0) return b;
            if (document.getElementById) return document.getElementById(a);
            else if (document.all) return document.all(a);
            else if (document.layers) return window.document.layers[a];
            else return b
        };
        a.GetStyleObject = function (a) {
            if (document.getElementById && document.getElementById(a)) return document.getElementById(a).style;
            else if (document.all && document.all(a)) return document.all(a).style;
            else if (document.layers && document.layers[a]) return document.layers[a];
            else return false
        };
        a.GetStyleValue = function (e, c) {
            var a = document.getElementById(e) || document.body,
                d;
            if (a.currentStyle) d = a.currentStyle[c] || a.currentStyle.getAttribute(c.replace("-"));
            else if (window.getComputedStyle) d = document.defaultView.getComputedStyle(a, b).getPropertyValue(c);
            return d
        };
        a.GetScrollBounds = function (a) {
            if (a == b) return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            var e, f, d, c;
            if (a.documentElement != b && a.documentElement.scrollTop != b && a.documentElement.scrollTop >= a.body.scrollTop) {
                e = a.documentElement.scrollLeft;
                f = a.documentElement.scrollTop;
                d = a.documentElement.scrollWidth;
                c = a.documentElement.scrollHeight
            } else {
                e = a.body.scrollLeft;
                f = a.body.scrollTop;
                d = a.body.scrollWidth;
                c = a.body.scrollHeight
            }
            return {
                x: e,
                y: f,
                width: d,
                height: c
            }
        };
        a.getLanguageDirStyle = function (b) {
            var a;
            if (Microsoft.Translator.languageDirs[b] == "rtl") a = {
                direction: "rtl",
                textAlign: "right"
            };
            else a = {
                direction: "ltr",
                textAlign: "left"
            };
            return a
        };
        a.setScrollValue = function (a, b, e, f, c) {
            var d = a.ownerDocument.defaultView ? a.ownerDocument.defaultView : a.ownerDocument.parentWindow;
            if (d.scrollBy) d.scrollBy(e, f);
            else {
                a["scroll" + c] = b;
                a.ownerDocument.body["scroll" + c] = b
            }
        };
        a.GetUrlParameter = function (e, a) {
            a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var d = "[\\?&]" + a + "=([^&#]*)",
                f = new RegExp(d, "i"),
                c = f.exec(e);
            if (c == b) return b;
            else return c[1]
        };

        a.GetDocumentUrl = function (d) {
            var e = "/bv.aspx",
                b = "a=",
                a = "";
            if (d.location.hash.length > 1) a = d.location.hash.substring(1);
            else if (d.location.search.indexOf(b) > 0) a = decodeURIComponent(d.location.search.substring(d.location.search.indexOf(b) + 2));
            while (a && a.toLowerCase().indexOf(e) >= 0 && a.toLowerCase().indexOf(b) >= 0) a = decodeURIComponent(a.substring(a.toLowerCase().indexOf(b) + 2));
            if (a.length > 0) {
                a = a.replace(/^\s*/, "").replace(/\s*$/, "");
                if (a.indexOf("?") == c) a = a.replace("&", "?")
            }
            if (a && a.indexOf("://") == c) a = "http://" + a;
            if (a && a.toLowerCase().indexOf(e) >= 0) a = "";
            return a
        };
        a.SendPostRequest = function (f, c, e) {
            var a = document.createElement("form");
            a.action = f;
            a.method = "post";
            a.target = e;
            for (var d in c)
                if (c.hasOwnProperty(d)) {
                    var b = document.createElement("input");
                    b.name = d;
                    b.value = c[d];
                    b.type = "hidden";
                    a.appendChild(b)
                }
            document.body.appendChild(a);
            a.submit();
            document.body.removeChild(a)
        };
        a.Log = function (b, a) {
            Microsoft.Translator.LoadScript("/sync.ashx?svc=" + b + "&" + a.join("&"))
        };
        a.GetCaretPosition = function (a) {
            var f = 0;
            if (a.selectionStart || a.selectionStart == "0") f = a.selectionStart;
            else if (document.selection) {
                var h = document.selection.createRange(),
                    i = 0,
                    j = 0;
                if (h && h.parentElement() == a) {
                    var e = a.value.length,
                        k = a.value.replace(/\r\n/g, "\n"),
                        b = a.createTextRange();
                    b.moveToBookmark(h.getBookmark());
                    var g = a.createTextRange();
                    g.collapse(false);
                    if (b.compareEndPoints("StartToEnd", g) > c) i = j = e;
                    else {
                        i = -b.moveStart(d, -e);
                        if (b.compareEndPoints("EndToEnd", g) > c) j = e;
                        else j = -b.moveEnd(d, -e)
                    }
                }
                f = i
            }
            return f
        };
        a.SetSelectionRange = function (a, c, e) {
            if (a.setSelectionRange) {
                a.focus();
                a.setSelectionRange(c, e)
            } else if (a.createTextRange) {
                var b = a.createTextRange();
                b.collapse(true);
                b.moveEnd(d, e);
                b.moveStart(d, c);
                b.select()
            }
        };
        a.SetCaretToPosition = function (b, a) {
            this.SetSelectionRange(b, a, a)
        };
        a.addClass = function (d, c) {
            var b = d.className.split(" ");
            for (var a = 0; a < b.length; a++)
                if (c == b[a]) return;
            d.className += " " + c
        };
        a.removeClass = function (c, d) {
            var b = c.className.split(" ");
            c.className = "";
            for (var a = 0; a < b.length; a++)
                if (d != b[a]) {
                    c.className += b[a];
                    if (a == b.length - 1) c.className += " "
                }
        };
        a.getPosition = function (a) {
            var b = 0,
                c = 0;
            while (a && !isNaN(a.offsetLeft) && !isNaN(a.offsetTop)) {
                b += a.offsetLeft - a.scrollLeft;
                c += a.offsetTop - a.scrollTop;
                a = a.offsetParent
            }
            return {
                top: c,
                left: b
            }
        };
        a.IsElementInViewport = function (b) {
            var a = b.getBoundingClientRect();
            return a.top >= 0 && a.left >= 0 && a.bottom <= (window.innerHeight || document.documentElement.clientHeight) && a.right <= (window.innerWidth || document.documentElement.clientWidth)
        };
        return a
    }
    var Util = new CUtil;
    var MtPopUpList = function () {
        var a = this;
        a.onChanged = null;
        a.shiftKeyDown = false;
        a.MRUL = [];
        a.MAX_MRUL = 2
    };
    MtPopUpList.prototype = {
        keysBuffer: "",
        Init: function (d, c, i, g, h) {
            var a = this;
            a.Items = [];
            a.Keys = [];
            a.KeyMap = " " + c.join(" ") + " ";
            a.keysBuffer = "";
            var f = 0;
            for (var b = 0; b < c.length; b++) {
                a.Items[c[b]] = i[b];
                if (c[b] != "-") {
                    a.Keys[f] = c[b];
                    f++
                }
            }
            a.onChanged = g;
            document.onclick = a.HideCurrentPopup;
            a.elemHeader = Util.GetElement("__" + d + "_header");
            a.elemSvID = Util.GetElement(d + "_svid");
            a.elemTextId = Util.GetElement(d + "_textid");
            a.elemPopup = document.getElementById(h);
            a.cropText();
            if (a.elemPopup != null) {
                a.elemPopup.onkeydown = (new a.doKeyDown(a, a.HideCurrentPopup)).execute;
                a.elemPopup.onkeyup = (new a.doKeyUp(a)).execute;
                a.elemPopup.onkeypress = (new a.doKeyPress(a)).execute
            }
            a.name = d;
            a.mrul_cookie = d + "_lpmru";
            var e = Util.GetCookie(a.mrul_cookie);
            if (e != null && e != "undefined") a.MRUL = e.split(",");
            else a.MRUL = []
        },
        getLinks: function () {
            return this.elemPopup.getElementsByTagName("a")
        },
        getActiveLink: function () {
            var a = this.getLinks(),
                c = this.elemSvID.value;
            if (c != null)
                for (var b = 0; b < a.length; b++)
                    if (a[b].href.indexOf("#" + c) != -1) return a[b];
            return a[0]
        },
        getByLetter: function (i, h, e) {
            var d = this,
                g = String.fromCharCode(h).toUpperCase(),
                f = d.getActiveLink(),
                a = [],
                b;
            for (b = 0; b < e.length; b++) a[b] = e[b];
            a.sort(function (c, d) {
                var a = c.innerText || c.textContent,
                    b = d.innerText || d.textContent;
                if (a < b) return -1;
                if (a > b) return 1;
                return 0
            });
            var c = 0;
            for (; c < a.length; c++)
                if (f == a[c]) {
                    c++;
                    break
                }
            for (; c < a.length; c++)
                if (d.getFirstChar(a[c]) == g) return d.getHref(a[c]);
            for (b = 0; b < a.length; b++)
                if (d.getFirstChar(a[b]) == g && f != a[b]) return d.getHref(a[b]);
            return null
        },
        getFirstChar: function (b) {
            var a = b.innerText || b.textContent;
            if (a != undefined && a != null && a.length > 0) return a.substr(0, 1).toUpperCase();
            else return ""
        },
        getNextKey: function (e, d) {
            var b = this,
                a = 0;
            for (var c = 0; c < b.Keys.length; c++)
                if (b.Keys[c] == e) {
                    a = c;
                    break
                }
            a = a + d;
            if (a > b.Keys.length) a = 0;
            else if (a < 0) a = b.Keys.length - 1;
            return b.Keys[a]
        },
        getNextSibling: function (g, f) {
            var e = this.getActiveLink(),
                c = e.parentNode;
            while (c.tagName.toLowerCase() != "tr" && c.parentNode != null) c = c.parentNode;
            var b = c.getElementsByTagName("a"),
                a = 0;
            for (var d = 0; d < b.length; d++)
                if (e.href == b[d].href) {
                    a = d;
                    break
                }
            a = a + f;
            if (a < 0) a = 0;
            else if (a >= b.length) a = b.length - 1;
            return this.getHref(b[a])
        },
        doKeyUp: function (a) {
            this.execute = function (b) {
                if (!b) b = window.event;
                if (b.keyCode == 16) {
                    a.shiftKeyDown = false;
                    if (b.preventDefault) b.preventDefault();
                    else b.returnValue = false;
                    b.cancelBubble = true;
                    return true
                } else return false
            }
        },
        doKeyPress: function (a) {
            this.execute = function (b) {
                if (!b) b = window.event;
                a.keysBuffer += String.fromCharCode(b.charCode || b.keyCode).toLowerCase();
                clearTimeout(a.keyTimeOut);
                a.keyTimeOut = setTimeout(function () {
                    a.keysBuffer = ""
                }, 1e3)
            }
        },
        doKeyDown: function (a, b) {
            this.execute = function (e) {
                var c = false,
                    d = null;
                if (!e) e = window.event;
                var g = a.getLinks(),
                    f = a.elemSvID.value,
                    j = c;
                switch (e.keyCode) {
                    case 16:
                        a.shiftKeyDown = true;
                        return c;
                    case 9:
                        if (a.shiftKeyDown) d = a.getNextKey(f, -1);
                        else d = a.getNextKey(f, 1);
                        break;
                    case 40:
                        d = a.getNextKey(f, 1);
                        break;
                    case 38:
                        d = a.getNextKey(f, -1);
                        break;
                    case 39:
                        d = a.getNextSibling(f, 1);
                        break;
                    case 37:
                        d = a.getNextSibling(f, -1);
                        break;
                    case 13:
                    case 27:
                        b();
                        return c;
                    default:
                        j = true
                }
                if (!j) {
                    var i = g[0];
                    for (var h = 0; h < g.length; h++)
                        if (g[h].href.indexOf("#" + d) != -1) {
                            i = g[h];
                            break
                        }
                    try {
                        i.focus();
                        i.onclick()
                    } catch (k) {}
                    return c
                } else {
                    window.evt = e;
                    setTimeout(function () {
                        if (!e) e = window.evt;
                        var c = a.getLinks(),
                            d;
                        for (var b = 0; b < c.length; b++) {
                            var f = c[b].outerText || c[b].text;
                            if (f.toLowerCase().indexOf(a.keysBuffer) == 0 && f != (a.getActiveLink().outerText || a.getActiveLink().text)) {
                                d = c[b];
                                break
                            }
                        }
                        try {
                            if (d) {
                                d.focus();
                                d.onclick()
                            }
                        } catch (g) {}
                    }, 30)
                }
                return true
            }
        },
        Hide: function () {
            this.HideCurrentPopup()
        },
        Show: function (c, b) {
            var d = true,
                a = this;
            if (b) {
                if (b.keyCode == 27) {
                    a.Hide(c, b);
                    return d
                }
                if (b.keyCode && b.keyCode != 40) return false;
                if (window.curDisplayedPopup == c) {
                    a.HideCurrentPopup();
                    return d
                }
                a.HideCurrentPopup();
                b.cancelBubble = d;
                if (a.ChangeObjectDisplay(c, "block")) {
                    window.curDisplayedDDHeader = a.elemHeader;
                    window.curDisplayedPopup = c;
                    a.getActiveLink().focus();
                    Util.addClass(a.elemHeader, "DDSActive");
                    return d
                }
            }
            return false
        },
        cropText: function () {
            var c = "overflow",
                a = this,
                f = "...",
                b = a.elemHeader.innerHTML;
            a.elemHeader.title = b;
            a.elemHeader.innerHTML += "____";
            a.elemHeader.style[c] = "hidden";
            var g = a.elemHeader.clientWidth,
                h = a.elemHeader.scrollWidth,
                d = g * 1 / h * 1;
            if (d < 1) {
                var e = Math.ceil(d * b.length);
                if (e < b.length) b = String(b).substring(0, e - f.length) + f
            }
            a.elemHeader.style[c] = "visible";
            a.elemHeader.innerHTML = b
        },
        getHref: function (a) {
            return a.href.substr(a.href.indexOf("#") + 1)
        },
        setValue: function (b, f) {
            var a = this;
            if (b) {
                var c = (new RegExp(" (" + b + ") ", "i")).exec(a.KeyMap);
                if (c && c[1]) b = c[1]
            }
            if (a.Items[b] == null) throw new Error("Value is not in the current list.");
            a.elemSvID.value = b;
            a.elemHeader.value = a.Items[b];
            if (f != "true") a.addMRUL(b);
            var e = document.getElementById(a.name);
            if (e.tagName == "SELECT")
                for (var d = 0; d < e.options.length; d++) {
                    var g = e.options[d];
                    if (g.value == b) {
                        g.selected = "selected";
                        break
                    }
                }
            a.setText(a.Items[b], f)
        },
        getValue: function () {
            return this.elemSvID.value
        },
        setText: function (c, d) {
            var a = this,
                b = document.getElementById(a.name);
            if (b.tagName.toLowerCase() == "select")
                if (b.value == "") b.options[0].text = c;
                else if (b.options[0].value == "") b.options[0].text = a.Items[""];
            a.elemTextId.value = c;
            a.elemHeader.innerHTML = c;
            a.cropText();
            if (d != "true") a.onChanged(c, a.Items[c])
        },
        getText: function () {
            return this.elemTextId.value
        },
        onclick: function (a) {
            this.setValue(a);
            return false
        },
        ondragstart: function (a) {
            if (!a) a = window.event;
            if (a.preventDefault) a.preventDefault()
        },
        OnSelectedValueChanged: function () {
            return this.onChanged
        },
        HideCurrentPopup: function () {
            if (window.curDisplayedPopup) {
                Util.GetElement(window.curDisplayedPopup).style.display = "none";
                Util.removeClass(window.curDisplayedDDHeader, "DDSActive");
                window.curDisplayedPopup = false;
                window.curDisplayedDDHeader = null
            }
            this.shiftKeyDown = false
        },
        ChangeObjectDisplay: function (c, b) {
            var a = Util.GetStyleObject(c);
            if (a && a.display) {
                a.display = b;
                return true
            } else return false
        },
        addMRUL: function (d) {
            var a = this;
            if (!d) return;
            if (a.MRUL[0] == d) return;
            var c = 0,
                b;
            for (b = 1; b < a.MRUL.length; b++)
                if (a.MRUL[b] == d) {
                    c = b;
                    break
                }
            if (c == 0) a.MRUL.unshift(d);
            else {
                var e = c > 0 ? a.MRUL[c] : d;
                for (b = c; b > 0; b--) a.MRUL[b] = a.MRUL[b - 1];
                a.MRUL[0] = e
            }
            while (a.MRUL.length > a.MAX_MRUL) a.MRUL.pop();
            Util.SetCookie(a.mrul_cookie, a.MRUL, true, Util.GetPath())
        }
    };
    window['_mstConfig'].floaterStylePath = 'https://www.microsofttranslator.com/static/197997/css/WidgetV3_fail.css'; //'http://www.microsofttranslator.com/static/197997/css/WidgetV3.css';
    window['_mstConfig'].translateWithBing = 'TRANSLATE with {0}';
    window['_mstConfig'].withBing = 'with {0}';
    window['_mstConfig'].autoDetected = '{0} (Auto-Detected)';

    function loadAllScripts(fn) {
        /*var intervalID = setInterval(function () {
         if (document.readyState != 'complete') return;
         clearInterval(intervalID);
         fn();
         }, 10);*/
        fn();
    }

    function onloadCallback() {
        var head = document.getElementsByTagName('head')[0];
        try {
            var body = document.getElementsByTagName('body')[0];
            var numChildren = body.children.length;
            var numScripts = body.getElementsByTagName('script').length;

            function appendHTMLToBody(html) {
                var temp = document.createElement('div');
                temp.innerHTML = html;
                for (var i = 0; i < temp.children.length; i++) {
                    body.appendChild(temp.children[i]);
                }
            }
            appendHTMLToBody(decodeURIComponent('%3ctitle%3e%20%3c%2ftitle%3e'));


            appendHTMLToBody(decodeURIComponent('%20%3cdiv%20id%3d%22WidgetFloaterPanels%22%20translate%3d%22no%22%20style%3d%22display%3a%20none%3btext-align%3a%20left%3bdirection%3a%20ltr%22%20class%3d%22LTRStyle%22%20%3e%20%3cdiv%20id%3d%22WidgetFloater%22%20style%3d%22display%3a%20none%22%20%3e%20%3cdiv%20id%3d%22WidgetLogoPanel%22%3e%20%3cspan%20id%3d%22WidgetTranslateWithSpan%22%3e%3cspan%3eTRANSLATE%20with%20%3c%2fspan%3e%3cimg%20id%3d%22FloaterLogo%22%20%2f%3e%3c%2fspan%3e%20%3cspan%20id%3d%22WidgetCloseButton%22%20title%3d%22Exit%20Translation%22%20onclick%3d%22Microsoft.Translator.FloaterOnClose()%22%3ex%3c%2fspan%3e%3c%2fdiv%3e%20%3cdiv%20id%3d%22LanguageMenuPanel%22%3e%20%3cdiv%20class%3d%22DDStyle_outer%22%3e%3cinput%20name%3d%22LanguageMenu_svid%22%20type%3d%22text%22%20id%3d%22LanguageMenu_svid%22%20style%3d%22display%3anone%3b%22%20autocomplete%3d%22on%22%20value%3d%22en%22%20%2f%3e%20%3cinput%20name%3d%22LanguageMenu_textid%22%20type%3d%22text%22%20id%3d%22LanguageMenu_textid%22%20style%3d%22display%3anone%3b%22%20autocomplete%3d%22on%22%20%2f%3e%20%3cspan%20onselectstart%3d%22return%20false%22%20tabindex%3d%220%22%20class%3d%22DDStyle%22%20id%3d%22__LanguageMenu_header%22%20onclick%3d%22return%20LanguageMenu%20%26amp%3b%26amp%3b%20!LanguageMenu.Show(%26%2339%3b__LanguageMenu_popup%26%2339%3b%2c%20event)%3b%22%20onkeydown%3d%22return%20LanguageMenu%20%26amp%3b%26amp%3b%20!LanguageMenu.Show(%26%2339%3b__LanguageMenu_popup%26%2339%3b%2c%20event)%3b%22%3eEnglish%3c%2fspan%3e%20%3cdiv%20style%3d%22position%3arelative%3btext-align%3aleft%3bleft%3a0%3b%22%3e%3cdiv%20style%3d%22position%3aabsolute%3bwidth%3a%3bleft%3a0px%3b%22%3e%3cdiv%20class%3d%22DDStyle%22%20style%3d%22display%3anone%3b%22%20id%3d%22__LanguageMenu_popup%22%3e%20%3ctable%20id%3d%22LanguageMenu%22%20border%3d%220%22%3e%20%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bar%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ar%22%3eArabic%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bhe%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23he%22%3eHebrew%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bpl%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23pl%22%3ePolish%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bbg%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23bg%22%3eBulgarian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bhi%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23hi%22%3eHindi%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bpt%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23pt%22%3ePortuguese%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bca%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ca%22%3eCatalan%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bmww%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23mww%22%3eHmong%20Daw%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bro%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ro%22%3eRomanian%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bzh-CHS%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23zh-CHS%22%3eChinese%20Simplified%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bhu%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23hu%22%3eHungarian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bru%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ru%22%3eRussian%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bzh-CHT%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23zh-CHT%22%3eChinese%20Traditional%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bid%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23id%22%3eIndonesian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bsk%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23sk%22%3eSlovak%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bcs%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23cs%22%3eCzech%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bit%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23it%22%3eItalian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bsl%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23sl%22%3eSlovenian%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bda%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23da%22%3eDanish%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bja%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ja%22%3eJapanese%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bes%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23es%22%3eSpanish%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bnl%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23nl%22%3eDutch%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3btlh%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23tlh%22%3eKlingon%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bsv%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23sv%22%3eSwedish%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3ben%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23en%22%3eEnglish%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bko%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ko%22%3eKorean%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bth%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23th%22%3eThai%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bet%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23et%22%3eEstonian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3blv%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23lv%22%3eLatvian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3btr%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23tr%22%3eTurkish%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bfi%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23fi%22%3eFinnish%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3blt%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23lt%22%3eLithuanian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3buk%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23uk%22%3eUkrainian%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bfr%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23fr%22%3eFrench%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bms%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ms%22%3eMalay%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bur%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ur%22%3eUrdu%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bde%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23de%22%3eGerman%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bmt%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23mt%22%3eMaltese%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bvi%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23vi%22%3eVietnamese%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bel%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23el%22%3eGreek%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bno%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23no%22%3eNorwegian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bcy%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23cy%22%3eWelsh%3c%2fa%3e%3c%2ftd%3e%20%3c%2ftr%3e%3ctr%3e%20%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bht%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23ht%22%3eHaitian%20Creole%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3ca%20tabindex%3d%22-1%22%20onclick%3d%22return%20LanguageMenu.onclick(%26%2339%3bfa%26%2339%3b)%3b%22%20ondragstart%3d%22LanguageMenu.ondragstart(event)%3b%22%20href%3d%22%23fa%22%3ePersian%3c%2fa%3e%3c%2ftd%3e%3ctd%3e%3c%2ftd%3e%20%3c%2ftr%3e%20%3c%2ftable%3e%20%3cimg%20alt%3d%22%22%20style%3d%22height%3a7px%3bwidth%3a17px%3bborder-width%3a0px%3bleft%3a20px%3b%22%20%2f%3e%20%3c%2fdiv%3e%3c%2fdiv%3e%3c%2fdiv%3e%3c%2fdiv%3e%20%3cscript%20type%3d%22text%2fjavascript%22%3e%20var%20LanguageMenu%3b%20var%20LanguageMenu_keys%3d%5b%22ar%22%2c%22bg%22%2c%22ca%22%2c%22zh-CHS%22%2c%22zh-CHT%22%2c%22cs%22%2c%22da%22%2c%22nl%22%2c%22en%22%2c%22et%22%2c%22fi%22%2c%22fr%22%2c%22de%22%2c%22el%22%2c%22ht%22%2c%22he%22%2c%22hi%22%2c%22mww%22%2c%22hu%22%2c%22id%22%2c%22it%22%2c%22ja%22%2c%22tlh%22%2c%22ko%22%2c%22lv%22%2c%22lt%22%2c%22ms%22%2c%22mt%22%2c%22no%22%2c%22fa%22%2c%22pl%22%2c%22pt%22%2c%22ro%22%2c%22ru%22%2c%22sk%22%2c%22sl%22%2c%22es%22%2c%22sv%22%2c%22th%22%2c%22tr%22%2c%22uk%22%2c%22ur%22%2c%22vi%22%2c%22cy%22%5d%3b%20var%20LanguageMenu_values%3d%5b%22Arabic%22%2c%22Bulgarian%22%2c%22Catalan%22%2c%22Chinese%20Simplified%22%2c%22Chinese%20Traditional%22%2c%22Czech%22%2c%22Danish%22%2c%22Dutch%22%2c%22English%22%2c%22Estonian%22%2c%22Finnish%22%2c%22French%22%2c%22German%22%2c%22Greek%22%2c%22Haitian%20Creole%22%2c%22Hebrew%22%2c%22Hindi%22%2c%22Hmong%20Daw%22%2c%22Hungarian%22%2c%22Indonesian%22%2c%22Italian%22%2c%22Japanese%22%2c%22Klingon%22%2c%22Korean%22%2c%22Latvian%22%2c%22Lithuanian%22%2c%22Malay%22%2c%22Maltese%22%2c%22Norwegian%22%2c%22Persian%22%2c%22Polish%22%2c%22Portuguese%22%2c%22Romanian%22%2c%22Russian%22%2c%22Slovak%22%2c%22Slovenian%22%2c%22Spanish%22%2c%22Swedish%22%2c%22Thai%22%2c%22Turkish%22%2c%22Ukrainian%22%2c%22Urdu%22%2c%22Vietnamese%22%2c%22Welsh%22%5d%3b%20var%20LanguageMenu_callback%3dfunction()%7b%20%7d%3b%20var%20LanguageMenu_popupid%3d%27__LanguageMenu_popup%27%3b%20%3c%2fscript%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22CTFLinksPanel%22%3e%20%3cspan%20id%3d%22ExternalLinksPanel%22%3e%3ca%20id%3d%22HelpLink%22%20title%3d%22Help%22%20target%3d%22_blank%22%3e%20%3cimg%20id%3d%22HelpImg%22%20%2f%3e%3c%2fa%3e%20%3ca%20id%3d%22EmbedLink%22%20href%3d%22javascript%3aMicrosoft.Translator.FloaterShowEmbed()%22%20title%3d%22Get%20this%20widget%20for%20your%20own%20site%22%3e%20%3cimg%20id%3d%22EmbedImg%22%20%2f%3e%3c%2fa%3e%20%3ca%20id%3d%22ShareLink%22%20title%3d%22Share%20translated%20page%20with%20friends%22%20href%3d%22javascript%3aMicrosoft.Translator.FloaterShowSharePanel()%22%3e%20%3cimg%20id%3d%22ShareImg%22%20%2f%3e%3c%2fa%3e%20%3c%2fspan%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22FloaterProgressBar%22%3e%20%3cspan%20id%3d%22ProgressFill%22%20%3e%3c%2fspan%3e%20%3c%2fdiv%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22WidgetFloaterCollapsed%22%20style%3d%22display%3a%20none%22%3e%20%3cspan%3eTRANSLATE%20with%20%3c%2fspan%3e%3cimg%20id%3d%22CollapsedLogoImg%22%20%2f%3e%3c%2fdiv%3e%20%3cdiv%20id%3d%22FloaterSharePanel%22%20style%3d%22display%3a%20none%22%20%3e%20%3cdiv%20id%3d%22ShareTextDiv%22%3e%20%3cspan%20id%3d%22ShareTextSpan%22%3e%20COPY%20THE%20URL%20BELOW%20%3c%2fspan%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22ShareTextboxDiv%22%3e%20%3cinput%20name%3d%22ShareTextbox%22%20type%3d%22text%22%20id%3d%22ShareTextbox%22%20readonly%3d%22readonly%22%20%2f%3e%20%3c!--a%20id%3d%22TwitterLink%22%20title%3d%22Share%20on%20Twitter%22%3e%20%3cimg%20id%3d%22TwitterImg%22%20%2f%3e%3c%2fa%3e%20%3ca--%20id%3d%22FacebookLink%22%20title%3d%22Share%20on%20Facebook%22%3e%20%3cimg%20id%3d%22FacebookImg%22%20%2f%3e%3c%2fa--%3e%20%3ca%20id%3d%22EmailLink%22%20title%3d%22Email%20this%20translation%22%3e%20%3cimg%20id%3d%22EmailImg%22%20%2f%3e%3c%2fa%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22ShareFooter%22%3e%20%3cspan%20id%3d%22ShareHelpSpan%22%3e%3ca%20id%3d%22ShareHelpLink%22%3e%20%3cimg%20id%3d%22ShareHelpImg%22%20%2f%3e%3c%2fa%3e%3c%2fspan%3e%20%3cspan%20id%3d%22ShareBackSpan%22%3e%3ca%20id%3d%22ShareBack%22%20href%3d%22javascript%3aMicrosoft.Translator.FloaterOnShareBackClick()%22%20title%3d%22Back%20To%20Translation%22%3e%20Back%3c%2fa%3e%3c%2fspan%3e%20%3c%2fdiv%3e%20%3cinput%20name%3d%22EmailSubject%22%20type%3d%22hidden%22%20id%3d%22EmailSubject%22%20value%3d%22Check%20out%20this%20page%20in%20%7b0%7d%20translated%20from%20%7b1%7d%22%20%2f%3e%20%3cinput%20name%3d%22EmailBody%22%20type%3d%22hidden%22%20id%3d%22EmailBody%22%20value%3d%22Translated%3a%20%7b0%7d%250d%250aOriginal%3a%20%7b1%7d%250d%250a%250d%250aAutomatic%20translation%20powered%20by%20Microsoft%c2%ae%20Translator%250d%250ahttp%3a%2f%2fwww.bing.com%2ftranslator%3fref%3dMSTWidget%22%20%2f%3e%20%3cinput%20type%3d%22hidden%22%20id%3d%22ShareHelpText%22%20value%3d%22This%20link%20allows%20visitors%20to%20launch%20this%20page%20and%20automatically%20translate%20it%20to%20%7b0%7d.%22%2f%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22FloaterEmbed%22%20style%3d%22display%3a%20none%22%3e%20%3cdiv%20id%3d%22EmbedTextDiv%22%3e%20%3cspan%20id%3d%22EmbedTextSpan%22%3eEMBED%20THE%20SNIPPET%20BELOW%20IN%20YOUR%20SITE%3c%2fspan%3e%20%3ca%20id%3d%22EmbedHelpLink%22%20title%3d%22Copy%20this%20code%20and%20place%20it%20into%20your%20HTML.%22%3e%20%3cimg%20id%3d%22EmbedHelpImg%22%2f%3e%3c%2fa%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22EmbedTextboxDiv%22%3e%20%3cinput%20name%3d%22EmbedSnippetTextBox%22%20type%3d%22text%22%20id%3d%22EmbedSnippetTextBox%22%20readonly%3d%22readonly%22%20value%3d%22%26lt%3bdiv%20id%3d%26%2339%3bMicrosoftTranslatorWidget%26%2339%3b%20class%3d%26%2339%3bDark%26%2339%3b%20style%3d%26%2339%3bcolor%3awhite%3bbackground-color%3a%23555555%26%2339%3b%3e%26lt%3b%2fdiv%3e%26lt%3bscript%20type%3d%26%2339%3btext%2fjavascript%26%2339%3b%3esetTimeout(function()%7bvar%20s%3ddocument.createElement(%26%2339%3bscript%26%2339%3b)%3bs.type%3d%26%2339%3btext%2fjavascript%26%2339%3b%3bs.charset%3d%26%2339%3bUTF-8%26%2339%3b%3bs.src%3d((location%20%26amp%3b%26amp%3b%20location.href%20%26amp%3b%26amp%3b%20location.href.indexOf(%26%2339%3bhttps%26%2339%3b)%20%3d%3d%200)%3f%26%2339%3bhttps%3a%2f%2fssl.microsofttranslator.com%26%2339%3b%3a%26%2339%3bhttp%3a%2f%2fwww.microsofttranslator.com%26%2339%3b)%2b%26%2339%3b%2fajax%2fv3%2fWidgetV3.ashx%3fsiteData%3dueOIGRSKkd965FeEGM5JtQ**%26amp%3bctf%3dtrue%26amp%3bui%3dtrue%26amp%3bsettings%3dmanual%26amp%3bfrom%3den%26%2339%3b%3bvar%20p%3ddocument.getElementsByTagName(%26%2339%3bhead%26%2339%3b)%5b0%5d%7c%7cdocument.documentElement%3bp.insertBefore(s%2cp.firstChild)%3b%20%7d%2c0)%3b%26lt%3b%2fscript%3e%22%20%2f%3e%20%3c%2fdiv%3e%20%3cdiv%20id%3d%22EmbedNoticeDiv%22%3e%3cspan%20id%3d%22EmbedNoticeSpan%22%3eEnable%20collaborative%20features%20and%20customize%20widget%3a%20%3ca%20href%3d%22http%3a%2f%2fwww.bing.com%2fwidget%2ftranslator%22%20target%3d%22_blank%22%3eBing%20Webmaster%20Portal%3c%2fa%3e%3c%2fspan%3e%3c%2fdiv%3e%20%3cdiv%20id%3d%22EmbedFooterDiv%22%3e%3cspan%20id%3d%22EmbedBackSpan%22%3e%3ca%20href%3d%22javascript%3aMicrosoft.Translator.FloaterOnEmbedBackClick()%22%20title%3d%22Back%20To%20Translation%22%3eBack%3c%2fa%3e%3c%2fspan%3e%3c%2fdiv%3e%20%3c%2fdiv%3e%20%3cscript%20type%3d%22text%2fjavascript%22%3e%20var%20intervalId%20%3d%20setInterval(function%20()%20%7b%20if%20(MtPopUpList)%20%7b%20LanguageMenu%20%3d%20new%20MtPopUpList()%3b%20var%20langMenu%20%3d%20document.getElementById(LanguageMenu_popupid)%3b%20var%20origLangDiv%20%3d%20document.createElement(%22div%22)%3b%20origLangDiv.id%20%3d%20%22OriginalLanguageDiv%22%3b%20origLangDiv.innerHTML%20%3d%20%22%3cspan%20id%3d%27OriginalTextSpan%27%3eORIGINAL%3a%20%3c%2fspan%3e%3cspan%20id%3d%27OriginalLanguageSpan%27%3e%3c%2fspan%3e%22%3b%20langMenu.appendChild(origLangDiv)%3b%20LanguageMenu.Init(%27LanguageMenu%27%2c%20LanguageMenu_keys%2c%20LanguageMenu_values%2c%20LanguageMenu_callback%2c%20LanguageMenu_popupid)%3b%20window%5b%22LanguageMenu%22%5d%20%3d%20LanguageMenu%3b%20clearInterval(intervalId)%3b%20%7d%20%7d%2c%201)%3b%20%3c%2fscript%3e%20%3c%2fdiv%3e%20'));
            var code = '';
            var scripts = body.getElementsByTagName('script');
            for (var i = numScripts; i < scripts.length; i++) {
                if (scripts[i].innerHTML.length != 0) {
                    code += scripts[i].innerHTML;
                }
            }
            eval(code);
        } catch (e) {
            console.error(e);
        }
        Microsoft.Translator.FloaterInitialize('en', 'true', '');
    }

    loadAllScripts(onloadCallback);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //The codes above are local copy of translate scripts;

    function onTranslateProgress(value)
    {
        var msg = BFI_LOADINGMSG + ' ' + Math.round(value) + '%';
        showMessageBox(msg, "OnProgress");
    }

    function onTranslateError(error)
    {
        //Kept only for debugging;
        //alert('Translate Error: ' + error);
    }

    function onTranslateComplete()
    {
        var msg = BFI_DONEMSG;

        if( Microsoft.Translator.Widget.GetAutoDetectedLanguage().toUpperCase() === BFI_TOLANG.toUpperCase() )
        {
            msg = BFI_SAMELANGMSG;
        }

        showMessageBox(msg);
    }

    function showMessageBox(msg, msgType)
    {
        var msgBox = document.getElementById('_msgBox');
        var firstRun = (msgBox === null);

        if(firstRun) {
            msgBox = document.createElement('div');
            msgBox.id = '_msgBox';
            msgBox.className = 'TnITTtw-fullpage-bar';
        }

        //var divClose = '<div id="divClose" style="float:right;margin:0px;padding:0px" ><a style="padding:0px;margin:0px" onclick="document.getElementById(\'_msgBox\').style.display=\'none\';"></div>';
        //var divCancel = '<div id="divCancel" style="float:right;margin:0px 10px 0px 0px;padding:0px;line-height:41px;" ><a style="padding:0px;margin:0px;color:#0760be" onclick="document.getElementById(\'_msgBox\').style.display=\'none\';window.location.reload();">' + BFI_CANCEL + '</a></div>';

        var divClose = '<div class="TnITTtw-close-bar" onclick="document.getElementById(\'BFI_DATA\').value = \'init_mate\';"></div>';
        var divCancel = '';

        msgBox.innerHTML = '<div class="TnITTtw-label">'+ msg +'</div>' + (msgType === "OnProgress"? divCancel : divClose);

        if(firstRun)
        {
            document.body.insertBefore(msgBox, document.body.childNodes[0]);
        }
    }

    /**
     * Load an external resource to the DOM to evaluate more scripts.
     */
    function loadScript(scriptName, onload) {
        // RDB

        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', scriptName);

        if (onload) {
            script.addEventListener('load', onload, false);
        }

        document.body.appendChild(script);
    }

    // above is the translator widget wrapper;
    function onTranslateTimer()
    {
        var transferDOM = document.getElementById('BFI_DATA');

        if(!transferDOM || !transferDOM.value || transferDOM.value === '') {
            //setTimeout(onTranslateTimer, 100);
        } else if (transferDOM.value === 'restore_original') {
            Microsoft.Translator.Widget.RestoreOriginal();
            transferDOM.value = '';
        } else if (transferDOM.value.indexOf(',') > -1) {
            var msg = transferDOM.value.split(',');

            BFI_TOLANG = msg[0];
            BFI_DONEMSG = msg[1];
            BFI_SAMELANGMSG = msg[2];
            BFI_LOADINGMSG = msg[3];
            BFI_CANCEL = msg[4];
            BFI_APPID = msg[5];

            // message transfer done.
            // clear data dom;
            //document.body.removeChild(transferDOM);

            // reset value instead of removing from DOM
            transferDOM.value = '';

            // start loading;
            onTranslateProgress(0);

            // the loaded script is filling latest BFI_APPID;

            // 1 indicates app id is successfully loaded;
            onTranslateProgress(1);

            Microsoft.Translator.Widget.Translate(null, BFI_TOLANG, onTranslateProgress, onTranslateError, onTranslateComplete, null, 3600000);
        }

        setTimeout(onTranslateTimer, 100);
    }

    // start to monitor transfer data;
    setTimeout(onTranslateTimer, 100);
}


function injectScript(fn) {
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('(' + fn + ')();'));
    document.body.appendChild(script);
}

/**
 * Bing adds branding to the page when the translator has begun. This will
 * use Mutation Observers to listen on the newly added DOM and
 * remove it from display.
 */
function brandingRemoval() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || windows.MozMutationObserver;
    var observer = new MutationObserver(function onMutationObserver(mutations) {
        mutations.forEach(function(mutationNode) {
            if (mutationNode.addedNodes) {
                for (var n = 0; n < mutationNode.addedNodes.length; n++) {
                    var node = mutationNode.addedNodes[n];
                    if (node.id === 'WidgetFloaterPanels') {
                        node.style.display = 'none';
                        node.style.visibility = 'hidden';
                    }
                }
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: false });
}


var transferDom;
/**
 * Create shared DOM to transfer between two worlds
 */
function embedTransferDom()
{
    transferDom = document.createElement('textarea');
    transferDom.id = 'BFI_DATA';
    transferDom.style.width='1px';
    transferDom.style.height='1px';
    transferDom.style.display='none';
    document.body.appendChild(transferDom);
}

/**
 * Fires an event to the Browser context for cross context messaging.
 */
function dispatch(msg) {
    transtateDom = document.getElementById('BFI_DATA');
    transferDom.value = msg;
}

// Initialize the extension communications shared DOM states.
embedTransferDom();
brandingRemoval();
injectScript(fpTranslate);

function checkCommunication() {
    var data = document.getElementById('BFI_DATA');

    if (!data || !data.value) {
        // do nothing
    } else if (data.value === 'init_mate') {
        data.value = 'restore_original';

        $('.TnITTtw-fullpage-bar').animate({
            bottom: -100
        }, 150, function() {
            $(this).remove();

            init();
        });
    }

    setTimeout(checkCommunication, 100);
}

setTimeout(checkCommunication, 100);

const CSS = "@-webkit-keyframes load4 {    0%,    100% {        box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;    }    12.5% {        box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;    }    25% {        box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;    }    37.5% {        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;    }    50% {        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;    }    62.5% {        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;    }    75% {        box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;    }    87.5% {        box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;    }}@keyframes load4 {    0%,    100% {        box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;    }    12.5% {        box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;    }    25% {        box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;    }    37.5% {        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;    }    50% {        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;    }    62.5% {        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;    }    75% {        box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;    }    87.5% {        box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;    }}.help-tt-wrap {    background: rgba(0, 0, 0, 0.575);    color: #FFF;    padding: 10px;    border-radius: 3px;    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.775)}.text-layout {}.text-container {}/* haneockndjfcggooemgiamgjjnhaphjc *//* dchhhgnffjgnhjnbphbbpfelanmndmkk *//* local fckkdcdgdcoemdmhebonjccchdjhehgb */*[class^=TnITTtw-] {    box-sizing: content-box !important;    display: block;    margin-top: 0;    padding: 0;}.TnITTtw-tooltip-main-wrap {    display: none;}.TnITTtw-help-selected-wrap {    border: 1px solid #c8c7cc !important;    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.20) !important;    border-radius: 11px !important;    width: 327px !important;    letter-spacing: normal !important;    line-height: normal !important;    cursor: move !important;}@media (prefers-color-scheme: dark) {.TnITTtw-help-selected-wrap {    border-color: rgba(0, 0, 0, 0.25) !important;}}.TnITTtw-has-bottom-arr0w {    box-shadow: 0 5px 30px -5px rgba(0, 0, 0, 0.275) !important;}.TnITTtw-help-inside-layout {    height: 298px !important;    background: #FFF !important;    border-radius: 10px !important;}@media (prefers-color-scheme: dark) {.TnITTtw-help-inside-layout {    background: #2C2C2B !important;}}.TnITTtw-with-info-warn .TnITTtw-help-inside-layout {    border-bottom-left-radius: 0 !important;    border-bottom-right-radius: 0 !important;}.TnITTtw-left-particle {    width: 327px !important;}.TnITTtw-content-layout {}.TnITTtw-variant-bunch-wrap {}.TnITTtw-variant-bunch-wrap .TnITTtw-inside-layout {}.TnITTtw-padded-single-translation {    text-align: left !important;    letter-spacing: normal !important;    line-height: normal !important;    position: relative !important;    padding: 16px !important;    width: calc(100% - 32px) !important;}.TnITTtw-padded-single-translation.TnITTtw-original-wrap {    border-bottom: 1px solid #c8c7cc !important;    margin-left: 16px !important;    padding-left: 0 !important;}@media (prefers-color-scheme: dark) { .TnITTtw-padded-single-translation.TnITTtw-original-wrap {    border-color: #747473 !important;}}.TnITTtw-tpart {    display: inline-block !important;    -webkit-user-select: initial !important;    width: 211px !important;    text-align: left !important;    font-size: 19px !important;    font-weight: 400 !important;    color: #000 !important;}@media (prefers-color-scheme: dark) {.TnITTtw-tpart {    color: #FFF !important;}}.TnITTtw-short-padded-single-translation .TnITTtw-tpart {    font-size: 22px !important;}.TnITTtw-mv-text-part {    font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Helvetica, Arial, Ubuntu, sans-serif !important;    text-align: left !important;    display: inline-block !important;    color: #000 !important;    font-size: 22px !important;    font-weight: 600 !important;    width: 247px !important;    padding-right: 0 !important;}@media (prefers-color-scheme: dark) { .TnITTtw-mv-text-part {    color: #FFF !important;}}.TnITTtw-no-trans-tts .TnITTtw-listen-translation {    display: none;}.TnITTtw-no-trans-tts .TnITTtw-more-butt0n {    right: 16px !important;}.TnITTtw-no-trans-tts .TnITTtw-copy-translation-butt0n {    right: 16px !important;}.TnITTtw-synonyms {    display: block !important;    font-size: 14px !important;    text-align: left !important;    color: #8e8e93 !important;    width: 216px !important;}@media (prefers-color-scheme: dark) { .TnITTtw-synonyms {    color: #98989D !important;}}.TnITTtw-synonym {    display: inline-block !important;    vertical-align: top !important;    text-align: left !important;}.TnITTtw-synonym:hover {}.TnITTtw-listen-layout {}.TnITTtw-listen-inner-space {}.TnITTtw-listen-butt0n {    width: 25px !important;    height: 25px !important;    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAABqhJREFUaAXdmHuIVFUcx33lqvnIzbQ0X2lqVmZZivuHkUJIQWFm0oNSydQiyspKCaQCLYoeVoKWYWBRKCSmRZYVZqXkI19Zpq6vTPGVpZma1ucze49cptmZ3ZnZdrYvfObee+655/6+95zzO2e3Vq3/mWr/R3768p7B0ApWwptwCGqk7iTqtfAH/A374EUoghqn4URcCqdAMwFN9YEapduJdisEE8nHUTXJza0EuymNGc09VBWG6uW50bq0dwc8AZ0q2HZD6pks/oSjcBhOQlbKpyHN3A8PQAeoqHpQ8RU4GLGDo727HNbBMaiw8mVIM2NgHLSu8NvLKjbh0AtMHCfAnrKXTBwrYAEshgOQUQaSq/woo+FxaFOJxhZS9xswna+CJbAGjkAjuBi6gmuYGdGeKoWshyPPZpQf5EFwmCRnsUzXISnU4dkG0AycS53hKrgb3oP94NzaCJOgJVSJNOOc+RkyBZ/qfjCUKjh3MI2hE9wM8+EvcBjOAeddXhXM7KTVVMFWpCydoXiw9l4XGA97wCH6GTjv8iLNOGdyMaPhYKgF5wOhN6Sbg2dz/y7YBsfhU9BoTtKMK/x2qEgvpKsTDPWjrQ2wBj6CKXA9OKeSZUYcDJoyG74LlqWUDbRLQXFU23F9L+TDTLyHNPQLmJb98r/Cj/A29AffG5cZcDhYz/T+GPxL11Gi22UpGBrVdsyWQrqvXpl7oYea0qaB3wTOE3vJeWL6XgsmniKIy2eeBd9nb/WF0yrhbD3YSHJAZha/oHoSku/nch0M2bZD2aCdJ91gJHwNtu9c1egZEFdHLpbDKZgJtpHQJ/xamCo4h0AHUKbLVHWyLYsbSrwg9uO8uAJmg+07JIdBXHW4GAHuLkznPSGho/yWF9Qx7rUuq1ZrXpp65T2frjydIV9ZGzrD+2A7G+BSiMsMuRLskMne0GUDT6pRnXj3WHBoN4zFoQk3qRPBKWGKNikZc9B+TvzQmh8IxfGbXFeLnAuPwNSI7klRrON6GmhwEDjHgiybD06NrtClEAwdJJDtcCEMgefhAghyOM2FrdASroa4NnJhT9q7JYVg6AcCuQceBf8TdA2Yqk9nLc53wSJwaHm/PgT9zom9qPoVgqGw3rxFQC+BwTq02kKQfzIsjS56cEyea1uie90LwVAUS2Llf4eLA3A+mOHi2hZdmHWL4jc43xtdty8kQ8akGSe4wy3eC1ye/lPcBTY5btciVT/5Rllx9f324dXFcBicN3G5i1Du4dzBxNU0uthbSIYuJ6gJ4Lq4AsxecV0SXWzm6DYtLoeo2lKv7Fitvx15+yjoD+4EdsMLYPYKcvgNiC6+4ujuJsgkEtamZYVgyJ3CSGgOfv1JsAji6s3FleBc+RxcUINacOKHsGxxIRhy7fkSHGZfwGowlQfZO255nCdLIKRvThOyZ/0Ye2BVIRj6nkDGgTsGcc0Jqs3JaBgIbpRfA5NCkPHfCOYCje6AxNbc7kqFjbSxEvoAUtXJtizTbtv0fB/8HL33DY4hm3GakMPQNcisd0uihJ+xUUGqwByzPaKKMzimqpNtWTpD3XjXM+AXt/0PoTPE5eJqTO71loPpPiHze/zh5ADNQGoouOgl38/2Om6oEe22ghLwP7DOFf9oM9g54Ed1+MU1iAuHqDGNhsR9x+B+cA9lZjkXkrU2KviY43Tw4bpRWT4Ori8T4UxoC2atc2AbOGdmwWbwwwX5zAQ4C+bBbIjf57Lsb3YzSjLm+SAXsCngmM22Z8JzoYeupS3XFb/0ATDbPQdmr5aQrHYUzAXr/wS9ICeZJF6FkxCCy+YYDHWhnclgphsCl8F54OhJVlcKHIJHwDR9G6SqR3HlZE9Nh1xMBUOOAOdPMTSA8lTCjQWgGXvSod8Y8ia7fhpkayoYyhRQayqMg+/A/5buBM00g7yrLS2+DtnMqXSGHEYOxTFgyt4FZjx3FDdAuWZyHX+uE0+DhkzvyamVoowqooZLh9nNoXcRaMZF0/lqYgiZeBbn68EFP6VyNWSj22ESmBgcCpU15RrzMphdnUNNwLkhm2AqLITVsBvsqXKVD0M2bk+ZqerDCKiMqebU7wu/wSHYCaXwLSyFrbAPjkNG5cuQL9LUU9Ebh3OsE51nOqyjwjA4DJoyHXvuLkCDaXuE+1Wu9ryhItnv4SgSjbv1cS65IS1Imf2mQ7oF1wxWo+Q6NRNSmTpB+QCocepAxDPACR035opf7lrCvYKWc2o8bARNzYOeUCWqTHrNJQDnlOuNKdq1xR21wy7v+gd5KsAe5SIp8gAAAABJRU5ErkJggg==') !important;    background-size: 25px 25px !important;    position: absolute !important;    right: 16px !important;    top: 18px !important;    cursor: pointer !important;    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1) !important;}.TnITTtw-listen-butt0n:first-child {}.TnITTtw-listen-butt0n.stop-audio,.TnITTtw-listen-translation.stop-audio,.TnITTtw-listen-v-item.stop-audio {    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAACXBIWXMAAAsTAAALEwEAmpwYAAA4ImlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwMTQgNzkuMTU2Nzk3LCAyMDE0LzA4LzIwLTA5OjUzOjAyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNy0xMS0wOVQxMjo1MSswMTowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE3LTExLTA5VDEyOjU1OjIyKzAxOjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNy0xMS0wOVQxMjo1NToyMiswMTowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDpiZjkwMTVmNS01YzI3LTRjNzgtYTY3My1mZjM4NmQyNTYyZDA8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6YmY5MDE1ZjUtNWMyNy00Yzc4LWE2NzMtZmYzODZkMjU2MmQwPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YmY5MDE1ZjUtNWMyNy00Yzc4LWE2NzMtZmYzODZkMjU2MmQwPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmJmOTAxNWY1LTVjMjctNGM3OC1hNjczLWZmMzg2ZDI1NjJkMDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNy0xMS0wOVQxMjo1MSswMTowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjUyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjUyPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4Ak5Q+AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAE/SURBVHja7No7joMwEIDhfzYp9wQWHcdBIjfZC1HkDClyHLqIA0SUibwNSITXOskq8Tgz0jQIiflksIGxeO9JKb5ILAwUe2zHB0Rk7fwM2AEFkAMO+P7nmlqgAWrgCByA09LJkznAe3+TC+GACrgA/sV56a7tlkA39QeASuD8Bsg4z10tT4F+gGsEmD6vXU0PgcrIMENUeS/IRXKbrd1+7h5QFTGmzyoUlL1pNntk9svG9c8trDtgo2AN3XS1/vmmUCh6MShCQLkiUB4CcopAk1plvJiKiKoPJO+92OeDgQxkIAMZyEAGMpCBDGQgAxnIQFGAWkX1tyGgRhGoCQHVikB1COioCDSt9RN+1p+AvYLR2TPXTP6Uhhck1pLsI6mm8XCkkmnrD58pFRsv5topazNL9FtjxPbLGchAT8XvAK7wS2ID0z4/AAAAAElFTkSuQmCC') !important;}@media (prefers-color-scheme: dark) {    .TnITTtw-listen-butt0n,    .TnITTtw-listen-butt0n.stop-audio,    .TnITTtw-listen-translation.stop-audio,    .TnITTtw-listen-v-item.stop-audio {        filter: invert(100%) sepia(100%) saturate(1%) hue-rotate(21deg) brightness(103%) contrast(102%) !important;    }}.TnITTtw-copy-translation-butt0n {    display: inline-block !important;    position: absolute !important;    right: 60px !important;    top: 19px !important;    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAoCAYAAACWwljjAAAAAXNSR0IArs4c6QAAAdlJREFUWAntWD1LBDEQXUWxEEERLAQLQa0t/Am2/hALS8HC1s5KK0FQG22s/BkWNhYeenCFIGqjYunH+d6yWYaQ3dlN1lQZeNxMZjLzdpINm8syXUYQsgn0gB9g6IFPzNkGOpEtZPEh4Zqz1wWj+w4JkeR+KCnXk7YZOwOBJ+uhDmFzK3hJm+Ku2B1UXQYeAek/gu1FSibx0UmIsggMAJnjFPYo0EpkAh/dEGLRBeABkHnOYY8BjUVO9tElIRadB+4AmesS9jiQC9dRnjPvxbj5kRN9dJsQ884Bt4DMdwV7Asjsc6ZrQrss4pBZjN0AktQF4+xzpmtC16gxyUIOmcEY/YbUF5frF5Cv3wfsacAIg0PlDQkGgCvXFMZXTAESsYP+g5Cpp/62PgPUjIEBiZDWwNSh1CGtA5o/7aHUIa0Dmj/todQhrQOa37WH5Mca59vfS1rOEP/QRYhfcOUNAHo/pELLuX0XIXZoVSTitTeWHLAQl8TGiWBAgvKaZMeG2vyLp1fUyLdLVcINQSqqWkXoFSzWozIpilURMuPHiFuKRYxrxsJN5BlBL8B3k+CamLUaX35BtC+KdfGhPj68680u89IZ9ZwpK1coJBT9nKngUg5HP2fKyg7lD2CbT53FP5BAAAAAAElFTkSuQmCC') !important;    width: 21px !important;    height: 24px !important;    background-size: 21px 24px !important;    cursor: pointer !important;    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1) !important;}@media (prefers-color-scheme: dark) {.TnITTtw-copy-translation-butt0n {    filter: invert(100%) sepia(100%) saturate(1%) hue-rotate(21deg) brightness(103%) contrast(102%) !important;}}.TnITTtw-more-butt0n {    display: inline-block !important;    position: absolute !important;    right: 60px !important;    top: 26px !important;    background-image: url(regular-more.png) !important;    width: 24px !important;    height: 7px !important;    background-size: 24px 7px !important;    cursor: pointer !important;    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1) !important;}@media (prefers-color-scheme: dark) {    .TnITTtw-more-butt0n {        filter: invert(100%) sepia(100%) saturate(1%) hue-rotate(21deg) brightness(103%) contrast(102%) !important;    }}.TnITTtw-caption {    display: none;}.TnITTtw-main-variant-wrap {    text-align: left !important;}.TnITTtw-original {    display: block !important;    vertical-align: top !important;    color: rgb(0, 0, 0) !important;    padding: 16px 0 !important;    padding-bottom: 0 !important;    font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Helvetica, Arial, Ubuntu, sans-serif !important;    box-sizing: initial !important;    width: calc(100% - 16px) !important;    text-align: left !important;    margin-left: 16px !important;}.TnITTtw-mv-translit {    color: #6d6d72 !important;    font-size: 14px !important;    margin-top: 5px !important;}@media (prefers-color-scheme: dark) {    .TnITTtw-mv-translit {        color: #98989D !important;    }    .TnITTtw-original {        color: #FFF !important;        border-bottom-color: #747473 !important;    }}.TnITTtw-original .TnITTtw-mv-text-part {    font-weight: 400 !important;}.TnITTtw-unpinned-utils, .TnITTtw-utils {    padding: 10px 16px !important;    border-bottom: 1px solid #c8c7cc !important;    background: #FFF !important;    border-top-left-radius: 11px !important;    border-top-right-radius: 11px !important;    font-size: 0px !important;    -webkit-user-select: none !important;    display: block;    box-sizing: content-box !important;}@media (prefers-color-scheme: dark) {.TnITTtw-unpinned-utils, .TnITTtw-utils {    background: #393938 !important;    border-bottom-color: #747473 !important;}}.TnITTtw-unpinned-utils {    display: none;    text-align: center !important;}.TnITTtw-unpinned-utils {    cursor: move !important;}.TnITTtw-close-unpinned {    width: 12px !important;    height: 12px !important;    background-image: url(regular-wl-remove.png) !important;    background-size: 12px 12px !important;    position: absolute !important;    right: 23px !important;    top: 17px !important;    cursor: pointer !important;}.TnITTtw-netflix-words {    color: #8e8e93 !important;    font-weight: 600 !important;    cursor: pointer !important;    margin: 0 !important;    text-align: center !important;    width: auto !important;    font-size: 13px !important;    margin-top: 10px !important;    text-decoration: underline !important;}.TnITTtw-util-butt0n {    display: inline-block !important;    width: 24px !important;    height: 24px !important;    background-size: 24px 24px !important;    background-repeat: no-repeat !important;    margin: 0 !important;    -webkit-user-select: none !important;    vertical-align: top !important;    box-sizing: content-box !important;    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1) !important;}.TnITTtw-util-butt0n.TnITTtw-listen-original {    background-image: url(regular-tt-orig-speaker.png) !important;    width: 25px !important;    height: 25px !important;    background-size: 25px 25px !important;}.TnITTtw-util-butt0n.TnITTtw-listen-original.stop-audio {    background-image: url(regular-stop-grey.png) !important;}.TnITTtw-pro-img { /* 3.11 */    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAAA0CAYAAAAJzeNFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkI0NkYxMEFCRDZDMTFFNzkwNUFFMDc0MTZGODM4QzgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkI0NkYxMEJCRDZDMTFFNzkwNUFFMDc0MTZGODM4QzgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyQjQ2RjEwOEJENkMxMUU3OTA1QUUwNzQxNkY4MzhDOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyQjQ2RjEwOUJENkMxMUU3OTA1QUUwNzQxNkY4MzhDOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt3477IAAAjdSURBVHja7F1pjBVFEG5YDhdE3EUWD1YQV45wRkWCB/HEAzSGJYjiASqIUVQUBeRSogbWEC8CHgjiHYWoERUEORWIgHKpqKArYZF7xV1gF/awvky9MDzfTPfMdL838OZLvuyPmVfdU13dXVV9rBARwo4M4lDiOmIJcQ1xILFGpJoIycQMYnUCFkSqiZAsdHYwQrCS2OxE+dCaUVuHGl0lbXdRZIgRkoEsyfNTI0OMECEyxAiRIUaIEBlihMgQI0QwiFqRCo5rXEGsK3mnivgXcTmx+HgyxNrEIx5knEE8l3gW8UziAWIRcRtxq4aPP5tlxwjF7iHuJv5A3JckXWGpLY/YmphNbMi6wrLbv/z3D+ImYSWbk4FbmSqAngYRZ2vUR0viacRGzAriXiaMf7tXoRA2gxsYwjYQe7u834E4nvijcM78x7L/C4l3c8OpAGuoSOROIhYqyF9FHEk82UBDX0AcS1xJLJPUJcZDxO+JE7mhgmCcYpmqPMidyS9aEEcQvyTuVygPHXMmMZ8N1xWZxF8cBN0W9+75xM8DKGGIpC7X8IjiR/4uYW0G0NHT+/Joq6PxFxG7hMQQwQd91KMT8QMepPyWixHyMWIdp0IecfnxNn6nAfEdTYqYQ2wcV4dc4ixN8l8Q/nem5BBXGGh8uDqjVUaFJBjiwx7Kh+vxsuby1/KM+j+8L/nhtcTfNFdmnW0qxfT1t2b5E3wa4nwDDW/neyk2xAonI0gA+PvfGdJDObFHfIFzJD+qMlSZ19hfKTIgG77jpR4bPc+wEcb4eIoMEb7rAx5ihkLDekB9rvKSvjG1AfNe4k3E0w3lRyezb+MlYEsGJnAAt0aDrM9YlhuqOXpdzjOPio/8oTC/xewkno3bIKJPZR6xpiEjjKEj8WJuABWs50jQKbpHimYBN/xWblxE0lmcvurG0WFDhe9+gniLhm/8ln04nXjWPlK5AMHhJxyMFXHKph6nttrzjNTDLTjhWOE54mCVqTkRkbYZTuzFPkdTbvj+xHkahu0txGeItxMvI7YlXsJpoI88RG/TPTZCPkf3drdkIRtNHYXfn8KKlbkzqH9zDVPzMM1G2JwDK7cyD3Db11aQh9ziqxK3r5yDRE+GOJ8NQoZePGp4NcBVvFogcwdaEX9SNGivQKe6iziARzo/6KNgjONCaIiTJeXt8ejuxPCoiyGiU96vaojlnAPy4i+exw6pigGiQs8r9jJ7b9uuIDtZvl88CiT1mhsyQ8yJmw3ieZgT/H6xxKHdK3mKlxrikUShtiKGKxriUz7l91OQfXWKDBG+YolLvYoVOnYyDXGYoTaKYaCLIa5WMcTBAQpHMPSPRP5Xwv8uICz475PI75vCgOxNSd1ah8gQ3exgvwi+hNrdJdW2XcUAVgYovIKTom54i3uGH5QrRMVZKTTEpZLnuSIcqCnx/ZFmKdUw9TuhJBn7EYsMy98QYkNcpzB9hwHIfLgdxFqgoQyndBXckx3JyCOWGJa/V8E9SBVkdQvLKTzZsdRVAWTD0LA7qqfLOxtPhI2xpYblQ0dYD8/jEQwbQOorZhAyjxNDbCx5vtOHTLgd2E11n4Khzz4RDLHKgEzkKZELvJnYTqgls/0gMyQ6zJbo9w3J7zM4cMTKShNhbWZWTZttRmonOipwLLDuiQ2516fZd2dLApk7DJaNrExldHjqKJD9X5+GRgg0SlG5WA5dGLP2CNa69iSRvofJ6qegTAQwo8IQUYYFPe0KSVMcSmJZOIKBUwHLwpLaCAPgXE+J+qJxQ8TCA1bQkBifnSjATHdDvFGorW5gc8Uc7s3FzBLFiB3J4AYh18MeTdmLUtYLll1xIG8D+92LhbWf0xHpboi9Jc9xonBQ/DTiERUG669r93yhZLSUpWKqg46q6W6I3Vye7RDW3sgdKazfYclzXXnILZIywL0mPzSdo+Zakp4+NcVGKIR8ebSepnKW8qjmhCtNf2g6G2KO5PtXaygDB4TqBvi9bPlSV/4P50/cNmjcGRmiOcju9ynXUMaQgKOWbETM06iPeS7PerKbEhmioUjRzQdrE1A+ls1GBpSxVfK8vcY2/Fry/HVh8NhFOhui/UqVROgfICrFaT5cVBR0LyQOiFVJpuYumvSBMyU/S0Zf5AIbRoaoH27TEQ4KPelDZgNuMB0GgsNMmyXvDNWkC2zZl60wXSiso8SdfZaB7WC4Re5FYV1lcwxkZ1Y6BfzASRL5QQ+aD5LIH+vy28uF/PAVlKayFluL6+LlCpUxCnKnK8i5x+X32GuYz0aGpTXZDQ4rhdodOu8K67y5SsCGW+WWJZDzkF156YylHC12dHkHt2fhtCBuQ8MqyVr2LxHsYGNrCzZoGGFLA3VEgw+QvDNNWHsnPxXWKhAaH2eyr+Mgwz7zFfBotMhlhMU07Xa0N4N1Av4urPPuuAtxpziaFmvCI2AXl8wBbpXAXsdD6T4iAl2Fv4umKkXwGy1URsQawt9lBW5cIimznzB3+VY8W0U+ogXchzgxxP51tdC/O6id5DmuzxuRhG/bH8sMQJllkpfLAhZ2PMhHmmWqAUVPkzxXPeYAt2CuxnqpXExVwD5cmUFDfFrY1qjHuAybpcL7Lafx6CMZmoNef9ZRIr+7ohxMgbilq1zTlDOe5Ra6vJPv4TuzhZ7bbLGKco6HcpFP1XWNsz3YGR1fEK6G2+3wAx1TAhzVjQ7y39bUs5z83OU+OhLO+H4TQMn41hts8pwuIIJz7/X2hHo8Ovr1374Q/g711+aAaU1AA6ziOji6Bp3iCjnIOTRdflAznlrsPeIVoW+LOhLHM20BBD54FkdufgGd4FbbLQoKxs6Uj4V1jV5GgpF2lDj2gqMVItjKTQf243Yp1A3ppClC37/URXD3krDOOh9WKB/LlIt5tmnqNh3Z0YTzTr8Kb/9rxYvB5HLIb2JXMAwbKwB/CslGTI/I5ZwZdNOIdbOPiXSJbAUEqMMR4i7h75ywU/u15W/O5nTSEW78WL1M3rSRyZ0ih8vP4sGgmHUDt2STii/8nwADANyjz0Z2SplaAAAAAElFTkSuQmCC') !important;    width: 50px !important;    height: 16px !important;    background-size: 50px 16px !important;    display: inline-block !important;    margin: 4px 0 !important;}@media (prefers-color-scheme: dark) {    .TnITTtw-pro-img {    filter: invert(77%) sepia(3%) saturate(84%) hue-rotate(22deg) brightness(96%) contrast(84%) !important;}}.TnITTtw-unpin {    margin-left: 16px !important;    background-image: url(regular-pin-icon.png) !important;    width: 24px !important;    height: 23px !important;    background-size: 24px 23px !important;}.TnITTtw-settings {    margin-left: 16px !important;    background-image: url(regular-settings.png) !important;    width: 25px !important;    height: 24px !important;    background-size: 25px 24px !important;}.TnITTtw-no-orig-tts .TnITTtw-listen-original {    display: none !important;}.TnITTtw-no-orig-tts .TnITTtw-unpin {    margin-left: 0px !important;}.TnITTtw-show-reversed {    display: block !important;    float: right !important;    cursor: pointer !important;}.TnITTtw-flag {    display: inline-block !important;    width: 24px !important;    height: 24px !important;    border: 1px solid #c8c7cc !important;    border-radius: 12px !important;    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1) !important;}.TnITTtw-dir-arrow {    width: 15px !important;    height: 8px !important;    background-image: url(wl-arrow.png) !important;    background-size: 15px 8px !important;    display: inline-block !important;    margin: 8px 10px 0px 10px !important;    vertical-align: top !important;    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1) !important;}.TnITTtw-swap-arrow {    width: 13px;    height: 12px;    background-image: url(regular-swap.png) !important;    background-size: 13px 12px;    display: inline-block !important;    margin: 6px 10px 0px 10px;    vertical-align: top;    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1);}.TnITTtw-main-variant-wrap .TnITTtw-original {    font-size: 15px !important;    text-align: left !important;}.TnITTtw-original-variant {    font-size: 19px !important;    display: inline-block !important;    vertical-align: top !important;    color: #000 !important;    padding: 16px !important;    font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Helvetica, Arial, Ubuntu, sans-serif !important;}.TnITTtw-main-variant {    text-align: left !important;    vertical-align: top !important;    padding: 16px !important;    font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Helvetica, Arial, Ubuntu, sans-serif !important;    width: calc(100% - 32px) !important;    position: relative !important;    box-sizing: content-box !important;}.TnITTtw-variants-by-pos {    margin-left: 16px !important;}.TnITTtw-variant-row {    text-align: left !important;    margin-top: 16px !important;}.TnITTtw-variant-row:first-of-type {    margin-top: 0px !important;}.TnITTtw-variant-row:last-of-type {    margin-bottom: 16px !important;}.TnITTtw-v-pos {    font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Helvetica, Arial, Ubuntu, sans-serif !important;    text-transform: uppercase !important;    text-align: left !important;    padding: 10px 0 !important;    border-top: 1px solid #c8c7cc !important;    margin-bottom: 0 !important;    font-size: 12px !important;    font-weight: 600 !important;    color: #8e8e93 !important;}@media (prefers-color-scheme: dark) {    .TnITTtw-v-pos {        color: #98989D !important;        border-color: #747473 !important;    }}.TnITTtw-empty-pos {    padding: 1px 0 0 0 !important;    background: transparent !important;    margin-bottom: 16px !important;}.TnITTtw-part-items-amount {    font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Helvetica, Arial, Ubuntu, sans-serif !important;    display: inline-block;    margin-left: 5px;    font-size: 11px;    font-weight: 400;    color: #a4a5a6;}.TnITTtw-v-closest-wrap {}.TnITTtw-v-item {    font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Helvetica, Arial, Ubuntu, sans-serif !important;    text-align: left !important;    padding: 0 0 10px 0 !important;    position: relative !important;}.TnITTtw-v-item:last-child {    padding-bottom: 0px !important;}.TnITTtw-listen-v-item {    display: inline-block !important;    position: absolute !important;    right: 18px !important;    cursor: pointer !important;    text-align: left !important;    width: 24px !important;    height: 24px !important;    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAsCAYAAAAacYo8AAAAAXNSR0IArs4c6QAABTZJREFUWAnVl2mIlVUYx8dy1Bm1hXabyqZm0lLKsogSEtEmS6nAIos+BMFYI7R8aIOoJMy+RAQVNEH5ISIrW6hoo64QwaRmkppLhY5mLgNqI6a51O833Ofl5TLLnTt3mf7wm/fc827/9znPec6ZqqrSagiPP760ryju0zU8Gz6GdfAS1IP9g1bH4WwetMO/KZ6jfSYMShnR+bAV0qZtr4BLYdBJ0y3QnWmNr4fLoSgaWpSnVFVV8xzT4xGo6+GZx7L9tRxNmaOwF/Zn2xzKq2G87knYAbnpkf7tJDXiU2AN/AUb4RPwgy+D4VAW5WvaDwjjE2gvhtWwC46A543+O9AEI6FkMjpGeiekI9tTO4yHoRoa58I0WASOwiEwdVqhAaxQRVVEOl/T6Yj3ZOQ0TjTDWnAU2sCPKlr6+KAnoK+czo18bsR5RLdqpPdN2AebwIVsBAxIhZpOR3wMDubCHBgHjl6uTqBjATgHNsB0sHIVJL+6kEhH5CPiU3mO6WD/Afga7oaTIC2DtBA6IAMTIdkypDdAdZy4C+6AmXADzAAny25ohofgLChEGlgKW6AT/gQjaxk0+pbK38B5Y80/Cq62F4IR/wd+Bv0kGk/rK3BWR4Q87gE/oB6WQZSu9DX5tiPiPCaRUb4dMvA3eM0scHRDk2gsBz/UgHalTJQbI+0Fufnm1xvt0+FkSI8QPwcsa/cSuA1awRX1WZgMQ0GtgvfBNDGIeknq5Nm0a+zoRkY0ya1uzhejy+A4f96GsXA/WONDH9BwD3Qj2D8kIh7DTV/J5SR7AR6AsRAezN3nwbTQ4NVQC+pXWAnWejNjdNxEu2w6kTddDy/CuzAFotS10/4I/Igm6EoLjk7UH8H9TSNUxLgGWuA9uAieyh45dMki8QdcARqPNF1PW+MNMKoSET/Ai5fBvfAZXAXXwChQ5vLvcAZYoqNgWFUOghN4RCWM894u7ePvp9ABRnE0KEvyHtCwHxOVzD5LptWtupLGeX+iSIeko69GJY07SW+CU2EjuJqq4WBUXSmdpE5MZZ8l28gfroRxS9x18DpY9n6A70GT6hyoBxe/beAHKLcarqg74GCsTrTLJvckL8MlsAKegQ0QmkFjDHwDu8A1Ro0D9zbW9P2VMO6k/BKM+IfQDsdAuSreDE7Kz8GoK31OBtPLj+wM406Ofk8Q7ilE7vAe7uZGzT4KV4Jlsg2sIuoCmAS7YRV0Ro5b8OMimonig2K4khNFbriUL4S5sBleAUcidCsNc9/yaX/iZzw/XLEOZTs9Ia5Us8AvzoAzPM7197iOe83vtGJb+y2dBu4XmA1OwpCRXg5OyplQDcnW0RvuAW/SZBR9zZmT2+EtOB/Mw4HIiXcLaOha8H3DwLx/Gpywh0GZ0w+CgXUUfoI4RzM/mVb3QQxVoRGfyjPWgvdbAh3pO8Hop2U9N306IAMToeB5OBDzkSpG3FyeA5Y4o50rl/8FsBPcXE2HrhThWLA0Pw/6G/kw3teLG7ngDTBFN4Grazrn+Vm4ND8ftkK+KdOXcStLM5hGR6ANpoEpU1Q5gVsgX/O5xmu414muuUWwBqxq5n0rNIABKon6Yz6MT8DJYlgNLulG11HbC0ugCUZCr4qVs9eLejlpXX81e/4xjnW9XBunrB7+d3MebAdT4jv4AizLRr1sckj7SpuIeC3X1oPG/YiSpQPPzkvW2N7MG83clTOvB5fjIs1bbbZBbrXJ0HcxDFo59Ll13m3r43BKsVxbFYotI70STA1LnnuL18D9t1Xkf6OSTL7/ADjd3Gtv8CnCAAAAAElFTkSuQmCC') !important;    background-size: 24px 24px !important;    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1) !important;}.TnITTtw-no-trans-tts .TnITTtw-listen-v-item {    display: none !important;}.TnITTtw-no-trans-tts .TnITTtw-small-copy-button {    right: 18px !important;}.TnITTtw-small-copy-button {    display: inline-block !important;    position: absolute !important;    top: 3px !important;    right: 54px !important;    cursor: pointer !important;    width: 18px !important;    height: 20px !important;    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAoCAYAAACWwljjAAAAAXNSR0IArs4c6QAAAdlJREFUWAntWD1LBDEQXUWxEEERLAQLQa0t/Am2/hALS8HC1s5KK0FQG22s/BkWNhYeenCFIGqjYunH+d6yWYaQ3dlN1lQZeNxMZjLzdpINm8syXUYQsgn0gB9g6IFPzNkGOpEtZPEh4Zqz1wWj+w4JkeR+KCnXk7YZOwOBJ+uhDmFzK3hJm+Ku2B1UXQYeAek/gu1FSibx0UmIsggMAJnjFPYo0EpkAh/dEGLRBeABkHnOYY8BjUVO9tElIRadB+4AmesS9jiQC9dRnjPvxbj5kRN9dJsQ884Bt4DMdwV7Asjsc6ZrQrss4pBZjN0AktQF4+xzpmtC16gxyUIOmcEY/YbUF5frF5Cv3wfsacAIg0PlDQkGgCvXFMZXTAESsYP+g5Cpp/62PgPUjIEBiZDWwNSh1CGtA5o/7aHUIa0Dmj/todQhrQOa37WH5Mca59vfS1rOEP/QRYhfcOUNAHo/pELLuX0XIXZoVSTitTeWHLAQl8TGiWBAgvKaZMeG2vyLp1fUyLdLVcINQSqqWkXoFSzWozIpilURMuPHiFuKRYxrxsJN5BlBL8B3k+CamLUaX35BtC+KdfGhPj68680u89IZ9ZwpK1coJBT9nKngUg5HP2fKyg7lD2CbT53FP5BAAAAAAElFTkSuQmCC') !important;    background-size: 18px 20px !important;    background-position: center !important;    background-repeat: no-repeat !important;    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1);}@media (prefers-color-scheme: dark) {    .TnITTtw-small-copy-button, .TnITTtw-listen-v-item {    filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(139deg) brightness(104%) contrast(105%) !important;}}.TnITTtw-copy-translation-butt0n.TnITTtw-copied {    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAcCAYAAAAN3M1lAAAAAXNSR0IArs4c6QAAAg9JREFUWAnN171PwkAUAPA7W5EENsPCYGLipCSMOhmJm4Ob4D9gMEQgwd3Ef8DwIVEnHDX+DfgRFxcHBx3BsJswKENTer5XaHMNbSn0ir7l3n2k98txvAIh/zToX7lqtVpcVckZY3SbUtaD9i4SmT/JZrM9NMl/AatULhKqqt4zRmKEMAItBDvu9ZRVSHawN/MTQ5SmGSgkDILCsUGAR9oslXLPc8bELFonFO49QMFJUS2B/ZnB3FAIMQIOroX5TO6YdxR9TSbXmggL/MS8o0hHlhf2UqmUirBAL/9kqPBWPn/QRhRGYDA/qMBgflEjsHL5fB0OMUEpaRUKuSeoLRoumiREoHA//aNsNBrhbvfnFmrJLod4kaRQpljMdrgx11QUCjfRv5Xd7vcporD6cjtv9PvKY6VytcSNOaYiUbiJDoM3QQY7RvXFfBjLXnCiUbi3DoM7FTUkNq0rLgiUCYPkwQbED9nigkKZsFCIluB+ffESm9yCCxKFe5sFtlq9TPb7ahPu2aINih9qSxI90jR2Pfg9xU9Zc7gi8JqxVnTrCueeCcMlE+Ccnzic8YPCR1hgOCAC5xdlC/OLE4FyhE2LE4VyhU2KE4kaC/OKE43yBBuHCwKFe+qvJEzcolA4fJMkGf6Y0k9+HfTfp61T/HPs8pFyYbfIGKvX61FFYfvQXwHURzweu0mn04oxL7L9BS7Id8XVicmLAAAAAElFTkSuQmCC') !important;    background-size: 21px 15px !important; /* big: 21px 15px */    background-position: center !important;    background-repeat: no-repeat !important;    cursor: default !important;}.TnITTtw-small-copy-button.TnITTtw-copied {    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAcCAYAAAAN3M1lAAAAAXNSR0IArs4c6QAAAg9JREFUWAnN171PwkAUAPA7W5EENsPCYGLipCSMOhmJm4Ob4D9gMEQgwd3Ef8DwIVEnHDX+DfgRFxcHBx3BsJswKENTer5XaHMNbSn0ir7l3n2k98txvAIh/zToX7lqtVpcVckZY3SbUtaD9i4SmT/JZrM9NMl/AatULhKqqt4zRmKEMAItBDvu9ZRVSHawN/MTQ5SmGSgkDILCsUGAR9oslXLPc8bELFonFO49QMFJUS2B/ZnB3FAIMQIOroX5TO6YdxR9TSbXmggL/MS8o0hHlhf2UqmUirBAL/9kqPBWPn/QRhRGYDA/qMBgflEjsHL5fB0OMUEpaRUKuSeoLRoumiREoHA//aNsNBrhbvfnFmrJLod4kaRQpljMdrgx11QUCjfRv5Xd7vcporD6cjtv9PvKY6VytcSNOaYiUbiJDoM3QQY7RvXFfBjLXnCiUbi3DoM7FTUkNq0rLgiUCYPkwQbED9nigkKZsFCIluB+ffESm9yCCxKFe5sFtlq9TPb7ahPu2aINih9qSxI90jR2Pfg9xU9Zc7gi8JqxVnTrCueeCcMlE+Ccnzic8YPCR1hgOCAC5xdlC/OLE4FyhE2LE4VyhU2KE4kaC/OKE43yBBuHCwKFe+qvJEzcolA4fJMkGf6Y0k9+HfTfp61T/HPs8pFyYbfIGKvX61FFYfvQXwHURzweu0mn04oxL7L9BS7Id8XVicmLAAAAAElFTkSuQmCC') !important;    background-size: 18px 13px !important; /* big: 21px 15px */    cursor: default !important;}.TnITTtw-v-texts {    width: 216px !important;}.TnITTtw-main-of-item {    color: #000 !important;    font-weight: 600 !important;    font-size: 17px !important;    display: inline-block !important;}@media (prefers-color-scheme: dark) {    .TnITTtw-main-of-item {        color: #FFF !important;    }}.TnITTtw-gender {    display: inline-block !important;    font-size: 13px !important;    color: #8e8e93 !important;}.TnITTtw-listen-disabled {    -webkit-transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1);    background-color: transparent !important;    opacity: 0.375;    cursor: default !important;}.TnITTtw-right-particle {    background: rgba(255, 255, 255, 0.125);    border-top-right-radius: 4px;    border-bottom-right-radius: 4px;    display: inline-block;    width: 36px;    height: 100%;    vertical-align: top;}.TnITTtw-sidebar {}.TnITTtw-sbutt0n {    position: absolute;    -webkit-user-select: none;    cursor: pointer}/* Scrollbars */.TnITTtw-trVisibleLayout {    position: relative !important;    overflow: auto;    -webkit-overflow-scrolling: touch;    height: 100% !important;    width: 100% !important;}.TnITTtw-unpinned .TnITTtw-trVisibleLayout {    height: 253px !important;}.TnITTtw-trEntireLayout {    width: 100%}.TnITTtw-tr-scrollbar {    position: absolute !important;    display: inline-block !important;    width: 6px !important;    left: 319px !important;    top: 47px !important;    height: 242px !important;}.TnITTtw-with-ht .TnITTtw-trVisibleLayout {    height: 215px !important;}.TnITTtw-with-ht .TnITTtw-tr-scrollbar {    height: 209px !important;}.TnITTtw-has-top-arr0w .TnITTtw-tr-scrollbar {    top: 67px !important;}.TnITTtw-unpinned .TnITTtw-tr-scrollbar {    top: 49px !important;    height: 246px !important;}.TnITTtw-top-scroll {    top: 8px !important}.TnITTtw-track {    position: absolute !important;    height: 100% !important;    top: 0px !important;    background: transparent !important;}.TnITTtw-unpinned .TnITTtw-track {    height: 246px;}.TnITTtw-arr0w {    display: none;    position: relative !important;    width: 32px !important;    height: 18px !important;    background-image: url(tt-arrow.png) !important;    background-size: 32px 18px !important;}@media (prefers-color-scheme: dark) {.TnITTtw-arr0w {    background-image: url(tt-arrow-dark.png) !important;}}.TnITTtw-top-arr0w {    bottom: -2px !important;    transform: rotate(180deg) !important;}@media (prefers-color-scheme: dark) {.TnITTtw-top-arr0w {    filter: invert(21%) sepia(5%) saturate(91%) hue-rotate(22deg) brightness(93%) contrast(91%) !important;}}.TnITTtw-bottom-arr0w {    top: -2px;}.TnITTtw-highlight {    display: inline;    background: rgba(1, 233, 175, 0.5);    padding: 1px 0 !important;}.TnITTtw-t .TnITTtw-highlight {    padding: 0;    border: none;    background: transparent;}.TnITTtw-ipa-row {    font-weight: 400 !important;}.TnITTtw-translit-row {}.TnITTtw-translit-item {    padding: 0;}.TnITTtw-translit-pos {}.TnITTtw-translit-main {    padding: 0 !important;    width: 287px !important;    font-size: 17px !important;    font-weight: 400 !important;    box-sizing: content-box !important;}.no-border-bottom {    border-bottom: none;}.TnITTtw-loading, .TnITTtw-offline {    display: none;    position: absolute;    z-index: 3;    width: 327px;    height: calc(100% - 2px);    top: 1px;    border-radius: 11px !important;    background: #fff !important;    align-items: center !important;    border: none !important;}@media (prefers-color-scheme: dark) {.TnITTtw-loading, .TnITTtw-offline {    background: #2C2C2B !important;}}.TnITTtw-mate-loading {    color: #8e8e93 !important;    margin: 0 auto !important;    font-size: 4px !important;    width: 1em !important;    height: 1em !important;    border-radius: 50% !important;    position: relative !important;    text-indent: -9999em !important;    -webkit-animation: load4 1.0s infinite linear !important;    animation: load4 1.0s infinite linear !important;    -webkit-transform: translateZ(0) !important;    -ms-transform: translateZ(0) !important;    transform: translateZ(0) !important;}@media (prefers-color-scheme: dark) {.TnITTtw-mate-loading {    color: #FFF !important;}}.TnITTtw-with-info-warn .TnITTtw-loading, .TnITTtw-with-info-warn .TnITTtw-offline {    height: calc(100% + 20px) !important;}.TnITTtw-offline span {    display: block !important;    color: #8e8e93 !important;    font-size: 19px !important;    font-weight: 600 !important;    width: 200px !important;    margin: 0 auto !important;    text-align: center !important;}@media (prefers-color-scheme: dark) { .TnITTtw-offline span {    color: #E0E0E0 !important;}}.TnITTtw-has-top-arr0w .TnITTtw-loading, .TnITTtw-has-top-arr0w .TnITTtw-offline {    margin-top: 18px !important;}.TnITTtw-non-bold-contents .TnITTtw-main-variant, .TnITTtw-non-bold-contents .TnITTtw-v-item .TnITTtw-main-of-item {    font-weight: 400 !important;}.TnITTtw-info-warn.TnITTtw-hide {    display: none;}.TnITTtw-info-warn {    background: #FFF !important;    width: calc(100% - 18px - 12px) !important;    padding: 15px !important;    border-bottom-left-radius: 10px !important;    border-bottom-right-radius: 10px !important;    position: inherit !important;    border-top: 1px solid #c8c7cc !important;    margin-top: 0 !important;    font-size: 14px !important;    box-sizing: content-box !important;}@media (prefers-color-scheme: dark) {.TnITTtw-info-warn {    border-color: #747473 !important;    background: #2C2C2B !important;}}/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= *//* Full-page translation bar styles */.goog-te-banner-frame {    visibility: hidden;    display: none;}#goog-gt-tt {    visibility: hidden !important;    display: none !important;}.goog-text-highlight {    background-color: transparent !important;    box-shadow: none !important;    position: inherit !important;}.TnITTtw-fullpage-bar, .TnITTtw-fullpage-loading {    background: rgba(255, 255, 255, 0.975);    left: 0px;    bottom: 0px;    padding: 0 16px;    width: 100%;    z-index: 10000001 !important;    position: fixed !important;    font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Helvetica, Arial, Ubuntu, sans-serif !important;    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.20);    border-top: 1px solid rgba(0, 0, 0, 0.20);    display: flex !important;    align-items: center !important;    box-sizing: border-box !important;    border-top-left-radius: 11px;    border-top-right-radius: 11px;    transition: transform 250ms cubic-bezier(0.47, 0, 0.745, 0.715);}.is-actionbar .TnITTtw-fullpage-bar {    padding-bottom: 23px;}.TnITTtw-fullpage-loading {    width: calc(100% - 16px * 2);    color: #FFF;    padding: 16px;    height: auto;    font-weight: 700;    padding-top: 14px;}.TnITTtw-fullpage-trans-layout {    display: inline-block !important;    margin-left: 24px !important;    position: relative !important;}.TnITTtw-label {    display: inline-block !important;    font-size: 16px;    color: #6d6d72;    font-weight: 600;    padding: 16px 0;}.TnITTtw-lang-name {    font-size: 16px;    color: #6d6d72;    font-weight: 600;    display: inline-block !important;    -webkit-touch-callout: none;    -webkit-user-select: none;    touch-action: none;}.TnITTtw-trans-orig-toggle-button {    font-size: 17px;    color: #000;    font-weight: 900;    display: inline-block !important;    cursor: pointer !important;    margin-left: 24px !important;    -webkit-touch-callout: none;    -webkit-user-select: none;    touch-action: none;    padding: 8px 0;}@media screen and (min-width: 678px) {    .TnITTtw-fullpage-bar {        bottom: 16px;        left: initial;        right: 16px;        width: 35%;        height: 64px;        border-radius: 11px;        border: 1px solid rgba(0, 0, 0, 0.20);        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);    }    .TnITTtw-label {        width: auto;        font-size: 17px;    }    .TnITTtw-lang-name {        font-size: 17px;    }    .TnITTtw-trans-orig-toggle-button {        font-size: 19px;        padding: 19px 0;    }}@media (prefers-color-scheme: dark) {    .TnITTtw-fullpage-bar, .TnITTtw-fullpage-loading {        background: rgba(32, 32, 32, 0.99) !important;        border-color: rgba(0, 0, 0, 0.20) !important;    }    .TnITTtw-lang-name {        color: rgba(255, 255, 255, 0.55);    }    .TnITTtw-label {        color: rgba(255, 255, 255, 0.55);    }    .TnITTtw-trans-orig-toggle-button {        color: #FFF !important;    }}.TnITTtw-trans-orig-toggle-button:hover {    color: #6d6d72 !important;}.TnITTtw-close-bar {    width: 12px !important;    height: 12px !important;    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAArRJREFUWAnNmMmO00AQhhMHohxy4YDYL8M69xyiCCUk78OJM5oxD4azKcoTAAfgAhwQXJAiFIUs/H+PC3km3U4v9jAtJe12V1d9ruql7ErlipUqeSaTyY3NZhPvdruoVqvF3W73x2VwjsfjO7B7Uq1WfzebzbjVav26RsMpzEteb7fbwXw+77fb7e9sl1VGo9ED2BpC/xEcUVksFjtcv4pSg7W0rqDzeLlcJoC6JfeKrpMkuQ+YBLaOMrqv81oBRVF0Cre9l84yoQgDO0P8Hoo92obNN2wrIM4Z3Big44MIlQE1m83uwUYCG+dgGo1GH+UnbatJLRCgv80BgHkm90jPAaFzijCr1WoI3Y/ydJ8DoiChUA3xe4qfKqFQ0+n07nq9JszjQzr3gDggXY50bTCUCwxta4HYQSguSzzVE7ZZXD3lo8MIRID06RIfKB8Y9dD8yyuuLqeukJDnekhAXaBCF4UVEMFslm0R24Y10CEo9uPI4SII2sOcgGgUXtBu/ewDzDFrFtcVeTYqZ9mLgK7WQWXlfGGoQ51lWWU21zh3vkLuBQx/vigfAkNdXkBqYBQ5h/sivK7tpdQiZO9wIA98DmRnIB0Mw8SnLWJSO4UsL58BjC6feuuaeVp7KGBjdAqfFVABR4c11EEgFxhZNYbD1QoqF8g3hSCYYexBKCOQQaFTfp16N8GEzyZ5uVBaIIPLnWAkfIaQG6H2gLDPXJ0knzDY5OjioBRCvJOtbbYNyv/bGLmBlQVDQ51O51u9XueB/JFtFjz43mu7ChnmzE28YYwocCbqn8/IeFNtOnrwOt/jG7TyEGBOLwOGkJK64PKTQNM2GF6zLSHbSCcPyiJenUWfriYUPNKHrWw+9Yey6vsQPlKd4BsRYwq5KEbaUPoHq16v9wVT5bl8sIITYh38f7/3F3TAWI3lI07YAAAAAElFTkSuQmCC') !important;    background-size: 12px 12px !important;    position: absolute !important;    right: 6px !important;    padding: 10px;    background-repeat: no-repeat;    background-position: center;    cursor: pointer !important;}.TnITTtw-fullpage-loading .TnITTtw-close-bar {    top: 8px;}.TnITTtw-translate-selection-button {    background-image: url(icon48.png) !important;    width: 24px !important;    height: 24px !important;    background-size: 24px 24px !important;    background-repeat: no-repeat !important;    position: absolute !important;    z-index: 999999999901 !important;    cursor: pointer !important;    opacity: 0.75 !important;    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1) !important;}.TnITTtw-translate-selection-button:hover {    opacity: 1.0;}.TnITTtw-translate-loading {    position: absolute !important;    z-index: 999999999901 !important;    cursor: pointer !important;    padding: 32px !important;    background: #FFF !important;    box-sizing: content-box !important;    border: 1px solid #c8c7cc !important;    border-radius: 11px !important;    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.10) !important;}@media (prefers-color-scheme: dark) {.TnITTtw-translate-loading {    background: rgb(44, 44, 43) !important;    border-color: #747473 !important;}}/* v7.0.0 - Mate for Netflix */.TnITTtw-mate-subtitle-wrap {    position: absolute;    z-index: 99;    bottom: 10%;    width: 60%;    left: 20%;    font-weight: 700;    text-align: center;    text-shadow: #000000 0px 0px 7px;}.TnITTtw-clickable-mate-subtitle {    display: inline-block;}.TnITTtw-clickable-mate-subtitle:hover {    background: rgba(255, 255, 255, 0.50);    border-radius: 4px;    cursor: pointer;}.TnITTtw-netflix-buttons {    display: none;    height: 60px !important;    border-top: 1px solid rgba(200, 199, 204, 0.5) !important;    width: calc(100% - 16px * 2) !important;    position: relative !important;    user-select: none !important;    transition: all 250ms cubic-bezier(0.215, 0.61, 0.355, 1) !important;    background: #FFF !important;    border-bottom-left-radius: 10px !important;    border-bottom-right-radius: 10px !important;    padding: 16px !important;}@media (prefers-color-scheme: dark) {.TnITTtw-netflix-buttons {    background: #2C2C2B !important;}}.TnITTtw-netflix-button {    display: inline-block !important;    font-size: 16px !important;    font-weight: 700 !important;    text-transform: uppercase !important;    text-align: center !important;    background-color: #EFEFF4 !important;    border: 0 !important;    border-radius: 11px !important;    color: #01E9AF !important;    font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Helvetica, Arial, Ubuntu, sans-serif !important;    text-overflow: ellipsis !important;    white-space: nowrap !important;    padding: 10px !important;    width: calc(50% - 10px * 2 - 2px - 10px / 2) !important;    cursor: pointer !important;    transition: all 250ms cubic-bezier(0.23, 1, 0.32, 1) !important;}@media (prefers-color-scheme: dark) {.TnITTtw-netflix-button {    background-color: #525251 !important;}}.TnITTtw-netflix-saved-state,.TnITTtw-netflix-saved-state:hover,.TnITTtw-netflix-saved-state:active {    background-color: #EFEFF4 !important;    color: #6d6d72 !important;}.TnITTtw-netflix-save {    margin-right: 10px;    background-image: linear-gradient(145deg, #01EF92, #00D8FB),    linear-gradient(35deg, rgba(1, 239, 146, 0.25), rgba(0, 216, 251, 0.25)) !important;    color: #FFF;}@media (prefers-color-scheme: dark) {    .TnITTtw-netflix-save {        color: #2C2C2B;    }}/*  */#TnITTtw-tooltip-wrap {    position: absolute !important;    z-index: 1000000131; /* 1999999999 */    font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Helvetica, Arial, Ubuntu, sans-serif !important;    font-size: 13px !important;    line-height: normal !important}.TnITTtw-inside-layout {}.TnITTtw-content {}/* iOS Action Extension */.mate-ios-bar {    position: fixed;    background: #FFF;    bottom: 0px;    left: 0;    border-top-left-radius: 11px;    border-top-right-radius: 11px;    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.2);    font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", Helvetica, Arial, Ubuntu, sans-serif !important;    z-index: 99999;    backdrop-filter: blur(10px);    -webkit-backdrop-filter: blur(10px);    width: 100%;    transition: transform 250ms cubic-bezier(0.47, 0, 0.745, 0.715);}.is-actionbar .mate-ios-bar {    padding-bottom: 24px;}@media screen and (min-width: 678px) {    .mate-ios-bar {        left: initial;        bottom: 24px;        right: 24px;        max-width: 45%;        border-radius: 11px;        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);    }}.mate-bar-collapsed {    width: 100%;    height: 44px;    display: inline-flex;    align-items: center;    padding: 0 16px;    padding-left: 0;}.mate-bar-langs {    color: #6d6d72;    font-size: 16px;    font-weight: 600;    -webkit-touch-callout: none;    -webkit-user-select: none;    touch-action: none;    padding-left: 16px;}.mate-translate-button {    display: none;    color: #003e2e;    font-weight: 900;    padding: 16px;    font-size: 17px;    text-transform: uppercase;    cursor: pointer;    touch-action: none;    -webkit-touch-callout: none;    -webkit-user-select: none;}.mate-bar-settings, .mate-bar-langpicker {    display: none;}.mate-bar-buttons {    right: 16px;    position: absolute;    display: flex;    align-items: center;}.mate-button-shutdown, .mate-button-fullpage, .mate-button-translate, .mate-button-settings {    width: 22px;    height: 22px;    background-size: 22px;    display: inline-block;    margin-right: 16px;    filter: invert(46%) sepia(5%) saturate(310%) hue-rotate(201deg) brightness(90%) contrast(86%);}.mate-button-settings {    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAALKADAAQAAAABAAAALAAAAAD8buejAAAIEklEQVRYCb1Za2xURRS+c3fLrgQUiNo2IekSlWCMChgfQCjKH4n+QGOstEKJgVACWhWF7ralLH3tYgWxUbQxxKAEscYoPxRijAYQMKikgR8aCWZJCLSQiFCCW3b3jt+590537mv3FoqTbGfmzHndM2fOnDllyii3xsaOmZqW+ZLYqmrJc52dTcdGU0TwephFo60Pq6pyf0VF6ad1dXUZmQfnmTcwjxCM8+wadItpLFpPT0/J6dMDSxhTj3d0NP8q4H571S+iwGtqan+EMe2ApmnbU6lznwg49ZxzxrkyW8Awn0MwMaceNDuJVtOyB+nD5TU/YwszPwQQskJRtJ48LtukqsFdUKIM8FVQe2F+jUZsD5xjW0kJH8hmtRp80DqxzhhbkUhs+EjM/fQjdolAQO3L5TSJN2+AzzZIANuQPiC3MGNxHAMFxu+zIRedFnSJ3t7egJ1DLpe7yw673jnOgYNXPP5jQSN6ukQsFm+DBWLY4kOKEloWDj+Wunbt4CLOtfexrbder5IyHWPKZRy+1WPGzN2dTv8cUZShj+FCsxjjiUQivl7GFWNXhcmyx479PgRlTQuzHJj8C0XHCcLR7KH4FRjnFlnezJn3hqqqqnJ2Oa4KE1I0Gt+PrtJO4D1ngxB8GOtnIPicgcfK0U82Igcf701rXcFh3I/D+LgVaswK+EtomaJc+yP/1W7kBGMD8MWXysom/lBfX49dcbbu7u5Qf//F+VB8KX5V4OlpKPDLcT5muZOLAfFUmHx2aGi/DzfgpbBI2EtZEmOu7cVwL8JiF3ZiM+LzPEMFx9+rJNsBNQGeUcI4YF4+q74Hof8Iprkcf5usKOaF+mSy5bdQqGU+LNnljsfHk2z3NVCJBbp1cLCmG7GR343xh9g+RzSANVfCv3oaGze+qml8q6DHaY8lEi1JMffTx2Ib62DpD+24MMZl6LEyEAicQsyfTrEf1/hRwtMVNpTVDkDBsJ3YOmddyeQG/aaieAmXOQGaaTojnHTGSqYi2TEPnJXSaxaNbnwLPr3Wa93kncZtOpdyD90lKJEppiyd3HC4JSoYx+NPZDkPvC7moB+HZCch5n574km8C+GTboj/DxCOrjBlXSD63JuIccaCa+JxJt/JSjK5fh826RtBB8a1tFti7qcnnth+ZHiMe+HDRXaTjrSuK0wpIvxyERawPc4GeK9XXgs3QArJzEwB38X4u/YMzcnRCqGDSDKsUDFjm3DrVYs0VldYLAWD6i4xlnsw2yHP5XEi0fgn5t0CBmVnxWKtNWLut/eSQZmgzMOicCbDSuVFY8wG6VJwwvOQCRNCbTDthTxE2Yq8eWE83u2IMhKOZWjIYIMWICZG2pqHDitsbCPls9aGLz9c6FIg7Gg0egldU56S357LZb9Op/8+2dzcNj8P9x6RDJLlxNBWyS7G6A1GTxkA5wA5YieA5bbDvz2vSoHf0NBzG2PnyMolAmb2uK7V7xG6sja423Q68CpcFlLQ4xAO/pag+WCMuCCZIJHIeGPQCmPnZ6GzK0tLuAG1p2lwAy0Cg+KXmTPsEjfA7H8lDdJTvJBLwHaUIhZtnN95BC5B4c1u5dF1CTO+LibHRjj6Cj5ke0Qqk4tqCwTGBl5wUfZ8MBiobm9fXzDKCP7ILfbh8rH5MNuDHOVZCvCEN+wSBkDdJohFDwazi2ViyWQSB463Cxqof4Hz4DPh8KR7/CpLMkhWnocxQtrwgVCWIJZ8mJ7iztctH0/JN3Apn3Vtly6lWyDsDrGoquy1zs5mPO/9N0OG26skOCBzGbYwATMZXi0vijGUWSrG9j4W65wKb3pFwGGNI52dLZbbSawV6r1koOBiuTV1hal8BP/ZDf9tcGMKZlUUr93W8Ix6B3TmQWNcVQP17njeUCRMD5EMdwy+FiloL+lI67rCVOvCoaND49GoBJXdEo9zy45Eo20LIOipPBHfMdJ6GfGE/2/GR+u5eZ6XPOLPp1L9tQTRFdA05QSuxbSMYh/jg+al063DLwr6YsZysK5obDAcHhsTM7898STehfBJN7jdccLRFUZ69wuyIhCpdYFA8FGc8hogXXYy4WvpWUPwVGpgNayrvzZMvI54fF2/k8YbYvByvjZItqqq1dAFzza2gnO1knQkTp7b0NjYuhiZkp40O0XSI1RD7FYm6EwYO1VePvG+YkmS4ENuYOyWU1nCgbJLcHB3Cny5t/ikvEDlI3yPI90zcLSXhbLGXH3Tr7J0eIeGWnGRuCsL614xZMva5MeWOJwHK4pR61LGyjC3MbZsANYeosDvpTStiUIKwlSRQooyNpv9aQpknXST56kwCnPbQWDW1txIDRgOTCms/e3ZsxcH4ZOUz56B9cyXs1GqwhpuMLdLwckXvFQ87Ul2pXPVw4ftxUBskwbiq2B2U4qBputhN/PFR69ioKsPU9UQdzhCGFUt2UEUNKaFQvMmYlzrHj3cbFEcZkaDJeFw5SRFGUMR54AhkyfcKpfE0TNK0CJZ2k6IWwfXNx/x1Uv8nI3VoDDzmQx3kymvu1pYINiVJTis7XoYBM1IeipF2fHdZMo4BRWWEcVY03IzxNjoWRceATOQoS3AhrlkaAQLPAmcB7G+Saalupk89zMuECXcyXFF9uHux1VJdTj2hai1ETYixneIFH9hGKE5WkpOvjE/jn9FVICWijaol6l9OtYI/ozYwnRF0lWJA7h8ypSyF2VZgKH0k3+qY46XrrUEFYmU10LRZWZx76hM72dc8ND5YWDHudn/uv0P5TxNFtnZiDUAAAAASUVORK5CYII=');    margin-right: 0;}.mate-button-fullpage {    height: 21px;    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAmCAYAAAC29NkdAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAJgAAAADF1tjNAAADf0lEQVRYCe1YQWsTQRTe3aw1Vo1gpVAspgXbXPwJvRT15kHw4NlT8ZKjJm1qp8Q2iccclJw8CoKg4E0htNR/0B5aYtMWJVDswajF1OyO35vdyW7apBkNbEUykM2bN2/e+/bN7Lx5T9d8LZFI3zAM6w7negxswzckSRvEqmGEcgsLqc+SqfI/M/P4sm1bDyF7Db+WunWdr9t26FU2O/te6tQlkUyyHOfaA/TrmqaHNI03xqQM+BxKLMhtZTJz4zo63lh7iuONk8n5DV3XRkC21Q2bFrSYsJPLZucSpBHCmkaew2CBaDR6uxbgxBjxafzi0tLKi+Xl4p7gdnhYlhmzbf7IndtJN2mbmJi4/mFlpbgpXE3LCiY8p9J0esv9wcELWyrSJGOaw9v428d701yVVncxOXvB2XPkepXGy4ah347H4zUVaZJh7N5PmoNVKqvN0UPud0DrLRo82bznBgbOnotEIgeHFU5NTf06zFPpLy7OvYPcGGNFc2hoo2mZq9Vq397ej++eHsKii9WVAL0xlyJwfwvmiDIfg7HJI1upUChoAOiT8kiB0uv+e1QPYLdrIj2ICNF86FYq40qHcLcAWs8XWChqyZDD1yhCOMLirCq12sytlXXPpY8RUeajPCddLKukWXjQMMwshS/HFMf5Frrv0ME9ETZhk2zjCSwU75usU7xMpdKxfD5/umkgwA7ZJgyEJUCzPVM9D/Q80PNAzwP/tQcaIQW32lPb219ifX3ndxiLV0/irRnLRw4Ovl2JRi+ty9u8AIikOmrb9SKC9ChuFci+Qnczmdm3QYJMJtO3OLdf4qpwBnY3w+HwJGOJHXGbQcY/A3BRF1CYc+tZkODIFtnENUteVEZqtVqK+AIgbg9jHi14w7TkJBBEc20Nw0nyAm24mBwG7mKNvRgEIBUbEpNErDLnRGR6ALt1e9vKApUjKOP3N8r0uk2mWn18ZMtvx09LgG7a6eUCVCs5Wo6ooFTHSpRU+YuMfoXt6Onp+ZsowT0tlytX28l4/ENpJ86fdZxEiqUxfVTTrDd/klwx9jwMcK+RVmKuSuOWg8k9B6nsimnSmx00cCrT9e/ufh3pINgYrtc/URDohxMUS3ya6WJyzkFaLpyET1yNqD41VxkalkQJWBQ6S+l0asPjH0+5siXYOFY3tGCcGpWAnTp10wGtVkTna5ToB1VE/w0hY2CTBypj3QAAAABJRU5ErkJggg==');}.mate-button-shutdown {    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAoCAYAAACIC2hQAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKqADAAQAAAABAAAAKAAAAACu2vZrAAAHQklEQVRYCb1ZfWxTVRR/97VbBxsgA6aOkAwlomCUaYiKgEBwRo3xD2WGuBj8wwCKmizZaDs23tbZD50kzggZiQkEE5JNTYwxDuQzTv7AwDCEEVQkGMO0GxtsbGu7vnf9ndfet9tutB1su0lzv8495/fOPefcc2+ZMoFF0xrmhkK3usAyxBjb4vPt3D9R7NXxMtI0rjY3N9uS19E4QJ5UFMYxl8M53+d2f/REMl1jY6ODaJPH0/UzXgDBzOn0lITDtb+fPdsx6HLVVcrMNY0Z6M9XFM5oHBrtZSy6QKbx+/2zOjt7/giFavtdLi2wa9euafJ8qnZGQKGZe10uT6ui6N9yrjwIhtmcG4GqqvoVicxNjPEhEzCBt8qNG6Ff0bkfv+n4bQsG+69WVdW+YhGkaKQF6nJ5l3A+3MGYsQZ8cgUvxpQeXeczRT9drWmNM7FmAT7UTrSoAZbP03XloNtdW59ufUqgO3Z41nAeuQCm+fhljzBjYc7V0zk5K4+MjKVuadoHfdiIJ4kKgCVN81zDUMqdTu1QKg63BUr2qOv6D/Ji2F0EQiJ2u/qe31/zoqatjcrz6do+n7sjK0tdho8+D7gDI/ScbLUEYL++naONCdTprFuuKAbZI9mSWQCSGF+AVgrr66u/jA+Pu/J4an5D2CqGb+5JXgwlvDA05NmRPE79UUDJExnjLfhZHgkGIYBuLyq67ylo5fpYjMYzho/mgUBNhaqqb2DdkFgLGXmqamyHzT4vxkQ9Cmgw2NeIBXPxi88xMFL3+nw1qzdv3jwsFk5E7fXWNKsqexnABwU/yJ2OUNjsdPpmizGqE4Bqmq8IY2XwRtO7yejx8Z0Ox4LtpAVaMNHF6915nDG1Dnwlm2XZqhqpkGUlAA2Hw58CkHXq4OvCNputRNPeDsmLJrrt9VYHwPMMKYZ4Q6Ok1Q8RGucJWRZQDM4BsJdAkBWbZGHUB+A4lwXxZNaIBttIMUIGnA1F3yT6FlDOoxtpRkygxtc5nFJ/UpuIBueh0R/juQJk8WmGob8rhFpAYYLvQJvWyYMFJ/1+V68gnIqac1sTcPQLWQCej+P7UeqbQDXtOI41/rBE0Gez8d2iP1W13199GFtuOS1MQcVOLyf5JtBI5NRjGLQcBsRIOuynpwpgohzeLvXzsMtrqB/fen0R1CwV3uf1Vv0nDUxZU1VtrcAiHc1sKQk3gSIpyIdNmllNHNHNKUM2ShC/jh21vB8maQZ+Eyi+gE4ih7SmS2pn1MQWYU8s80IsNG1N/vgM+bAgHMqKPohEs2hhfOuVPkxaxyOA35MRV4mooaGBEhhECSvE2Q2DBSWSDJsGNJhgiObxGgfKroFLRHCCdgtEO9O6oqJiICdnJvJNbto2UsEy5Ae/ZLpe0EF2IX5WQoT2vzRnbg0Sg2uwUymZZQkJgWCSrta08h7QzKecMn6HSrdkjHlWhLNGNpm/icjUqK7bgkBunfEYH6yurnucCO6k3DlIAFL5KiET9gnl8RGgOIH+xKAVR2GvjuFhY4NYMFW1pgUKDYM/IMnDKWVrpb6pUWoAXItwBGiX7kcbaXwqSzgcehUYrBhKOBYuLDhOGCygCLQAygcEMPhdAe5N60V/smt61ECIwzVEzjf4EZGsW0Dt9sWnAMaKX/iaPHT3xOLjZMNUlHPnLm2BcqzrN0zxps3G9gvJlgOdONGir1q1thvE6zBJW4/CHEePtl1tazuGW+PkFbrzRyKD30OCBRSyL+MS+L6QammUBoqLH9mHSrq88Vw8y+zFi8jTND8ZRdOas8PhnpNQEB0Y8cIGoNGtokd1AtDS0lId95dKjMPbYgUmMF3Xo4fxGEFPORNayKxCoYvHUD0ExvFdpIOHtzsc1QmHRULOJFDgAWs3Fr8lGTZ5oh0fsRqnzc+C7m5qupZ3dfV9Bx7PkjJivCg/4DC/7KW4lifkGwkaFYKLi5eQbZzDT5xW8ZPCaHU669+8WwfD7izu7u4/AztcOQISPcaHVDVrfTJIwjWmRmmiqakp68qVTmwDpVxcyqzoxYR3IhBvRUZ+hGgzLbG7euQz2OPrAIit5pYzEw8c5SW4Pv80Fr/bAiXiQCAwo7c3hAuXsgxMc2UGEHYLwig7OogbZAs91cjzok0eHQ73vob1ZTCnZzCOXUz4cPiFMmi3s+fAo12sS65TAiViCsTt7R2fA1QZujNGMcCjGQBQogs743i8VShvQNrI6FF3DsbJbEBDcXlUGQR9N94O1qW7lqcFKli73XWleLz9GH26/48lVJBmUNOzpWIgAfnC4cj3xJ4kUy/LGCixiWn34iY40yfowr4YzCHRzlKJg5b7ARAa5t/AaSpxL4OtZ1bGBVSwpCAdjV5agQeCDdh2/HgOtpCOX4oiuMGa203/jEQxp2KOYmQbPuwrh2PaIU2rNJNhwS+T+o6AJjOGNy+y2fQCpGiF0BZ+Sh7A/YN2J87ra7Nn5/1VXl5uPS8mr8+k/z8WG89tB2zZQwAAAABJRU5ErkJggg==');    height: 21px;}.mate-settings-title, .mate-langpicker-title {    text-align: center;    font-weight: 700;    color: #6d6d72;    font-size: 17px;    margin: 19px 0;    margin-bottom: 32px;    touch-action: none;    -webkit-touch-callout: none;    -webkit-user-select: none;}.mate-settings-collapse {    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAeCAYAAAA/xX6fAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHKADAAQAAAABAAAAHgAAAAAefafCAAACG0lEQVRIDb2WMUtDMRCAkxZ0EAUdxKIgxcHRQedacXBwVHe3qpOOPmqttS2dRFyKf6GuDi5SafeCo0gnFUGQToVW6Yt36csztc17SSvNknt5d/flkrsjhAx5UMErFArBSqU6Hw5PvcRisW+x/h+zZWVCth1o5HLHNQ5MJq8mGo1aiRC2RCmtBoOBzXT65GlQGGOMWtbZBWPkkFLyBZ+7AXTabNZ2EIYyKC20WnYxHj9fxO9+RxuWyiMMfcA8QilLcCDQX2XHoBwaBPoLYzHZLyH0LYgL5fJDNRKJzsAuViSFcfjeikbXb0ul4qe07imqYHBV73BV2zxC9JDJnB7A4rXszTRSH9ga5MWzm6UI0jBQJpKubQewX6guDP13AU2hJjAlUBdqCvME6kChdI4A2pH6TjZigvS8755HijAxPKKow78xoYezH4zryAYqWQWV9XVg2kBU9IIC7AOKOqI6RnljbuHLi6YybEbbRAvoFZ1Dmtbtvb5AFQyOsS6HBXpaDd8T6AHDRrwMUOPeqwT6wHidZbOJfVNozzrUgYnjNNFFmy6gqQN0YmLTATQxRJA8dG1doK6BDPkr6/hwgZaVzNs22ZOdQEJgNiobsawrZB/oKgfCU27DttmdMMK5H5iw94De87KAzjQnlAeFOfasV8lAes1y4Ojo5A3E9Ogo40PY6BjlzQoZTsiBksu2X/4QTrl3OKynvtjQ0OYfDLEOEf9fKSwAAAAASUVORK5CYII=');    width: 12px;    height: 13px;    position: absolute;    right: 20px;    top: 21px;    background-size: contain;}.mate-settings-buttons {    padding: 0 19px 19px;    display: flex;    justify-content: center;}.mate-settings-shutdown, .mate-settings-fullpage {    display: inline-block;    width: 30%;    max-width: 130px;    text-align: center;    margin-right: 10px;    color: #6d6d72;    font-size: 16px;    height: auto;    padding-top: calc(32px + 10px);    background-size: 32px;    background-repeat: no-repeat;    background-position: top;    font-weight: 500;    filter: invert(46%) sepia(5%) saturate(310%) hue-rotate(201deg) brightness(90%) contrast(86%);    -webkit-user-select: none;    -webkit-touch-callout: none;    touch-action: none;}.mate-settings-fullpage {    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABECAYAAAA1DeP1AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAQqADAAQAAAABAAAARAAAAABn7XS3AAAFS0lEQVR4Ae1cTWwbRRTe2U1jB1UKUblwikoPUJpyQ+JGuIGi3gBxRSgnBPRQKYkTYIHE7gFF9MAB8XPm5xhFcEEKEjdulJKgCgW4IDWtSmmlOrG90+9bz1oe77pe27upnL6RVrs7M+/v2zdjv9k36zhSQgRUJw6l0gcvae2ccxx90nHURGd7t3utdU0pte157qXV1Xf/7NYvi/qVlY9ONRqN89DzKcg8lp6nvgubdpVyNsrl979vp2sBUSqtPR4Etc/ROIdDozNsc9z2zj2uA9CAyLnpusdmy+Xl33r0H6gZes5Azy3ImoIsltQ6giYADW3msQk956Hnvy0mBEHr+mWt1YusRFF9gkAalzR4QpNQ9FtW5FGCoE7ek0a/1CBQF0MTPnzaCj1/pe1sCxnRE4LAeVQp7bFymAI3GgP96UjAMLw6aZs89WnUU8ZQhbYCjCnaTkYu5wSc57IAoV0zCDlov8/iOmuexuY5YkB3xsToNEdbBtpiHNbBZqtSKd3IgJ3FwvDk/EAZWRXOhefgYvokGPMmHDsRd4x1TixBdN/7rEkPd3P+KBaPv9K7/2A9yLtavbMF6jM4GpzO0nKCnXjw2ppXaDsxABBqorORjA0IV+A+P6URBLetua7aGR8/8bXvv3knDc0gfXz/wnXf//S5g4MbrwWBxs+nTvXzCf2eh00EzwICdZzgJ+476RCESsV/ZxCF86QxQH/Rj4ylJf8SwCAQicVCJ7HHQ1IpQJgHLUAIEPaYF48QjxCPsBEQj7DxkDki8gj8va7hOiGm0FiTUGw7EqVpSxgPddqDmErX8D/b2cGRVDzGDkkNo1hnbImtt9B2xBrbrud5nyDwuAnjWqEtGnl9hQHUKBqdpPPkZOEb2mRsC7sAgDpt5zqry4VWrjECl6sRAzT+jHB3Ns8oMpJ1WOeFhYXbtIm2RTIxJK7S9thiM5fClpbKJ6KOR/VMG/NYSjyqeIldgoAgIAgIAoKAICAICAKCgCAgCAgCgoAgIAgIAoKAIPCAEeCipu9/9sgDViN38cjBOr64WJlqFxS+2llc/PBZvOz6Cg0zWPdHKrH6USlvfm1t5e/2zqN+vby8Oh0EjS+xpD+LdDm+7LmM3LI3Ll587xfVbKz/jspxdIiSyxoA5K9CYXrG91+vjjoA1H99fX3i2rX/mR8+jSN842Ve8OwXi4WnXWS5vxUEqtAGAumYL3lqf/+f3PIlKeQwy97e7Zch7wkcrdd+eMGDB6+L1er+23z3ieGQ9HJUNQDG2cNUNk9ZTVsUElRjBY7hzDAtoIgjKT0AWxV0IUY2ohXGlqQs3RCDJABG1NTh1BYgDH4ChABhDyXxCPEI8QgbAfEIGw+ZIwweUZBlw2PuuP2HO18SGzsqmcd4GFuZKJZh9CBbmTpUtm4ZdNxl6I3/4pZ3oI47AM/AwK7bfyxO2DyMPVZetbp33vc/Rkbehet2ezZ34P0YZGyBW7i5Dfol/W1OFGZsstpoOzEAEGoXUVgs5RR1BMYCx+LQ5QaMn8QuvO/Q/EKXLkNVkzdl4CGxIJJMjQM37MUK6hB0qV1GnxtojQERo0hZAcYcbrN5pCkansyVvO+QTqlq1I3R54Zrds1vwimSQtSoc99nRHvjfRP1IMiap7F5kxiErs9d867r/JcRGExf3o524fewra/mJk+1DaJWunRfDNo601YAyy8bzLM6BIIClBo7i4YfTF9+NiEhY7+NU/ySn00gzS0wfzXenE2N646R9y0jqy8dDU04U9BW6PlM9MBic8NwH9JwdpjkHsttzgaDFpc8PqTRYv6wX9wDBsoDzYlRF4QAAAAASUVORK5CYII=');}.mate-settings-shutdown {    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABCCAYAAADnodDVAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAQKADAAQAAAABAAAAQgAAAAA8kRHQAAAL3UlEQVR4Ae1bDXAUVx3ft3vJpdgkDR+T0DptcLAQWpWAg9hROgx06lgnVcYJxSlY62AGRazBlMsX2XwHoaGTYmtGShGtAu3oJJ06MrW2ldZWban4UcBhZIq2hUaTCqHcctl9/v67t8ne7tvcJXeX3I2+mcvue+//3vv/f/+P97WRpP/xpEyX/IcPH1bmzy8vW736Dv35549cni4+2HQMXF/ffKdh8H2cSzNpfMbYD+fMyd9UXV095UDIUw1AbW3HjbrOD0P4a+yxOefr3333Yrudn8pnygDo7e3NIbOOz/zIGug8B3TOsfHON8RvK0k0TiJ0idIk7QKNjS0fiUSMTsakVdCqAnN+srAwuCkUCv1HxERtbfPD0PhG1AXc9ddeOzNvy5Ytmruc8nCbL8BtHsAY85D9O/DbvWTJwkcqKyt1EX2iZU4tJNrGpNuxY0d+KNTcDeFfh0Y/A8byUAHt8LUXLmiH/DpjjAMjv1pxeW1ty6d1XXoCtTdEKUolyXjo2LETr6Huk+JWiZVOCgAKYkNDl09D2PswDMyej5o+gJChqdtDoc4PJcZCIlS8CsAhjbqNzffNKHwJVrV3586dH0ikJzeN3ZG7XJjHYKyurrkF2vg5tD4LRL66VBTdjPDCjiZeONshvKM1Ac+ZYUj3Dg5eeqWhoZXcY0IpYQBUtacA5tYH7TbSoE6tO0eEeRv4vVdcXPBnZ3ky7xD+KLD2BZvcCjRlum68BgWtmshYCQGgqrtma9rgyxD6jvE7Z7phsIgss3v8gtn47cW1s2bNeBDi/9aqZVxMJSkAoQDWcKSuruVuHxpPcVwASPOaNvwMOl+A1j70LBqJ2VFZzlnc3t7U5xkpiYKamppLpaUlK2EFDdA2zRI+kd92CWN/bW3r5xMZ0kcgq6mq9s4Ih4d+gdxH8RsNdK6ODVjGgCzL67q6tq/s7Kw76apPSbaqqirS1dXULsuBhQCinzrFdIKxPQkyMYlz/VAo1LraU+sqGBcATXvnp6C/Bdr3pUPdc3l5BTd1dGw/6Oo7Ldn29oY3AcQaAL4RQRmWYFufczhzVoLCjH5apzhr3O++goVCLZshXIUV8NzNLD+EX3YvXbrodlWtHnRTpDsPwPcyJt8KHv6FyUnkEgCA50Qi/JCqPkZrFGESAlBX134z0NuFjn0CDmcIdNWdnerWZFdiQq4SLOzs3P5yMBhchrhwXmwJ5mpzoaad3eXXpQeAnp6eoGGMHIT2AzS9iBsytaOjabe4bmpLVTV0lrHclbAEssIR7+g0RfJvICh+1lsniOrnzg19HaZzEzoUBj2U74EPNos6m64yBN6/MRZAwGMR8CAIjOQixh7RRirGAlT1e1dD8/UQUtgJyv8YDC7aOl2CjjduR0f9n+CWm0ETI5PVhmONwOedOXP+q+4+Yog17d/VAGAmfjHl1nTDI4qi3KWqlVfcnWRKHoFxH5T0pFiBpFRD7e7uvsrJ76igqrobBxRGjbPSfgd6mHVYXVtb4ym7LFOfwWBBFYL3RbiDO4CTrMUDA8ObnLyPAhAOX6yE5q/2TnvmFPPPkpKih50NM/WdpmRYbJdXDpNjA8r8mpP3UQCg/Q3iqYTTIcf2VK7tnQyk4z0YLO4Bz5gaPbEM8vIFWOMstcc1AbC2kewWVLoiv2lGb5eXlx2wG2TDU1Wr3kcceAC8OhQ8yjliAV9v50wCHFKuQ6Fd5njCm5h0YDoXOw5mJvSam5v3uE8whMz8briCucaJIsRXIC+Y+iQ5EJB/PKGRM4RYVbe9jZj2a7iCYHEkzWpsbMOmCiZCSIBwOVZ9AvNnJ1pbt/81Q2SaMBsQHita7jl8pY5weLKMnjKQmA+TKKSMM8F8dPxedJZl27uiyNFDFA/ntHn6BJXSAab54iaJIvc7d3k25VtbG05CicNenhksX1pO5fRS6iWwSgIB9nu/umwohwtAjxLJ4IpvdDTP55EMFAPo9Fa0n5YUJf8fRJTl6Sz4dwFgSlQA2ZkMEwEA3hkA5UZT033C251sAgRyDEJOc8pz8g3LkJubHywkFwAAPDodOkmkC2QnMSVZmZGHvDOcJUg4HJ5JiwLsjpgHAKD2fjrkBeBh/DwaoWV4SUmJaM5Olg1fOWTZmAHB2SWAIPARjo1R6hOAfQW9utYcdJLD/5CmFaevHLm58jBZALaO3nUwvGZG6sWXJJzjHYZrPUp9AwwEX9PNYKa5X07HeIh/+WRdor41jV9EEGRDqPSYJMw0gMPRuaKGyZRRXMHBxUacL3xOljnOFdnmvLyrFtOxVjL9jtP2eoLaXU9BvrR01gUsE9lpELhN0qSHj9Bt0Dvuxsnmo8H1afRDv7QmWFkZ5PMshwHJW3TZAgvgvqc8hmGUp5W7NHduHX/xG73DMCzz2RtULufmBk94CcySESyTcTGSvWlg4NJt4D4okgAWYAFA5+ogeEtAhHsB6VOq2k0rxaxMuDm7Ey7u8X9yeUWhK3dYQFSyZ/D0REoKhJp2Mc6VeLSHDHuoqrm4q4CLewCgAJiTk/8CsRwFgP0K74JAyHQ0B4rZlyKRdhzxSaIvS3Awyo7b95kmAEVFef1AJewVk2YHXpHa7328o6SjBNd734L5e6waY+GIX3rcHtMEYNu2bbQY+hl+gga0YbrSZjfIhmd9fdsyWO4XxdM7gRL4iS2HHQPoY4N9KBS4AV0rSXdhUbTEbpTpT10f2QmeRcqksl/iGm10bTMKAG57n4UbHBObDdd1PfLdTBec+MNHUhS0V0AWoTIR/nFpMpZGAbCKlFax2dBVubQKHx9tGGuaeW+IVUXQ/ENiJZrx4Ci+MIk554wBoKOjoY+sQGw+EhaGxg/gX+ZZWqaJr6rPBTjXnsApzw1iJdINl1zv5jsGAFqj4yOkKkRJz+YIDUHLFPhXv6ru+KC7o+nOa9pvuslKLT493ODbRfYj7ESPumtiAKBKmMir6Oj7mCs9CwhCFuUzcZICEHrTsl12M5hIHp/K4kaYf1NMS+t+aRgfUNSI6j0AENHs2QXfwVb1OIT1RFIYCQWXxeHwuRczwRLwwXYtXPYR8CRQGH2ZTVdgyjpEfros9SSRqZtEJFw4fJlmBTozJKFjEoGDzgcVJVABq6FTnilN9OWXpr35KIT/EniE8NZdn5sJ+H0NTH+Xu9zO+wJABBTw4PMv4JX20wJrIQvhOn2zh0OOA9RmKhL4us4w9D6YPa1NfGQg7UsHOjub7hmPJ5/GY03gX+sx0HjC0XkinS4/qyg598PUYDXpSfRJ/ODg5a045tqG8Wib67HM6Mi033917tyiW+N91xAXAOoQftYETat4NYWlMkEaoVkCqB/EnVx9W1vjGQHNpIpoikOU34jGzRB8ttWJn8mbPJ5mLGeFn987mUgIAGoQtYS9JKQoJox1aroFgGK0weoLBvOftndeYzTx32g7ix3dcmxqaE+/luZ39IednMgVx/oDzZHCwry1fv+yM0ZpvSUMAJFHY0I/TYXR2cDdnyNvAkEWQZZxFM+nECteNwz5lHMtbjegaVXXz38Yn7YuBO1tELgCdXPQlnwZWeHljdkc5k7f/tAtV3d5+aL7J3K8PiEAaDSaHTTt8lP4v4CPWVOMyUO8PwDBDKQmHRgdgSZxYcFwc8tzUUhn93lmpUVB0y+CrtjMx+jozbI4gFCFgPdYbF383IQBoC5JW5p2DlMLr8I/KJCG/IJRfA4mTWFNfRj7JFavX5nsVDwpAGye4RIfh4/2QpuYjiyTt+vS9zQFR/csDK2rpaXFu+l4e7LjJQUADQrfwz9StSFQ6Y0WEOY+POUWAWFxPEcbGvODhz2SlNuNy5SByQput0saALsjetI/LIHJe/G6BmCQT5MvJwMG2tPFLcUCdhwg7Messl9Vv/0e+k1JSikANkf0T5VDQ2FEcb4aZXQ2f51dhyeBgqWruYKjqzmK4BRH6K6QplibJw00L2Epi4MapR8zx1+QT3myB0t5x84OVbXr+itXtDIIuAACzoe8RZA/H0Ij+pv/BDUMi7mA+0LcT7CTOLM/NWfONW/EW8U5x/j/+yQR+C8Z/m24yMeWRAAAAABJRU5ErkJggg==');}.mate-settings-option {    padding: 19px;}.mate-option-left {    color: #FFF;    font-size: 16px;    width: 75%;    display: inline-block;}.mate-option-left span {    font-size: 12px;    color: rgba(255, 255, 255, 0.55);    display: block;    margin-top: 5px;}.mate-option-switcher {    display: inline-block;    width: 23%;    vertical-align: top;    text-align: right;    color: rgba(255, 255, 255, 0.55);}.mate-settings-langs {    padding: 0 19px 32px;}.mate-language-button {    display: inline-block;    box-sizing: content-box;    width: calc(50% - 2px - 15px / 2 - 3% - 5px * 2 - 5px);    padding: 10px 5px;    border-radius: 7px;    text-align: center;    font-weight: 600;    font-size: 14px;    border: 1px solid rgba(0, 0, 0, 0.25);    color: #000;    background: rgba(230, 230, 232, 0.7);    -webkit-touch-callout: none;    -webkit-user-select: none;    touch-action: none;    text-overflow: ellipsis;    overflow: hidden;    white-space: nowrap;}.mate-swap-button {    display: inline-block;    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAkCAYAAADsHujfAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIqADAAQAAAABAAAAJAAAAACNOlT0AAAD+klEQVRYCc1XS2hTQRSdmZcUxLZiqwulFopiFZeC2iJ+FoLgQkXcCW7EKpi8NEmLH4SIKPaT2qRW8bNQXIjiRgQXfrC6sNSdm6oLS8VCXfhBLYbmM+OZ2pdMpnkvLyURH4R35869Z87ce+e+CSX/6PH7O3YKkWnyeGrvXrwY+aYvS3VFJcZ+f8gUQvT/xaafCGHbBwZ6PqhrMXVQQXlXDlusoJQP+XwdK3M6UFMHlZKFoM9UbESnQSfzT4jU11f3EEJvOpEpqUba2yN1nE/t45xvppQuI0R4VHAX8hohCPxyD3AmDMO71TUR0wz7heBnAVSbgymPRCl57ooIqv4K8nqkPMvORZFRKVojIHG4kiQkLRCJO0YkHA4vTCbFOIgsUfYxxRjtE4KNACKh6B1FpHUVTkqvnlrGSFcs1nfcsdhSKYpuyLMkkMsEjuLGWCw66riqNhkIdK5Fgd+3IyHNHVMD5435mPTGwEBpJKQ/52lZ5HUqlhUJS+dIBBHIRmPWoaRIWIsghZmcjN3PpkPVOaYGAF/RK7L2qJW12UEJAvrEqUwm1QSXJqS2Nxbr7dLdHYvVNIP7OSf3FKffVVV0fTQafafoyiI6EpGnZnpafERU6q3VkK6fkPsoZZ+hH4M85+Qw5vnh9Yrx7u7uX5ZfsbcjEens8wWP4nW5GJA+j96QRoEOGQY919/fO6TP6+OiRKQDmtp11Mch3dntGMXZv3hxbSgSiXA7H8NuQtWPjAw/bGlpncIOW6GvUufcyPDblEgkq1+/Hn5sZ+8qIpazz3diKWNJWcAHoFuN3xRqBjcu/RGNWLxR1xoGa0WahnW9HJdEpBCAnc40Q1tA+A4KerllA9IP4vG+PdZYfRckEgqFlqTTdC9A3qOdv1QdSpFBZgfnIpsOEEmsW9e8qK2tLaXjzOmsptnZnEySN2jv1wDyAoV6UHdyO8YmniDo3y17pGvB6OhY3sXImssjIkkIkX6uhhPybst4nu+8k+LxpAtmIUvEIgHWGmMKYvN7AoHwNmxEbYbTNTU1k4XQZojYkyBX8V24VMixmK69vXMD0ntLtcN35il6SVLVWTINBoOr02kyVCASEyiut5ZhiW8cXyGPd14acKHaalf8nlSK3IaDlg65rGgAuQYpleNByx+0IyHxkRraXI6FnDBA4lpdXU3AyUbeRwbxO+lkNM85eZF5RalxPh7veVQMgyKXVP5dgGGbaoxd4FJEOygVE6rejcyY8YOxzBjuLV/c2EubmWKyJ0MmGavC9+HCuFvA+drNHF/sXsTjUXnvuKoCyZPEeeq0qquUnG1odmSwcN4RrBSRvMuzJIPnqN8f/grxGCLyzuslZyq1+H+J+wd0QYF+f05dSgAAAABJRU5ErkJggg==');    width: 15px;    height: 16px;    background-size: contain;    margin: 0 3%;}.mate-langpicker-back {    height: 18px;    width: 11px;    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAkCAYAAACNBsqdAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFqADAAQAAAABAAAAJAAAAADHwNi8AAADyElEQVRIDaWWT0hUQRzHZ95b2y0zlLBCqIi61KG6FBS9tc01Eg2DqFMEHqKDUSSF+6fcp7nudokgojpFh4gSK7QgSlt1l+gSgV2KoL8EFRkWyu6a703fKZ7um3m7bvZgmZnfn8/M/OY3v1lK/vMLBGIVlE5eIITtBuodIcqRWKwtSf+HGwx2VTL26xGgGywOpXS0vNyzas5gXT9blclk+gFda0GtVlVdW+YEDoc7V5qmMcAYW23BZlqaprRkuTIjKK6HmK4xjKnhPFBGKWmOxUKj/wRGTNfhoIaxhBXyMqgBaFMsFrnKdaps4CwJhaIbCZni218qWgA4RQg9EI9Hrls6l9Up1CKmm7H9BzioCtmOZpFi++Px0725ulkPLxjs0LDK+4CW5Tr+7dM0oHsAfSjqCsY4FGqvJcTkK5Wg2P44crbOCconyQsOh9t3mybpY4wsEFcD6JiiuGpxw4ZEnTV2BAcC7fsMg/RgpW7LMKf95nIpO6LRU09zZFJXAodCHQdhdQPQEsmakM8lJcr2M2fanjvobCLb4QWD7Yex9UuA2uTcA/H8qKpKTWfn6dc2Qp7B9IpxUMdx+pedoPB9oyiqViyUz/UHjJiGTZOdc5ocB/XS45mvIabvnfT5ZBQrPQboeScDQEfc7tJaXT/51UlfSOZCTMN5DD643Yt8ut7yPY++oJiHYtzZgpZls5klzrrZpYqikGPYMoqI+LEKxiaHUHzWi5pixko0GulTFLof8EkHhyV4ehKBQMcmB11B0XS+4hDrkG63EXOP6IFJf+IK1yMzUqIu33gazA0A9/H6gFwulR3oBMLW2NUVGZB1smT6gnAVnBKqqu7EPfshm7JS7OgeJq+XdbLEBuZqbPcJwDX8GRfNeZiwozuofHtFnTiWwNwgHm975nJRH+BfRAdenFD5bqJYHZB1MxJHMFejgr1A0akG/NOMudVjKmPmNRStQ5ZEbPOCuSGKzivANcDfio4Ii4LfFTxdR0UdH8/6Sg8PJ8b8/roePKYNsF8sQJBVrE7TdmRTqYQtFWcFc9DgYP9Pr7e2G+/fLgwdrjnze70+NZkcTFgTFwXmxsnk4wlN23kL8BoMqyyA1SIs1du2+cpSqcE/L3bRYA5IpQbSDQ27bmazRjWGyy1oTrtV07Z7AB+w3bwcg4JdXb+4MJv91osL45MNKcMlW1kwK2SnvxJdbx6vrCyrRw3Bfw7xY9QwzGVzAnNUS0tL2u1e1wj4XTuavq6qKh/5pxjbATxbug2/P4JU/DiBtJuPfE96PPOaWltPjP4GVwpN28IsSwgAAAAASUVORK5CYII=');    background-size: contain;    position: absolute;    left: 16px;}.mate-langpicker-list {    overflow-y: auto;    -webkit-overflow-scrolling: touch;    height: 300px;}.mate-langpicker-group {    font-size: 16px;    color: #2b2b2b;    text-transform: uppercase;    font-weight: 700;    padding: 10px 16px;    -webkit-touch-callout: none;    -webkit-user-select: none;}.mate-langpicker-group:not(:first-of-type) {    margin-top: 16px;}.mate-langpicker-item {    font-size: 16px;    font-weight: 500;    padding: 10px 16px;    color: #2b2b2b;    -webkit-touch-callout: none;    -webkit-user-select: none;}.mate-selected {    color: #FFF !important;    background-color: rgba(0, 226, 203, 0.75);}@media screen and (max-width: 320px) {    .TnITTtw-fullpage-trans-layout {        margin-left: 16px !important;    }    .TnITTtw-trans-orig-toggle-button {        margin-left: 10px !important;    }}@media screen and (min-width: 678px) {    .mate-bar-langs {        padding-left: 24px;        font-size: 17px;    }    .mate-bar-collapsed {        height: 64px;    }    .mate-translate-button {        font-size: 19px;        padding: 21px 24px;    }}@media (prefers-color-scheme: dark) {    .mate-ios-bar {        background: rgba(32, 32, 32, 0.99);    }    .mate-bar-langs {        color: rgba(255, 255, 255, 0.55);    }    .mate-translate-button {        color: #01E9AF;    }    .mate-button-shutdown, .mate-button-fullpage, .mate-button-translate, .mate-button-settings {        filter: none;    }    .mate-settings-title, .mate-langpicker-title {        color: rgba(255, 255, 255, 0.55);    }    .mate-settings-shutdown, .mate-settings-fullpage {        filter: none;        color: #FFF;    }    .mate-language-button {        color: #FFF;        background: rgba(21, 21, 21, 0.85);    }    .mate-langpicker-group {        color: rgba(255, 255, 255, 0.55);    }    .mate-langpicker-item {        color: rgba(255, 255, 255, 0.55);    }    .mate-selected {        background-color: rgba(21, 21, 21, 0.85);    }}";

/*
 * Mate's Safari Extension v1.1.0
 * Created: 03/19
 * Last updated: 28/03/19
 * Twopeople Software (c)
 *
 * Required CSS files:
 *  "res/styles/pages/common/main.css"
 *  "res/styles/ui_components/tooltip/simple.css"
 *  "res/styles/ui_components/tooltip/help.css"
 *  "res/styles/ui_components/tooltip/helpSelected.css"
 *
 * Required JS files:
 *  "src/lib/jquery.js"
 *  "src/ui_components/scrollbar/scrollbar.js"
 */

//
// Constants
//
const TOOLTIP_PREFIX = "TnITTtw-";
const MAX_TEXT_LEN = 20000;

// For production Action Extension should be false
// For WebkitView or Chrome testing - true
const CHROME_DEBUG = false;

// Should be true only for WebkitView testing
const SAFARI_DEBUG = false;

const SYMBOL_LANGS = ['zh-TW', 'zh-CN'];

var TTS_LANGS = {}; // supported

if (SAFARI_DEBUG) {
    (function () {
        console.log = function (message) {
            webkit.messageHandlers.iosListener.postMessage(message);
        };
    })();

    window.onerror = function (e, source, lineno, colno, error) {
        console.log('Error: ' + e + ' / ' + source + ':' + lineno + ':' + colno + ' / ' + error);
    };
}

function updateSTTLangs() {
    TTS_LANGS = {};

    var available_voices = window.speechSynthesis.getVoices();

    available_voices.forEach((voice) => {
        var short_lang = voice.lang.split('-').shift();

        if (LANGS.indexOf(voice.lang) > -1 || LANGS.indexOf(short_lang) > -1) {
            TTS_LANGS[voice.lang] = voice;
            TTS_LANGS[short_lang] = voice;
        }
    });
}

var LOCALES = {};
var FROM = 'en';
var TO = 'es';
var LANGS = [];
var RECENTS = [];
var USER_COUNTRY = 'US';
var MATE_SERVER = '';
var DICT_SPEED = '0.5';
var AMPLITUDE_USERID = 0;

var opened_tooltips = 0;

const BAR_CODE = '<div class="mate-ios-bar">' +
    '   <div class="mate-bar-collapsed">' +
    '       <div class="mate-bar-langs"><%=ext_from_to%></div>' +
    '       <div class="mate-translate-button">Translate</div>' +
    '       <div class="mate-bar-buttons">' +
    '           <div class="mate-button-shutdown"></div>' +
    '           <div class="mate-button-fullpage"></div>' +
    '           <div class="mate-button-settings"></div>' +
    '       </div>' +
    '   </div>' +
    '   <div class="mate-bar-settings">' +
    '       <div class="mate-settings-title"><%=ext_settings%></div>' +
    '       <div class="mate-settings-collapse"></div>' +
    '       <div class="mate-settings-buttons">' +
    '           <div class="mate-settings-fullpage"><%=ext_fullpage%></div>' +
    '           <div class="mate-settings-shutdown"><%=ext_disable%></div>' +
    '       </div>' +
    '       <div class="mate-settings-langs">' +
    '           <div class="mate-language-button mate-from-lang" data-lang="<%=from_code%>"><%=from%></div>' +
    '           <div class="mate-swap-button"></div>' +
    '           <div class="mate-language-button mate-to-lang" data-lang="<%=to_code%>"><%=to%></div>' +
    '       </div>' +
    '   </div>' +
    '   <div class="mate-bar-langpicker">' +
    '       <div class="mate-langpicker-back"></div>' +
    '       <div class="mate-langpicker-title"><%=lang_pick%></div>' +
    '       <div class="mate-langpicker-list"></div>' +
    '   </div>' +
    '</div>';

//
// Flags defined at start
//

var dark_mode = false;
//var double_click_enabled = true;
//var selection_enabled = true;
var show_translit = true;
var show_ipa = true;
var scale = 0.75; // possible options: 1.0 - big (default), 0.85 - medium, 0.75 - small

// add 0.05 to scale for every 375 px of screen width after the first 375
// iphone 8+ has 375, so it shouldn't be scaled up any more than the default value on it
// however, on ipad (which is 1366 fullscreen), it will has a 0.95x scale instead of 0.75x
scale += Math.max(0, Math.floor($(window).width() / 375) - 1) * 0.05;

console.log('Scale:', scale, '(default=0.75)');

//
// Dynamically changed flags
//

var tooltip_id = 0;
var is_translating = false;
var last_call_args = {
    selectionBB: null,
    from: "",
    to: "",
    text: ""
};

//
// On DOM loaded
//

const iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
const aspect = window.screen.width / window.screen.height;
const IS_IPHONE_X = iPhone && aspect.toFixed(3) === "0.462";

var upd_interval = null;

function init() {
    console.log("init");

    if ($('.mate-ios-bar').length > 0) {
        console.log("already initialized.");
        return;
    }

    updateSTTLangs();

    pickFastestMateServer();

    if ($('style[class="mate-ios-style"]').length === 0) {
        $('body').append('<style class="mate-ios-style">' + CSS + '</style>');
    }

    $('body').append(compileString(BAR_CODE, $.extend(LOCALES, {
        from_code: FROM,
        to_code: TO,
        from: getLocale(FROM),
        to: getLocale(TO)
    })));

    $(window).on('touchend', () => {
        var selection = _getSelection();

        console.log('touchend', selection.toString());

        if (selection && selection.toString()) {
            var params = getSelectionParameters(selection);

            last_call_args.text = selection.toString();
            last_call_args.selectionBB = params;
        }
    });

    if (CHROME_DEBUG) {
        $(window).dblclick(handleTranslation);
    }

    setTimeout(function () {
        $('.mate-button-settings').on('click', openBarSettings);
        $('.mate-button-fullpage, .mate-settings-fullpage').on('click', translateFullpage);
        $('.mate-button-shutdown, .mate-settings-shutdown').on('click', shutExtensionDown);
        $('.mate-settings-collapse').on('click', closeExtensionSettings);
        $('.mate-swap-button').on('click', swapLangs);
        $('.mate-langpicker-back').on('click', closeLangPicker);
        $('.mate-language-button').on('click', openLangPicker);
        $('.mate-translate-button').on('click', () => {
            handleTranslation("tap-and-translate-safari");
        });

        if (IS_IPHONE_X) {
            new OnActionBar({
                onInit: (data) => {}, // fires when instatiated
                onVisible: (data) => {}, // when the UI expands (visible)
                onCollapse: (data) => {}, // when the UI minimizes
                setAttribute: true // set classes on root element
            });
        }
    }, 200);

    // bind tooltip closing
    //$(window).on('click', closeTooltip);
    $('body').on('click', closeTooltip);

    // check if there's selected text
    upd_interval = setInterval(checkOnSelectedText, 100);
}

class OnActionBar {
    constructor(options) {
        if (OnActionBar.isIOS()) {
            Object.assign(this, options);
            this.data = {
                initialHeight: 0,
                collapsedHeight: 0,
                isCollapsed: false
            };

            this._init();
            this._listen();

            return this;
        } else {
            return false;
        }
    }

    _init() {
        const root = document.documentElement;

        this._prevState = this.isCollapsed;
        this.data.device = OnActionBar.isIOS()[0];

        if (!root.classList.contains(this.data.device)) {
            root.classList.add(this.data.device.toLowerCase());
        }

        if (this.data.initialHeight === 0) {
            this.data.initialHeight = window.innerHeight;
            this.previousHeight = this.data.initialHeight;
        }

        this.onInit(this.data);
    }

    _listen() {
        window.addEventListener('scroll', () => {
            if (this.previousHeight === window.innerHeight) {
                if (window.innerHeight > this.data.initialHeight) {
                    if (this.data.collapsedHeight === 0 || this.data.collapsedHeight < window.innerHeight) {
                        this.data.collapsedHeight = window.innerHeight;
                    }

                    this._setState(true, this.onCollapse);
                } else {
                    this._setState(false, this.onVisible);
                }
            } else {
                this.previousHeight = window.innerHeight;
            }
        });
    }

    _setState(isCollapsed, callback) {
        this.data.isCollapsed = isCollapsed;

        if (this._prevState !== this.data.isCollapsed) {
            this._prevState = this.data.isCollapsed;

            if (this.setAttribute) {
                const root = document.documentElement;
                root.classList.remove('is-actionbar');
                if (this.data.isCollapsed) root.classList.add('is-actionbar');
            }

            callback(this.data);
        }
    }

    static isIOS(device) {
        const devices = device || 'iPad|iPhone';
        const regex = new RegExp(`(${devices})`);
        return navigator.userAgent.match(regex);
    }
}



//export default OnActionBar;

function sendAmplitudeEvent(event) {
    if (!AMPLITUDE_USERID || typeof event !== 'string') {
        return;
    }

    $.ajax({
        url: 'https://api.amplitude.com/2/httpapi',
        type: 'POST',
        data: JSON.stringify({
            "api_key": "a7a14afc5686eb7995c8d2672a3dd354",
            "events": [{
                "user_id": AMPLITUDE_USERID,
                "event_type": event,
                "time": Date.now()
            }]
        }),
        success: function (d) {
            console.log('Amplitude event succeeded.');
            console.log(d);
        },
        error: function (e) {
            console.log('Amplitude request failed.');
            console.log(e);
        }
    });
}

function pickFastestMateServer() {
    var p = new Ping();

    var times = {};
    var c = 0;

    var pick = function () {
        if (times['us'] > times['eu']) {
            MATE_SERVER = '2'; // use the EU server
        } else {
            MATE_SERVER = ''; // use the US server
        }
    };

    var saveTime = function (ms, server) {
        times[server] = ms;
        ++c;

        if (c === 2) {
            pick();
        }
    };

    p.ping('https://api.matetranslate.com', function (err, ms) {
        saveTime(ms, 'us');
    });

    p.ping('https://api2.matetranslate.com', function (err, ms) {
        saveTime(ms, 'eu');
    });
}

function checkOnSelectedText() {
    if (getSelectedText().trim() !== '') {
        $('.mate-bar-langs').fadeOut(150, () => {
            $('.mate-translate-button').fadeIn(150);
        });
    } else {
        $('.mate-translate-button').fadeOut(150, () => {
            $('.mate-bar-langs').fadeIn(150);
        });
    }
}

function openBarSettings() {
    $('.mate-bar-collapsed').slideUp(150, () => {
        $('.mate-bar-settings').slideDown(150);
    });

    sendAmplitudeEvent('actext_expand_settings');
}

const BING_LANGS = {
    "bs": "bs-Latn",
    "sr": "sr-Cyrl",
    "zh-TW": "zh-CHT",
    "zh-CN": "zh-CHS"
};

function getBingCompatibleLang(lang) {
    return BING_LANGS[lang] || lang;
}

function translateFullpage() {
    dispatch(getBingCompatibleLang(TO) + ',' + getLocale('translated_to') + ' ' + getLocale(TO) + ',' + 'Already in ' + getLocale(TO) + ',' + getLocale("Translating...") + ',' + 'cancel' + ',' + '000000000A9F426B41914349A3EC94D7073FF941');

    shutExtensionDown(true);

    sendAmplitudeEvent('actext_translate_fullpage');
}

function shutExtensionDown(skip_style_removal) {
    $('.mate-ios-bar').animate({bottom: -parseInt($('.mate-ios-bar').css('height'))}, 150, function () {
        $(this).remove();
    });

    // remove all tooltips & spinners
    $('.' + TOOLTIP_PREFIX + 'tooltip-main-wrap').remove();
    $('.' + TOOLTIP_PREFIX + 'translate-loading').remove();

    if (!skip_style_removal) {
        console.log('remove extension including styles');

        $('.mate-ios-style').remove();

        sendAmplitudeEvent('actext_shutdown');
    }
}

function closeExtensionSettings() {
    $('.mate-bar-settings').slideUp(150, () => {
        $('.mate-bar-collapsed').slideDown(150);
    });

    sendAmplitudeEvent('actext_collapse_settings');
}

function updateLangs() {
    $('.mate-bar-langs').html(compileString(getLocale("ext_from_to"), {
        from: getLocale(FROM),
        to: getLocale(TO)
    }));

    $('.mate-from-lang').html(getLocale(FROM)).attr('data-lang', FROM);
    $('.mate-to-lang').html(getLocale(TO)).attr('data-lang', TO);
}

function swapLangs() {
    var t = FROM;
    FROM = TO;
    TO = t;

    updateLangs();

    sendAmplitudeEvent('actext_swap_langs');
}

function openLangPicker() {
    var SEL_TYPE_FROM = true;

    if ($(this).hasClass('mate-to-lang')) {
        SEL_TYPE_FROM = false;
    }

    $('.mate-bar-settings').slideUp(150, () => {
        $('.mate-bar-langpicker').slideDown(150);
    });

    var $list = $('.mate-langpicker-list');

    $list.html(''); // empty after the last use

    $list.append('<div class="mate-langpicker-group">' + getLocale("recent_languages") + '</div>');

    function render(langs) {
        langs.forEach((lang) => {
            var sel_class = '';

            if (!SEL_TYPE_FROM && lang === 'auto') {
                return;
            }

            if ((SEL_TYPE_FROM && lang === FROM) || (!SEL_TYPE_FROM && lang === TO)) {
                sel_class = 'mate-selected';
            }

            $list.append('<div class="mate-langpicker-item ' + sel_class + '" data-lang="' + lang + '">' + getLocale(lang) + '</div>');
        });
    }

    render(RECENTS);

    $list.append('<div class="mate-langpicker-group">' + getLocale("all_languages") + '</div>');

    render(LANGS);

    $('.mate-langpicker-item').on('click', (event) => {
        chooseLang(SEL_TYPE_FROM, $(event.target).data('lang'));
    });

    sendAmplitudeEvent('actext_open_picker');
}

function chooseLang(is_from, lang) {
    if (is_from) {
        FROM = lang;
    } else {
        TO = lang;
    }

    updateLangs();
    closeLangPicker();
}

function closeLangPicker() {
    $('.mate-bar-langpicker').slideUp(150, () => {
        $('.mate-bar-settings').slideDown(150);
    });

    sendAmplitudeEvent('actext_close_picker');
}

function getLocale(key) {
    var localized = LOCALES[key];

    if (localized) {
        return localized;
    } else {
        console.log("The key \"" + key + "\" is not localized!");
        return key;
    }
}

function sortLangs(langs) {
    return langs.sort((a, b) => {
        if (a === 'auto' && b !== 'auto') return -1;
        if (a === 'auto' && b === 'auto') return 0;
        if (a !== 'auto' && b === 'auto') return 1;

        return getLocale(a).localeCompare(getLocale(b));
    });
}

if (!CHROME_DEBUG) {
    var Action = function () {
    };

    Action.prototype = {
        run: function (arguments) {
            arguments.completionFunction({ok: true});
        },

        finalize: function (arguments) {
            // get data from arguments

            console.log(arguments);

            // locales, from/to languages

            LOCALES = arguments.locales;
            RECENTS = arguments.recently_used;
            LANGS = sortLangs(arguments.all_languages);
            FROM = arguments.from;
            TO = arguments.to;
            USER_COUNTRY = arguments.user_country;
            DICT_SPEED = arguments.dict_speed;
            AMPLITUDE_USERID = arguments.amplitude_userid;

            init();
        }
    };

    var ExtensionPreprocessingJS = new Action
} else {
    FROM = 'en';
    TO = 'de';

    RECENTS = sortLangs(["en", "de", "ru", "es"]);
    LANGS = sortLangs(["am", "co", "fy", "gd", "haw", "ku", "ky", "lb", "ps", "sd", "sm", "sn", "xh", "no", "uz", "fa", "mg", "de", "ig", "ko", "lt", "pl", "tl", "ro", "bn", "auto", "be", "zh-CN", "id", "la", "eu", "mn", "st", "sk", "ta", "da", "gu", "lo", "gl", "uk", "el", "ml", "vi", "si", "pt", "mt", "it", "so", "ceb", "hr", "bg", "lv", "tg", "te", "ht", "ha", "pa", "su", "ur", "ca", "cs", "ne", "sr", "sq", "my", "af", "et", "hu", "cy", "ms", "ru", "mr", "ga", "bs", "hmn", "hy", "sw", "is", "sv", "fi", "eo", "ka", "jw", "mk", "zh-TW", "en", "mi", "sl", "ny", "es", "th", "km", "yo", "zu", "ja", "tr", "nl", "kn", "yi", "az", "he", "ar", "hi", "kk", "fr", "en-us"]);
    AMPLITUDE_USERID = 12345;

    LOCALES = {
        "ar": "Arabic",
        "en": "English",
        "de": "German",
        "ru": "Russian",
        "es": "Spanish",
        "fr": "French",

        "lang_pick": "Select a language",
        "recent_languages": "Recently used",
        "all_languages": "All languages",

        "ext_from_to": "<%=from%> to <%=to%>",
        "ext_settings": "Mate Extension Settings",
        "ext_disable": "Disable extension",
        "ext_fullpage": "Translate<br>full page",
        "translated_to": "Translated to",
        "show_original": "Show original",
        "Translate": "Translate",
        "No Internet Connection": "No Internet Connection",
        "Save": "Save",
        "Continue": "Continue",
        "noun": "noun",
        "verb": "verb",
        "adverb": "adverb",
        "adjective": "adjective",
        "interjection": "interjection"
    };

    $(init);
}

function translate(text, id, type) {
    text = $('<div/>').html(text).text(); // escape html tags

    googleApi.getTextTranslation(FROM, TO, text, function (output) {
        if (output.error) {
            displayTranslation({
                offline: true
            });

            sendAmplitudeEvent('actext_translate_error_offline');
        } else {
            googleApi.getInternalJSONFormat(output, text, TO, (output_it_format) => {
                if (!output_it_format[3]) {
                    displayTranslation({
                        no_results: true
                    });

                    sendAmplitudeEvent('actext_translate_error_noresults');
                } else {
                    displayTranslation({
                        id: id,
                        from: FROM,
                        to: TO,
                        translation: output_it_format
                    });
                }
            });
        }
    });

    sendAmplitudeEvent('actext_translate');
}

(function (undefined) {

    const MAX_STR_LEN = 1000; // per one request to the server

    const IPA_LANGS = "en,af,bs,ca,cs,da,de,el,eo,es,fi,fr,hr,hu,it,kn,ku,lv,"
        + "nl,pl,pt,ro,sk,sr,sv,sw,ta,tr,zh-TW,cy,grc,hi,hy,id,is,ka,la,mk,"
        + "no,ru,sq,vi,zh-CN".split(",");

    const YANDEX_LANGS = {
        "zh-CN": "zh",
        "zh-TW": "zh",
        "jw": "jv",
        "iw": "he",
        "auto": "jv" // It does not have an "auto" language but it detects a lang if you supply a wrong one
    };

    var positions = {
        '': 0,
        noun: 1,
        verb: 2,
        adjective: 3,
        adverb: 4,
        pronoun: 5,
        preposition: 6,
        conjunction: 7,
        interjection: 8,
        abbreviation: 9,
        phrase: 10,
        suffix: 11,
        auxiliaryverb: 12
    };

    var parts_of_speech = [];

    for (var key in positions) {
        parts_of_speech.push(key);
    }

    var yf = function (a, b) {
        for (var c = 0; c < b.length - 2; c += 3) {
            var d = b[c + 2];
            d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
            d = "+" == b[c + 1] ? a >>> d : a << d;
            a = "+" == b[c] ? a + d & 4294967295 : a ^ d;
        }

        return a;
    };

    var tk = function (a) {
        var d = [];

        for (var f = 0, e = 0; f < a.length; ++f) {
            var g = a.charCodeAt(f);

            if (128 > g) {
                d[e++] = g;
            } else {
                if (2048 > g) {
                    d[e++] = g >> 6 | 192;
                } else {
                    d[e++] = g >> 12 | 224;
                    d[e++] = g >> 6 & 63 | 128;
                }
                d[e++] = g & 63 | 128;
            }
        }

        var b = 0;
        var tk = 0;

        for (e = 0; e < d.length; e++) {
            tk += d[e];
            tk = yf(tk, "+-a^+6");
        }

        tk = yf(tk, "+-3^+b+-f");

        if (0 > tk) {
            tk = (tk & 2147483647) + 2147483648;
        }
        tk %= 1E6;

        return tk.toString() + "." + (tk ^ b).toString();
    };

    const BING_AUTH_URL = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";
    const BING_ocpApimSubscriptionKeyHeader = "Ocp-Apim-Subscription-Key";
    const BING_KEY_ONE = "0484d3977728436681fc369e7a614a43";

    const YT_KEYS = "trnsl.1.1.20181102T213252Z.15973c8fd1497069.dfef0ce2d1d66c4b3a560986cfd349cc27adceef,trnsl.1.1.20181102T213332Z.79148d90f1c6e2d5.c05d93cb4000e5eb194a8cb0302a2577e1786456,trnsl.1.1.20181102T213412Z.b7d99cd224b50875.78b25ec3b559d218c468a15718d62aa9160a6775,trnsl.1.1.20181102T213431Z.541628d09094c1a3.ff27af10a741cd223c176acde97e02d088e5f924,trnsl.1.1.20181102T213450Z.93ccf977a373c675.e773350d58a6b56434efb4e1192683e45462d7e9,trnsl.1.1.20181102T213509Z.f880b66413c0aaf3.9571c4386c6aeb148626ba31ec284691dec1ccaf,trnsl.1.1.20181102T213527Z.eb68115e91aab47f.4da25db7117bff3b15b1dc06fababa6a3c3a8535,trnsl.1.1.20181102T213549Z.ae5a65262a8dcd37.6d7ca0bc28077563a22044c73982101d802110ce,trnsl.1.1.20181102T213613Z.0bad11f72f75fcfa.5a93be6a7aa651b1ef3a36f1fe4ca9af3ac7e32b,trnsl.1.1.20181102T213633Z.a390634b03f595d9.451e188304339141a5c73bcd8b5c25bc0afa4dd9,trnsl.1.1.20181102T213652Z.d9d75034bf77120a.1737bc1c6984c39aeccf2e3581077be809b09b45,trnsl.1.1.20181102T213710Z.8b323dc6d80bba83.f83adcebeaca98ce4445a3d0d328acb59fb577a4,trnsl.1.1.20181102T213729Z.d50920bce790c915.e87f433ef69c108970909acd514734b31556ca4b,trnsl.1.1.20181102T213749Z.3e2b20c226adc8f7.fa0e8f8179d9824864262c0df8d98a222bf06e95,trnsl.1.1.20181102T213808Z.9c3b0910f60f8844.d7a5174868016700c629708e491842a4ff7dfff4,trnsl.1.1.20181102T213936Z.7c005f281fd3959e.a88a3f0411a0b373f941de434e960ec512f1892b,trnsl.1.1.20181102T214014Z.c351b40bd641f99c.114eb8303466d0add7fbca0f7a661d75def7f4c9,trnsl.1.1.20181102T214042Z.77ed3fa8560a999d.9001ccdb59651617814c0720a35dfc1c4ca32bc1,trnsl.1.1.20181102T214151Z.8c6ed1edcf6b527c.7a505097fe32ea5711ff27d44fadd1f84d64e87f,trnsl.1.1.20181102T204954Z.06a524538afb5370.d7c3461460c2e788cb6f67da941b076d65ee49f4,trnsl.1.1.20181102T205629Z.8c5a5671b2c94734.1cebf2b46d03aa6f21a3aada2c6f0dea72b2bb7c,trnsl.1.1.20181102T205740Z.53924bf8bf038b66.1497238b25def89dc7ef38dc919556eb18419aee,trnsl.1.1.20181102T205833Z.6fa2c1193d34ae03.095847fc36981d0abbc9f2d08ff4f2209ce4cbc9,trnsl.1.1.20181102T205859Z.f48f25f673c18de8.2662ca40ff4d9276e19d1a751353976374eb5027,trnsl.1.1.20181102T205922Z.8fcd584cb97e7b7b.96635d8adeb31ac33d8af5f1b84b94bca7785a1b,trnsl.1.1.20181102T205943Z.c107053b80b3da23.33f28db3a836c230ab1fb2ec519c94e6b07f9375,trnsl.1.1.20181102T210007Z.3aba0562159ceb75.5ff0ac290dbd2d01a62023b130581f594c65bd62,trnsl.1.1.20181102T210030Z.48694ecb9d7aef4e.39aa18ca356b09014ce79c7b8cda4f56e7646f58,trnsl.1.1.20181102T210101Z.8ca38ca32d1eeae2.9cf56256c908fd101a9e0bceccaf2ffd729099c4,trnsl.1.1.20181102T210122Z.14226828ff16677d.e64bf54ba3da5fa26a43d522a979e11760cb878a,trnsl.1.1.20181102T210145Z.3ff15c7295b2dec4.252e06955b1265504be710c4871b1b829166f7e9,trnsl.1.1.20181102T210207Z.9c8d671f4e895030.90514dfd6b7cc782e3ff2bcbd046835a661106d1,trnsl.1.1.20181102T210233Z.acd76b1b0033dd87.f0d1034c8b9a9ebd5abd89a0beee582b34a3ee7a,trnsl.1.1.20181102T210309Z.084714f2e6d4c8d6.2113ff52f70e8edb8d15e5dc6b5edc04882d4847,trnsl.1.1.20181102T214252Z.c7d523a692f21cf9.f061c197cf868b9bb22fa1000ed73a131a87a241,trnsl.1.1.20181102T214324Z.68589c5b7b1beaca.4887133744773fe4890cd25061e8619d5817e545,trnsl.1.1.20181102T214351Z.a5f4ec70259dfcdd.e657e0c9a59f33274144633d7cf42475077afb67,trnsl.1.1.20181102T214416Z.cc1f850655586c0f.b6d2866d529d2e001a0318180bc7e9e715f0a5b5,trnsl.1.1.20181102T214444Z.24553e66aa23b466.be6804cb85f09c6f64c5c5f3a17720cf47dc9e86,trnsl.1.1.20181102T214947Z.dfd66bd7b21dd3af.275de56c2ea7a5109ddd1fbc43406a9f485cca65,trnsl.1.1.20181102T215052Z.ec57c48f3cb24691.54a8091b9c8f364af1a9277a7aeb642356476d87,trnsl.1.1.20181102T215122Z.af8710eead58551a.97f86308053dccb2d148577e2c023c0a13489b54,trnsl.1.1.20181102T215154Z.ae797e662ffc0055.af3030fcbd863a5cc71b24afd8a3122b5a6bc2b2,trnsl.1.1.20181102T215230Z.23c8ec80d3d564ee.0285f07c82e3d91e03c274b72d889701a7de7485,trnsl.1.1.20181102T215258Z.3d6142281267b1ee.ef871a7bae00682a9225f34f40c2084aa0cd1f51,trnsl.1.1.20181102T215327Z.b0324d3620775026.f61c65f8c6c31b2f45973397e86eeb4af8ef7bc9,trnsl.1.1.20181102T215356Z.e72ddaaa2e5d3029.fc6d21d8bf367760164caf2073be332b87e558c5,trnsl.1.1.20181102T215421Z.e7bb329825ab40c2.6b4368f077ab1f36aca314f1f5d3855de9b7ffb4,trnsl.1.1.20181102T215447Z.3d4324e2958136ff.8d6085bf3873f653c02d07433ad2f336de64c23f,trnsl.1.1.20181102T215517Z.c17384773f356575.be5756d5d3ede5b0823a865aa8b2a401d5b1cf8d,trnsl.1.1.20181102T215548Z.89db0ce5c7b3bef8.c8407a45bc8655af5ab12da309f504475756371b,trnsl.1.1.20181102T215618Z.c22f22948a0fdbd1.876a5521c7737b41b6a43ca9af0b66e3f8166ab6,trnsl.1.1.20181102T215641Z.fe52de1dc3618d73.740023052cbd6a0bc98bd5bf5ff05a55770350be,trnsl.1.1.20181102T215711Z.9c77c09515106e89.72841b56546a7f19ed8f77b27b91a6dee93a59b1,trnsl.1.1.20181102T215736Z.162caa5087e102a8.6f8bbfcf5ef76652dc6c1b3249c35fc7cd944d19,trnsl.1.1.20181102T215811Z.6e967911b314d9f2.040c8dc577ac16ddea33e33225a2b334b8fd0be3,trnsl.1.1.20181102T215859Z.467b4f132813ab8a.5c04bd040c0ddbccdb9fd1be799384e6826a5635,trnsl.1.1.20181102T220047Z.ad0e4a72ac465775.9f9a21610f30534627db70c35c2c1e453cbc7c36,trnsl.1.1.20181102T220117Z.09ce6c0292c9761c.8cc1dfc8f30b6c3bf30c8e356088ef2685f37d86".split(',');

    const BING_TRANSLATION_URL = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";

    window.googleApi = {
        get MAX_TEXT_LEN() {
            return 20000;
        },

        get MAX_IPA_LEN() {
            return 500;
        },

        get IPA_LANGS() {
            return IPA_LANGS;
        },

        getBingToken: function (callback) {
            var headers = {};
            headers[BING_ocpApimSubscriptionKeyHeader] = BING_KEY_ONE;

            $.ajax({
                url: BING_AUTH_URL,
                type: 'POST',
                headers: headers,
                success: function (token) {
                    callback(token);
                },
                error: function (e) {
                    callback(null);
                }
            });
        },

        googleLangsToBingLangs: function (lang) {
            lang = lang.replace("auto", "");
            lang = lang.replace("bs", "bs-Latn");
            lang = lang.replace("sr", "sr-Cyrl");
            lang = lang.replace("zh-TW", "zh-CHT");
            lang = lang.replace("zh-CN", "zh-CHS");

            return lang;
        },

        getBingTranslation: function (from, to, text, fn) {
            googleApi.getBingToken(function (token) {
                if (!token) {
                    googleApi.getYandexTranslation(from, to, text, fn);
                    return;
                }

                from = googleApi.googleLangsToBingLangs(from);
                to = googleApi.googleLangsToBingLangs(to);

                var bing_from = from === ''
                    ? ''
                    : '&from=' + from;

                $.ajax({
                    url: BING_TRANSLATION_URL + '&to=' + to + bing_from,
                    type: 'POST',
                    //dataType: 'json',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    data: JSON.stringify([{
                        'Text': text
                    }]),
                    success: function (d) {
                        if (d) {
                            var translation = d[0].translations[0].text;

                            fn({
                                dict: [],
                                sentences: [{
                                    orig: text,
                                    trans: translation
                                }],
                                ld_result: {
                                    srclangs: [d[0].detectedLanguage ? d[0].detectedLanguage.language : '']
                                }
                            });
                        } else {
                            googleApi.getYandexTranslation(from, to, text, fn);
                        }
                    },
                    error: function (e) {
                        googleApi.getYandexTranslation(from, to, text, fn);
                    }
                });
            });
        },

        getYandexTranslation: function (from, to, text, fn) {
            from = YANDEX_LANGS[from] || from;
            to = YANDEX_LANGS[to] || to;

            let key = YT_KEYS[Math.floor(Math.random() * YT_KEYS.length)];

            $.ajax({
                url: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                data: {
                    key: key,
                    format: 'plain',
                    options: 1,
                    lang: from + '-' + to,
                    text: text
                },
                success: function (d) {
                    if (d.text) {
                        var translation = d.text[0];

                        fn({
                            dict: [],
                            sentences: [{
                                orig: text,
                                trans: translation
                            }],
                            ld_result: {
                                srclangs: [d.detected.lang]
                            }
                        });
                    } else {
                        fn({
                            error: true
                        });
                    }
                },
                error: function (e) {
                    fn({
                        error: true
                    });
                }
            });
        },

        getGoogleOldTranslation: function (from, to, text, fn) {
            $.ajax({
                url: 'http://clients5.google.com/translate_a/t',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                data: {
                    client: 'dict-chrome-ex',
                    q: text,
                    sl: from,
                    tl: to,
                    tbb: 1,
                    ie: 'UTF-8',
                    oe: 'UTF-8',
                    hl: 'en'
                },
                success: function (d) {
                    fn(d);
                },
                error: function (e) {
                    console.log('Error while translating with Google:', e);
                    console.log('Trying with Bing...');

                    googleApi.getBingTranslation(from, to, text, fn);
                }
            });
        },

        getTextTranslation: function (from, to, text, fn) {
            var chunks = chunkateString(text, MAX_STR_LEN);
            var translations = new Array(chunks.length);

            var translateChunk = function (i) {
                if (i >= chunks.length) {
                    var response = translations[0];
                    var has_translit = typeof response.sentences[response.sentences.length - 1].translit != "undefined";

                    for (var i = 1, len = translations.length, k = has_translit ? 1 : 0; i < len; ++i) {
                        for (var j = 0; j < translations[i].sentences.length - k; ++j) {
                            response.sentences[response.sentences.length - 1 - k].orig +=
                                " " + translations[i].sentences[j].orig;

                            var whitespace = "";
                            if (j === 0 || (j > 0 && translations[i].sentences[j - 1].trans[translations[i].sentences[j - 1].trans.length - 1] !== " ")) {
                                whitespace = " ";
                            }

                            response.sentences[response.sentences.length - 1 - k].trans +=
                                whitespace + translations[i].sentences[j].trans;
                        }

                        if (has_translit) {
                            response.sentences[response.sentences.length - 1].translit +=
                                " " + translations[i].sentences[translations[i].sentences.length - 1].translit;
                        }
                    }

                    fn(response);

                    return;
                }

                googleApi.getTranslation(from, to, chunks[i], function (response) {
                    if (response.error) {
                        fn(response);
                    } else {
                        translations[i] = response;
                        translateChunk(i + 1);
                    }
                });
            };

            translateChunk(0);
        },

        getTranslation: function (from, to, text, fn) {
            from = from || 'auto';

            //
            // Use Baidu for Chinese users in first hand
            if (USER_COUNTRY === 'cn') {
                googleApi.getYandexTranslation(from, to, text, fn);
            } else {
                //
                // Google - Google - Microsoft - Baidu otherwise
                $.ajax({
                    url: 'https://translate.googleapis.com/translate_a/single?dt=t&dt=bd&dt=qc&dt=rm&dt=ex',
                    type: 'GET',
                    dataType: 'json',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    },
                    data: {
                        client: 'gtx',
                        hl: 'en',
                        sl: from,
                        tl: to,
                        q: text,
                        dj: 1,
                        tk: tk(text)
                    },
                    success: function (d) {
                        fn(d);
                    },
                    error: function (e) {
                        console.log('Error while translating with Google:', e);
                        console.log('Trying with older GApi...');

                        googleApi.getGoogleOldTranslation(from, to, text, fn);
                    }
                });
            }
        },

        getWordsInfo: function (words, fn) {
            var timeout = null;

            var xhr = $.ajax({
                url: 'https://api' + MATE_SERVER + '.matetranslate.com/v3/get_words_info',
                type: 'POST',
                dataType: 'json',
                crossDomain: true,
                data: JSON.stringify({
                    words: words
                }),
                success: function (d) {
                    if (timeout !== null) clearTimeout(timeout);
                    console.timeEnd('get_words_info');
                    fn(d);
                },
                error: function (e) {
                    if (timeout !== null) clearTimeout(timeout);
                    console.timeEnd('get_words_info');
                    console.log(e);
                    fn({words_info: null});
                }
            });

            timeout = setTimeout(function () {
                xhr.abort();
            }, 1000);
        },

        // remove doubling commas
        // ,, => ,0,
        // [, => [0,
        // ,] => ,0]
        parseResponse: function (r) {
            return r
                .replace(/(\,\,)/g, ',"",')
                .replace(/\[\,/g, '["",')
                .replace(/\,\]/g, ',""]');
        },

        getAudioFileLink: function (lang, text) {
            return 'https://translate.google.{{domain}}/translate_tts?ie=UTF-8&q={{text}}&tl={{lang}}&total={{textparts}}&idx=0&textlen={{textlen}}&tk={{tk}}&client=webapp&prev=input'
                .replace('{{domain}}', 'com')
                .replace('{{text}}', encodeURIComponent(text))
                .replace('{{lang}}', lang)
                .replace('{{textparts}}', text.split(' ').length)
                .replace('{{textlen}}', text.length)
                .replace('{{tk}}', tk(text))
                .replace('{{dictation_speed}}', DICT_SPEED);
        },

        getBingAudioFileLink: function (lang, text) {
            if (lang === 'iw') {
                lang = 'he';
            }

            return "https://www.bing.com/tspeak?&format=audio%2Fmp3&language={{lang}}&IG=D5DFBE5EEA97455182D4DEA272551DCD&IID=translator.5036.43&text={{text}}"
                .replace('{{text}}', encodeURIComponent(text))
                .replace('{{lang}}', lang);
        },

        getPartOfSpeechByIndex: function (index) {
            return parts_of_speech[index];
        },

        getInternalJSONFormat: function (output, original, to, callback) {
            var res = typeof (output) == 'object' ? output : JSON.parse(this.parseResponse(output));

            if (typeof res[0] == 'boolean') {
                return res;
            }

            var translations = [
                false,  // 0 - is multi
                '',     // 1 - original
                '',     // 2 - translated ipa
                '',     // 3 - translation
                '',     // 4 - translation translit
                '',     // 5 - from lang
                '',     // 6 - to lang
                [
                    [], // no category
                    [], // nouns
                    [], // verbs
                    [], // adjectives
                    [], // adverbs
                    [], // pronouns
                    [], // prepositions
                    [], // conjunctions
                    [], // interjections
                    [], // abbreviations
                    [], // Phrases
                    [], // Suffixes
                    []  // Auxiliary Verbs
                ],
                '',     // 8 - original gender
                '',     // 9 - translated gender
                '',     // 10 - original ipa
                '',     // 11 - original translit
            ];

            translations[6] = to;

            if ($.isArray(res) && res[0].Alignment != undefined) {
                translations[0] = false;
                translations[1] = original;
                translations[2] = "";
                translations[3] = res[0].TranslatedText;
                translations[4] = "";
                translations[5] = res[0].From;
            } else if (res.dict || $.isArray(res[1])) {
                if (res.dict) {
                    translations[0] = true;
                    translations[1] = res.sentences[0].orig;
                    translations[11] = (res.sentences[1] || {}).src_translit || '';
                    translations[3] = res.sentences[0].trans;
                    translations[4] = (res.sentences[1] || {}).translit || '';
                    translations[5] = res.ld_result.srclangs[0];

                    $.each(res.dict, function (k, v) {
                        $.each(v.entry, function (k2, v2) {
                            var item = [
                                v2.word,
                                v2.reverse_translation
                            ];

                            if (typeof v2.previous_word == 'string') {
                                item.push(v2.previous_word);
                            } else {
                                item.push('');
                            }

                            translations[7][positions[v.pos.toLowerCase().replace(' ', '')] || 0].push(item);
                        });
                    });
                } else {
                    translations[0] = true;
                    translations[1] = res[0][0][1];
                    translations[2] = (res[0][1] ? res[0][1][0] : '') || '';
                    translations[3] = res[0][0][1];
                    translations[4] = (res[0][1] ? res[0][1][1] : '') || '';
                    translations[5] = res[2];

                    $.each(res[1], function (k, v) {
                        $.each(v[2], function (k2, v2) {
                            var item = [
                                v2[0],
                                v2[1]
                            ];

                            if (typeof v2[3] == "string") {
                                item.push(v2[3]);
                            } else {
                                item.push('');
                            }

                            translations[7][positions[v[0]] || 0].push(item);
                        });
                    });
                }
            } else {
                if (typeof res.sentences == 'object') {
                    for (var i = 0, len = res.sentences.length; i < len; ++i) {
                        if (res.sentences[i].orig) {
                            translations[1] += res.sentences[i].orig;
                        }
                        if (res.sentences[i].trans) {
                            translations[3] += res.sentences[i].trans;
                        }
                    }

                    translations[2] = (res.sentences[res.sentences.length - 1] || {}).src_translit || '';
                    translations[4] = (res.sentences[res.sentences.length - 1] || {}).translit || '';

                    translations[0] = false;
                    translations[5] = res.ld_result.srclangs[0];
                } else {
                    translations[0] = false;
                    translations[1] = res[0][0][1];
                    translations[2] = (res[0][1] ? res[0][1][0] : '') || '';
                    translations[3] = res[0][0][0];
                    translations[4] = (res[0][1] ? res[0][1][1] : '') || '';
                    translations[5] = res[1];
                }
            }

            var info_fetcher_req = [];

            info_fetcher_req.push({
                word: translations[1],
                language: translations[5]
            });

            info_fetcher_req.push({
                word: translations[3],
                language: translations[6]
            });

            if (translations[7][1].length > 0) {
                translations[7][1].forEach((item) => {
                    info_fetcher_req.push({
                        word: item[0],
                        language: translations[6]
                    });
                });
            }

            googleApi.getWordsInfo(info_fetcher_req, function (r) {
                if ($.isArray(r.words_info)) {
                    r.words_info.forEach((item) => {
                        if (item.word === translations[1]) {
                            // save stuff for the original

                            translations[10] = item.ipa || '';
                            translations[8] = (item.info && item.info.gender) || '';
                        } else if (item.word === translations[3]) {
                            // save stuff for the translation

                            translations[2] = item.ipa || '';
                            translations[9] = (item.info && item.info.gender) || '';
                        } else {
                            // save stuff for synonyms

                            if (translations[7][1].length > 0) {
                                for (var j = 0; j < translations[7][1].length; ++j) {
                                    if (translations[7][1][j][0] === item.word) {
                                        if (!translations[7][1][j][2] && item.info && item.info.gender) {
                                            translations[7][1][j][2] = item.info.gender;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                callback(translations);
            });
        },

        // According to current settings (a single word/phrase or a bunch of variants)
        parseReceivedTranslation: function (json, mainAndVariantsSeparately, prefix, locales, complexSingle) {
            if (json[0]) {
                var response = [json[0], wrapper.wrap(true, json, mainAndVariantsSeparately, prefix, locales)];
                if (mainAndVariantsSeparately) {
                    var tmp = response;
                    response = [tmp[0], json[3], tmp[1]];
                    delete tmp;
                }

                return response;
            } else {
                return [false, wrapper.wrap(false, json, mainAndVariantsSeparately, prefix, locales, complexSingle)];
            }
        }
    };

})();

function chunkateString(text, max_len) {
    var words = text.split(" ");
    var chunks = [""];

    for (var i = 0, len = words.length, j = 0; i < len; ++i) {
        var nw = chunks[j] + " " + words[i];

        if (nw.length < max_len) {
            chunks[j] = nw.trim();
        } else {
            ++j;
            chunks[j] = words[i];
        }
    }

    return chunks;
}

function hasFocusedInputs() {
    var has_focus_elements = false;

    $(document.body).find("*:focus").each(function () {
        if ($(this).is("input,textarea") || this.contentEditable == true) {
            has_focus_elements = true;
        }
    });

    return has_focus_elements;
}

function _getSelection() {
    var selection = null;

    if (window.getSelection) {
        selection = window.getSelection();
    } else if (document.getSelection) {
        selection = document.getSelection();
    }

    return selection;
}

function getSelectedText() {
    var selection = _getSelection();

    return selection ?
        selection.toString().trim() :
        '';
}

// @returns null
function hideSelectionButton() {
    $('.' + TOOLTIP_PREFIX + 'translate-selection-button').fadeOut(150, function () {
        $(this).remove();
    });
}

// @returns null
function handleTranslation(type) {
    console.log("Handle a translation.");

    //
    // Carry on with translation:
    //

    if (is_translating) {
        return;
    }

    var id;
    var selection = _getSelection();
    var selected_text = selection.toString();

    if (selected_text) {
        last_call_args.selectionBB = selection.getRangeAt(0).getBoundingClientRect();
        last_call_args.text = selected_text;
        //last_call_args.from = from;
        //last_call_args.to = to;

        id = showTooltip(selection);

        toggleLoadingInTooltip(id, true);
    } else if (last_call_args.selectionBB && last_call_args.text) {
        //last_call_args.from = from;
        //last_call_args.to = to;

        id = showTooltip(last_call_args.selectionBB);
        toggleLoadingInTooltip(id, true);

        selected_text = last_call_args.text;
    } else {
        return;
    }

    is_translating = true;

    translate(selected_text.substr(0, MAX_TEXT_LEN), id, type);
}

// @returns null
function displayTranslation(data) {
    is_translating = false;

    if (data.offline) {
        toggleOfflineInTooltip(data.id, true);
        return;
    }

    //data.translation = JSON.parse(data.translation);

    toggleLoadingInTooltip(data.id, false);
    setTooltipContents(data.id, wrapper.wrap(data.translation));

    $('.' + TOOLTIP_PREFIX + 'tooltip-' + data.id)
        .find('.' + TOOLTIP_PREFIX + 'listen-original')
        .attr('data-from', data.from);

    $('.' + TOOLTIP_PREFIX + 'tooltip-' + data.id)
        .find('.' + TOOLTIP_PREFIX + 'listen-translation')
        .attr('data-to', data.to);

    var $tt = $('.' + TOOLTIP_PREFIX + 'tooltip-' + data.id);

    if ($tt.find('.' + TOOLTIP_PREFIX + 'top-arr0w').is(':visible')) {
        $tt.find('#' + TOOLTIP_PREFIX + 'tr-scrollbar').addClass(TOOLTIP_PREFIX + 'top-scroll');
    }

    //$tt.find('.' + TOOLTIP_PREFIX + 'from-flag').attr('src', safari.extension.baseURI + data.from + '@2x.png');
    //$tt.find('.' + TOOLTIP_PREFIX + 'to-flag').attr('src', safari.extension.baseURI + data.to + '@2x.png');

    if (!data.translation[0] && data.translation[3].length < 35) {
        $tt.find('.' + TOOLTIP_PREFIX + 'padded-single-translation').addClass(TOOLTIP_PREFIX + 'short-padded-single-translation');
    }

    if (SYMBOL_LANGS.indexOf(data.to) > -1) {
        $tt.find('.' + TOOLTIP_PREFIX + 'content-layout').addClass(TOOLTIP_PREFIX + 'non-bold-contents');
    } else {
        $tt.find('.' + TOOLTIP_PREFIX + 'content-layout').removeClass(TOOLTIP_PREFIX + 'non-bold-contents');
    }

    ctrlTooltipOrigVisibility(false, data.from, $tt);
    ctrlTooltipTransVisibility(false, data.to, $tt);
    ctrlSynonymVis(false, data.to, $tt);

    $tt.find('.' + TOOLTIP_PREFIX + 'listen-butt0n').on('click', playTooltip);
    $tt.find('.' + TOOLTIP_PREFIX + 'listen-v-item').on('click', playTooltipSynonym);
    $tt.find('.' + TOOLTIP_PREFIX + 'small-copy-button').on('click', copySynonym);
    $tt.find('.' + TOOLTIP_PREFIX + 'copy-translation-butt0n')
        .on('click', copyMainTranslation)
        .attr('data-tid', data.id);

    makeDraggable(data.id);

    fadeInTooltip(data.id, function () {
        ++opened_tooltips;

        // if it's a long-ass text, scroll the tooltip contents down to translation
        $tt.find('.TnITTtw-trVisibleLayout').scrollTop($tt.find('.TnITTtw-original-wrap').height());
    });

    setTimeout(hideSelectionButton, 250);
}

function fadeInTooltip(ttid, callback) {
    $('.' + TOOLTIP_PREFIX + 'tooltip-' + ttid).fadeIn(400, callback);
}

function copyMainTranslation(event) {
    var $this = $(this);

    if ($this.hasClass(TOOLTIP_PREFIX + 'copied')) {
        return;
    }

    $this.addClass(TOOLTIP_PREFIX + 'copied');
    setTimeout(function () {
        $this.removeClass(TOOLTIP_PREFIX + 'copied');
    }, 2500);

    var text = getListenValue('trans', $('.' + TOOLTIP_PREFIX + 'tooltip-' + $(event.target).data('tid')));

    copyToClipboard(text);

    sendAmplitudeEvent('actext_copy_maintrans');
}

function playTooltipSynonym(event) {
    var val = $(this).parent().find('.' + TOOLTIP_PREFIX + 'main-of-item').html();

    playUniversal(
        $(this),
        'lang:' + $(this).data('langto'),
        val,
        ['ctrlSynonymVis', 'ctrlTooltipOrigVisibility',
            'ctrlTooltipTransVisibility'
        ],
        null,
        event
    );
}

function playTooltip(e) {
    e.stopPropagation();

    if ($(this).hasClass(TOOLTIP_PREFIX + 'listen-original')) {
        playTooltipOriginal.call(this, e, $(this).data('from'));
    } else {
        playTooltipTranslation.call(this, e, $(this).data('to'));
    }
}

function playTooltipOriginal(event, lang) {
    playUniversal(
        $(this),
        'lang:' + lang,
        getListenValue('orig', event),
        ['ctrlTooltipTransVisibility', 'ctrlSynonymVis'],
        null,
        event
    );

    sendAmplitudeEvent('actext_tts_original');
}

function playTooltipTranslation(event, lang) {
    playUniversal(
        $(this),
        'lang:' + lang,
        getListenValue('trans', event),
        ['ctrlTooltipOrigVisibility', 'ctrlSynonymVis'],
        null,
        event
    );

    sendAmplitudeEvent('actext_tts_translation');
}

var listen_target_id = 0;
var listen_targets = {};

function playUniversal($button, dir, input, vis_fns, dl, ctx) {
    if (!input || $button.is('[class$="listen-disabled"]')) {
        return;
    }

    var lang = dl || (dir.substr(0, 5) === 'lang:' ? dir.substr(5) : 'en');

    if ($button.hasClass('stop-audio')) {
        stopPlayback(lang, vis_fns, +$button.data('tid'));
    } else {
        $button.addClass('stop-audio');

        vis_fns.forEach(function (vis_fn) {
            window[vis_fn](true, lang, ctx);
        });

        var target_id = ++listen_target_id;
        $button.attr('data-tid', target_id);
        listen_targets[target_id] = ctx;

        playback(vis_fns, input.trim(), lang, target_id);
    }
}

function playback(vis_fns, text, lang, target_id) {
    var callback = function () {
        onAudioPlaybackFinished({
            lang: lang,
            target_id: target_id,
            vis_fns: vis_fns
        });
    };

    if (isUtterable(lang)) {
        audio.playText(text, lang, callback);
    } else {
        callback();
    }
}

function stopPlayback() {
    audio.stop();
}

function onAudioPlaybackFinished(data) {
    if (!data) {
        return;
    }

    $(listen_targets[data.target_id].target).removeClass('stop-audio');

    data.vis_fns.forEach(function (vis_fn) {
        window[vis_fn](
            false,
            data.lang,
            listen_targets[data.target_id]
        );
    });

    delete listen_targets[data.target_id];
}

var audio = {
    isPlaying: false,

    playText: function (text, lang, on_audio_stop_callback) {
        if (!(lang in TTS_LANGS)) {
            return;
        }

        if (audio.isPlaying) {
            audio.stop();
        }

        console.log('playing text:', DICT_SPEED, text, TTS_LANGS[lang]);

        var player = new SpeechSynthesisUtterance();
        player.rate = 1;
        player.pitch = +DICT_SPEED;
        player.text = text;
        player.voice = TTS_LANGS[lang];

        // event after text has been spoken
        player.onend = () => {
            on_audio_stop_callback();
        };

        // speak
        window.speechSynthesis.speak(player);
    },

    stop: function () {
        audio.isPlaying = false;
        window.speechSynthesis.cancel();
    }
};

function makeDraggable(id) {
    var $tooltip = $('.' + TOOLTIP_PREFIX + 'tooltip-' + id);

    //
    //
    // Dragging

    var startPosXInTt = 0,
        startPosYInTt = 0;

    var tt_move = function (event) {
        $tooltip.css({
            left: event.clientX - startPosXInTt,
            top: event.clientY - startPosYInTt
        });
    };

    //$tooltip.on('touchstart', function (event) {
    //if (event.which === 1) {
    //startPosXInTt = event.clientX - parseInt($tooltip.css('left'));
    //startPosYInTt = event.clientY - parseInt($tooltip.css('top'));

    $(window).on('touchmove', tt_move);
    //}
    //});
    //$(window).on('touchend', function () {
    //$(window).off('touchmove', tt_move);
    //});

    //
    //
    // Closing

    $('.' + TOOLTIP_PREFIX + 'close-unpinned').on('click', function (event) {
        var $to_close_tooltip = $(getTooltipWrapRecursively(event.target));
        $to_close_tooltip.fadeOut(125, function () {
            $(this).remove();
        });
    });
}

function copySynonym() {
    var prefix = TOOLTIP_PREFIX;

    var $this = $(this);
    var _class = prefix + 'copied';

    if ($this.hasClass(_class)) {
        return;
    }

    var $el = $(this).parent().find('.' + prefix + 'main-of-item');

    $this.addClass(_class);
    setTimeout(function () {
        $this.removeClass(_class);
    }, 2500);

    copyToClipboard($el.html());
}

function copyToClipboard(text) {
    var $cc = $('<textarea>')
        .css({
            position: 'absolute',
            top: -1000,
            left: -1000
        })
        .appendTo('body');
    $cc.val(text).focus().select();
    document.execCommand('Copy');
    $cc.remove();
}

function getTooltipWrapRecursively(target) {
    return $(target).attr('id') == TOOLTIP_PREFIX + 'tooltip-wrap' ?
        target :
        getTooltipWrapRecursively($(target).parent().get(0));
}

function isUtterable(lang) {
    return lang in TTS_LANGS;
}

function ctrlTooltipOrigVisibility(playing, lang, e) {
    ctrlTooltipPlaybackButtonVisibility(playing, lang, e, 'original', 'from', 'orig');
}

function ctrlTooltipTransVisibility(playing, lang, e) {
    ctrlTooltipPlaybackButtonVisibility(playing, lang, e, 'translation', 'to', 'trans');
}

function ctrlTooltipPlaybackButtonVisibility(playing, lang, e, t_btn, t_dir, t_val) {
    var $context;

    if (e.target) {
        $context = $(getTooltipWrapRecursively(e.target));
    } else if (e.innerHTML) {
        $context = $(e);
    } else {
        $context = e;
    }

    var to_lang = $context.find('.' + TOOLTIP_PREFIX + 'listen-' + t_btn).data(t_dir);

    if (!isUtterable(to_lang)) {
        $context.addClass(TOOLTIP_PREFIX + 'no-' + t_val + '-tts');
    } else {
        $context.removeClass(TOOLTIP_PREFIX + 'no-' + t_val + '-tts');
    }

    var allowed = !playing && getListenValue(t_val, e);

    $context.find('.' + TOOLTIP_PREFIX + 'listen-' + t_btn)[(allowed ? 'remove' : 'add') + 'Class'](TOOLTIP_PREFIX + 'listen-disabled');
}

function ctrlSynonymVis(playing, lang, event) {
    if (!event) {
        event = $("body");
    }

    var $context = event.target ? $(event.target)
        .parent()
        .parent()
        .parent()
        .parent() : event;

    var allowed = !playing;
    var prefix = TOOLTIP_PREFIX;

    if (!isUtterable(lang)) {
        $context.addClass(prefix + 'no-tts');
    } else {
        $context.removeClass(prefix + 'no-tts');
    }

    $('.' + prefix + 'listen-v-item').each(function () {
        var $this = $(this);
        if (!$this.hasClass('stop-audio')) {
            $this[(allowed ? 'remove' : 'add') + 'Class'](prefix + 'listen-disabled');
        }
    });
}

function getListenValue(s, event) {
    var $where = !event.target ? event : $(getTooltipWrapRecursively(event.target));

    if (s === 'orig') {
        var i = $where.find('.' + TOOLTIP_PREFIX + 'original-wrap .' + TOOLTIP_PREFIX + 'mv-text-part').html();
        if (!i) {
            return $where.find('.' + TOOLTIP_PREFIX + 'original-wrap .' + TOOLTIP_PREFIX + 'tpart').html();
        } else {
            return i;
        }
    } else if (s === 'trans') {
        var i = $where.find('.' + TOOLTIP_PREFIX + 'main-variant .' + TOOLTIP_PREFIX + 'mv-text-part').html();
        if (!i) {
            return $where.find('.' + TOOLTIP_PREFIX + 'trans-wrap .' + TOOLTIP_PREFIX + 'tpart').html();
        } else {
            return i;
        }
    }

    return '';
}

function getSelectionParameters(s) {
    return s.getRangeAt ? $.extend({
        scrollX: window.pageXOffset,
        scrollY: window.pageYOffset
    }, s.getRangeAt(0).getBoundingClientRect()) : {
        left: s.x || s.left,
        top: s.y || s.top,
        width: s.width,
        height: s.height
    };
}

function parseHtml(h) {
    return h.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
}

function compileString(str, data) {
    data = data || {};
    str = parseHtml(str);

    for (var key in data) {
        str = str
            .replace(new RegExp("<%=" + key + "%>", 'g'), data[key])
            .replace(new RegExp("<%= " + key + " %>", 'g'), data[key]);
    }

    return str;
}

const TOOLTIP_CONTENTS_HTML = '\
<div class="<%=prefix%>t <%=prefix%>help-selected-wrap <%=prefix%>hsw-<%=ttid%>">\
<div class="<%=prefix%>t <%=prefix%>help-inside-layout <%=prefix%>hil-<%=ttid%>">\
<div class="<%=prefix%>unpinned-utils">\
<div class="<%=prefix%>pro-img"></div>\
<div class="<%=prefix%>close-unpinned"></div>\
</div>\
<div class="<%=prefix%>trVisibleLayout" id="<%=prefix%>trVisibleLayout-<%=ttid%>">\
<div class="<%=prefix%>trEntireLayout" id="<%=prefix%>trEntireLayout-<%=ttid%>">\
<div class="<%=prefix%>t <%=prefix%>content-layout <%=prefix%>content-layout-<%=ttid%>">\
<%=content%></div>\
</div>\
</div>\
\
</div>\
\
<div class="<%=prefix%>netflix-buttons <%=prefix%>nf-<%=ttid%>">\
<div class="<%=prefix%>netflix-button <%=prefix%>netflix-save t-<%=ttid%>"><%=netflix_save%></div>\
<div class="<%=prefix%>netflix-button <%=prefix%>netflix-continue"><%=netflix_continue%></div>\
</div>\
\
<div class="<%=prefix%>offline"><span><%=l_offline%></span></div>\
</div>\
';

const TOOLTIP_HTML = '\
<div class="<%=prefix%>tooltip-main-wrap <%=prefix%>tooltip-<%=ttid%> <%=prefix%>t" id="<%=prefix%>tooltip-wrap" data-ttid="<%=ttid%>">\
<div class="<%=prefix%>t <%=prefix%>inside-layout">\
<div class="<%=prefix%>t <%=prefix%>content">' + TOOLTIP_CONTENTS_HTML + '</div>\
</div>\
</div>\
';

function getOParamsInstance(g) {
    g.width = g.width || 0;
    g.height = g.height || 0;
    g.pl = g.pl || 0;
    g.pr = g.pr || 0;
    g.pt = g.pt || 0;
    g.pb = g.pb || 0;
    return g;
}

function closeTooltip(e) {
    if (opened_tooltips <= 0) return;

    if ((typeof e === 'boolean' && e) || (typeof e !== 'boolean' && !$(e.target).hasClass(TOOLTIP_PREFIX + 't'))) {
        //$('body').unbind();

        var tooltip = $('.' + TOOLTIP_PREFIX + 'tooltip-main-wrap');

        if (tooltip.length > 0) {
            tooltip.each(function () {
                if (!$(this).hasClass(TOOLTIP_PREFIX + 'unpinned')) {
                    $(this).remove();
                    --opened_tooltips;
                }
            });
        }
    }
}

$.fn.measure = function (fn) {
    var el = $(this).clone(false);
    el.css({
        visibility: 'hidden',
        position: 'absolute'
    });
    el.appendTo('body');
    var result = fn.apply(el);
    el.remove();
    return result;
};

function getBodyScrollLeft() {
    return document.documentElement.scrollLeft || document.body.scrollLeft || 0;
}

function getBodyScrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop || 0;
}

const Y_OFFSET = 10;

function computeTooltipPosition(el, ix, iy, oparams, scale, callback) {
    var pos = [0, 0, 'bottom'];

    var tooltip_width = 0;
    var tooltip_height = 0;

    $(el.get()).measure(function () {
        tooltip_width = this.width();
        tooltip_height = this.height();

        var absolute_selection_left_scroll = ix + getBodyScrollLeft();
        var absolute_selection_top_scroll = iy + getBodyScrollTop();

        var selection_absolute_width = oparams.width + oparams.pl + oparams.pr;
        var selection_absolute_height = oparams.height + oparams.pt + oparams.pb;

        pos[0] = absolute_selection_left_scroll - tooltip_width / 2 + selection_absolute_width / 2;
        pos[1] = absolute_selection_top_scroll - tooltip_height - Y_OFFSET * scale;
        pos[2] = 'bottom'; // tooltip is above, arrow is on bottom

        // Horizontal alignment
        if (pos[0] - getBodyScrollLeft() < 1) {

            // stick to the left side

            pos[0] = getBodyScrollLeft() + 1 - tooltip_width * (1 - scale) / 2;
        } else if (pos[0] + tooltip_width > document.body.clientWidth) {

            // stick to the right side

            pos[0] = document.body.clientWidth - tooltip_width - 1 + tooltip_width * (1 - scale) / 2;
        }

        // A vertical one
        if (pos[1] - getBodyScrollTop() < 1) {
            pos[1] = absolute_selection_top_scroll + selection_absolute_height + Y_OFFSET * scale;

            // tooltip below the selection
            // if scale != 1
            pos[1] -= tooltip_height * (1 - scale) / 2;

            pos[2] = 'top'; // tooltip is below, arrow is on top
        } else {
            pos[1] += tooltip_height * (1 - scale) / 2;
        }

        callback(pos);
    });
}

// @returns id - tooltip ID
function showTooltip(selection) {
    var ttid = ++tooltip_id;
    var sel_params = getSelectionParameters(selection);

    closeTooltip(true);

    var $tooltip = $(compileString(TOOLTIP_HTML, {
        content: '',
        prefix: TOOLTIP_PREFIX,
        ttid: ttid,
        l_offline: getLocale('No Internet Connection'),
        netflix_save: getLocale('Save'),
        netflix_continue: getLocale('Continue')
    }));

    var maxZ = Math.max.apply(null,
        $.map($('body *'), function (e, n) {
            if ($(e).css('position') != 'static')
                return parseInt($(e).css('z-index')) || 1;
        }));

    $tooltip.css({
        "z-index": maxZ + 1,
        maxWidth: 450,
        maxHeight: 325
    });

    //$(window).on('click', closeTooltip);

    var left = 0;
    var top = 0;
    var params;

    left += sel_params.left; //- (window.scrollX - sel_params.scrollX);
    top += sel_params.top; //- (window.scrollY - sel_params.scrollY);
    params = getOParamsInstance(sel_params);

    $tooltip.css('transform', 'scaleX(' + scale + ') scaleY(' + scale + ')');

    computeTooltipPosition($tooltip, left, top, params, scale, function (tp) {
        var real_y = tp[1] - 5;

        $tooltip.css({
            left: tp[0],
            top: real_y
        }).animate({
            top: real_y
        }, 300);

        var $dest = $('body');
        var _dark_mode = dark_mode;

        if (document.location.href.indexOf('https://www.netflix.com/watch') > -1) {
            $dest = $('.nf-player-container');
            _dark_mode = true;
        } else if ($dest.length === 0) {
            $dest = $('html');
        }

        $tooltip.data('ttid', ttid);

        if (_dark_mode) {
            $tooltip.addClass(TOOLTIP_PREFIX + 'dark-mode');
        }

        $dest.append($tooltip.get());

        $('#' + TOOLTIP_PREFIX + 'tooltip-wrap *').addClass('TnITTtw-t');

        //
        // hide elements to avoid using !important in CSS
        //
        $('.TnITTtw-tooltip-main-wrap').hide();
        $('.TnITTtw-info-warn.TnITTtw-hide').hide();
        $('.TnITTtw-netflix-buttons').hide();
        $('.TnITTtw-utils').css('display', 'block');
        $('.TnITTtw-unpinned-utils').hide();

        $('.TnITTtw-loading, .TnITTtw-offline').hide();
    });

    return ttid;
}

// @returns null
function toggleLoadingInTooltip(ttid, is_loading) {
    //
    // remove previous loadings
    //
    $('.' + TOOLTIP_PREFIX + 'translate-loading').fadeOut(250, function () {
        $(this).remove();
    });

    if (is_loading) {
        var selection = _getSelection();
        var params = selection.toString() ?
            getSelectionParameters(selection) :
            last_call_args.selectionBB;

        var $dest = $('body');
        var is_netflix = false;

        if (document.location.href.indexOf('https://www.netflix.com/watch') > -1) {
            $dest = $('.nf-player-container');
            is_netflix = true;
        } else if ($dest.length === 0) {
            $dest = $('html');
        }

        var height = 70;
        var width = height;
        var x = params.left + params.width / 2 + window.pageXOffset - width / 2;
        var y;

        if (params.top + params.height + 10 + height > window.innerHeight || is_netflix) {
            y = params.top - 10 - height + window.pageYOffset; // loading is above
        } else {
            y = params.top + params.height + 10 + window.pageYOffset; // loading is below
        }

        $dest.append(
            $('<div class="' + TOOLTIP_PREFIX + 'translate-loading"></div>')
                .addClass(is_netflix || dark_mode ? TOOLTIP_PREFIX + 'dark-mode' : '')
                .html('<div class="' + TOOLTIP_PREFIX + 'mate-loading"></div>')
                .css({
                    top: y,
                    left: x
                })
        );
    }
}

function toggleOfflineInTooltip(ttid, is_offline) {
    if (is_offline) {
        $('.' + TOOLTIP_PREFIX + 'tooltip-' + ttid)
            .find('.' + TOOLTIP_PREFIX + 'offline')
            .css('display', 'flex !important');
    } else {
        $('.' + TOOLTIP_PREFIX + 'tooltip-' + ttid)
            .find('.' + TOOLTIP_PREFIX + 'offline')
            .fadeOut(250, function () {
                $(this).remove();
            });
    }
}

function setTooltipContents(id, code) {
    $('.' + TOOLTIP_PREFIX + 'content-layout-' + id).html(code);
    $('#' + TOOLTIP_PREFIX + 'tooltip-wrap *').addClass('TnITTtw-t');

    //$('.TnITTtw-original-wrap').hide();
}

const max_synonyms = 3;

var SINGLE_HTML = '\
<div class="<%=prefix%>original-wrap <%=prefix%>padded-single-translation">\
<div class="<%=prefix%>mv-text-part"><%=original%></div>\
<div class="<%=prefix%>mv-translit <%=prefix%>original-translit"><%=translit_original%></div>\
<div class="<%=prefix%>ico-listen <%=prefix%>listen-butt0n <%=prefix%>listen-original" data-from="<%=from%>"></div>\
</div>\
<div class="<%=prefix%>padded-single-translation <%=prefix%>trans-wrap">\
<div class="<%=prefix%>tpart"><%=translation%></div>\
<div class="<%=prefix%>mv-translit <%=prefix%>translation-translit"><%=translit_translation%></div>\
<div class="<%=prefix%>copy-translation-butt0n" data-to="<%=to%>"></div>\
<div class="<%=prefix%>ico-listen <%=prefix%>listen-butt0n <%=prefix%>listen-translation" data-to="<%=to%>"></div>\
</div>';

var positions = {
    '': 0,
    noun: 1,
    verb: 2,
    adjective: 3,
    adverb: 4,
    pronoun: 5,
    preposition: 6,
    conjunction: 7,
    interjection: 8,
    abbreviation: 9,
    phrase: 10,
    suffix: 11,
    auxiliaryverb: 12
};

var parts_of_speech = [];

for (var key in positions) {
    parts_of_speech.push(key);
}

function capitalize(s) {
    return !s ? '' : s[0].toUpperCase() + s.substr(1).toLowerCase();
}

var wrapper = {
    TRANSLIT_TYPE: 1,
    IPA_TYPE: 2,
    SYNONYMS_TYPE: 3,

    _singleWrap: function (translations, type, prefix, locales, lang) {
        prefix = prefix || '';

        return compileString(SINGLE_HTML, {
            prefix: prefix,
            l_open: locales.open,
            original: translations[8] + translations[1],
            translation: translations[9] + translations[3],
            to: lang,
            translit_original: translations[10] || translations[11],
            translit_translation: translations[2] || translations[4]
        });
    },

    _complexSingleWrap: function (translations, ov, prefix, locales, lang) {
        return this._singleWrap(translations, wrapper.SYNONYMS_TYPE, prefix, locales, lang);
    },

    _multiWrap: function (translations, onlyVariants, prefix, locales, lang) {
        var df_local, df_local_items;
        var df = document.createDocumentFragment();

        if (!prefix) {
            prefix = '';
        }

        for (var i = 0; i < translations[7].length; ++i) {
            if (!$.isArray(translations[7][i]) || translations[7][i].length === 0) {
                continue;
            }

            var len = translations[7][i].length;
            df_local = document.createDocumentFragment();

            $.each(translations[7][i], function (k, v) {
                df_local_items = document.createDocumentFragment();

                // Hotfix
                if (v[2] && typeof v[1] === 'string' && $.isArray(v[2])) {
                    var t = v[1];
                    v[1] = v[2];
                    v[2] = t;
                }

                $.each(v[1] || [], function (k2, v2) {
                    if (k2 >= max_synonyms) return;
                    if (v2) {
                        $(df_local_items)
                            .append($('<div>', {
                                class: prefix + 'synonym'
                            }).html(v2))
                            .append(k2 < v[1].length - 1 && k2 < max_synonyms - 1 ? ', ' : '');
                    }
                });

                var gender = v[2] ? v[2] + ' ' : '';

                $(df_local)
                    .append($('<div>', {
                        class: prefix + 'v-item'
                    })
                        .append($('<div>', {
                            class: prefix + 'small-copy-button',
                            'data-langto': lang
                        }))
                        .append($('<div>', {
                            class: prefix + 'listen-v-item',
                            'data-langto': lang
                        }))
                        .append($('<div>', {
                            class: prefix + 'v-texts'
                        })
                            .append($('<div>', {
                                class: prefix + 'main-of-item'
                            }).html(gender + v[0])))
                        .append($('<div>', {
                            class: prefix + 'synonyms'
                        }).append(df_local_items)));
            });

            var key = parts_of_speech[i];

            $(df).append(
                $('<div>')
                    .addClass(prefix + 'variant-row')
                    .append(
                        $('<div>')
                            .addClass(prefix + 'v-pos')
                            .html(key ? getLocale(key) : '')
                            .addClass(!key ? prefix + 'empty-pos' : '')
                            .get()
                    )
                    .append(
                        $('<div>')
                            .addClass(prefix + 'v-closest-wrap')
                            .append(df_local)
                            .get()
                    )
                    .get()
            );
        }

        // Do not include different wrappers and a main variant to the final HTML code
        if (onlyVariants === true) {
            return $('<div>').append(df).html();
        }

        var gender_original = translations[8] ? translations[8] + ' ' : '';
        var gender_translation = translations[9] ? translations[9] + ' ' : '';
        var translit_original = translations[10] || translations[11];
        var translit_translation = translations[2] || translations[4];

        var bunch = $('<div>').addClass(prefix + 'variant-bunch-wrap').append(
            $('<div>')
                .addClass(prefix + 'vbw-inside-layout')
                .append(
                    $('<div>')
                        .addClass(prefix + 'original-wrap')
                        .append(
                            $('<div>')
                                .addClass(prefix + 'original')
                                .html('<div class="' + prefix + 'mv-text-part">' + gender_original + translations[1] + '</div><div class="' + prefix + 'add-pb-butt0n"></div><div class="' + prefix + 'mv-translit ' + prefix + 'original-translit">' + translit_original + '</div><div class="' + prefix + 'copy-butt0n"></div><div class="' + prefix + 'ico-listen ' + prefix + 'listen-butt0n ' + prefix + 'listen-original" data-from="<%=from%>">' +
                                    '</div>')
                                .get()
                        )
                        .get()
                )
                .append(
                    $('<div>')
                        .addClass(prefix + 'main-variant-wrap')
                        .append(
                            $('<div>')
                                .addClass(prefix + 'main-variant')
                                .html('<div class="' + prefix + 'mv-text-part">' + gender_translation + translations[3] + '</div><div class="' + prefix + 'mv-translit ' + prefix + 'original-translit">' + translit_translation + '</div><div class="' + prefix + 'copy-translation-butt0n"></div><div class="' + prefix + 'ico-listen ' + prefix + 'listen-butt0n ' + prefix + 'listen-translation" data-to="' + lang + '">' +
                                    '</div>')
                                .get()
                        )
                        .get()
                )
                .append(
                    $('<div>')
                        .addClass(prefix + 'variants-by-pos')
                        .append(df)
                        .get()
                )
                .get()
        );

        return $('<div>').append(bunch.get()).html();
    },

    wrap: function (json) {
        return wrapper['_' + (json[0] ? 'multi' : 'complexSingle') + 'Wrap'](json, false, TOOLTIP_PREFIX, {}, json[6]);
    }
};