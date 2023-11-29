// Type definitions for oda.js
type odaComponent = {
    is: string;
    imports?: [string] | string;
    extends?: [string] | string;
    template?: string;
    props?: object;
}
/**
 * Create ODA component.
 *
 * @param {object} prototype Prototype
 * @returns {HTMLElement}
 */
declare function ODA(prototype: {
    is: string;
    imports?: [string] | string;
    extends?: [string] | string;
    template?: string;
    props?: object;
}): odaComponent;
declare namespace ODA {
     /**
     * ODA.showConfirm function.
     *
     * @param {string} name Component name
     * @param {object} componentProps Component props
     * @param {object} dropDownProps dropDown props
     * @returns {promise}
     */
    export function showConfirm(name: string, componentProps: object, dropDownProps: object): object;

    /**
    * ODA.showDialog function.
    *
    * @param {string} name Component name
    * @param {object} componentProps Component props
    * @param {object} dropDownProps dropDown props
    * @returns {promise}
    */
    export function showDialog(name: string, componentProps: object, dropDownProps: object): object;

    /**
     * ODA.showModal function.
     *
     * @param {string} name Component name
     * @param {object} componentProps Component props
     * @param {object} dropDownProps dropDown props
     * @returns {promise}
     */
    export function showModal(name: string, componentProps: object, dropDownProps: object): object;

    /**
     * ODA.showDropdown function.
     *
     * @param {string} name Component name
     * @param {object} componentProps Component props
     * @param {object} dropDownProps dropDown props
     * @returns {promise}
     */
    export function showDropdown(name: string, componentProps: object, dropDownProps: object): object;
}