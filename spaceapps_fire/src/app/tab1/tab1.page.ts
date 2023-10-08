import { Component, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  constructor(private httpClient: HttpClient) { }

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

    this.loadData();
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

  loadData(): void{
    let url = "https://firms.modaps.eosdis.nasa.gov/api/country/csv/76db7f998faeaeb1d02f68b315bb5a12/VIIRS_SNPP_NRT/ARG/1/2023-10-07";
    const headers = new HttpHeaders({
        Accept: 'text/csv',
    });

    this.httpClient
      .get(url, {headers, responseType: 'text'})
      .subscribe(response => {
        let jsonData = this.csv2Json(response);
        let coordinates = this.processData(jsonData);
        this.generateFires(coordinates);
      });
  }

  private generateFires(coordinates: any[]): void {
    let self = this;
    coordinates.forEach(function(coordinate: any){
      L.circle([coordinate.latitude, coordinate.longitude], {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.5,
        radius: 1000
      })
        .addTo(self.map)
        .bindPopup(
          `<b>Lat:</b> ${coordinate.latitude}<br/>` +
          `<b>Lng:</b> ${coordinate.longitude}<br/>`);
    });
  }

  private csv2Json(csv: string): any[] {
    let lines = csv.split("\n");
    let result: any = [];
    let headers = lines[0].split(",");
    for (let i = 1; i < lines.length - 1; i++) {
        let obj:any = {};
        let currentline = lines[i].split(",");
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
  }

  private isCoordinateInsideRectangle(
    lat: number, lon: number, minLat: number, maxLat: number, minLon: number, maxLon: number) {
      return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
  }

  private processData(lines: any) {
      const minLat:number = -34.53191815752273;
      const maxLat:number = -31.7585755065532;
      const minLon:number = -61.026920398474445;
      const maxLon:number = -58.20905577137098;

      const filteredFires = lines
          .filter((fire: any) => {
              const lat = parseFloat(fire.latitude);
              const lon = parseFloat(fire.longitude);
              return this.isCoordinateInsideRectangle(lat, lon, minLat, maxLat, minLon, maxLon);
          });

      return filteredFires;
  }

}
