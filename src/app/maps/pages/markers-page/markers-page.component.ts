import { Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string,
  marker: Marker
}

interface PlainMarker {
  color: string,
  lnglat: number[]
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.scss']
})
export class MarkersPageComponent {

  @ViewChild('map') divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];

  public map?: Map;
  public lnglat: LngLat = new LngLat(-74.2119127687266, 4.577967751500744);

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lnglat, // starting position [lng, lat]
      zoom: 13,
    });

    this.readFromLocalStorage();

    //const markerHtml = document.createElement('div');
    //markerHtml.innerHTML = "kevin";

    //const marker = new Marker({
    //  color: 'red',
    //  element: markerHtml,
    //})
    //  .setLngLat(this.lnglat)
    //  .addTo(this.map);

  }

  createMarker() {
    if (!this.map) return;
    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const lnglat = this.map.getCenter();
    this.addMarker(lnglat, color);
  }

  deleteMarker(index: number) {
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
  }

  addMarker(lnglat: LngLat, color: string) {
    if (!this.map) return;
    const marker = new Marker({
      color: color,
      draggable: true,
    })
      .setLngLat(lnglat)
      .addTo(this.map);
    this.markers.push({
      color, marker
    });

    marker.on('dragend', ()=>this.saveToLocalStorage());

    this.saveToLocalStorage();
  }

  flyTo(marker: Marker) {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat(),
    });
  }

  saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map(({ color, marker }) => {
      return {
        color,
        lnglat: marker.getLngLat().toArray()
      }
    });
    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));
  }

  readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString ); //! OJO!

    plainMarkers.forEach( ({ color, lnglat }) => {
      const [ lng, lat ] = lnglat;
      const coords = new LngLat( lng, lat );

      this.addMarker( coords, color );
    })

  }

}
