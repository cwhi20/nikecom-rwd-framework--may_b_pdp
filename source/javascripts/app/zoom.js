/*!
 *
 * App Module: /zoom
 *
 * @namespace zoom
 * @memberof app
 *
 *
 */
import { hammered, containDocument, loadScripts } from "app/util";
import { duration1, cssTransform } from "app/config";
import "app/spinner";

var $_jsZoomPane = $( ".js-zoompane" ),
    $_image = null,

    _isZooming = false,
    _isReleasing = false,
    _lastScale = 1,
    _currScale = 1,
    _touchX = "50%",
    _touchY = "50%",
    _loaded = {},


isZooming = function () {
    return _isZooming;
},


/**
 *
 * Apply events for the modules scope
 * @method init
 * @memberof zoom
 *
 */
init = function () {
    if ( !$_jsZoomPane.length ) {
        return;
    }

    // Loads Greensock + Draggable
    loadScripts();

    setDefaults( true );

    hammered.on( "tap", ".js-zoomclose", close );
    //hammered.on( "hold", ".js-zoomin", releaseZoom );
    hammered.on( "transform", ".js-zoomin", onZoomTransform );

    console.log( "[zoom module init]" );
},

/**
 *
 * Open the zoom container
 * @method open
 * @memberof zoom
 *
 */
open = function () {
    spinner.spin( $_jsZoomPane );

    $_jsZoomPane.addClass( "is-active" );

    containDocument( true );
},

/**
 *
 * Close the zoom container
 * @method close
 * @memberof zoom
 *
 */
close = function () {
    $( ".is-active[data-zoom-src]" ).css( cssTransform, "none" );

    $_jsZoomPane.addClass( "is-leaving" );

    setTimeout(function () {
        $_jsZoomPane.removeClass( "is-active is-leaving" );

        empty();
        setDefaults( true );

    }, duration1 );

    containDocument( false );
},

/**
 *
 * Remove zoomed image from container
 * @method empty
 * @memberof zoom
 * @private
 *
 */
empty = function () {
    if ( $_image ) {
        $_image.remove();

        setTimeout(function () {
            $_image = null;

        }, 100 );
    }
},

/**
 *
 * Initialize Greensock Draggable on zoomed image
 * @method enableDrag
 * @memberof zoom
 * @private
 *
 */
enableDrag = function () {
    Draggable.create(
        ".js-zoomimg",
        {
            type: "x,y",
            edgeResistance: 0.9,
            bounds: ".js-zoompane",
            throwProps: true,
            onClick: function () {
                close();
            }
        }
    );
},

/**
 *
 * Reset the default transforming values
 * @method setDefaults
 * @param {boolean} doResetZoom Flag to reset _isZooming
 * @memberof zoom
 * @private
 *
 */
setDefaults = function ( doResetZoom ) {
    _isReleasing = false;
    _lastScale = 1;
    _currScale = 1;
    _touchX = "50%";
    _touchY = "50%";

    if ( doResetZoom ) {
        _isZooming = false;
    }
},

/**
 *
 * Forcibly release the zoom control when its time
 * @method releaseZoom
 * @param {DOMElement} elem The element being transformed
 * @memberof zoom
 * @private
 *
 */
releaseZoom = function () {
    var image,
        source;

    if ( _isReleasing || _isZooming ) {
        return;
    }

    _isReleasing = true;
    _isZooming = true;

    image = new Image();

    // Cherry-pick the active zoom element...
    source = $( ".is-active[data-zoom-src]" ).data( "zoomSrc" );

    open();

    // Image is cached
    if ( _loaded[ source ] ) {
        image.src = source;
        onImageLoad.call( image );

    } else {
        _loaded[ source ] = true;
        image.onload = onImageLoad;
        image.src = source;
    }
},

/**
 *
 * Handle the onload event for an Image. Context needs to be new Image()
 * @method onImageLoad
 * @memberof zoom
 * @private
 *
 */
onImageLoad = function () {
    spinner.stop( $_jsZoomPane );

    // Set the modules image ref
    $_image = $( this );

    // Greensock Draggable needs data-clickable to NOT preventDefault on us
    $_image.addClass( "zoompane__img js-zoomimg" ).css({
        // Static starting point for now
        left: -((this.width / 2) - (window.innerWidth / 2)),
        top: -((this.height / 2) - (window.innerWidth / 2))
    });

    // Add the image to the zoom pane
    $_jsZoomPane.append( this );

    // Enable dragging
    enableDrag();

    // Async fadein
    setTimeout(function () {
        $_image.addClass( "is-active" );

        setDefaults( false );

    }, 10 );

    setTimeout(function () {
        $( ".is-active[data-zoom-src]" ).css( cssTransform, "none" );

    }, duration1 );
},

/**
 *
 * Handle scaling the zoomable element
 * @method onZoomTransform
 * @param {object} e The Event object
 * @memberof zoom
 * @fires zoom-transforming
 * @private
 *
 */
onZoomTransform = function ( e ) {
    e.preventDefault();
    e.gesture.preventDefault();

    if ( _isReleasing || _isZooming ) {
        return;
    }

    var touches = e.gesture.touches,
        scale = Math.max( 0, Math.min( (_lastScale * e.gesture.scale), 10 ) ),
        diff = Math.abs( _currScale - _lastScale ),
        diffAt = 0.5,
        $this = $( this );

    // Buffer the scaled amount
    if ( scale > 1 ) {
        _currScale = scale - (diff / 1.25);

        // Apply the scale transform
        $this.css(
            cssTransform,
            ("scale3d( " + _currScale + ", " + _currScale + ", 0 )")
        );

        // Apply the transform-origin once
        if ( !$this.data( "scaled" ) ) {
            _touchX = window.innerWidth / 2;
            _touchY = Math.min( touches[ 0 ].pageY, touches[ 1 ].pageY ) + (Math.abs( touches[ 0 ].pageY - touches[ 1 ].pageY ) / 2);

            $this.css(
                cssTransform,
                (_touchX + "px " + _touchY + "px")
            );
        }

        // Apply the grid layout change
        if ( diff > diffAt ) {
            releaseZoom( this );
        }

        // Sets the scaled state
        $this.data( "scaled", true );
    }
};

/******************************************************************************
 * Export
*******************************************************************************/
export { init, open, close, isZooming };