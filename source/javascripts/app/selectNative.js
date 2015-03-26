/*!
 *
 * App Module: /selectNative
 *
 * A nice description of what this module does...
 *
 *
 */
import { hammered } from "app/util";


var $_jsSelectNatives = $( ".js-select-native" ),

    _isInit = false,

    exports = {},


/**
 *
 * Module init method, called once
 * @method init
 * @memberof selectNative
 *
 */
init = exports.init = function () {
    if ( _isInit ) {
        return;
    }

    _isInit = true;

    $_jsSelectNatives.each(function () {
        var $this = $( this ),
            $menu = $this.find( ".js-select-native-menu" ),
            $value = $this.find( ".js-select-native-value" ),
            $options = $menu.find( "option" );

        $menu.data( "value", $value ).on( "change", onSelectChange );

        $options.each(function () {
            var $opt = $( this );

            if ( $opt.prop( "selected" ) ) {
                onSelectChange.call( $menu[ 0 ] );

                // Break out of .each iteration
                return false;
            }
        });
    });
},


/**
 *
 * Module onSelectChange method, handles event
 * @method onSelectChange
 * @memberof selectNative
 *
 */
onSelectChange = function () {
    var $this = $( this ),
        $targ = $( $this.data( "checkTarget" ) ),
        $value = $this.data( "value" );

    $this.removeClass( "-border--error" );

    $value.text( this.value );

    if ( this.value === "" ) {
        $value.removeClass( "parens" );
        $targ.addClass( "is-hidden" );

    } else {
        $value.addClass( "parens" );
        $targ.removeClass( "is-hidden" );
    }
};

/******************************************************************************
 * Export
*******************************************************************************/
export { exports };