import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { DataService } from '../inward.service'
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../share.service'
// import {ShareService} from '../../Master/share.service'
import { NotificationService } from '../notification.service'

@Component({
  selector: 'app-channel-edit',
  templateUrl: './channel-edit.component.html',
  styleUrls: ['./channel-edit.component.scss']
})
export class ChannelEditComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  channelEditForm: FormGroup
  constructor(private fb: FormBuilder, private shareService: ShareService,
    private notification: NotificationService,
    private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.channelEditForm = this.fb.group({
      // code: ['', Validators.required],
      name: ['', Validators.required],
    })
    this.getChannelEdit()
  }


  getChannelEdit() {
    let id = this.shareService.channelEdit.value
    this.dataService.getChannelEdit(id)
      .subscribe((results: any) => {
        // let Code = results.code;
        let Name = results.name;
        this.channelEditForm.patchValue({
          // code: Code,
          name: Name
        })
      })
  }


  channel_EditForm() {
    let idValue: any = this.shareService.channelEdit.value
    let data = this.channelEditForm.value
    this.dataService.editChannelForm(data, idValue.id)
      .subscribe(res => {
        if (res.code === "INVALID_CHANNEL_ID" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate!...")
        } else if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.notification.showSuccess("Updated Successfully!...")
          this.onSubmit.emit();
        }
        return true
      })
  }

  onCancelClick() {
    this.onCancel.emit()
  }

}

