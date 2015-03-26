/*!
 *
 * App Module: /spinner
 *
 * @namespace spinner
 * @memberof app
 *
 *
 */
import { hammered } from "app/util";
import "lib/spin";

var $_jsSpinInit = $( ".js-spinner--initial" ),

    _isInit = false,

    exports = {},


/**
 *
 * Initialize carousels
 * @method init
 * @memberof spinner
 *
 */
init = exports.init = function () {
    if ( _isInit ) {
        return;
    }

    _isInit = true;

    hammered.on( "tap", ".js-spinner", onTouchTap );

    $_jsSpinInit.each(function () {
        hammered.trigger( "tap", this );
    });
},


/**
 *
 * Start a spinner for an element
 * @method spin
 * @param {object} element The jQuery object
 * @memberof spinner
 *
 */
spin = exports.spin = function ( element ) {
    onTouchTap.call( element[ 0 ] );
},


/**
 *
 * Stop a spinner for an element
 * @method stop
 * @param {object} element The jQuery object
 * @memberof spinner
 *
 */
stop = exports.stop = function ( element ) {
    element.data( "spinner" ).stop();
    element.data( "spinner", null );
    element.removeClass( "is-spinning" );
},


/**
 *
 * Handle the interaction event with spinnable elements
 * @method onTouchTap
 * @param {object} e The Event Object
 * @memberof spinner
 * @private
 *
 */
onTouchTap = function () {
    var $this = $( this ),
        options,
        spinner;

    if ( $this.data( "spinner" ) ) {
        stop( $this );

        return;
    }

    if ( $this.is( ".js-spinner--dark" ) ) {
        options = getOptions({
            color: "#111"
        });

    } else {
        options = getOptions();
    }

    spinner = new Spinner( options );
    spinner.spin( this );

    $this.data( "spinner", spinner );
    $this.addClass( "is-spinning" );
},


/**
 *
 * Retain a fresh set of Spinner class options
 * @method getOptions
 * @param {object} merge Optional merge settings
 * @memberof spinner
 * @returns object
 * @private
 *
 */
getOptions = function ( merge ) {
    merge = (merge || {});

    return $.extend({
        className: "spinner",
        color: "#fff",
        corners: 1,
        direction: 1,
        fps: 20,
        height: 31.200000000000003,
        left: "auto",
        length: 3.7440000000000007,
        lines: 12,
        opacity: 0.25,
        position: "relative",
        radius: 6.240000000000001,
        rotate: 0,
        speed: 1,
        top: "auto",
        trail: 100,
        width: 2,
        zIndex: 2000000000

    }, merge );
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };