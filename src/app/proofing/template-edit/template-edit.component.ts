import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router'
import { ShareService } from '../share.service';
import {MemoService} from '../../service/memo.service'


@Component({
  selector: 'app-template-edit',
  templateUrl: './template-edit.component.html',
  styleUrls: ['./template-edit.component.scss']
})
export class TemplateEditComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  templateEditForm: FormGroup;
  filetypeList: Array<any>

  constructor( private router:Router,private shareService: ShareService,
    private fb: FormBuilder,private memoService:MemoService) { }

  ngOnInit(): void {
    this.templateEditForm = this.fb.group({
     // file_type: ['', Validators.required],
      file_type: ['', Validators.required],
      template: ['', Validators.required],
    })
    this.getTemplateEdit();
    this.getFileType();
  }

  getTemplateEdit() {
    let data:any = this.shareService.templateEditValue.value;
    console.log("templateEDITvAUE", data)
    let Template = data.template
    let file_type = data["file_type"];
    let id = file_type['id'];
    let text = file_type['text']
    let ids = id
    this.templateEditForm.patchValue({
      "template":Template,
      "file_type":ids
    })

  }
  private getFileType() {
    this.memoService.getFileType()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.filetypeList = datas;
        console.log("fileeetype", datas)

      })
  }

  submitForm(){
    let data:any=this.shareService.templateEditValue.value
    this.memoService.tempEditFrom(this.templateEditForm.value,data.id)
    .subscribe(result => { 
      this.onSubmit.emit();
      // this.router.navigate(['/ProofingMaster'], { skipLocationChange: true })
      // return true

    }
    )
    
  }
  onCancelClick() {
    this.onCancel.emit()
  }


}