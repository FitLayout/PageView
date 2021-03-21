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
		outlines: null
	},
	data () {
		return {
			page: null,
			dataurl: null,
			pageStyle: '',
			zoomStyle: ''
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
		zoom: 'updateZoom'
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
			for (let box of boxList) {
				let el = document.createElement('div');
				shadow.appendChild(el);
				el.srcBox = box;
				el.setAttribute('class', 'box');
				el.setAttribute('id', 'fl-box-' + box.documentOrder);
				el.style.left = box.bounds.positionX + 'px';
				el.style.top = box.bounds.positionY + 'px';
				el.style.width = box.bounds.width + 'px';
				el.style.height = box.bounds.height + 'px';
				let thisObj = this;
				el.onclick = function(event) {
					//console.log(event.currentTarget);
					event.currentTarget.classList.toggle('selected');
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
			this.$emit('box-selected', box);
		},

		updateZoom() {
			const ratio = this.zoom / 100.0;
			this.zoomStyle = `transform:scale(${ratio})`;
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
