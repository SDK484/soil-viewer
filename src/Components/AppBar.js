import React from 'react';
import logo from './SoilLogo.png';

function AppBar() {

	return (
		<div style={{ position: 'relative', backgroundColor: '#808080', height: '11vh', width: '100vw' }}>
			<div style={{ position: 'relative', top: 5, left: 15}}>
				<div style={{ float: 'left'}}>
					<img style={{ position: 'relative', width: 50, top: 2 }} src={logo} />
				</div>
				<div style={{ float: 'left' }}>
					<h2 style={{ position: 'relative', left: 20, bottom: 8, fontFamily: 'Arial, Helvetica, sans-serif' }}>Agri. Soil Demo</h2>
				</div>
			</div>
		</div>
	);
}

export default AppBar;