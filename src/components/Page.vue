<template>
  <div class="page-zoom" :style="zoomStyle">
	<div class="page-view" :style="pageStyle">
		<div v-if="dataurl" class="image">
			<img :src="dataurl" alt="screenshot">
		</div>
		<div :class="boxesClass" ref="boxes">
		</div>
	</div>
  </div>
</template>

<script>
export default {
	name: 'Page',
	props: {
		pageModel: null,
		rectangles: null,
		selectedRect: null,
		zoom: null,
		outlines: null,
		rectSelection: null
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
		rectangles: 'render',
		rectSelection: 'render',
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
			let newElem = this.boxIndex[this.selectedRect._iri];
			console.log(newElem);
			if (newElem) {
				newElem.classList.add('focus');
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
.boxes {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
}
.box, .vbox {
	position: absolute;
}
.box.focus {
	outline: 2px solid var(--primary-color) !important;
	background-color: rgba(255, 200, 200, 0.3);
}
.box.selected {
	outline: 1px solid red;
}
.box.selected .vbox {
	outline: 1px solid green;
}
.box:hover {
	/*outline: 1px solid red;*/
	background-color: rgba(200, 200, 255, 0.3);
}
.box:hover .vbox {
	background-color: rgba(255, 200, 255, 0.3);
}
.outlines .box {
	outline: 1px dashed lightgreen;
}
.outlines .box.selected {
	outline: 1px solid red;
}
</style>
