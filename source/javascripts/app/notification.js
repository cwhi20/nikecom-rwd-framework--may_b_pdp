/*!
 *
 * App Module: /notification
 *
 * A nice description of what this module does...
 *
 *
 */
import { hammered } from "app/util";
import { duration1 } from "app/config";


var $_jsNotification = $( ".js-notification" ),
    $_jsNotificationContext = $( ".js-notification-context" ),
    $_jsCartIndicator = $( ".js-cart-indicator" ),

    _isInit = false,
    _isActive = false,

    exports = {},


/**
 *
 * Module init method, called once
 * @method init
 * @memberof notification
 *
 */
init = exports.init = function () {
    if ( _isInit || !$_jsNotification.length ) {
        return;
    }

    _isInit = true;

    hammered.on( "tap", ".js-notify", onTapNotify );
    hammered.on( "tap", ".js-notification", onTapNotification );
},


open = exports.open = function () {
    _isActive = true;

    $_jsNotification.addClass( "is-active" );
},


close = exports.close = function () {
    $_jsNotification.addClass( "is-leaving" );

    setTimeout(function () {
        _isActive = false;

        $_jsNotification.removeClass( "is-leaving is-active" );
        $_jsNotificationContext.html( "" );

    }, duration1 );
},


isActive = exports.isActive = function () {
    return _isActive;
},


onTapNotify = function () {
    var $this = $( this ),
        $targ = null,
        data = $this.data(),
        value;

    if ( data.checkTarget ) {
        $targ = $( data.checkTarget );

        if ( $targ.val() === "" ) {
            $targ.addClass( "-border--error" );
            return;
        }
    }

    if ( data.action === "cart" ) {
        $_jsCartIndicator.addClass( "is-active" );

        value = parseInt( $_jsCartIndicator.text(), 10 );
        value += 1;

        $_jsCartIndicator.text( value );
    }

    $_jsNotificationContext.html( data.notification );

    open();

    setTimeout(function () {
        close();

    }, 2000 );
},


onTapNotification = function () {
    //close();
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };