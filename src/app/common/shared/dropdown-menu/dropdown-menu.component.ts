import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { environment } from 'projects/dashboard/src/environments/environment';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
  animations: [
    trigger('menu', [
      state('close', style({
        visibility: 'hidden',
        opacity: 0,
        transform: 'translateY(-15px)'
      })),
      state('open', style({
        visibility: 'visible',
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('close => open', [
        animate('100ms')
      ]),
      transition('open => close', [
        animate('50ms')
      ])
    ])
  ]
})
export class DropdownMenuComponent implements OnInit {

  profile: any;
  profileAvatarUrl: any;
  slug: string;
  name: string;
  menuState: string;
  myTripsUrl: string;
  settingsClass: string;
  @ViewChild('dropdown', { static: false }) dropdown: ElementRef;

  constructor(
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    
    this.commonService.getAvatar().subscribe(userAvatar => this.profileAvatarUrl = userAvatar);

    this.settingsClass = '';
    this.menuState = 'close';
    // if (this.router.url.includes('onboard')) {
    //   this.settingsClass = 'd-none';
    // }
    this.commonService.getSlug().subscribe(slug => {
      this.slug = slug;
      this.setMyTripsUrl();
    });
    this.commonService.getName().subscribe(name => {
      this.name = encodeURIComponent(name);
      this.setMyTripsUrl();
    });
  }

  setMyTripsUrl() {
    this.myTripsUrl = environment.funstayWebBase + 'user-profile/my-trips?continue=' + encodeURIComponent(environment.storefrontBase + this.slug) + '&owner=' + this.name;
  }

  toggleMenu() {
    if (this.menuState === 'open') {
      this.menuState = 'close';
    } else {
      this.menuState = 'open';
    }
  }

  @HostListener('window:click', ['$event']) onClick($event: MouseEvent) {
    if (this.dropdown && this.dropdown.nativeElement.contains($event.target) === false) {
      this.menuState = 'close';
    }
  }
}
