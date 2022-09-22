import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { ShareService } from '../../Master/share.service'
import { Router } from '@angular/router'
import {MemoService} from '../../service/memo.service'
import { NotificationService } from "../../service/notification.service"
import { masterService } from '../master.service';

@Component({
  selector: 'app-memo-departent-edit',
  templateUrl: './memo-departent-edit.component.html',
  styleUrls: ['./memo-departent-edit.component.scss']
})
export class MemoDepartentEditComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel =new EventEmitter();
  deptEditForm:any= FormGroup;
  depsummarylist: Array<any>=[];
  has_next:boolean=false;
  has_pre:boolean=false;
  constructor(private shareService: ShareService, private router:Router, private notification: NotificationService,
    private fb: FormBuilder,private memoService:MemoService,private masterservice:masterService) { }

  ngOnInit(): void {
    this.deptEditForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      short_notation: ['', Validators.required],

    });
    this.getDepartmentEdit();
    this.getdepartmentdata();
  }
  getdepartmentdata(){
    let data:any = this.shareService.deptEditValue.value;
    this.masterservice.getsummarydepartmentedit(data.id,1).subscribe(result=>{
      this.depsummarylist=[result];
    });
  }
  getDepartmentEdit() {
    let data:any = this.shareService.deptEditValue.value;
    // console.log("EDITvAUE", this.shareService.deptEditValue.value)
    let Name = data.name
    let Description = data.description
    let shortNotation = data.short_notation
    this.deptEditForm.patchValue({
      name:Name,
      description:Description,
      short_notation:shortNotation
    });

  }


  submitForm(){
    console.log(this.deptEditForm.value)
    if(this.deptEditForm.get('name').value=='' || this.deptEditForm.get('name').value==undefined || this.deptEditForm.get('name').value=='' || this.deptEditForm.get('name').value==null){
      this.notification.showError('Please Enter The Valid Name');
      return false;
    }
    if(this.deptEditForm.get('description').value=='' || this.deptEditForm.get('description').value==undefined || this.deptEditForm.get('description').value=='' || this.deptEditForm.get('description').value==null){
      this.notification.showError('Please Enter The Valid Description');
      return false;
    }
    if(this.deptEditForm.get('short_notation').value=='' || this.deptEditForm.get('short_notation').value==undefined || this.deptEditForm.get('short_notation').value=='' || this.deptEditForm.get('short_notation').value==null){
      this.notification.showError('Please Enter The Valid Description');
      return false;
    }
    let datasend:any={
      'name':this.deptEditForm.get('name').value.toString().trim(),
      'description':this.deptEditForm.get('description').value.toString().trim(),
      'short_notation':this.deptEditForm.get('short_notation').value.toString().trim()
    };
    console.log(datasend)
    var answer = window.confirm("Update department?");
    if (answer) {
        //some code
    }
    else {
      return false;
    }
    let data:any=this.shareService.deptEditValue.value
    this.memoService.deptEditFrom(datasend,data.id)
    .subscribe(result => {
      let code = result.code
      if (code === "INVALID_DATA") {
        this.notification.showError("INVALID_DATA...")
       
      } else {
        this.notification.showSuccess("Updated Successfully!...")
        this.onSubmit.emit();
        console.log("paymodeEditForm", result);
      }
      // console.log("EDIDDDDDD",result)
      // this.notification.showSuccess("updated Successfully!...")
      // this.onSubmit.emit();
      return true
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    );
  }
  onCancelClick() {
    this.onCancel.emit();
  }
}