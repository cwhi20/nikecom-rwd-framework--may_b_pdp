/*!
 *
 * App Module: /config
 *
 * @namespace config
 * @memberof app
 *
 */


/**
 *
 * Base transition duration
 * @member duration1
 * @memberof config
 *
 */
var duration1 = 400,


/**
 *
 * Base transition duration
 * @member duration2
 * @memberof config
 *
 */
duration2 = 600,


/**
 *
 * Base transition duration
 * @member duration3
 * @memberof config
 *
 */
duration3 = 800,


/**
 *
 * Max width for site container
 * @member gridMaxWidth
 * @memberof config
 *
 */
gridMaxWidth = 1780,


/**
 *
 * Video display aspect ratio
 * @member videoAspect
 * @memberof config
 *
 */
videoAspect = (1280 / 720),


/**
 *
 * Ratio for PDP sizing
 * @member ratioPDP
 * @memberof config
 *
 */
ratioPDP = (320 / 408),


/**
 *
 * Ratio for P1 sizing
 * @member ratioP1Square
 * @memberof config
 *
 */
ratioP1Square = (320 / 320),


/**
 *
 * Ratio for P1 sizing
 * @member ratioP1Full
 * @memberof config
 *
 */
ratioP1Full = (1958 / 1025),


/**
 *
 * Ratio for tile sizing
 * @member ratioTILE
 * @memberof config
 *
 */
ratioTILE = (320 / 340),


/**
 *
 * Ratio for gridwall tile sizing
 * @member ratioGRID
 * @memberof config
 *
 */
ratioGRID = (318 / 407),


/**
 *
 * Offset for mobile navigation
 * @member naviMobileOffset
 * @memberof config
 *
 */
naviMobileOffset = 110,


/**
 *
 * Width for tablet navigation
 * @member naviTabletWidth
 * @memberof config
 *
 */
naviTabletWidth = 320,


/**
 *
 * Vendor prefix for styles
 * @member cssTransform
 * @memberof config
 *
 */
cssTransform = (function ( vendors ) {
    var prefix;

    for ( var i = 0, len = vendors.length; i < len; i++ ) {
        if ( document.body.style[ (vendors[ i ] + "Transform") ] !== undefined ) {
            prefix = vendors[ i ];
            break;
        }
    }

    return (prefix + "Transform");

})( [ "Webkit", "Moz", "O", "ms" ] );


/******************************************************************************
 * Export
*******************************************************************************/
export { duration1, duration2, duration3, gridMaxWidth, videoAspect, ratioPDP, ratioP1Square, ratioP1Full, ratioTILE, ratioGRID, naviMobileOffset, naviTabletWidth, cssTransform };