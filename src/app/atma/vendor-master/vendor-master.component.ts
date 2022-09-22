import { Component, OnInit, Output, EventEmitter, ViewChild, Injectable, TemplateRef, ElementRef } from '@angular/core';
import { SharedService } from '../../service/shared.service'
import { AtmaService } from '../atma.service'
import { ShareService } from '../share.service'
import { NotificationService } from 'src/app/service/notification.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import {
  finalize,
  switchMap,
  tap,
  distinctUntilChanged,
  debounceTime,
  map,
  takeUntil
} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { I } from '@angular/cdk/keycodes';
import { NgxSpinnerService } from 'ngx-spinner';
export interface taxListss {
  name: string;
  id: number;
}
export interface categorylista{
  id:string;
  name:string;
}
export interface subcatgorylista{
  id:string;
  name:string;
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
@Component({
  selector: 'app-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.scss']
})


export class VendorMasterComponent implements OnInit {
  @ViewChild('tax') taxx;
  @ViewChild('taxtype') mattaxAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('catinput') catinput;
  @ViewChild('catlists') matTaxtaxAutocomplete: MatAutocomplete;
  @ViewChild('subInput') subcatinput;
  @ViewChild('catsublists') matcatsublists: MatAutocomplete;
  @ViewChild('taxauto') mattaxname:MatAutocomplete;
  @ViewChild('taxnameinput') taxInput;
  @ViewChild('subtaxrateinfinite') matsubtaxname:MatAutocomplete;
  @ViewChild('inputSubname') subtaxInput;
  @ViewChild('subautoinfinite') matsubtaxratename:MatAutocomplete;
  @ViewChild('inputsubrate') subtaxrateInput;
  @ViewChild('tmprefdata') temprefdata:any;
  @ViewChild('rerapcat') apcatclose:ElementRef;
  @ViewChild('rerapsubcat') apsubcatclose:ElementRef;
  vendorMasterList: any
  urls: string;

  urlTax: string;
  pageSize = 10;
  urlSubTax: string;
  urlTaxRate: string;
  urlBank: string;
  urlPaymode: string;
  uomcrrentpage = 1;
  urlBankbranch: string;
  urlApCategory: string;
  urlProductType: string;
  urlUom: string;
  urlCustomerCategory: string;
  urlProductCategory: string;
  isTax: boolean;
  isSubTax: boolean;
  isTaxRate: boolean;
  isBank: boolean;
  isPaymode: boolean;
  isBankbranch: boolean;
  isProductType: Boolean;
  isApCategory: boolean;
  isUom: boolean;
  isCustomerCategory: boolean;
  isProductCategory: boolean;
  has_nextprocat = true;
  has_previousprocat = true;
  currentpageprocat: number = 1;
  presentpageprocat: number = 1;
  roleValues: string;
  addFormBtn: any;
  isTaxEditForm: boolean;
  isSubTaxEditForm: boolean;
  isTaxRateEditForm: boolean;
  isBankEditForm: boolean;
  isPaymodeEditForm: boolean;
  isBankbranchEditForm: boolean;
  isTaxForm: boolean;
  isSubTaxForm: boolean;
  isTaxRateForm: boolean;
  isBankForm: boolean;
  isPaymodeForm: boolean;
  isBankbranchForm: boolean;
  isProductTypeForm: boolean;
  isProductTypeEditForm: boolean;
  has_nextprotype = true;
  has_previousprotype = true;
  currentpageprotype: number = 1;
  presentpageprotype: number = 1;
  isApCategoryEditForm: boolean;
  isApCategoryForm: boolean;
  has_nextapcat = true;
  has_previousapcat = true;
  currentpageapcat: number = 1;
  presentpageapcat: number = 1;
  taxlist: Array<taxListss>;
  isUomForm: boolean;
  isUomEditForm: boolean;
  isCustomerCategoryForm: boolean;
  isCustomerCategoryEditForm: boolean;
  isProductCategoryForm: boolean;
  isProductCategoryEditForm: boolean;
  ismakerCheckerButton: boolean;
  getTaxList:Array<any>=[];
  getSubTaxList: Array<any>=[];
  getTaxRateList: Array<any>=[];
  txratepage = 1;
  getBankList: Array<any>=[];
  bankpage = 1;
  getPaymodeList: any;
  paymodepage = 1;
  branchbank = 1;
  getBankbranchList: any;
  getProductTypeList: any;
  has_nextcuscat = true;
  has_previouscuscat = true;
  currentpagecuscat: number = 1;
  presentpagecuscat: number = 1;
  getApCategoryList: any;
  UomList: Array<any>=[];
  uompage = 1;
  CustomerCategoryList: any;
  ProductCategoryList: any;
  has_next = true;
  has_previous = true;
  testp = 1;
  subtax_next = true;
  subtax_previous = true;
  taxrate_next = true;
  taxrate_previous = true;
  bank_next = true;
  productcatlist:Array<any>=[];
  bank_previous = true;
  branch_next = true;
  branch_previous = true;
  paymode_next = true;
  paymode_previous = true;
  uom_next = true;
  uom_previous = true
  currentpage: number = 1;
  presentpage = 1;

  urldocgrp: string;
  isDocGrp: boolean;
  docgrplist: any;
  isDocGrpForm: boolean;
  isDocGrpEditForm: boolean;
  proNumber: any;
  first:boolean = false;

  has_nextdoc = true;
  has_previousdoc = false;
  currentpageDoc: number = 1;
  presentpageDoc: number = 1;
  isDocpagination: boolean;
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
  isproduct: boolean;
  urlproduct: string;
  productlist: any
  has_nextpro = true;
  has_previouspro = false;
  currentpagepro: number = 1;
  presentpagepro: number = 1;
  isProductForm: boolean;
  isProductEditForm: boolean;
  taxnamelist:Array<any>=[];
  subtaxnamelist:Array<any>=[];
  subtaxratelist:Array<any>=[];
  isBankPagination: boolean;
  isPaymodePagination: boolean;
  isBankBranchPagination: boolean;
  taxnamelistNew:Array<any>=[];
  subtaxnamelistNew:Array<any>=[];
  subtaxratelistNew:Array<any>=[];
  urlApSubCategory: string;
  isApSubCategory: boolean;
  isApSubCategoryForm: boolean;
  isApSubCategorypage: boolean = true;
  isApSubCategorypages: boolean = true;
  isApSubCategoryEditForm: boolean;
  getApSubCategoryList: any;
  has_nextapsub = true;
  has_previousapsub = true;
  currentpageapsub: number = 1;
  presentpageapsub: number = 1;
  tform: FormGroup;
  subtform: FormGroup;
  taxratetform: FormGroup;
  isLoading = false;
  taxData: any;
  bform: FormGroup;
  pform: FormGroup;
  bbform: FormGroup;
  cform: FormGroup;
  uform: FormGroup;
  prform: FormGroup;
  dform: FormGroup;
  apcform: FormGroup;
  apsform: FormGroup;
  apcategoryform: FormGroup;
  protypeform: FormGroup;
  pcform: FormGroup;
  hsnlist: Array<any>=[];
  hsn: boolean;
  hsnUrl:any;
  ishsnform:boolean;
  ishsneditform:boolean;
  hsn_nextpro = true;
  hsn_previouspro = false;
  hsnpresentpagepro = 1;
  hsnform: FormGroup;
  taxaddfrom:any=FormGroup;
  subtaxaddform:any=FormGroup;
  taxrateaddgorm:any=FormGroup;
  drpdwn:any={'ACTIVE':1,'INACTIVE':0,'ALL':2}
  constructor(private spinner:NgxSpinnerService,private shareService: SharedService, private sharedService: ShareService,
    private atmaService: AtmaService, private fb: FormBuilder, private notification: NotificationService) { }

  ngOnInit(): void {
    this.tform = this.fb.group({
      name: [''],
      drop:['']

    });
    this.taxaddfrom=this.fb.group({
      taxname:['',Validators.required],
      name: ['', Validators.required],
      glno: ['', Validators.required],
      pay_receivable: ['', Validators.required],
      isreceivable:['',Validators.required]
    });
    this.taxaddfrom.get('taxname').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaService.gettaxnamelist(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.taxnamelist=data['data'];
    });
    this.subtform = this.fb.group({
      name: [''],
      tax: ['']

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
    this.taxratetform = this.fb.group({
      name: ['']

    });
    this.subtaxaddform.get('name').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaService.gettaxnamelist(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.taxnamelist=data['data'];
    });
    // this.subtaxaddform.get('tax').valueChanges.pipe(
    //   tap(()=>{
    //     this.isLoading=true;
    //   }),
    //   switchMap(value=>this.atmaService.getsubtaxnamelist(this.subtaxaddform.get('name').value.id,value,1).pipe(
    //     finalize(()=>{
    //       this.isLoading=false;
    //     })
    //   ))
    // ).subscribe(data=>{
    //   this.subtaxnamelist=data['data'];
    // });
    this.taxrateaddgorm=this.fb.group({
      'name':['',Validators.required],
      'subtaxrate':['',Validators.required],
      'subtaxratenew':['',Validators.required],
      'taxratename':['',Validators.required],
      'coderate':['',Validators.required]
    });
    this.taxrateaddgorm.get('name').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaService.gettaxnamelist(value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.taxnamelist=data['data'];
    });
    this.taxrateaddgorm.get('subtaxrate').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaService.getsubtaxnamelist(this.taxrateaddgorm.get('name').value.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.subtaxnamelistNew=data['data'];
    });
    this.taxrateaddgorm.get('subtaxratenew').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.subtaxratelist=data['data'];
    });
    this.bform = this.fb.group({
      name: ['']

    })
    this.pform = this.fb.group({
      name: ['']

    })
    this.bbform = this.fb.group({
      name: ['']

    })
    this.uform = this.fb.group({
      name: ['']

    })
    this.cform = this.fb.group({
      name: ['']

    })
    this.prform = this.fb.group({
      name: [''],
      drop:['']

    })
    this.dform = this.fb.group({
      name: ['']

    })
    this.apcform = this.fb.group({
      name: ['']

    })
    this.apsform = this.fb.group({
      name: ['']

    })
    this.apcategoryform = this.fb.group({
      name: ['']

    })
    this.protypeform = this.fb.group({
      name: ['']

    })
    this.pcform = this.fb.group({
      name: ['']

    })
    this.hsnform = this.fb.group({
      code: [''],
      hsn:[''],
      drop:['']

    });
    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Vendor Master") {
        this.vendorMasterList = subModule;
        // this.isTax = subModule[0].name;
        // if (subModule[0].name === "Tax") {
        //   this.ismakerCheckerButton = this.addFormBtn;
        // }
        console.log("VendorList", this.vendorMasterList)
      }
    });
    // this.hsn=true;
    //   this.getTax();
    //   this.getSubTax();
    //   this.getTaxRate();
    //   this.getBank();
    //   this.getPaymode();
    //   this.getBankbranch();
    //   this.gethsnlist(1);
    //   this.getProductType();
    //   this.getApCategory();

    //   this.getUom();
    //   this.getCustomerCategory();
    //   this.getProductCategory();
    //   this.getdoclist();
    //   this.getproductlist();
    //   this.getApSubCategory();
    this.editapcat = this.fb.group({
      id: '',
      isasset: ''
    })
    this.apcatSearchForm = this.fb.group({
      no: "",
      name: "",
      drop:""
    })
    this.editapsubcat = this.fb.group({
      id: '',
      gstblocked: ['', Validators.required],
      gstrcm: ['', Validators.required],
      status: ''
    })
    this.apsubcatSearchForm = this.fb.group({
      no: "",
      name: "",
      category_id: [''],
      drop:['']
    })
    let apcatkeyvalue: String = "";
    this.getcategory(apcatkeyvalue);
    this.apsubcatSearchForm.get('category_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        console.log('inside tap')

      }),
      switchMap(value => this.atmaService.getcategoryFKdd(value, 1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((results: any[]) => {
      let datas = results["data"];
      this.categoryList = datas;

    });
    this.subtaxaddform.get('subcategory').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
        }),
        switchMap(value=>this.atmaService.getapcat_LoadMore(value,1).pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
      ).subscribe(datas=>{
        this.productcatlist=datas['data'];
      });
      // this.subtaxaddform.get('subcategorysub').valueChanges.pipe(
      //   tap(()=>{
      //     this.isLoading=true;
      //     }),
      //     switchMap(value=>this.atmaService.getapsubcat(this.subtaxaddform.get('subcategory').value.id).pipe(
      //       finalize(()=>{
      //         this.isLoading=false;
      //       })
      //     ))
      //   ).subscribe(datas=>{
      //     this.subcategorylistdata=datas['data'];
      //   });
  }
 datacategory (){
    this.atmaService.getapcat_LoadMore('',1).subscribe(datas=>{
      this.productcatlist=datas['data'];
    });
    console.log(this.productcatlist);
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
  subcategorylistdata:Array<any>=[];
  getdisplaycategoryinterface(data ?:categorylista):string | undefined{
    return data ? data.name:undefined;
  }
  getsubcategoryinterface(data ?:subcatgorylista):string | undefined{
    return data?data.name:undefined;
  }
  dsearch() {
    this.spinner.show();
    this.atmaService.getParentDropDown(this.dform.value.name)
      .subscribe(result => {
        this.spinner.hide();
        let datas = result['data'];
        this.docgrplist = datas;
        let datapagination = result["pagination"];
        this.docgrplist = datas;
        if (this.docgrplist.length >= 0) {
          this.has_nextdoc = datapagination.has_next;
          this.has_previousdoc = datapagination.has_previous;
          this.presentpageDoc = datapagination.index;
          this.isDocpagination = true;
        } if (this.docgrplist <= 0) {
          this.isDocpagination = false;
        }

      },
      (error)=>{
        this.spinner.hide();
      })
  }
  taxsearch() {
    // this.vendorSearchForm.value.code='su';
    let status:any=this.drpdwn[this.tform.value.drop?this.tform.value.drop:'ALL'];
    this.spinner.show();
    this.atmaService.gettaxsummarydata(1,this.tform.value.name,status)
      .subscribe(result => {
        console.log("RESULSSS", result)
        this.spinner.hide();
        // this.vendorSummaryList = result['data']
        this.getTaxList = result['data'];
        let dataPagination = result['pagination'];
        // if (this.getTaxList.length >= 0) {
        //   this.has_next = dataPagination.has_next;
        //   this.has_previous = dataPagination.has_previous;
        //   this.presentpage = dataPagination.index;
        // }
        // if (this.has_next == true) {
        //   this.has_next = true;
        // }
        // if (this.has_previous == true) {
        //   this.has_previous = true;
        // }

      },
      (error)=>{
        this.spinner.hide();
      })

  }
  resettaxdata(){
    this.tform.controls['name'].reset('');
    this.tform.controls['drop'].reset('');
    this.getTax();
  }
  bsearch() {
    this.atmaService.getBankSearchdd(this.bform.value.name, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.getBankList = datas;
        let datapagination = results["pagination"];
        this.getBankList = datas;
        if (this.getBankList.length >= 0) {
          this.bank_next = datapagination.has_next;
          this.bank_previous = datapagination.has_previous;
          this.bankpage = datapagination.index;
          this.isBankPagination = true;
        } if (this.getBankList.length <= 0) {
          this.isBankPagination = false;
        }

      })


  }
  resetbankdata(){
    this.bform.controls['name'].reset('');
    this.getBank(this.bankpage,10);
  }

  taxdroplists() {

    let prokeyvalue: String = "";
    this.gettax(prokeyvalue);
    this.subtform.get('tax').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
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
        this.taxlist = datas;

      })

  }

  private gettax(prokeyvalue) {
    this.atmaService.Tax_dropdownsearchST(prokeyvalue, 1)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.taxlist = datas;

        this.taxData = datas.id;


      })
  }

  get taxtype() {
    return this.subtform.get('tax');
  }
  public getdisplaytaxnamelist(data ?:taxnamelist):string | undefined{
    return data?data.name:undefined;
  }
  public getdisplaysubtaxnamelistinterface(data?:subtaxname):string | undefined{
    return data?data.name:undefined;
  }
  public getdisplaysubtaxrateinterface(data ?:subtaxrate):string | undefined{
    return data?data.name:undefined;
  }
  taxnamelistnew: Array<any>=[];
  gettaxnamelists(){
    this.atmaService.gettaxnamelist('',1).subscribe(data=>{
      this.taxnamelist=data['data'];
    });
  }
  gettaxnamelistnew(){
    this.atmaService.gettaxnamelist('',1).subscribe(data=>{
      this.taxnamelistnew=data['data'];
    });
  }
  //*************** */
  getsubtaxratedatalist(){
    this.atmaService.gettaxnamelist('',1).subscribe(data=>{
      this.taxnamelistNew=data['data'];
    });
  }
  getsubtaxdata(){
    if(this.taxrateaddgorm.get('name').value.id==undefined || this.taxrateaddgorm.get('name').value=='' || this.taxrateaddgorm.get('name').value==null){
      this.notification.showError('Please Select The Tax Name');
      return false;
    }
    console.log(this.taxrateaddgorm.value)
    this.atmaService.getsubtaxnamelist(this.taxrateaddgorm.get('name').value.id,'',1).subscribe(data=>{
      this.subtaxnamelist=data['data'];
    });
    this.taxrateaddgorm.get('subtaxrate').valueChanges.pipe(
    tap(()=>{
      this.isLoading=true;
    }),
    switchMap(value=>this.atmaService.getsubtaxnamelist(this.taxrateaddgorm.get('name').value.id,'',1).pipe(
      finalize(()=>{
        this.isLoading=false;
      })
    ))
    ).subscribe(data=>{
      this.subtaxnamelist=data['data'];
    })
  }
  getsubtaxnameviewdata(){
    if( this.taxrateaddgorm.get('subtaxrate').value.id==undefined ||  this.taxrateaddgorm.get('subtaxrate').value=='' ||  this.taxrateaddgorm.get('subtaxrate').value==null){
      this.notification.showError('Please select The Tax Name');
      return false;
    }
    this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id,'',1).subscribe(data=>{
      this.subtaxratelist=data['data'];
    });
    console.log(this.subtaxratelist);
    this.taxrateaddgorm.get('subtaxratenew').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.subtaxratelist=data['data'];
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
  getsubtaxnameinfiniteNew(){
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
                this.atmaService.getsubtaxnamelist(this.taxrateaddgorm.get('name').value.id,this.subtaxInput.nativeElement.value,this.has_subtaxnamepage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.subtaxnamelistNew = this.subtaxnamelistNew.concat(datas);
                    if (this.subtaxnamelistNew.length >= 0) {
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
  getsubtaxrateinfiniteNew(){
    setTimeout(() => {
      if (
        this.matsubtaxratename &&
        this.autocompleteTrigger &&
        this.matsubtaxratename.panel
      ) {
        fromEvent(this.matsubtaxratename.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubtaxratename.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matsubtaxratename.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubtaxratename.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubtaxratename.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_subtaxratenamenxt === true) {
                this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id,this.subtaxrateInput.nativeElement.value,this.has_subtaxratenamepage+1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.subtaxratelistNew = this.subtaxratelistNew.concat(datas);
                    if (this.subtaxratelistNew.length >= 0) {
                      this.has_subtaxratenamenxt = datapagination.has_next;
                      this.has_subtaxratenamepre = datapagination.has_previous;
                      this.has_subtaxratenamepage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }
  gettaxnamelistsednew(){
    if(this.taxrateaddgorm.get('name').value.id==undefined || this.taxrateaddgorm.get('name').value=='' || this.taxrateaddgorm.get('name').value==null){
      this.notification.showError('Please Select The Tax Name');
      return false;
    }
    console.log(this.taxrateaddgorm.value)
    this.atmaService.getsubtaxnamelist(this.taxrateaddgorm.get('name').value.id,'',1).subscribe(data=>{
      this.subtaxnamelistNew=data['data'];
    });
  }

  getsubtaxnamelistrate(){
    if( this.taxrateaddgorm.get('subtaxrate').value.id==undefined ||  this.taxrateaddgorm.get('subtaxrate').value=='' ||  this.taxrateaddgorm.get('subtaxrate').value==null){
      this.notification.showError('Please select The Tax Name');
      return false;
    }
    this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id,'',1).subscribe(data=>{
      this.subtaxratelistNew=data['data'];
    });
    console.log(this.subtaxratelist);
    this.taxrateaddgorm.get('subtaxratenew').valueChanges.pipe(
      tap(()=>{
        this.isLoading=true;
      }),
      switchMap(value=>this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id,value,1).pipe(
        finalize(()=>{
          this.isLoading=false;
        })
      ))
    ).subscribe(data=>{
      this.subtaxratelistNew=data['data'];
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
  public displayFntax(taxtype?: taxListss): string | undefined {

    return taxtype ? taxtype.name : undefined;
  }
  subtaxsearch() {
    if (this.subtform.value.tax.id == '' || undefined) {
      this.subtform.value.tax.id = 0
    }
    this.spinner.show();
    this.atmaService.subTax_filter_new(this.subtform.value.name, this.subtform.value.tax.id,this.testp)
      .subscribe(result => {
        this.spinner.hide();
        this.getSubTaxList = result['data'];
        let dataPagination = result['pagination'];
        // if (this.getSubTaxList.length >= 0) {
        //   this.subtax_next = dataPagination.has_next;
        //   this.subtax_previous = dataPagination.has_previous;
        //   this.testp = dataPagination.index;
        // }

      },
      (error)=>{
        this.spinner.hide();
      }
      )

  }
  suntaxresetdata(){
    this.subtform.controls['name'].reset('');
    this.getSubTax(this.testp);

  }
  taxratesearch() {

    this.spinner.show();
    this.atmaService.taxrate_dropdownsearchST_new(this.taxratetform.value.name,this.txratepage=1)
      .subscribe(result => {
        this.spinner.hide();
        this.getTaxRateList = result['data'];
        let dataPagination = result['pagination'];
        // if (this.getTaxRateList.length >= 0) {
        //   this.taxrate_next = dataPagination.has_next;
        //   this.taxrate_previous = dataPagination.has_previous;
        //   this.txratepage = dataPagination.index;
        // }

      },
      (error)=>{
        this.spinner.hide();
      });

  }
  resettaxrate(){
    this.taxratetform.controls['name'].reset('');
    this.getTaxRate(this.txratepage);
  }
  subModuleData(data) {
    this.urls = data.url;
    this.urlSubTax = "/subtax";
    this.urlTax = "/tax";
    this.urlTaxRate = "/taxrate";
    this.urlBank = "/bank";
    this.urlPaymode = "/paymode";
    this.urlBankbranch = "/bankbranch";
    this.urlProductType = "/producttype";
    this.urlApCategory = "/apcategory";
    this.urlUom = "/uom";
    this.urlCustomerCategory = "/customercategory";
    this.urlProductCategory = "/productcategory";
    this.urldocgrp = "/documentgroup";
    this.urlproduct = "/product";
    this.hsnUrl= "/hsn";
    this.urlApSubCategory = "/apsubcategory";
    this.isApSubCategory = this.urlApSubCategory === this.urls ? true : false;
    this.isTax = this.urlTax === this.urls ? true : false;
    this.isSubTax = this.urlSubTax === this.urls ? true : false;
    this.isTaxRate = this.urlTaxRate === this.urls ? true : false;
    this.isBank = this.urlBank === this.urls ? true : false;
    this.isPaymode = this.urlPaymode === this.urls ? true : false;
    this.isBankbranch = this.urlBankbranch === this.urls ? true : false;
    this.isProductType = this.urlProductType === this.urls ? true : false;
    this.isApCategory = this.urlApCategory === this.urls ? true : false;
    this.isUom = this.urlUom === this.urls ? true : false;
    this.isCustomerCategory = this.urlCustomerCategory === this.urls ? true : false;
    this.isProductCategory = this.urlProductCategory === this.urls ? true : false;
    this.isDocGrp = this.urldocgrp === this.urls ? true : false;
    this.isproduct = this.urlproduct === this.urls ? true : false;
    this.hsn =this.hsnUrl=== this.urls ? true:false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;
    if (this.hsn) {
      // this.hsn = true;
      this.gethsnlist(1);
      this.ishsneditform=false;
      this.ishsnform=false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    }
   

    if (this.isTax) {
      this.getTax();
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    } else if (this.isSubTax) {
      this.getSubTax(1);
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    } else if (this.isTaxRate) {
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.getTaxRate(1);
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    } else if (this.isBank) {
      this.getBank();
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    } else if (this.isPaymode) {

      this.getPaymode();

      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    } else if (this.isBankbranch) {
      this.getBankbranch(1);
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    } else if (this.isUom) {
      this.getUom();
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    } else if (this.isCustomerCategory) {

      this.getCustomerCategory();

      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    } else if (this.isProductCategory) {

      this.getProductCategory(1);
      this.isProductType=false;
      this.isProductForm=false;
      this.isProductTypeEditForm=false;
      this.isProductTypeForm=false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    }
    else if (this.isProductType) {
      this.getProductType(1);
      this.isProductType=true;
      this.isProductForm=false;
      this.isProductCategory=false;
      this.isProductCategoryEditForm=false;
      this.isProductCategoryForm=false;
      this.isProductTypeEditForm=false;
      this.isProductTypeForm=false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      // this.isApCategoryEditForm=false;
      // this.isApCategoryForm=false
      // this.isApCategoryEditForm=false;
      // this.isApCategoryForm=false;
      // this.isApCategory=false;
      // this.isApSubCategoryForm=false;
      // this.isApSubCategoryEditForm=false;
      this.isProductTypeForm = false;
      this.isProductTypeEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    }
    else if (this.isApCategory) {

      this.getapcategorynew();

      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      // this.isApSubCategory=false;
      // this.isApSubCategoryForm=false;
      // this.isApSubCategoryEditForm=false;
      this.isProductTypeEditForm = false;
      this.isProductTypeForm = false;
      this.isProductType = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    } else if (this.isDocGrp) {

      this.getdoclist();

      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isProductTypeForm = false;
      this.isProductTypeEditForm = false;
      this.isProductType = false;

      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    } else if (this.isproduct) {

      this.getproductlist();

      this.isProductCategoryForm = false;
      this.isProductCategoryEditForm = false;
      this.isCustomerCategoryForm = false;
      this.isCustomerCategoryEditForm = false;
      this.isUomForm = false;
      this.isUomEditForm = false;
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isBankForm = false;
      this.isPaymodeForm = false;
      this.isBankbranchForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isBankEditForm = false;
      this.isPaymodeEditForm = false;
      this.isBankbranchEditForm = false;
      this.isProductTypeForm = false;
      this.isProductTypeEditForm = false;
      this.isProductType = false;

      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isDocGrpForm = false;
      this.isDocGrpEditForm = false;
      this.isProductForm = false;
      this.isProductEditForm = false;
    } else if (this.isApSubCategory) {

      this.getapsubcategory();
      this.isSubTaxForm = false;
      this.isTaxRateForm = false;
      this.isTaxForm = false;
      this.isTaxEditForm = false;
      this.isSubTaxEditForm = false;
      this.isTaxRateEditForm = false;
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false
      this.isApCategoryEditForm = false;
      this.isApCategoryForm = false;
      this.isApCategory = false;
      this.isApSubCategoryForm = false;
      this.isApSubCategoryEditForm = false;
      this.isProductTypeForm = false;
      this.isProductTypeEditForm = false;
      this.isProductTypeForm = false;
      this.isProductType = false;
    }

    if (this.roleValues === "Maker") {
      this.ismakerCheckerButton = true;
    } else if (this.roleValues === "Checker") {
      this.ismakerCheckerButton = false;
    }
  }


  addForm() {
    if (this.addFormBtn === "Tax") {
      this.isTaxForm = true;
      this.isTax = false;
      this.ismakerCheckerButton = false;
    } else if (this.addFormBtn === "Sub Tax") {
      this.isSubTaxForm = true;
      this.ismakerCheckerButton = false
      this.isSubTax = false;
    } else if (this.addFormBtn === "Tax Rate") {
      this.ismakerCheckerButton = false;
      this.isTaxRateForm = true;
      this.isTaxRate = false
    }
    else if (this.addFormBtn === "Bank") {
      this.ismakerCheckerButton = false;
      this.isBankForm = true;
      this.isBank = false
    } else if (this.addFormBtn === "Paymode") {
      this.ismakerCheckerButton = false;
      this.isPaymodeForm = true;
      this.isPaymode = false
    } else if (this.addFormBtn === "Bank Branch") {
      this.ismakerCheckerButton = false;
      this.isBankbranchForm = true;
      this.isBankbranch = false
    } else if (this.addFormBtn === "Product Type") {
      this.ismakerCheckerButton = false;
      this.isProductTypeForm = true;
      this.isProductType = false
    }
    else if (this.addFormBtn === "Product Subcategory") {
      this.ismakerCheckerButton = false;
      this.isProductTypeForm = true;
      this.isProductType = false
    }
    else if (this.addFormBtn === "AP Category") {
      this.ismakerCheckerButton = false;
      this.isApCategoryForm = true;
      this.isApCategory = false
    } else if (this.addFormBtn === "UOM") {
      this.ismakerCheckerButton = false;
      this.isUomForm = true;
      this.isUom = false
    } else if (this.addFormBtn === "Customer Category") {
      this.ismakerCheckerButton = false;
      this.isCustomerCategoryForm = true;
      this.isCustomerCategory = false
    } else if (this.addFormBtn === "Product Category") {
      this.ismakerCheckerButton = false;
      this.isProductCategoryForm = true;
      this.isProductCategory = false
    } else if (this.addFormBtn === "Document Group") {
      this.ismakerCheckerButton = false;
      this.isDocGrpForm = true;
      this.isDocGrp = false
    } else if (this.addFormBtn === "Product") {
      this.ismakerCheckerButton = false;
      this.isProductForm = true;
      this.isproduct = false
    } else if (this.addFormBtn === "AP Subcategory") {
      this.ismakerCheckerButton = false;
      this.isApSubCategoryForm = true;
      this.isApSubCategory = false
    }
    else if (this.addFormBtn === "HSN") {
      this.ismakerCheckerButton = false;
      this.ishsnform = true;
      this.hsn= false;
      this.ishsneditform=false;
    }
  }
  hsnCancel() {
    this.gethsnlist(1);
    this.ishsnform = false;
    this.ismakerCheckerButton = true;
    this.hsn = true;
    this.ishsneditform=false;
  }

  hsnSubmit() {
    this.gethsnlist(1);
    this.ishsnform = false;
    this.ismakerCheckerButton = true;
    this.hsn = true;
    this.ishsneditform=false;
  }
  hsnedit(data:any){
    this.ishsnform = false;
    this.ismakerCheckerButton = false;
    this.hsn = false;
    this.ishsneditform=true;
    this.sharedService.hsnedit.next(data);
    return true;
  }
  hsnactiveinactive(data:any){
    let d:any={
      'id':data.id,
      'status':data.status
    };
    this.atmaService.gethsnactiveinactive(d).subscribe(res=>{
      if(res['status']=='success'){
        this.gethsnlist(1);
        this.notification.showSuccess(res['message']);
      }
      else{
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    );
  }
  getTax(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      let status:any=this.drpdwn[this.tform.value.drop?this.tform.value.drop:'ALL'];
      let d:any=this.tform.value.name !=undefined?this.tform.value.name:'';
      this.spinner.show();
    this.atmaService.gettaxsummarydata(this.presentpage,'',status)
      .subscribe(result => {
        this.spinner.hide();
        this.getTaxList = result['data'];
        let dataPagination = result['pagination'];
        if (this.getTaxList.length >= 0) {
          this.has_next = dataPagination.has_next;
          this.has_previous = dataPagination.has_previous;
          this.presentpage = dataPagination.index;
        }
        if (this.has_next == true) {
          this.has_next = true;
        }
        if (this.has_previous == true) {
          this.has_previous = true;
        }
      },
      (error)=>{
        this.spinner.hide();
      }
      )
  }

  nextClickTax() {
    if (this.has_next === true) {
      this.presentpage = this.presentpage + 1
      this.getTax();
    }
  }

  previousClickTax() {
    if (this.has_previous === true) {
      this.presentpage = this.presentpage - 1
      this.getTax();
    }
  }
  taxCancel() {
    this.getTax();
    this.isTaxForm = false;
    this.ismakerCheckerButton = true;
    this.isTax = true
  }

  taxSubmit() {
    this.getTax();
    this.isTaxForm = false;
    this.ismakerCheckerButton = true;
    this.isTax = true
  }

  getTaxRate( pageNumber) {
    this.spinner.show();
    this.atmaService.getTaxRate('','', pageNumber, 10)
      .subscribe(result => {
        this.spinner.hide();
        this.getTaxRateList = result['data'];
        let dataPagination = result['pagination'];
        if (this.getTaxRateList.length >= 0) {
          this.taxrate_next = dataPagination.has_next;
          this.taxrate_previous = dataPagination.has_previous;
          this.txratepage = dataPagination.index;
        }
      },
      (error)=>{
        this.spinner.hide();
      }
      )
  }
  dataclear(){
    this.taxaddfrom.reset('');
    this.subtaxaddform.reset('');
    this.taxrateaddgorm.reset('');
    this.temprefdata.nativeElement.click();
  }
  nextClickTaxRate() {
    if (this.taxrate_next === true) {
      this.txratepage +=1;
      // this.taxratesearch();
      this.getTaxRate(this.txratepage);
    }
  }

  previousClickTaxRate() {

    if (this.taxrate_previous === true) {
      this.txratepage -=1;
      this.getTaxRate(this.txratepage);
      // this.taxratesearch();
    }
  }

  taxRateCancel() {
    this.getTaxRate(1);
    this.isTaxRateForm = false;
    this.ismakerCheckerButton = true;
    this.isTaxRate = true
  }

  taxRateSubmit() {
    this.presentpage = 1;
    this.getTaxRate(1);
    this.isTaxRateForm = false;
    this.ismakerCheckerButton = true;
    this.isTaxRate = true
  }


  getSubTax(pageNumber) {
    this.spinner.show();
    this.atmaService.getSubTax('', '', pageNumber, 10)
      .subscribe(result => {
        this.spinner.hide();
        this.getSubTaxList = result['data'];
        let dataPagination = result['pagination'];
        if (this.getSubTaxList.length >= 0) {
          this.subtax_next = dataPagination.has_next;
          this.subtax_previous = dataPagination.has_previous;
          this.testp = dataPagination.index;
        }
      },
      (error)=>{
        this.spinner.hide();
      }
      )
  }
  nextClickSubTax() {
    if (this.subtax_next === true) {
      this.testp +=1;
      // this.subtaxsearch();
      this.getSubTax( this.testp);
    }
  }

  previousClickSubTax() {
    if (this.subtax_previous === true) {
      this.testp -=1;
      // this.subtaxsearch();
      this.getSubTax( this.testp)
    }
  }
  subTaxCancel() {
    this.getSubTax(1);
    this.isSubTaxForm = false;
    this.ismakerCheckerButton = true;
    this.isSubTax = true
  }

  subTaxSubmit() {
    this.getSubTax(1);
    this.isSubTax = true;
    this.ismakerCheckerButton = true;
    this.isSubTaxForm = false
  }


  getBank(
    pageNumber = 1, pageSize = 10) {
      this.spinner.show();
    this.atmaService.getBankList(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        this.getBankList = datas;
        let datapagination = results["pagination"];
        this.getBankList = datas;
        if (this.getBankList.length >= 0) {
          this.bank_next = datapagination.has_next;
          this.bank_previous = datapagination.has_previous;
          this.bankpage = datapagination.index;
          this.isBankPagination = true;
        } if (this.getBankList.length <= 0) {
          this.isBankPagination = false;
        }
      },
      (error)=>{
        this.spinner.hide();
      }
      )
  }
  bank_nextClick() {
    if (this.bank_next === true) {
      // this.currentpage= this.presentpage + 1
      this.getBank(this.bankpage + 1, 10)
    }
  }

  bank_previousClick() {
    if (this.bank_previous === true) {
      // this.currentpage= this.presentpage - 1
      this.getBank(this.bankpage - 1, 10)
    }
  }

  bankCancel() {
    this.getBank();
    this.isBankForm = false;
    this.ismakerCheckerButton = true;
    this.isBank = true
  }

  bankSubmit() {
    this.getBank();
    this.isBank = true;
    this.ismakerCheckerButton = true;
    this.isBankForm = false
  }

  getPaymode(pageNumber = 1, pageSize = 10) {
    this.spinner.show();
    this.atmaService.getPaymodeList(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        this.getPaymodeList = datas;
        let datapagination = results["pagination"];
        this.getPaymodeList = datas;
        if (this.getPaymodeList.length >= 0) {
          this.paymode_next = datapagination.has_next;
          this.paymode_previous = datapagination.has_previous;
          this.paymodepage = datapagination.index;
          this.isPaymodePagination = true;
        }
        if (this.getPaymodeList <= 0) {
          this.isPaymodePagination = false;
        }
      },
      (error)=>{
        this.spinner.hide();
      }
      )
  }
  paymode_nextClick() {
    if (this.paymode_next === true) {

      this.getPaymode(this.paymodepage + 1, 10)
    }
  }

  paymode_previousClick() {
    if (this.paymode_previous === true) {

      this.getPaymode(this.paymodepage - 1, 10)
    }
  }
  psearch() {
    let data:any=this.pform.value.name;
    this.spinner.show();
    this.atmaService.paymodedropdown(data)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        this.getPaymodeList = datas;
        let datapagination = results["pagination"];
        this.getPaymodeList = datas;
        // if (this.getPaymodeList.length >= 0) {
        //   this.paymode_next = datapagination.has_next;
        //   this.paymode_previous = datapagination.has_previous;
        //   this.paymodepage = datapagination.index;
        //   this.isPaymodePagination = true;
        // }
        if (this.getPaymodeList <= 0) {
          this.isPaymodePagination = false;
        }

      },
      (error)=>{
        this.spinner.hide();
      });
  }
  resetdatapaymode(){
    this.pform.reset('');
    this.getPaymode(this.paymodepage,10);
  }
  prsearch() {
    let status:any=this.drpdwn[this.prform.value.drop?this.prform.value.drop:'ALL'];
    this.spinner.show();
    this.atmaService.getproductpage(1,10,this.prform.value.name,status)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datapagination = results["pagination"];
        this.productlist = results["data"];;
        if (this.productlist.length >= 0) {
          this.has_nextpro = datapagination.has_next;
          this.has_previouspro = datapagination.has_previous;
          this.presentpagepro = datapagination.index;
        }
      },
      (error)=>{
        this.spinner.hide();
      });

  }
  resetproductdata(){
    this.prform.controls['name'].reset('');
    this.prform.controls['drop'].reset('');
    this.getproductpage(this.presentpagepro,10);
  }
  csearch() {
    this.spinner.show();
    this.atmaService.customercategory_searchfilter(this.cform.value.name)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.CustomerCategoryList = datas;
        if (this.CustomerCategoryList.length >= 0) {

          this.has_nextcuscat = datapagination.has_next;
          this.has_previouscuscat = datapagination.has_previous;
          this.presentpagecuscat = datapagination.index;
        }

      },
      (error)=>{
        this.spinner.hide();
      });
  }
  bbsearch() {
    this.spinner.show();
    this.atmaService.bankbranchfilter_new(this.bbform.value.name,1)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        this.getBankbranchList = datas;
        let datapagination = results["pagination"];
        this.getBankbranchList = datas;
        // if (this.getBankbranchList.length >= 0) {
          // this.branch_next = datapagination.has_next;
          // this.branch_previous = datapagination.has_previous;
          // this.branchbank = datapagination.index;
          // this.branchbank = datapagination.index;
        //   this.isBankBranchPagination = true;
        // } if (this.getBankbranchList <= 0) {
        //   this.isBankBranchPagination = false;
        // }

      },
      (error)=>{
        this.spinner.hide();
      }
      );
  }
  bankbranchfatareset(){
    this.bbform.controls['name'].reset('');
    this.getBankbranch(this.branchbank,10);
  }


  usearch() {
    this.spinner.show();
    this.atmaService.getuom_Search_new(this.uform.value.name,1)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.UomList = datas;
        // if (this.UomList.length >= 0) {
        //   this.uom_next = datapagination.has_next;
        //   this.uom_previous = datapagination.has_previous;
        //   this.uompage = datapagination.index;
        // }

      },
      (error)=>{
        this.spinner.hide();
      });

  }
  resetuomreset(){
    this.uform.reset('');
    this.getUom(this.uompage);
  }
  pcsearch() {
    this.spinner.show();
    this.atmaService.prodcategory_searchfilter(this.pcform.value.name,this.presentpageprocat=1)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.ProductCategoryList = datas;
        // if (this.ProductCategoryList.length >= 0) {
        //   this.has_nextprocat = datapagination.has_next;
        //   this.has_previousprocat = datapagination.has_previous;
        //   this.presentpageprocat = datapagination.index;

        // }

      },
      (error)=>{
        this.spinner.hide();
      });

  }
  resetproductcategorydata(){
    this.pcform.controls['name'].reset('');
    this.getProductCategory(this.presentpageprocat);
  }
  hsnsearch(hsnpresentpagepro) {
    let status:any=this.drpdwn[this.hsnform.value.drop?this.hsnform.value.drop:'ALL'];
    this.spinner.show();
    this.atmaService.hsnsearch(this.hsnform.value.hsn,hsnpresentpagepro,status)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let hsnpagedata = results["pagination"];
        this.hsnlist = results["data"];
        if (this.hsnlist.length >= 0) {
          this.hsn_nextpro = hsnpagedata.has_next;
          this.hsn_previouspro = hsnpagedata.has_previous;
          this.hsnpresentpagepro = hsnpagedata.index;
        }
      },
      (error)=>{
        this.spinner.hide();
      });

  }
  hsnsearch_page(hsnpresentpagepro) {
    let status:any=this.drpdwn[this.hsnform.value.drop?this.hsnform.value.drop:'ALL'];
    this.spinner.show();
    this.atmaService.hsnsearch(this.hsnform.value.hsn,hsnpresentpagepro,status)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let hsnpagedata = results["pagination"];
        this.hsnlist = results["data"];
        if (this.hsnlist.length >= 0) {
          this.hsn_nextpro = hsnpagedata.has_next;
          this.hsn_previouspro = hsnpagedata.has_previous;
          this.hsnpresentpagepro = hsnpagedata.index;
        }
      },
      (error)=>{
        this.spinner.hide();
      });

  }
  protypesearch() {
    this.spinner.show();
    this.atmaService.prodtype_searchfilter(this.protypeform.value.name,1)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.getProductTypeList = datas;
        // if (this.getProductTypeList.length >= 0) {
        //   this.has_nextprotype = datapagination.has_next;
        //   this.has_previousprotype = datapagination.has_previous;
        //   this.presentpageprotype = datapagination.index;

        // }

      },
      (error)=>{
        this.spinner.hide();
      });

  }
  resetproductsubdata(){
    this.protypeform.controls['name'].reset('');
    this.getProductType(this.presentpageprotype);
  }
  apcategorysearch() {
    this.atmaService.apcategory_searchfilter(this.apcategoryform.value.name)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.getApCategoryList = datas;
        if (this.getApCategoryList.length >= 0) {
          this.has_nextapcat = datapagination.has_next;
          this.has_previousapcat = datapagination.has_previous;
          this.presentpageapcat = datapagination.index;
        }

      })

  }

  paymodeCancel() {
    this.getPaymode();
    this.isPaymodeForm = false;
    this.ismakerCheckerButton = true;
    this.isPaymode = true
  }

  paymodeSubmit() {
    this.getPaymode();
    this.isPaymode = true;
    this.ismakerCheckerButton = true;
    this.isPaymodeForm = false
  }

  getBankbranch(pageNumber, pageSize = 10) {
    this.spinner.show();
    this.atmaService.getBankbranchList(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        this.getBankbranchList = datas;
        let datapagination = results["pagination"];
        this.getBankbranchList = datas;
        if (this.getBankbranchList.length >= 0) {
          this.branch_next = datapagination.has_next;
          this.branch_previous = datapagination.has_previous;
          this.branchbank = datapagination.index;
          this.isBankBranchPagination = true;
        } if (this.getBankbranchList <= 0) {
          this.isBankBranchPagination = false;
        }
      },
      (error)=>{
        this.spinner.hide();
      }
      )
  }
  bankbranch_nextClick() {
    if (this.branch_next === true) {
      this.branchbank +=1;
      // this.bbsearch();
      this.getBankbranch(this.branchbank);
    }
  }

  bankbranch_previousClick() {
    if (this.branch_previous === true) {
      this.branchbank -=1;
      // this.bbsearch();
      this.getBankbranch(this.branchbank);
    }
  }
  private getProductType(pageNumber) {
    this.spinner.show();
    this.atmaService.getProductType(pageNumber)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        this.getProductTypeList = datas;
        let datapagination = results["pagination"];
        this.getProductTypeList = datas;
        if (this.getProductTypeList.length >= 0) {
          this.has_nextprotype = datapagination.has_next;
          this.has_previousprotype = datapagination.has_previous;
          this.presentpageprotype = datapagination.index;

        }
      },
      (error)=>{
        this.spinner.hide();
      }
      )


  }
  nextClickproducttype() {
    if (this.has_next === true) {
      this.presentpageprotype +=1;
      this.getProductType(this.presentpageprotype);
      // this.protypesearch();
    }
  }

  previousClickproducttype() {
    if (this.has_previous === true) {
      this.presentpageprotype -=1;
      this.getProductType(this.presentpageprotype);
      // this.protypesearch();
    }
  }

  private getApCategory(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.atmaService.getApCategory(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.getApCategoryList = datas;
        let datapagination = results["pagination"];
        this.getApCategoryList = datas;
        if (this.getApCategoryList.length >= 0) {

          this.has_nextapcat = datapagination.has_next;
          this.has_previousapcat = datapagination.has_previous;
          this.presentpageapcat = datapagination.index;
        }
        // if(this.has_next==true){
        //   this.has_next=true;
        // }
        // if(this.has_previous==true){
        //   this.has_previous=true;

        // }
      })
  }
  nextClickapcategory() {
    if (this.has_nextapcat === true) {
      this.presentpageapcat +=1;
      this.getapcategorynew(this.presentpageapcat,10);
    }
  }

  previousClickapcategory() {
    if (this.has_previousapcat === true) {
      this.presentpageapcat -=1;
      this.getapcategorynew(this.presentpageapcat,10);

    }
  }



  bankBranchCancel() {
    this.getBankbranch(1);
    this.isBankbranchForm = false;
    this.ismakerCheckerButton = true;
    this.isBankbranch = true
  }

  bankBranchSubmit() {
    this.getBankbranch(1);
    this.isBankbranch = true;
    this.ismakerCheckerButton = true;
    this.isBankbranchForm = false
  }


  taxEditCancel() {
    this.getTax();
    this.isTaxEditForm = false;
    this.ismakerCheckerButton = true;
    this.isTax = true;
  }

  taxEditSubmit() {
    this.getTax();
    this.isTaxEditForm = false;
    this.ismakerCheckerButton = true;
    this.isTax = true;
  }

  subTaxEditCancel() {
    this.getSubTax(1);
    this.isSubTaxEditForm = false;
    this.ismakerCheckerButton = true;
    this.isSubTax = true;
  }


  subTaxeditSubmit() {
    this.getSubTax(1);
    this.isSubTaxEditForm = false;
    this.ismakerCheckerButton = true;
    this.isSubTax = true;
  }
  taxRateEditCancel() {
    this.getTaxRate(1);
    this.isTaxRateEditForm = false;
    this.ismakerCheckerButton = true;
    this.isTaxRate = true;
  }
  taxRateEditSubmit() {
    this.presentpage = 1;
    this.getTaxRate(1);
    this.isTaxRateEditForm = false;
    this.ismakerCheckerButton = true;
    this.isTaxRate = true;
  }
  bankEditCancel() {
    this.getBank();
    this.isBankEditForm = false;
    this.ismakerCheckerButton = true;
    this.isBank = true;
  }
  bankEditSubmit() {
    this.getBank();
    this.isBankEditForm = false;
    this.ismakerCheckerButton = true;
    this.isBank = true;
  }
  paymodeEditCancel() {
    this.isPaymodeEditForm = false;
    this.ismakerCheckerButton = true;
    this.isPaymode = true;
  }
  paymodeEditSubmit() {
    this.getPaymode();
    this.isPaymodeEditForm = false;
    this.ismakerCheckerButton = true;
    this.isPaymode = true;
  }
  bankBranchEditCancel() {
    this.getBankbranch(1);
    this.isBankbranchEditForm = false;
    this.ismakerCheckerButton = true;
    this.isBankbranch = true;
  }
  bankbranchEditSubmit() {
    this.getBankbranch(1);
    this.isBankbranchEditForm = false;
    this.ismakerCheckerButton = true;
    this.isBankbranch = true;
  }
  producttypeCancel() {
    this.getProductType(1);
    this.isProductTypeForm = false;
    this.ismakerCheckerButton = true;
    this.isProductType = true
  }

  producttypeSubmit() {
    this.getProductType(1);
    this.isProductTypeForm = false;
    this.ismakerCheckerButton = true;
    this.isProductType = true
  }

  producttypeEditCancel() {
    this.getProductType(1);
    this.isProductTypeEditForm = false;
    this.ismakerCheckerButton = true;
    this.isProductType = true
  }

  producttypeEditSubmit() {
    this.getProductType(1);
    this.isProductTypeEditForm = false;
    this.ismakerCheckerButton = true;
    this.isProductType = true
  }

  apCategoryCancel() {
    this.getApCategory();
    this.isApCategoryForm = false;
    this.ismakerCheckerButton = true;
    this.isApCategory = true
  }

  apCategorySubmit() {
    this.getApCategory();
    this.isApCategoryForm = false;
    this.ismakerCheckerButton = true;
    this.isApCategory = true
  }

  apcategoryEditCancel() {
    this.getApCategory();
    this.isApCategoryEditForm = false;
    this.ismakerCheckerButton = true;
    this.isApCategory = true;
  }
  apcategoryEditSubmit() {
    this.getApCategory();
    this.isApCategoryEditForm = false;
    this.ismakerCheckerButton = true;
    this.isApCategory = true;
  }

  apCategoryEdit(data) {
    this.isApCategoryEditForm = true;
    this.isApCategory = false;
    this.ismakerCheckerButton = false;
    this.sharedService.apCategoryEdit.next(data)
    return data;
  }
  apsubcategoryEditCancel() {
    this.getApSubCategory();
    this.isApSubCategoryEditForm = false;
    this.ismakerCheckerButton = true;
    this.isApSubCategory = true;
  }
  apsubcategoryEditSubmit() {
    this.getApSubCategory();
    this.isApSubCategoryEditForm = false;
    this.ismakerCheckerButton = true;
    this.isApSubCategory = true;
  }




  subTaxEdit(data) {
    this.isSubTaxEditForm = true;
    this.isSubTax = false;
    this.ismakerCheckerButton = false;
    this.sharedService.subTaxEdit.next(data)
    return data;
  }
  taxEdit(data) {
    this.isTaxEditForm = true;
    this.isTax = false;
    this.ismakerCheckerButton = false;
    this.sharedService.taxEdit.next(data)
    return data;
  }

  taxRateEdit(data) {
    this.isTaxRateEditForm = true;
    this.isTaxRate = false;
    this.ismakerCheckerButton = false;
    this.sharedService.taxRateEdit.next(data)
    return data;
  }
  bankEdit(data) {
    this.isBankEditForm = true;
    this.isBank = false;
    this.ismakerCheckerButton = false;
    this.sharedService.bankEditValue.next(data)
    return data;
  }
  paymodeEdit(data) {
    this.isPaymodeEditForm = true;
    this.isPaymode = false;
    this.ismakerCheckerButton = false;
    this.sharedService.paymodeEditValue.next(data)
    return data;
  }
  bankbranchEdit(data) {
    this.isBankbranchEditForm = true;
    this.isBankbranch = false;
    this.ismakerCheckerButton = false;
    this.sharedService.bankBranchEditValue.next(data)
    return data;
  }
  producttypeEdit(data) {
    this.isProductTypeEditForm = true;
    this.isProductType = false;
    this.ismakerCheckerButton = false;
    this.sharedService.productTypeEdit.next(data)
    return data;
  }
  getproductactive(data){
    let fdata:any={'status':data.status};
    this.atmaService.productactiveinactive(data.id,fdata).subscribe(data=>{
      this.notification.showSuccess(data['message']);
      this.getproductlist();
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    );
   
  }
  // apCategoryEdit(data) {
  //   this.isApCategoryEditForm = true;
  //   this.isApCategory = false;
  //   this.ismakerCheckerButton = false;
  //   this.sharedService.apCategoryEdit.next(data)
  //   return data;
  // }


  getUom(pageNumber = 1) {
    this.spinner.show();
    this.atmaService.getUom(pageNumber)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.UomList = datas;
        if (this.UomList.length >= 0) {
          this.uom_next = datapagination.has_next;
          this.uom_previous = datapagination.has_previous;
          this.uompage = datapagination.index;
        }
      },
      (error)=>{
        this.spinner.hide();
      }
      )
  }

  uom_nextClick() {
    if (this.uom_next === true) {
      this.uompage +=1;
      this.getUom(this.uompage);
    }
  }

  uom_previousClick() {
    if (this.uom_previous === true) {
      this.uompage -=1;
      this.getUom( this.uompage );
    }
  }
  uomEdit(data) {
    this.isUomEditForm = true;
    this.isUom = false;
    this.ismakerCheckerButton = false;
    this.sharedService.uomEdit.next(data)
    return data;
  }
  uomSubmit() {
    this.getUom();
    this.isUomForm = false;
    this.ismakerCheckerButton = true;
    this.isUom = true;
  }
  uomCancel() {
    this.ismakerCheckerButton = true;
    this.isUom = true;
    this.isUomForm = false;
  }
  uomEditSubmit() {
    this.getUom();
    this.ismakerCheckerButton = true;
    this.isUom = true;
    this.isUomEditForm = false;
  }
  uomEditCancel() {
    this.ismakerCheckerButton = true;
    this.isUom = true;
    this.isUomEditForm = false;
  }



  getCustomerCategory(pageNumber = 1) {
    this.spinner.show();
    this.atmaService.getCustomerCategory(pageNumber)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.CustomerCategoryList = datas;
        if (this.CustomerCategoryList.length >= 0) {

          this.has_nextcuscat = datapagination.has_next;
          this.has_previouscuscat = datapagination.has_previous;
          this.presentpagecuscat = datapagination.index;
        }
      },
      (error)=>{
        this.spinner.hide();
      }
      )

  }
  customerCategoryEdit(data) {
    this.isCustomerCategoryEditForm = true;
    this.isCustomerCategory = false;
    this.ismakerCheckerButton = false;
    this.sharedService.customerCategoryEdit.next(data)
    return data;
  }



  cuscatnext_Click() {
    if (this.has_next === true) {


      this.getCustomerCategory(this.presentpagecuscat + 1)

    }
  }

  cuscatprevious_Click() {
    if (this.has_previous === true) {

      this.getCustomerCategory(this.presentpagecuscat - 1)

    }
  }
  customerCategorySubmit() {
    this.getCustomerCategory()
    this.ismakerCheckerButton = true;
    this.isCustomerCategory = true;
    this.isCustomerCategoryForm = false;
  }
  customerCategoryCancel() {
    this.ismakerCheckerButton = true;
    this.isCustomerCategory = true;
    this.isCustomerCategoryForm = false;
  }
  customerCategoryEditSubmit() {
    this.getCustomerCategory()
    this.isCustomerCategoryEditForm = false;
    this.ismakerCheckerButton = true;
    this.isCustomerCategory = true;
  }
  customerCategoryEditCancel() {
    this.ismakerCheckerButton = true;
    this.isCustomerCategory = true;
    this.isCustomerCategoryEditForm = false;
  }

  getProductCategory(pageNumber) {
    this.spinner.show();
    this.atmaService.getProductCategory(pageNumber)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.ProductCategoryList = datas;
        if (this.ProductCategoryList.length >= 0) {
          this.has_nextprocat = datapagination.has_next;
          this.has_previousprocat = datapagination.has_previous;
          this.presentpageprocat = datapagination.index;

        }
      },
      (error)=>{
        this.spinner.hide();
      }
      )

  }


  procatnextClick_() {
    if (this.has_next === true) {
      this.presentpageprocat +=1;
      this.getProductCategory(this.presentpageprocat);

    }
  }

  procatpreviousClick_() {
    if (this.has_previous === true) {
      this.presentpageprocat -=1;
      this.getProductCategory(this.presentpageprocat);
      // this.pcsearch()

    }
  }

  ProductCategoryEdit(data) {
    this.isProductCategoryEditForm = true;
    this.isProductCategory = false;
    this.ismakerCheckerButton = false;
    this.sharedService.productCategoryEdit.next(data)
    return data;
  }
  ProductCategorySubmit() {
    this.getProductCategory(1)
    this.ismakerCheckerButton = true;
    this.isProductCategory = true;
    this.isProductCategoryForm = false;
  }
  ProductCategoryCancel() {
    this.ismakerCheckerButton = true;
    this.isProductCategory = true;
    this.isProductCategoryForm = false;
  }
  ProductCategoryEditSubmit() {
    this.getProductCategory(1)
    this.isProductCategoryEditForm = false;
    this.ismakerCheckerButton = true;
    this.isProductCategory = true;
  }
  ProductCategoryEditCancel() {
    this.ismakerCheckerButton = true;
    this.isProductCategory = true;
    this.isProductCategoryEditForm = false;
  }


  docGrpCancle() {
    this.isDocGrpForm = false;
    this.ismakerCheckerButton = true;
    this.isDocGrp = true
  }

  docGrpSubmit() {
    this.getdoclist();
    // Name validation pending
    this.notification.showSuccess("Saved Successfully....")
    this.isDocGrp = true;
    this.ismakerCheckerButton = true;
    this.isDocGrpForm = false
  }

  docgrpedit(data) {
    this.isDocGrpEditForm = true;
    this.isDocGrp = false;
    this.ismakerCheckerButton = false;
    this.sharedService.docgrpedit.next(data)
    return data;
  }
  docGrpEditCancle() {
    this.isDocGrpEditForm = false;
    this.ismakerCheckerButton = true;
    this.isDocGrp = true;
  }


  docGrpEditSubmit() {
    this.getdoclist();

    this.notification.showSuccess("Updated Successfully....")
    this.isDocGrp = true;
    this.ismakerCheckerButton = true;
    this.isDocGrpEditForm = false
  }
  getdoclist() {
    this.spinner.show();
    this.atmaService.getdoc()
      .subscribe(result => {
        this.spinner.hide();
        this.docgrplist = result["data"];
      },
      (error)=>{
        this.spinner.hide();
      })
  }
  deletedocgrp(data) {
    let value = data.id
    this.atmaService.docgrpDeleteForm(value)

      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.ngOnInit();
        return true

      })
  }
  getdocgrppage(pageNumber = 1, pageSize = 10) {
    this.atmaService.getdocgrppage(pageNumber, pageSize)
      .subscribe(result => {
        console.log("docpage", result)
        let datas = result['data'];
        this.docgrplist = datas;
        let datapagination = result["pagination"];
        this.docgrplist = datas;
        if (this.docgrplist.length >= 0) {
          this.has_nextdoc = datapagination.has_next;
          this.has_previousdoc = datapagination.has_previous;
          this.presentpageDoc = datapagination.index;
          this.isDocpagination = true;
        } if (this.docgrplist <= 0) {
          this.isDocpagination = false;
        }
      })
  }
  nextClick() {
    if (this.has_nextdoc === true) {

      this.getdocgrppage(this.presentpageDoc + 1, 10)
    }
  }
  previousClick() {
    if (this.has_previousdoc === true) {

      this.getdocgrppage(this.presentpageDoc - 1, 10)
    }
  }

  getproductlist() {
    this.spinner.show();
    this.atmaService.getProductmaster()
      .subscribe(result => {
        this.spinner.hide();
        this.productlist = result["data"];
        this.productlist.forEach((s => {
          let tes = s.unitprice;
        }))
      },
      (error)=>{
        this.spinner.hide();
      });
  }

  gethsnlist(pageNumber) {
    this.spinner.show();
    this.atmaService.gethsnlist(pageNumber)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let hsnpagedata = results["pagination"];
        this.hsnlist = results["data"];;
        if (this.hsnlist.length >= 0) {
          this.hsn_nextpro = hsnpagedata.has_next;
          this.hsn_previouspro = hsnpagedata.has_previous;
          this.hsnpresentpagepro = hsnpagedata.index;
        }
      },
      (error)=>{
        this.spinner.hide();
      }
      )
  }

  hsnprevious() {
    if (this.hsn_previouspro === true) {
      this.hsnpresentpagepro -=1;
      this.hsnsearch_page(this.hsnpresentpagepro);
      // this.gethsnlist(this.hsnpresentpagepro);
    }
  }
  hsnnext() {
    if (this.hsn_nextpro === true) {
      this.hsnpresentpagepro +=1;
      this.hsnsearch_page(this.hsnpresentpagepro);
      // this.gethsnlist(this.hsnpresentpagepro);
    }
  }
  productedit(data) {
    this.isProductEditForm = true;
    this.isproduct = false;
    this.ismakerCheckerButton = false;
    this.sharedService.productedit.next(data)
    return data;
  }
  ProductCancle() {
    this.isProductForm = false;
    this.ismakerCheckerButton = true;
    this.isproduct = true
  }
  ProductSubmit() {
    this.getproductlist();
    this.notification.showSuccess("Saved Successfully....")
    this.isproduct = true;
    this.ismakerCheckerButton = true;
    this.isProductForm = false
  }
  ProductEditSubmit() {
    this.getproductlist();
    this.notification.showSuccess("Updated Successfully....")
    this.isProductEditForm = false;
    this.ismakerCheckerButton = true;
    this.isproduct = true;
  }
  ProductEditCancle() {
    this.isProductEditForm = false;
    this.ismakerCheckerButton = true;
    this.isproduct = true;
  }
  getproductpage(pageNumber = 1, pageSize = 10) {
    this.atmaService.getproductpage(pageNumber, pageSize,this.prform.value.name,2)
      .subscribe((results: any[]) => {
        let datapagination = results["pagination"];
        this.productlist = results["data"];;
        if (this.productlist.length >= 0) {
          this.has_nextpro = datapagination.has_next;
          this.has_previouspro = datapagination.has_previous;
          this.presentpagepro = datapagination.index;
        }
      })
  }
  previousClickpro() {
    if (this.has_previouspro === true) {

      this.getproductpage(this.presentpagepro - 1, 10)
    }
  }
  nextClickpro() {
    if (this.has_nextpro === true) {

      this.getproductpage(this.presentpagepro + 1, 10)
    }
  }
  deleteproduct(data) {
    let value = data.id
    this.atmaService.productDeleteForm(value)


      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.ngOnInit();
        return true



      })
  }

  apSubCategoryCancel() {
    this.isApSubCategoryForm = false;
    this.ismakerCheckerButton = true;
    this.isApSubCategory = true
  }

  apSubCategorySubmit() {
    this.getApSubCategory();
    this.isApSubCategoryForm = false;
    this.ismakerCheckerButton = true;
    this.isApSubCategory = true
  }









  apSubCategoryEdit(data) {
    this.isApSubCategoryEditForm = true;
    this.isApSubCategory = false;
    this.ismakerCheckerButton = false;
    this.sharedService.apSubCategoryEdit.next(data)
    return data;
  }


  getApSubCategory(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.atmaService.getApSubCategory(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("datta", datas)
        this.getApSubCategoryList = datas;
        let datapagination = results["pagination"];
        this.getApSubCategoryList = datas;
        // if (this.getApSubCategoryList.length===0) {
        //   this.isApSubCategorypage=false
        // }
        if (this.getApSubCategoryList.length > 0) {

          this.has_nextapsub = datapagination.has_next;
          this.has_previousapsub = datapagination.has_previous;
          this.presentpageapsub = datapagination.index;

          //this.isApSubCategorypage=true

        }




      })
  }

  apcsearch() {
    this.atmaService.getProducts(this.apcform.value.name)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        // console.log("datta",datas)
        this.getApSubCategoryList = datas;
        let datapagination = results["pagination"];
        this.getApSubCategoryList = datas;
        if (this.getApSubCategoryList.length > 0) {

          this.has_nextapsub = datapagination.has_next;
          this.has_previousapsub = datapagination.has_previous;
          this.presentpageapsub = datapagination.index;

          //this.isApSubCategorypage=true

        }
      })
  }

  nextClickapsubcategory() {
    if (this.has_nextapsub === true) {


      this.getApSubCategory("", 'asc', this.presentpageapsub + 1, 10)

    }
  }

  previousClickapsubcategory() {
    if (this.has_previousapsub === true) {

      this.getApSubCategory("", 'asc', this.presentpageapsub - 1, 10)

    }
  }




  ///////////////////////////// Ap cat updated code 
  editapcat: FormGroup;
  apcatSearchForm: FormGroup;
  apsubcatSearchForm: FormGroup;
  editapsubcat: FormGroup;

  isApcategory: boolean;
  isApcategoryForm: boolean;
  isApsubcategory: boolean;
  isApsubcategoryForm: boolean;

  editApcatPopup: boolean;
  editApsubcatPopup: boolean;

  presentpageapsubcat: number = 1;
  has_nextapsubcat = true;
  has_previousapsubcat = true;

  apCategoryList: any;
  apSubCategoryList: any;

  categoryList: Array<catlistss>;
  category_id = new FormControl();

  name:string
  no: string
  code: string

  @ViewChild('cat') matcatAutocomplete: MatAutocomplete;
  @ViewChild('catInput') catInput: any;

  ActiveInactive = [
    { value: 0, display: 'Active' },
    { value: 1, display: 'Inactive' },
    { value: 0, display: 'All' }
  ]
  assetlist=[    {'id':'1', 'name':'1','show':'Yes'},
                 {'id':'2', 'name':'0','show':'No'}    ]
  gstblockedlist=[{'id':'1', 'show':'Yes', 'name':'1'},
                  {'id':'2', 'show':'No', 'name':'0'}]
  gstrcmlist=[{'id':'1','show':'Yes', 'name':'1'},
              {'id':'2','show':'No', 'name':'0'}]
  statuslist=[{'id':'1','show':'Active', 'name':1},
              {'id':'2','show':'Inactive', 'name':0}]     

  getapcategorynew(pageNumber = 1, pageSize = 10) {
    this.spinner.show();
    this.atmaService.getapcategory(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        console.log("getapcat", datas);
        let datapagination = results["pagination"];
        this.apCategoryList = datas;
        if (this.apCategoryList.length > 0) {
          this.has_nextapcat = datapagination.has_next;
          this.has_previousapcat = datapagination.has_previous;
          this.presentpageapcat = datapagination.index;
        }
      },
      (error)=>{
        this.spinner.hide();
      });

  }
  nextClickapcat() {
    if (this.has_nextapcat === true) {
      this.presentpageapcat +=1;
      this.getapcategorynew(this.presentpageapcat,10);
    }
  }

  previousClickapcat() {
    if (this.has_previousapcat === true) {
      this.presentpageapcat -=1;
      this.getapcategorynew(this.presentpageapcat,10);
      // this.getapcategorynew(this.presentpageapcat - 1, 10)
    }
  }
  apCategorySubmitnew() {
    this.getapcategorynew();
    this.ismakerCheckerButton = true;
    this.isApCategory = true;
    this.isApCategoryForm = false;
  }
  apCategoryCancelnew() {
    this.ismakerCheckerButton = true;
    this.isApCategory = true;
    this.isApCategoryForm = false;
  }
  apCategoryEditnew(data) {
    this.editApcatPopup = true;
    console.log("edit data apcat", data)
    this.code = data.code
    this.name = data.name,
      this.no = data.no,
      this.editapcat.patchValue({
        id: data.id,
        isasset: data.isasset,
      })
  }
  editapcatForm() {
    let data = this.editapcat.value
    console.log(data)
    this.atmaService.editapcat(data)
      .subscribe(result => {
        this.notification.showSuccess("Successfully Updated!...")
        this.isApcategory = true;
        console.log("editapcat SUBMIT", result)
        this.getapcategorynew();
        this.apcatclose.nativeElement.click('');
        this.editApcatPopup=false;
        return true;
      });
  }
  resetapcat() {
    this.apcatSearchForm.controls['no'].reset("")
    this.apcatSearchForm.controls['name'].reset("");
    this.apcatSearchForm.controls['drop'].reset("")
    this.getapcategorynew();
  }
  autocompletecatScroll() {
    setTimeout(() => {
      if (
        this.matcatAutocomplete &&
        this.autocompleteTrigger &&
        this.matcatAutocomplete.panel
      ) {
        fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.atmaService.getcategoryFKdd(this.catInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.categoryList = this.categoryList.concat(datas);
                    // console.log("emp", datas)
                    if (this.categoryList.length >= 0) {
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

  public displayFncat(cat?: catlistss): string | undefined {
    return cat ? cat.name : undefined;
  }

  get cat() {
    return this.apsubcatSearchForm.get('category_id');
  }


  private getcategory(apcatkeyvalue) {
    this.atmaService.getcategorydd(apcatkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
      })
  }
  apcatSearch() {
    // if (this.apcatSearchForm.value.no === '' && this.apcatSearchForm.value.name === '') {
    //   this.getapcategorynew();
    //   return
    // }
    // if (this.apcatSearchForm.value.name === null && this.apcatSearchForm.value.no === null) {
    //   this.getapcategorynew();
    //   return false
    // }
    let no = this.apcatSearchForm.value.no?this.apcatSearchForm.value.no:'';
    let name = this.apcatSearchForm.value.name?this.apcatSearchForm.value.name:'';
    let status:any=this.drpdwn[this.apcatSearchForm.value.drop?this.apcatSearchForm.value.drop:'ALL'];
    this.spinner.show();
    this.atmaService.getcategoryseach(no, name,status,1)
      .subscribe(result => {
        this.spinner.hide();
        console.log("apCategoryList search result", result)
        this.apCategoryList = result['data'];
        // let pagination=result['pagination'];
        // this.has_previousapcat=pagination.has_previous;
        // this.has_nextapcat=pagination.has_next;
        // this.presentpageapcat=pagination.index;
      },
      (error)=>{
        this.spinner.hide();
      })
    // if (this.apcatSearchForm.value.no === '' && this.apcatSearchForm.value.name === '') {
    //   this.getapcategorynew();
    // }
  }
  forInactiveapcat(data) {
    let datas = data.id
    let status: number = 0
    console.log('check id for data passing', datas)
    this.atmaService.activeInactiveapcat(datas, status)
      .subscribe((results: any[]) => {
        this.notification.showSuccess('Successfully InActivated!')
        this.getapcategorynew();
        return true
      })
    // alert('inactive')
  }


  foractiveapcat(data) {
    let datas = data.id
    let status: number = 1
    console.log('check id for data passing', datas)
    this.atmaService.activeInactiveapcat(datas, status)
      .subscribe((results: any[]) => {
        this.notification.showSuccess('Successfully Activated!')
        this.getapcategorynew();
        return true
      })
  }


  ///////////////////////////////////////////////////APsubategory

  getapsubcategory(pageNumber = 1, pageSize = 10) {
    this.spinner.show();
    this.atmaService.getapsubcategory(this.presentpageapsubcat, pageSize)
      .subscribe((results: any[]) => {
        this.spinner.hide();
        let datas = results["data"];
        console.log("getapsubcat", datas);
        let datapagination = results["pagination"];
        this.apSubCategoryList = datas;
        if (this.apSubCategoryList.length > 0) {
          this.has_nextapsubcat = datapagination.has_next;
          this.has_previousapsubcat = datapagination.has_previous;
          this.presentpageapsubcat = datapagination.index;
        }
      },
      (error)=>{
        this.spinner.hide();
      })

  }
  nextClickapsubcat() {
    if (this.has_nextapsubcat === true) {
      this.presentpageapsubcat +=1;
      this.getapsubcategory();
      // this.apsubcatSearch();
    }
  }

  previousClickapsubcat() {
    if (this.has_previousapsubcat === true) {
      this.presentpageapsubcat -=1;
      this.getapsubcategory();
      // this.apsubcatSearch();
    }
  }
  apsubCategorySubmit() {
    this.getapsubcategory();
    this.ismakerCheckerButton = true;
    this.isApSubCategory = true;
    this.isApSubCategoryForm = false;
  }
  apsubCategoryCancel() {
    this.ismakerCheckerButton = true;
    this.isApSubCategory = true;
    this.isApSubCategoryForm = false;
  }

  resetapsubcat() {
    this.apsubcatSearchForm.controls['no'].reset("")
    this.apsubcatSearchForm.controls['name'].reset("")
    this.apsubcatSearchForm.controls['category_id'].reset("");
    this.apsubcatSearchForm.controls['drop'].reset("")
    this.getapsubcategory();
  }
  apSubCategoryEditnew(data) {
    this.editApsubcatPopup = true;
    console.log("edit data apsubcat", data)
    this.code = data.code
    this.name = data.name,
      this.no = data.no,
      this.editapsubcat.patchValue({
        id: data.id,
        gstblocked: data.gstblocked,
        gstrcm: data.gstrcm,
        status: data.status
      })
  }

  editapsubcatcatForm() {
    let data = this.editapsubcat.value;
    console.log(data)
    this.atmaService.editapsubcat(data)
      .subscribe(result => {
        this.notification.showSuccess("Successfully Updated!...")
        this.isApsubcategory = true;
        console.log("editapsubcat SUBMIT", result)
        this.getapsubcategory();
        this.apsubcatclose.nativeElement.click('');
        this.editApsubcatPopup=false;
        return true;
      })
  }
  createFormateApsubCategory() {
    let data = this.apsubcatSearchForm.controls;
    let apsubcatSearchclass = new apsubcatSearchtype();
    apsubcatSearchclass.no = data['no'].value;
    apsubcatSearchclass.name = data['name'].value;
    apsubcatSearchclass.category_id = data['category_id'].value.id;
    console.log("apsubcatSearchclass", apsubcatSearchclass)
    return apsubcatSearchclass;
  }
  apsubcatSearch() {
    // let search = this.createFormateApsubCategory();
    // let page='?page='+this.presentpageapsubcat;
    let page='?page='+1;
    if(this.apsubcatSearchForm.get('no').value !=undefined && this.apsubcatSearchForm.get('no').value !="" && this.apsubcatSearchForm.get('no').value !=''){
      page=page+'&no='+this.apsubcatSearchForm.get('no').value;
    }
    if(this.apsubcatSearchForm.get('name').value !=undefined && this.apsubcatSearchForm.get('name').value !="" && this.apsubcatSearchForm.get('name').value !=''){
      page=page+'&name='+this.apsubcatSearchForm.get('name').value;
    }
    if(this.apsubcatSearchForm.get('drop').value !=undefined && this.apsubcatSearchForm.get('drop').value !="" && this.apsubcatSearchForm.get('drop').value !=''){
      page=page+'&status='+this.drpdwn[this.apsubcatSearchForm.get('drop').value];
    }
    // console.log(search);
    // for (let i in search) {
    //   if (!search[i]) {
    //     delete search[i];
    //   }
    // }
    this.spinner.show();
    this.atmaService.getsubcategoryseach(page)
      .subscribe(result => {
        this.spinner.hide();
        console.log("getapcatsearch search result", result)
        this.apSubCategoryList = result['data'];
        let pagination=result['pagination'];
        // this.presentpageapsubcat=pagination.index;
        // this.has_previousapsubcat=pagination.has_previous;
        // this.has_nextapsubcat=pagination.has_next;
      },
      (error)=>{
        this.spinner.hide();
      });
  }




  Inactivelistapsubcat(pageNumber = 1, pageSize = 10){
    this.atmaService.getapsubcatInactivelist(pageNumber, pageSize)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      let datapagination = results["pagination"];
      this.apSubCategoryList = datas;
      if (this.apSubCategoryList.length >= 0) {
        this.has_nextapsubcat = datapagination.has_next;
        this.has_previousapsubcat = datapagination.has_previous;
        this.presentpageapsubcat = datapagination.index;
      }
    })  
  }



  activelistapsubcat(pageNumber = 1, pageSize = 10){
    this.atmaService.getapsubcatactivelist(pageNumber, pageSize)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      let datapagination = results["pagination"];
      this.apSubCategoryList = datas;
      if (this.apSubCategoryList.length >= 0) {
        this.has_nextapsubcat = datapagination.has_next;
        this.has_previousapsubcat = datapagination.has_previous;
        this.presentpageapsubcat = datapagination.index;
      }
    }) 
  }




  apcatInactivelist(pageNumber = 1, pageSize = 10){
    this.atmaService.getapcatInactivelist(pageNumber, pageSize)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      let datapagination = results["pagination"];
      this.apCategoryList = datas;
      if (this.apCategoryList.length >= 0) {
        this.has_nextapcat = datapagination.has_next;
        this.has_previousapcat = datapagination.has_previous;
        this.presentpageapcat = datapagination.index;
      }
    })  
  }



  apcatactivelist(pageNumber = 1, pageSize = 10){
    this.atmaService.getapcatactivelist(pageNumber, pageSize)
    .subscribe((results: any[]) => {
      let datas = results["data"];
      let datapagination = results["pagination"];
      this.apCategoryList = datas;
      if (this.apCategoryList.length >= 0) {
        this.has_nextapcat = datapagination.has_next;
        this.has_previousapcat = datapagination.has_previous;
        this.presentpageapcat = datapagination.index;
      }
    }) 
  }


  displayStyle = false;
  data:any={'name':'','productcategory_id':{'name':''},'unitprice':'','weight':'','producttype_id':{'name':''}};
  openPopup(datas:any) {
    this.data=datas;
    console.log(this.data);
    this.displayStyle = true;
  }
  closePopup() {
    this.displayStyle = false;
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  taxCreateForm() {
    console.log(this.taxaddfrom.get('glno').value.toString().length);
    if(this.taxaddfrom.get('glno').value.toString().length ==9 || this.taxaddfrom.get('glno').value.toString().length ==16){
      console.log(this.taxaddfrom.value);
    }
    else{
      this.notification.showError('Please Enter The Glno upto 9 0r 16 digits');
      return false;
    }
    if(this.taxaddfrom.get('name').value.trim()=='' || this.taxaddfrom.get('name').value==undefined || this.taxaddfrom.get('name').value==null){
      this.notification.showError('Please Enter The Tax Name');
      return false;
    }
    if(this.taxaddfrom.get('pay_receivable').value==null || this.taxaddfrom.get('pay_receivable').value=='' || this.taxaddfrom.get('pay_receivable').value==undefined ){
      this.notification.showError('Please Enter The Payable');
      return false;
    }
    if(this.taxaddfrom.get('isreceivable').value==null || this.taxaddfrom.get('isreceivable').value==undefined || this.taxaddfrom.get('isreceivable').value==''){
      this.notification.showError('Please Enter The Receivable');
      return false;
    }
   let  payable:any={'Yes':1,'No':0};
    let receivable:any={'Yes':1,'No':0};
    let data:any={
      "name":this.taxaddfrom.get('name').value.trim(),
      "receivable":receivable[this.taxaddfrom.get('isreceivable').value],
      "payable":payable[this.taxaddfrom.get('pay_receivable').value],
      "glno":this.taxaddfrom.get('glno').value
  }
    this.atmaService.taxCreateForm(data)
      .subscribe(result => {
        if (result.code === "INVALID_DATA" && result.description === "Invalid Data or DB Constraint") {
          this.notification.showWarning("Duplicate Code & Name ...")
         
        } else if (result.code === "UNEXPECTED_ERROR" && result.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
          
        } else {
          this.notification.showSuccess("Saved Successfully!...")
          this.enbtax=!this.enbtax;
          this.enbtaxcan=!this.enbtaxcan;
          this.enbtaxbtn=!this.enbtaxbtn;
          this.taxaddfrom.patchValue({'name':'','pay_receivable':'','isreceivable':'','glno':''});
        }
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      )
    }
    subcategoryfocusout(data:any){
      this.subtaxaddform.get('glno').patchValue(data.glno);
    }
    enbtax:boolean=true;
    enbtaxcan:boolean=false;
    enbtaxbtn:boolean=false;
    subtaxenb:boolean=true;
    subtaxcan:boolean=false;
    subtaxenbbtn:boolean=false;
    subtaxrateenb:boolean=true;
    subtaxrateenbbtn:boolean=false;
    subtaxrateenbcan:boolean=false;
    gettaxena(){
      this.enbtax=!this.enbtax;
      this.enbtaxbtn=!this.enbtaxbtn;
      this.enbtaxcan=!this.enbtaxcan;
      if(this.enbtaxcan==false){
        this.taxaddfrom.patchValue({'name':'','pay_receivable':'','isreceivable':'','glno':''});
      }
    }
    getsubtaxena(){
      this.subtaxenb=!this.subtaxenb;
      this.subtaxenbbtn=!this.subtaxenbbtn;
      this.subtaxcan=!this.subtaxcan;
      if(this.subtaxcan==false){
        this.subtaxaddform.patchValue({'subtaxname':'','subtaxlimit':'','subtaxremarks':'','subcategory':'','subcategorysub':'','glno':''});
      }
    }
    gettaxrateenb(){
      this.subtaxrateenb=!this.subtaxrateenb;
      this.subtaxrateenbbtn=!this.subtaxrateenbbtn;
      this.subtaxrateenbcan=!this.subtaxrateenbcan;
      if(this.subtaxrateenbcan==false){
        this.taxrateaddgorm.patchValue({'taxratename':'','coderate':''});
      }
    }
    submittaxrate(){
      console.log(this.subtaxaddform.value);
      if(this.subtaxaddform.get('name').value==undefined || this.subtaxaddform.get('name').value=='' || this.subtaxaddform.get('name').value==null){
        this.notification.showError('Please Enter The Name');
        return false;
      }
      if(this.subtaxaddform.get('subtaxname').value==undefined || this.subtaxaddform.get('subtaxname').value=='' || this.subtaxaddform.get('subtaxname').value==null){
        this.notification.showError('Please Enter The Sub Tax Name');
        return false;
      }
      if(this.subtaxaddform.get('subtaxlimit').value==undefined || this.subtaxaddform.get('subtaxlimit').value=='' || this.subtaxaddform.get('subtaxlimit').value==null){
        this.notification.showError('Please Enter The Sub Tax Limit');
        return false;
      }
      if(this.subtaxaddform.get('subtaxremarks').value==undefined || this.subtaxaddform.get('subtaxremarks').value=='' || this.subtaxaddform.get('subtaxremarks').value==null){
        this.notification.showError('Please Enter The Remarks');
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
    }
      this.atmaService.getaddtaxname(data).subscribe((datas:any)=>{
        console.log(datas);
        if (datas.code === "INVALID_DATA" && datas.description === "Invalid Data or DB Constraint") {
          this.notification.showWarning("Duplicate Code & Name ...")
         
        } else if (datas.code === "UNEXPECTED_ERROR" && datas.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
          
        } else {
          this.notification.showSuccess("Saved Successfully!...")
        // this.notification.showSuccess('Successfully Inserted');
        this.subtaxenb=!this.subtaxenb;
        this.subtaxcan=!this.subtaxcan;
        this.subtaxenbbtn=!this.subtaxenbbtn;
        this.subtaxaddform.reset();
        // this.subtaxaddform.patchValue({'subtaxname':'','subtaxlimit':'','subtaxremarks':'','subcategory':'','subcategorysub':'','glno':''});

        }
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      );
    }
    submitaddtaxrate(){
      if(this.taxrateaddgorm.get('subtaxrate').value==undefined || this.taxrateaddgorm.get('subtaxrate').value=='' || this.taxrateaddgorm.get('subtaxrate').value==null){
        this.notification.showError('Please Enter The Sub TaxName');
        return false;
      }
      // if(this.taxrateaddgorm.get('subtaxratenew').value==undefined || this.taxrateaddgorm.get('subtaxratenew').value=='' || this.taxrateaddgorm.get('subtaxratenew').value==null){
      //   this.notification.showError('Please Enter The TaxRate');
      //   return false;
      // }
      if(this.taxrateaddgorm.get('taxratename').value==undefined || this.taxrateaddgorm.get('taxratename').value=='' || this.taxrateaddgorm.get('taxratename').value==null){
        this.notification.showError('Please Enter The TaxRate Name');
        return false;
      }
      if(this.taxrateaddgorm.get('coderate').value==undefined || this.taxrateaddgorm.get('coderate').value=='' || this.taxrateaddgorm.get('coderate').value==null){
        this.notification.showError('Please Enter The TaxRate Name');
        return false;
      }
      let data:any={
        "name":this.taxrateaddgorm.get('taxratename').value,
        "subtax_id" :this.taxrateaddgorm.get('subtaxrate').value.id,
        "rate":this.taxrateaddgorm.get('coderate').value
      }
      this.atmaService.getaddtaxnamerate(data).subscribe((datas:any)=>{
        if (datas.code === "INVALID_DATA" && datas.description === "Invalid Data or DB Constraint") {
          this.notification.showWarning("Duplicate Code & Name ...")
         
        } else if (datas.code === "UNEXPECTED_ERROR" && datas.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
          
        } else {
          this.notification.showSuccess("Saved Successfully!...")
          this.subtaxrateenb=!this.subtaxrateenb;
          this.subtaxrateenbbtn=!this.subtaxrateenbbtn;
          this.subtaxrateenbcan=!this.subtaxrateenbcan;
          this.taxrateaddgorm.reset();

        }
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      )
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
    gettaxinfinites(data:any){
      
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
                  this.atmaService.getsubtaxnamelist(this.taxrateaddgorm.get('name').value.id,this.subtaxInput.nativeElement.value,this.has_subtaxnamepage+1)
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
    getsubtaxrateinfinite(){
      setTimeout(() => {
        if (
          this.matsubtaxratename &&
          this.autocompleteTrigger &&
          this.matsubtaxratename.panel
        ) {
          fromEvent(this.matsubtaxratename.panel.nativeElement, 'scroll')
            .pipe(
              map(x => this.matsubtaxratename.panel.nativeElement.scrollTop),
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(x => {
              const scrollTop = this.matsubtaxratename.panel.nativeElement.scrollTop;
              const scrollHeight = this.matsubtaxratename.panel.nativeElement.scrollHeight;
              const elementHeight = this.matsubtaxratename.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
              if (atBottom) {
                if (this.has_subtaxratenamenxt === true) {
                  this.atmaService.getsubratetaxnamelist(this.taxrateaddgorm.get('subtaxrate').value.id,this.subtaxrateInput.nativeElement.value,this.has_subtaxratenamepage+1)
                    .subscribe((results: any[]) => {
                      let datas = results["data"];
                      let datapagination = results["pagination"];
                      this.subtaxratelist = this.subtaxratelist.concat(datas);
                      if (this.subtaxratelist.length >= 0) {
                        this.has_subtaxratenamenxt = datapagination.has_next;
                        this.has_subtaxratenamepre = datapagination.has_previous;
                        this.has_subtaxratenamepage = datapagination.index;
                      }
                    })
                }
              }
            });
        }
      });
    }

    apCategoryDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getAPCategoryDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'APCatReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

    apSubCategoryDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getAPSubCategoryDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'APCatReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

    productCategoryDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getProductCategoryDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'ProductCategoryReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

    productTypeDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getProductTypeDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'ProductTypeReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

    taxDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getTaxDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'TaxReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

    subTaxDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getSubTaxDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'SubTaxReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

    taxRateDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getTaxRateDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'TaxRateReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

    hsnDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getHSNDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'HSNReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

    uomDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getUOMDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'UOMReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')    
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

   paymodeDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getPaymodeDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'PaymodeReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

    bankDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getBankDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'BankReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

    bankBranchDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getBankBranchDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'BankBranchReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

    productDownload(){
      if(this.first==true){
        this.notification.showWarning('Already Running')
        return true
      }
      this.first=true;
      this.atmaService.getProductDownload()
      .subscribe(fullXLS=>{
        console.log(fullXLS);
        let binaryData = [];
        binaryData.push(fullXLS)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        let date: Date = new Date();
        link.download = 'ProductReport'+ date +".xlsx";
        link.click();
        this.first = false;
        this.notification.showSuccess('SUCCESS')
      },
      (error)=>{
        this.first=false;
        this.notification.showWarning(error.status+error.statusText)
      })
    }

    getactiveinactivetax(data:any){
      
      let dta:any={'id':data['tax_rate_id'].id,'status':data['tax_rate_id'].status};
      this.spinner.show();
      this.atmaService.getactiveinactivetax(dta).subscribe(datas=>{
        if(datas['status']=='success'){
          this.notification.showSuccess(datas['message']);
          this.getTax("",  'asc',1,10);
          this.spinner.hide();
        }
        else{
          this.notification.showError(datas['description']);
          this.spinner.hide();
        }
      },
      (error)=>{
        this.spinner.hide();
        this.notification.showError(error.status+error.statusText);
      }
      );
    }
    getactiveapcategory(data:any){
      let dta:any={'id':data.id,'status':data.status};
      this.atmaService.getactiveinactivetapcategory(dta).subscribe(datas=>{
        if(datas['status']=='success'){
          this.notification.showSuccess(datas['message']);
          this.getapcategorynew();
        }
        else{
          this.notification.showError(datas['description']);
        }
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      );
    }
    getactiveapsubcategory(data:any){
      let dta:any={'id':data.id,'status':data.status};
      this.atmaService.getactiveinactivetapsubcategory(dta).subscribe(datas=>{
        if(datas['status']=='success'){
          this.notification.showSuccess(datas['message']);
          this.getapsubcategory();
        }
        else{
          this.notification.showError(datas['description']);
        }
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      );
    }
    kyenbdata(event:any){
      let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
      console.log(d.test(event.key))
      if(d.test(event.key)==true){
        return false;
      }
      return true;
    }
    clickreset(){
      this.hsnform.controls['hsn'].patchValue('');
      this.hsnform.controls['drop'].patchValue('');
      this.gethsnlist(this.hsnpresentpagepro);
    }
}
export interface catlistss {
  id: string;
  name: string;
}
class apsubcatSearchtype{
  name           : string;
  no           : string;  
  category_id: any;
}