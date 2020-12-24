<template>
  <div class="pageView">
    <div v-if="dataurl" class="image">
	  <img :src="dataurl" alt="screenshot">
    </div>
	<div class="boxes" ref="boxes">
	</div>
  </div>
</template>

<script>
export default {
	name: 'Page',
	props: {
		pageModel: null
	},
	data () {
		return {
			page: null,
			dataurl: null
		}
	},
	created () {
		this.render();
	},
	watch: {
		pageModel: 'render'
	},
	methods: {
		render() {
			this.page = this.pageModel;
			if (this.page !== null && this.page.pngImage !== undefined) {
				const imgData = this.page.pngImage;
				this.dataurl = 'data:image/png;base64,' + imgData;
			} else {
				this.dataurl = null;
			}
			console.log(this.$refs);
			if (this.$refs.boxes !== undefined) {
				this.renderBoxes(this.page.rectangles, this.$refs.boxes);
			}
		},

		renderBoxes(boxList, target) {
			//let shadow = target.attachShadow({mode: 'open'});
			const shadow = target;
			for (let box of boxList) {
				let el = document.createElement('div');
				shadow.appendChild(el);
				el.setAttribute('class', 'box');
				el.style.left = box.positionX + 'px';
				el.style.top = box.positionY + 'px';
				el.style.width = box.width + 'px';
				el.style.height = box.height + 'px';
				el.onclick = function() {
					console.log('clicked');
				};
			}
		}
	}
}
</script>
<style>
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
.box {
	position: absolute;
}
.box:hover {
	/*outline: 1px solid red;*/
	background-color: rgba(200, 200, 255, 0.3);
}
</style>
