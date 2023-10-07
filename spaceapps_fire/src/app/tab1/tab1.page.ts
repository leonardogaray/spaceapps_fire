import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit{
  
  private map: any;
  private marker: any;
  private lat: number = -33.27688650546989;
  private lng: number = -59.820610521170714;

  private initMap(): void {
    this.marker = L.marker([this.lat, this.lng]);

    this.map = L.map('map', {
      center: [ this.lat, this.lng ],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.marker.addTo(this.map)

    setTimeout(() => { 
      this.map.invalidateSize()
    }, 500 );
  }

  ngAfterViewInit(): void {
    let self = this;
    navigator.geolocation.getCurrentPosition(function(position){
      //self.lat = position.coords.latitude;
      //self.lng = position.coords.longitude;
      self.initMap();
    },function(){
        alert('User not allowed')
    },{timeout:10000});

    
  }

}
