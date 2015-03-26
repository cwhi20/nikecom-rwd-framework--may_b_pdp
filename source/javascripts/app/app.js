/*!
 *
 *
 * Nike.com RWD Framework
 *
 *
 */
import "node_modules/jquery/dist/jquery";
import "node_modules/hammerjs/hammer";


import { duration2 } from "app/config";
import { resizeModules, positionModules, loadImages, scroller, resizer, hammered, emitter, randomNumber, noop } from "app/util";


import "app/zoom";
import "app/navi";
import "app/tabs";
import "app/slide";
import "app/modal";
import "app/alert";
import "app/select";
import "app/toggle";
import "app/swiper";
import "app/journey";
import "app/overlay";
import "app/spinner";
import "app/gridwall";
import "app/carousel";
import "app/personalize";
import "app/notification";
import "app/selectNative";


var $_window = $( window ),
    $_jsBody = $( ".js-body" ),
    $_jsHtml = $( ".js-html" ),
    $_jsScroll = $_jsBody.add( $_jsHtml ),
    $_jsFeature = $( ".js-feature" ),
    $_jsFeatures = $( ".js-features" ),
    $_jsFeaturesList = $( ".js-features-list" ),

    Easing = require( "Easing" ),
    debounce = require( "debounce" ),
    scroll2 = require( "scroll2" ),

/******************************************************************************
 * TEST STUFF *****************************************************************
*******************************************************************************/
    $_jsColors = $( ".js-color" ),
    $_jsCounts = $( ".js-count" ),
    $_jsPDPVal = $( ".js-pdp-value" ),
    $_jsShowSticky = $( ".js-show-sticky-buy" ),
    $_jsSticky = $( ".js-sticky" ),
/******************************************************************************
 * END TEST STUFF *************************************************************
*******************************************************************************/


/**
 *
 * Handle sizing inline scrolling features
 *
 */
resizeFeatures = function () {
    if ( window.innerWidth <= 640 ) {
        $_jsFeatures.addClass( "-overtouch" ).scrollLeft( 0 );

    } else {
        $_jsFeatures.removeClass( "-overtouch" );
    }
};


/**
 *
 * Handle scroll needs
 * @event app-scroll
 *
 */
scroller.on( "scroll", function () {
    var scrollY = scroller.getScrollY();

    if ( !$_jsShowSticky.length ) {
        return;
    }

    if ( scrollY > $_jsShowSticky.offset().top ) {
        $_jsSticky.addClass( "is-active" );

    } else {
        $_jsSticky.removeClass( "is-active" );
    }
});


/**
 *
 * Handle debounced resize needs
 * @event app-resize
 * @event app-orientationchange
 *
 */
resizer.on( "resize orientationchange", debounce(function () {
    resizeModules();
    positionModules();
    resizeFeatures();
}));


/**
 *
 * Hijack non-linked links
 * @event app-suppress-hash-links
 *
 */
$_jsBody.on( "click", "[href=#]", function ( e ) {
    e.preventDefault();
});


/**
 *
 * Initialize modules on window load
 * @event app-window-load
 *
 */
$_window.on( "load", function () {
    // Force experience to start at top of page
    $_jsScroll.animate( {scrollTop: 0}, "fast" );

    setTimeout(function () {
        $_jsBody.addClass( "is-active" );

    }, 500 );

    // Initialize modules
    zoom.init();
    navi.init();
    tabs.init();
    slide.init();
    modal.init();
    alert.init();
    select.init();
    toggle.init();
    swiper.init();
    journey.init();
    overlay.init();
    spinner.init();
    carousel.init();
    gridwall.init();
    personalize.init();
    notification.init();
    selectNative.init();

    resizeFeatures();

    // Resize modules onload
    resizeModules();

    // Position modules onload
    positionModules();

    // Load Carousel Images
    loadImages( $( ".js-lazy-swiper" ), noop, "sync" );

    // Load Carousel Thumbnails
    loadImages( $( ".js-lazy-thumbnail" ), noop, "sync" );

    // Load Other Images
    loadImages();



/******************************************************************************
 * TEST STUFF *****************************************************************
*******************************************************************************/
    hammered.on( "tap", ".js-heart", function () {
        $( this ).addClass( "accent" );
    });

    hammered.on( "tap", ".js-color", function () {
        var $this = $( this );

        if ( $this.is( ".is-active" ) ) {
            $this.removeClass( "is-active" );

        } else {
            $_jsColors.removeClass( "is-active" );

            $this.addClass( "is-active" );
        }
    });

    // Load color block color settings
    $_jsColors.each(function () {
        var $this = $( this );

        $this.css( "background-color", $this.data( "color" ) );
    });

    // Randomize filter counts
    $_jsCounts.each(function () {
        var $this = $( this );

        $this.text( randomNumber( 50, 300 ) );
    });

    $_jsPDPVal.data( "value", parseInt( $_jsPDPVal.text(), 10 ) );

    emitter.on( "update-qty", function ( val ) {
        $_jsPDPVal.text( val * $_jsPDPVal.data( "value" ) );
    });

    hammered.on( "tap", ".js-buy-button, .js-sticky", function () {
        var $this = $( this ),
            $targ = $( $this.data( "target" ) );

        scroll2({
            ease: Easing.easeOutCubic,
            duration: 400,
            y: $targ.offset().top
        });
    });

    hammered.on( "tap", ".js-reload", function () {
        window.location.reload();
    });
/******************************************************************************
 * END TEST STUFF *************************************************************
*******************************************************************************/



});