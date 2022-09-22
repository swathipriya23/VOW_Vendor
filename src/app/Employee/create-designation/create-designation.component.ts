import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-create-designation',
  templateUrl: './create-designation.component.html',
  styleUrls: ['./create-designation.component.scss']
})
export class CreateDesignationComponent implements OnInit {
  AddForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private dataService: masterService,private router: Router) { }

  ngOnInit(): void {
    this.AddForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required] 
    })
  }
  createFormat() {
    let data = this.AddForm.controls;
    let objDesignation = new Designation();
    objDesignation.name = data['name'].value;
    objDesignation.code = data['code'].value;
    // console.log("objDesignation", objDesignation)
    return objDesignation;
  }
  submitForm() {
    this.dataService.createDesignationForm(this.createFormat())
      .subscribe(res => {
        // console.log("createDesignationForm", res);
        this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
        return true
      }
      )
  }

}
class Designation {
  code: string;
  name: string;

}
