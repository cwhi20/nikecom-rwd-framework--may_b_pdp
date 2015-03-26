/*!
 *
 * App Module: /journey
 *
 * A nice description of what this module does...
 *
 *
 */
import { hammered } from "app/util";


var _isInit = false,

    exports = {},

    files = {
        "Shoes": "gridwall-mens-shoes.html",
        "Shirts & Tops": "gridwall-mens-shirts.html",
        "Running": "gridwall-mens-running.html",
        "Soccer": "gridwall-mens-soccer.html",
        "Running Shoes": "gridwall-mens-running-shoes.html",
        "Running Shirts & Tops": "gridwall-mens-running-shirts.html",
        "Soccer Shoes": "gridwall-mens-soccer-shoes.html",
        "Soccer Shirts & Tops": "gridwall-mens-soccer-shirts.html"
    },

    metaClass = "parens -accent",

    query = window.location.search,
    params = $.paramalama( query ),


init = exports.init = function () {
    if ( _isInit ) {
        return;
    }

    _isInit = true;

    // Normalize all param keys to be array values
    for ( var i in params ) {
        if ( !$.isArray( params[ i ] ) ) {
            params[ i ] = [ params[ i ] ];
        }
    }

    // Desktop
    handleParams();
    handleFiltered();

    // Desktop : Selects
    handleParamsSelects();

    // Mobile
    handleParamsMobile();

    hammered.on( "tap", ".js-product-type-item", onProductTypeItemTap );
    hammered.on( "tap", ".js-product-type", onProductTypeTap );
},


onProductTypeItemTap = function () {
    var $this = $( this );

    $( ".js-product-type-item" ).removeClass( "-bold" );
    $this.addClass( "-bold" );
},


onProductTypeTap = function () {
    var $this = $( this );

    $( ".js-product-type" ).removeClass( "-bold" );
    $this.addClass( "-bold" );
},


handleFiltered = function () {
    var $filteredBlock = $( ".js-filters-selected" ),
        filteredList = [];

    for ( var i in params ) {
        if ( params.hasOwnProperty( i ) ) {
            for ( var j = params[ i ].length; j--; ) {
                var element = '',
                    url = window.location.pathname.split( "/" ).pop(),
                    req = {};

                if ( query ) {
                    for ( var k in params ) {
                        if ( params.hasOwnProperty( k ) ) {
                            if ( k === i ) {
                                if ( params[ k ].length > 1 ) {
                                    req[ k ] = [];

                                    for ( var l = params[ k ].length; l--; ) {
                                        if ( params[ k ][ l ] !== params[ i ][ j ] ) {
                                            req[ k ].push( params[ k ][ l ] );
                                        }
                                    }
                                }

                            } else {
                                req[ k ] = params[ k ];
                            }
                        }
                    }
                }

                req = window.unescape( $.param( req ) );

                url += (req !== "" ? ("?" + req) : "");

                element += '<a href="' + url + '" class="checkbox checkbox--inline margin-right--10 p js-checkbox js-remove-checkbox" for="fParam ' + params[ i ][ j ] + '">';
                element += '    <input type="checkbox" name="checkParam' + params[ i ][ j ] + '" value="' + params[ i ][ j ] + '" id="fParam' + params[ i ][ j ] + '" class="checkbox__input is-remove js-checkbox-input" checked />';
                element += '    <div class="checkbox__label margin-left--5">' + params[ i ][ j ] + '</div>';
                element += '</a>';

                filteredList.push( element );
            }
        }
    }

    if ( $filteredBlock.length && filteredList.length ) {
        if ( !$filteredBlock.children().length ) {
            filteredList.unshift( '<span class="span p margin-right--10 -font--14">Filtered by:</span>' );
        }

        $filteredBlock.addClass( "is-active" ).append( filteredList.join( "" ) );

        $( ".js-navi--lefty" ).attr( "style", "" );
    }

    if ( query ) {
        $( ".js-filters-clear" ).removeClass( "is-hidden" ).attr( "href", (window.location.origin + window.location.pathname) );
    }
},


handleParams = function () {
    // Apply params to filter category links
    $( ".js-filter-params" ).each(function () {
        if ( !/#$/.test( this.href ) ) {
            this.href = (this.href + query);
        }
    });

    // Iterate each filter set and process the information
    $( ".js-filter-set" ).each(function () {
        var $filterSet = $( this ),
            $filterToggle = $filterSet.find( ".js-toggle-controller" ),
            $filterMeta = $filterSet.find( ".js-toggle-meta" ),
            $filterOptions = $filterSet.find( ".js-filter-checkbox" ),
            metaValue = 0;

        $filterOptions.each(function () {
            var $this = $( this ),
                $check = $this.find( ".js-checkbox-input" ),
                paramKey = $this.data( "key" ),
                paramVal = ("" + $this.data( "value" ));

            // Set the checked prop on input
            if ( paramKey && paramVal && params[ paramKey ] ) {
                if ( params[ paramKey ].indexOf( paramVal ) !== -1 ) {
                    $check.prop( "checked", true );

                    metaValue++;
                }
            }

            // No query string is present
            if ( !query ) {
                this.href = ("?" + paramKey + "[]=" + paramVal);

            // Query string is present, this key IS present but this value IS NOT in it OR this key IS NOT present
            } else if ( !params[ paramKey ] || (params[ paramKey ] && params[ paramKey ].indexOf( paramVal ) === -1) ) {
                this.href = (query + "&" + paramKey + "[]=" + paramVal);

            // Query string is present, this key IS present AND this value IS in it
            } else {
                this.href = query.replace( (paramKey + "[]=" + paramVal), "" ).replace( /^\?&/, "?" );
            }
        });

        // Meta val was incremented
        if ( metaValue ) {
            $filterMeta.addClass( metaClass ).html( "&nbsp;" + metaValue + "&nbsp;" );

            hammered.trigger( "tap", $filterToggle[ 0 ] );
        }
    });

    $( ".js-filter-set--hidden" ).each(function () {
        var $this = $( this ),
            data = $this.data();

        if ( params[ data.key ] && params[ data.key ].indexOf( data.value ) !== -1 ) {
            $this.removeClass( "is-hidden" );
        }
    });
},


handleParamsSelects = function () {
    // Iterate each filter set and process the information
    $( ".js-filter-set--select" ).each(function () {
        var $filterSet = $( this ),
            $filterMeta = $filterSet.find( ".js-select-menu-value" ),
            $filterOptions = $filterSet.find( ".js-select-menu-item" );

        $filterOptions.each(function () {
            var $this = $( this ),
                $link = $this.find( "a" ),
                paramKey = $this.data( "key" ),
                paramVal = ("" + $this.data( "value" ));

            // Set the checked prop on input
            if ( paramKey && paramVal && params[ paramKey ] ) {
                if ( params[ paramKey ].indexOf( paramVal ) !== -1 ) {
                    $this.addClass( "is-active" );
                    $filterMeta.html( paramVal );
                }
            }

            // No query string is present
            if ( !query ) {
                $link[ 0 ].href = ("?" + paramKey + "[]=" + paramVal);

            // Query string is present, this key IS present but this value IS NOT in it OR this key IS NOT present
            } else if ( !params[ paramKey ] || (params[ paramKey ] && params[ paramKey ].indexOf( paramVal ) === -1) ) {
                $link[ 0 ].href = (query + "&" + paramKey + "[]=" + paramVal);

            // Query string is present, this key IS present AND this value IS in it
            } else {
                $link[ 0 ].href = query.replace( (paramKey + "[]=" + paramVal), "" ).replace( /^\?&/, "?" );
            }
        });
    });
},


handleParamsMobile = function () {
    // Iterate each filter set and process the information
    $( ".js-filter-set--mobile" ).each(function () {
        var $filterSet = $( this ),
            $filterMeta = $filterSet.find( ".js-toggle-meta" ),
            $filterOptions = $filterSet.find( ".js-filter" );

        $filterOptions.each(function () {
            var $this = $( this ),
                $count = $this.find( ".js-count" ),
                paramKey = $this.data( "key" ),
                paramVal = ("" + $this.data( "value" ));

            // Set the checked prop on input
            if ( paramKey && paramVal && params[ paramKey ] ) {
                if ( params[ paramKey ].indexOf( paramVal ) !== -1 ) {
                    $this.addClass( "is-active" );
                    $count.addClass( "is-active" );
                    $filterMeta.html( paramVal );
                }
            }
        });
    });
},


getJourneyFilename = exports.getJourneyFilename = function ( cat, prod ) {
    cat = (cat === "All") ? "" : cat;
    prod = (prod === "All") ? "" : prod;

    return files[ (cat + " " + prod).replace( /^\s+|\s+$/g, "" ) ];
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };