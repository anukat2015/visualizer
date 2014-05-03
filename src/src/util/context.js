
// Context menu
define(['jquery', 'modules/modulefactory'], function($, ModuleFactory) {

	var contextMenu;

	return {

		listen: function(dom, elements, onBeforeShow, onAfterShow) {
			if(!(elements[0] instanceof Array))
				elements = [elements];
			
			dom.addEventListener('contextmenu', function(e) {	
				

				if( onBeforeShow ) {
					onBeforeShow( contextMenu );
				}

				for(var i = 0, l = elements.length; i < l; i++) {
					( 
						function(element, callbackClick, callbackOpen) {

							if( ( callbackOpen && callbackOpen( e, element ) ) || ! callbackOpen ) {
								contextMenu.append( element );
							}

							element.bind('click', function( e2 ) {

								if( callbackClick ) {

									callbackClick.call( this, e, e2 );
								}
							})

						}
					) ( $( elements[ i ][ 0 ] ), elements[ i ][ 1 ], elements[ i ][ 2 ] );
				}

				if( onAfterShow ) {
					onAfterShow( contextMenu );
				}

			}, true);
		},

		unlisten: function(dom) {
			dom.removeEventListener('contextmenu');
		},

		getRootDom: function() {
			return this.dom;
		},
		
		init: function(dom) {
			this.dom = dom;
			dom.addEventListener('contextmenu', function(e) {

				//e.preventDefault();
				if( contextMenu ) {
					if( contextMenu.hasClass('ui-menu') ) {
						contextMenu.menu('destroy')
					}
					contextMenu.remove();
				} 

				contextMenu = null;
				$menu = $('<ul class="ci-contextmenu"></ul>').css({
					'position': 'absolute',
					'left': e.pageX,
					'top': e.pageY,
					'z-index': 10000
				}).appendTo($("body"));

				contextMenu = $menu;

				var clickHandler = function() {
					
					//e.preventDefault();
					if( contextMenu ) {
						if( contextMenu.hasClass('ui-menu') ) {
							contextMenu.menu('destroy')
						}
						contextMenu.remove();
					} 

					contextMenu = null;
					$(document).unbind('click', clickHandler);
				}

				var rightClickHandler = function() {
					
					//e.preventDefault();
					if( contextMenu ) {
						if( contextMenu.hasClass('ui-menu') ) {
							contextMenu.menu('destroy')
						}
						contextMenu.remove();
					} 

					contextMenu = null;
				}
				
				$(document).bind('click', clickHandler);
		//		return false;

			}, true);


			dom.parentNode.addEventListener('contextmenu', function(e) {

				//console.log( contextMenu );
				if( contextMenu.children().length > 0 ) {
					contextMenu.menu({
						select: function(event, ui) {
							var moduleName = ui.item.attr('name');
						}
					});

					e.preventDefault();
					e.stopPropagation();
					return false;
				}
				
			}, false);
		}


	}
});
