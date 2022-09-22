import { Component, OnInit, Output,ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-pincode-edit',
  templateUrl: './pincode-edit.component.html',
  styleUrls: ['./pincode-edit.component.scss']
})
export class PincodeEditComponent implements OnInit {
  pincodeEditForm: FormGroup;
  cityList: Array<any>;
  districtList: Array<any>;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private shareService: ShareService, private router:Router,
    private fb: FormBuilder,private dataService: masterService) { }

  ngOnInit(): void {
    this.pincodeEditForm = this.fb.group({
      city_id: ['', Validators.required],
      district_id: ['', Validators.required],
      no: ['', Validators.required]
    })
    this.getCity();
    this.getDistrict();
    this.getCityEdit();
  }
  getCityEdit() {
    let data:any = this.shareService.pincodeEditValue.value;
    // console.log("pincodeEDITvAUE", data)
    let city_id = data["city_id"];
    let id = city_id['id'];
    let name = city_id['name']
    let ids = id
    let district_id = data["district_id"];
    let id1 = district_id['id'];
    let name1 = district_id['name']
    let ids1 = id1
    let No =data.no
    this.pincodeEditForm.patchValue({
      "city_id":ids,
      "district_id":ids1,
      "no":No
    })
  
  }
  
  private getCity() {
    this.dataService.getCity()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.cityList = datas;
        // console.log("cityEdit",datas)
  
      })
  }
  private getDistrict() {
    this.dataService.getDistrict()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.districtList = datas;
        // console.log("districtEdit",datas)
  
      })
  }
  submitForm(){
    let data:any=this.shareService.pincodeEditValue.value
    this.dataService.pincodeEditForm(this.pincodeEditForm.value,data.id)
    .subscribe(result => {
      this.onSubmit.emit();
      return true
  
    }
    )
    
  }
  onCancelClick() {
    this.onCancel.emit()
  }
}
