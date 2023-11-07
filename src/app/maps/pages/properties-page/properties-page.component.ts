import { Component, OnInit } from '@angular/core';
import { SearchProductService } from '../../services/search-product.service'
import { PharmaProduct } from '../../models/pharma-product'


@Component({
  templateUrl: './properties-page.component.html',
  styleUrls: ['./properties-page.component.scss']
})

export class PropertiesPageComponent implements OnInit {

  products : PharmaProduct[] = [];

  constructor(
    public searchProductService:SearchProductService,
  ){

  }
  ngOnInit(): void {
    this.searchProducts();
    this.currentLocation();
  }

  searchProducts(){
    this.searchProductService.findAll("bloqueador","-74.2119127687266","4.577967751500744","2000").subscribe((data)=>{
      console.log(data);
      this.products = data;
    })
  }

  currentLocation(){
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("Latitud: " + latitude);
        console.log("Longitud: " + longitude);
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
}
