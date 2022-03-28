import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ShareService } from '@ngx-share/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-profile-body',
  templateUrl: './profile-body.component.html',
  styleUrls: ['./profile-body.component.css']
})
export class ProfileBodyComponent implements OnInit {

  profilebody: any;
  heading = 'Tabs';
  subheading = 'Tabs are used to split content between multiple sections. Wide variety available.';
  icon = 'pe-7s-drawer icon-gradient bg-happy-itmeo';
  currentJustify = 'start';
  currentJustify2 = 'center';
  currentJustify3 = 'start';
  currentOrientation = 'horizontal';
  @Input() profile: any;
  @Output() slugChange: EventEmitter<string> = new EventEmitter();
  showLoader: boolean;
  subscription: Subscription;

  constructor(
    private share: ShareService,
    library: FaIconLibrary
  ) { }

  ngOnInit() {
  }

  onSlugChange(slug: string) {
    this.slugChange.emit(slug);
  }
}
