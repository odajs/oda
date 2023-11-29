// Type definitions for ODANT
// TypeScript Version: 2.3

/**
 * ODANT Frontend.
 */
declare module ODANT {
     /**
     * getBool a function.
     *
     * @param value T.
      *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function getBool(value: boolean | string | number | object): boolean;

     /**
     * mixin a function.
     *
     * @param from Source
     * @param to Destination
     * @param deep
     * @returns {object}
      *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function mixin(from: object, to: object, deep: number): object
    
    /**
     * getGuid a function.
     *
     * @see \`{@link https://ODANT.org }\`
     */ 
    export function getGuid(): string;

    /**
     * getHashCode a function.
     *
     * @param {string} s
     * @returns {string}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function getHashCode(s: string): string

    /**
     * loadScript a function.
     *
     * @param {string} url
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function loadScript(url: string): object;



    /**
     * showFileDialog a function
     *
     * @param {string} accept
     * @param {boolean} multiple
     * @returns {Object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function showFileDialog(accept: string, multiple: boolean): object

    /**
     * showColorDialog a function
     *
     * @param value
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function showColorDialog(value: string): object

    /**
     * showContextMenu a function
     *
     * @param {object} param
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function showContextMenu(param: object): object

    /**
     * showItemMenu a function
     *
     * @param {object} param
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function showItemMenu(param: object): object

    /**
     * showHint a function
     *
     * @param {string} text
     * @param {string} icon
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function showHint(text: string, icon: string): void

    /**
     * showDialog a function
     *
     * @param {object} param
     * @param {object} listener
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function showDialog(param: object, listener: object): object

    /**
     * showCalculator a function
     *
     * @param value
     * @returns {string}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function showCalculator(value: string): string

    /**
     * showTimePicker a function
     *
     * @param {string} value
     * @returns {string}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function showTimePicker(value: string): string

    /**
     * showModal a function
     *
     * @param {object} param
     * @param {object} property
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function showModal(param: object, property: object): object

    /**
     * confirm a function
     *
     * @param {string} text
     * @param {string} title
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function confirm(text: string, title: string): object

    /**
     * inputText a function
     *
     * @param {{title: "Input text"; value; type}} param
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function inputText(param: {title: 'Input text', value, type}): object

    /**
     * beginDrag a function
     *
     * @param {object} control
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function beginDrag(control: object): object

    /**
     * loadHTML a function
     *
     * @param {string} url
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function loadHTML(url: string): object

    /**
     * showDropDown a function
     *
     * @param {object} control
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function showDropDown(control: object): object

    /**
     * showForm a function
     *
     * @param {string} url
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function showForm(url: string): object

    /**
     * showItem a function
     *
     * @param {object} item
     * @param {object} view
     * @returns {object}
     */
    export function showItem(item: object, view: object): object

    /**
     * notify a function
     *
     * @param {string} text
     */
    export function notify(text: string): void

    /**
     * push a function.
     *
     * @param {string} name
     * @param {object} param
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function push(name: string, param: object): void

    /**
     * pushError a function.
     *
     * @param {object} error
     * @param {object | string} context
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function pushError(error: object, context: object | string): void

    /**
     * notification a function.
     *
     * @param {string} title
     * @param {string} body
     * @param {string} icon
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function notification(title: string, body: string, icon: string): object

    /**
     * showWindow a function.
     *
     * @param {object} param
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function showWindow(param: object): object

    /**
     * inWork a function.
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function inWork(): void

    /**
     * findEventTarget a function.
     *
     * @param {object} e
     * @param {string} name
     * @returns {object}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function findEventTarget (e: object, name: string): object

    /**
     * sortObjectsArray a function.
     *
     * @param objectsArray
     * @param sortKey
     * @returns {object[]}
     *
     * @see \`{@link https://ODANT.org }\`
     * @since 1.0
     */
    export function sortObjectsArray(objectsArray, sortKey): object[]
}