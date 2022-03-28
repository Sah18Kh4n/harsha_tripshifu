import { Component, OnInit, Input , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-bookingdetails-popup',
  templateUrl: './bookingdetails-popup.component.html',
  styleUrls: ['./bookingdetails-popup.component.css']
})
export class BookingdetailsPopupComponent implements OnInit {

  bookingDetails: any;
  @Input() visible: boolean;
  @Input() details: any;
  @Output() closePopUp: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.bookingDetails = this.details;
  }

  close() {
    this.visible = false;
    this.closePopUp.emit();
  }

  onHide() {
    this.close();
  }

}
