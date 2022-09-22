import { Component, OnInit } from '@angular/core';
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


  constructor(private usercreationService: UsercreationService,public sharedService: SharedService) { }

  ngOnInit(): void {
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

}
