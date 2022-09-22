import { Component, OnInit, Output,ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-create-state',
  templateUrl: './create-state.component.html',
  styleUrls: ['./create-state.component.scss']
})
export class CreateStateComponent implements OnInit {
  AddForm: FormGroup;
  countryList: Array<any>;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private formBuilder: FormBuilder,private dataService: masterService,private router: Router) { }

  ngOnInit(): void {
    this.AddForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      country_id: ['', Validators.required]
    })
    this.getCountry();
  }

  filter(data) {
    // console.log(data.value);
  }

  createFormat() {
    let data = this.AddForm.controls;
    let objState = new State();
    objState.name = data['name'].value;
    objState.code = data['code'].value;
    objState.country_id = data['country_id'].value;
    // console.log("objSate", objState)
    return objState;
  }

  private getCountry() {
    this.dataService.getCountry()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.countryList = datas;
        // console.log("countryname", datas)
  
      })
  }

  submitForm() {
    this.dataService.createStateForm(this.createFormat())
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
class State {
  code: string;
  name: string;
  country_id: number;

}