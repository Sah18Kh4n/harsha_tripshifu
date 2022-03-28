import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileServices } from '../../services/profile.services';
import { ProfileAdapter } from '../../adapters/profileadapters';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-location-travelled',
  templateUrl: './location-travelled.component.html',
  styleUrls: ['./location-travelled.component.css']
})
export class LocationTravelledComponent implements OnInit {

  formdata: any;
  label: string;
  latlang: string;
  locations: Array<any>;
  lbl: string;
  errorMessage: string;
  loading: boolean;
  loader: boolean;
  showloader: boolean;

  successMessage: string;
  locationRepeat: boolean;
  locationtravelledSubmitForm: FormGroup;
  @Input() profile: any;
  @Output() outputProfileevent = new EventEmitter();
  @ViewChild('myg', { static: false }) myg: ElementRef;
  @ViewChild('placesRef', { static: false }) placesRef: GooglePlaceDirective;

  constructor(
    public ls: LoaderService,
    public profileadapter: ProfileAdapter,
    private profileservice: ProfileServices,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    if (this.profile) {
      this.locationtravelledSubmitForm = new FormGroup({
        total: new FormControl(this.profile.total_locs),
        label: new FormControl(null, [Validators.required]),
        country: new FormControl(null)
      });
    } else {
      this.locationtravelledSubmitForm = new FormGroup({
        total: new FormControl(null),
        label: new FormControl(null),
        country: new FormControl(null)
      });
    }
    this.locations = new Array();
    if (this.profile.locations.length > 0) {
      this.profile.locations.map(location => {
        this.locations.push({
          influencerlocationId: location.influencerlocation_id,
          location: location.label
        });
      });
    }
  }

  get f() {
    return this.locationtravelledSubmitForm.controls;
  }

  handleAddressChange(address: Address) {
    this.clearMessages();
    this.locationRepeat = false;
    this.setCountry(address);
    if (this.locations.length > 0) {
      this.locations.map(location => {
        if (location.location === address.formatted_address) {
          this.locationRepeat = true;
        }
      });
      if (this.locationRepeat) {
        this.f.label.reset();
        this.errorMessage = 'Already existing location';
        return;
      }
      this.f.label.setValue(address.formatted_address);
      this.label = this.f.label.value;
      this.latlang = address.geometry.location.lat() + ',' + address.geometry.location.lng();
    } else {
      this.locationRepeat = false;
      this.f.label.setValue(address.formatted_address);
      this.label = address.formatted_address;
      this.latlang = address.geometry.location.lat() + ',' + address.geometry.location.lng();
    }
  }

  setCountry(address) {
    if (address.address_components.length > 0) {
      address.address_components.filter(component => {
        if (component.types.indexOf('country') >= 0) {
          this.f.country.setValue(component.long_name);
        }
      });
    }
  }

  emptytext() {
    this.myg.nativeElement.value = '';
  }

  onSubmitlocationtravelled(): void {
    this.ls.show();
    this.clearMessages();
    if (this.locationtravelledSubmitForm.status === 'INVALID') {
      this.ls.hide();
      this.f.label.markAsDirty();
      return;
    }
    if (this.f.total.value === this.profile.total_locs
      && (this.f.label.value === undefined
        || this.f.label.value === '')) {
      return;
    }
    if (this.locationRepeat === true) {
      this.locationtravelledSubmitForm.get('label').reset();
      this.errorMessage = 'Already existing location';
      this.locationRepeat = false;
      return;
    }
    const userId = this.authenticationService.getUserId();
    this.loading = true;
    const data = {
      latlng: this.latlang,
      label: this.label,
      country: this.f.country.value
    };
    this.profileservice.locationtravelled(userId, data).subscribe(
      res => {
        this.ls.hide();
        if (res.success === true) {
          if (res.data.influencerlocation_id !== 0) {
            this.locations.push({
              influencerlocationId: res.data.influencerlocation_id,
              location: data.label
            });
            this.profile.locations.push({
              influencerlocationId: res.data.influencerlocation_id,
              location: data.label
            });
          }
          // this.profile.total_locs = data.total;
          this.outputProfileevent.emit(this.profile);
          this.successMessage = 'Saved successfully';
          this.f.label.reset('');
        } else {
          this.errorMessage = res.message;
          this.f.label.reset('');
        }
      },
      error => {
      },
      () => {
        this.loading = false;
      });
  }

  deleteLocation(influencerlocationId) {
    this.ls.show();
    this.clearMessages();
    const data = {
      influencerlocation_id: influencerlocationId
    };
    const userId = this.authenticationService.getUserId();
    this.profileservice.deleteLocation(userId, data).subscribe(
      res => {
        this.ls.hide();
        if (res.success === true) {
          this.locations = this.locations.filter(location => {
            if (location.influencerlocationId !== influencerlocationId) {
              return location;
            }
          });
          this.outputProfileevent.emit(this.profile);
          this.successMessage = 'Deleted successfully';
        } else {
          this.errorMessage = res.message;
        }
      },
      error => {
      },
      () => {
        this.loading = false;
      });
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
