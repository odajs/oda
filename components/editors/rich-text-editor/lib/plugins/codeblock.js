var W = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function V(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x;
}
var Y = { exports: {} };
(function(x) {
  var S = typeof window < "u" ? window : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? self : {};
  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   */
  var i = function(c) {
    var d = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, f = 0, m = {}, s = {
      /**
       * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
       * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
       * additional languages or plugins yourself.
       *
       * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
       *
       * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.manual = true;
       * // add a new <script> to load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      manual: c.Prism && c.Prism.manual,
      /**
       * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
       * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
       * own worker, you don't want it to do this.
       *
       * By setting this value to `true`, Prism will not add its own listeners to the worker.
       *
       * You obviously have to change this value before Prism executes. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.disableWorkerMessageHandler = true;
       * // Load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      disableWorkerMessageHandler: c.Prism && c.Prism.disableWorkerMessageHandler,
      /**
       * A namespace for utility methods.
       *
       * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
       * change or disappear at any time.
       *
       * @namespace
       * @memberof Prism
       */
      util: {
        encode: function t(e) {
          return e instanceof y ? new y(e.type, t(e.content), e.alias) : Array.isArray(e) ? e.map(t) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
        },
        /**
         * Returns the name of the type of the given value.
         *
         * @param {any} o
         * @returns {string}
         * @example
         * type(null)      === 'Null'
         * type(undefined) === 'Undefined'
         * type(123)       === 'Number'
         * type('foo')     === 'String'
         * type(true)      === 'Boolean'
         * type([1, 2])    === 'Array'
         * type({})        === 'Object'
         * type(String)    === 'Function'
         * type(/abc+/)    === 'RegExp'
         */
        type: function(t) {
          return Object.prototype.toString.call(t).slice(8, -1);
        },
        /**
         * Returns a unique number for the given object. Later calls will still return the same number.
         *
         * @param {Object} obj
         * @returns {number}
         */
        objId: function(t) {
          return t.__id || Object.defineProperty(t, "__id", { value: ++f }), t.__id;
        },
        /**
         * Creates a deep clone of the given object.
         *
         * The main intended use of this function is to clone language definitions.
         *
         * @param {T} o
         * @param {Record<number, any>} [visited]
         * @returns {T}
         * @template T
         */
        clone: function t(e, a) {
          a = a || {};
          var n, r;
          switch (s.util.type(e)) {
            case "Object":
              if (r = s.util.objId(e), a[r])
                return a[r];
              n = /** @type {Record<string, any>} */
              {}, a[r] = n;
              for (var l in e)
                e.hasOwnProperty(l) && (n[l] = t(e[l], a));
              return (
                /** @type {any} */
                n
              );
            case "Array":
              return r = s.util.objId(e), a[r] ? a[r] : (n = [], a[r] = n, /** @type {Array} */
              /** @type {any} */
              e.forEach(function(o, u) {
                n[u] = t(o, a);
              }), /** @type {any} */
              n);
            default:
              return e;
          }
        },
        /**
         * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
         *
         * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
         *
         * @param {Element} element
         * @returns {string}
         */
        getLanguage: function(t) {
          for (; t; ) {
            var e = d.exec(t.className);
            if (e)
              return e[1].toLowerCase();
            t = t.parentElement;
          }
          return "none";
        },
        /**
         * Sets the Prism `language-xxxx` class of the given element.
         *
         * @param {Element} element
         * @param {string} language
         * @returns {void}
         */
        setLanguage: function(t, e) {
          t.className = t.className.replace(RegExp(d, "gi"), ""), t.classList.add("language-" + e);
        },
        /**
         * Returns the script element that is currently executing.
         *
         * This does __not__ work for line script element.
         *
         * @returns {HTMLScriptElement | null}
         */
        currentScript: function() {
          if (typeof document > "u")
            return null;
          if ("currentScript" in document && 1 < 2)
            return (
              /** @type {any} */
              document.currentScript
            );
          try {
            throw new Error();
          } catch (n) {
            var t = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(n.stack) || [])[1];
            if (t) {
              var e = document.getElementsByTagName("script");
              for (var a in e)
                if (e[a].src == t)
                  return e[a];
            }
            return null;
          }
        },
        /**
         * Returns whether a given class is active for `element`.
         *
         * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
         * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
         * given class is just the given class with a `no-` prefix.
         *
         * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
         * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
         * ancestors have the given class or the negated version of it, then the default activation will be returned.
         *
         * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
         * version of it, the class is considered active.
         *
         * @param {Element} element
         * @param {string} className
         * @param {boolean} [defaultActivation=false]
         * @returns {boolean}
         */
        isActive: function(t, e, a) {
          for (var n = "no-" + e; t; ) {
            var r = t.classList;
            if (r.contains(e))
              return !0;
            if (r.contains(n))
              return !1;
            t = t.parentElement;
          }
          return !!a;
        }
      },
      /**
       * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
       *
       * @namespace
       * @memberof Prism
       * @public
       */
      languages: {
        /**
         * The grammar for plain, unformatted text.
         */
        plain: m,
        plaintext: m,
        text: m,
        txt: m,
        /**
         * Creates a deep copy of the language with the given id and appends the given tokens.
         *
         * If a token in `redef` also appears in the copied language, then the existing token in the copied language
         * will be overwritten at its original position.
         *
         * ## Best practices
         *
         * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
         * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
         * understand the language definition because, normally, the order of tokens matters in Prism grammars.
         *
         * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
         * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
         *
         * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
         * @param {Grammar} redef The new tokens to append.
         * @returns {Grammar} The new language created.
         * @public
         * @example
         * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
         *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
         *     // at its original position
         *     'comment': { ... },
         *     // CSS doesn't have a 'color' token, so this token will be appended
         *     'color': /\b(?:red|green|blue)\b/
         * });
         */
        extend: function(t, e) {
          var a = s.util.clone(s.languages[t]);
          for (var n in e)
            a[n] = e[n];
          return a;
        },
        /**
         * Inserts tokens _before_ another token in a language definition or any other grammar.
         *
         * ## Usage
         *
         * This helper method makes it easy to modify existing languages. For example, the CSS language definition
         * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
         * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
         * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
         * this:
         *
         * ```js
         * Prism.languages.markup.style = {
         *     // token
         * };
         * ```
         *
         * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
         * before existing tokens. For the CSS example above, you would use it like this:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'cdata', {
         *     'style': {
         *         // token
         *     }
         * });
         * ```
         *
         * ## Special cases
         *
         * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
         * will be ignored.
         *
         * This behavior can be used to insert tokens after `before`:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'comment', {
         *     'comment': Prism.languages.markup.comment,
         *     // tokens after 'comment'
         * });
         * ```
         *
         * ## Limitations
         *
         * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
         * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
         * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
         * deleting properties which is necessary to insert at arbitrary positions.
         *
         * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
         * Instead, it will create a new object and replace all references to the target object with the new one. This
         * can be done without temporarily deleting properties, so the iteration order is well-defined.
         *
         * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
         * you hold the target object in a variable, then the value of the variable will not change.
         *
         * ```js
         * var oldMarkup = Prism.languages.markup;
         * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
         *
         * assert(oldMarkup !== Prism.languages.markup);
         * assert(newMarkup === Prism.languages.markup);
         * ```
         *
         * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
         * object to be modified.
         * @param {string} before The key to insert before.
         * @param {Grammar} insert An object containing the key-value pairs to be inserted.
         * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
         * object to be modified.
         *
         * Defaults to `Prism.languages`.
         * @returns {Grammar} The new grammar object.
         * @public
         */
        insertBefore: function(t, e, a, n) {
          n = n || /** @type {any} */
          s.languages;
          var r = n[t], l = {};
          for (var o in r)
            if (r.hasOwnProperty(o)) {
              if (o == e)
                for (var u in a)
                  a.hasOwnProperty(u) && (l[u] = a[u]);
              a.hasOwnProperty(o) || (l[o] = r[o]);
            }
          var p = n[t];
          return n[t] = l, s.languages.DFS(s.languages, function(b, $) {
            $ === p && b != t && (this[b] = l);
          }), l;
        },
        // Traverse a language definition with Depth First Search
        DFS: function t(e, a, n, r) {
          r = r || {};
          var l = s.util.objId;
          for (var o in e)
            if (e.hasOwnProperty(o)) {
              a.call(e, o, e[o], n || o);
              var u = e[o], p = s.util.type(u);
              p === "Object" && !r[l(u)] ? (r[l(u)] = !0, t(u, a, null, r)) : p === "Array" && !r[l(u)] && (r[l(u)] = !0, t(u, a, o, r));
            }
        }
      },
      plugins: {},
      /**
       * This is the most high-level function in Prism’s API.
       * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
       * each one of them.
       *
       * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
       *
       * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
       * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
       * @memberof Prism
       * @public
       */
      highlightAll: function(t, e) {
        s.highlightAllUnder(document, t, e);
      },
      /**
       * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
       * {@link Prism.highlightElement} on each one of them.
       *
       * The following hooks will be run:
       * 1. `before-highlightall`
       * 2. `before-all-elements-highlight`
       * 3. All hooks of {@link Prism.highlightElement} for each element.
       *
       * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
       * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
       * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
       * @memberof Prism
       * @public
       */
      highlightAllUnder: function(t, e, a) {
        var n = {
          callback: a,
          container: t,
          selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };
        s.hooks.run("before-highlightall", n), n.elements = Array.prototype.slice.apply(n.container.querySelectorAll(n.selector)), s.hooks.run("before-all-elements-highlight", n);
        for (var r = 0, l; l = n.elements[r++]; )
          s.highlightElement(l, e === !0, n.callback);
      },
      /**
       * Highlights the code inside a single element.
       *
       * The following hooks will be run:
       * 1. `before-sanity-check`
       * 2. `before-highlight`
       * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
       * 4. `before-insert`
       * 5. `after-highlight`
       * 6. `complete`
       *
       * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
       * the element's language.
       *
       * @param {Element} element The element containing the code.
       * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
       * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
       * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
       * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
       *
       * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
       * asynchronous highlighting to work. You can build your own bundle on the
       * [Download page](https://prismjs.com/download.html).
       * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
       * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
       * @memberof Prism
       * @public
       */
      highlightElement: function(t, e, a) {
        var n = s.util.getLanguage(t), r = s.languages[n];
        s.util.setLanguage(t, n);
        var l = t.parentElement;
        l && l.nodeName.toLowerCase() === "pre" && s.util.setLanguage(l, n);
        var o = t.textContent, u = {
          element: t,
          language: n,
          grammar: r,
          code: o
        };
        function p($) {
          u.highlightedCode = $, s.hooks.run("before-insert", u), u.element.innerHTML = u.highlightedCode, s.hooks.run("after-highlight", u), s.hooks.run("complete", u), a && a.call(u.element);
        }
        if (s.hooks.run("before-sanity-check", u), l = u.element.parentElement, l && l.nodeName.toLowerCase() === "pre" && !l.hasAttribute("tabindex") && l.setAttribute("tabindex", "0"), !u.code) {
          s.hooks.run("complete", u), a && a.call(u.element);
          return;
        }
        if (s.hooks.run("before-highlight", u), !u.grammar) {
          p(s.util.encode(u.code));
          return;
        }
        if (e && c.Worker) {
          var b = new Worker(s.filename);
          b.onmessage = function($) {
            p($.data);
          }, b.postMessage(JSON.stringify({
            language: u.language,
            code: u.code,
            immediateClose: !0
          }));
        } else
          p(s.highlight(u.code, u.grammar, u.language));
      },
      /**
       * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
       * and the language definitions to use, and returns a string with the HTML produced.
       *
       * The following hooks will be run:
       * 1. `before-tokenize`
       * 2. `after-tokenize`
       * 3. `wrap`: On each {@link Token}.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @param {string} language The name of the language definition passed to `grammar`.
       * @returns {string} The highlighted HTML.
       * @memberof Prism
       * @public
       * @example
       * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
       */
      highlight: function(t, e, a) {
        var n = {
          code: t,
          grammar: e,
          language: a
        };
        if (s.hooks.run("before-tokenize", n), !n.grammar)
          throw new Error('The language "' + n.language + '" has no grammar.');
        return n.tokens = s.tokenize(n.code, n.grammar), s.hooks.run("after-tokenize", n), y.stringify(s.util.encode(n.tokens), n.language);
      },
      /**
       * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
       * and the language definitions to use, and returns an array with the tokenized code.
       *
       * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
       *
       * This method could be useful in other contexts as well, as a very crude parser.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @returns {TokenStream} An array of strings and tokens, a token stream.
       * @memberof Prism
       * @public
       * @example
       * let code = `var foo = 0;`;
       * let tokens = Prism.tokenize(code, Prism.languages.javascript);
       * tokens.forEach(token => {
       *     if (token instanceof Prism.Token && token.type === 'number') {
       *         console.log(`Found numeric literal: ${token.content}`);
       *     }
       * });
       */
      tokenize: function(t, e) {
        var a = e.rest;
        if (a) {
          for (var n in a)
            e[n] = a[n];
          delete e.rest;
        }
        var r = new w();
        return _(r, r.head, t), L(t, r, e, r.head, 0), I(r);
      },
      /**
       * @namespace
       * @memberof Prism
       * @public
       */
      hooks: {
        all: {},
        /**
         * Adds the given callback to the list of callbacks for the given hook.
         *
         * The callback will be invoked when the hook it is registered for is run.
         * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
         *
         * One callback function can be registered to multiple hooks and the same hook multiple times.
         *
         * @param {string} name The name of the hook.
         * @param {HookCallback} callback The callback function which is given environment variables.
         * @public
         */
        add: function(t, e) {
          var a = s.hooks.all;
          a[t] = a[t] || [], a[t].push(e);
        },
        /**
         * Runs a hook invoking all registered callbacks with the given environment variables.
         *
         * Callbacks will be invoked synchronously and in the order in which they were registered.
         *
         * @param {string} name The name of the hook.
         * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
         * @public
         */
        run: function(t, e) {
          var a = s.hooks.all[t];
          if (!(!a || !a.length))
            for (var n = 0, r; r = a[n++]; )
              r(e);
        }
      },
      Token: y
    };
    c.Prism = s;
    function y(t, e, a, n) {
      this.type = t, this.content = e, this.alias = a, this.length = (n || "").length | 0;
    }
    y.stringify = function t(e, a) {
      if (typeof e == "string")
        return e;
      if (Array.isArray(e)) {
        var n = "";
        return e.forEach(function(p) {
          n += t(p, a);
        }), n;
      }
      var r = {
        type: e.type,
        content: t(e.content, a),
        tag: "span",
        classes: ["token", e.type],
        attributes: {},
        language: a
      }, l = e.alias;
      l && (Array.isArray(l) ? Array.prototype.push.apply(r.classes, l) : r.classes.push(l)), s.hooks.run("wrap", r);
      var o = "";
      for (var u in r.attributes)
        o += " " + u + '="' + (r.attributes[u] || "").replace(/"/g, "&quot;") + '"';
      return "<" + r.tag + ' class="' + r.classes.join(" ") + '"' + o + ">" + r.content + "</" + r.tag + ">";
    };
    function E(t, e, a, n) {
      t.lastIndex = e;
      var r = t.exec(a);
      if (r && n && r[1]) {
        var l = r[1].length;
        r.index += l, r[0] = r[0].slice(l);
      }
      return r;
    }
    function L(t, e, a, n, r, l) {
      for (var o in a)
        if (!(!a.hasOwnProperty(o) || !a[o])) {
          var u = a[o];
          u = Array.isArray(u) ? u : [u];
          for (var p = 0; p < u.length; ++p) {
            if (l && l.cause == o + "," + p)
              return;
            var b = u[p], $ = b.inside, q = !!b.lookbehind, B = !!b.greedy, J = b.alias;
            if (B && !b.pattern.global) {
              var K = b.pattern.toString().match(/[imsuy]*$/)[0];
              b.pattern = RegExp(b.pattern.source, K + "g");
            }
            for (var U = b.pattern || b, F = n.next, k = r; F !== e.tail && !(l && k >= l.reach); k += F.value.length, F = F.next) {
              var C = F.value;
              if (e.length > t.length)
                return;
              if (!(C instanceof y)) {
                var z = 1, A;
                if (B) {
                  if (A = E(U, k, t, q), !A || A.index >= t.length)
                    break;
                  var j = A.index, N = A.index + A[0].length, T = k;
                  for (T += F.value.length; j >= T; )
                    F = F.next, T += F.value.length;
                  if (T -= F.value.length, k = T, F.value instanceof y)
                    continue;
                  for (var P = F; P !== e.tail && (T < N || typeof P.value == "string"); P = P.next)
                    z++, T += P.value.length;
                  z--, C = t.slice(k, T), A.index -= k;
                } else if (A = E(U, 0, C, q), !A)
                  continue;
                var j = A.index, D = A[0], R = C.slice(0, j), Z = C.slice(j + D.length), G = k + C.length;
                l && G > l.reach && (l.reach = G);
                var M = F.prev;
                R && (M = _(e, M, R), k += R.length), O(e, M, z);
                var Q = new y(o, $ ? s.tokenize(D, $) : D, J, D);
                if (F = _(e, M, Q), Z && _(e, F, Z), z > 1) {
                  var H = {
                    cause: o + "," + p,
                    reach: G
                  };
                  L(t, e, a, F.prev, k, H), l && H.reach > l.reach && (l.reach = H.reach);
                }
              }
            }
          }
        }
    }
    function w() {
      var t = { value: null, prev: null, next: null }, e = { value: null, prev: t, next: null };
      t.next = e, this.head = t, this.tail = e, this.length = 0;
    }
    function _(t, e, a) {
      var n = e.next, r = { value: a, prev: e, next: n };
      return e.next = r, n.prev = r, t.length++, r;
    }
    function O(t, e, a) {
      for (var n = e.next, r = 0; r < a && n !== t.tail; r++)
        n = n.next;
      e.next = n, n.prev = e, t.length -= r;
    }
    function I(t) {
      for (var e = [], a = t.head.next; a !== t.tail; )
        e.push(a.value), a = a.next;
      return e;
    }
    if (!c.document)
      return c.addEventListener && (s.disableWorkerMessageHandler || c.addEventListener("message", function(t) {
        var e = JSON.parse(t.data), a = e.language, n = e.code, r = e.immediateClose;
        c.postMessage(s.highlight(n, s.languages[a], a)), r && c.close();
      }, !1)), s;
    var h = s.util.currentScript();
    h && (s.filename = h.src, h.hasAttribute("data-manual") && (s.manual = !0));
    function g() {
      s.manual || s.highlightAll();
    }
    if (!s.manual) {
      var v = document.readyState;
      v === "loading" || v === "interactive" && h && h.defer ? document.addEventListener("DOMContentLoaded", g) : window.requestAnimationFrame ? window.requestAnimationFrame(g) : window.setTimeout(g, 16);
    }
    return s;
  }(S);
  x.exports && (x.exports = i), typeof W < "u" && (W.Prism = i), i.languages.markup = {
    comment: {
      pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
      greedy: !0
    },
    prolog: {
      pattern: /<\?[\s\S]+?\?>/,
      greedy: !0
    },
    doctype: {
      // https://www.w3.org/TR/xml/#NT-doctypedecl
      pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
      greedy: !0,
      inside: {
        "internal-subset": {
          pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
          lookbehind: !0,
          greedy: !0,
          inside: null
          // see below
        },
        string: {
          pattern: /"[^"]*"|'[^']*'/,
          greedy: !0
        },
        punctuation: /^<!|>$|[[\]]/,
        "doctype-tag": /^DOCTYPE/i,
        name: /[^\s<>'"]+/
      }
    },
    cdata: {
      pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
      greedy: !0
    },
    tag: {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: !0,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/,
          inside: {
            punctuation: /^<\/?/,
            namespace: /^[^\s>\/:]+:/
          }
        },
        "special-attr": [],
        "attr-value": {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            punctuation: [
              {
                pattern: /^=/,
                alias: "attr-equals"
              },
              {
                pattern: /^(\s*)["']|["']$/,
                lookbehind: !0
              }
            ]
          }
        },
        punctuation: /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: {
            namespace: /^[^\s>\/:]+:/
          }
        }
      }
    },
    entity: [
      {
        pattern: /&[\da-z]{1,8};/i,
        alias: "named-entity"
      },
      /&#x?[\da-f]{1,8};/i
    ]
  }, i.languages.markup.tag.inside["attr-value"].inside.entity = i.languages.markup.entity, i.languages.markup.doctype.inside["internal-subset"].inside = i.languages.markup, i.hooks.add("wrap", function(c) {
    c.type === "entity" && (c.attributes.title = c.content.replace(/&amp;/, "&"));
  }), Object.defineProperty(i.languages.markup.tag, "addInlined", {
    /**
     * Adds an inlined language to markup.
     *
     * An example of an inlined language is CSS with `<style>` tags.
     *
     * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addInlined('style', 'css');
     */
    value: function(d, f) {
      var m = {};
      m["language-" + f] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: i.languages[f]
      }, m.cdata = /^<!\[CDATA\[|\]\]>$/i;
      var s = {
        "included-cdata": {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: m
        }
      };
      s["language-" + f] = {
        pattern: /[\s\S]+/,
        inside: i.languages[f]
      };
      var y = {};
      y[d] = {
        pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
          return d;
        }), "i"),
        lookbehind: !0,
        greedy: !0,
        inside: s
      }, i.languages.insertBefore("markup", "cdata", y);
    }
  }), Object.defineProperty(i.languages.markup.tag, "addAttribute", {
    /**
     * Adds an pattern to highlight languages embedded in HTML attributes.
     *
     * An example of an inlined language is CSS with `style` attributes.
     *
     * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addAttribute('style', 'css');
     */
    value: function(c, d) {
      i.languages.markup.tag.inside["special-attr"].push({
        pattern: RegExp(
          /(^|["'\s])/.source + "(?:" + c + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
          "i"
        ),
        lookbehind: !0,
        inside: {
          "attr-name": /^[^\s=]+/,
          "attr-value": {
            pattern: /=[\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: !0,
                alias: [d, "language-" + d],
                inside: i.languages[d]
              },
              punctuation: [
                {
                  pattern: /^=/,
                  alias: "attr-equals"
                },
                /"|'/
              ]
            }
          }
        }
      });
    }
  }), i.languages.html = i.languages.markup, i.languages.mathml = i.languages.markup, i.languages.svg = i.languages.markup, i.languages.xml = i.languages.extend("markup", {}), i.languages.ssml = i.languages.xml, i.languages.atom = i.languages.xml, i.languages.rss = i.languages.xml, function(c) {
    var d = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
    c.languages.css = {
      comment: /\/\*[\s\S]*?\*\//,
      atrule: {
        pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + d.source + ")*?" + /(?:;|(?=\s*\{))/.source),
        inside: {
          rule: /^@[\w-]+/,
          "selector-function-argument": {
            pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
            lookbehind: !0,
            alias: "selector"
          },
          keyword: {
            pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
            lookbehind: !0
          }
          // See rest below
        }
      },
      url: {
        // https://drafts.csswg.org/css-values-3/#urls
        pattern: RegExp("\\burl\\((?:" + d.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
        greedy: !0,
        inside: {
          function: /^url/i,
          punctuation: /^\(|\)$/,
          string: {
            pattern: RegExp("^" + d.source + "$"),
            alias: "url"
          }
        }
      },
      selector: {
        pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + d.source + ")*(?=\\s*\\{)"),
        lookbehind: !0
      },
      string: {
        pattern: d,
        greedy: !0
      },
      property: {
        pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
        lookbehind: !0
      },
      important: /!important\b/i,
      function: {
        pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
        lookbehind: !0
      },
      punctuation: /[(){};:,]/
    }, c.languages.css.atrule.inside.rest = c.languages.css;
    var f = c.languages.markup;
    f && (f.tag.addInlined("style", "css"), f.tag.addAttribute("style", "css"));
  }(i), i.languages.clike = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0,
        greedy: !0
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0,
        greedy: !0
      }
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: !0
    },
    "class-name": {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: !0,
      inside: {
        punctuation: /[.\\]/
      }
    },
    keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    boolean: /\b(?:false|true)\b/,
    function: /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/
  }, i.languages.javascript = i.languages.extend("clike", {
    "class-name": [
      i.languages.clike["class-name"],
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
        lookbehind: !0
      }
    ],
    keyword: [
      {
        pattern: /((?:^|\})\s*)catch\b/,
        lookbehind: !0
      },
      {
        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0
      }
    ],
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    number: {
      pattern: RegExp(
        /(^|[^\w$])/.source + "(?:" + // constant
        (/NaN|Infinity/.source + "|" + // binary integer
        /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
        /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
        /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
        /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
        /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
      ),
      lookbehind: !0
    },
    operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
  }), i.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/, i.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern: RegExp(
        // lookbehind
        // eslint-disable-next-line regexp/no-dupe-characters-character-class
        /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
        // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
        // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
        // with the only syntax, so we have to define 2 different regex patterns.
        /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
        /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
        /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
      ),
      lookbehind: !0,
      greedy: !0,
      inside: {
        "regex-source": {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: !0,
          alias: "language-regex",
          inside: i.languages.regex
        },
        "regex-delimiter": /^\/|\/$/,
        "regex-flags": /^[a-z]+$/
      }
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    "function-variable": {
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: "function"
    },
    parameter: [
      {
        pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: !0,
        inside: i.languages.javascript
      },
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: !0,
        inside: i.languages.javascript
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: i.languages.javascript
      },
      {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: i.languages.javascript
      }
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  }), i.languages.insertBefore("javascript", "string", {
    hashbang: {
      pattern: /^#!.*/,
      greedy: !0,
      alias: "comment"
    },
    "template-string": {
      pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: !0,
      inside: {
        "template-punctuation": {
          pattern: /^`|`$/,
          alias: "string"
        },
        interpolation: {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: !0,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\$\{|\}$/,
              alias: "punctuation"
            },
            rest: i.languages.javascript
          }
        },
        string: /[\s\S]+/
      }
    },
    "string-property": {
      pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: !0,
      greedy: !0,
      alias: "property"
    }
  }), i.languages.insertBefore("javascript", "operator", {
    "literal-property": {
      pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: !0,
      alias: "property"
    }
  }), i.languages.markup && (i.languages.markup.tag.addInlined("script", "javascript"), i.languages.markup.tag.addAttribute(
    /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
    "javascript"
  )), i.languages.js = i.languages.javascript, function() {
    if (typeof i > "u" || typeof document > "u")
      return;
    Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
    var c = "Loading…", d = function(h, g) {
      return "✖ Error " + h + " while fetching file: " + g;
    }, f = "✖ Error: File does not exist or is empty", m = {
      js: "javascript",
      py: "python",
      rb: "ruby",
      ps1: "powershell",
      psm1: "powershell",
      sh: "bash",
      bat: "batch",
      h: "c",
      tex: "latex"
    }, s = "data-src-status", y = "loading", E = "loaded", L = "failed", w = "pre[data-src]:not([" + s + '="' + E + '"]):not([' + s + '="' + y + '"])';
    function _(h, g, v) {
      var t = new XMLHttpRequest();
      t.open("GET", h, !0), t.onreadystatechange = function() {
        t.readyState == 4 && (t.status < 400 && t.responseText ? g(t.responseText) : t.status >= 400 ? v(d(t.status, t.statusText)) : v(f));
      }, t.send(null);
    }
    function O(h) {
      var g = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(h || "");
      if (g) {
        var v = Number(g[1]), t = g[2], e = g[3];
        return t ? e ? [v, Number(e)] : [v, void 0] : [v, v];
      }
    }
    i.hooks.add("before-highlightall", function(h) {
      h.selector += ", " + w;
    }), i.hooks.add("before-sanity-check", function(h) {
      var g = (
        /** @type {HTMLPreElement} */
        h.element
      );
      if (g.matches(w)) {
        h.code = "", g.setAttribute(s, y);
        var v = g.appendChild(document.createElement("CODE"));
        v.textContent = c;
        var t = g.getAttribute("data-src"), e = h.language;
        if (e === "none") {
          var a = (/\.(\w+)$/.exec(t) || [, "none"])[1];
          e = m[a] || a;
        }
        i.util.setLanguage(v, e), i.util.setLanguage(g, e);
        var n = i.plugins.autoloader;
        n && n.loadLanguages(e), _(
          t,
          function(r) {
            g.setAttribute(s, E);
            var l = O(g.getAttribute("data-range"));
            if (l) {
              var o = r.split(/\r\n?|\n/g), u = l[0], p = l[1] == null ? o.length : l[1];
              u < 0 && (u += o.length), u = Math.max(0, Math.min(u - 1, o.length)), p < 0 && (p += o.length), p = Math.max(0, Math.min(p, o.length)), r = o.slice(u, p).join(`
`), g.hasAttribute("data-start") || g.setAttribute("data-start", String(u + 1));
            }
            v.textContent = r, i.highlightElement(v);
          },
          function(r) {
            g.setAttribute(s, L), v.textContent = r;
          }
        );
      }
    }), i.plugins.fileHighlight = {
      /**
       * Executes the File Highlight plugin for all matching `pre` elements under the given container.
       *
       * Note: Elements which are already loaded or currently loading will not be touched by this method.
       *
       * @param {ParentNode} [container=document]
       */
      highlight: function(g) {
        for (var v = (g || document).querySelectorAll(w), t = 0, e; e = v[t++]; )
          i.highlightElement(e);
      }
    };
    var I = !1;
    i.fileHighlight = function() {
      I || (console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."), I = !0), i.plugins.fileHighlight.highlight.apply(this, arguments);
    };
  }();
})(Y);
var ee = Y.exports;
const X = /* @__PURE__ */ V(ee);
function te(x) {
  switch (x) {
    case "comment":
    case "prolog":
    case "doctype":
    case "cdata":
      return { color: "#008000", italic: !0 };
    case "namespace":
      return { opacity: 0.7 };
    case "string":
      return { color: "#A31515" };
    case "punctuation":
    case "operator":
      return { color: "#393A34" };
    case "url":
    case "symbol":
    case "number":
    case "boolean":
    case "variable":
    case "constant":
    case "inserted":
      return { color: "#36acaa" };
    case "atrule":
    case "keyword":
    case "attr-value":
      return { color: "#0000ff" };
    case "function":
      return { color: "#b9a40a" };
    case "deleted":
    case "tag":
      return { color: "#9a050f" };
    case "selector":
      return { color: "#00009f" };
    case "important":
      return { color: "#e90", bold: !0 };
    case "italic":
      return { italic: !0 };
    case "class-name":
    case "property":
      return { color: "#2B91AF" };
    case "attr-name":
    case "regex":
    case "entity":
      return { color: "#ff0000" };
    default:
      return null;
  }
}
function ae(x) {
  const S = [];
  function i(c) {
    for (let d = 0; d < c.length; d++) {
      const f = c[d];
      if (typeof f == "string")
        S.push({
          content: f
        });
      else if (Array.isArray(f.content))
        i(f.content);
      else {
        const { type: m, content: s } = f;
        typeof s == "string" && S.push({
          type: m,
          content: s,
          ...te(m)
        });
      }
    }
  }
  return i(x), S;
}
function ne(x) {
  const S = x.command;
  S.executeInsertCodeblock = (i) => {
    if (!i)
      return;
    const c = X.tokenize(i, X.languages.javascript), d = ae(c), f = [];
    for (let m = 0; m < d.length; m++) {
      const s = d[m], y = s.content.split("");
      for (let E = 0; E < y.length; E++) {
        const w = {
          value: y[E]
        };
        s.color && (w.color = s.color), s.bold && (w.bold = !0), s.italic && (w.italic = !0), f.push(w);
      }
    }
    f.unshift({
      value: `
`
    }), S.executeInsertElementList(f);
  };
}
export {
  ne as default
};
//# sourceMappingURL=codeblock.js.map
