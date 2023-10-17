import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject, throwError, Observable } from 'rxjs';
import { Banner } from './banner.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private endpointBannersFind = 'banners/find';
  private endpointBannerFind = 'banners/find-one';
  private endpointTypesFind = 'reference-data/find';
  private endpointGetImg = 'blob/';
  private endpointUploadImage = 'blob/upload';
  private endpointRemoveImage = 'blob/remove';
  private endpointBannerSave = 'banners/save';
  private domain: string | undefined;

  constructor(private httpClient: HttpClient) {
    this.domain = environment.domain;
  }

  startEditing = new Subject<any>();

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

  getOneBanner(id: string) {
    const url = `${this.domain}${this.endpointBannerFind}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: environment.accessToken,
      }),
    };
    const body = {
      id: id,
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

  uploadImage(file: File) {
    const url = `${this.domain}${this.endpointUploadImage}`;
    const formData = new FormData();
    formData.append('blob', file);

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: environment.accessToken,
      }),
    };

    return this.httpClient.post<any>(url, formData, httpOptions);
  }

  getTypes(): Observable<any> {
    const url = `${this.domain}${this.endpointTypesFind}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: environment.accessToken,
      }),
    };
    const body = {
      typeIds: ['1600', '1700', '1900', '2900'],
      pageSize: 100,
    };

    return this.httpClient.post<any>(url, JSON.stringify(body), httpOptions);
  }

  createBanner(data: Banner) {
    const body = data;
    return this.httpClient.post(
      `${this.domain}${this.endpointBannerSave}`,
      body,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: environment.accessToken,
        }),
        reportProgress: true,
        observe: 'events',
      }
    );
  }
}
