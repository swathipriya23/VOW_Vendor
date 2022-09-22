import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { DataService } from '../inward.service'
import { ShareService } from '../share.service'
import { NotificationService } from '../notification.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit { 
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  channelForm: FormGroup
  HeaderID: any
  constructor(private fb: FormBuilder, private notification: NotificationService,
    private dataService: DataService, private router: Router,  private shareService: ShareService) { }

  ngOnInit(): void {
    this.channelForm = this.fb.group({
      name: ['', Validators.required],
    })
    this.getChannelEdit()
  }

  getChannelEdit() {
    let id = this.shareService.channelEdit.value
    if( id == null || id == undefined || id == ""  ){
      return false
    }
    this.HeaderID = id
    this.dataService.getChannelEdit(id)
      .subscribe((results: any) => {
        let Name = results.name;
        this.channelForm.patchValue({
          name: Name
        })
      })
  }


  channelCreateForm() {
    // let data = this.channelForm.value
    let dataSubmit: any
    if ((this.HeaderID == "") || (this.HeaderID == undefined) || (this.HeaderID == null)) {
      dataSubmit = this.channelForm.value
    }
    else {
      let data = this.channelForm.value
      dataSubmit = Object.assign({}, data, { "id": this.HeaderID.id })
    }
    this.dataService.channelCreateForm(dataSubmit)
      .subscribe(res => {
        if (res.code === "INVALID_CHANNEL_ID" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate! Code Or Name ...")
        } else if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("INVALID_DATA!...")
        } else {
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

