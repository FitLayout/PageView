<template>
  <div class="page-zoom" :style="zoomStyle">
	<div class="page-view" :style="pageStyle">
		<div v-if="dataurl && screenshot" class="image">
			<img :src="dataurl" alt="screenshot">
		</div>
		<!-- funguje aj klikat aj vyberat ale robi tam chyby a ziskavanie suradnic nejde spravne -->
		<!-- <div id="mouseDragView" v-on:mousedown="divCreator" v-on:mouseup="divUp" v-on:mousemove="divMover" v-on:mouseleave="divLeave">					
			<div :class="boxesClass" ref="boxes">

			</div>	
		</div> -->
		<!-- nefunguje klikanie ked je zapnuty vyber -->
		<div id="mouseDragView" v-on:mousedown="divCreator" v-on:mouseup="divUp" v-on:mousemove="divMover" v-on:mouseleave="divLeave">					

		</div>
		<div :class="boxesClass" ref="boxes">

		</div>	
	</div>
  </div>
</template>

<script>
import {stringColor, stringsGradient} from '@/common/utils.js';

export default {
	name: 'Page',
	props: {
		pageModel: null,
		rectangles: null,
		selectedRect: null,
		zoom: null,
		screenshot: null,
		outlines: null,
		rectSelection: null,
		showTags: null
	},
	data () {
		return {
			page: null,
			dataurl: null,
			pageStyle: '',
			zoomStyle: '',
			boxIndex: null,
			lastSelectedRect: null,

			//used for selecting div
			selectDiv: null,
			startX: 0,
			startY: 0,
			moveX: 0,
			moveY: 0,
			endX: 0,
			endY: 0,
			startBorderX: 0, //relative to page view
			startBorderY: 0, //relative to page view
			endBorderX: 0, //relative to page view
			endBorderY: 0, //relative to page view
			//used for selected area div
			borderDiv: null,
			//TODO zmenit hodnoty na nieco rozumnejsie
			topBorderDiv: 2000,
			leftBorderDiv: 2000,
			heightBorderDiv: 0,
			widthBorderDiv: 0
		}
	},
	computed: {
		boxesClass() {
			let cls = 'boxes';
			if (this.outlines) {
				cls += ' outlines';
			}
			return cls;
		}
	},
	created () {
		this.render();
	},
	watch: {
		pageModel: 'render',
		screenshot: 'render',
		rectangles: 'render',
		rectSelection: 'render',
		showTags: 'render',
		zoom: 'updateZoom',
		selectedRect: 'highlightSelectedRect'
	},
	methods: {
		render() {
			this.page = this.pageModel;
			// read page size
			if (this.page !== null) {
				this.pageStyle = `width:${this.page.width}px;height:${this.page.height}px`;
			}
			// decode the screenshot
			if (this.screenshot && this.page !== null && this.page.pngImage !== undefined) {
				const imgData = this.page.pngImage;
				this.dataurl = 'data:image/png;base64,' + imgData;
			} else {
				this.dataurl = null;
			}
			//console.log(this.$refs);
			if (this.$refs.boxes !== undefined) { // the rendering area is ready
				this.$refs.boxes.innerHTML = ''; // clear old boxes
				this.boxIndex = {};
				const isPage = (this.rectangles === this.page.rectAreas); // are we drawing the page only?
				if (this.page !== null && !this.dataurl) { // no screenshot is shown - we should draw the contents
					//console.log('DRAWING base ' + isPage);
					this.renderBoxes(this.page.rectAreas, this.$refs.boxes, true, isPage); // always use the boxes
				}
				if ((!isPage || this.dataurl) && this.rectangles != null) { //not a page or used a screenshot, add the active rectangles separately
					//console.log('DRAWING overlay');
					this.renderBoxes(this.rectangles, this.$refs.boxes, false, true);
				}
			}
		},

		/**
		 * Creates a DOM representing the boxes or areas.
		 * @param boxList the list of rectangles (boxes or visual areas)
		 * @param target the target element to append the DOM to
		 * @param showContents when set to true, the complete contents are rendered (for boxes only). Otherwise,
		 * only the bounds are rendered.
		 * @param active make the boxes active (hover, clickable)
		 */
		renderBoxes(boxList, target, showContents, active) {
			//let shadow = target.attachShadow({mode: 'open'});
			const shadow = target;
			for (let box of boxList) {
				let el = document.createElement('div');
				shadow.appendChild(el);
				el.srcBox = box;
				if (active) {
					el.setAttribute('class', 'box a');
				    el.setAttribute('id', 'fl-abox-' + box.documentOrder);
				    this.boxIndex[box._iri] = el;
				} else {
					el.setAttribute('class', 'box');
				    el.setAttribute('id', 'fl-box-' + box.documentOrder);
				}
				el.style.left = box.bounds.positionX + 'px';
				el.style.top = box.bounds.positionY + 'px';
				el.style.width = box.bounds.width + 'px';
				el.style.height = box.bounds.height + 'px';

				if (showContents) {
					const cont = this.renderContents(box);
					el.appendChild(cont);
				}

				if (active) {
					// colorize tags if any
					if (this.showTags && box.hasTag) {
						if (box.hasTag.length === 1) {
							let tagName = box.hasTag[0].name;
							el.style.backgroundColor = stringColor(tagName);
						} else if (box.hasTag.length > 1) {
							let tagNames = [];
							for (let i = 0; i < box.hasTag.length; i++) {
								tagNames.push(box.hasTag[i].name);
							}
							el.style.backgroundImage = stringsGradient(tagNames);
						}
					}

					// onclick
					let thisObj = this;
					el.onclick = function(event) {
						if (thisObj.rectSelection) {
							event.currentTarget.classList.toggle('selected');
						}
						thisObj.selectBox(box);
					};

					//visual bounds inside
					let vel = document.createElement('div');
					vel.setAttribute('class', 'vbox');
					vel.style.left = (box.visualX - box.positionX) + 'px';
					vel.style.top = (box.visualY - box.positionY) + 'px';
					vel.style.width = box.visualWidth + 'px';
					vel.style.height = box.visualHeight + 'px';
					el.appendChild(vel);
				}
			}
		},

		renderContents(box) {
			let el = document.createElement('span');
			el.setAttribute('class', 'c');
			if (box.text) {
				const text = document.createTextNode(box.text);
				el.appendChild(text);
			}
			let style = `font-family:'${box.fontFamily}',sans-serif;font-size:${box.fontSize}px`;
			if (box.fontWeight >= 0.5) {
				style += ';font-weight:bold';
			}
			if (box.fontStyle >= 0.5) {
				style += ';font-style:italic';
			}
			let decor = '';
			if (box.underline >= 0.5) {
				decor += 'underline';
			}
			if (box.lineThrough >= 0.5) {
				decor += ' line-through';
			}
			if (decor.length > 0) {
				style += ';text-decoration:' + decor;
			}
			if (box.color) {
				style += ';color:' + box.color;
			}
			if (box.backgroundColor) {
				style += ';background-color:' + box.backgroundColor;
			}
			if (box.hasTopBorder) {
				style += ';' + this.borderStyle(box.hasTopBorder, 'top');
			}
			if (box.hasRightBorder) {
				style += ';' + this.borderStyle(box.hasRightBorder, 'right');
			}
			if (box.hasBottomBorder) {
				style += ';' + this.borderStyle(box.hasBottomBorder, 'bottom');
			}
			if (box.hasLeftBorder) {
				style += ';' + this.borderStyle(box.hasLeftBorder, 'left');
			}
			if (box.containsImage && box.containsImage.length > 0) {
				for (let i = 0; i < box.containsImage.length; i++) {
					if (box.containsImage[i].imageData) {
						el.appendChild(this.createImage(box.containsImage[i]));
					}
				}
			}
			el.setAttribute('style', style);

			return el;
		},

		borderStyle(border, side) {
			return `border-${side}:${border.borderWidth}px ${border.borderStyle} ${border.borderColor}`;
		},

		createImage(img) {
			let el = document.createElement('img');
			el.setAttribute('class', 'c');
			el.setAttribute('src', 'data:image/png;base64,' + img.imageData);
			return el;
		},

		selectBox(box) {
			console.log('emit');
			this.$emit('rect-selected', box);
		},

		updateZoom() {
			const ratio = this.zoom / 100.0;
			this.zoomStyle = `transform:scale(${ratio})`;
		},

		highlightSelectedRect() {
			if (this.lastSelectedRect) {
				let lastElem = this.boxIndex[this.lastSelectedRect._iri];
				if (lastElem) {
					lastElem.classList.remove('focus');
				}
			}
			if (this.selectedRect) {
				let newElem = this.boxIndex[this.selectedRect._iri];
				if (newElem) {
					newElem.classList.add('focus');
				}
			}
			this.lastSelectedRect = this.selectedRect;
		},

		
		//create div and get its starging position
		divCreator(event) { 

			//remove div of selected boxes
			let el = document.getElementById('divBorder');
			if (el != null) {
				el.remove();
			}
			// set default values for border div 
			this.topBorderDiv = 2000;
			this.leftBorderDiv = 2000;
			this.heightBorderDiv = 0;
			this.widthBorderDiv =  0;


			//create div for selection of boxes with mouse drag
			this.selectDiv = document.createElement('div');
			this.selectDiv.setAttribute('id', 'divSelector');
			document.documentElement.appendChild(this.selectDiv);
			this.startX = event.clientX;
			this.startY = event.clientY;
			this.startBorderX = event.offsetX; 
    			this.startBorderY = event.offsetY; 
			let divStyle = 'position:absolute;' + 'z-index:2;' + 'top:'+ this.startY + 'px;' + 'left:'+ this.startX +'px;' + 'height:0px;' + 'width:0px;' + 'background:rgba(100,100,255,0.2);' + 'outline: 1px solid rgb(100,100,255)';
			this.selectDiv.setAttribute('style', divStyle);

			//variable to let know mover to be used
			this.canMove = true;
		},

		//on mouse move compute new position of div
		divMover(event) {
			if (this.canMove) {
				this.moveX = event.clientX;
				this.moveY = event.clientY;
				this.selectDiv.style.width= (this.moveX - this.startX) + 'px';
				this.selectDiv.style.height= (this.moveY - this.startY) + 'px';
			}
		},

		//on mouse up choose boxes in selection and remove selector div
		divUp(event) {
			//remove selection div 
			let el = document.getElementById('divSelector');
			if (el != null) {
				el.remove();
			}

			//variable to let know mover to not be used
			this.canMove = false;

			//calculate on mouse up position
			this.endX = event.clientX;
                	this.endY = event.clientY;
			this.endBorderX = event.offsetX;
                	this.endBorderY = event.offsetY;		

			console.log("StartX:" + this.startBorderX);
			console.log("StartY:" + this.startBorderY);
			console.log("EndX:" + this.endBorderX);
			console.log("EndY:" + this.endBorderY);

			console.log(this.page.rectAreas);
			var boxes = this.page.rectAreas;
			boxes.forEach(box => {
				// console.log(box.bounds.positionX);	
				// console.log(box.bounds.positionY);
				// console.log(box.bounds.width);
				// console.log(box.bounds.height);
				if (box.bounds.positionX > this.startBorderX && box.bounds.positionY > this.startBorderY && (box.bounds.height + box.bounds.positionY) < this.endBorderY && (box.bounds.width + box.bounds.positionX) < this.endBorderX) {
					//write out selected boxes to console
					console.log(box);

					//set border div size
					if (box.bounds.positionX < this.leftBorderDiv) {
						this.leftBorderDiv = box.bounds.positionX;
					}
					if (box.bounds.positionY < this.topBorderDiv) {
						this.topBorderDiv = box.bounds.positionY;
					}
					if ((box.bounds.height + box.bounds.positionY - this.topBorderDiv) > this.heightBorderDiv) {
						this.heightBorderDiv =  box.bounds.height + box.bounds.positionY - this.topBorderDiv;
					}
					if ((box.bounds.width + box.bounds.positionX - this.leftBorderDiv) > this.widthBorderDiv) {
						this.widthBorderDiv = box.bounds.width + box.bounds.positionX - this.leftBorderDiv;
					}		
				}
			});

			// // console.log(this.$refs.boxes);
			// var children = this.$refs.boxes.children;
			// for (var i = 0; i < children.length; i++) {
  			// 	var box = children[i];
			// 	//choose boxes in selection
			// 	if (box.offsetLeft > this.startBorderX && box.offsetTop > this.startBorderY && (box.clientHeight + box.offsetTop) < this.endBorderY && (box.clientWidth + box.offsetLeft) < this.endBorderX) {
			// 		//write out selected boxes to console
			// 		console.log(box);

			// 		//set border div size
			// 		if (box.offsetLeft < this.leftBorderDiv) {
			// 			this.leftBorderDiv = box.offsetLeft;
			// 		}
			// 		if (box.offsetTop < this.topBorderDiv) {
			// 			this.topBorderDiv = box.offsetTop;
			// 		}
			// 		if (box.offsetTop > this.heightBorderDiv) {
			// 			this.heightBorderDiv =  box.clientHeight + box.offsetTop - this.topBorderDiv;
			// 		}
			// 		if (box.clientWidth > this.widthBorderDiv) {
			// 			this.widthBorderDiv = box.clientWidth + box.offsetLeft - this.leftBorderDiv;
			// 		}		
			// 	}
			// }

			//create border div that will be removed on click
			this.borderDiv = document.createElement('div');
			this.$refs.boxes.appendChild(this.borderDiv);
			this.borderDiv.setAttribute('id', 'divBorder');
			// document.documentElement.appendChild(this.borderDiv);
			let divStyle = 'position:absolute;' + 'z-index:1;' + 'top:'+ this.topBorderDiv + 'px;' + 'left:'+ this.leftBorderDiv +'px;' + 'height:' + this.heightBorderDiv + 'px;' + 'width:' + this.widthBorderDiv + 'px;' + 'background:rgba(100,100,255,0.2);' + 'outline: 1px solid rgb(100,100,255)';
			this.borderDiv.setAttribute('style', divStyle);		

			// //create border div that will be removed on click
			// this.borderDiv = document.createElement('div');
			// this.borderDiv.setAttribute('id', 'divBorder');
			// document.documentElement.appendChild(this.borderDiv);
			// let divStyle = 'position:static;' + 'z-index:1;' + 'top:'+ this.topBorderDiv + 'px;' + 'left:'+ this.leftBorderDiv +'px;' + 'height:' + this.heightBorderDiv + 'px;' + 'width:' + this.widthBorderDiv + 'px;' + 'background:rgba(100,100,255,0.2);' + 'outline: 1px solid rgb(100,100,255)';
			// this.borderDiv.setAttribute('style', divStyle);

			// TODOs:
			// PROBLEM kde umiestnit vyberaci div aby islo robit aj ostatne veci ale zaroven islo vyberat bez problemov?
			// PROBLEM pred prvym kliknutim to hadze chyby pri move
			// 1. prejst vsetky divy a overit ktore sa nachadzaju v rozsahu
			// 2. vlozit ich do noveho pola boxov v rozsahu
			// 3. z tohto pola vybrat najlavsie, najhornejsie, najpravsie a najspodnejsie
			// 4. zistit ako pristupovat k bounds parametrom
			// 5. tieto pridat do noveho pola a vypisat do konzole
		},

		//on mouse leave from pageview div remove selector div
		divLeave() {
			//remove div 
			let el = document.getElementById('divSelector');
			if (el != null) {
				el.remove();
			}

			//variable to let know mover to not be used
			this.canMove = false;
		}
	}
}
</script>
<style>
.page-zoom {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	transform-origin: top left;
}
.page-view {
	overflow: hidden;
	position: relative;
}
.page-view .boxes {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
}
.page-view .box, .page-view .vbox {
	position: absolute;
}
.page-view .box.focus {
	outline: 2px solid var(--primary-color) !important;
	background-color: rgba(255, 200, 200, 0.3);
}
.page-view .box.selected {
	outline: 1px solid red;
}
.page-view .box.selected .vbox {
	outline: 1px solid green;
}
.page-view .box.a:hover {
	/*outline: 1px solid red;*/
	background-color: rgba(200, 200, 255, 0.3);
}
.page-view .box.a:hover .vbox {
	background-color: rgba(255, 200, 255, 0.3);
}
.outlines .box {
	outline: 1px dashed lightgreen;
}
.outlines .box.selected {
	outline: 1px solid red;
}
.page-view .box .c {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	white-space: pre;
}

#mouseDragView {
    /* background-color: rgba(238, 91, 6, 0.6); */
    background-color: transparent;
    z-index:1000;
    position: absolute; 
    width: auto;
    height: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
</style>
