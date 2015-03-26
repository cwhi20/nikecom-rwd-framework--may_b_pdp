/*!
 *
 * App Module: /util
 *
 * @namespace util
 * @memberof app
 *
 *
 */
import "lib/proper";
import { duration1, cssTransform, ratioPDP, ratioP1Square, ratioP1Full, ratioTILE, ratioGRID, naviMobileOffset, naviTabletWidth } from "app/config";


var Hammered = require( "Hammered" ),
    Controller = require( "Controller" ),
    ScrollController = require( "ScrollController" ),
    ResizeController = require( "ResizeController" ),
    ImageLoader = require( "ImageLoader" ),

    $_jsHtml = $( ".js-html" ),
    $_jsBody = $( ".js-body" ),
    $_jsHeader = $( ".js-header--full" ),

    // Default DOM handling selectors
    selectors = {
        resize: ".js-resize",
        lazyImg: ".js-lazy-image",
        position: ".js-position"
    },

    mathMin = Math.min,


/**
 *
 * Single app instanceof Hammer
 * @member hammered
 * @memberof util
 *
 */
hammered = new Hammered( document.body, {
    swipe_velocity: 0,
    stop_browser_behavior: false
}),


/**
 *
 * Single app instanceof Controller for arbitrary event emitting
 * @member emitter
 * @memberof util
 *
 */
emitter = new Controller(),


/**
 *
 * Single app instanceof Scroller
 * @member scroller
 * @memberof util
 *
 */
scroller = new ScrollController(),


/**
 *
 * Single app instanceof Resizer
 * @member resizer
 * @memberof util
 *
 */
resizer = new ResizeController(),


/**
 *
 * Apply a translate3d transform
 * @method translate3d
 * @param {object} el The element to transform
 * @param {string|number} x The x value
 * @param {string|number} y The y value
 * @param {string|number} z The z value
 * @memberof util
 *
 */
translate3d = function ( el, x, y, z ) {
    el.css( cssTransform, "translate3d(" + x + "," + y + "," + z + ")" );
},


/**
 *
 * Contain the documents overflow to hidden
 * @method containDocument
 * @param {boolean} bool Whether to contain or un-contain
 * @memberof util
 *
 */
containDocument = function ( bool ) {
    if ( bool ) {
        setTimeout(function () {
            $_jsHtml.addClass( "-contain" );
            //$_jsBody.addClass( "-contain" );

        }, duration1 );

    } else {
        $_jsHtml.removeClass( "-contain" );
        //$_jsBody.removeClass( "-contain" );
    }
},


/**
 *
 * Module onImageLoadHander method, handles event
 * @method onImageLoadHandler
 * @param {object} el The DOMElement to check the offset of
 * @returns boolean
 * @memberof util
 *
 */
onImageLoadHandler = function ( el ) {
    var ret = false,
        y = $( el ).offset().top;

    if ( y < (scroller.getScrollY() + window.innerHeight) ) {
        ret = true;
    }

    return ret;
},


/**
 *
 * Fresh query to lazyload images on page
 * @method loadImages
 * @param {object} images Optional collection of images to load
 * @param {function} handler Optional handler for load conditions
 * @param {function} callback Optional callback when loaded
 * @memberof util
 *
 */
loadImages = function ( images, handler, loadType ) {
    // Normalize the handler
    handler = (handler || onImageLoadHandler);

    // Normalize the images
    images = (images || $( selectors.lazyImg ));

    // Normalize loadType
    loadType = (loadType || "async");

    return new ImageLoader({
        elements: images,
        property: "data-img-src",
        loadType: loadType

    // Default handle method. Can be overriden.
    }).on( "data", handler );
},


/**
 *
 * Toggle on/off scrollability
 * @method toggleMouseWheel
 * @param {boolean} enable Flag to enable/disable
 * @memberof util
 *
 */
toggleMouseWheel = function ( enable ) {
    if ( enable ) {
        $_jsHtml.off( "DOMMouseScroll mousewheel" );

    } else {
        $_jsHtml.on( "DOMMouseScroll mousewheel", function ( e ) {
            e.preventDefault();
            return false;
        });
    }
},


/**
 *
 * Toggle on/off touch movement
 * @method toggleTouchMove
 * @param {boolean} enable Flag to enable/disable
 * @memberof util
 *
 */
toggleTouchMove = function ( enable ) {
    if ( enable ) {
        $_jsHtml.off( "touchmove" );

    } else {
        $_jsHtml.on( "touchmove", function ( e ) {
            e.preventDefault();
            return false;
        });
    }
},


/**
 *
 * Resize elements based on keyword
 * @method resizeModules
 * @param {object} elems Optional collection to resize
 * @memberof util
 *
 */
resizeModules = function ( elems ) {
    (elems || $( selectors.resize )).each(function () {
        var $this = $( this ),
            data = $this.data(),
            css = {},
            width = 0;

        if ( data.resize === "fullscreen" ) {
            css.height = window.innerHeight;

        } else if ( data.resize === "pdp" ) {
            css.height = ($this.width() / ratioPDP);

        }  else if ( data.resize === "gridwall" ) {
            css.height = ($this.width() / ratioGRID);

        } else if ( data.resize === "p1--mobile" ) {
            css.height = ($this.width() / ratioP1Square);

        } else if ( data.resize === "p1--desktop" ) {
            if ( data.resizeSmall && data.resizeSmall === "p1--mobile" && window.innerWidth <= 640 ) {
                css.height = ($this.width() / ratioP1Square);

            } else {
                css.height = mathMin( ($this.width() / ratioP1Full), (window.innerHeight - $_jsHeader.outerHeight()) );
            }

        } else if ( data.resize === "p1--gridwall" ) {
            css.height = mathMin( ($this.width() / ratioP1Full), (window.innerHeight - ($_jsHeader.outerHeight() * 2)) );

        } else if ( data.resize === "tile" ) {
            css.height = ($this.width() / ratioTILE);

        } else if ( data.resize === "belt" ) {
            $this.children().each(function () {
                var $child = $( this );

                width += ($child.width() + parseInt( $child.css( "margin-left" ), 10 ));
            });

            css.width = width;

        } else if ( data.resize === "navi-partial" ) {
            if ( window.innerWidth > 640 ) {
                css.width = naviTabletWidth;

            } else {
                css.width = window.innerWidth - naviMobileOffset;
            }

        } else if ( data.resize === "navi-fullscreen" ) {
            css.width = window.innerWidth;

        } else if ( data.resize === "navi-columns" ) {
            css.height = window.innerHeight - 67;
        }

        $this.css( css );
    });
},


/**
 *
 * Position elements based on keyword
 * @method positionModules
 * @param {object} elems Optional collection to resize
 * @memberof util
 *
 */
positionModules = function ( elems ) {
    (elems || $( selectors.position )).each(function () {
        var $this = $( this ),
            data = $this.data(),
            pos = {
                x: 0,
                y: 0
            };

        if ( data.positionX === "navi-partial" ) {
            pos.x = window.innerWidth - naviMobileOffset;

        } else if ( data.positionX === "navi-fullscreen" ) {
            pos.x = window.innerWidth;
        }

        translate3d( $this, (pos.x + "px"), (pos.y + "px"), 0 );
    });
},


/**
 * Resize arbitary width x height region to fit inside another region.
 * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 * @url: http://opensourcehacker.com/2011/12/01/calculate-aspect-ratio-conserving-resize-for-images-in-javascript/
 * @method calculateAspectRatioFit
 * @memberof util
 * @param {Number} srcWidth Source area width
 * @param {Number} srcHeight Source area height
 * @param {Number} maxWidth Fittable area maximum available width
 * @param {Number} srcWidth Fittable area maximum available height
 * @return {Object} { width, heigth }
 *
 */
calculateAspectRatioFit = function( srcWidth, srcHeight, maxWidth, maxHeight ) {
    var ratio = mathMin( (maxWidth / srcWidth), (maxHeight / srcHeight) );

    return {
        width: srcWidth * ratio,
        height: srcHeight * ratio
    };
},


/**
 *
 * Get random number between min/max inclusive
 * @method randomNumber
 * @param {number} min The minimum value
 * @param {number} max The maximum value
 * @memberof util
 * @returns number
 *
 */
randomNumber = function ( min, max ) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
},


/**
 *
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 * @method shuffle
 * @param {object} array The array to shuffle
 * @memberof util
 *
 */
shuffle = function ( array ) {
    for ( var i = array.length - 1; i > 0; i-- ) {
        var j = Math.floor( Math.random() * (i + 1) ),
            temp = array[ i ];

        array[ i ] = array[ j ];
        array[ j ] = temp;
    }

    return array;
},


/**
 *
 * Fresh query to lazyload extra scripts
 * @method lazyLoadScripts
 * @param {object} scripts Optional collection of scripts to load
 * @memberof util
 * @fires onload-script-*
 *
 */
loadScripts = function ( scripts ) {
    scripts = (scripts || $( "script[data-src]" ));

    scripts.each(function () {
        var script = this,
            $script = $( this ),
            context = $script.data( "context" );

        // Check loaded status
        this._isLoaded = (this._isLoaded || false);

        if ( !this._isLoaded ) {
            this.async = true;
            this.src = $script.data( "src" );

            this.onload = this.onreadystatechange = function () {
                if ( !this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
                    // Script is loaded status
                    script._isLoaded = true;

                    // Kill memory leakage ( old-school but meh )
                    script.onload = script.onreadystatechange = null;

                    // Emit context loaded if data attr is present
                    if ( context ) {
                        setTimeout(function () {
                            emitter.fire( "onload-script-" + context );

                        }, 100 );
                    }

                    //console.log( "[script loaded]", script.src );
                }
            };
        }
    });
},


noop = function () {
    return true;
};


/******************************************************************************
 * Export
*******************************************************************************/
export { hammered, emitter, scroller, resizer, translate3d, containDocument, loadImages, toggleMouseWheel, toggleTouchMove, resizeModules, positionModules, calculateAspectRatioFit, randomNumber, shuffle, loadScripts, noop };