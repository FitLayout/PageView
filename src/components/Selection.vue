<template>
	<div>
		<div id="mouseDragView" ref="dragView" v-on:mousedown="divCreator" v-on:mouseup="divUp" v-on:mousemove="divMover" v-on:mouseleave="divLeave">	
			<!-- add objects to tree area-->
			<Button id="addIriObjectsToAreaButton" @click="addIriObjectsToArea" label="Add selection"> </Button>	
		</div>
	</div>
</template>

<script>
import Button from 'primevue/button';

export default {
	name: 'Selection',
	
	 props: {
	 	pageRectAreas:null,
	 },

	inject:['apiClient'],

	components: {
		Button,
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

			borderDiv: null,//div used for selected area
			
			//positions for comparing and final rendering of border div
			topBorderDiv: 10000,
			leftBorderDiv: 10000,
			bottomBorderDiv: 0,
			rightBorderDiv: 0,

			// array of selected iri boxes
			iriBoxes: [],
			newBounds: {},
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
			this.bottomBorderDiv = 0;
			this.rightBorderDiv =  0;

			//choose all boxes in selection and set coordinates for border div
			var boxes = this.pageRectAreas;

			boxes.forEach(box => {
				if (box.bounds.positionX > this.startBorderX && box.bounds.positionY > this.startBorderY && (box.bounds.height + box.bounds.positionY) < this.endBorderY && (box.bounds.width + box.bounds.positionX) < this.endBorderX) {
					//add iris to array of selected boxes
					this.iriBoxes.push(box);
					
					//set border div size
					// if (box.bounds.positionX < this.leftBorderDiv) {
					// 	this.leftBorderDiv = box.bounds.positionX;
					// }
					// if (box.bounds.positionY < this.topBorderDiv) {
					// 	this.topBorderDiv = box.bounds.positionY;
					// }
					// if ((box.bounds.width + box.bounds.positionX - this.leftBorderDiv) > this.rightBorderDiv) {
					// 	this.rightBorderDiv = box.bounds.width + box.bounds.positionX - this.leftBorderDiv;
					// }
					// if ((box.bounds.height + box.bounds.positionY - this.topBorderDiv) > this.bottomBorderDiv) {
					// 	this.bottomBorderDiv =  box.bounds.height + box.bounds.positionY - this.topBorderDiv;
					// }

					//set borders of div
					if (box.bounds.positionX < this.leftBorderDiv) {
						this.leftBorderDiv = box.bounds.positionX;
					}
					if (box.bounds.positionY < this.topBorderDiv) {
						this.topBorderDiv = box.bounds.positionY;
					}
					if ((box.bounds.width + box.bounds.positionX) > this.rightBorderDiv) {
						this.rightBorderDiv = box.bounds.width + box.bounds.positionX;
					}
					if ((box.bounds.height + box.bounds.positionY) > this.bottomBorderDiv) {
						this.bottomBorderDiv =  box.bounds.height + box.bounds.positionY;
					}
					isBox = true;	
				}
			});

			//Selection containts at least one box and selection div will be drawn
			if (isBox)
			{
				// width and height of selection div
				let widthDiv = this.rightBorderDiv - this.leftBorderDiv;
				let heightDiv = this.bottomBorderDiv - this.topBorderDiv;
				//create border div that will be removed on click
				this.borderDiv = document.createElement('div');
				this.$refs.dragView.appendChild(this.borderDiv);
				this.borderDiv.setAttribute('id', 'divBorder');
				// document.documentElement.appendChild(this.borderDiv);
				let divStyle = 'position:absolute;' + 'z-index:1;' + 'top:'+ this.topBorderDiv + 'px;' + 'left:'+ this.leftBorderDiv +'px;' + 'height:' + heightDiv + 'px;' + 'width:' + widthDiv + 'px;' + 'background:rgba(100,100,255,0.2);' + 'outline: 1px solid rgb(100,100,255)';
				this.borderDiv.setAttribute('style', divStyle);
				
				//bounds of new area
				this.newBounds = {
					positionX: this.leftBorderDiv, //rozměry
					positionY: this.topBorderDiv,
					width: widthDiv,
					height: heightDiv,
				}
				//show button for adding selection to tree
				document.getElementById("addIriObjectsToAreaButton").style.display = "block";
			}
			else {
				//hide button for adding selection to tree
				document.getElementById("addIriObjectsToAreaButton").style.display = "none";
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
		},
		
		//add selected areas to new super area and update view
		async addIriObjectsToArea() {
			//array of areas
			let sel = this.iriBoxes;
			// iri of whole artifact
			let artIri = sel[0].belongsTo._iri;
			//iri of parent area
			let parent = sel[0].isChildOf._iri;

			//array if children iris
			let children = [];
			//new ID of area is concatenation of whole artifact ID and all children IDs
			let newID = artIri.concat('#');
			sel.forEach(area => {
				children.push(area._iri);
				let splitIri = area._iri.split('#');
				newID = newID.concat(splitIri[splitIri.length - 1]);
			});

			//data of new area
			let data = {
				positionX: this.newBounds.positionX, //rozměry
				positionY: this.newBounds.positionY,
				width: this.newBounds.width,
				height: this.newBounds.height,
				label: 'new area', //textový popis (cokoliv)
				iri: newID //nové IRI
			}
			console.log(data);

			//create new area and update tree view
			await this.$root.rdfUtil.createSuperArea(artIri, parent, children, data);
			this.$emit('update');	
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
#addIriObjectsToAreaButton
{
	z-index: 1001;
	position: fixed;
	margin: 5px;
	background-color: rgba(55, 55, 255, 0.5);
	/* display: none; */
}
</style>
