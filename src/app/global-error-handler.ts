import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: Error) {
    console.log('Global Handler: ', error.name + ', ' + error.message);
  }
}
