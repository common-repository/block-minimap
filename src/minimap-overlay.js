const { Component } = wp.element;
import './block-minimap.css';


export default class MinimapOverlap extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			overlayTop: 100,
			overlayHeight: 100,
		}

		this.calculateOverlay = this.calculateOverlay.bind( this );
		this.postContent = document.getElementsByClassName( 'edit-post-layout__content' )[0];
	}

	calculateOverlay() {
		const { minimapHelper } = this.props;
		const calculatedOverlay = minimapHelper.calculateOverlay();

		if ( calculatedOverlay.clientTop < calculatedOverlay.overlayTop ) {
			document.getElementsByClassName( 'minimap-overlay' )[0].scrollIntoView();
		}

		this.setState( calculatedOverlay );
	}

	componentDidMount() {

		// Set up initial overlay.
		this.calculateOverlay();

		this.postContent.addEventListener( 'scroll', this.calculateOverlay );

	}

	componentWillUnmount() {
	}

	render() {
		const {
			overlayTop,
			overlayHeight,
		} = this.state;

		return (
			<div
				className="minimap-overlay"
				style={ {
					top: overlayTop,
					height: overlayHeight,
				} }
			/>
		);
	}
};