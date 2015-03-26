/*!
 *
 * App Module: /toggle
 *
 * A nice description of what this module does...
 *
 *
 */
import { duration1 } from "app/config";
import { hammered } from "app/util";


var _isInit = false,

    Tween = require( "Tween" ),
    Easing = require( "Easing" ),

    exports = {},


/**
 *
 * Module init method, called once
 * @method init
 * @memberof toggle
 *
 */
init = exports.init = function () {
    if ( _isInit ) {
        return;
    }

    _isInit = true;

    hammered.on( "tap", ".js-toggle-controller", onToggleTap );

    hitActive();
},


hitActive = exports.hitActive = function () {
    $( ".js-toggle-menu.is-active" ).each(function () {
        var $this = $( this );

        $this.css( "height", "auto" );
        setTimeout(function () {
            $this.removeClass( "is-auto" );

        }, 10 );
    });

    $( ".js-toggle-menu:not(.is-active)" ).each(function () {
        var $this = $( this );

        $this.css( "height", 0 );
        setTimeout(function () {
            $this.removeClass( "is-auto" );

        }, 10 );
    });
},


/**
 *
 * Module onToggleTap method, handles event
 * @method onToggleTap
 * @memberof toggle
 *
 */
onToggleTap = function () {
    var $this = $( this ),
        $toggle = $this.parent(),
        $active = $toggle.parent().find( "> .js-toggle > .js-toggle-menu.is-active" ),
        $menu = $toggle.find( "> .js-toggle-menu" ),
        $items = $menu.children(),
        $animate = $menu,
        $icon = $toggle.find( "> .js-toggle-controller > .js-toggle-icon" ),
        $controllers = $toggle.parent().find( "> .js-toggle > .js-toggle-controller" ),

        // Calculate correct menu height no matter how the items layout
        rowLength = Math.floor( $menu.width() / $items.first().width() ),
        rowsRaw = ($items.length / rowLength),
        rowsTotal = (rowsRaw % 1 === 0) ? rowsRaw : Math.ceil( rowsRaw ),
        onComplete = false,
        menuHeight = (function () {
            var ret = 0;
            $items.each(function () {
                ret += $( this ).outerHeight();
            });
            return ret;
        })(),
        toHeight = menuHeight,
        addClass = true,
        isSoloMenu = $this.is( ".js-toggle-solo" );

    // No items to show
    if ( !$items.length ) {
        return;
    }

    // Closing
    if ( $menu.is( ".is-active" ) ) {
        toHeight = 0;
        addClass = false;

        $controllers.removeClass( "is-active" );

    // Close current / Open new
    } else if ( $active.length && isSoloMenu ) {
        $animate = $active;
        toHeight = 0;
        onComplete = true;
        addClass = false;

        $controllers.removeClass( "is-active" );
        $this.addClass( "is-active" );

    } else if ( isSoloMenu ) {
        $controllers.removeClass( "is-active" );
        $this.addClass( "is-active" );

    } else {
        $this.addClass( "is-active" );
    }

    $animate.height( $animate.height() );
    $animate.addClass( "is-animate" );
    setTimeout(function () {
        $animate.height( toHeight );

    }, 10 );

    if ( $icon.is( ".icon--minus-sign" ) ) {
        $icon.removeClass( "icon--minus-sign" );

    } else {
        $icon.addClass( "icon--minus-sign" );
    }

    if ( addClass ) {
        $animate.addClass( "is-active" );

    } else {
        $animate.removeClass( "is-active" );
    }

    setTimeout(function () {
        if ( onComplete && isSoloMenu ) {
            $menu.height( $menu.height() );
            $menu.addClass( "is-animate is-active" );
            setTimeout(function () {
                $menu.height( menuHeight );

            }, 10 );
            setTimeout(function () {
                $menu.removeClass( "is-animate" ).css( "height", "auto" );

            }, (duration1 + 10) );
        }

        $animate.removeClass( "is-animate" );

        if ( addClass ) {
            $animate.css( "height", "auto" );
        }

    }, (duration1 + 10) );
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };