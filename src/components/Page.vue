<template>
  <div class="page-zoom" :style="zoomStyle">
	<div class="page-view" :style="pageStyle">
		<div v-if="dataurl && screenshot" class="image">
			<img :src="dataurl" alt="screenshot">
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
			lastSelectedRect: null
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
			if (this.page !== null && this.page.pngImage !== undefined) {
				const imgData = this.page.pngImage;
				this.dataurl = 'data:image/png;base64,' + imgData;
			} else {
				this.dataurl = null;
			}
			//console.log(this.$refs);
			if (this.$refs.boxes !== undefined && this.rectangles != null) {
				this.renderBoxes(this.rectangles, this.$refs.boxes);
			}
		},

		renderBoxes(boxList, target) {
			//let shadow = target.attachShadow({mode: 'open'});
			const shadow = target;
			shadow.innerHTML = '';
			this.boxIndex = {};
			for (let box of boxList) {
				let el = document.createElement('div');
				shadow.appendChild(el);
				this.boxIndex[box._iri] = el;
				el.srcBox = box;
				el.setAttribute('class', 'box');
				el.setAttribute('id', 'fl-box-' + box.documentOrder);
				el.style.left = box.bounds.positionX + 'px';
				el.style.top = box.bounds.positionY + 'px';
				el.style.width = box.bounds.width + 'px';
				el.style.height = box.bounds.height + 'px';

				if (!this.screenshot) {
					const cont = this.renderContents(box);
					el.appendChild(cont);
				}

				// colorize tags if any
				if (this.showTags && box.hasTag) {
					console.log(box);
					if (box.hasTag.length === 1) {
						let tagName = box.hasTag[0].hasName;
						el.style.backgroundColor = stringColor(tagName);
					} else if (box.hasTag.length > 1) {
						let tagNames = [];
						for (let i = 0; i < box.hasTag.length; i++) {
							tagNames.push(box.hasTag[i].hasName);
						}
						console.log(tagNames);
						console.log(stringsGradient(tagNames));
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
		},

		renderContents(box) {
			let el = document.createElement('span');
			el.setAttribute('class', 'c');
			if (box.hasText) {
				const text = document.createTextNode(box.hasText);
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
.page-view .box:hover {
	/*outline: 1px solid red;*/
	background-color: rgba(200, 200, 255, 0.3);
}
.page-view .box:hover .vbox {
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
</style>
