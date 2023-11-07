import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.scss']
})
export class ZoomRangePageComponent implements AfterViewInit{
  @ViewChild('map') divMap?: ElementRef;

  public zoom: number = 10;
  public map?: Map;
  public lnglat: LngLat = new LngLat(-74.2119127687266, 4.577967751500744);

  ngAfterViewInit(): void {  

    if( !this.divMap ) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, 
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lnglat, // starting position [lng, lat]
      zoom: this.zoom, 
      });
      this.mapListeners();
  }

  mapListeners(){
    if(!this.map) throw  "Mapa no inicializado";

    this.map.on('zoom', (ev) => {
      this.zoom = this.map!.getZoom();
    })

    this.map.on('zoomend', (ev) => {
      if(this.map!.getZoom() < 18) return;
      this.map!.zoomTo(18);
    })
  }

  zoomIn(){
    this.map?.zoomIn();
  }

  zoomOut(){
    this.map?.zoomOut();
  }

  zoomChanged(value:string){
    this,this.zoom = Number(value);
    this.map?.zoomTo(this.zoom);
  }

}
