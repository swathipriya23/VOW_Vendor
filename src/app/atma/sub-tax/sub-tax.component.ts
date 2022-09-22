import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import {  fromEvent } from 'rxjs';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { debounceTime, distinctUntilChanged, tap, filter, switchMap, finalize, takeUntil, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

export interface taxtauto {
  id: string;
  name: string;
}
export interface taxnamelist{
  id:string;
  name:string;
}
export interface subtaxname{
  id:string;
  name:string;
}
export interface subtaxrate{
  id:string;
  name:string;
}
export interface categorylista{
  id:string;
  name:string;
}
export interface subcatgorylista{
  id:string;
  name:string;
}
@Component({
  selector: 'app-sub-tax',
  templateUrl: './sub-tax.component.html',
  styleUrls: ['./sub-tax.component.scss']
})

export class SubTaxComponent implements OnInit {
  @ViewChild('taxdata') matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('SCROLLtaxInput') SCROLLtaxInput: any;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('taxauto') mattaxname:MatAutocomplete;
  @ViewChild('taxnameinput') taxInput;
  @ViewChild('subInput') subcatinput;
  @ViewChild('catsublists') matcatsublists: MatAutocomplete;
  @ViewChild('subtaxrateinfinite') matsubtaxname:MatAutocomplete;
  @ViewChild('inputSubname') subtaxInput;
  @ViewChild('catlists') matTaxtaxAutocomplete: MatAutocomplete;
  @ViewChild('catinput') catinput;
  // @ViewChild('subInput') subcatinput;
  subTaxForm: FormGroup;
  taxDDvalueList: Array<taxtauto>;
  isLoading = false;
  disableSubmit=true;
  has_next = true;
  has_previous = true;
  has_categorypre:boolean=false;
  has_categorynxt:boolean=true;
  has_categorypage:number=1;
  has_subcategorypre:boolean=false;
  has_subcategorynxt:boolean=true;
  has_subcategorypage:number=1;
  has_taxnamepre:boolean=false;
  has_taxnamenxt:boolean=true;
  has_taxnamepage:number=1;
  has_subtaxpre:boolean=false;
  has_subtaxnamenxt:boolean=true;
  has_subtaxnamepre:boolean=false;
  has_subtaxnamepage:number=1;
  has_subtaxratepre:boolean=false;
  has_subtaxratenamenxt:boolean=true;
  has_subtaxratenamepage:number=1;
  has_subtaxratenamepre:boolean=false;
  currentpage: number = 1;
  subtaxaddform:any=FormGroup;
  taxnamelist: Array<any>=[];
  taxnamelistNew: Array<any>=[];
  subtaxnamelist: Array<any>=[];
  productcatlist: Array<any>=[];
  subcategorylistdata: Array<any>=[];
  categoryList: Array<any>=[];
  constructor(private fb: FormBuilder, private atmaService: AtmaService,private notification:NotificationService) { }

  ngOnInit(): void {
    this.subTaxForm = this.fb.group({
     
      name: ['', Validators.required],
      glno: ['', Validators.required],
      remarks: ['', Validators.required],
      tax_id: ['', Validators.required],
    });
    this.subtaxaddform=this.fb.group({
      'name':['',Validators.required],
      'subtaxname':['',Validators.required],
      'subtaxlimit':['',Validators.required],
      'subtaxremarks':['',Validators.required],
      'subcategory':['',Validators.required],
      'subcategorysub':['',Validators.required],
      'glno':['',Validators.required],
      'tax':['',Validators.required]
    })
// ------
let query: String = "";
    this.getTaxDDValue(query);

    this.subTaxForm.get('tax_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.atmaService.Tax_dropdownsearchST(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.taxDDvalueList = datas;
        

      })
    // 
    // this.getTaxDDValue();
  }
  subcategoryfocusout(data:any){
    this.subtaxaddform.get('glno').patchValue(data.glno);
  }
  gettaxnamelists(){
    this.atmaService.gettaxnamelist('',1).subscribe(data=>{
      this.taxnamelist=data['data'];
    });
  }
  getsubtaxratelist(){
    if(this.subtaxaddform.get('name').value.id==undefined || this.subtaxaddform.get('name').value=='' || this.subtaxaddform.get('name').value==null){
      this.notification.showError('Please Select The Tax Name');
      return false;
    }
    this.atmaService.getsubtaxnamelist(this.subtaxaddform.get('name').value.id,'',1).subscribe(data=>{
      this.subtaxnamelist=data['data'];
    });
     this.subtaxaddform.get('tax').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaService.getsubtaxnamelist(this.subtaxaddform.get('name').value.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.subtaxnamelist=data['data'];
    });
  }
  getapsubcategorydata(){
    if(this.subtaxaddform.get('subcategory').value.id==undefined || this.subtaxaddform.get('subcategory').value=='' || this.subtaxaddform.get('subcategory').value==undefined || this.subtaxaddform.get('subcategory').value.id==null || this.subtaxaddform.get('subcategory').value.id==""){
      this.notification.showError('Please Select The Category');
      return false;
    }
    this.atmaService.getapsubcat(this.subtaxaddform.get('subcategory').value.id).subscribe(datas=>{
      this.subcategorylistdata=datas['data'];
    });
    this.subtaxaddform.get('subcategorysub').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
        }),
        switchMap(value=>this.atmaService.getapsubcat(this.subtaxaddform.get('subcategory').value.id).pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
      ).subscribe(datas=>{
        this.subcategorylistdata=datas['data'];
      });
  }
  public getdisplaysubtaxrateinterface(data ?:subtaxrate):string | undefined{
    return data?data.name:undefined;
  }
  public getdisplaytaxnamelist(data ?:taxnamelist):string | undefined{
    return data?data.name:undefined;
  }
  getdisplaycategoryinterface(data ?:categorylista):string | undefined{
    return data ? data.name:undefined;
  }
  getsubcategoryinterface(data ?:subcatgorylista):string | undefined{
    return data?data.name:undefined;
  }
  public displaytaxdata(taxtest?: taxtauto): string | undefined {
    console.log('id', taxtest.id);
    console.log('name', taxtest.name);
    return taxtest ? taxtest.name : undefined;
  }

  get taxtest() {
    return this.subTaxForm.get('tax_id');
  }

  autocompletetaxScroll() {
    setTimeout(() => {
      if (
        this.matAutocomplete &&
        this.autocompleteTrigger &&
        this.matAutocomplete.panel
      ) {
        fromEvent(this.matAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.Tax_dropdownsearchST(this.SCROLLtaxInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.taxDDvalueList = this.taxDDvalueList.concat(datas);
                    // console.log("emp", datas)
                    if (this.taxDDvalueList.length >= 0) {
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
  gettaxinfinitesNew(data:any){
      
    setTimeout(() => {
      if (
        this.mattaxname &&
        this.autocompleteTrigger &&
        this.mattaxname.panel
      ) {
        fromEvent(this.mattaxname.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.mattaxname.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.mattaxname.panel.nativeElement.scrollTop;
            const scrollHeight = this.mattaxname.panel.nativeElement.scrollHeight;
            const elementHeight = this.mattaxname.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_taxnamenxt === true) {
                this.atmaService.gettaxnamelist(this.taxInput.nativeElement.value,this.has_taxnamepage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.taxnamelistNew = this.taxnamelistNew.concat(datas);
                    if (this.taxnamelistNew.length >= 0) {
                      this.has_taxnamenxt = datapagination.has_next;
                      this.has_taxnamepre = datapagination.has_previous;
                      this.has_taxnamepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  
 
  }
  getTaxDDValue(q) {
    this.atmaService.Taxdropdownsearch(q)
      .subscribe(result => {
        this.taxDDvalueList = result['data']
      })
  }
  datacategory (){
    this.atmaService.getapcat_LoadMore('',1).subscribe(datas=>{
      this.productcatlist=datas['data'];
    });
    console.log(this.productcatlist);
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  subTaxCreateForm() {
    this.disableSubmit=true;
    if(this.subTaxForm.valid){
      
    this.subTaxForm.value.tax_id= this.subTaxForm.value.tax_id.id;
    this.atmaService.subTaxCreateForm(this.subTaxForm.value)
      .subscribe(result => {
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showWarning("Duplicate Code & Name ...")
          this.disableSubmit=false;
        } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
          this.disableSubmit=false;
        } else {
          this.notification.showSuccess("Saved Successfully!...")
          this.onSubmit.emit();
        }
      })}else{
        this.disableSubmit=false;
      }

  }
  getsubcategoryinfinite(){
    setTimeout(() => {
      if (
        this.matcatsublists &&
        this.autocompleteTrigger &&
        this.matcatsublists.panel
      ) {
        fromEvent(this.matcatsublists.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatsublists.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcatsublists.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcatsublists.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcatsublists.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_subcategorynxt === true) {
                this.atmaService.getapcat_LoadMore(this.subcatinput.nativeElement.value,this.has_subcategorypage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.subcategorylistdata = this.subcategorylistdata.concat(datas);
                    if (this.subcategorylistdata.length >= 0) {
                      this.has_subcategorypre = datapagination.has_next;
                      this.has_subcategorynxt = datapagination.has_previous;
                      this.has_subcategorypage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
    }
    gettaxinfinite(data:any){
      
      setTimeout(() => {
        if (
          this.mattaxname &&
          this.autocompleteTrigger &&
          this.mattaxname.panel
        ) {
          fromEvent(this.mattaxname.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.mattaxname.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.mattaxname.panel.nativeElement.scrollTop;
              const scrollHeight = this.mattaxname.panel.nativeElement.scrollHeight;
              const elementHeight = this.mattaxname.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_taxnamenxt === true) {
                  this.atmaService.gettaxnamelist(this.taxInput.nativeElement.value,this.has_taxnamepage+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.taxnamelist = this.taxnamelist.concat(datas);
                      if (this.taxnamelist.length >= 0) {
                        this.has_taxnamenxt = datapagination.has_next;
                        this.has_taxnamepre = datapagination.has_previous;
                        this.has_taxnamepage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    
   
    }
    getsubtaxnameinfinite(){
      setTimeout(() => {
        if (
          this.matsubtaxname &&
          this.autocompleteTrigger &&
          this.matsubtaxname.panel
        ) {
          fromEvent(this.matsubtaxname.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matsubtaxname.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matsubtaxname.panel.nativeElement.scrollTop;
              const scrollHeight = this.matsubtaxname.panel.nativeElement.scrollHeight;
              const elementHeight = this.matsubtaxname.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_subtaxnamenxt === true) {
                  this.atmaService.getsubtaxnamelist(1,this.subtaxInput.nativeElement.value,this.has_subtaxnamepage+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.subtaxnamelist = this.subtaxnamelist.concat(datas);
                      if (this.subtaxnamelist.length >= 0) {
                        this.has_subtaxnamenxt = datapagination.has_next;
                        this.has_subtaxnamepre = datapagination.has_previous;
                        this.has_subtaxnamepage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }
    getinfinitecategory(){
      setTimeout(() => {
        if (
          this.matTaxtaxAutocomplete &&
          this.autocompleteTrigger &&
          this.matTaxtaxAutocomplete.panel
        ) {
          fromEvent(this.matTaxtaxAutocomplete.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matTaxtaxAutocomplete.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matTaxtaxAutocomplete.panel.nativeElement.scrollTop;
              const scrollHeight = this.matTaxtaxAutocomplete.panel.nativeElement.scrollHeight;
              const elementHeight = this.matTaxtaxAutocomplete.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_categorynxt === true) {
                  this.atmaService.getcategoryFKdd(this.catinput.nativeElement.value, this.has_categorypage+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.categoryList = this.categoryList.concat(datas);
                      if (this.categoryList.length >= 0) {
                        this.has_categorynxt = datapagination.has_next;
                        this.has_categorypre = datapagination.has_previous;
                        this.has_categorypage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
      }
  onCancelClick() {
    this.onCancel.emit()
  }
  // numberOnly(event): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;
  // }
  submittaxrate(){
    console.log(this.subtaxaddform.value);
    // if(this.subtaxaddform.get('name').value==undefined || this.subtaxaddform.get('name').value=='' || this.subtaxaddform.get('name').value==null){
    //   this.notification.showError('Please Enter The Name');
    //   return false;
    // }
    if(this.subtaxaddform.get('subtaxname').value==undefined || this.subtaxaddform.get('subtaxname').value=='' || this.subtaxaddform.get('subtaxname').value==null){
      this.notification.showError('Please Enter The Sub Tax Name');
      return false;
    }
    if(this.subtaxaddform.get('subtaxlimit').value==undefined || this.subtaxaddform.get('subtaxlimit').value=='' || this.subtaxaddform.get('subtaxlimit').value==null){
      this.notification.showError('Please Enter The Sub Tax Limit');
      return false;
    }
    if(this.subtaxaddform.get('subtaxremarks').value==undefined || this.subtaxaddform.get('subtaxremarks').value=='' || this.subtaxaddform.get('subtaxremarks').value==null){
      this.notification.showError('Please Enter The Sub Tax Remarks');
      return false;
    }
    if(this.subtaxaddform.get('subcategory').value==undefined || this.subtaxaddform.get('subcategory').value=='' || this.subtaxaddform.get('subcategory').value.id==null){
      this.notification.showError('Please Enter The Categoty');
      return false;
    }
    if(this.subtaxaddform.get('subcategorysub').value.id==undefined || this.subtaxaddform.get('subcategorysub').value=='' || this.subtaxaddform.get('subcategorysub').value.id==null){
      this.notification.showError('Please Enter The SubCategory');
      return false;
    }
    if(this.subtaxaddform.get('glno').value==undefined || this.subtaxaddform.get('glno').value=='' || this.subtaxaddform.get('glno').value==null){
      this.notification.showError('Please Enter The GlNo');
      return false;
    }
    let data:any={
      "tax_id":this.subtaxaddform.get('name').value.id,
      "name":this.subtaxaddform.get('subtaxname').value.trim(),
      "subtaxamount":this.subtaxaddform.get('subtaxlimit').value,
      "remarks":this.subtaxaddform.get('subtaxremarks').value.trim(),
      "category_id":this.subtaxaddform.get('subcategory').value.id,
      "subcategory_id":this.subtaxaddform.get('subcategorysub').value.id,
      "glno":this.subtaxaddform.get('subcategorysub').value.glno
  };
    this.atmaService.getaddtaxname(data).subscribe((datas:any)=>{
      console.log(datas);
      if (datas.code === "INVALID_DATA" && datas.description === "Invalid Data or DB Constraint") {
        this.notification.showWarning("Duplicate Code & Name ...")
       
      } else if (datas.code === "UNEXPECTED_ERROR" && datas.description === "Unexpected Internal Server Error") {
        this.notification.showError("INVALID_DATA!...")
        
      } else {
        this.notification.showSuccess("Saved Successfully!...")
      // this.notification.showSuccess('Successfully Inserted');
      this.onSubmit.emit();
      // this.subtaxaddform.patchValue({'subtaxname':'','subtaxlimit':'','subtaxremarks':'','subcategory':'','subcategorysub':'','glno':''});

      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    );
  }
}
