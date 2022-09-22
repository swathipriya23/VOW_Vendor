import { Component, OnInit, Output,ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-district-edit',
  templateUrl: './district-edit.component.html',
  styleUrls: ['./district-edit.component.scss']
})
export class DistrictEditComponent implements OnInit {
  districtEditForm: FormGroup;
  stateList: Array<any>;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private shareService: ShareService, private router:Router,
    private fb: FormBuilder,private dataService: masterService) { }

  ngOnInit(): void {
    this.districtEditForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      state_id: ['', Validators.required]
    })
    this.getState();
    this.getDistrictEdit();
  }
  getDistrictEdit() {
    let data:any = this.shareService.districtEditValue.value;
    // console.log("districtEDITvAUE", data)
    let Code = data.code
    let Name = data.name
    let state_id = data["state_id"];
    let id = state_id['id'];
    let name = state_id['name']
    let ids = id
    this.districtEditForm.patchValue({
      "code":Code,
      "name":Name,
      "state_id":ids
    })
  
  }
  
  private getState() {
    this.dataService.getState()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.stateList = datas;
        // console.log("stateEdit",datas)
  
      })
  }
  submitForm(){
    let data:any=this.shareService.districtEditValue.value
    this.dataService.districtEditForm(this.districtEditForm.value,data.id)
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
