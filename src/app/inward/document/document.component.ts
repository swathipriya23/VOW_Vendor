import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { DataService } from '../inward.service'
import { ShareService } from '../share.service'
import { Router } from '@angular/router'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  documentForm: FormGroup
  HeaderID: any
  constructor(private fb: FormBuilder, private notification: NotificationService,
    private dataService: DataService, private router: Router, private shareService: ShareService) { }

  ngOnInit(): void {
    this.documentForm = this.fb.group({
      name: ['', Validators.required],
    })
    this.getdocumentEdit()
  }

  getdocumentEdit() {
    let id = this.shareService.documentEdit.value
    if( id == null || id == undefined || id == ""  ){
      return false
    }
    this.HeaderID = id
    this.dataService.getdocumentEdit(id)
      .subscribe((results: any) => {
        let Name = results.name;
        this.documentForm.patchValue({
          name: Name
        })
      })
  }

  documentCreateForm() {
    let dataSubmit: any
    if ((this.HeaderID == "") || (this.HeaderID == undefined) || (this.HeaderID == null)) {
      dataSubmit = this.documentForm.value
    }
    else {
      let data = this.documentForm.value
      dataSubmit = Object.assign({}, data, { "id": this.HeaderID.id })
    }
    this.dataService.documentCreateForm(dataSubmit)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("Invalid Name!...")
        }
        else {
          this.notification.showSuccess("Saved Successfully!...")
          this.onSubmit.emit();
        }
        return true
      })
  }
  onCancelClick() {
    this.onCancel.emit()
  }

}
