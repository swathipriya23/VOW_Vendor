import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormArray } from '@angular/forms';
import { Observable, from } from 'rxjs';
// import { MemoService, Template } from "../service/memo.service";
import { MemoService, Template } from 'src/app/service/memo.service';
import { ShareService } from '../share.service';
import { Router } from '@angular/router'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  AddForm: FormGroup;
  ctrltemplate= new FormControl();

  isLoading = false;
  templateList: Array<Template>;
  account_Id:any='';

  constructor(private formBuilder: FormBuilder,private shareService: ShareService,
    private router: Router,
    private memoService: MemoService) { }

  ngOnInit(): void {
    this.AddForm = this.formBuilder.group({
      account_number: ['', Validators.required],
      name: ['', Validators.required],
      ctrltemplate: ['', Validators.required]
    });
    this.getacount();
    let tempkeyvalue:String="";
    this.getTemplate(tempkeyvalue);

    this.AddForm.get('ctrltemplate').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          console.log('inside tap')
          
      }),
      switchMap(value => this.memoService.getTemplate(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  .subscribe((results: any[]) => {
    let datas = results["data"];
    this.templateList = datas;
    console.log("template", datas)

  })
  
  }

  getacount(){
    let data:any = this.shareService.accountEditValue.value;
    console.log("account", data)
    
    if (data != '') {
      this.account_Id = data.id
      this.AddForm.patchValue({
        account_number: data.account_number,
        name:data.name,
        ctrltemplate:data.template
   
      })
    }
    else {
      this.account_Id = ''
     
    }

  }

  public displayFn(template?: Template): string | undefined {
    console.log('id',template.id);
    console.log('name',template.template);
    return template ? template.template : undefined;
  }

  get template() {
    return this.AddForm.get('ctrltemplate');
  }
  

  createFormate() {
    let data = this.AddForm.controls;
    let memoclass = new Memo();
    console.log('a',data['ctrltemplate'].value)
    console.log('b',data['ctrltemplate'].value.id)
    memoclass.template_id = data['ctrltemplate'].value.id;
    memoclass.account_number = data['account_number'].value;
    memoclass.name = data['name'].value;
    console.log("MemoClaass", memoclass)

  

    return memoclass;

    
  }
  private getTemplate(tempkeyvalue) {
    this.memoService.getTemplate(tempkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.templateList = datas;
        console.log("templatename", datas)
  
      })
  }

  submitForm() {

    this.memoService.creatAccountForm(this.createFormate(),this.account_Id)
      .subscribe(res => {
        console.log("creatAccountForm", res);
        this.onSubmit.emit();
        // this.router.navigate(['/ProofingMaster'], { skipLocationChange: true })

        // return true

      })
  }
  onCancelClick() {
    this.onCancel.emit()
  }


}

class Memo {
  account_number: string;
  name: string;
  template_id: any;
}
