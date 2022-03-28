import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { faPlusSquare, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  addNewIcon: IconDefinition;
  newListingRouterLink: string;
  editListingRouterLink: string;
  locations: any;
  sidebarSpacing: any;
  showLoader: boolean;
  @Input() onboarding: string;
  subscription: Subscription;

  constructor(
    private loaderService: LoaderService,
    private locationService: LocationService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.locations = [];
    this.addNewIcon = faPlusSquare;
    if (this.onboarding === 'true') {
      this.newListingRouterLink = '/product/new/onboard';
      this.editListingRouterLink = '/product/edit/onboard/';
    } else {
      this.newListingRouterLink = '/product/new';
      this.editListingRouterLink = '/product/edit/';
    }
    this.setLocations();
    // window.Appcues.identify(this.authenticationService.getUserId());
  }

  setLocations(): void {
    const userId = this.authenticationService.getUserId();
    this.loaderService.show();
    this.locationService.getLocations(userId).subscribe(result => {
      this.loaderService.hide();
      if (result.success === true) {
        this.locations = result.data;
      }
    });
  }

  onLocationDelete(locationId) {
    this.loaderService.show();
    const data = {
      location_id: locationId
    };
    const userId = this.authenticationService.getUserId();
    this.locationService.deleteLocation(userId, data).subscribe(
      res => {
        this.loaderService.hide();
        if (res.success === true) {
          this.locations = this.locations.filter(location => {
            if (location._id !== locationId) {
              return location;
            }
          });
        } else {

        }
      },
      error => {},
      () => {}
    );
  }
}
