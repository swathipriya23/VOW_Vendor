import { Component, OnInit,Output,EventEmitter,ViewChild } from '@angular/core';
import {FormGroup,FormBuilder,FormControl, Validators} from '@angular/forms';
import {AtmaService} from '../atma.service';
import {ShareService} from '../share.service'
import { NotificationService } from 'src/app/service/notification.service';
import {MatAutocompleteSelectedEvent,  MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {ToastrService} from 'ngx-toastr';
import { Observable, from, fromEvent} from 'rxjs';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime,map,takeUntil } from 'rxjs/operators';
export interface parentListss {
  name: string;
  id: number;
}


@Component({
  selector: 'app-documentgroup-edit',
  templateUrl: './documentgroup-edit.component.html',
  styleUrls: ['./documentgroup-edit.component.scss']
})
export class DocumentgroupEditComponent implements OnInit {
  checked = true;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  docgrpCreateForm:FormGroup;
  parentlist:any;
  docgrpid:number;
  mand: boolean = true;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isLoading=false;

  @ViewChild('parenttype') matdocAutocomplete: MatAutocomplete;
  @ViewChild('docInput') docInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  constructor(private formbuilder:FormBuilder,private atmaService:AtmaService
    ,private shareService:ShareService,private notification:NotificationService,
    private toaster:ToastrService) { }

  ngOnInit(): void {
    this.docgrpCreateForm = this.formbuilder.group({
      name:new FormControl('',[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      parent_id:[''],
      isparent:[''],
      partnertype:[''],
      docname:new FormControl('',[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      period:new FormControl('',[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      mand:[''],
      
    })
    this.getproductEditForm();
    this.getparentValue();
    let parentkeyvalue: String="";
    this.getParent(parentkeyvalue);
    this.docgrpCreateForm.get('parent_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
          console.log('inside tap')
          
      }),

      switchMap(value => this.atmaService.get_parentScroll(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.parentlist = datas;
      console.log("parentlist", datas)
    })

    
  }
    
  getparentValue() {
    this.atmaService.getdoc()
      .subscribe(result => {
        this.parentlist = result['data']
        console.log("parent", this.parentlist)
      })
  }
  getproductEditForm() {
    let data: any = this.shareService.docgrpedit.value;
    console.log("docgrpEdit..............", data)
    this.docgrpid = data.id
    let Name=data.name;
    let Docname = data.docname;
    let ISParent = data.isparent;
    let Mandatory = data.mand;
    let Parent = data.parent_id;
    console.log("sss",Parent)
    let Partnertype = data.partnertype;
    let Period = data.period;
    this.docgrpCreateForm.patchValue({
      name:Name,
      docname: Docname,
      isparent: ISParent,
      mand: Mandatory,
      parent_id:Parent,
      partnertype:Partnertype,
      period:Period,
    

    })
  }

  public displayFnparent(parenttype?: parentListss): string | undefined {
    //  console.log('id',parenttype.id);
    //  console.log('name',parenttype.name);
    return parenttype ? parenttype.name : undefined;
  }
  
  get parenttype() {
    return this.docgrpCreateForm.get('parent_id');
  }
  
  private getParent(parentkeyvalue) {
    this.atmaService.getParentDropDown(parentkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.parentlist = datas;
        console.log("prnt", datas)
        
      })

      
  }
  
  parentScroll() {
    setTimeout(() => {
    if (
    this.matdocAutocomplete &&
    this.matdocAutocomplete &&
    this.matdocAutocomplete.panel
    ) {
    fromEvent(this.matdocAutocomplete.panel.nativeElement, 'scroll')
    .pipe(
    map(x => this.matdocAutocomplete.panel.nativeElement.scrollTop),
    takeUntil(this.autocompleteTrigger.panelClosingActions)
    )
    .subscribe(x => {
    const scrollTop = this.matdocAutocomplete.panel.nativeElement.scrollTop;
    const scrollHeight = this.matdocAutocomplete.panel.nativeElement.scrollHeight;
    const elementHeight = this.matdocAutocomplete.panel.nativeElement.clientHeight;
    const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
    if (atBottom) {
    if (this.has_next === true) {
    this.atmaService.get_parentScroll(this.docInput.nativeElement.value, this.currentpage + 1)
    .subscribe((results: any[]) => {
    let datas = results["data"];
    let datapagination = results["pagination"];
    this.parentlist = this.parentlist.concat(datas);
    if (this.parentlist.length >= 0) {
    this.has_next = datapagination.has_next;
    this.has_previous = datapagination.has_previous;
    this.currentpage = datapagination.index;
    }
    })
    }
    }
    });
    }
    });
    }

  onCancelClick(){
    this.onCancel.emit()
  }
  docgrpEditForm(){
    if (this.docgrpCreateForm.value.name ===" "){
      this.toaster.error('Please Enter Name');
      return false;
    }
    if( this.docgrpCreateForm.value.docname === " "){
      this.toaster.error('Please Enter DocumentName');
      return false;
    }
    if(this.docgrpCreateForm.value.period ===" "){
      this.toaster.error('Please Enter Period');
      return false;
    }
    else{
    this.atmaService.docgrpEditForm(this.docgrpid, this.docgrpCreateForm.value)
    .subscribe(result => {
      if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.notification.showWarning("Duplicate!Name ...")
      }
      else{
        this.onSubmit.emit();
        console.log("produedit", result)
      }
      
    })
  }
  }


}






  