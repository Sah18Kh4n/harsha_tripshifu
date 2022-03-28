import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faCircle, IconDefinition, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  statusIcon: IconDefinition;
  statusClass: string;
  statusText: string;
  locationImage: any;
  closeIcon: IconDefinition;
  @Input() location: any;
  @Input() editLink: string;
  @Output() locationDeleted: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {
    this.statusIcon = faCircle;
    this.closeIcon = faTimesCircle;
    this.setLocationImage();
    this.setStatusClass();
  }

  setLocationImage() {
    if (this.location.image !== null) {
      this.locationImage = {
        backgroundImage: 'url(' + encodeURI(this.location.image) + ')'
      };
    }
  }

  setStatusClass() {
    if (this.location.status === 1) {
      this.statusClass = 'active';
      this.statusText = 'Approved';
    } else {
      this.statusClass = 'pending';
      this.statusText = 'Pending Approval';
    }
  }

  editLocation() {
      if (this.location.packageCount > 0) {
        this.router.navigateByUrl(this.editLink + this.location._id + '/experiences');
      } else {
        this.router.navigateByUrl(this.editLink + this.location._id + '/stays');
      }
  }

  deleteLocation() {
    if (confirm('Are you sure about deleting this location?')) {
      this.locationDeleted.emit(this.location._id);
    }
  }
}
