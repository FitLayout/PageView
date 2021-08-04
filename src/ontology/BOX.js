const NAMESPACE = 'http://fitlayout.github.io/ontology/render.owl#';

/**
 * Box Model Ontology.
 * <p>
 * FitLayout rendered document (box model) description ontology..
 * <p>
 * Namespace BOX.
 * Prefix: {@code <http://fitlayout.github.io/ontology/render.owl#>}
 */
const BOX = {

	NAMESPACE: 'http://fitlayout.github.io/ontology/render.owl#',

	PREFIX: 'box',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#Attribute
	 * An HTML attribute assigned to a box.
	 */
	Attribute: NAMESPACE + 'Attribute',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#backgroundColor
	 */
	backgroundColor: NAMESPACE + 'backgroundColor',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#backgroundSeparated
	 * Indicates whether the rectangle is separated from it parent rectangle
	 * by background color or image.
	 */
	backgroundSeparated: NAMESPACE + 'backgroundSeparated',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#belongsTo
	 * Assigns an owning page to a rectangle
	 */
	belongsTo: NAMESPACE + 'belongsTo',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#Border
	 */
	Border: NAMESPACE + 'Border',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#borderColor
	 */
	borderColor: NAMESPACE + 'borderColor',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#borderStyle
	 */
	borderStyle: NAMESPACE + 'borderStyle',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#borderWidth
	 */
	borderWidth: NAMESPACE + 'borderWidth',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#Bounds
	 * Rectangular bounds specified by its coordinates, width and height.
	 */
	Bounds: NAMESPACE + 'Bounds',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#bounds
	 * Assigns logical rectangular bounds to an area.
	 */
	bounds: NAMESPACE + 'bounds',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#Box
	 */
	Box: NAMESPACE + 'Box',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#color
	 * Foreground color (#rrggbb)
	 */
	color: NAMESPACE + 'color',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#ContainerBox
	 */
	ContainerBox: NAMESPACE + 'ContainerBox',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#containsObject
	 */
	containsObject: NAMESPACE + 'containsObject',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#contentBounds
	 * Assigns rectangular content bounds to a box. The content bounds
	 * correspond to the box border bounds as provided by the box source
	 * (renderer).
	 */
	contentBounds: NAMESPACE + 'contentBounds',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#ContentBox
	 */
	ContentBox: NAMESPACE + 'ContentBox',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#ContentObject
	 */
	ContentObject: NAMESPACE + 'ContentObject',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#displayType
	 * The display type of a box that corresponds to the CSS 'display'
	 * property ('inline', 'block', etc.)
	 */
	displayType: NAMESPACE + 'displayType',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#documentOrder
	 * The order of a rectangle within its page
	 */
	documentOrder: NAMESPACE + 'documentOrder',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#fontFamily
	 */
	fontFamily: NAMESPACE + 'fontFamily',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#fontSize
	 */
	fontSize: NAMESPACE + 'fontSize',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#fontStyle
	 */
	fontStyle: NAMESPACE + 'fontStyle',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#fontVariant
	 */
	fontVariant: NAMESPACE + 'fontVariant',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#fontWeight
	 */
	fontWeight: NAMESPACE + 'fontWeight',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#hasAttribute
	 */
	hasAttribute: NAMESPACE + 'hasAttribute',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#hasBackgroundImage
	 */
	hasBackgroundImage: NAMESPACE + 'hasBackgroundImage',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#hasBottomBorder
	 */
	hasBottomBorder: NAMESPACE + 'hasBottomBorder',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#hasLeftBorder
	 */
	hasLeftBorder: NAMESPACE + 'hasLeftBorder',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#hasRightBorder
	 */
	hasRightBorder: NAMESPACE + 'hasRightBorder',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#hasTopBorder
	 */
	hasTopBorder: NAMESPACE + 'hasTopBorder',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#height
	 * Effective height of a rectangle.
	 */
	height: NAMESPACE + 'height',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#htmlTagName
	 */
	htmlTagName: NAMESPACE + 'htmlTagName',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#Image
	 */
	Image: NAMESPACE + 'Image',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#imageData
	 */
	imageData: NAMESPACE + 'imageData',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#imageUrl
	 */
	imageUrl: NAMESPACE + 'imageUrl',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#isChildOf
	 */
	isChildOf: NAMESPACE + 'isChildOf',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#lineThrough
	 */
	lineThrough: NAMESPACE + 'lineThrough',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#Page
	 * A tree of boxes representing a rendered page.
	 */
	Page: NAMESPACE + 'Page',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#pngImage
	 * PNG image data representing the whole page (screen shot)
	 */
	pngImage: NAMESPACE + 'pngImage',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#positionX
	 * Effective X coordinate of a rectangle.
	 */
	positionX: NAMESPACE + 'positionX',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#positionY
	 * Effective Y coordinate of a rectangle.
	 */
	positionY: NAMESPACE + 'positionY',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#RectArea
	 * A rectangular area in the page with bounds assigned.
	 */
	RectArea: NAMESPACE + 'RectArea',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#sourceUrl
	 */
	sourceUrl: NAMESPACE + 'sourceUrl',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#sourceXPath
	 * An XPath expression identifying the source element of the box in the
	 * source document.
	 */
	sourceXPath: NAMESPACE + 'sourceXPath',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#text
	 */
	text: NAMESPACE + 'text',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#title
	 * Page title
	 */
	title: NAMESPACE + 'title',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#underline
	 */
	underline: NAMESPACE + 'underline',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#visible
	 * Defines the box visibility
	 */
	visible: NAMESPACE + 'visible',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#visualBounds
	 * Assigns visual rectangular bounds to a box. Visual bounds correspond
	 * to the minimal rectangle that encloses visible contents inside the
	 * box.
	 */
	visualBounds: NAMESPACE + 'visualBounds',

	/**
	 * http://fitlayout.github.io/ontology/render.owl#width
	 * Effective width of a rectangle.
	 */
	width: NAMESPACE + 'width'

}

export default BOX;
