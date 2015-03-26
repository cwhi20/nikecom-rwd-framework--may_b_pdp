/*!
 *
 * App Module: /carousel
 *
 * @namespace carousel
 * @memberof app
 *
 *
 */
import { hammered, loadImages, resizer, noop } from "app/util";
import { duration1, duration2 } from "app/config";
import "app/spinner";
import "app/zoom";


var _isInit = false,
    _isSwiping = false,
    _isPullBound = false,

    // Gather what will be exposed
    exports = {},


/**
 *
 * Initialize carousels
 * @method init
 * @memberof carousel
 *
 */
init = exports.init = function () {
    if ( _isInit ) {
        return;
    }

    _isInit = true;

    hammered.on( "tap", ".js-carousel-indicator-item", onTouchTap );
    hammered.on( "tap", ".js-carousel-thumbnails-item", onTouchTapThumb );
    hammered.on( "tap", ".js-carousel-wayfinding-item", onTouchTapWayfinding );

    // Standard slide context
    hammered.on( "tap", ".js-carousel-collection-item", onTouchTapCollection );
    hammered.on( "release", ".js-carousel-collection-item", onTouchRelease );
    hammered.on( "dragleft", ".js-carousel-collection-item", onTouchSwipe );
    hammered.on( "dragright", ".js-carousel-collection-item", onTouchSwipe );

    resizer.on( "resize", onResizer );

    loadAll();

    onResizer();
},


/**
 *
 * Load all the carousels on the page
 * @method loadAll
 * @memberof carousel
 * @private
 *
 */
loadAll = exports.loadAll = function () {
    $( ".js-carousel" ).each(function () {
        var $this = $( this );

        $this.data( "swipetimeout", null );

        hammered.trigger( "tap", $this.find( ".js-carousel-indicator-item" ).get( 0 ) );
    });
},


/**
 *
 * Perform the action on swipe
 * @method handleSwiped
 * @param {string} direction the swipe direction
 * @param {object} element the element swiped
 * @memberof carousel
 * @private
 *
 */
handleSwiped = function ( direction, element ) {
    // Check swiping state
    if ( _isSwiping ) {
        return false;
    }

    // Otherwise set the swiping state
    _isSwiping = true;

    setTimeout(function () {
        _isSwiping = false;

    // Timeout for duration of animation
    }, duration2 );

    // Handle the swipe
    var $carousel = element.closest( ".js-carousel" ),
        $items = $carousel.find( ".js-carousel-collection-item" ),
        $indicators = $carousel.find( ".js-carousel-indicator-item" ),
        increment = ( direction === "left" ) ? 1 : -1,
        total = ($items.length - 1),
        index = element.index();

    // Swipe from first to last
    if ( index === 0 && direction === "right" ) {
        index = ($items.length - 1);

    // Swipe from last to first
    } else if ( index === total && direction === "left" ) {
        index = 0;

    // Swipe in middle of elements
    } else {
        index = index + increment;
    }

    hammered.trigger( "tap", $indicators[ index ] );
},


/**
 *
 * Map pullout interaction to collection
 * @method onTouchTapPullout
 * @memberof carousel
 * @private
 *
 */
onTouchTapPullout = function ( e ) {
    onTouchTapCollection.call( this, e );
},


/**
 *
 * Map pullout interaction to collection
 * @method onTouchReleasePullout
 * @memberof carousel
 * @private
 *
 */
onTouchReleasePullout = function ( e ) {
    onTouchRelease.call( this, e );
},


/**
 *
 * Map pullout interaction to collection
 * @method onTouchSwipePullout
 * @memberof carousel
 * @private
 *
 */
onTouchSwipePullout = function ( e ) {
    onTouchSwipe.call( this, e );
},


/**
 *
 * Handle resize event
 * @method onResizer
 * @memberof carousel
 * @private
 *
 */
onResizer = function () {
    // Pullout slide context
    if ( window.innerWidth <= 1024 ) {
        _isPullBound = false;

        hammered.off( "tap", onTouchTapPullout );
        hammered.off( "release", onTouchReleasePullout );
        hammered.off( "dragleft", onTouchSwipePullout );
        hammered.off( "dragright", onTouchSwipePullout );

    } else if ( !_isPullBound ) {
        _isPullBound = true;

        hammered.on( "tap", ".js-carousel-pullout-item", onTouchTapPullout );
        hammered.on( "release", ".js-carousel-pullout-item", onTouchReleasePullout );
        hammered.on( "dragleft", ".js-carousel-pullout-item", onTouchSwipePullout );
        hammered.on( "dragright", ".js-carousel-pullout-item", onTouchSwipePullout );
    }
},


/**
 *
 * Handle the prev/next arrows
 * @method onTouchTapWayfinding
 * @memberof carousel
 * @private
 *
 */
onTouchTapWayfinding = function () {
    var $this = $( this ),
        way = $this.data( "way" ),
        dir = ( way === "prev" ) ? "right" : "left";

    handleSwiped( dir, $this.closest( ".js-carousel" ).find( ".js-carousel-collection-item.is-active" ) );
},


/**
 *
 * Handle the collection tap
 * @method onTouchTapCollection
 * @memberof carousel
 * @private
 *
 */
onTouchTapCollection = function ( e ) {
    if ( zoom.isZooming() || e.target.tagName.toLowerCase() === "a" ) {
        return;
    }

    var $this = $( this ),
        $carousel = $this.closest( ".js-carousel" ),
        $indicators = $carousel.find( ".js-carousel-indicator-item" ),
        index = $this.index(),
        length = $indicators.length;

    if ( index === (length - 1) ) {
        index = 0;

    } else {
        index = (index + 1);
    }

    hammered.trigger( "tap", $indicators[ index ] );
},


/**
 *
 * Handle the indicator tap
 * @method onTouchTap
 * @param {object} e The event object
 * @memberof carousel
 * @private
 *
 */
onTouchTap = function ( e ) {
    e.preventDefault();
    e.gesture.preventDefault();

    var $this = $( this ),
        $carousel = $this.closest( ".js-carousel" ),
        $items = $carousel.find( ".js-carousel-collection-item" ),
        $itemActive = $items.filter( ".is-active" ),
        $itemNext = $items.eq( $this.index() ),

        $pulls = $carousel.find( ".js-carousel-pullout-item" ),
        $pullActive = $pulls.filter( ".is-active" ),
        $pullNext = $pulls.eq( $this.index() ),

        $indicators = $carousel.find( ".js-carousel-indicator-item" );

    try {
        clearTimeout( $carousel.data( "swipetimeout" ) );

        $items.removeClass( "is-entering is-exiting is-active" );
        $pulls.removeClass( "is-entering is-exiting is-active" );

    } catch ( error ) {}

    $indicators.removeClass( "is-active" );
    $this.addClass( "is-active" );

    $itemActive.removeClass( "is-active" ).addClass( "is-exiting" );
    $itemNext.addClass( "is-entering" );

    $pullActive.removeClass( "is-active" ).addClass( "is-exiting" );
    $pullNext.addClass( "is-entering" );

    $carousel.data( "swipetimeout", setTimeout(function () {
        clearTimeout( $ );

        $itemActive.removeClass( "is-exiting" );
        $itemNext.removeClass( "is-entering" ).addClass( "is-active" );

        $pullActive.removeClass( "is-exiting" );
        $pullNext.removeClass( "is-entering" ).addClass( "is-active" );

    }, duration1 ));
},


/**
 *
 * Handle the thumb taps
 * @method onTouchTapThumb
 * @param {object} e The event object
 * @memberof carousel
 * @private
 *
 */
onTouchTapThumb = function ( e ) {
    e.preventDefault();
    e.gesture.preventDefault();

    var $this = $( this ),
        $carousel = $this.closest( ".js-carousel" ),
        $collection = $carousel.find( ".js-carousel-collection" ),
        $items = $carousel.find( ".js-carousel-collection-item" ),
        $cloneFactory = $items.first(),
        $clones = $( [] ),
        $active = $items.filter( ".is-active" ),
        colorway = $this.data( "colorway" );

    for ( var i = 0, len = $items.length; i < len; i++ ) {
        var $item = $items.eq( i ),
            $clone = $cloneFactory.clone(),
            data = $item.data(),
            path = data.imgSrc.split( "/" );

        path.pop();
        path = path.join( "/" );

        $clone.removeClass( "is-active -is-lazy-handled" );
        $clone.removeAttr( "data-imageloader" );
        $clone.attr( "data-img-src", (path + "/" + data.prefix + "-" + colorway + "-" + data.view + ".jpg") );
        $clone.attr( "data-zoom-src", (path + "/zoom/" + data.prefix + "-" + colorway + "-" + data.view + ".jpg") );
        $clone.attr( "data-colorway", colorway );
        $clone.attr( "data-prefix", data.prefix );
        $clone.attr( "data-view", data.view );
        $clone.attr( "style", "" );

        $clones.push( $clone[ 0 ] );
    }

    $clones.eq( $active.index() ).addClass( "is-active" );

    spinner.spin( $active );

    loadImages( $clones, noop ).on( "done", function () {
        spinner.stop( $active );

        $collection.empty().append( $clones );
    });
},


/**
 *
 * Handle the swipe event
 * @method onTouchSwipe
 * @param {object} e The event object
 * @memberof carousel
 * @private
 *
 */
onTouchSwipe = function ( e ) {
    if ( zoom.isZooming() ) {
        return;
    }

    e.preventDefault();
    e.gesture.preventDefault();

    $( this ).data( "swiped", true );
},


/**
 *
 * Handle the release event
 * @method onTouchRelease
 * @param {object} e The event object
 * @memberof carousel
 * @private
 *
 */
onTouchRelease = function ( e ) {
    if ( zoom.isZooming() ) {
        return;
    }

    var $this = $( this );

    if ( $this.data( "swiped" ) ) {
        $this.data( "swiped", false );

        handleSwiped( e.gesture.direction, $this );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };