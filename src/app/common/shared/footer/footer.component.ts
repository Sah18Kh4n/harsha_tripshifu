import { Component, OnInit } from '@angular/core';
import { environment } from 'projects/dashboard/src/environments/environment';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  footerLinks: any;
  storeLink: string;
  appVersion: string;

  constructor(
    private generalService: GeneralService
  ) {
    this.footerLinks = {
      information: [],
      newsletter: [],
      links: []
    };
    this.appVersion = environment.version;
    this.storeLink = environment.storefrontBase;
  }

  ngOnInit() {
    this.generalService.getFooterLinks()
      .subscribe(result => {
        if (result.success === true) {
          result.data.map(link => {
            if (link.group === 'information') {
              this.footerLinks.information.push(link);
            } else if (link.group === 'links') {
              this.footerLinks.links.push(link);
            } else {
              this.footerLinks.newsletter.push(link);
            }
          });
        }
      });
  }

}
