import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { environment } from 'projects/dashboard/src/environments/environment';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']

})
export class HeaderComponent implements OnInit {

  slug: string;
  sidebarState: string;

  @ViewChild('sidebar', { static: false }) sidebar: SidebarComponent;
  @Output() toggleSidebar: EventEmitter<string> = new EventEmitter();

  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.sidebarState = 'open';
    this.commonService.getSlug().subscribe(slug => {
      this.slug = slug;
    });
  }

  onToggleSidebar() {
    if (this.sidebarState === 'open') {
      this.sidebarState = 'close';
      this.toggleSidebar.emit('close');
    } else {
      this.sidebarState = 'open';
      this.toggleSidebar.emit('open');
    }
    this.sidebar.toggleSidebar();
  }

  viewProfile() {
    window.open(`${environment.storefrontBase + this.slug}?source=preview`);
  }
}
