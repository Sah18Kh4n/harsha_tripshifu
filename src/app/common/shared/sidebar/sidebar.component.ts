import { Component, OnInit } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('toggleSidebar', [
      state('close', style({
        width: '55px'
      })),
      state('open', style({
        width: '142px',
      })),
      transition('close => open', [
        animate('300ms')
      ]),
      transition('open => close', [
        animate('300ms')
      ])
    ]),
    trigger('mToggleSidebar', [
      state('close', style({
        width: '0px',
        visibility: 'hidden'
      })),
      state('open', style({
        width: '142px',
        visibility: 'visible'
      })),
      transition('close => open', [
        animate('300ms')
      ]),
      transition('open => close', [
        animate('300ms')
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {

  device: string;
  state: string;
  closed: boolean;

  constructor() {
  }

  ngOnInit(): void {
    if (window.innerWidth > 992) {
      this.device = 'desktop';
      this.state = 'open';
    } else {
      this.device = 'mobile';
      this.state = 'close';
    }
    this.closed = false;
  }

  toggleSidebar() {
    if (this.state === 'open') {
      this.state = 'close';
      this.closed = true;
    } else {
      this.state = 'open';
      this.closed = false;
    }
  }

  open() {
    if (this.state === 'close' && this.closed) {
      this.state = 'open';
    }
  }

  close() {
    if (this.state === 'open' && this.closed) {
      setTimeout(() => {
        this.state = 'close';
      }, 400);
    }
  }

  getClosedStyle() {
    return {
      width: '55px'
    };
  }

  getOpenedStyle() {
    return {
      width: '200px'
    };
  }
}
