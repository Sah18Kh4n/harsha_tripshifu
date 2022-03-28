import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class EmailVerificationService {

  private verificationStatus: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() { }

  verified() {
    this.verificationStatus.next(true);
  }

  notverified() {
    this.verificationStatus.next(false);
  }

  getVerificationState(): Observable<any> {
    return this.verificationStatus.asObservable();
  }
}
