import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ProductService {

  s3Base: string;
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBase;
    this.s3Base = 'https://funstay010121.s3.ap-south-1.amazonaws.com/';
  }

  getProductsByLocation(locationId): Observable<any> {
    const url = this.baseUrl + 'influencer/product/all/' + locationId;
    return this.http.get(url);
  }

  getLocationDetails(param): Observable<any> {
    const url = this.baseUrl + 'influencer/product/location/details/' + param.type + '/' + param.keyword;
    return this.http.get(url);
  }

  searchHotel(userId, key, data): Observable<any> {
    const queryString = this.buildSearchQueryStringNew(key, data);
    const url = this.baseUrl + 'influencer/product/hotel/search_key/' + userId + queryString;
    return this.http.get(url);
  }

  searchPackage(userId, key, data): Observable<any> {
    const queryString = this.buildSearchQueryStringNew(key, data);
    const url = this.baseUrl + 'influencer/product/package/search_key/' + userId + queryString;
    return this.http.get(url);
  }

  getListingsByLocation(userId, query = null): Observable<any> {
    const queryString = this.buildSearchQueryString(query);
    const url = this.baseUrl + 'influencer/product/listing/search/' + userId + queryString;
    return this.http.get(url);
  }

  getHotelsByLocation(userId, query = null): Observable<any> {
    const queryString = this.buildSearchQueryString(query);
    const url = this.baseUrl + 'influencer/product/hotel/search/' + userId + queryString;
    return this.http.get(url);
  }

  getPackagesByLocation(userId, query = null): Observable<any> {
    const queryString = this.buildSearchQueryString(query);
    const url = this.baseUrl + 'influencer/product/packages/search/' + userId + queryString;
    return this.http.get(url);
  }

  addProductListing(userId, data: any): Observable<any> {
    const url = this.baseUrl + 'influencer/product/listing/' + userId;
    return this.http.post(url, data);
  }

  addProductPackage(userId, data: any): Observable<any> {
    const url = this.baseUrl + 'influencer/product/package/' + userId;
    return this.http.post(url, data);
  }

  updateProductListing(userId, data: any): Observable<any> {
    const url = this.baseUrl + 'influencer/product/listing/' + userId;
    return this.http.put(url, data);
  }

  deleteProduct(userId, data: any): Observable<any> {
    const url = this.baseUrl + 'influencer/product/listing/delete/' + userId;
    return this.http.post(url, data);
  }

  addProductImage(userId, data: any): Observable<any> {
    const url = this.baseUrl + 'influencer/product/listing/image/' + userId;
    return this.http.post(url, data);
  }

  deleteProductImage(userId, data: any): Observable<any> {
    const url = this.baseUrl + 'influencer/product/listing/image/delete/' + userId;
    return this.http.post(url, data);
  }

  replaceProductImage(userId, data: any): Observable<any> {
    const url = this.baseUrl + 'influencer/product/listing/image/replace/' + userId;
    return this.http.post(url, data);
  }

  saveImageOrder(userId, data: any): Observable<any> {
    const url = this.baseUrl + 'influencer/product/listing/image/order/' + userId;
    return this.http.post(url, data);
  }

  buildSearchQueryString(data: any): string {
    let queryString = '';
    if (data.city) {
      queryString = queryString + '/city-' + data.city;
    } else {
      queryString = queryString + '/city-';
    }
    if (data.state) {
      queryString = queryString + '/state-' + data.state;
    } else {
      queryString = queryString + '/state-';
    }
    if (data.country) {
      queryString = queryString + '/country-' + data.country;
    } else {
      queryString = queryString + '/country-';
    }
    if (data.tagIds.length > 0) {
      queryString = queryString + '/tags-';
      data.tagIds.map(tagId => {
        queryString = queryString + tagId + ',';
      });
    } else {
      queryString = queryString + '/tags-';
    }
    if (data.offset) {
      queryString = queryString + '?offset=' + data.offset;
    } else {
      queryString = queryString + '?offset=0';
    }
    if (data.limit) {
      queryString = queryString + '&limit=' + data.limit;
    } else {
      queryString = queryString + '&limit=10';
    }
    return queryString;
  }

  buildSearchQueryStringNew(key, data){
    let queryString = '';
    if (data.city) {
      queryString = queryString + '/city-' + data.city;
    } else {
      queryString = queryString + '/city-';
    }
    if (data.state) {
      queryString = queryString + '/state-' + data.state;
    } else {
      queryString = queryString + '/state-';
    }
    if (data.country) {
      queryString = queryString + '/country-' + data.country;
    } else {
      queryString = queryString + '/country-';
    }
    if (key) {
      queryString = queryString + '?key=' + key;
    } else {
      queryString = queryString + '?key=';
    }
    if (data.offset) {
      queryString = queryString + '&offset=' + data.offset;
    } else {
      queryString = queryString + '&offset=0';
    }
    if (data.limit) {
      queryString = queryString + '&limit=' + data.limit;
    } else {
      queryString = queryString + '&limit=5';
    }
    return queryString;
  }

  rateProduct(userId, data: any): Observable<any> {
    const url = this.baseUrl + 'influencer/product/listing/rating/' + userId;
    return this.http.put(url, data);
  }
}
