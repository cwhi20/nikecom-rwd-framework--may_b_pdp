/*!
 *
 * App Module: /overlay
 *
 * A nice description of what this module does...
 *
 *
 */
import { hammered, emitter } from "app/util";


var $_jsOverlay = $( ".js-overlay" ),

    _isInit = false,
    _isOpen = false,

    exports = {},


/**
 *
 * Module init method, called once
 * @method init
 * @memberof overlay
 *
 */
init = exports.init = function () {
    if ( _isInit || !$_jsOverlay.length ) {
        return;
    }

    _isInit = true;

    hammered.on( "tap", ".js-overlay", close );
    hammered.on( "drag", ".js-overlay", onTouchDragOverlay );
},


/**
 *
 * Prevent page scrolling while stuff is open
 * @method onTouchDragScreen
 * @param {object} e The event object
 * @memberof overlay
 * @private
 *
 */
onTouchDragOverlay = function ( e ) {
    e.preventDefault();
    e.gesture.preventDefault();
},


/**
 *
 * Module open method, opens the overlay
 * @method open
 * @fires overlay-open
 * @memberof overlay
 *
 */
open = exports.open = function () {
    $_jsOverlay.addClass( "is-active" );

    _isOpen = true;

    emitter.fire( "overlay-open" );
},


/**
 *
 * Module close method, closes the overlay
 * @method close
 * @fires overlay-close
 * @memberof overlay
 *
 */
close = exports.close = function () {
    $_jsOverlay.addClass( "is-leaving" );

    setTimeout(function () {
        $_jsOverlay.removeClass( "is-active is-leaving" );

    }, 300 );

    _isOpen = false;

    emitter.fire( "overlay-close" );
},


/**
 *
 * Module isOpen method, check if open or not
 * @method isOpen
 * @returns boolean
 * @memberof overlay
 *
 */
isOpen = exports.isOpen = function () {
    return _isOpen;
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };