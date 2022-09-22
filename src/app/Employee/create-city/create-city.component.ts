import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-create-city',
  templateUrl: './create-city.component.html',
  styleUrls: ['./create-city.component.scss']
})
export class CreateCityComponent implements OnInit {
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
    let objCity = new City();
    objCity.name = data['name'].value;
    objCity.code = data['code'].value;
    objCity.state_id = data['state_id'].value;
    // console.log("objCity", objCity)
    return objCity;
  }

  private getState() {
    this.dataService.getState()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        // console.log("statenameeeee", datas)
  
      })
  }

  submitForm() {
    this.dataService.createCityForm(this.createFormat())
      .subscribe(res => {
        // console.log("createCityForm", res);
        this.onSubmit.emit();
        return true
      }
      )
  }
  onCancelClick() {
    this.onCancel.emit()
  }
}
class City {
  code: string;
  name: string;
  state_id: number;

}

