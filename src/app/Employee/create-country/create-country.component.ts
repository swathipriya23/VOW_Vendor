import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-create-country',
  templateUrl: './create-country.component.html',
  styleUrls: ['./create-country.component.scss']
})
export class CreateCountryComponent implements OnInit {
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
    let objCountry = new Country();
    objCountry.name = data['name'].value;
    objCountry.code = data['code'].value;
    // console.log("objCountry", objCountry)
    return objCountry;
  }
  submitForm() {
    this.dataService.createCountryForm(this.createFormat())
      .subscribe(res => {
        // console.log("createCountryForm", res);
        this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
        return true
      }
      )
  }

}
class Country {
  code: string;
  name: string;
}
