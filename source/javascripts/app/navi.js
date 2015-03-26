/*!
 *
 * App Module: /navi
 *
 * A nice description of what this module does...
 *
 *
 */
import "app/overlay";
import { duration1, duration2, naviMobileOffset, naviTabletWidth } from "app/config";
import { hammered, emitter, translate3d, containDocument, toggleMouseWheel } from "app/util";


var $_jsNavi = $( ".js-navi" ),
    $_jsToggles = $( ".js-navi-toggle" ),
    $_jsFade = $( ".js-navi-fade" ),
    $_jsNaviMainControllers = $( ".js-navi-main-controller" ),
    $_jsNaviMain = $( ".js-navi--main" ),
    $_jsNaviMainMenus = $( ".js-navi-main-menu" ),
    $_jsNaviMobileSlides = $( ".js-navi-mobile-slides" ),

    _isInit = false,
    _timeoutLeave = null,
    _timeoutClose = null,
    _time2show = 500,
    _minHeight = 0,

    exports = {},


/**
 *
 * Module init method, called once
 * @method init
 * @memberof navi
 *
 */
init = exports.init = function () {
    if ( _isInit || (!$_jsNavi.length && !$_jsNaviMain.length) ) {
        return;
    }

    _isInit = true;

    hammered.on( "tap", ".js-navi-destination", function () {
        console.log( "destination" );
    });
    hammered.on( "tap", ".js-navi-toggle", onToggleTap );
    hammered.on( "tap", ".js-navi-main-link", onMainLinkTap );

    $_jsNaviMainMenus.each(function () {
        var $this = $( this ),
            height = $this.height();

        if ( height > _minHeight ) {
            _minHeight = height;
        }

        $this.addClass( "is-absolute" );
    });

    $_jsNaviMain
        .on( "mouseenter", onMouseEnter )
        .on( "mouseleave", onMouseLeave );

    $_jsNaviMainControllers
        .on( "mouseenter", onMouseEnter )
        .on( "mouseleave", onMouseLeave );
},


/**
 *
 * Module openNaviMain method, open the desktop navi
 * @method openNaviMain
 * @memberof navi
 * @private
 *
 */
openNaviMain = function () {
    $_jsNaviMain.removeClass( "is-leaving" ).addClass( "is-active" );

    toggleMouseWheel( false );
},


/**
 *
 * Module closeNaviMain method, close the desktop navi
 * @method closeNaviMain
 * @memberof navi
 * @private
 *
 */
closeNaviMain = function ( callback ) {
    $_jsNaviMain.addClass( "is-leaving" );

    _timeoutClose = setTimeout(function () {
        $_jsNaviMain.removeClass( "is-active is-leaving" );

        toggleMouseWheel( true );

        callback();

    }, duration1 );
},


/**
 *
 * Module clearTheTimeout method, clears the hover intent timeout
 * @method clearTheTimeout
 * @memberof navi
 * @private
 *
 */
clearTheTimeout = function () {
    try {
        clearTimeout( _timeoutClose );
        clearTimeout( _timeoutLeave );

        _timeoutClose = null;
        _timeoutLeave = null;

    } catch ( error ) {}
},


/**
 *
 * Module onMouseEnter method, handles event
 * @method onMouseEnter
 * @memberof navi
 * @private
 *
 */
onMouseEnter = function () {
    var $this = $( this ),
        $target = $( $this.data( "target" ) ),
        $active = $_jsNaviMainMenus.filter( ".is-active" );

    clearTheTimeout();

    if ( $this.is( ".js-navi--main" ) ) {
        return;
    }

    if ( $active.is( $target ) ) {
        $active = null;
    }

    $_jsNaviMainControllers.removeClass( "is-hover" );
    $this.addClass( "is-hover" );

    if ( $active ) {
        $active.addClass( "is-leaving" );
        setTimeout(function () {
            $active.removeClass( "is-active is-leaving" );

        }, duration1 );
    }

    $target.addClass( "is-active" );

    openNaviMain();
},


/**
 *
 * Module onMouseLeave method, handles event
 * @method onMouseLeave
 * @memberof navi
 * @private
 *
 */
onMouseLeave = function ( e ) {
    var $this = $( this ),
        $elem = $( e.toElement );

    clearTheTimeout();

    _timeoutLeave = setTimeout(function () {
        if ( $elem.is( ".js-navi--main" ) ) {
            return;
        }

        $_jsNaviMainControllers.removeClass( "is-hover" );

        closeNaviMain(function () {
            $_jsNaviMainMenus.removeClass( "is-active" );
        });

    }, _time2show );
},


/**
 *
 * Capture nav links
 * @method onMainLinkTap
 * @memberof navi
 * @private
 *
 */
onMainLinkTap = function () {
    clearTheTimeout();

    $_jsNaviMainControllers.removeClass( "is-hover" );

    closeNaviMain(function () {
        $_jsNaviMainMenus.removeClass( "is-active" );
    });
},


/**
 *
 * Module onToggleTap method, handles event
 * @method onToggleTap
 * @memberof navi
 *
 */
onToggleTap = function () {
    var $this = $( this );

    $_jsToggles.removeClass( "is-active" );
    $this.addClass( "is-active" );

    $_jsFade.addClass( "is-inactive" );

    setTimeout(function () {
        $_jsFade.removeClass( "is-inactive" );

    }, duration1 );
},


/**
 *
 * Module isOpen method, is mobile nav open
 * @method isOpen
 * @returns boolean
 * @memberof navi
 *
 */
isOpen = exports.isOpen = function () {
    return $_jsNavi.is( ".is-active" );
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };