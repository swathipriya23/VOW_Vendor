import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-create-pincode',
  templateUrl: './create-pincode.component.html',
  styleUrls: ['./create-pincode.component.scss']
})
export class CreatePincodeComponent implements OnInit {
  AddForm: FormGroup;
  cityList: Array<any>;
  districtList: Array<any>;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private formBuilder: FormBuilder,private dataService: masterService,private router: Router) { }

  ngOnInit(): void {
    this.AddForm = this.formBuilder.group({
      city_id: ['', Validators.required],
      district_id: ['', Validators.required],
      no: ['', Validators.required]
    })
    this.getCity();
    this.getDistrict();
  }
  filter(data) {
    // console.log(data.value);
  }
  filter1(data) {
    // console.log(data.value);
  }
  createFormat() {
    let data = this.AddForm.controls;
    let objPincode = new Pincode();
    objPincode.city_id = data['city_id'].value;
    objPincode.district_id = data['district_id'].value;
    objPincode.no = data['no'].value;
    // console.log("objPincode", objPincode)
    return objPincode;
  }

  private getCity() {
    this.dataService.getCity()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
        // console.log("citynameeeee", datas)
  
      })
  }
  private getDistrict() {
    this.dataService.getDistrict()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
        // console.log("districtnameeeee", datas)
  
      })
  }

  submitForm() {
    this.dataService.createPincodeForm(this.createFormat())
      .subscribe(res => {
        // console.log("createPincodeForm", res);
        this.onSubmit.emit();
        return true
      }
      )
  }
  onCancelClick() {
    this.onCancel.emit()
  }
}
class Pincode {
  city_id: number;
  district_id: number;
  no: string;
}