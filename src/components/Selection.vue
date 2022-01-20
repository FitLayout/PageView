<template>
	<div>
		<!-- funguje aj klikat aj vyberat ale robi tam chyby a ziskavanie suradnic nejde spravne -->
		<!-- <div id="mouseDragView" v-on:mousedown="divCreator" v-on:mouseup="divUp" v-on:mousemove="divMover" v-on:mouseleave="divLeave">					
			<div :class="boxesClass" ref="boxes">

			</div>	
		</div> -->
		<!-- nefunguje klikanie ked je zapnuty vyber -->
		<div id="mouseDragView" ref="dragView" v-on:mousedown="divCreator" v-on:mouseup="divUp" v-on:mousemove="divMover" v-on:mouseleave="divLeave">					

		</div>
	</div>
</template>

<script>

export default {
	name: 'Selection',
	
	 props: {
	 	pageRectAreas:null,
	 },
	data () {
		return {
			//used for selecting div----------------------
			selectDiv: null, // div for selecting
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

			borderDiv: null,//used for selected area div
			//positions for comparing and final rendering of border div
			topBorderDiv: 2000,
			leftBorderDiv: 2000,
			heightBorderDiv: 0,
			widthBorderDiv: 0
			// -------------------------------------------
		}
	},
	methods: {		
		//create div and get its starging position
		divCreator(event) { 
			//remove div of selected boxes
			let el = document.getElementById('divBorder');
			if (el != null) {
				el.remove();
			}
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
			//variable to let know mover to not be used
			this.canMove = false;
			//if any boxes are in selection set true
			let isBox = false;

			//remove selection div 
			let el = document.getElementById('divSelector');
			if (el != null) {
				el.remove();
			}

			//calculate on mouse up position
			this.endX = event.clientX;
                	this.endY = event.clientY;
			this.endBorderX = event.offsetX;
                	this.endBorderY = event.offsetY;	
			
			//positions for comparing
			this.topBorderDiv = this.endBorderY;
			this.leftBorderDiv = this.endBorderX;
			this.heightBorderDiv = 0;
			this.widthBorderDiv =  0;

			//choose all boxes in selection and set coordinates for border div
			console.log(this.pageRectAreas);
			var boxes = this.pageRectAreas;
			boxes.forEach(box => {
				if (box.bounds.positionX > this.startBorderX && box.bounds.positionY > this.startBorderY && (box.bounds.height + box.bounds.positionY) < this.endBorderY && (box.bounds.width + box.bounds.positionX) < this.endBorderX) {
					//write out selected boxes to console
					console.log(box);
					console.log(box.bounds._iri);
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
					isBox = true;	
				}
			});
			if (isBox)
			{
				//create border div that will be removed on click
				this.borderDiv = document.createElement('div');
				this.$refs.dragView.appendChild(this.borderDiv);
				this.borderDiv.setAttribute('id', 'divBorder');
				// document.documentElement.appendChild(this.borderDiv);
				let divStyle = 'position:absolute;' + 'z-index:1;' + 'top:'+ this.topBorderDiv + 'px;' + 'left:'+ this.leftBorderDiv +'px;' + 'height:' + this.heightBorderDiv + 'px;' + 'width:' + this.widthBorderDiv + 'px;' + 'background:rgba(100,100,255,0.2);' + 'outline: 1px solid rgb(100,100,255)';
				this.borderDiv.setAttribute('style', divStyle);
			}		
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