import { Component, OnInit } from '@angular/core';
import{FormControl,FormGroup,FormBuilder,Validators,FormArray} from '@angular/forms';
import {isBoolean} from 'util';
// import { formatDate } from '@angular/common';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-onbehalf-maker',
  templateUrl: './onbehalf-maker.component.html',
  styleUrls: ['./onbehalf-maker.component.scss']
})
export class OnbehalfMakerComponent implements OnInit {
  onbehalfForm:FormGroup

  constructor(private formBuilder: FormBuilder,private datePipe: DatePipe,private http: HttpClient) { }

  ngOnInit(): void {
    this.onbehalfForm = this.formBuilder.group({
      bank:['',Validators.required],
      employee:['',Validators.required],
      
     
       
})
  }
  submitForm(){

  }
  onclose(){
    
  }

}
