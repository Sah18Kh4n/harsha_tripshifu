import { Component, OnInit } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {

  type: string;
  toasterProps: ToasterConfig;

  constructor(private toasterService: ToasterService) { }

  ngOnInit() {
    this.toasterService.toaster.subscribe(
      value => {
        switch (value.type) {
          case 'success':
            this.type = 'success';
            break;

          case 'warning':
            this.type = 'warning';
            break;

          case 'error':
            this.type = 'error';
            break;

          case 'info':
            this.type = 'info';
            break;
        }
        this.toasterProps = value.props;
      }
    );
  }
}
