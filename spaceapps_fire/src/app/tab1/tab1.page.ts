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
  private formattedDate: any = this.Today();
  

  constructor(private httpClient: HttpClient) { }

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
      this.map.invalidateSize();
    }, 500 );


    this.loadDataVIIRS();
    this.loadDataMODIS();
    console.log(this.randomPointInPolygon());
    
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

  loadDataVIIRS(): void{

    let url = "https://firms.modaps.eosdis.nasa.gov/api/country/csv/76db7f998faeaeb1d02f68b315bb5a12/VIIRS_SNPP_NRT/ARG/1/" + this.formattedDate;
    const headers = new HttpHeaders({
        Accept: 'text/csv',
    });

    this.httpClient
      .get(url, {headers, responseType: 'text'})
      .subscribe(response => {
        let jsonData = this.csv2Json(response);
        let coordinates = this.processDataVIIRS(jsonData);
        this.generateFires(coordinates);
      });
  }

  loadDataMODIS(): void{

    const now = new Date();

    let url = "https://firms.modaps.eosdis.nasa.gov/api/country/csv/76db7f998faeaeb1d02f68b315bb5a12/MODIS_NRT/ARG/1/" + this.formattedDate;
    const headers = new HttpHeaders({
        Accept: 'text/csv',
    });

    this.httpClient
      .get(url, {headers, responseType: 'text'})
      .subscribe(response => {
        let jsonData = this.csv2Json(response);
        let coordinates = this.processDataMODIS(jsonData);
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
      }).addTo(self.map);
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


  private isPointInsidePolygon(
    pointLat: number, pointLon: number, polygon: Array<[number, number]>
  ): boolean {
    const x = pointLon;
    const y = pointLat;

    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
      if (intersect) {
        isInside = !isInside;
      }
    }

    

    return isInside;
  }

  private processDataVIIRS(lines: any) {

      const polygon: Array<[number, number]> = [
        [-60.7035826, -31.9551536],
        [-59.9875480, -32.7282481],
        [-59.3283683, -33.2261903],
        [-59.1306144, -33.1111758],
        [-58.4439689, -33.2813436],
        [-58.3615714, -34.0498202],
        [-58.4879142, -34.4903853],
        [-60.2457267, -33.3685985],
        [-60.7016593, -32.8991555],
        [-60.8115226, -32.5199454],
        [-60.7071524, -31.9574472],
        [-60.3555905, -32.3289323]
      ];

      const filteredFires = lines
          .filter((fire: any) => {
              const lat = parseFloat(fire.latitude);
              const lon = parseFloat(fire.longitude);
              return this.isPointInsidePolygon(lat, lon, polygon); //&& fire.confidence == 'h'; 
              //delete ';//' in line 144 after '...(lat, lon, polygon) ' to filter shown hotspots, leaving only those that are likely to be real fires
          });

      return filteredFires;
  }

  private processDataMODIS(lines: any) {

    const polygon: Array<[number, number]> = [
      [-60.7035826, -31.9551536],
      [-59.9875480, -32.7282481],
      [-59.3283683, -33.2261903],
      [-59.1306144, -33.1111758],
      [-58.4439689, -33.2813436],
      [-58.3615714, -34.0498202],
      [-58.4879142, -34.4903853],
      [-60.2457267, -33.3685985],
      [-60.7016593, -32.8991555],
      [-60.8115226, -32.5199454],
      [-60.7071524, -31.9574472],
      [-60.3555905, -32.3289323]
    ];

    const filteredFires = lines
        .filter((fire: any) => {
            const lat = parseFloat(fire.latitude);
            const lon = parseFloat(fire.longitude);
            return this.isPointInsidePolygon(lat, lon, polygon); //&& fire.confidence >= 40; 
            //delete ';//' in line 195 after '...(lat, lon, polygon) ' to filter shown hotspots, leaving only those that are likely to be real fires
        });

    return filteredFires;
}

private Today(): any{
  const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because January is 0
    const day = now.getDate().toString().padStart(2, '0');

    const todayDate = `${year}-${month}-${day}`;
    return todayDate;
}

private randomPointInPolygon(): any{

  const insidePolygon: Array<[number, number]> = [
    [-59.7095706, -33.3421606],
    [-59.5942142, -33.5118786],
    [-59.2096927, -33.5439501],
    [-59.3085696, -33.3926520],
    [-59.4788577, -33.7498394],
    [-59.8468997, -33.5989020],
    [-59.8139407, -32.9786816],
    [-60.3577640, -33.1353003],
    [-58.5999515, -33.4110052],
    [-58.6054446, -33.8092268],
    [-58.7812259, -33.6217884],
    [-58.6109378, -34.1191965],
    [-58.8416507, -34.1146463],
    [-58.8746097, -33.8411876],
    [-59.0503909, -33.8776995],
    [-58.9570071, -33.6034798],
    [-59.0119388, -33.4431140],
    [-60.5774905, -32.6923670],
    [-60.5884769, -32.3587168],
    [-60.4511478, -32.8818075],
  ];
  
  return insidePolygon[Math.floor(Math.random() * 19)];

}

}

