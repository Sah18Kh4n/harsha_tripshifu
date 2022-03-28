import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MiniLoaderService {

  private loaderState = new BehaviorSubject<boolean>(false);

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
