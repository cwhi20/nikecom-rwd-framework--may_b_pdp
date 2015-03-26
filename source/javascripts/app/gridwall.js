/*!
 *
 * App Module: /gridwall
 *
 * A nice description of what this module does...
 *
 *
 */
import "app/spinner";
import { duration1 } from "app/config";
import { hammered, randomNumber, shuffle, resizeModules, loadImages } from "app/util";
import { getJourneyFilename } from "app/journey";


var $_jsTags = $( ".js-tags" ),
    $_jsTagsList = $( ".js-tags-list" ),
    $_jsFilterCount = $( ".js-filter-count" ),
    $_jsSortContext = $( ".js-sort-context" ),
    $_jsActiveCategory = $( ".js-active-category" ),
    $_jsActiveTotal = $( ".js-active-total" ),
    $_jsActiveProduct = $( ".js-active-product" ),
    $_jsGridwall = $( ".js-gridwall" ),
    $_tileClone = null,

    _isInit = false,
    _currId = 0,

    Tween = require( "Tween" ),
    Easing = require( "Easing" ),
    scroll2 = require( "scroll2" ),

    exports = {},


/**
 *
 * Module init method, called once
 * @method init
 * @memberof gridwall
 *
 */
init = exports.init = function () {
    if ( _isInit ) {
        return;
    }

    _isInit = true;

    cloneGridTiles();
    //setRandomTotal();
    setActiveFilters();

    // Desktop
    //hammered.on( "tap", ".js-gridwall-category", onGridwallCategoryTap );
    //hammered.on( "tap", ".js-gridwall-product", onGridwallProductTap );

    // Mobile
    hammered.on( "tap", ".js-filter, .js-sort", onOptionTap );
    hammered.on( "tap", ".js-tags-item", onTagsItemTap );
    hammered.on( "tap", ".js-toggle-apply", onApplyOptions );
    hammered.on( "tap", ".js-back2top", onBack2TopTap );
    hammered.on( "tap", ".js-loadmore", onLoadMoreTap );
    hammered.on( "tap", ".js-filter-checkbox", onFilterCheckboxTap );
    hammered.on( "tap", ".js-checkbox-input", onCheckboxTap );
},


/**
 *
 * Store a clone of the gridwall tiles for duping
 * @method cloneGridTiles
 * @memberof gridwall
 * @private
 *
 */
cloneGridTiles = function () {
    $_tileClone = $_jsGridwall.children().clone();
},


/**
 *
 * Display a random total value for gridwall products
 * @method setRandomTotal
 * @memberof gridwall
 * @private
 *
 */
setRandomTotal = function () {
    $_jsActiveTotal.text( randomNumber( 300, 1000 ) );
},


/**
 *
 * Retrieve a shuffled set of gridwall elements
 * @method getClones
 * @memberof gridwall
 * @returns elements
 * @private
 *
 */
getClones = function () {
    return $( shuffle( $_tileClone.clone().toArray() ) );
},


/**
 *
 * Randomize the grid display
 * @method randomizeGridwall
 * @memberof gridwall
 * @private
 *
 */
randomizeGridwall = function () {
    // New set of tiles to display
    var $tiles = getClones();

    // Temporary to keep page height
    $_jsGridwall.height( $_jsGridwall.height() );

    // Empty out the grid
    $_jsGridwall.addClass( "is-inactive" );
    setTimeout(function () {
        $_jsGridwall.empty().append( $tiles );

        setTimeout(function () {
            $_jsGridwall.removeClass( "is-inactive" ).attr( "style", "" );

        }, 100 );

    }, duration1 );
},


/*
onGridwallCategoryTap = function () {
    var $this = $( this ),
        data = $( ".js-gridwall-title" ).data();

    $( ".js-gridwall-category" ).removeClass( "-dark" );
    $this.addClass( "-dark" );

    $( ".js-gridwall-title" ).data( "category", $this.text() );
    $( ".js-gridwall-title" ).html( data.gender + " " + $this.text() + " " + (data.product === "All" ? "" : data.product) );
},
*/


/*
onGridwallProductTap = function () {
    var $this = $( this ),
        data = $( ".js-gridwall-title" ).data();

    $( ".js-gridwall-product" ).removeClass( "-dark" );
    $this.addClass( "-dark" );

    $( ".js-gridwall-title" ).data( "product", $this.text() );
    $( ".js-gridwall-title" ).html( data.gender + " " + (data.category === "All" ? "" : data.category) + " " + $this.text() );
},
*/


/**
 *
 * Scroll back to the top of a gridwall
 * @method onBack2TopTap
 * @memberof gridwall
 * @private
 *
 */
onBack2TopTap = function () {
    scroll2({
        y: 0,
        ease: Easing.easeOutCubic,
        duration: (document.documentElement.scrollHeight / 4)
    });
},


/**
 *
 * Load more gridwall content
 * @method onLoadMoreTap
 * @memberof gridwall
 * @private
 *
 */
onLoadMoreTap = function () {
    var $this = $( this ),
        $tiles = getClones();

    $tiles.addClass( "is-inactive" );

    setTimeout(function () {
        setTimeout(function () {
            $_jsGridwall.append( $tiles );

        }, 10 );

        scroll2({
            y: $this.offset().top,
            duration: duration1,
            complete: function () {
                $tiles.removeClass( "is-inactive" );

                spinner.stop( $this );
            }
        });

    }, duration1 );
},


/**
 *
 * Handle tag item taps
 * @method onTagsItemTap
 * @memberof gridwall
 * @private
 *
 */
onTagsItemTap = function ( e ) {
    var $this = $( this ),
        $filter = $( ".js-filter[data-value='" + $this.data( "value" ) + "']" ),
        data = $this.data(),
        search = window.location.search,
        params = $.paramalama( search ),
        query = "",
        $tags;

    $this.remove();

    $tags = $_jsTagsList.children();

    $filter
        .removeClass( "is-active" )
        .find( ".js-count" )
        .removeClass( "is-active" );

    $filter
        .closest( ".js-toggle-menu" )
        .prev( ".js-toggle-controller" )
        .find( ".js-toggle-meta" )
        .empty();

    if ( !$tags.length ) {
        $_jsTags.removeClass( "is-active" );
        $_jsFilterCount.html( "Filter" );

    } else {
        if ( $tags.length > 1 ) {
            $_jsFilterCount.html( $tags.length + " Filters" );

        } else {
            $_jsFilterCount.html( $tags.length + " Filter" );
        }
    }

    delete params[ data.key ];

    query = window.unescape( $.param( params ) );

    if ( !query ) {
        window.location.href = (window.location.origin + window.location.pathname);

    } else {
        window.location.search = query;
    }
},


/**
 *
 * Handle filter/sort application
 * @method onApplyOptions
 * @memberof gridwall
 * @private
 *
 */
onApplyOptions = function ( e ) {
    var $this = $( this ),
        category = $_jsActiveCategory.text(),
        product = $_jsActiveProduct.text(),
        filename = getJourneyFilename( category, product ),
        location = (window.location.origin + window.location.pathname),
        querystr = "";

    $( ".js-filter.is-active" ).not( ".js-category, .js-product" ).each(function () {
        var $this = $( this );

        querystr += ("&" + $this.data( "key" ) + "=" + $this.data( "value" ));
    });

    if ( filename ) {
        location = location.split( "/" );
        location.pop();
        location.push( filename );
        location = location.join( "/" );

        if ( querystr !== "" ) {
            location += ("?" + querystr.replace( /^&/, "" ));
        }

        window.location.href = location;
    }
},


/**
 *
 * Handle toggle option choice: filter / sort
 * @method onOptionTap
 * @memberof gridwall
 * @private
 *
 */
onOptionTap = function ( e ) {
    var $this = $( this ),
        $count = $this.find( ".js-count" ),
        $check = $this.find( ".js-check" ),
        $filter = $this.closest( ".js-toggle-menu" ).siblings().first(),
        $meta = $filter.find( ".js-toggle-meta" ),
        filterText = $this.find( ".js-value" ).text();

    if ( $this.is( ".js-filter" ) && !$this.is( ".js-color" ) ) {
        $this.closest( ".js-toggle-menu" )
            .find( ".is-active" )
            .removeClass( "is-active" );
        $this.toggleClass( "is-active" );
        $count.toggleClass( "is-active" );
        $meta.html( filterText );

    // Sorts can only have one active if .js-check-one
    // Otherwise, they can have many as in .js-check-many
    } else if ( $this.is( ".js-sort" ) ) {
        if ( $this.is( ".js-check-one" ) && !$this.is( ".is-active" ) ) {
            $( ".js-sort" ).removeClass( "is-active" );
            $( ".js-check" ).removeClass( "is-active" );
        }

        if ( $this.is( ".js-check-many" ) && $this.is( ".is-active" ) ) {
            $this.removeClass( "is-active" );
            $check.removeClass( "is-active" );

        } else {
            $this.addClass( "is-active" );
            $check.addClass( "is-active" );
        }

        $_jsSortContext.html( $this.text() );
    }

    if ( $this.is( ".js-category" ) ) {
        $_jsActiveCategory.text( filterText );
    }

    if ( $this.is( ".js-product" ) ) {
        $_jsActiveProduct.text( filterText );
    }

    if ( $this.is( ".js-color" ) ) {
        $meta.html( '<span class="dot dot--label" style="background-color:' + $this.data( "color" ) + ';"></span>' );
    }

    setActiveFilters();

    hammered.trigger( "tap", $this.closest( ".js-toggle-menu" ).prev( ".js-toggle-controller" ).get( 0 ) );
},


setActiveFilters = function () {
    var $tags = $( [] );

    $( ".js-filter.is-active" ).not( ".js-category, .js-product" ).each(function () {
        var $filter = $( this ),
            data = $filter.data(),
            tag;

        tag = '<li class="tagset__item js-tags-item" data-key="' + data.key + '" data-value="' + data.value + '"><span class="icon icon--close"></span><span>' + data.value + '</span></li>';

        $tags.push( $( tag ).get( 0 ) );
    });

    if ( $tags.length ) {
        $_jsTags.addClass( "is-active" );
        $_jsTagsList.empty().append( $tags );

        if ( $tags.length > 1 ) {
            $_jsFilterCount.html( $tags.length + " Filters" );

        } else {
            $_jsFilterCount.html( $tags.length + " Filter" );
        }
    }
},


/**
 *
 * Desktop proto, handle filtered checkbox clicks
 * @method onCheckboxTap
 * @memberof gridwall
 * @private
 *
 */
onCheckboxTap = function ( e ) {
    var $this = $( this ),
        $link = $this.parent( ".js-filter-checkbox, .js-remove-checkbox" );

    if ( !$link.length ) {
        return;
    }

    if ( !$link[ 0 ].href.match( /#$/ ) ) {
        if ( $this.prop( "checked" ) ) {
            $this.prop( "checked", false );

        } else {
            $this.prop( "checked", true );
        }

        window.location.href = $link[ 0 ].href;
    }
},


/**
 *
 * Desktop proto, handle filter checkbox clicks
 * @method onFilterCheckboxTap
 * @memberof gridwall
 * @private
 *
 */
onFilterCheckboxTap = function ( e ) {
    var $this = $( this ),
        $toggle = $this.closest( ".js-toggle" ),
        $controller = $toggle.find( "> .js-toggle-controller" ),
        $total = $controller.find( ".js-toggle-meta" ),
        $check = $this.find( ".js-checkbox-input" ),
        total = (parseInt( $total.text(), 10 ) || 0);

    // Not checked === being checked
    if ( !$check.prop( "checked" ) ) {
        total = (total + 1);

    } else {
        total = Math.max( (total - 1), 0 );
    }

    if ( total ) {
        $total.html( ("&nbsp;" + total + "&nbsp;") ).addClass( "parens -accent" );

    } else {
        $total.html( "" ).removeClass( "parens -accent" );
    }

    if ( $check.prop( "checked" ) ) {
        $check.prop( "checked", false );

    } else {
        $check.prop( "checked", true );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };