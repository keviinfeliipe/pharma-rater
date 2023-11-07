import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { LngLat, Map, Marker } from 'mapbox-gl';
import { SearchProductService } from '../../services/search-product.service'
import { PharmaProduct } from '../../models/pharma-product'

interface MarkerAndColor {
  color: string,
  marker: Marker
}

interface PlainMarker {
  lnglat: number[]
}

@Component({
  templateUrl: './full-screen-page.component.html',
  styleUrls: ['./full-screen-page.component.scss']
})
export class FullScreenPageComponent implements AfterViewInit{

  constructor(
    public searchProductService:SearchProductService,
  ){

  }

  @ViewChild('map') divMap?: ElementRef;
  public map?: Map;

  public currenLocation?:Marker;
  public markers: MarkerAndColor[] = [];
  products : PharmaProduct[] = [];

  ngAfterViewInit(): void {

    if( !this.divMap ) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.2119127687266, 4.577967751500744], // starting position [lng, lat]
      zoom: -2, // starting zoom
      });
      this.currentLocation();
      this.searchProducts();
  }

  addMarker(lnglat: LngLat, color: string) {
    if (!this.map) return;
    const marker = new Marker({
      color: color,
      draggable: false,
    })
      .setLngLat(lnglat)
      .addTo(this.map);
    this.markers.push({
      color, marker
    });
  }

  flyTo(marker: Marker) {
    this.map?.flyTo({
      zoom: 15,
      center: marker.getLngLat(),
    });
  }

  saveToLocalStorage(key:string,marker:Marker) {
    const lnglat = marker.getLngLat().toArray();
    localStorage.setItem(key, JSON.stringify(lnglat));
  }

  currentLocation(){
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (!this.map) return;
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const coords = new LngLat( longitude, latitude );
        this.currenLocation = new Marker({
          draggable: false,
        })
        .setLngLat(coords)
        .addTo(this.map);;
        this.flyTo(this.currenLocation);
        this.saveToLocalStorage("initialPosition", this.currenLocation);
        
      }, function(error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log("El usuario denegó la solicitud de geolocalización.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("La información de geolocalización no está disponible.");
            break;
          case error.TIMEOUT:
            console.log("Se agotó el tiempo para obtener la geolocalización.");
            break;
          default:
            console.log("Ocurrió un error desconocido: " + error.message);
        }
      });
    } else {
      console.log("La geolocalización no es compatible en este navegador.");
    }
  }

  searchProducts(){
    this.searchProductService.findAll("bloqueador","-74.2119127687266","4.577967751500744","2000").subscribe((data)=>{
      this.products = data;
      console.log(this.products)
      this.products.forEach(({longitude, latitude})=>{
        const coords = new LngLat( Number(longitude), Number(latitude) );
        this.addMarker(coords, 'red');
      })
    })
  }

}
