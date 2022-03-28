import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderState = new BehaviorSubject<any>(false);

  constructor() { }

  show() {
    this.loaderState.next(true);
  }

  hide() {
    this.loaderState.next(false);
  }

  getLoaderState(): Observable<any> {
    return this.loaderState.asObservable();
  }
}
