import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.scss']
})
export class CountryEditComponent implements OnInit {
  countryEditForm: FormGroup;

  constructor(private shareService: ShareService, private router:Router,
    private fb: FormBuilder,private dataService: masterService) { }

  ngOnInit(): void {
    this.countryEditForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required]
    })
    this.getCountryEdit();
  }
  getCountryEdit() {
    let data:any = this.shareService.countryEditValue.value;
    // console.log("countryEDITvAUE", data)
    let Name = data.name
    let Code = data.code
    this.countryEditForm.patchValue({
      name:Name,
      code:Code
    })

  }
  submitForm(){
    let data:any=this.shareService.countryEditValue.value
    this.dataService.countryEditForm(this.countryEditForm.value,data.id)
    .subscribe(result => {
      this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
      return true

    }
    )
    
  }

}
