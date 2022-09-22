import { Component, OnInit, Output,ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../../Master/share.service'
import { masterService } from '../../Master/master.service'

@Component({
  selector: 'app-state-edit',
  templateUrl: './state-edit.component.html',
  styleUrls: ['./state-edit.component.scss']
})
export class StateEditComponent implements OnInit {
  editStateForm: FormGroup;
  countryList: Array<any>;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  constructor(private shareService: ShareService, private router:Router,
    private fb: FormBuilder,private dataService: masterService) { }

  ngOnInit(): void {
    this.editStateForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      country_id: ['', Validators.required]
    })
    this.getCountry();
    this.getStateEdit();
  }
  getStateEdit() {
    let data:any = this.shareService.stateEditValue.value;
    // console.log("stateEDITvAUE", data)
    let Code = data.code
    let Name = data.name
    let country_id = data["country_id"];
    let id = country_id['id'];
    let name = country_id['name']
    let ids = id
    this.editStateForm.patchValue({
      "code":Code,
      "name":Name,
      "country_id":ids
    })
  
  }
  
  private getCountry() {
    this.dataService.getCountry()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.countryList = datas;
        // console.log("countryEdit",datas)
  
      })
  }
  submitForm(){
    let data:any=this.shareService.stateEditValue.value
    this.dataService.stateEditForm(this.editStateForm.value,data.id)
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
