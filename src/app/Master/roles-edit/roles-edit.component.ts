import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { masterService } from '../master.service'

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html',
  styleUrls: ['./roles-edit.component.scss']
})
export class RolesEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
   rolesEditForm: FormGroup;

  constructor(private shareService: ShareService, private router:Router,
    private fb: FormBuilder,private dataService: masterService) { }

  ngOnInit(): void {
    this.rolesEditForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required]
    })
    this.getRolesEdit();
  }
  getRolesEdit() {
    let data:any = this.shareService.rolesEditValue.value;
    // console.log("rolesEDITvAUE", data)
    let Name = data.name
    let Code = data.code
    this.rolesEditForm.patchValue({
      name:Name,
      code:Code
    })

  }
  submitForm(){
    let data:any=this.shareService.rolesEditValue.value
    this.dataService.rolesEditForm(this.rolesEditForm.value,data.id)
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
