import { Component, OnInit , ViewChild} from '@angular/core';
import { UsercreationService } from '../usercreation.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router'
import { getAllJSDocTagsOfKind } from 'typescript';
import { getMatFormFieldPlaceholderConflictError } from '@angular/material/form-field';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent,MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgxSpinnerService } from "ngx-spinner";
import { SharedService } from 'src/app/service/shared.service';
import { NotificationService } from 'src/app/service/notification.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service'; 


@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss']
})
export class UserSummaryComponent implements OnInit {
  userSummaryList:any;

  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  presentpage: number = 1;
  pageSize=10;
  isUserPagination: boolean;
  adminForm:FormGroup;
  hide = true;
  hided = true;
  user_summary_id:any;
  user_summary_name:any;
  @ViewChild('changeadmin')changeadmin;


  constructor(private usercreationService: UsercreationService,public sharedService: SharedService,private formBuilder: FormBuilder,
     private notify: NotificationService,private toastr: ToastrService,private SpinnerService: NgxSpinnerService,private errorHandler: ErrorHandlingServiceService) { }

  ngOnInit(): void {
    this.adminForm = this.formBuilder.group({
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])],
      re_password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])],
    });
    this.getUserSummary();
  }

  getUserSummary(pageNumber = 1) {
    this.usercreationService.getUserSummary(pageNumber, this.sharedService.portal_code)
      .subscribe(result => {
        this.userSummaryList = result['data']
        let dataPagination = result['pagination'];
        if (this.userSummaryList.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
          this.isUserPagination = true;
        } if (this.userSummaryList <= 0) {
          this.isUserPagination = false;
        }

        console.log("VendorSummary", result)
      })
  }
  
  

  nextClick() {
    if (this.has_next === true) {
      this.getUserSummary(this.presentpage + 1)
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.getUserSummary(this.presentpage - 1)
    }

}


portaluserActiveInactive(status, linedata) {
  let code = linedata?.code
  this.usercreationService.portaluserActiveInactive(code, status)
    .subscribe(results => {
      console.log("results", results)
      this.notify.showSuccess("Success")
      this.getUserSummary(1) 
    })
}

resetforn(linedata){
  this.user_summary_id = linedata?.id
  this.user_summary_name = linedata?.name
  // this.adminForm.patchValue({
  //   "password": "",
  //   "re_password":"",
  //   "user_id":""
  // })
  this.adminForm = this.formBuilder.group({
    password: ['', Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ])],
    re_password: ['', Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ])],
  });
}


  // change pwd

  admin_submit(){
    this.SpinnerService.show();
   
    if (this.adminForm.value.password === "") {
      this.toastr.error('', 'Please Enter New Password', { timeOut: 1500 });
      this.SpinnerService.hide();
      return false;
    }
    if (this.adminForm.value.re_password === "") {
      this.toastr.error('', 'Please Enter Confirm Password', { timeOut: 1500 });
      this.SpinnerService.hide();
      return false;
    }
    this.adminForm.value.user_id = this.user_summary_id;

    this.usercreationService.getAdmin(this.adminForm.value)
      .subscribe((result) => {
        console.log(result)
    if (result.status == "success") {
    this.notify.showSuccess("New Password Changed")
    this.changeadmin.nativeElement.click();
    this.SpinnerService.hide();
      } else {
        this.notify.showError(result.description)
        this.SpinnerService.hide();
      } 
      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
    
  }

}



