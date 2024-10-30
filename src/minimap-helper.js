export default class MinimapHelper {
	constructor() {
		this.mapWidth = 240;
		this.calculateOverlay = this.calculateOverlay.bind( this );
		this.postContent = document.getElementsByClassName( 'edit-post-layout__content' )[0];
		this.editorArea = document.getElementsByClassName( 'editor-block-list__layout' )[0];
	}

	calculateOverlay() {
		const totalHeight   = this.editorArea.scrollHeight;
		const postLayout    = document.getElementsByClassName( 'edit-post-layout' )[0];
		const clientHeight  = postLayout.clientHeight;
		const clientWidth   = postLayout.clientWidth;
		const overlayHeight = this.mapWidth / clientWidth * clientHeight;
		const offsetPercent = this.postContent.scrollTop / totalHeight;
		const minimap       = document.getElementById( 'minimap-container' );
		const overlayTop    = minimap.clientHeight * offsetPercent * .94 /* margin */;
		const clientTop     = minimap.clientTop

		return {
			overlayTop,
			overlayHeight,
			clientTop,
		};
	}

	/**
	 * Calculate a minimap height from a block height.
	 *
	 * @param {Number} block The block to scale.
	 *
	 * @return {Number} The height to use in the minimap.
	 */
	blockHeightToMinimapHeight( block ) {
		const blockHeight = block.clientHeight;
		const blockWidth  = block.clientWidth;
		const heightRatio = blockHeight / blockWidth;
		const miniHeight  = this.mapWidth * heightRatio;

		return Math.floor( miniHeight );
	}

	/**
	 * Calculate the top position for the main area.
	 *
	 * @param {Number} top The top position in the minimap.
	 */
	calculateMainTopFromMiniTop( top ) {
		const minimap       = document.getElementById( 'minimap-container' );
		const offsetPercent = top / minimap.clientHeight;
		const totalHeight  = this.editorArea.scrollHeight;
		console.log( { top, minimap: minimap.clientHeight, offsetPercent, result: totalHeight * offsetPercent } );

		return Math.floor( totalHeight * offsetPercent * 1.04 /* margin */ );
	}
}