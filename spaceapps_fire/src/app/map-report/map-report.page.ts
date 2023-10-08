import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-report',
  templateUrl: 'map-report.page.html',
  styleUrls: ['map-report.page.scss']
})
export class MapReportPage implements AfterViewInit{
  
  private map: any;
  private marker: any;
  private lat: number = -33.27688650546989;
  private lng: number = -59.820610521170714;

  constructor() { }

  private initMap(): void {
    const defaultIcon = L.icon({
      iconUrl: './assets/marker-icon.png',
      shadowUrl: './assets/marker-shadow.png'
    });

    this.marker = L.marker([this.lat, this.lng], {icon: defaultIcon});

    this.map = L.map('map', {
      center: [ this.lat, this.lng ],
      zoom: 8
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.marker
      .addTo(this.map)
      .bindPopup("<b>You are here!</b>");

    setTimeout(() => { 
      this.map.invalidateSize();
    }, 500 );
  }

  ngAfterViewInit(): void {
    this.initMap();
  }


}
