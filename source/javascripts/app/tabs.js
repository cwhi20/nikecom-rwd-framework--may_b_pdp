/*!
 *
 * App Module: /tabs
 *
 * A nice description of what this module does...
 *
 *
 */
import { duration1 } from "app/config";
import { hammered, emitter, resizeModules } from "app/util";


var $_jsTabControllers = $( ".js-tab-controller" ),
    $_jsTabViews = $( ".js-tab-view" ),
    $_jsTabViewsContainer = $( ".js-tab-views" ),

    _isInit = false,

    timeout = null,

    exports = {},


/**
 *
 * Module init method, called once
 * @method init
 * @memberof tabs
 *
 */
init = exports.init = function () {
    if ( _isInit ) {
        return;
    }

    _isInit = true;

    $_jsTabViewsContainer.css( "minHeight", window.innerHeight );

    hammered.on( "tap", ".js-tab-controller", onTabTap );
    hammered.trigger( "tap", $_jsTabControllers[ 0 ] );
},


/**
 *
 * Module onTabTap method, handles event
 * @method onTabTap
 * @memberof tabs
 *
 */
onTabTap = function () {
    var $this = $( this ),
        $target = $( $this.data( "target" ) ),
        $current = $_jsTabViews.filter( ".is-active" );

    $_jsTabControllers.removeClass( "is-active" );
    $this.addClass( "is-active" );

    try {
        clearTimeout( timeout );

        $_jsTabViews.removeClass( "is-entering is-exiting is-active" );

    } catch ( error ) {}

    $current.removeClass( "is-active" ).addClass( "is-exiting" );
    $target.addClass( "is-entering" );

    resizeModules();

    timeout = setTimeout(function () {
        clearTimeout( timeout );

        $current.removeClass( "is-exiting" );
        $target.removeClass( "is-entering" ).addClass( "is-active" );

    }, duration1 );
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };