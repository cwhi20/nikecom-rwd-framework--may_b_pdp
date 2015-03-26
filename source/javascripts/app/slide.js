/*!
 *
 * App Module: /slide
 *
 * @namespace slide
 * @memberof app
 *
 *
 */
import "app/navi";
import "app/overlay";
import { duration1 } from "app/config";
import { hammered, emitter, containDocument } from "app/util";

var _isInit = false,

    exports = {},

    $_jsDoorHead = $( ".js-doorway-header" ),


/**
 *
 * Initialize slides
 * @method init
 * @memberof slide
 *
 */
init = exports.init = function () {
    if ( _isInit ) {
        return;
    }

    _isInit = true;

    hammered.on( "tap", ".js-body", onTouchTapBody );
    hammered.on( "tap", ".js-slide-controller", onTouchTap );
    hammered.on( "tap", ".js-slide-close", onTouchTapClose );
    hammered.on( "tap", ".js-doorway-header", onTouchFixedHeader );
    hammered.on( "dragright", ".js-slide-view", onTouchDragHorz );
    hammered.on( "dragleft", ".js-slide-view", onTouchDragHorz );
},


onTouchFixedHeader = function ( e ) {
    var $this = $( this );

    if ( $this.data( "slide" ) ) {
        onTouchTapClose.call( this, e );
    }
},


/**
 *
 * Disable horizontal tugging, this happens in ios 7
 * @method onTouchDragHorz
 * @param {object} e The Event Object
 * @memberof slide
 * @private
 *
 */
onTouchDragHorz = function ( e ) {
    e.preventDefault();
    e.gesture.preventDefault();
},


/**
 *
 * Handle the interaction event with slide controllers
 * @method onTouchTap
 * @param {object} e The Event Object
 * @fires slide-open
 * @memberof slide
 * @private
 *
 */
onTouchTap = function ( e ) {
    e.preventDefault();
    e.gesture.preventDefault();

    var $this = $( this ),
        $target = $( $this.data( "target" ) ),
        $label = $target.find( ".js-slide-label" ),
        $scroll = $target.find( ".js-slide-scroll" ),
        data = $target.data();

    emitter.fire( "slide-open", $target );

    if ( !overlay.isOpen() ) {
        overlay.open();
    }

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
            .data( "slide", $target )
            .html( data.header )
            .removeClass( "button--close button--close--small" );

        if ( $target.is( ".slide--left" ) ) {
            $_jsDoorHead.addClass( "is-from-right" );
        }

        if ( $target.is( ".slide--right" ) ) {
            $_jsDoorHead.addClass( "is-from-left" );
        }

        setTimeout(function () {
            $_jsDoorHead.addClass( "button--left button--left--small is-active" );

        }, 1 );
    }

    $target.addClass( "is-active" ).scrollTop( 0 );

    // Bind controller to target modal
    if ( !$target.data( "controller" ) ) {
        $target.data( "controller", $this );
    }

    containDocument( true );
},


/**
 *
 * Handle the interaction event with slide close icons
 * @method onTouchTapClose
 * @param {object} e The Event Object
 * @fires slide-close
 * @memberof slide
 * @private
 *
 */
onTouchTapClose = function ( e ) {
    e.preventDefault();
    e.gesture.preventDefault();

    var $this = $( this ),
        $slide = $this.is( ".js-slide-view" ) ? $this : $this.is( ".js-doorway-header" ) ? $this.data( "slide" ) : $this.closest( ".js-slide-view" ),
        $controller = $slide.data( "controller" ),
        $value = $controller.find( ".js-slide-value" ),
        $scroll = $slide.find( ".js-slide-scroll" );

    emitter.fire( "slide-close", $slide );

    $slide.addClass( "is-leaving" );
    setTimeout(function () {
        $slide.removeClass( "is-active is-leaving" );

    }, duration1 );

    if ( $this.is( ".js-doorway-header" ) ) {
        $this.addClass( "is-leaving" );
        setTimeout(function () {
            $this
                .removeClass( "button--left button--left--small is-active is-leaving is-from-right is-from-left" )
                .text( "" )
                .data( "slide", null );

        }, duration1 );
    }

    if ( overlay.isOpen() && !navi.isOpen() ) {
        overlay.close();
    }

    if ( $scroll.length ) {
        $scroll.removeClass( "-overtouch" );
    }

    if ( $value.length && $this.is( ".js-slide-action" ) ) {
        $value.text( $this.text() ).addClass( $value.data( "onvalue" ) );

        emitter.fire( $value.data( "emit" ), parseInt( $this.text(), 10 ) );
    }

    containDocument( false );
},


/**
 *
 * Handle closing slides when tapping outside of one
 * @method onTouchTapBody
 * @param {object} e The Event Object
 * @memberof slide
 * @private
 *
 */
onTouchTapBody = function ( e ) {
    var $target = $( e.target );

    if ( !$target.closest( ".js-slide-view" ).length ) {
        $( ".js-slide-view.is-active" ).each(function () {
            onTouchTapClose.call( this, e );
        });
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };