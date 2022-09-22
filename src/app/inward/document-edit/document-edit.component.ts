import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { DataService } from '../inward.service'
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import {ShareService} from '../share.service'
import { NotificationService } from '../notification.service'


@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.scss']
})
export class DocumentEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  documentEditForm: FormGroup
  constructor(private fb: FormBuilder, private shareService: ShareService,
    private notification: NotificationService,
    private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.documentEditForm = this.fb.group({
      // code: ['', Validators.required],
      name: ['', Validators.required],
    })
    this.getdocumentEdit()
  }


  getdocumentEdit() {
    let id = this.shareService.documentEdit.value
    // console.log("documentEditForm EDIT", this.shareService.documentEdit.value)
    this.dataService.getdocumentEdit(id)
      .subscribe((results: any) => {
        // let Code = results.code;
        let Name = results.name;
        this.documentEditForm.patchValue({
          // code: Code,
          name: Name
        })
      })
  }


  document_EditForm() {
    let idValue: any = this.shareService.documentEdit.value
    let data = this.documentEditForm.value
    this.dataService.editDocumentForm(data, idValue.id)
      .subscribe(res => {
        if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate!...")
        } else if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Updated Successfully!...")
          this.onSubmit.emit();
        }
        // console.log("Document", res)
        return true
      })
  }
  onCancelClick() {
    this.onCancel.emit()
  }

}
