import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/dashboard/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  newApiEndpointUrl:string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.newApiEndpointUrl = environment.apiBase;
  }

  getFooterLinks():any{
    const endpointUrl = this.newApiEndpointUrl + 'general/footerlinks?platform=tripshifu';
    return this.httpClient.get(endpointUrl);
  }
}
