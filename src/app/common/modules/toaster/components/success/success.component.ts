import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit, OnChanges {

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
