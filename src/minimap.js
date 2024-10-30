const { Component } = wp.element;
const { subscribe } = wp.data;
const { debounce, map } = lodash;
import './block-minimap.css';

import MinimapOverlay from './minimap-overlay';
import MinimapHelper from './minimap-helper';

export default class Minimap extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			blocks: wp.data.select( 'core/block-editor' ).getBlocks(),
			minimapWidth: 240,
		}
		this.checkForUpdates = this.checkForUpdates.bind( this );
		this.checkForUpdates = debounce( this.checkForUpdates, 250 );
		this.minimapHelper = new MinimapHelper();
		this.handleMimimapClick = this.handleMimimapClick.bind( this );
		this.postContent = document.getElementsByClassName( 'edit-post-layout__content' )[0];
	}

	componentDidMount() {
		this.unsubscribe = subscribe( this.checkForUpdates );
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	checkForUpdates() {
			const blocks =  wp.data.select( 'core/block-editor' ).getBlocks();
			this.setState(
				{
					blocks
				}
			);
	}

	handleMimimapClick( e ) {
		console.log( e );
		const target = e.currentTarget;
		const elTop = target.offsetTop;
		const mainTop = this.minimapHelper.calculateMainTopFromMiniTop( elTop );
		this.postContent.scrollTo( { top: mainTop } );

		setTimeout( () => {
			const overlay = document.getElementsByClassName( 'minimap-overlay' )[0];
			target.scrollIntoView();
			//overlay.scrollIntoView();
		}, 50 );
	}

	render() {
		const { blocks } = this.state;
		const title = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'title' );

		return (
			<div
				id="minimap-container"
				style={ { height: '100%' } }
			>
				<MinimapOverlay
					minimapHelper={ this.minimapHelper }
				/>
				<div className="minimap-block title"
					onClick={ this.handleMimimapClick }
				>
					{ title }
				</div>

				{
					blocks &&
						map( blocks, ( block, i ) => {

							// Determine the displayed block height.
							const blockEls = document.querySelectorAll( `div[data-block='${ block.clientId }']` );
							const blockEl = blockEls[0];
							const minimapHeight = this.minimapHelper.blockHeightToMinimapHeight( blockEl );
							const style = { height: `${ minimapHeight }px` };

							const name = `minimap-block ${ block.name.replace( '/', '-' ) }`;
							switch ( block.name ) {
								case 'core/cover':
								case 'core/image':
									return (
										<div
											key={ i }
											className={ name }
											style={ style }
											onClick={ this.handleMimimapClick }
										>
											<img
												src={ block.attributes.url }
											/>
										</div>
									);
									break;

								case 'core/separator':
									return (
										<div
											key={ i }
											className={ name }
											style={ style }
											onClick={ this.handleMimimapClick }
										>
											<hr
												key={ i }
											/>
										</div>

									);
									break;


								case 'core/list':
										return (
											<div
												key={ i }
												className={ name }
												style={ style }
												onClick={ this.handleMimimapClick }
											>
												<ul
													dangerouslySetInnerHTML={ {
														__html: block.attributes.values
													} }
												/>
											</div>
										);
										break;

								case 'core/paragraph':
									return (
										<div
											key={ i }
											className={ name }dangerouslySetInnerHTML={ {
												__html: block.attributes.content
											} }
											style={ style }
											onClick={ this.handleMimimapClick }
										/>
									);
									break;

								case 'core/heading':
										const CustomTag = `h${ block.attributes.level }`;

										return (
											<div
												key={ i }
												className={ name }
												style={ style }
												onClick={ this.handleMimimapClick }
											>
												<CustomTag
													key={ i }
													className={ name }
													dangerouslySetInnerHTML={ {
														__html: block.attributes.content
													} }
												/>
											</div>

										);
										break;

								default:
									return (
										<div
											key={ i }
											className={ name }
											style={ style }
											onClick={ this.handleMimimapClick }
										/>
									);
							}
						} )
				}
			</div>
		);
	}
};