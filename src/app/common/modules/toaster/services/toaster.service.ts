import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  toaster: Subject<any>;

  constructor() {
    this.toaster = new Subject<any>();
  }

  success(toasterProps: ToasterConfig) {
    this.toaster.next({
      type: 'success',
      props: toasterProps
    });
  }

  warning(toasterProps: ToasterConfig) {
    this.toaster.next({
      type: 'warning',
      props: toasterProps
    });
  }

  error(toasterProps: ToasterConfig) {
    this.toaster.next({
      type: 'error',
      props: toasterProps
    });
  }

  info(toasterProps: ToasterConfig) {
    this.toaster.next({
      type: 'info',
      props: toasterProps
    });
  }
}
