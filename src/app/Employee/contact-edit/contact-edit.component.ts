import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {
  contactEditForm: FormGroup;

  constructor(private shareService: ShareService, private router:Router,
    private fb: FormBuilder,private dataService: masterService) { }

  ngOnInit(): void {
    this.contactEditForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      remarks: ['', Validators.required]
    })
    this.getContactEdit();
  }
  getContactEdit() {
    let data:any = this.shareService.contactEditValue.value;
    // console.log("contactEDITvAUE", data)
    let Code = data.code
    let Name = data.name
    let Remarks = data.remarks
    this.contactEditForm.patchValue({
      code:Code,
      name:Name,
      remarks:Remarks
    })

  }
  submitForm(){
    let data:any=this.shareService.contactEditValue.value
    this.dataService.contactEditForm(this.contactEditForm.value,data.id)
    .subscribe(result => {
      this.router.navigate(['/employeeSummary'], { skipLocationChange: true })
      return true
    })
    
  }

}
