import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileAdapter } from '../../adapters/profileadapters';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';
import { ProfileServices } from '../../services/profile.services';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {

  formdata: any;
  loading: boolean;
  successMessage: string;
  errorMessage: string;
  bankDetailForm: FormGroup;
  
  @Input() profile: any;

  constructor(
    public profileadapter: ProfileAdapter,
    private authenticationService: AuthenticationService,
    private profileservice: ProfileServices,
    private ls: LoaderService,
  ) { }

  ngOnInit() {
    this.bankDetailForm = new FormGroup({
      actHolderName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(95),
        Validators.pattern(/^[a-zA-Z ]*$/)
      ]),

      actNo: new FormControl(null, [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(17),
        Validators.pattern(/^[0-9]*$/)
      ]),

      bankName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(95),
        Validators.pattern(/^[a-zA-Z ]*$/)
      ]),

      ifscCode: new FormControl(null, [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern(/^[a-zA-Z0-9]*$/)
      ]),

      panNo: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^[a-zA-Z0-9]*$/)
      ]),

      gstIn: new FormControl(null, [
        Validators.minLength(15),
        Validators.maxLength(15),
        Validators.pattern(/^[a-zA-Z0-9]*$/)
      ])
    });
    this.loadFormValues();
  }

  get f() {
    return this.bankDetailForm.controls;
  }

  loadFormValues() {
    this.profile.bank_details ? this.f.actHolderName.setValue(this.profile.bank_details.account_holder_name) : '';
    this.profile.bank_details ? this.f.actNo.setValue(this.profile.bank_details.account_number) : '';
    this.profile.bank_details ? this.f.bankName.setValue(this.profile.bank_details.bank_name) : '';
    this.profile.bank_details ? this.f.ifscCode.setValue(this.profile.bank_details.ifsc_code) : '';
    this.profile.bank_details ? this.f.panNo.setValue(this.profile.bank_details.pan_card_number) : '';
    this.profile.bank_details ? this.f.gstIn.setValue(this.profile.bank_details.gstin) : '';
  }

  onSubmitBankData(): void {
    this.loading = true;
    this.ls.show();
    
    if (this.f.actHolderName.invalid) {
      this.errorMessage = 'Invalid Account Holder Name';
    } else if (this.f.actNo.invalid) {
      this.errorMessage = 'Invalid Account Number';
    } else if (this.f.bankName.invalid) {
      this.errorMessage = 'Invalid Bank Name';
    } else if (this.f.ifscCode.invalid) {
      this.errorMessage = 'Invalid IFSC CODE';
    } else if (this.f.panNo.invalid) {
      this.errorMessage = 'Invalid PAN Card Number';
    } else if (this.f.gstIn.invalid) {
      this.errorMessage = 'Invalid GSTIN';
    } else {
      this.errorMessage = '';
    }
    if(this.errorMessage !== '') {
      this.clearMsg();
      return ;
    }
    this.formdata = this.bankDetailForm.value;
    this.formdata.userId = this.profile.user_id;
    this.formdata.influencerId = this.profile.influencer_id;
    const userId = this.authenticationService.getUserId();
    this.profileservice.editbankdata(userId, this.formdata).subscribe(
      res => {
        if (res.success === true) {
          this.successMessage = 'Saved successfully';
        } else {
          this.errorMessage = res.message;
          setTimeout(()=>{
            this.errorMessage = '';
          }, 2000)
        }
        this.ls.hide();
        setTimeout(()=>{
          this.successMessage = '';
        }, 2000)
      },
      error => { },
      () => {
        this.loading = false;
        this.ls.hide();
      }
    );
  }

  clearMsg(){
    this.loading = false;
    this.ls.hide();
    setTimeout(()=>{
      this.errorMessage = '';
    }, 2000);
  }
}
