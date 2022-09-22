import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { ProofingService} from "../proofing.service";
import { MemoService } from "../../service/memo.service";
import { CommonService } from '../../service/common.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-template-create',
  templateUrl: './template-create.component.html',
  styleUrls: ['./template-create.component.scss']
})
export class TemplateCreateComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  AddForm: FormGroup;
  filetypeList: Array<any>;
  constructor(private formBuilder: FormBuilder,private router: Router,private memoService: MemoService,private proofingService: ProofingService) { }

  ngOnInit(): void {
    this.AddForm = this.formBuilder.group({
      template: ['', Validators.required],
      file_type: ['', Validators.required]
    })
    this.getFileType();
  }
  createFormat() {
    let data = this.AddForm.controls;
    let objTemplate = new Template();
    objTemplate.template = data['template'].value;
    objTemplate.file_type = data['file_type'].value;
    console.log("objTemplate", objTemplate)
    return objTemplate;
  }
  filter(data) {
    console.log(data.value);
  }

  private getFileType() {
    this.memoService.getFileType()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.filetypeList = datas;
        console.log("filetype", datas)
  
      })
  }


  submitForm() {
    this.memoService.createTemplateForm(this.createFormat())
      .subscribe(res => {
        console.log("createTemplateForm", res);
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


class Template {
  template: string;
  file_type: any;
}