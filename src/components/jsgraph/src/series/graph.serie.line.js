
define( [ '../graph._serie'], function( GraphSerieNonInstanciable ) {

	"use strict";

	var GraphSerie = function() { }
	$.extend( GraphSerie.prototype, GraphSerieNonInstanciable.prototype, {

		defaults: {
			lineColor: 'black',
			lineStyle: 1,
			flip: false,
			label: "",

			markers: false,
			trackMouse: false,
			trackMouseLabel: false,
			trackMouseLabelRouding: 1,
			lineToZero: false,

			lineWidth: 1,

			autoPeakPicking: false,
			autoPeakPickingNb: 4,
			autoPeakPickingMinDistance: 10
		},


		init: function( graph, name, options ) {

			var self = this;
			this.graph = graph;
			this.name = name;
			this.id = Math.random() + Date.now();

			this.shown = true;
			this.options = $.extend(true, {}, GraphSerie.prototype.defaults, options);


			this.data = [];
			this._isMinOrMax = { x: { min: false, max: false}, y: { min: false, max: false} };

			this.groupLines = document.createElementNS(this.graph.ns, 'g');
			this.domMarker = document.createElementNS(this.graph.ns, 'path');
			this.domMarker.style.cursor = 'pointer';

			this.groupMain = document.createElementNS(this.graph.ns, 'g');
			this.additionalData = {};

			

			this.marker = document.createElementNS(this.graph.ns, 'circle');
			this.marker.setAttribute('fill', 'black');
			this.marker.setAttribute('r', 3);
			this.marker.setAttribute('display', 'none');

			this.markerLabel = document.createElementNS(this.graph.ns, 'text');
			this.markerLabelSquare = document.createElementNS(this.graph.ns, 'rect');
			this.markerLabelSquare.setAttribute('fill', 'white');
			this.domMarkerHover = {};
			this.domMarkerSelect = {};
			this.markerHovered = 0;
			this.groupMarkerSelected = document.createElementNS(this.graph.ns, 'g');

			this.groupLabels = document.createElementNS(this.graph.ns, 'g');
			//this.scale = 1;
			//this.shift = 0;

			this.minX = Number.MAX_VALUE;
			this.minY = Number.MAX_VALUE;
			this.maxX = Number.MIN_VALUE;
			this.maxY = Number.MIN_VALUE;

			this.lines = [];
			

			this.groupMain.appendChild(this.groupLines);
			this.groupMain.appendChild(this.groupLabels);
			this.groupMain.appendChild(this.marker);
			
			this.groupMain.appendChild(this.groupMarkerSelected);
			this.groupMain.appendChild(this.markerLabelSquare);
			this.groupMain.appendChild(this.markerLabel);

			this.labels = [];

			this.currentAction = false;

			if(this.initExtended1)
				this.initExtended1();

			if(this.options.autoPeakPicking) {

				this.picks = this.picks || [];
				

				this.picksDef = [];

				for(var n = 0, m = this.options.autoPeakPickingNb; n < m; n++) {

					this.picksDef.push( this.graph.newShape( { 

							type: 'label', 
							label: {
								text: "",
								position: { x: 0 },
								anchor: 'middle'
							}

						} ).then( function( shape ) {

							shape.setSerie( self );
							self.picks.push( shape );	
 						} )
					);
				}

			}
		},

		setAdditionalData: function( data ) {
			this.additionalData = data;
			return this;
		},

		getAdditionalData: function( ) {
			return this.additionalData;
		},

		calculateSlots: function( ) {

			var self = this;
			this.slotsData = {};
			this.slotWorker = new Worker('./src/slotworker.js');

			this.slotWorker.onmessage = function( e ) {
				self.slotsData[ e.data.slot ].resolve( e.data.data );
			}

			for(var i = 0, l = this.slots.length; i < l ; i ++) {

				//this.slotsData[ i ] = $.Deferred();
				this.calculateSlot( this.slots[ i ], i );
//				this.slotsData[ this.slots[ i ] ].max = this.data[ j ][ m ];
			}
		},

		slotCalculator: function( slot, slotNumber ) {
			var def = $.Deferred();

			this.slotWorker.postMessage( { 
				min: this.minX, 
				max: this.maxX, 
				data: this.data, 
				slot: slot, 
				slotNumber: slotNumber, 
				flip: this.getFlip()
			} );

			return def;
		},

		calculateSlot: function( slot, slotNumber ) {
			var self = this;
			this.slotsData[ slot ] = this.slotCalculator( slot, slotNumber );
			this.slotsData[ slot ].pipe( function( data ) {
				
				self.slotsData[ slot ] = data;
				return data;
			});
		},

		kill: function( noRedraw ) {

			this.graph.plotGroup.removeChild(this.groupMain);

			if (this.picks && this.picks.length) {
				for(var i = 0, l = this.picks.length; i < l; i++) {
					this.picks[i].kill();
				}
			}

			this.graph._removeSerie( this );
			
			if( ! noRedraw ) {
				this.graph.redraw();
			}

			if( this.graph.legend ) {

				this.graph.legend.update( );
			}
		},

		onMouseOverMarker: function(e, index) {
			var toggledOn = this.toggleMarker(index, true, true);
			if(this.options.onMouseOverMarker) {
				this.options.onMouseOverMarker(index, this.infos ? (this.infos[index[0]] || false) : false, [this.data[index[1]][index[0] * 2], this.data[index[1]][index[0] * 2 + 1]]);
			}
		},


		onMouseOutMarker: function(e, index) {
			this.markersOffHover();
			if(this.options.onMouseOutMarker && this.infos) {
				this.options.onMouseOutMarker(index, this.infos ? (this.infos[index[0]] || false) : false, [this.data[index[1]][index[0] * 2], this.data[index[1]][index[0] * 2 + 1]]);
			}
		},

		toggleMarker: function(index, force, hover) {
			var i = index[0],
				k = index[1] || 0;

			index = index.join();

			var _on = !hover ? !this.domMarkerSelect[index] : !this.domMarkerHover[index];
			var el = this['domMarker' + (hover ? 'Hover' : 'Select')];
			
			if(_on || (force === true && force !== false)) {

				if(!el[index]) {

					var dom = document.createElementNS(this.graph.ns, 'path');
					this.setMarkerStyleTo(dom, true);

					var x = this.getX(this.data[k][i * 2]);
					var y = this.getY(this.data[k][i * 2 + 1]);

					dom.setAttribute('d', "M " + x + " " + y + " " + this.getMarkerPath( this.markerFamily[ this.getMarkerCurrentFamily( i ) ], 1 ));

					this['domMarker' + (hover ? 'Hover' : 'Select')][index] = dom;
					this.groupMarkerSelected.appendChild(dom);
					
					if(hover)
						this.markerHovered++;
				}

			} else if(force === false || !_on) {

				if((hover && this.domMarkerHover[index] && !this.domMarkerSelect[index]) || this.domMarkerSelect[index]) {
					
					if(!el[index])
						return;
					this.groupMarkerSelected.removeChild(el[index]);
					delete el[index];

					if(hover)
						this.markerHovered--;
				}

			}

			return _on;
		},

		markersOffHover: function() {

			for(var i in this.domMarkerHover) {
				this.toggleMarker(i.split(','), false, true);
			}
		},

		onClickOnMarker: function(e, index) {
			
			var toggledOn = this.toggleMarker(index);

			if(toggledOn && this.options.onSelectMarker)
				this.options.onSelectMarker(index, this.infos ? (this.infos[index[0]] || false) : false);

			if(!toggledOn && this.options.onUnselectMarker)
				this.options.onUnselectMarker(index, this.infos ? (this.infos[index[0]] || false) : false);

			if(this.options.onToggleMarker)
				this.options.onToggleMarker(index, this.infos ? (this.infos[index[0]] || false) : false, toggledOn);
		},


		_getMarkerIndexFromEvent: function(e) {
			var px = this.graph._getXY(e);
			return this.searchIndexByPxXY((px.x - this.graph.getPaddingLeft()), (px.y - this.graph.getPaddingTop()));

		},

		onMouseWheel: function() {},

		empty: function() {

			for(var i = 0, l = this.lines.length; i < l; i++) {
				this.groupLines.removeChild(this.lines[i]);
				
			}

			while(this.groupMarkers.firstChild) {
				this.groupMarkers.removeChild(this.groupMarkers.firstChild);
			}
		},

		select: function() {
			this.selected = true;

			for( var i = 0, l = this.lines.length ; i < l ; i ++ ) {

				this.applyLineStyle( this.lines[ i ] );
			}

			this.applyLineStyle( this.getSymbolForLegend() );
		},

		unselect: function() {

			this.selected = false;

			for( var i = 0, l = this.lines.length ; i < l ; i ++ ) {

				this.applyLineStyle( this.lines[ i ] );
			}

			this.applyLineStyle( this.getSymbolForLegend() );
		},

		degrade: function( pxPerP, options ) {

			var serie = this.graph.newSerie( this.name, options, 'zone' );
			this.degradationPx = pxPerP;

			if( ! serie ) {
				return;
			}
			
			serie.setData([]);

			serie.setXAxis( this.getXAxis() );
			serie.setYAxis( this.getYAxis() );

			
			this.degradationSerie = serie;

			return serie;
		},


		draw: function() { // Serie redrawing

			var data = this.data;
			var xData = this.xData;

			if( this.degradationPx ) {
				data = getDegradedData( this );
				xData = data[ 1 ];
				data = data[ 0 ];
			}


			var x, 
				y, 
				xpx, 
				ypx, 
				xpx2,
				ypx2,
				i = 0, 
				l = data.length, 
				j = 0, 
				k, 
				m,
				currentLine, 
				max,
				self = this;

			var optimizeMonotoneous = this.isXMonotoneous(), optimizeMaxPxX = this.getXAxis().getMaxPx(), optimizeBreak, buffer;

			var shape, self = this;


			this._drawn = true;			

			var next = this.groupLines.nextSibling;
			this.groupMain.removeChild(this.groupLines);
			
			this.marker.setAttribute('display', 'none');
			
			this.markerCurrentFamily = null;
			var markerCurrentIndex = 0;
			var markerNextChange = -1;//this.markerPoints[ markerCurrentIndex ][ 0 ];

			var incrXFlip = 0;
			var incrYFlip = 1;

			if( this.isFlipped( ) ) {
				incrXFlip = 1;
				incrYFlip = 0;
			}

			this.eraseMarkers();

			var totalLength = 0;
			for( ; i < l ; i ++ ) {
				totalLength += data[ i ].length / 2;
			}

			i = 0;
			var allY = [ ],
				slotToUse,
				y = 0,
				z;

			if( this.options.useSlots && this.slots ) {
				
				var slot = this.graph.getDrawingWidth( ) * ( this.maxX - this.minX ) / ( this.getXAxis().getActualMax() - this.getXAxis().getActualMin() );
				
				for( var y = 0, z = this.slots.length; y < z ; y ++ ) {

					if( slot < this.slots[ y ] ) {
						slotToUse = this.slotsData[ this.slots[ y ] ];
						break;
					}
				}
			}

			var degradation = [];
			var buffer;

			var lookForMaxima = true;
			var lookForMinima = false;

			if( this.options.autoPeakPicking ) {
				var lastYPeakPicking;
			}

			if( slotToUse ) {
				if( slotToUse.done ) {

					slotToUse.done( function( data ) {
						self.drawSlot( data, y );
					});

				} else {
					this.drawSlot( slotToUse, y );	
				}
				
			} else {
				
				if( this.mode == 'x_equally_separated' ) {

					for( ; i < l ; i ++ ) {
						
						currentLine = "M ";
						j = 0, k = 0, m = data[ i ].length;

						for( ; j < m ; j += 1 ) {

							if( this.markersShown() ) {

								this.getMarkerCurrentFamily( k );								
							}

							if( ! this.isFlipped() ) {
							
								xpx = this.getX( xData[ i ].x + j * xData[ i ].dx );
								ypx = this.getY( data[ i ][ j ] );								
							} else {
								ypx = this.getX( xData[ i ].x + j * xData[ i ].dx );
								xpx = this.getY( data[ i ][ j ] );								
							}


							if( optimizeMonotoneous && xpx < 0 ) {
								buffer = [ xpx, ypx ];
								continue;
							}

							if( optimizeMonotoneous && buffer ) {

								currentLine = this._addPoint( currentLine, buffer[ 0 ], buffer[ 1 ], k );
								buffer = false;
								k++;
							}

							currentLine = this._addPoint( currentLine, xpx, ypx, k );
							k++;


							if( optimizeMonotoneous && xpx > optimizeMaxPxX ) {
								toBreak = true;
								break;
							}

						}
						
						this._createLine(currentLine, i, k);

						if( toBreak ) { 
							break;
						}
					}

				} else {

					for( ; i < l ; i ++ ) {
						
						var toBreak = false;

						currentLine = "M ";
						j = 0, k = 0, m = data[ i ].length;


						for( ; j < m ; j += 2 ) {


							if( this.markersShown() ) {

								this.getMarkerCurrentFamily( k );
								
							}

							xpx2 = this.getX( data[ i ][ j + incrXFlip ] );
							ypx2 = this.getY( data[ i ][ j + incrYFlip ] );
							
							if( xpx2 == xpx && ypx2 == ypx ) {
								continue;
							}

							if( optimizeMonotoneous && xpx2 < 0 ) {
								buffer = [ xpx2, ypx2 ]
								continue;
							}

							if( optimizeMonotoneous && buffer ) {

								currentLine = this._addPoint( currentLine, buffer[ 0 ], buffer[ 1 ], k );
								buffer = false;
								k++;
							}

							if( this.options.autoPeakPicking ) {

								if( ! this.options.lineToZero ) {

									if( ! lastYPeakPicking ) {
										lastYPeakPicking = [ ( data[ i ][ j + incrYFlip ] ), data[ i ][ j + incrXFlip ] ];
									} else {

										if( ( data[ i ][ j + incrYFlip ] >= lastYPeakPicking[ 0 ] && lookForMaxima ) || ( data[ i ][ j + incrYFlip ] <= lastYPeakPicking[ 0 ] && lookForMinima ) ) {

											lastYPeakPicking = [ ( data[ i ][ j + incrYFlip ] ), data[ i ][ j + incrXFlip ] ]

										} else {

											if( lookForMinima ) {
												lookForMinima = false;
												lookForMaxima = true;
											} else {

												lookForMinima = true;
												lookForMaxima = false;

												allY.push( lastYPeakPicking );	
												lastYPeakPicking = false;	
											}
											

										}
									} 
	
								} else {
									allY.push( [ ( data[ i ][ j + incrYFlip ] ), data[ i ][ j + incrXFlip ] ] );	
								}
							}
							
							currentLine = this._addPoint( currentLine, xpx2, ypx2, k );
							k++;

							if( optimizeMonotoneous && xpx2 > optimizeMaxPxX ) {
								toBreak = true;
								break;
							}

							xpx = xpx2;
							ypx = ypx2;
						}
						
						this._createLine(currentLine, i, k);

						if( toBreak ) {
							break;
						}
					}
				}
			}

			if( this.options.autoPeakPicking ) {
				makePeakPicking( this, allY );
			}

			i++;

			for( ; i < this.lines.length ; i++ ) {
				this.groupLines.removeChild( this.lines[ i ] );
				this.lines.splice(i, 1);
			}

			insertMarkers( this );

			this.groupMain.insertBefore(this.groupLines, next);
			var label;
			for( var i = 0, l = this.labels.length ; i < l ; i ++ ) {
				this.repositionLabel( this.labels[ i ] );
			}
		},


		

		getMarkerCurrentFamily: function( k ) {

			for( var z = 0 ; z < this.markerPoints.length ; z ++ ) {
				if( this.markerPoints[ z ][ 0 ] <= k ) { // This one is a possibility !
					if( this.markerPoints[ z ][ 1 ] >= k ) { // Verify that it's in the boundary
						this.markerCurrentFamily = this.markerPoints[z ][ 2 ];
					}
				} else {
					break;
				}


			}

			return this.markerCurrentFamily;

		},

		drawSlot: function( slotToUse, y ) {

			var dataPerSlot = this.slots[ y ] / (this.maxX - this.minX);

			//console.log(slotToUse, y, this.slots[ y ]);
			
			var currentLine = "M ";
			var k = 0;
			var i = 0, xpx, max;
			var j;

			var slotInit = Math.floor( ( this.getXAxis( ).getActualMin( ) - this.minX ) * dataPerSlot );
			var slotFinal = Math.ceil( ( this.getXAxis( ).getActualMax( ) - this.minX ) * dataPerSlot );

			for( j = slotInit ;  j <= slotFinal ; j ++ ) {

				if( ! slotToUse[ j ] ) {
					continue;
				}

				xpx = Math.floor( this.getX( slotToUse[ j ].x ) ),
				max = this.getY( slotToUse[ j ].max );
	
				if(this.options.autoPeakPicking) {
					allY.push( [ slotToUse[ j ].max, slotToUse[ j ].x ] );
				}
				
				currentLine = this._addPoint( currentLine, xpx, this.getY( slotToUse[ j ].start ) , k );
				currentLine = this._addPoint( currentLine, xpx, max , false, true );
				currentLine = this._addPoint( currentLine, xpx, this.getY( slotToUse[ j ].min ) );
				currentLine = this._addPoint( currentLine, xpx, this.getY( slotToUse[ j ].stop ), false, true );

				k++;
				
			}

			this._createLine(currentLine, i, k);
			i++;
			//console.timeEnd('Slot');
		},

		setMarkerStyleTo: function( dom, family ) {
			
			if( ! dom ) {
				throw "Cannot set marker style. DOM does not exist.";
			}

			dom.setAttribute('fill', family.fillColor || 'transparent' );
			dom.setAttribute('stroke', family.strokeColor || this.getLineColor( ) );
			dom.setAttribute('stroke-width', family.strokeWidth || 1 );
		},

		

		hideTrackingMarker: function() {
			this.marker.setAttribute('display', 'none');
			this.markerLabel.setAttribute('display', 'none');
			this.markerLabelSquare.setAttribute('display', 'none');
		},

		
		_addPoint: function( currentLine, xpx, ypx, k, move ) {
			var pos;
			
			if(k !== 0) {
				if(this.options.lineToZero || move)
					currentLine += 'M ';
				else
					currentLine += "L ";
			}

			currentLine += xpx;
			currentLine += " ";
			currentLine += ypx;	
			currentLine += " "; 
			
			if(this.options.lineToZero && (pos = this.getYAxis().getPos(0)) !== undefined) {
				currentLine += "L ";
				currentLine += xpx;
				currentLine += " ";
				currentLine += pos;
				currentLine += " ";
			}

			if( ! this.markerPoints ) {
				return currentLine;
			}

			if( this.markersShown() && ! ( xpx > this.getXAxis().getMaxPx() || xpx < this.getXAxis().getMinPx() ) ) {

				drawMarkerXY( this.markerFamily[ this.markerCurrentFamily ], xpx, ypx );
			}
			return currentLine;
		},

		// Returns the DOM
		_createLine: function(points, i, nbPoints) {
			

			if( this.lines[ i ] ) {
				var line = this.lines[i];
			} else {
				var line = document.createElementNS(this.graph.ns, 'path');

				this.applyLineStyle( line );
			}

			if(nbPoints == 0) {
				line.setAttribute('d', 'M 0 0');
			} else {
				line.setAttribute('d', points);

			}

			if(!this.lines[i]) {			
				this.groupLines.appendChild(line);
				this.lines[i] = line;

			}
			
			return line;
		},

		applyLineStyle: function( line ) {
			line.setAttribute('stroke', this.getLineColor());
			line.setAttribute('stroke-width', this.getLineWidth() + ( this.isSelected() ? 2 : 0 ) );
			if(this.getLineDashArray())
				line.setAttribute('stroke-dasharray', this.getLineDashArray());
			line.setAttribute('fill', 'none');
		//	line.setAttribute('shape-rendering', 'optimizeSpeed');
		},

		// Revised August 2014. Ok
		getMarkerPath: function( family, add ) {

			var z = family.zoom || 1 ,
				add = add || 0,
				el;

			switch( family.type ) {
				case 1:
					el = ['m', -2, -2, 'l', 4, 0, 'l', 0, 4, 'l', -4, 0, 'z'];
				break;

				case 2:
					el = ['m', -2, -2, 'l', 4, 4, 'm', -4, 0, 'l', 4, -4 ];
				break;


				case 3:
					el = ['m', -2, 0, 'l', 4, 0, 'm', -2, -2, 'l', 0, 4 ];
				break;


				case 4:
					el = ['m', -1, -1, 'l', 2, 0, 'l', -1, 2, 'z' ];
				break;

			}


			if( ( z == 1 || ! z ) && ! add ) {
				return  el.join(" ");
			}

			var num = "number";

			if( ! el ) {
				return;
			}


			for(var i = 0, l = el.length; i < l; i++) {

				if(typeof el[i] == num) {

					el[i] *= ( z + add );
				}
			}

			return  el.join(" " );

		},

		// Revised August 2014. Ok
		getMarkerDom: function( family ) {

			var self = this;
			if( ! family.dom ) {
				var dom = document.createElementNS( this.graph.ns, 'path' );
				this.setMarkerStyleTo( dom, family );
				family.dom = dom;
				family.path = "";

				dom.addEventListener('mouseover', function(e) {
					var closest = self._getMarkerIndexFromEvent(e);
					self.onMouseOverMarker(e, closest);
				});


				dom.addEventListener('mouseout', function(e) {
					var closest = self._getMarkerIndexFromEvent(e);
					self.onMouseOutMarker(e, closest);
				});


				dom.addEventListener('click', function(e) {
					var closest = self._getMarkerIndexFromEvent(e);
					self.onClickOnMarker(e, closest);
				});

			}

			return family.dom;
		},


	
		/* */
		handleLabelMove: function(x, y) {

			var label = this.labelDragging;

			if(!label)
				return;

			label.labelX += x - label.draggingIniX;
			label.draggingIniX = x;

			label.labelY += y - label.draggingIniY;
			label.draggingIniY = y;

			label.rect.setAttribute('x', label.labelX);
			label.rect.setAttribute('y', label.labelY  - this.graph.options.fontSize);
			label.labelDom.setAttribute('x', label.labelX);
			label.labelDom.setAttribute('y', label.labelY);

			label.labelLine.setAttribute('x1', label.labelX + label.labelDom.getComputedTextLength() / 2);
			label.labelLine.setAttribute('y1', label.labelY  - this.graph.options.fontSize / 2);

		},

		handleLabelMainMove: function(x, y) {
			
			if(this.options.labelMoveFollowCurve || 1 == 1) {
				var label = this.labelDragging;
				label.x = this.getXAxis().getVal(x - this.graph.options.paddingLeft);
				
				label.y = this.handleMouseMove(label.x, false).interpolatedY;
				this.repositionLabel(label, true);
			}
		},

		handleLabelUp: function() {
			
			this.labelDragging = false;
		},


		searchIndexByPxXY: function(x,y) {

			var oldDist = false,
				xyindex = false,
				dist;

			for(var i = 0, l = this.data.length; i < l; i++) {
				for(var k = 0, m = this.data[i].length; k < m; k+=2) {

					dist = Math.pow((this.getX(this.data[i][k]) - x), 2) + Math.pow((this.getY(this.data[i][k + 1]) - y), 2);
					//console.log(x, y, dist, this.data[i][k], this.data[i][k + 1]);
					if(!oldDist || dist < oldDist) {
						oldDist = dist;
						xyindex = [k / 2, i];
					}
				}
			}

			return xyindex;
		},


		searchClosestValue: function(valX) {

			var xMinIndex;

			for(var i = 0; i < this.data.length; i++) {

				if((valX <= this.data[i][this.data[i].length - 2] && valX > this.data[i][0])) {
					xMinIndex = this._searchBinary(valX, this.data[i], false);
				} else if((valX >= this.data[i][this.data[i].length - 2] && valX < this.data[i][0])) {
					xMinIndex = this._searchBinary(valX, this.data[i], true);
				} else 
					continue;
			

				return {
					dataIndex: i,
					xMin: this.data[i][xMinIndex],
					xMax: this.data[i][xMinIndex + 2],
					yMin: this.data[i][xMinIndex + 1],
					yMax: this.data[i][xMinIndex + 3],

					xBeforeIndex: xMinIndex / 2,
					xAfterIndex: xMinIndex / 2 + 2,
					xBeforeIndexArr: xMinIndex
				}	
			}
		},


		handleMouseMove: function(x, doMarker) {

			
			var valX = x || this.getXAxis().getMouseVal(),
				xMinIndex, 
				xMin, 
				yMin, 
				xMax, 
				yMax;
 			
 			var value = this.searchClosestValue(valX);


 			if(!value)
 				return;

			var ratio = (valX - value.xMin) / (value.xMax - value.xMin);
			var intY = ((1 - ratio) * value.yMin + ratio * value.yMax);

			if(doMarker && this.options.trackMouse) {

				if( value.xMin == undefined ) {

					return false;

				} else {
					
					var x = this.getX(this.getFlip() ? intY : valX);
					var y = this.getY(this.getFlip() ? valX : intY);

					this.marker.setAttribute('display', 'block');
					this.marker.setAttribute('cx', x);
					this.marker.setAttribute('cy', y);

					this.markerLabel.setAttribute('display', 'block');
					this.markerLabelSquare.setAttribute('display', 'block');
					switch(this.options.trackMouseLabel) {
						case false:
						break;

						default:
							this.markerLabel.textContent = this.options.trackMouseLabel
																.replace('<x>', valX.toFixed(this.options.trackMouseLabelRouding))
																.replace('<y>', intY.toFixed(this.options.trackMouseLabelRouding));
						break;
					}

					this.markerLabel.setAttribute('x', x + 5);
					this.markerLabel.setAttribute('y', y - 5);

					this.markerLabelSquare.setAttribute('x', x + 5);
					this.markerLabelSquare.setAttribute('y', y - 5 - this.graph.options.fontSize);
					this.markerLabelSquare.setAttribute('width', this.markerLabel.getComputedTextLength() + 2);
					this.markerLabelSquare.setAttribute('height', this.graph.options.fontSize + 2);
				}
			}

			return {
				xBefore: value.xMin,
				xAfter: value.xMax,
				yBefore: value.yMin,
				yAfter: value.yMax,
				trueX: valX,
				interpolatedY: intY,
				xBeforeIndex: value.xBeforeIndex
			};
		},

		_searchBinary: function(target, haystack, reverse) {
			var seedA = 0,
				length = haystack.length,
				seedB = (length - 2);

			if(haystack[seedA] == target)
				return seedA;

			if(haystack[seedB] == target)
				return seedB;

			var seedInt;
			var i = 0;
			
			while(true) {
				i++;
				if(i > 100)
					throw "Error loop";

				seedInt = (seedA + seedB) / 2;
				seedInt -= seedInt % 2; // Always looks for an x.

				if(seedInt == seedA || haystack[seedInt] == target)
					return seedInt;

		//		console.log(seedA, seedB, seedInt, haystack[seedInt]);
				if(haystack[seedInt] <= target) {
					if(reverse)
						seedB = seedInt;
					else
						seedA = seedInt;
				} else if(haystack[seedInt] > target) {
					if(reverse)
						seedA = seedInt;
					else
						seedB = seedInt;
				}
			}
		},

		getMax: function(start, end) {

			var start2 = Math.min(start, end),
				end2 = Math.max(start, end),
				v1 = this.searchClosestValue(start2),
				v2 = this.searchClosestValue(end2),
				i, j, max = 0, initJ, maxJ;

			for(i = v1.dataIndex; i <= v2.dataIndex ; i++) {
				initJ = i == v1.dataIndex ? v1.xBeforeIndexArr : 0;
				maxJ = i == v2.dataIndex ? v2.xBeforeIndexArr : this.data[i].length;
				for(j = initJ; j <= maxJ; j+=2) {
					max = Math.max(max, this.data[i][j + 1]);
				}
			}

			return max;
		},


		/* LINE STYLE */

		setLineStyle: function(number) {
			this.options.lineStyle = number;
		},

		getLineStyle: function() {
			return this.options.lineStyle;
		},

		getLineDashArray: function() {


			switch(this.options.lineStyle) {
				
				case 2: return "1, 1"; break;
				case 3: return "2, 2"; break;
				case 3: return "3, 3"; break;
				case 4: return "4, 4"; break;
				case 5: return "5, 5"; break;

				case 6: return "5 2"; break
				case 7: return "2 5"; break

				case 8: return "4 2 4 4"; break;
				case 9: return "1,3,1"; break;
				case 10: return "9 2"; break;
				case 11: return "2 9"; break;

				case false:
				case 1:
					return false;
				break;

				default:
					return this.options.lineStyle;
				break;
			}
		},


		/*  */




		setLineWidth: function(width) {
			this.options.lineWidth = width;
			return this;
		},

		getLineWidth: function() {
			return this.options.lineWidth;
		},


		/* LINE COLOR */

		setLineColor: function(color) {
			this.options.lineColor = color;
			return this;
		},

		getLineColor: function() {
			return this.options.lineColor;
		},

		/* */



		/* MARKERS */

		showMarkers: function( skipRedraw ) {
			this.options.markers = true;

			if(!skipRedraw && this._drawn) {
				this.draw();
			}

			return this;
		},

		hideMarkers: function( skipRedraw ) {
			this.options.markers = false;

			if( ! skipRedraw && this._drawn ) {
				this.draw();
			}

			return this;
		},

		markersShown: function() {
			return this.options.markers;	
		},
/*
		setMarkerType: function(type, skipRedraw) {
			this.options.markers.type = type;
			
			if(!skipRedraw && this._drawn) {
				this.draw();
			}

			return this;
		},

		setMarkerZoom: function(zoom, skipRedraw) {
			this.options.markers.zoom = zoom;

			if(!skipRedraw && this._drawn) {
				this.draw();
			}

			return this;
		},

		setMarkerStrokeColor: function(color, skipRedraw) {
			this.options.markers.strokeColor = color;

			if(!skipRedraw && this._drawn)
				this.draw();
		},

		setMarkerStrokeWidth: function(width, skipRedraw) {
			this.options.markers.strokeWidth = width;

			if(!skipRedraw && this._drawn)
				this.draw();
		},

		setMarkerFillColor: function(color, skipRedraw) {
			this.options.markers.fillColor = color;

			if(!skipRedraw && this._drawn)
				this.draw();
		},
*/
		// Multiple markers
		setMarkers: function( family ) {
			// Family has to be an object
			// Family looks like
			/*
				{
					type: 1,
					zoom: 1,
					strokeWidth: 1,
					strokeColor: ''
					fillColor: '',
				}
			*/

			this.showMarkers( true );

			if( ! family ) {

				family = [ {
					type: 1,
					zoom: 1,
					points: 'all'
				} ]

			}
			var markerPoints = [];

			markerPoints.push( [ 0, Infinity, null ] );

			for( var i = 0, k = family.length; i < k ; i ++ ) {

				this.getMarkerDom( family[ i ] );
				family[ i ].markerPath = this.getMarkerPath( family[ i ] );

				if( ! family[ i ].points ) {
					continue;
				}

				if( ! Array.isArray( family[ i ].points ) ) {
					family[ i ].points = [ family[ i ].points ];
				}


				for( var j = 0, l = family[ i ].points.length ; j < l ; j ++ ) {

					if( family[ i ].points[ j ] == 'all' ) {

						markerPoints.push( [ 0, Infinity, i ] );

					} else if ( ! Array.isArray( family[ i ].points[ j ] ) ) {

						markerPoints.push( [ family[ i ].points[ j ], family[ i ].points[ j ], i ] );
						//markerPoints.push( [ family[ i ].points[ j ] + 1, null ] );
					} else {

						markerPoints.push( [ family[ i ].points[ j ][ 0 ], family[ i ].points[ j ][ 1 ], i ] );
						
					}
				}
			}

			this.markerFamily = family;

			// Let's sort if by the first index.
			markerPoints.sort( function( a, b ) { 
				return ( a[ 0 ] -  b[ 0 ] ) || ( a[ 2 ] == null ? -1 : 1 );
			} );

			// OK now let's handle clashes

/*			for( var i = 0, l = markerPoints.length ; i < l ; i ++ ) {

				// No clash
				if( markerPoints[ i ][ 1 ] < markerPoints[ i + 1 ][ 1 ] ) {
					continue;
				}

				var restartAt = markerPoints[ i + 1 ][ 1 ] + 1;
				markerPoints[ i ][ 1 ] = markerPoints[ i + 1 ][ 0 ];

				var j = i;

				while( markerPoints[ j ][ 1 ] < restartAt ) {
					j++;
				}

				markerPoints.splice( j, 0, [ restartAt, ])


			}
*/
			this.markerPoints = markerPoints;
		},

	

		addLabelX: function(x, label) {
			this.addLabelObj({
				x: x,
				label: label
			});
		},

		addLabel: function(x, y, label) {
			this.addLabelObj({
				x: x,
				y: y,
				label: label
			});
		},

		repositionLabel: function(label, recalculateLabel) {
			var x = !this.getFlip() ? this.getX(label.x) : this.getY(label.x),
				y = !this.getFlip() ? this.getY(label.y) : this.getX(label.y);
				
			var nan = (isNaN(x) || isNaN(y));
			label.group.setAttribute('display', nan ? 'none' : 'block');

			if(recalculateLabel) {
				label.labelDom.textContent = this.options.label
										.replace('<x>', label.x.toFixed(this.options.trackMouseLabelRouding) || '')
										.replace('<label>', label.label || '');

				label.rect.setAttribute('width', label.labelDom.getComputedTextLength() + 2);
			}
			if(nan)
				return;
			label.group.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
		},

		addLabelObj: function(label) {
			var self = this, group, labelDom, rect, path;

			this.labels.push(label);
			if(label.x && !label.y) {
				label.y = this.handleMouseMove(label.x, false).interpolatedY;
			}


			
			group = document.createElementNS(this.graph.ns, 'g');
			this.groupLabels.appendChild(group);
			
			labelDom = document.createElementNS(this.graph.ns, 'text');
			labelDom.setAttribute('x', 5);
			labelDom.setAttribute('y', -5);
			

			var labelLine = document.createElementNS(this.graph.ns, 'line');
			labelLine.setAttribute('stroke', 'black');
			labelLine.setAttribute('x2', 0);
			labelLine.setAttribute('x1', 0);


			group.appendChild(labelLine);
			group.appendChild(labelDom);
			rect = document.createElementNS(this.graph.ns, 'rect');
			rect.setAttribute('x', 5);
			rect.setAttribute('y', -this.graph.options.fontSize - 5);
			rect.setAttribute('width', labelDom.getComputedTextLength() + 2);
			rect.setAttribute('height', this.graph.options.fontSize + 2);
			rect.setAttribute('fill', 'white');
			rect.style.cursor = 'move';
			labelDom.style.cursor = 'move';

			
			path = document.createElementNS(this.graph.ns, 'path');
			path.setAttribute('d', 'M 0 -4 l 0 8 m -4 -4 l 8 0');
			path.setAttribute('stroke-width', '1px');
			path.setAttribute('stroke', 'black');



			path.style.cursor = 'move';

			group.insertBefore(rect, labelDom);

			group.appendChild(path);

			label.labelLine = labelLine;
			label.group = group;
			label.rect = rect;
			label.labelDom = labelDom;
			label.path = path;

			label.labelY = -5;
			label.labelX = 5;

			this.bindLabelHandlers(label);
			this.repositionLabel(label, true);
		},

		bindLabelHandlers: function(label) {
			var self = this;

			function clickHandler(e) {

				if(self.graph.currentAction !== false) {
					return;
				}
				
				self.graph.currentAction = 'labelDragging';
				e.stopPropagation();
				label.dragging = true;

				var coords = self.graph._getXY(e);
				label.draggingIniX = coords.x;
				label.draggingIniY = coords.y;
				self.labelDragging = label;
			}

			function clickHandlerMain(e) {

				if(self.graph.currentAction !== false) {
					return;
				}
				e.stopPropagation();
				e.preventDefault();
				self.graph.currentAction = 'labelDraggingMain';
				self.labelDragging = label;
			}


			label.labelDom.addEventListener('mousedown', clickHandler);
			label.rect.addEventListener('mousedown', clickHandler);
			label.rect.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});

			label.labelDom.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});

			label.path.addEventListener('mousedown', clickHandlerMain);
			label.path.addEventListener('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
		},

		getMarkerForLegend: function() {

			if( ! this.markerPoints ) {
				return;
			}

			if( ! this.markerForLegend ) {

				var marker = document.createElementNS( this.graph.ns, 'path');
				this.setMarkerStyleTo( marker , this.markerFamily[ 0 ] );
				
				marker.setAttribute('d', "M 14 0 " + this.getMarkerPath( this.markerFamily[ 0 ] ) );

				this.markerForLegend = marker;
			}

			return this.markerForLegend;
		},

		eraseMarkers: function() {

			for( var i in this.markerFamily ) {
				this.markerFamily[ i ].path = "";
			}
		},


		XIsMonotoneous: function() {
			this.xmonotoneous = true;
			return this;
		}
	} );

	function drawMarkerXY( family, x, y ) {

		if( ! family ) {
			return;
		}

		family.path = family.path || "";
		family.path += 'M ' + x + ' ' + y + ' ';


		family.path += family.markerPath + ' ';
	}

	function getDegradedData( graph ) { // Serie redrawing


		var self = graph,
			xpx, 
			ypx, 
			xpx2,
			ypx2,
			i = 0, 
			l = graph.data.length, 
			j = 0, 
			k, 
			m,
			degradationMin, degradationMax, degradationNb, degradationValue, degradation, degradationMinMax = [],
			incrXFlip = 0, incrYFlip = 1,
			degradeFirstX, degradeFirstXPx,
			optimizeMonotoneous = graph.isXMonotoneous(), optimizeMaxPxX = graph.getXAxis().getMaxPx(), optimizeBreak, buffer;

	
		if( graph.isFlipped( ) ) {
			incrXFlip = 1;
			incrYFlip = 0;
		}


		var datas = [];
		var xData = [],
			dataY = [],
			sum = 0;

		if( graph.mode == 'x_equally_separated' ) {

			if( graph.isFlipped( ) ) {
				return [ graph.data, graph.xData ];
			}


			dataY = [];

			for( ; i < l ; i ++ ) {
				
				j = 0, k = 0, m = graph.data[ i ].length;

				var delta = Math.round( graph.degradationPx / graph.getXAxis().getRelPx( graph.xData[ i ].dx ) );

				if( delta == 1 ) {
					xData.push( graph.xData[ i ] );
					datas.push( graph.data[ i ] );
				}

				degradationMin = Infinity;
				degradationMax = - Infinity;


				for( ; j < m ; j += 1 ) {

					if( graph.markerPoints ) {

						graph.getMarkerCurrentFamily( k );	
					}


					
					xpx = graph.xData[ i ].x + j * graph.xData[ i ].dx;


					if( optimizeMonotoneous && xpx < 0 ) {
						buffer = [ xpx, ypx, graph.data[ i ][ j ] ];
						continue;
					}

					if( optimizeMonotoneous && buffer ) {

						sum += buffer[ 2 ];
						degradationMin = Math.min( degradationMin, buffer[ 2 ] );
						degradationMax = Math.max( degradationMax, buffer[ 2 ] );

						buffer = false;
						k++;
					}

					sum += graph.data[ i ][ j ];
					degradationMin = Math.min( degradationMin, graph.data[ i ][ j ] );
					degradationMax = Math.max( degradationMax, graph.data[ i ][ j ] );



					if( ( j % delta == 0 && j > 0 ) || optimizeBreak ) {

						dataY.push( sum / delta );

						degradationMinMax.push( ( graph.xData[ i ].x + j * graph.xData[ i ].dx - ( delta / 2 ) * graph.xData[ i ].dx ), degradationMin, degradationMax );

						degradationMin = Infinity;
						degradationMax = - Infinity;

						
						sum = 0;
					}

					if( optimizeMonotoneous && xpx > optimizeMaxPxX ) {
						optimizeBreak = true;
						break;
					}
					
					k++;
				}

				datas.push( dataY );
				xData.push( { dx: delta * graph.xData[ i ].dx, x: graph.xData[ i ].x + ( delta * graph.xData[ i ].dx / 2 ) });
			}


			if( graph.degradationSerie ) {
				graph.degradationSerie.setData( degradationMinMax );
				graph.degradationSerie.draw();
			}

			return [ datas, xData ] 

		}


		for(; i < l ; i++) {
			
			j = 0,
			k = 0,
			m = graph.data[ i ].length;

			
			degradationNb = 0;
			degradationValue = 0;

			degradationMin = Infinity;
			degradationMax = - Infinity;

			var data = [];

			for( ; j < m ; j += 2 ) {

				xpx2 = graph.getX( graph.data[ i ][ j + incrXFlip ] );

				if( optimizeMonotoneous && xpx2 < 0 ) {

					buffer = [
						xpx2,
						graph.getY( graph.data[ i ][ j + incrYFlip ] ),
						graph.data[ i ][ j + incrXFlip ],
						graph.data[ i ][ j + incrYFlip ]
					];

					continue;
				}

				if( optimizeMonotoneous && buffer) {

					degradationValue += buffer[ 3 ];
					degradationNb ++;

					degradationMin = Math.min( degradationMin, buffer[ 3 ] );
					degradationMax = Math.max( degradationMax, buffer[ 3 ] );

					degradeFirstX = buffer[ 2 ];
					degradeFirstXPx = buffer[ 0 ];

					buffer = false;
					k++;


				} else if( degradeFirstX === undefined ) {

					degradeFirstX = graph.data[ i ][ j + incrXFlip ];
					degradeFirstXPx = xpx2;
				}
				

				if( xpx2 - degradeFirstXPx > graph.degradationPx && j < m ) {


					data.push( 
						( degradeFirstX + graph.data[ i ][ j + incrXFlip ] ) / 2,
						degradationValue / degradationNb
					);

					degradationMinMax.push( ( graph.data[ i ][ j + incrXFlip ] + degradeFirstX ) / 2, degradationMin, degradationMax );


					if( degradeFirstXPx > optimizeMaxPxX ) {
						break;
					}

					degradeFirstX = undefined;
					degradationNb = 0;
					degradationValue = 0;
					degradationMin = Infinity;
					degradationMax = - Infinity;

					k++;
				} 

				degradationValue += graph.data[ i ][ j + incrYFlip ];
				degradationNb ++;

				degradationMin = Math.min( degradationMin, graph.data[ i ][ j + incrYFlip ] );
				degradationMax = Math.max( degradationMax, graph.data[ i ][ j + incrYFlip ] );


				if( optimizeMonotoneous && xpx2 > optimizeMaxPxX ) {
					optimizeBreak = true;
				}
			
				
				xpx = xpx2;
				ypx = ypx2;

			}
			
			datas.push( data );

			if( optimizeBreak ) {
				break;
			}
		}


		if( graph.degradationSerie ) {
			graph.degradationSerie.setData( degradationMinMax );
			graph.degradationSerie.draw();
		}

		return [ datas ];


	};


	function makePeakPicking( graph, allY ) {
			
		var self = graph;

		$.when.apply( $, graph.picksDef ).then( function() {

			var x,
				px,
				passed = [],
				px,
				i = 0,
				l = allY.length,
				k, m, y;
			
			allY.sort(function(a, b) {
				return b[0] - a[0];
			});

			for( ; i < l ; i ++ ) {

				x = allY[i][1],
				px = self.getX(x),
				k = 0, m = passed.length,
				y = self.getY(allY[i][0]);

				if( px < self.getXAxis().getMinPx() || px > self.getXAxis().getMaxPx() ) {
					continue;
				}

				if( y > self.getYAxis().getMinPx() || y < self.getYAxis().getMaxPx() ) {
					continue;
				}

				for( ; k < m ; k++) {
					if(Math.abs(passed[k] - px) < self.options.autoPeakPickingMinDistance) {
						break;
					}
				}

				if(k < m) {
					continue;
				}

				if( ! self.picks[ m ] ) {
					return;
				}



				self.picks[ m ].set('labelPosition', { 
														x: x,
				 										dy: "-10px"
				 									}
				 				);

				self.picks[ m ].data.label[ 0 ].text = String( Math.round( x * 1000 ) / 1000 );
				passed.push( px );

				if(passed.length == self.options.autoPeakPickingNb) {
					break;
				}
			}

			self.graph.redrawShapes();

		});
	}

	function insertMarkers( graph ) {

		if( ! graph.markerFamily ) {
			return;
		}

		for( var i = 0, l = graph.markerFamily.length; i < l; i ++ ) {
			graph.markerFamily[ i ].dom.setAttribute( 'd', graph.markerFamily[ i ].path );
			graph.groupMain.appendChild( graph.markerFamily[ i ].dom );
		}
	}


	return GraphSerie;
});