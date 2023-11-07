import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PharmaProduct } from '../models/pharma-product'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchProductService {

  private basePath: string = "http://localhost:80";
  constructor(
    private http:HttpClient,
  ) { }

  findAll(name: string, longitude: string, latitude: string, distance: string): Observable<PharmaProduct[]> {
    const path = "/api/v1/pharma"
    let url= this.basePath+path;

    const params = new HttpParams()
      .set('name', name)
      .set('longitude', longitude)
      .set('latitude', latitude)
      .set('distance', distance);

    return this.http.get<PharmaProduct[]>(url, {params});
  }

}
