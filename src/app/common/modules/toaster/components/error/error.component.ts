import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit, OnChanges {

  isReady: boolean;
  message: string;
  timeout: number;
  @Input() toasterProps: ToasterConfig;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.toasterProps) {
      this.isReady = true;
      this.message = this.toasterProps.message;
      this.timeout = this.toasterProps.timeOut;
      setTimeout(() => {
        this.isReady = false;
      }, this.timeout);
    }
  }
}
