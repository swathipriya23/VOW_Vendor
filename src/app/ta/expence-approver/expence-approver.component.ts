import { Component, OnInit } from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';
import {isBoolean} from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-expence-approver',
  templateUrl: './expence-approver.component.html',
  styleUrls: ['./expence-approver.component.scss']
})
export class ExpenceApproverComponent implements OnInit {
  ApprovalExpenceForm:FormGroup

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.ApprovalExpenceForm = this.formBuilder.group({
      bank:['',Validators.required],
      employee:['',Validators.required],
      comments:['',Validators.required],
    })
     
  }
  submitForm(){
    
  }

}
