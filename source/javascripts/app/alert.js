/*!
 *
 * App Module: /alert
 *
 * @namespace alert
 * @memberof app
 *
 *
 */
import { duration1 } from "app/config";
import { emitter, hammered } from "app/util";

var _isInit = false,

    exports = {},


/**
 *
 * Initialize alerts
 * @method init
 * @memberof alert
 *
 */
init = exports.init = function () {
    if ( _isInit ) {
        return;
    }

    _isInit = true;

    hammered.on( "tap", ".js-alert-controller", onTouchTap );
    hammered.on( "tap", ".js-alert-close", onTouchTapClose );
},


/**
 *
 * Handle the interaction event with alert controllers
 * @method onTouchTap
 * @param {object} e The Event Object
 * @memberof alert
 * @private
 *
 */
onTouchTap = function ( e ) {
    e.preventDefault();
    e.gesture.preventDefault();

    var $this = $( this ),
        $target = $( $this.data( "target" ) );

    emitter.fire( "alert-open", $target );

    $target.addClass( "is-active" );

    // Bind controller to target alert
    if ( !$target.data( "controller" ) ) {
        $target.data( "controller", $this );
    }
},


/**
 *
 * Handle the interaction event with alert close icons
 * @method onTouchTapClose
 * @param {object} e The Event Object
 * @memberof alert
 * @private
 *
 */
onTouchTapClose = function ( e ) {
    e.preventDefault();
    e.gesture.preventDefault();

    var $this = $( this ),
        $alert = $this.is( ".js-alert" ) ? $this : $this.closest( ".js-alert" ),
        $controller = $alert.data( "controller" );

    emitter.fire( "alert-close", $alert );

    $alert.addClass( "is-leaving" );
    setTimeout(function () {
        $alert.removeClass( "is-active is-leaving" );

    }, duration1 );
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };