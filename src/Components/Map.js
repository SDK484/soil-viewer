import React, { Component } from 'react';
import L from "leaflet";
import "./CanvasWithExtraStyles";
import * as polygonGeoJson from "./polygon";
import "leaflet/dist/leaflet.css";
import Modal from "./ModalView";
import Camera from "./Camera";
import AppBar from "./AppBar";
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import Airtable from 'airtable';

const base = new Airtable({apiKey: 'keyRxbrIIcPFpfAHZ'}).base('appnVHmHqljR3JkKC');

const getBase64 = (file) => {
  return new Promise((resolve,reject) => {
     const reader = new FileReader();
     reader.onload = () => resolve(reader.result);
     reader.onerror = error => reject(error);
     reader.readAsDataURL(file);
  });
}

class Map extends Component {

	// Camera Object funcs
	// <input 
	// type="file" 
	// id="imageFile" 
	// name='imageFile' 
	// onChange={this.imageUpload} />
	// imageUpload = (e) => {
	//  const file = e.target.files[0];
	//  getBase64(file).then(base64 => {
	//    localStorage["fileBase64"] = base64;
	//    console.debug("file stored",base64);
	//  });
	// };
	
	 constructor(props) {
		super(props);
		this.state = {
			report: {},
			soilData: [],
			winWidthFontSize: 0
		};
		this.getSoilData = this.getSoilData.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	async componentDidMount() {
		
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
  
		const coords = [54.483407850984655, -6.104691472848336];
		// get data
		fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=4c20a7355e7d6a3957ef39dbd37bcd62`)
		  .then(response => response.json())
		  .then(data => this.setState({report: data}));
		  
		const res = await this.getSoilData();
		this.setState({soilData: res});

		const mapView = L.map("mapView", {
			center: coords,
			zoom: 15,
			renderer: new L.Canvas.WithExtraStyles()
		});

		new L.tileLayer(
			'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			{
				attribution: `attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`,
				detectRetina: true,
				maxZoom: 30
			}
		).addTo(mapView);

		const polyStyle = {
			fillColor: "transparent",
			color: "#2f528f",
			extraStyles: [
				{
					inset: 0.9,
					color: "#d9d9d9",
					weight: 10,
					fillColor: "cyan",
					fillOpacity: 0.1
				},
				{
					inset: 1.1,
					color: "darkgray",
					weight: 10,
					fillColor: undefined
				},
				{
					inset: 1.2,
					color: "navy",
					opacity: 0.1,
					weight: 10,
					fillColor: undefined
				}
			]
		};
	
		const pointStyle = {
			radius: 4,
		fillColor: "#ff7800",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
		};

		const whenClicked = (e) => {
			console.log(e);
		}

		const onEachFeature = (feature, layer) => {
			//bind click
			layer.on({
				click: whenClicked
			});
		}

		L.geoJson(polygonGeoJson, {
			style: function(feature) {
				const type = feature.geometry.type;
				switch (type) {
					case "Point":
						// return pointStyle;
						break;
					case "Polygon":
						return polyStyle;
						break;
				}
			},
			pointToLayer: function (feature, latlng) {
				const type = feature.geometry.type;
				switch (type) {
					case "Point":
					console.log('kloop')
					return L.circleMarker(latlng, pointStyle);
					break;
				}
			
		},
			onEachFeature: onEachFeature
		}).addTo(mapView);
	}
	
	componentWillUnmount() {
	  window.removeEventListener('resize', this.updateWindowDimensions);
	}

	getSoilData() {
		
		return new Promise((resolve, reject) => {
		base('SoilData').select({
			maxRecords: 10,
			view: 'Grid view'
		}).firstPage(function(err, records) {
			if (err) { console.error(err); return reject({}); }
			const arrRes = [];
			records.forEach(function(record) {
				arrRes.push(record.fields);
			});
			resolve(arrRes);
		});
		});
		
		
	};
	
	updateWindowDimensions() {
		if (window.innerWidth < 900) {
			this.setState({ winWidthFontSize: 7.8 });
		} else {
			this.setState({ winWidthFontSize: 11 });
		}
	}
	
	render() {
		return (
			<div style={{ position: 'relative', backgroundColor: '#808080', overflowX: 'hidden' }}>
				<AppBar />
				<div id="mapView" style={{ position: 'relative', height: '89vh', width: '100vw', border: '0px solid red'}}>
					<div style={{position: 'absolute', bottom: 10, left: 10, width: '40%', height: '40%', border: '1px solid #000000', zIndex: 1000, overflow: 'auto', backgroundColor: '#272822'}}>
						<div style={{ color: '#ffffff', fontSize: this.state.winWidthFontSize+2}}>Soil Data</div>
						<hr/>
						<JSONPretty id="json-pretty" data={this.state.soilData} style={{fontSize: this.state.winWidthFontSize}}></JSONPretty>
						<div style={{ color: '#ffffff', fontSize: this.state.winWidthFontSize+2}}>Weather Report</div>
						<hr/>
						<JSONPretty id="json-pretty" data={this.state.report} style={{fontSize: this.state.winWidthFontSize}}></JSONPretty>
					</div>
				</div>
			</div>
		)
	}
}

export default Map;

