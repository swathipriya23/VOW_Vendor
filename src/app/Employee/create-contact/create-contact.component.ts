import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss']
})
export class CreateContactComponent implements OnInit {
  AddForm: FormGroup;

  constructor(private formBuilder: FormBuilder,private dataService: masterService,private router: Router) { }

  ngOnInit(): void {
    this.AddForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      remarks: ['', Validators.required]
    })
  }
  createFormat() {
    let data = this.AddForm.controls;
    let objContact = new ContactType();
    objContact.code = data['code'].value;
    objContact.name = data['name'].value;
    objContact.remarks = data['remarks'].value;
    // console.log("objContact", objContact)
    return objContact;
  }
  submitForm() {
    this.dataService.createContactForm(this.createFormat())
      .subscribe(res => {
        // console.log("createContactForm", res);
        this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
        return true
      }
      )
  }

}
class ContactType {
  code: string;
  name: string;
  remarks: string;

}
