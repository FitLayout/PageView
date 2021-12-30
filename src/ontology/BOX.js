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
	 * Attribute
	 * http://fitlayout.github.io/ontology/render.owl#Attribute
	 * An HTML attribute assigned to a box.
	 */
	Attribute: NAMESPACE + 'Attribute',

	/**
	 * backgroundColor
	 * http://fitlayout.github.io/ontology/render.owl#backgroundColor
	 */
	backgroundColor: NAMESPACE + 'backgroundColor',

	/**
	 * backgroundSeparated
	 * http://fitlayout.github.io/ontology/render.owl#backgroundSeparated
	 * Indicates whether the rectangle is separated from it parent rectangle
	 * by background color or image.
	 */
	backgroundSeparated: NAMESPACE + 'backgroundSeparated',

	/**
	 * belongsTo
	 * http://fitlayout.github.io/ontology/render.owl#belongsTo
	 * Assigns an owning page to a rectangle
	 */
	belongsTo: NAMESPACE + 'belongsTo',

	/**
	 * Border
	 * http://fitlayout.github.io/ontology/render.owl#Border
	 */
	Border: NAMESPACE + 'Border',

	/**
	 * borderColor
	 * http://fitlayout.github.io/ontology/render.owl#borderColor
	 */
	borderColor: NAMESPACE + 'borderColor',

	/**
	 * borderStyle
	 * http://fitlayout.github.io/ontology/render.owl#borderStyle
	 */
	borderStyle: NAMESPACE + 'borderStyle',

	/**
	 * borderWidth
	 * http://fitlayout.github.io/ontology/render.owl#borderWidth
	 */
	borderWidth: NAMESPACE + 'borderWidth',

	/**
	 * Bounds
	 * http://fitlayout.github.io/ontology/render.owl#Bounds
	 * Rectangular bounds specified by its coordinates, width and height.
	 */
	Bounds: NAMESPACE + 'Bounds',

	/**
	 * bounds
	 * http://fitlayout.github.io/ontology/render.owl#bounds
	 * Assigns logical rectangular bounds to an area.
	 */
	bounds: NAMESPACE + 'bounds',

	/**
	 * Box
	 * http://fitlayout.github.io/ontology/render.owl#Box
	 */
	Box: NAMESPACE + 'Box',

	/**
	 * color
	 * http://fitlayout.github.io/ontology/render.owl#color
	 * Foreground color (#rrggbb)
	 */
	color: NAMESPACE + 'color',

	/**
	 * ConnectionSet
	 * http://fitlayout.github.io/ontology/render.owl#ConnectionSet
	 * A set of named area connections.
	 */
	ConnectionSet: NAMESPACE + 'ConnectionSet',

	/**
	 * ContainerBox
	 * http://fitlayout.github.io/ontology/render.owl#ContainerBox
	 */
	ContainerBox: NAMESPACE + 'ContainerBox',

	/**
	 * containsObject
	 * http://fitlayout.github.io/ontology/render.owl#containsObject
	 */
	containsObject: NAMESPACE + 'containsObject',

	/**
	 * contentBounds
	 * http://fitlayout.github.io/ontology/render.owl#contentBounds
	 * Assigns rectangular content bounds to a box. The content bounds
	 * correspond to the box border bounds as provided by the box source
	 * (renderer).
	 */
	contentBounds: NAMESPACE + 'contentBounds',

	/**
	 * ContentBox
	 * http://fitlayout.github.io/ontology/render.owl#ContentBox
	 */
	ContentBox: NAMESPACE + 'ContentBox',

	/**
	 * contentLength
	 * http://fitlayout.github.io/ontology/render.owl#contentLength
	 * The number of content elements used to compute the style statistics
	 * such as average font weight.
	 */
	contentLength: NAMESPACE + 'contentLength',

	/**
	 * ContentObject
	 * http://fitlayout.github.io/ontology/render.owl#ContentObject
	 */
	ContentObject: NAMESPACE + 'ContentObject',

	/**
	 * displayType
	 * http://fitlayout.github.io/ontology/render.owl#displayType
	 * The display type of a box that corresponds to the CSS 'display'
	 * property ('inline', 'block', etc.)
	 */
	displayType: NAMESPACE + 'displayType',

	/**
	 * documentOrder
	 * http://fitlayout.github.io/ontology/render.owl#documentOrder
	 * The order of a rectangle within its page
	 */
	documentOrder: NAMESPACE + 'documentOrder',

	/**
	 * fontFamily
	 * http://fitlayout.github.io/ontology/render.owl#fontFamily
	 */
	fontFamily: NAMESPACE + 'fontFamily',

	/**
	 * fontSize
	 * http://fitlayout.github.io/ontology/render.owl#fontSize
	 */
	fontSize: NAMESPACE + 'fontSize',

	/**
	 * fontStyle
	 * http://fitlayout.github.io/ontology/render.owl#fontStyle
	 */
	fontStyle: NAMESPACE + 'fontStyle',

	/**
	 * fontVariant
	 * http://fitlayout.github.io/ontology/render.owl#fontVariant
	 */
	fontVariant: NAMESPACE + 'fontVariant',

	/**
	 * fontWeight
	 * http://fitlayout.github.io/ontology/render.owl#fontWeight
	 */
	fontWeight: NAMESPACE + 'fontWeight',

	/**
	 * hasAttribute
	 * http://fitlayout.github.io/ontology/render.owl#hasAttribute
	 */
	hasAttribute: NAMESPACE + 'hasAttribute',

	/**
	 * hasBackgroundImage
	 * http://fitlayout.github.io/ontology/render.owl#hasBackgroundImage
	 */
	hasBackgroundImage: NAMESPACE + 'hasBackgroundImage',

	/**
	 * hasBottomBorder
	 * http://fitlayout.github.io/ontology/render.owl#hasBottomBorder
	 */
	hasBottomBorder: NAMESPACE + 'hasBottomBorder',

	/**
	 * hasLeftBorder
	 * http://fitlayout.github.io/ontology/render.owl#hasLeftBorder
	 */
	hasLeftBorder: NAMESPACE + 'hasLeftBorder',

	/**
	 * hasRightBorder
	 * http://fitlayout.github.io/ontology/render.owl#hasRightBorder
	 */
	hasRightBorder: NAMESPACE + 'hasRightBorder',

	/**
	 * hasSource
	 * http://fitlayout.github.io/ontology/render.owl#hasSource
	 * Assigns a source artifact to a connection set.
	 */
	hasSource: NAMESPACE + 'hasSource',

	/**
	 * hasTopBorder
	 * http://fitlayout.github.io/ontology/render.owl#hasTopBorder
	 */
	hasTopBorder: NAMESPACE + 'hasTopBorder',

	/**
	 * height
	 * http://fitlayout.github.io/ontology/render.owl#height
	 * Effective height of a rectangle.
	 */
	height: NAMESPACE + 'height',

	/**
	 * htmlTagName
	 * http://fitlayout.github.io/ontology/render.owl#htmlTagName
	 */
	htmlTagName: NAMESPACE + 'htmlTagName',

	/**
	 * Image
	 * http://fitlayout.github.io/ontology/render.owl#Image
	 */
	Image: NAMESPACE + 'Image',

	/**
	 * imageData
	 * http://fitlayout.github.io/ontology/render.owl#imageData
	 */
	imageData: NAMESPACE + 'imageData',

	/**
	 * imageUrl
	 * http://fitlayout.github.io/ontology/render.owl#imageUrl
	 */
	imageUrl: NAMESPACE + 'imageUrl',

	/**
	 * isChildOf
	 * http://fitlayout.github.io/ontology/render.owl#isChildOf
	 */
	isChildOf: NAMESPACE + 'isChildOf',

	/**
	 * lineThrough
	 * http://fitlayout.github.io/ontology/render.owl#lineThrough
	 */
	lineThrough: NAMESPACE + 'lineThrough',

	/**
	 * Page
	 * http://fitlayout.github.io/ontology/render.owl#Page
	 * A tree of boxes representing a rendered page.
	 */
	Page: NAMESPACE + 'Page',

	/**
	 * pngImage
	 * http://fitlayout.github.io/ontology/render.owl#pngImage
	 * PNG image data representing the whole page (screen shot)
	 */
	pngImage: NAMESPACE + 'pngImage',

	/**
	 * positionX
	 * http://fitlayout.github.io/ontology/render.owl#positionX
	 * Effective X coordinate of a rectangle.
	 */
	positionX: NAMESPACE + 'positionX',

	/**
	 * positionY
	 * http://fitlayout.github.io/ontology/render.owl#positionY
	 * Effective Y coordinate of a rectangle.
	 */
	positionY: NAMESPACE + 'positionY',

	/**
	 * RectArea
	 * http://fitlayout.github.io/ontology/render.owl#RectArea
	 * A rectangular area in the page with bounds assigned.
	 */
	RectArea: NAMESPACE + 'RectArea',

	/**
	 * sourceUrl
	 * http://fitlayout.github.io/ontology/render.owl#sourceUrl
	 */
	sourceUrl: NAMESPACE + 'sourceUrl',

	/**
	 * sourceXPath
	 * http://fitlayout.github.io/ontology/render.owl#sourceXPath
	 * An XPath expression identifying the source element of the box in the
	 * source document.
	 */
	sourceXPath: NAMESPACE + 'sourceXPath',

	/**
	 * text
	 * http://fitlayout.github.io/ontology/render.owl#text
	 */
	text: NAMESPACE + 'text',

	/**
	 * title
	 * http://fitlayout.github.io/ontology/render.owl#title
	 * Page title
	 */
	title: NAMESPACE + 'title',

	/**
	 * underline
	 * http://fitlayout.github.io/ontology/render.owl#underline
	 */
	underline: NAMESPACE + 'underline',

	/**
	 * visible
	 * http://fitlayout.github.io/ontology/render.owl#visible
	 * Defines the box visibility
	 */
	visible: NAMESPACE + 'visible',

	/**
	 * visualBounds
	 * http://fitlayout.github.io/ontology/render.owl#visualBounds
	 * Assigns visual rectangular bounds to a box. Visual bounds correspond
	 * to the minimal rectangle that encloses visible contents inside the
	 * box.
	 */
	visualBounds: NAMESPACE + 'visualBounds',

	/**
	 * width
	 * http://fitlayout.github.io/ontology/render.owl#width
	 * Effective width of a rectangle.
	 */
	width: NAMESPACE + 'width'

}

export default BOX;
