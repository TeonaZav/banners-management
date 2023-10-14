import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private endpointBannersFind = 'banners/find';
  private endpointGetImg = 'blob/';
  private domain: string | undefined;

  constructor(private httpClient: HttpClient) {
    this.domain = environment.domain;
  }

  getAvailableBanners() {
    const url = `${this.domain}${this.endpointBannersFind}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: environment.accessToken,
      }),
    };
    const body = {
      excludes: [''],
      searchAfter: [''],
      pageSize: 100,
    };

    return this.httpClient.post<any>(url, JSON.stringify(body), httpOptions);
  }

  getImage(imageId: string) {
    const url = `${this.domain}${this.endpointGetImg}${imageId}`;

    let httpheaders = new HttpHeaders().set('accept', 'image/webp,*/*');

    return this.httpClient.get<any>(url, {
      headers: httpheaders,
      responseType: 'blob' as 'json',
    });
  }
}
