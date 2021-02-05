<template>
  <div class="pageZoom h-100" :style="zoomStyle">
	<div class="pageView" :style="pageStyle">
		<div v-if="dataurl" class="image">
		<img :src="dataurl" alt="screenshot">
		</div>
		<div class="boxes" ref="boxes">
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
		zoom: null
	},
	data () {
		return {
			page: null,
			dataurl: null,
			pageStyle: '',
			zoomStyle: ''
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
			for (let box of boxList) {
				let el = document.createElement('div');
				shadow.appendChild(el);
				el.srcBox = box;
				el.setAttribute('class', 'box');
				el.style.left = box.positionX + 'px';
				el.style.top = box.positionY + 'px';
				el.style.width = box.width + 'px';
				el.style.height = box.height + 'px';
				el.onclick = function(event) {
					//console.log(event.currentTarget);
					event.currentTarget.classList.toggle('selected');
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

		updateZoom() {
			const ratio = this.zoom / 100.0;
			this.zoomStyle = `transform:scale(${ratio})`;
		}
	}
}
</script>
<style>
.pageZoom {
	transform-origin: top left;
}
.pageView {
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
</style>
