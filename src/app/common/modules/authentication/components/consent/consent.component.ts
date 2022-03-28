import { Component, OnInit } from '@angular/core';
import { ConsentService } from '../../services/consent.service';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.css']
})
export class ConsentComponent implements OnInit {

  show: boolean;

  constructor(
    private consentService: ConsentService
  ) { }

  ngOnInit() {
    const consent = this.consentService.getConsent();
    if (consent) {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  accept() {
    this.show = false;
    this.consentService.acceptCookies();
  }

}
