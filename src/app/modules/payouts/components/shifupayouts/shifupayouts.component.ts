import { Component, OnInit } from '@angular/core';
import { ShifupayoutsserviceService } from '../../service/shifupayoutsservice.service';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';
import { ProfileServices } from '../../../profile/services/profile.services';

@Component({
  selector: 'app-shifupayouts',
  templateUrl: './shifupayouts.component.html',
  styleUrls: ['./shifupayouts.component.css']
})
export class ShifupayoutsComponent implements OnInit {

  sidebarSpacing: any;
  influencer_id: number;
  userId: string;
  payoutDetails: object;
  payoutLedgers: any;
  total_credits_earned: number;
  total_credits_redeemed: number;
  available_balance_credits: number;
  nxtOffset: number;
  preOffset: number;
  limit: number;
  nxt_btn: boolean;
  pre_btn: boolean;
  message: boolean;

  constructor(
    private Shifupayoutsservice: ShifupayoutsserviceService,
    private authenticationService: AuthenticationService,
    private profileservice: ProfileServices,
    private ls: LoaderService,
  ) { }

  ngOnInit() {
    this.ls.show();
    this.message = false;
    this.nxtOffset = 0;
    this.preOffset = 0;
    this.limit = 5;
    this.total_credits_earned = 0;
    this.total_credits_redeemed = 0;
    this.available_balance_credits = 0;
    this.sidebarSpacing = 'contracted';
    this.userId = this.authenticationService.getUserId();
    this.profileservice.getprofile(this.userId).subscribe(res => {
      if (res.success === true) {
        this.influencer_id = res.data.profile.influencer_id;
        this.Shifupayoutsservice.getShifuPayoutsDetails(this.influencer_id, this.nxtOffset, this.limit).subscribe(
          res => {
            if (res.success === true) {
              this.payoutDetails = res.data.profile.payoutDetails;
              if(res.data.profile.payoutDetails != null){
                this.total_credits_earned = res.data.profile.payoutDetails.total_credits_earned;
                
                this.total_credits_redeemed = res.data.profile.payoutDetails.total_credits_redeemed;
                
                this.available_balance_credits = res.data.profile.payoutDetails.available_balance_credits;
                console.log(this.total_credits_earned, this.total_credits_redeemed, this.available_balance_credits);
              }

              if(res.data.profile.payoutLedgers.length != 0 && this.payoutLedgers != res.data.profile.payoutLedgers) {
                this.payoutLedgers = res.data.profile.payoutLedgers;
                this.nxtOffset = this.nxtOffset + res.data.profile.payoutLedgers.length;
                this.nxt_btn = true;
                this.pre_btn = false;
              }
            }
            this.ls.hide();
          },
          error => { },
          () => {
            this.ls.hide();
          }
        );
      }
    });
  }

  
  nxtLedgerPage() {
    this.ls.show();
    this.Shifupayoutsservice.getShifuPayoutsDetails(this.influencer_id, this.nxtOffset, this.limit).subscribe(
      res => {
        if (res.success === true) {
          if(res.data.profile.payoutLedgers.length != 0 && this.payoutLedgers != res.data.profile.payoutLedgers) {
            this.preOffset = this.nxtOffset;
            this.payoutLedgers = res.data.profile.payoutLedgers;
            this.nxtOffset = this.nxtOffset + res.data.profile.payoutLedgers.length;
            this.pre_btn = true;
          } else {
            this.nxt_btn = false;
            this.pre_btn = true;
            this.message = true;
          }
        }
        this.ls.hide();
      },
      error => { },
      () => {
        this.ls.hide();
      }
    );
  }

  preLedgerPage() {
    this.ls.show();
    if(this.message){
      this.message = false;
    }
    if(this.preOffset != 0){
      this.nxtOffset = this.preOffset;
      this.preOffset = this.nxtOffset - this.limit;
    }
    this.Shifupayoutsservice.getShifuPayoutsDetails(this.influencer_id, this.preOffset, this.limit).subscribe(
      res => {
        if (res.success === true) {
          if(res.data.profile.payoutLedgers.length != 0 && this.payoutLedgers != res.data.profile.payoutLedgers) {
            this.payoutLedgers = res.data.profile.payoutLedgers;
            this.nxt_btn = true;
          } if(this.preOffset == 0) {
            this.nxt_btn = true;
            this.pre_btn = false;
          }
        }
        this.ls.hide();
      },
      error => { },
      () => {
        this.ls.hide();
      }
    );
  }

  onToggleSidebar(sidebarState) {
    if (sidebarState === 'open') {
      this.sidebarSpacing = 'contracted';
    } else {
      this.sidebarSpacing = 'expanded';
    }
  }

}
