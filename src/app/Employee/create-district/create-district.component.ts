import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-create-district',
  templateUrl: './create-district.component.html',
  styleUrls: ['./create-district.component.scss']
})
export class CreateDistrictComponent implements OnInit {
  AddForm: FormGroup;
  stateList: Array<any>;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private formBuilder: FormBuilder,private dataService: masterService,private router: Router) { }

  ngOnInit(): void {
    this.AddForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      state_id: ['', Validators.required]
    })
    this.getState();
  }
  filter(data) {
    // console.log(data.value);
  }

  createFormat() {
    let data = this.AddForm.controls;
    let objDistrict = new District();
    objDistrict.name = data['name'].value;
    objDistrict.code = data['code'].value;
    objDistrict.state_id = data['state_id'].value;
    // console.log("objDistrict", objDistrict)
    return objDistrict;
  }

  private getState() {
    this.dataService.getState()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        // console.log("statename", datas)
  
      })
  }

  submitForm() {
    this.dataService.createDistrictForm(this.createFormat())
      .subscribe(res => {
        // console.log("createStateForm", res);
        this.onSubmit.emit();
        return true
      }
      )
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}
class District {
  code: string;
  name: string;
  state_id: number;

}