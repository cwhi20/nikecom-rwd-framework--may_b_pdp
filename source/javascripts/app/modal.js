/*!
 *
 * App Module: /modal
 *
 * @namespace modal
 * @memberof app
 *
 *
 */
import { duration1 } from "app/config";
import { emitter, hammered, containDocument } from "app/util";

var _isInit = false,

    exports = {},

    $_jsDoorHead = $( ".js-doorway-header" ),


/**
 *
 * Initialize modals
 * @method init
 * @memberof modal
 *
 */
init = exports.init = function () {
    if ( _isInit ) {
        return;
    }

    _isInit = true;

    hammered.on( "tap", ".js-modal-controller", onTouchTap );
    hammered.on( "tap", ".js-modal-close", onTouchTapClose );
    hammered.on( "tap", ".js-doorway-header", onTouchFixedHeader );
},


onTouchFixedHeader = function ( e ) {
    var $this = $( this );

    if ( $this.data( "modal" ) ) {
        onTouchTapClose.call( this, e );
    }
},


/**
 *
 * Handle the interaction event with modal controllers
 * @method onTouchTap
 * @param {object} e The Event Object
 * @memberof modal
 * @private
 *
 */
onTouchTap = function ( e ) {
    e.preventDefault();
    e.gesture.preventDefault();

    var $this = $( this ),
        $target = $( $this.data( "target" ) ),
        $label = $target.find( ".js-modal-label" ),
        $scroll = $target.find( ".js-modal-scroll" ),
        data = $target.data();

    emitter.fire( "modal-open", $target );

    $target.addClass( "is-active" ).scrollTop( 0 );

    if ( $label.length ) {
        $label.text( $this.text() );
    }

    if ( $scroll.length ) {
        setTimeout(function () {
            $scroll.addClass( "-overtouch" );

        }, duration1 );
    }

    if ( data.header ) {
        $_jsDoorHead
            .data( "modal", $target )
            .html( data.header )
            .removeClass( "button--left button--left--small" )
            .addClass( "button--close button--close--small is-active" );
    }

    // Bind controller to target modal
    if ( !$target.data( "controller" ) ) {
        $target.data( "controller", $this );
    }

    containDocument( true );
},


/**
 *
 * Handle the interaction event with modal close icons
 * @method onTouchTapClose
 * @param {object} e The Event Object
 * @memberof modal
 * @private
 *
 */
onTouchTapClose = function ( e ) {
    e.preventDefault();
    e.gesture.preventDefault();

    var $this = $( this ),
        $modal = $this.is( ".js-modal-view" ) ? $this : $this.is( ".js-doorway-header" ) ? $this.data( "modal" ) : $this.closest( ".js-modal-view" ),
        $controller = $modal.data( "controller" ),
        $value = $controller.find( ".js-modal-value" ),
        $scroll = $modal.find( ".js-modal-scroll" );

    emitter.fire( "modal-close", $modal );

    $modal.addClass( "is-leaving" );
    setTimeout(function () {
        $modal.removeClass( "is-active is-leaving" );

    }, duration1 );

    if ( $this.is( ".js-doorway-header" ) ) {
        $this.addClass( "is-leaving" );
        setTimeout(function () {
            $this
                .removeClass( "button--close button--close--small is-active is-leaving" )
                .text( "" )
                .data( "modal", null );

        }, duration1 );
    }

    if ( $scroll.length ) {
        $scroll.removeClass( "-overtouch" );
    }

    if ( $value.length && $this.is( ".js-modal-action" ) ) {
        $value.text( $this.text() ).addClass( $value.data( "onvalue" ) );

        emitter.fire( $value.data( "emit" ), parseInt( $this.text(), 10 ) );
    }

    containDocument( false );
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };