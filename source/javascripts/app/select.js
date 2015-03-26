/*!
 *
 * App Module: /select
 *
 * A nice description of what this module does...
 *
 *
 */
import { duration1 } from "app/config";
import { hammered } from "app/util";


var $_jsSelectControllers = $( ".js-select-menu-controller" ),

    _isInit = false,

    exports = {},


/**
 *
 * Module init method, called once
 * @method init
 * @memberof select
 *
 */
init = exports.init = function () {
    if ( _isInit ) {
        return;
    }

    _isInit = true;

    $_jsSelectControllers.on( "change", onSelectChange );

    hammered.on( "tap", ".js-select-menu", onTapSelectMenu );
    hammered.on( "tap", ".js-select-menu-item", onTapSelectMenuItem );
    hammered.on( "tap", ".js-body", onTapDocument );
},


/**
 *
 * Module closeAll method, closes all specified lists
 * @method closeAll
 * @memberof select
 * @private
 *
 */
closeAll = function ( $lists ) {
    ($lists || $( ".js-select-menu-list" )).each(function () {
        var $this = $( this ),
            $feld = $this.prev( ".js-select-menu-field" ),
            $menu = $this.parent();

        $this.addClass( "is-leaving" );
        $menu.removeClass( "is-active" );

        setTimeout(function () {
            $feld.removeClass( "is-active" );
            $this.removeClass( "is-active is-leaving" );

        }, duration1 );
    });
},


/**
 *
 * Module onTapDocument method, handles event
 * @method onTapDocument
 * @param {object} e The Event object
 * @memberof select
 * @private
 *
 */
onTapDocument = function ( e ) {
    var $target = $( e.target );

    if ( !$target.closest( ".js-select-menu" ).length ) {
        closeAll();
    }
},


/**
 *
 * Module onTapSelectMenu method, handles event
 * @method onTapSelectMenu
 * @memberof select
 * @private
 *
 */
onTapSelectMenu = function () {
    var $this = $( this ),
        $feld = $this.find( ".js-select-menu-field" ),
        $list = $this.find( ".js-select-menu-list" );

    if ( $list.is( ".is-active" ) ) {
        closeAll();

    } else {
        closeAll( $( ".js-select-menu-list" ).not( $list ) );

        $this.addClass( "is-active" );
        $feld.addClass( "is-active" );
        $list.addClass( "is-active" );
    }
},


/**
 *
 * Module onTapSelectMenuItem method, handles event
 * @method onTapSelectMenuItem
 * @memberof select
 * @private
 *
 */
onTapSelectMenuItem = function () {
    var $this = $( this ),
        $list = $this.parent(),
        $menu = $this.closest( ".js-select-menu" ),
        $value = $menu.find( ".js-select-menu-value" );

    $list.children().removeClass( "is-active" );
    $this.addClass( "is-active" );

    $value.text( $this.data( "value" ) );

    $list.addClass( "is-leaving" );

    setTimeout(function () {
        $list.removeClass( "is-active is-leaving" );

    }, duration1 );
},


/**
 *
 * Module onSelectChange method, handles event
 * @method onSelectChange
 * @memberof select
 *
 */
onSelectChange = function () {
    var $this = $( this ),
        $menu = $this.closest( ".js-select-menu" ),
        $value = $menu.find( ".js-select-menu-value" );

    $value.text( this.value );
};

/******************************************************************************
 * Export
*******************************************************************************/
export { exports };