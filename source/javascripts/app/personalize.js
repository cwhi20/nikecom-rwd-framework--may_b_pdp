/*!
 *
 * App Module: /personalize
 *
 * A nice description of what this module does...
 *
 *
 */
import "app/overlay";
import "app/notification";
import { hammered } from "app/util";


var $_jsPersonalize = $( ".js-personalize" ),
    $_jsModalParent = $_jsPersonalize.closest( ".js-modal-scroll" ),
    $_jsPersonalizeInputs = $( ".js-personalize-input" ),
    $_jsPersonalizeImages = $( ".js-personalize-image" ),
    $_jsAlert = $( ".js-personalize-alert" ),

    _isInit = false,

    Easing = require( "Easing" ),
    scroll2 = require( "scroll2" ),

    exports = {},


/**
 *
 * Module init method, called once
 * @method init
 * @memberof personalize
 *
 */
init = exports.init = function () {
    if ( _isInit || !$_jsPersonalize.length ) {
        return;
    }

    _isInit = true;

    $_jsPersonalizeInputs.on( "focus", onInputFocus );
    $_jsPersonalizeInputs.on( "blur", onInputBlur );
    $_jsPersonalizeInputs.on( "keyup", onInputText );
},


onInputFocus = function () {
    var $this = $( this ),
        $image = $( ($this.data( "target" ) + "-image") ),
        $rules = $( $this.data( "rules" ) );

    $rules.removeClass( "is-hidden" );

    $_jsPersonalizeImages.removeClass( "is-active" );

    $image.addClass( "is-active" );
},


onInputBlur = function () {
    var $this = $( this ),
        $image = $( ($this.data( "target" ) + "-image") ),
        $rules = $( $this.data( "rules" ) );

    $rules.addClass( "is-hidden" );

    $_jsPersonalizeImages.removeClass( "is-active" );
},


onInputText = function () {
    var $this = $( this ),
        $target = $( $this.data( "target" ) );

    $target.text( $this.val() );

    // Guidelines flag...
    if ( this.value.toLowerCase() === "jordan" ) {
        hammered.trigger( "tap", $_jsAlert[ 0 ] );

        $this.blur();
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export { exports };