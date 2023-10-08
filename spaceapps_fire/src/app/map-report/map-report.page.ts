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
  private estimatedFirePositions: any = [];
  private maxEstimatedFirePositions: number = 10;
  public currentEstimatedFirePosition: number = 0;
  private selectedFire: string | null = "";
  private selectedSmoke: string | null = "";

  constructor() { 
  }

  private initMap(): void {
    const defaultIcon = L.icon({
      iconUrl: './assets/marker-icon.png',
      shadowUrl: './assets/marker-shadow.png'
    });

    this.marker = L.marker([this.lat, this.lng], {icon: defaultIcon});

    this.map = L.map('map', {
      center: [ this.lat, this.lng ],
      zoom: 15,
      zoomControl: false,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.selectedFire = localStorage.getItem("fireType");
    this.selectedSmoke = localStorage.getItem("smokeType");

    this.marker
      .addTo(this.map)
      .bindPopup(
        `<b>You are here</b><br/>` + 
        `<img width='200px' src='/assets/images/incendio_delta.jpg'><br/>` + 
        `<img width='30px' src='/assets/images/fire_${this.selectedFire}.png'>` + 
        `<img width='30px' src='/assets/images/smoke_${this.selectedSmoke}.png'>`);

    setTimeout(() => { 
      this.map.invalidateSize();
      this.generateFireAnimation();
      this.addFireAnimations();
    }, 500 );
  }

  ngAfterViewInit(): void {
    let container: any = L.DomUtil.get('map');
    if (container && container['_leaflet_id'] != null) {
      container.remove();
    }
    
    this.initMap();
  }

  generateFireAnimation(): void {
    for(let i=0; i<this.maxEstimatedFirePositions;i++){
      let lat, lng;
      if(i===0){
        lat = this.lat;
        lng = this.lng;
      }else{
        lat = this.estimatedFirePositions[i-1].latitude;
        lng = this.estimatedFirePositions[i-1].longitude;
      }
      let randomPoint = this.generateRandomPoint(lat, lng, Math.random() * (100 - 150) + 100);
      this.estimatedFirePositions.push(randomPoint);
    }
  }

  addFireAnimations(): void {
    let self = this;

    if(this.estimatedFirePositions.length === this.currentEstimatedFirePosition){
      this.currentEstimatedFirePosition = 1;
      for(let i=0; i<this.maxEstimatedFirePositions;i++){
        this.map.removeLayer(this.estimatedFirePositions[i].marker);
      }
    }else{
      this.currentEstimatedFirePosition++;
    }
    let randomPoint = this.estimatedFirePositions[this.currentEstimatedFirePosition-1];
 
    this.lat = randomPoint.latitude;
    this.lng = randomPoint.longitude;
    randomPoint.marker = L.circle([randomPoint.latitude, randomPoint.longitude], {
      color: 'red',
      fillColor: 'red',
      fillOpacity: 0.5,
      radius: 100
    });

    randomPoint.marker.addTo(self.map);

    setTimeout(function () {
      self.addFireAnimations();
    }, 1000);
  }

  generateRandomPoint(latitude: number, longitude: number, distanceInMeters: number): any {
    // Earth's radius in meters
    const earthRadius = 6371000; // approximately 6371 km
  
    // Convert distance from meters to radians
    const distanceRadians = distanceInMeters / earthRadius;
  
    // Convert latitude and longitude from degrees to radians
    const lat1 = (latitude * Math.PI) / 180;
    const lon1 = (longitude * Math.PI) / 180;
  
    // Generate a random angle between 0 and 2π (0 and 360 degrees)
    const randomAngle = Math.random() * 2 * Math.PI;
  
    // Calculate new latitude and longitude
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceRadians) +
      Math.cos(lat1) * Math.sin(distanceRadians) * Math.cos(randomAngle));
    
    const lon2 = lon1 + Math.atan2(Math.sin(randomAngle) * Math.sin(distanceRadians) * Math.cos(lat1),
      Math.cos(distanceRadians) - Math.sin(lat1) * Math.sin(lat2));
  
    // Convert new latitude and longitude from radians to degrees
    const newLatitude = (lat2 * 180) / Math.PI;
    const newLongitude = (lon2 * 180) / Math.PI;
  
    return {
      latitude: newLatitude,
      longitude: newLongitude,
      randomDistance: distanceInMeters
    };
  }
  
}
