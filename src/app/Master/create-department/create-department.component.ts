import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { MemoService } from "../../service/memo.service";
import { CommonService } from '../../service/common.service';
import { Router } from '@angular/router'
import { NotificationService } from "../../service/notification.service"



@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})
export class CreateDepartmentComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  AddForm:any= FormGroup;
  BranchName:any;

  constructor(private formBuilder: FormBuilder, private commonService: CommonService,
    private router: Router, private notification: NotificationService,
    private memoService: MemoService) { }

  ngOnInit(): void {
    this.AddForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      short_notation: ['', Validators.required],

    });
    
    // this.memoService.getUserBranch()
    //   .subscribe((results: any[]) => {
        
    //     this.BranchName=results["code"]+'-'+results["name"];
       
    //   });


  }



  createFormate() {
    let data = this.AddForm.controls;
    let memoclass = new Memo();
    memoclass.name = data['name'].value;
    memoclass.description = data['description'].value;
    memoclass.short_notation = data['short_notation'].value;

    // console.log("MemoClaass", memoclass)

    return memoclass;
  }


  submitForm() {
    console.log(this.AddForm.value);
    if(this.AddForm.get('name').value=='' || this.AddForm.get('name').value==undefined || this.AddForm.get('name').value==null || this.AddForm.get('name').value==""){
      this.notification.showError('Please Enter The Name');
      return false;
    }
    if(this.AddForm.get('description').value=='' || this.AddForm.get('description').value==undefined || this.AddForm.get('description').value==null || this.AddForm.get('description').value==""){
      this.notification.showError('Please Enter The Description');
      return false;
    }
    if(this.AddForm.get('short_notation').value=='' || this.AddForm.get('short_notation').value==undefined || this.AddForm.get('short_notation').value==null || this.AddForm.get('short_notation').value==""){
      this.notification.showError('Please Enter The ShortNotation');
      return false;
    }
    
    var answer = window.confirm("Add Department?");
    if (answer) {
        //some code
    }
    else {
      return false;
    }
    this.memoService.creatMemoForm(this.createFormate())
      .subscribe(res => {
        let code = res.code
        if (code === "INVALID_DATA") {
          this.notification.showError("INVALID_DATA...")
         
        }
        else if(res.code === "INVALID_DATA" && res.description === "Duplicate Name"){
          this.notification.showWarning("Duplicate Data! ...")
        }
        else {
          this.notification.showSuccess("Created Successfully!...")
          this.onSubmit.emit();
          console.log("paymodeEditForm", res);
        }
        // this.notification.showSuccess("Saved Successfully!...")
        // this.onSubmit.emit();
        return true;

      }
      )
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}



class Memo {
  name: string;
  description: string;
  short_notation: string;

}