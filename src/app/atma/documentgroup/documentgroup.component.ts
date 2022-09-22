import { Component, OnInit,Output,EventEmitter,ViewChild } from '@angular/core';
import {FormGroup,FormBuilder,FormControl, Validators} from '@angular/forms';
import {AtmaService} from '../atma.service'
import { NotificationService } from 'src/app/service/notification.service';
import {MatAutocompleteSelectedEvent,  MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {ToastrService} from 'ngx-toastr'
import { Observable, from, fromEvent} from 'rxjs';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime,map,takeUntil } from 'rxjs/operators';
export interface parentListss {
  name: string;
  id: number;
}

@Component({
  selector: 'app-documentgroup',
  templateUrl: './documentgroup.component.html',
  styleUrls: ['./documentgroup.component.scss']
})
export class DocumentgroupComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  docGrpForm:FormGroup
  parentlist:Array<parentListss>;
  limit:boolean;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isLoading=false;

  @ViewChild('parenttype') matdocAutocomplete: MatAutocomplete;
  @ViewChild('docInput') docInput: any;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  constructor(public formbuilder:FormBuilder,private atmaService:AtmaService,
    private notification:NotificationService,private toaster:ToastrService) { }

  ngOnInit(): void {
    this.docGrpForm = this.formbuilder.group({
      name:new FormControl('',[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      parent_id:[''],
      isparent:[''],
      partnertype:[''],
      docname:new FormControl('',[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      period:new FormControl('',[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
      mand:['N'],
      
    })
    this.getdocgrppage();

    let parentkeyvalue: String="";
    this.getParent(parentkeyvalue);
    this.docGrpForm.get('parent_id').valueChanges
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
  // getparentValue() {
  //   this.atmaService.getdoc()
  //     .subscribe(result => {
  //       let name = result['data']
  //       this.parentlist = name
  //       let page=result['pagination']
  //       this.limit=page.has_next;
  //       if(result.pagination.has_next===true){
  //        this.atmaService.getdocgrppage(pageNumber = 2,pageSize = 10)
  //         .subscribe(result=> {
  //           let nam = result['data']
  //           console.log("nt",nam)
  //         })
  //       }
  //       console.log("nxt",this.limit)
  //       console.log("page",page)
  //       console.log("parent", this.parentlist)
  //     })
  // }
  getdocgrppage(pageNumber = 1,pageSize = 10){
    this.atmaService.getdocgrppage( pageNumber,pageSize)
    .subscribe((results: any[]) => {
      console.log("filterdata",results)
      let datapagination = results["pagination"];
      this.parentlist =  results["data"];;
      if (this.parentlist.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      }
    })
  }
 
  docGrpCreateForm(){
    if (this.docGrpForm.value.name ===""){
      this.toaster.error('Please Enter Name');
      return false;
    }
    if( this.docGrpForm.value.docname === ""){
      this.toaster.error('Please Enter DocumentName');
      return false;
    }
    if(this.docGrpForm.value.period===""){
      this.toaster.error('Please Enter Period');
      return false;
    }
    else{
    this.atmaService.DocGrpCreateForm(this.docGrpForm.value)
    .subscribe(result => {
      if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
        this.notification.showWarning("Duplicate!Name ...")
      }
      else{
        this.onSubmit.emit();
        console.log("docgrppost",result)
      }
      
    })
  }
  }

  public displayFnparent(parenttype?: parentListss): string | undefined {
    //  console.log('id',parenttype.id);
    //  console.log('name',parenttype.name);
    return parenttype ? parenttype.name : undefined;
  }
  
  get parenttype() {
    return this.docGrpForm.get('parent_id');
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
  nextClickpro () {
    if (this.has_next === true) {
      this.getdocgrppage(this.currentpage + 1, 10)
    }
  }
}


