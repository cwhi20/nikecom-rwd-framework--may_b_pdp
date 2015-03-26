/*!
 *
 * App Module: /swiper
 *
 * @namespace swiper
 * @memberof app
 *
 *
 */
import { hammered, loadImages, resizer, translate3d, noop } from "app/util";
import { duration1, duration2 } from "app/config";
import "app/spinner";
import "app/zoom";


var $_jsSwipers = $( ".js-swiper" ),

    _isInit = false,
    _isSwiping = false,
    _isPullBound = false,

    // Gather what will be exposed
    exports = {},

    Easing = require( "Easing" ),
    Tween = require( "Tween" ),

    cache = {},


/**
 *
 * Apply events for the modules scope
 * @member onload
 * @memberof swiper
 *
 */
init = exports.init = function () {
    if ( _isInit ) {
        return;
    }

    _isInit = true;

    loadAll();

    hammered.on( "release", ".js-swiper-collection", onRelease );
    hammered.on( "dragleft", ".js-swiper-collection", onSwipe );
    hammered.on( "dragright", ".js-swiper-collection", onSwipe );
    hammered.on( "tap", ".js-swiper-thumbnails-item", onTouchTapThumb );
},


/**
 *
 * Recalculate the sizing of a swipeable cell container
 * @method loadAll
 * @memberof swiper
 * @private
 *
 */
loadAll = exports.loadAll = function () {
    $_jsSwipers.each(function () {
        var $this = $( this ),
            $belt = $this.find( ".js-swiper-collection" ),
            $cells = $this.find( ".js-swiper-collection-item" ),
            $indicators = $this.find( ".js-swiper-indicator-item" ),
            width = $this.width(),
            currX = 0,
            snaps = [],
            fullWidth = (width * $cells.length) + (2 * ($cells.length - 1));

        $cells.first().addClass( "is-active" );
        $indicators.first().addClass( "is-active" );

        $belt.attr( "style", "" ).css( "width", fullWidth );

        $cells.each(function () {
            snaps.push( (currX === 0) ? currX : -currX );

            $( this ).css({
                width: width,
                height: width
            });

            currX += (width + 2);
        });

        $belt.data({
            snaps: snaps,
            position: 0
        });

        cache[ $cells.eq( 0 ).data( "colorway" ) ] = $cells;
    });
},


/**
 *
 * Determine if a cell can translate its x axis
 * @method isMoveable
 * @param {object} $elem the element to translate
 * @param {string} direction the direction swiped
 * @memberof swiper
 * @private
 *
 */
isMoveable = function ( $elem, direction ) {
    var data = $elem.data();

    return !( (data.position === 0 && direction === "right") || (data.position === data.snaps[ data.snaps.length - 1 ] && direction === "left") );
},


/**
 *
 * Perform the action on swipe
 * @method handleSwiped
 * @param {string} direction the swipe direction
 * @param {object} element the element swiped
 * @memberof swiper
 * @private
 *
 */
handleSwiped = function ( direction, element ) {
    if ( zoom.isZooming() ) {
        return;
    }

    // Check swiping state
    if ( _isSwiping ) {
        return false;
    }

    // Otherwise set the swiping state
    _isSwiping = true;

    setTimeout(function () {
        _isSwiping = false;

    // Timeout for duration of animation
    }, duration1 );

    // Handle the swipe
    var data = element.data(),
        position = data.position,
        oldPosition = (data.tmposition || position),
        increment = ( direction === "left" ) ? 1 : -1,
        index = null,
        $swiper = element.parent(),
        $cells = $swiper.find( ".js-swiper-collection-item" ),
        $indicators = $swiper.find( ".js-swiper-indicator-item" );

    // Handle scenarios where we can move the shelf
    if ( isMoveable( element, direction ) ) {
        position = data.snaps[ data.snaps.indexOf( position ) + increment ];
        index = Math.floor( Math.abs( position ) / window.innerWidth );

        element.data( "position", position );
        element.data( "tmposition", null );

        $cells.removeClass( "is-active" ).eq( index ).addClass( "is-active" );
        $indicators.removeClass( "is-active" ).eq( index ).addClass( "is-active" );

        new Tween({
            to: position,
            from: oldPosition,
            ease: Easing.easeOutCubic,
            update: function ( t ) {
                translate3d( element, (t + "px"), 0, 0 );
            },
            complete: function ( t ) {
                translate3d( element, (t + "px"), 0, 0 );
            },
            duration: duration1
        });
    }
},


/**
 *
 * Handle the swipe event
 * @method onSwipe
 * @param {object} e The event object
 * @memberof swiper
 * @private
 *
 */
onSwipe = function ( e ) {
    if ( zoom.isZooming() ) {
        return;
    }

    e.preventDefault();
    e.gesture.preventDefault();

    var $this = $( this ),
        data = $this.data(),
        direction = e.gesture.direction,
        distance = e.gesture.distance,
        tmPosition = ( direction === "right" ) ? (data.position + (distance / 3)) : (data.position - (distance / 3));

    translate3d( $this, (tmPosition + "px"), 0, 0 );

    if ( !isMoveable( $this, direction ) ) {
        $this.data({
            tugged: true,
            tmposition: tmPosition
        });

    } else {
        $this.data({
            swiped: true,
            tmposition: tmPosition
        });
    }
},


/**
 *
 * Handle the release event
 * @method onRelease
 * @param {object} e The event object
 * @memberof swiper
 * @private
 *
 */
onRelease = function ( e ) {
    if ( zoom.isZooming() ) {
        return;
    }

    e.preventDefault();
    e.gesture.preventDefault();

    var $this = $( this ),
        data = $this.data();

    if ( data.swiped ) {
        $this.data( "swiped", false );

        handleSwiped( e.gesture.direction, $this );

    } else if ( data.tugged ) {
        $this.data( "tugged", false );

        new Tween({
            to: data.position,
            from: data.tmposition,
            ease: Easing.easeOutCubic,
            update: function ( t ) {
                translate3d( $this, (t + "px"), 0, 0 );
            },
            complete: function ( t ) {
                translate3d( $this, (t + "px"), 0, 0 );
            },
            duration: duration1
        });
    }
},


/**
 *
 * Handle the thumb taps
 * @method onTouchTapThumb
 * @param {object} e The event object
 * @memberof swiper
 * @private
 *
 */
onTouchTapThumb = function ( e ) {
    e.preventDefault();
    e.gesture.preventDefault();

    var $this = $( this ),
        $swiper = $this.closest( ".js-swiper" ),
        $collection = $swiper.find( ".js-swiper-collection" ),
        $items = $swiper.find( ".js-swiper-collection-item" ),
        $indicators = $swiper.find( ".js-swiper-indicator-item" ),
        $clones = $( [] ),
        $active = $items.filter( ".is-active" ),
        colorway = $this.data( "colorway" ),
        width = $swiper.width();

    //$indicators.show();

    // Color is cached
    if ( cache[ colorway ] ) {
        $collection.empty().append( cache[ colorway ] );

        //$indicators.slice( cache[ colorway ].length - 1, $indicators.length - 1 ).hide();

    } else {
        for ( var i = 0, len = $items.length; i < len; i++ ) {
            var $item = $items.eq( i ),
                $clone = $item.clone(),
                data = $item.data(),
                path = data.imgSrc.split( "/" );

            if ( $item.is( ".js-ugc" ) ) {
                $clones.push( $item[ 0 ] );

            } else {
                path.pop();
                path = path.join( "/" );

                if ( $clone.data( "zoomSrc" ) ) {
                    $clone.attr( "data-zoom-src", (path + "/zoom/" + data.prefix + "-" + colorway + "-" + data.view + ".jpg") );
                }

                $clone.removeClass( "is-active -is-lazy-handled" );
                $clone.removeAttr( "data-imageloader" );
                $clone.attr( "data-img-src", (path + "/" + data.prefix + "-" + colorway + "-" + data.view + ".jpg") );
                $clone.attr( "data-colorway", colorway );
                $clone.attr( "data-prefix", data.prefix );
                $clone.attr( "data-view", data.view );
                $clone.attr( "style", "" );
                $clone.css({
                    width: width,
                    height: width
                });

                $clones.push( $clone[ 0 ] );
            }
        }

        $clones.eq( $active.index() ).addClass( "is-active" );

        spinner.spin( $active );

        loadImages( $clones.not( ".js-ugc" ), noop )
            //.on( "error", function ( el ) {
            //    $clones = $clones.not( el );
            //})
            .on( "done", function () {
                spinner.stop( $active );

                $collection.empty().append( $clones );

                //console.log( ($clones.length - 1), ($indicators.length - 1) );

                //$indicators.slice( ($clones.length - 1), ($indicators.length - 1) ).hide();

                cache[ colorway ] = $clones;
            });
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };