import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EntryService } from '../entry.service';

export interface Task {
  name: string;
  color: ThemePalette;
  subtasks?: Task[];
}

interface status {
  value: string;
  viewValue: string;
}

interface transaction {
  value: string;
  viewValue: string;
}

interface transactionList {
  value: number;
  viewValue: string;
}

interface display {
  value: string;
  viewValue: string;
}

export interface Master {
  text: string;
  model: number;
}

export interface cat {
  name: string;
  code: string;
  id: string;
  
}

@Component({
  selector: 'app-entry-service',
  templateUrl: './entry-service.component.html',
  styleUrls: ['./entry-service.component.scss']
})
export class EntryServiceComponent implements OnInit {
  @ViewChild('cat') matcatAutocomplete: MatAutocomplete;
  @ViewChild('catidInput') catidInput: any;

  @ViewChild('subcat') matsubcatAutocomplete: MatAutocomplete;
  @ViewChild('subcatidInput') subcatidInput: any;
  @ViewChild( MatAutocompleteTrigger ) autocompleteTrigger: MatAutocompleteTrigger;
  
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  
  firstTransaction: string;
  transactionListCode: any;
  newValue: number=1;
  catno:any =[];
  has_nextcom_branch=true;
  currentpagecom_branch: number=1;
  catdata: any=[];
  has_previouscom=true;
  statusCheckFirst=false;
  statusCheckSecond=false;
  subcatdata: any;
  formulaFlag: any=[];
  formulate: any = [];
  checkCreditFlag: boolean= false;
  checkDebitFlag: boolean= false;
  flagOptions: boolean;
  mymodel: any;
  modeSelect: string;
  @HostListener('document:keydown',['$event']) onkeyboard(event:KeyboardEvent){
    console.log('welcome',event.code);
    if(event.code =="Escape"){
      this.spinner.hide();
    }
  }
    
  entryListDebit: any;
  entryListCredit: any;
  presentpageentry: number=1;
  has_nextentry: boolean=false;
  has_previousentry: boolean=false;
  EntrySearchForm: FormGroup;
  pageSize = 10;
  ModulelistServ:any = [];
  ReportlistServ:any = [];
  transactionTypeList = new FormControl();
  isLoading = false;
  statusCheck:boolean;
  masterData:Array<any> = [];
  listViewType:any = [];
  transactionListClick:any = [];
  debitsave:any= FormGroup;
  creditsave:any= FormGroup;
  presentpagebuk:number = 1
  selectEntryDynamicDebit:any = [];
  selectEntryDynamicCredit:any = [];
  flagMain:any='';
  EntryTemplateNewAddRow:any=[{'dynamic':false,'dynamiccat':false,'dynamicsubcat':false,
  'dynamicsecond':false, 'flagTemplate':true}];
  // intyp:Master[]=[
    // {'text':"PO",'model':1},
                      //  {'text':"Non PO",'model':2},
                      //  {'text':"ADVANCE",'model':3},
                      //  {'text':"EMP Claim",'model':4},
                      //  {'text':"BRANCH EXP",'model':5},
                      //  {'text':"PETTY CASH",'model':6},
                      //  {'text':"SI",'model':7},
                      //  {'text':"TAF",'model':8},
                      //  {'text':"TCF",'model':9},
                      //  {'text':"EB",'model':10},
                      //  {'text':"RENT",'model':11},
                      //  {'text':"DTPC",'model':12},
                      //  {'text':"SGB",'model':13},
                      //  {'text':"ICR",'model':14}
                    // ];
  intyp:any=[]
  status: status[] = [
    {value: 'F', viewValue: 'FIXED '},
    {value: 'D', viewValue: 'DYNAMIC'},
  ];
  transaction: transaction[] = [
    {value: 'D', viewValue: 'DEBIT'},
    {value: 'C', viewValue: 'CREDIT'},
  ];
  transaddDebit:any = [];
  transaddCredit:any = [];
  conditionDebit:any = [ 
    {value: '100', viewValue: '100%'},
    {value: '50', viewValue: '50%'}];

  conditionCredit:any = [ 
    {value: '100', viewValue: '100%'},
    {value: '50', viewValue: '50%'}];

  transactionList: transactionList[] = [
    // {value: 1, viewValue: 'PO'},
    // {value: 2, viewValue: 'NON PO'},
    // {value: 3, viewValue: 'PETTYCASH'},
    // {value: 4, viewValue: 'ADVANCE'},
    // {value: 5, viewValue: 'TCF'},
    // {value: 6, viewValue: 'TA'},
  ];

  display: display[] = [
    {value: 'Y', viewValue: 'YES'},
    {value: 'N', viewValue: 'NO'},
  ]

  option: any = [
    {id: 'Y', text: 'YES'},
    {id: 'N', text: 'NO'}
  ]

  optionCredit:any = []

  formula:any = [ 
    {value: '1', viewValue: 'IGST+SGST+CGST'},
    {value: '2', viewValue: 'IGST'}];

  l1:any
  l2:any
  l3:any
  l4:any
  l5:any;
  l6:any;
  textarea:any=[]

  task: Task = {
    name: 'Indeterminate',
    color: 'primary',
    subtasks: [
      {name: 'BASEAMOUNT', color: 'primary'},
      {name: 'IGST', color: 'primary'},
      {name: 'SGST', color: 'accent'},
      {name: 'CGST', color: 'accent'},
      {name: 'INVAMOUNT', color: 'warn'},
      // {name: 'DEBITAMOUNT', color: 'warn'}
    ],
  };

  constructor(private service: EntryService, private formBuilder:FormBuilder,
    private toastr:ToastrService, private spinner: NgxSpinnerService, 
    public dialog: MatDialog, private router:Router) {}

  ngOnInit(): void {
    this.EntrySearchForm = this.formBuilder.group({
          // modulelist: [''],
          // reportname: [''],
          doc_type: [''],
          transaction: [''],
          displaycolumn: [''],
          parameter: [''],
          parametername: [''],
          status1: [''],
          status2: [''],
          // code:[''],
      'listproductdebit': this.formBuilder.array([
        this.formBuilder.group({
          dynamicdebit: new FormControl(),
          
        })
      ]),
      'listproductcredit': this.formBuilder.array([
        this.formBuilder.group({
          dynamiccredit: new FormControl(),
          
        })
      ])
    })
    this.debitsave =this.formBuilder.group({
      "listTransactionDebit":this.formBuilder.array([
        this.formBuilder.group({
        'condition1':new FormControl('',Validators.required),
        'booleannew':new FormControl(),
        'cat':new FormControl(''),
        'subcat':new FormControl(''),
        'cat1':new FormControl(''),
        'subcat1':new FormControl(''),
        'value1':new FormControl('',Validators.required),
        'transnew':new FormControl('',Validators.required),
        'transactionNewValue':new FormControl(''),
        'dynamicdebitentrycat':new FormControl(''),
        'dynamicdebitentrysubcat':new FormControl(''),
        'dynamicdebitvalue':new FormControl(),
        'display1':new FormControl('',Validators.required),
        'cattrans':new FormControl(),
        'subcattrans':new FormControl(),
        'igst':new FormControl(),
        'cgst':new FormControl(),
        'sgst':new FormControl(),
        'formula':new FormControl()
        })
      ])
        
      });
      this.textarea = [this.l1,this.l2,this.l3,this.l4];
      
      this.service.getEntryMaster()
      .subscribe((results: any[]) => {
        console.log("getEntryList", results);
        let datas = results["data"];
        this.transactionList = datas
      })
      // this.creditsave =this.formBuilder.group({
      //   "listTransactionCredit":this.formBuilder.array([
      //     this.formBuilder.group({
      //     'id': null,
      //     'condition2':new FormControl(),
      //     'cat':new FormControl(),
      //     'subcat':new FormControl(),
      //     'value2':new FormControl(),
      //     'transnew':new FormControl(),
      //     'transactionNewValue':new FormControl()
      //     })
      //   ])
          
      //   });
  

        // this.getDropdownCondition();
    this.service.getCreditDropDown()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("getList", datas);
        this.optionCredit = datas;
        this.spinner.hide()
      });
    // this.getEntry()

    this.service.getcatsearch('',1).subscribe(data=>{
      this.catdata=data['data'];
    }),
    this.service.getsubcatsearch('',139,1).subscribe(data=>{
      this.subcatdata=data['data'];
    }),

      ((this.debitsave.get("listTransactionDebit") as FormArray).at(0) as FormGroup).get('cat').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.service.getcatsearch(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )

    .subscribe((results: any[]) => {
      this.catdata = results["data"];
      console.log('cat_id=',results)

    }),
  
    ((this.debitsave.get("listTransactionDebit") as FormArray).at(0) as FormGroup).get('subcat').valueChanges    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.service.getsubcatsearch1(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )

    .subscribe((results: any[]) => {
      this.subcatdata = results["data"];
      console.log('cat_id=',results)

    })
  
    this.service.getEntryList()
      .subscribe((results: any[]) => {
        console.log("getEntryList", results);
        let datas = results["data"];
        this.intyp = datas      
      })
  
  }

  autocompleteScroll_cat() {
    setTimeout(() => {
      if (this.matcatAutocomplete && this.autocompleteTrigger && this.matcatAutocomplete.panel) {
        fromEvent(this.matcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
            const scrollTop = this.matcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.service.getcatsearch( this.catidInput.nativeElement.value, this.currentpagecom_branch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch=',results)
                    let datapagination = results["pagination"];
                    this.catdata = this.catdata.concat(datas);
                    if (this.catdata.length >= 0) {
                      this.has_nextcom_branch = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_branch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  autocompleteScroll_subcat() {
    setTimeout(() => {
      if (this.matsubcatAutocomplete && this.autocompleteTrigger && this.matsubcatAutocomplete.panel) {
        fromEvent(this.matsubcatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matsubcatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)).subscribe(x => {
            const scrollTop = this.matsubcatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matsubcatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matsubcatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_nextcom_branch === true) {
                this.service.getsubcatsearch('', this.catidInput.nativeElement.value, this.currentpagecom_branch + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    console.log('branch=',results)
                    let datapagination = results["pagination"];
                    this.subcatdata = this.subcatdata.concat(datas);
                    if (this.subcatdata.length >= 0) {
                      this.has_nextcom_branch = datapagination.has_next;
                      this.has_previouscom = datapagination.has_previous;
                      this.currentpagecom_branch = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });
  }

  transactionType(data:any,value){
    this.transactionListClick = data
    this.transactionListCode = value
    this.spinner.show()
    this.EntrySearchForm.reset();
    this.debitsave.reset();
    this.flagMain=1
    this.service.getEntryServDebit(1)
      .subscribe((results: any[]) => {
        console.log("getEntryList", results);
        let datas = results["DATA"];
        this.entryListDebit = datas;
        console.log("getEntryList", this.entryListDebit);
        this.spinner.hide()
        for(let i=0;i<this.entryListDebit.length;i++){
          this.entryListDebit[i]['condition']=false;
        }
        for(let i=0; i<this.entryListDebit.length;i++){
          this.entryListDebit[i]['statusCheck']=false;
          this.entryListDebit[i]['flagOptions'] = false;
          this.entryListDebit[i]['debitstatusCheck']=false;
          this.entryListDebit[i]['sourcegetAddNew']=false;
          this.entryListDebit[i]['booleannew']=false;
          this.entryListDebit[i]['cat']=[];
          this.entryListDebit[i]['subcat']=[];
          (this.EntrySearchForm.get('listproductdebit') as FormArray).push(this.formBuilder.group({
            'dynamicdebit': new FormControl('')
            }));
            ((this.EntrySearchForm.get('listproductdebit') as FormArray).at(i)).get('dynamicdebit').patchValue('');
          }
        // for(let i=0; i<this.entryListDebit.length;i++){
        //   this.entryListDebit[i]['statusCheck']=false;
        //   (this.EntrySearchForm.get('listproductdebit') as FormArray).push(this.formBuilder.group({
        //     'dynamicdebit': new FormControl(),
        //     }));
        //     ((this.EntrySearchForm.get('listproductdebit') as FormArray).at(i) as FormGroup).get('dynamicdebit').patchValue('');
        //   }
   
        });
    
        this.service.getEntryServCredit(1)
        .subscribe((results: any[]) => {
          console.log("getEntryList", results);
          let datas = results["DATA"];
          this.entryListCredit = datas;
          this.spinner.hide()
          for(let i=0;i<this.entryListCredit.length;i++){
            this.entryListCredit[i]['condition']=false;
          }         
          for(let i=0; i<this.entryListCredit.length;i++){
            this.entryListCredit[i]['statusCheck']=false;
            this.entryListCredit[i]['flagOptionsCredit'] = false;
            // this.entryListDebit[i]['creditstatusCheck']=false;
            this.EntryTemplateNewAddRow[i] = [];
            this.EntryTemplateNewAddRow[i]['dynamicsecond'] = false;
            this.EntryTemplateNewAddRow[i]['dynamic'] = false;
            this.EntryTemplateNewAddRow[i]['dynamiccat'] = false;
            this.EntryTemplateNewAddRow[i]['dynamicsubcat'] = false;
            this.EntryTemplateNewAddRow[i]['dynamiccat1'] = false;
            this.EntryTemplateNewAddRow[i]['dynamicsubcat1'] = false;
            this.EntryTemplateNewAddRow[i]['flagTemplate'] = false;
            this.EntryTemplateNewAddRow[0]['flagTemplate'] = true;
            // this.EntryTemplateNewAddRow[i]['value']='';
            (this.EntrySearchForm.get('listproductcredit') as FormArray).push(this.formBuilder.group({
              'dynamiccredit': new FormControl(''),
              }));
              ((this.EntrySearchForm.get('listproductcredit') as FormArray).at(i)).get('dynamiccredit').patchValue('');
            // (this.debitsave.get('listTransactionDebit') as FormArray).push(this.formBuilder.group({
            //   'dynamicdebitentrycat':new FormControl(false),
            //   'dynamicdebitentrysubcat':new FormControl(false),
            //   'dynamicdebitvalue':new FormControl(false),
              // 'subcat':new FormControl(),
              // 'value1':new FormControl(),
              // 'transnew':new FormControl(),
              // 'transactionNewValue':new FormControl(),
              // 'dynamicdebitentry':new FormControl(false),
              // 'dynamicdebitvalue':new FormControl(false),
              // 'display1':new FormControl(),
              // }));
              // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('dynamicdebitentrycat').patchValue('');
              // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('dynamicdebitentrysubcat').patchValue('');
              // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('dynamicdebitvalue').patchValue('');
              // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('booleannew').patchValue('');
              // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('cat').patchValue('');
              // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('subcat').patchValue('');
              // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('value1').patchValue('');
              // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('transnew').patchValue('');
              // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('transactionNewValue').patchValue('');
              // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('display1').patchValue('');
            }
          });
        
      }

      // getDropdownCondition(){
      //   this.service.getEntryDropdownCondition()
      //   .subscribe((results: any[]) => {
      //     console.log("getDropdown", results);
      //     let datas = results["data"];
      //     this.conditionDebit = datas;
      //     this.conditionCredit = datas;
      //     this.spinner.hide()
      // })
    // }
  // getEntry(pageNumber = 1, pageSize = 10) {
  //   this.spinner.show()
  //   this.service.getEntryServ(pageNumber, pageSize)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       console.log("getPMD", datas);
  //       this.entryList = datas;
  //       this.spinner.hide()
  //       let datapagination = results["pagination"];
  //       for(let i=0;i<this.entryList.length;i++){
  //         this.entryList[i]['condition']=false;
  //       }
  //       // if (datas.length > 0) {
  //       //   this.has_nextentry = datapagination.has_next;
  //       //   this.has_previousentry = datapagination.has_previous;
  //       //   this.presentpageentry = datapagination.index;
  //       // }
  //       for(let i=0; i<datas.length;i++){
  //         datas[i]['statusCheck']=false;
  //         (this.EntrySearchForm.get('listproduct') as FormArray).push(this.formBuilder.group({
  //           'dynamic': new FormControl(),
  //           }));
  //           ((this.EntrySearchForm.get('listproduct') as FormArray).at(i) as FormGroup).get('dynamic').patchValue('');
  //         }
   
  //       });
        
  //     }

  updateAllComplete(event,data){
    if(event.checked==true){
      if(data=='BASEAMOUNT'){
        this.l1 = 'BASEAMOUNT';
      }
      if(data=='IGST'){
        this.l2 = 'IGST';
      }
      if(data=='SGST'){
        this.l3 = 'SGST';
      }
      if(data=='CGST'){
        this.l4 = 'CGST';
      }
      if(data=='INVAMOUNT'){
        this.l5 = 'INVAMOUNT';
      }
      if(data=='DEBITAMOUNT'){
        this.l6 = 'DEBITAMOUNT';
      }
    }
    else if(event.checked==false){
      if(data=='BASEAMOUNT'){
        this.l1 = '';
      }
      if(data=='IGST'){
        this.l2 = '';
      }
      if(data=='SGST'){
        this.l3 = '';
      }
      if(data=='CGST'){
        this.l4 = '';
      }
      if(data=='INVAMOUNT'){
        this.l5 = '';
      }
      if(data=='DEBITAMOUNT'){
        this.l6 = '';
      }
    }

  }
  nextClickEntry() {
    if (this.has_nextentry === true) {
      // this.getEntry(this.presentpageentry + 1, 10)
    }
  }

  previousClickEntry() {
    if (this.has_previousentry === true) {
      // this.getEntry(this.presentpageentry - 1, 10)
    }
  }
  
  editDebit(value,i,data){
    console.log(value)
   if(value == "D"){
    this.statusCheck = true;
    this.entryListDebit[i]['statusCheck']=false;
    this.entryListDebit[i]['sourceget']="D"
   }
   if(value == "F"){
    this.statusCheck = false;
    this.entryListDebit[i]['statusCheck']=true;
    this.entryListDebit[i]['sourceget']="F"
    if(this.entryListDebit[i].name=='product_isblocked'){
      this.entryListDebit[i]['statusCheck']=false;
      this.entryListDebit[i]['flagOptions'] = true
    }
    if(this.entryListDebit[i].name=='product_isrcm'){
      this.entryListDebit[i]['statusCheck']=false;
      this.entryListDebit[i]['flagOptions'] = true
    }
    if(this.entryListDebit[i].name=='invoicegst'){
      this.entryListDebit[i]['statusCheck']=false;
      this.entryListDebit[i]['flagOptions'] = true
    }
    //  (this.EntrySearchForm.get('listproduct') as FormArray).at(i).patchValue('');
    //  (this.EntrySearchForm.get('listproduct') as FormArray).push(this.formBuilder.group({
    //   'id': null,
    //  }))
  }
}


editCredit(value,i,data){
  console.log(value)
 if(value == "D"){
  this.statusCheck = true;
  this.entryListCredit[i]['statusCheck']=false;
  this.entryListCredit[i]['sourceget']="F"
 }
 if(value == "F"){
  this.statusCheck = false;
  this.entryListCredit[i]['statusCheck']=true;
  this.entryListCredit[i]['sourceget']="F"
  if(this.entryListCredit[i].name=='paymode_name'){
    this.entryListCredit[i]['statusCheck']=false;
    this.entryListCredit[i]['flagOptionsCredit'] = true
  }
  //  (this.EntrySearchForm.get('listproduct') as FormArray).at(i).patchValue('');
  //  (this.EntrySearchForm.get('listproduct') as FormArray).push(this.formBuilder.group({
  //   'id': null,
  //  }))
}
}
  // transactionEdit(value){
  //   console.log(value)
  // if(value == "D"){
  //   this.firstTransaction = 'DEBIT'
  // }
  // if(value == "C"){
  //   this.firstTransaction = 'CREDIT'
  // }
  // }

  displayselect1(d,i){

  }

  displayselect2(d,i){
    
  }

  autocompleteScroll_Modulelist(){

  }

  autocompleteScroll_Reportname(){

  }

  checker_module(d){

  }

  checker_report(d){

  }

  checker_cat(d,i){
    let arr = d.id;
    this.entryListDebit[i]['cat']=d.code;
    this.service.getsubcatsearch('',arr,1).subscribe(data=>{
      this.subcatdata=data['data'];
    })
  }

  checker_subcat(d,i){
    this.entryListDebit[i]['subcat']=d.code;
    ((this.debitsave.get("listTransactionDebit") as FormArray).at(i)).get('transnew').patchValue(d.glno);
  }

  EntrySearch(){

  }

  addItemDebit(event) {
    console.log(event)
    if(event.isTrusted==true){
      this.newValue = +1
    }
    if(this.flagMain=='' || null){
      this.toastr.error('Select The Type To Continue...')
    }
    else if(this.flagMain==1){
      let l:any=(this.debitsave.get('listTransactionDebit') as FormArray).length;
      console.log('new',l)
      let a:any={'dynamic':false,
              'dynamiccat':false,
              'dynamiccat1':false,
              'dynamicsecond': false,
              'dynamicsubcat': false,
              'dynamicsubcat1':false,}
      let b:any={'sourcegetAddNew':false,
                'cat':[],
                'subcat':[],
                'condition':false}
      let c:any={'condition':false}
      this.EntryTemplateNewAddRow.push(a);
      this.entryListDebit.push(b);
      this.entryListCredit.push(c);
      this.EntryTemplateNewAddRow[l]['flagTemplate'] = true;
      console.log(this.EntryTemplateNewAddRow);
    // this.toastr.warning('Save The Added Row First','',{timeOut:40000})
    (this.debitsave.get('listTransactionDebit') as FormArray).push(this.formBuilder.group({
      'condition1':new FormControl('',Validators.required),
        'booleannew':new FormControl(false),
        'cat':new FormControl(''),
        'subcat':new FormControl(''),
        'cat1':new FormControl(''),
        'subcat1':new FormControl(''),
        'value1':new FormControl('',Validators.required),
        'transnew':new FormControl('',Validators.required),
        'transactionNewValue':new FormControl(),
        'dynamicdebitentrycat':new FormControl(false),
        'dynamicdebitentrysubcat':new FormControl(false),
        'dynamicdebitvalue':new FormControl(false),
        'display1':new FormControl('',Validators.required),
        'cattrans':new FormControl(),
        'subcattrans':new FormControl(),
        'formula':new FormControl()
    }));
    this.toastr.success('Row Added To Last Field');
    ((this.debitsave.get("listTransactionDebit") as FormArray).at(l) as FormGroup).get('cat').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.service.getcatsearch(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )

    .subscribe((results: any[]) => {
      this.catdata = results["data"];
      console.log('cat_id=',results)

    });

    ((this.debitsave.get("listTransactionDebit") as FormArray).at(l) as FormGroup).get('subcat').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;

      }),
      switchMap(value => this.service.getsubcatsearch1(value,1)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )

    .subscribe((results: any[]) => {
      this.subcatdata = results["data"];
      console.log('cat_id=',results)

    });
  }
}
//  addItemCredit() {
//   this.toastr.success('Row Added To Last Field'),
//   // this.toastr.warning('Save The Added Row First','',{timeOut:40000})
//   (this.creditsave.get('listTransactionCredit') as FormArray).push(this.formBuilder.group({
//     'id': null
//     'condition2':new FormControl(),
//     'cat':new FormControl(),
//     'subcat':new FormControl(),
//     'value2':new FormControl(),
//     'transnew':new FormControl(),
//     'transactionNewValue':new FormControl()
//   }));   
// }

  checkBoxDebit(entry,event,q){
    console.log('debitnew',entry.name, event.target.checked)
    this.checkDebitFlag=true;
  if(event.target.checked){
    for(let i=0;i<this.entryListDebit.length;i++){
      if(this.entryListDebit[q].id==entry.id){
        this.entryListDebit[q]['condition']=true;
        // for(let j=0;j<this.transaddDebit.length;j++){
        // this.transaddDebit[q]['DEBIT'] = true
        // this.transaddDebit[q]['nametransaction'] = entry?.name
        // this.transaddDebit[q]['transaction'] = 'DEBIT'
        console.log('this.transadd',this.transaddDebit)
        // {value: 'D', viewValue: 'DEBIT'},
        // {value: 'C', viewValue: 'CREDIT'},
      // }
    }
      // this.masterData[i] = entry[i]
    }
  }
  else{
    for(let i=0;i<this.entryListDebit.length;i++){
      if(this.entryListDebit[q].id==entry.id){
        this.entryListDebit[q]['condition']=false;
        // for(let j=0;j<this.transaddDebit.length;j++){
          // this.transaddDebit[i]['DEBIT'] = false
          // this.transaddDebit['nametransaction'].remove()
          // this.transaddDebit[q]['transaction'].remove()
        console.log('this.transadd',this.transaddDebit)
          // {value: 'D', viewValue: 'DEBIT'},
          // {value: 'C', viewValue: 'CREDIT'},
        // }
      }
      // this.masterData[i] = entry[i]
    }
    
  }
  console.log(this.entryListDebit)
    
  }

  new(){
  console.log('HAI'),
  ((this.debitsave.get("listTransactionDebit") as FormArray).at(0) as FormGroup).get('formula').value
  }

  selectionChangeTypeDebit(d,i) {
      if(d.text=='PO'){
        this.selectEntryDynamicDebit[i] = d.id
      }
      if(d.text=='NON PO'){
        this.selectEntryDynamicDebit[i] = d.id
      }
      if(d.text=='PETTYCASH'){
        this.selectEntryDynamicDebit[i] = d.id
      }
      if(d.text=='ADVANCE'){
        this.selectEntryDynamicDebit[i] = d.id
      }
      if(d.text=='TCF'){
        this.selectEntryDynamicDebit[i] = d.id
      }
      if(d.text=='YES'){
        this.selectEntryDynamicDebit[i] = d.id
      }
      if(d.text=='NO'){
        this.selectEntryDynamicDebit[i] = d.id
      }
      // if(d.text=='EMP Claim'){
      //   this.selectEntryDynamicDebit[i] = d.id
      // }
      // if(d.text=='BRANCH EXP'){
      //   this.selectEntryDynamicDebit[i] = d.id
      // }
      
      // if(d.text=='SI'){
      //   this.selectEntryDynamicDebit[i] = d.id
      // }
      // if(d.text=='TAF'){
      //   this.selectEntryDynamicDebit[i] = d.model
      // }
      // if(d.text=='EB'){
      //   this.selectEntryDynamicDebit[i] = d.model
      // }
      // if(d.text=='RENT'){
      //   this.selectEntryDynamicDebit[i] = d.model
      // }
      // if(d.text=='DTPC'){
      //   this.selectEntryDynamicDebit[i] = d.model
      // }
      // if(d.text=='SGB'){
      //   this.selectEntryDynamicDebit[i] = d.model
      // }
      // if(d.text=='ICR'){
      //   this.selectEntryDynamicDebit[i] = d.model
    // }
  }

  selectionChangeTypeCredit(d,i) {
    if(d.text=='PO'){
      this.selectEntryDynamicCredit[i] = d.id
    }
    if(d.text=='NON PO'){
      this.selectEntryDynamicCredit[i] = d.id
    }
    if(d.text=='PETTYCASH'){
      this.selectEntryDynamicCredit[i] = d.id
    }
    if(d.text=='ADVANCE'){
      this.selectEntryDynamicCredit[i] = d.id
    }
    if(d.text=='TCF'){
      this.selectEntryDynamicCredit[i] = d.id
    }
    if(d.text=='YES'){
      this.selectEntryDynamicCredit[i] = d.id
    }
    if(d.text=='NO'){
      this.selectEntryDynamicCredit[i] = d.id
    }
  //   if(d.text=='EMP Claim'){
  //     this.selectEntryDynamicCredit[i] = d.model
  //   }
  //   if(d.text=='BRANCH EXP'){
  //     this.selectEntryDynamicCredit[i] = d.model
  //   }
  //   if(d.text=='SI'){
  //     this.selectEntryDynamicCredit[i] = d.model
  //   }
  //   if(d.text=='TAF'){
  //     this.selectEntryDynamicCredit[i] = d.model
  //   }
  //   if(d.text=='EB'){
  //     this.selectEntryDynamicCredit[i] = d.model
  //   }
  //   if(d.text=='RENT'){
  //     this.selectEntryDynamicCredit[i] = d.model
  //   }
  //   if(d.text=='DTPC'){
  //     this.selectEntryDynamicCredit[i] = d.model
  //   }
  //   if(d.text=='SGB'){
  //     this.selectEntryDynamicCredit[i] = d.model
  //   }
  //   if(d.text=='ICR'){
  //     this.selectEntryDynamicCredit[i] = d.model
  // }
}

selectionChangeTypeCredit_new(d,i) {
  if(d.name=='BRA'){
    this.selectEntryDynamicCredit[i] = d.id
  }
  if(d.name=='CREDITGL'){
    this.selectEntryDynamicCredit[i] = d.id
  }
  if(d.name=='DD'){
    this.selectEntryDynamicCredit[i] = d.id
  }
  if(d.name=='ERA'){
    this.selectEntryDynamicCredit[i] = d.id
  }
  if(d.name=='NEFT'){
    this.selectEntryDynamicCredit[i] = d.id
  }
  if(d.name='PPX'){
    this.selectEntryDynamicCredit[i] = d.id
  }
  if(d.name=='TDS'){
    this.selectEntryDynamicCredit[i] = d.id
  }
  if(d.name=='INTAC'){
    this.selectEntryDynamicCredit[i] = d.id
  }
  if(d.name=='paynews'){
    this.selectEntryDynamicCredit[i] = d.id
  }
  if(d.name=='esesed'){
    this.selectEntryDynamicCredit[i] = d.id
  }
}
  templateDebit(d,i){
    if(d.value == "D"){
      this.entryListDebit[i]['tempDebit']='DEBIT';
      this.entryListDebit[i]['sourcegetAddNew']=true
    }
    if(d.value == "C"){
      this.entryListDebit[i]['tempCredit']='CREDIT';
      this.entryListDebit[i]['sourcegetAddNew']=true
   }
  }

  templateCredit(d,i){
    if(d.value == "D"){
      this.entryListCredit[i]['tempDebit']='DEBIT';
    }
    if(d.value == "C"){
      this.entryListCredit[i]['tempCredit']='CREDIT';
   }
  }

  checkBoxCredit(entry,event,q){
    console.log(entry, event.target.checked)
    this.checkCreditFlag=true;
  if(event.target.checked){
    for(let i=0;i<this.entryListCredit.length;i++){
      if(this.entryListCredit[q].id==entry.id){
        this.entryListCredit[q]['condition']=true;
        // for(let j=0;j<this.transaddCredit.length;j++){
          // this.transaddCredit[q]['CREDIT'] = true
          // this.transaddCredit[q]['nametransaction'] = entry?.name
          // this.transaddCredit[q]['transaction'] = 'CREDIT'
          console.log('this.transadd',this.transaddCredit)
        // }
      }
      // this.masterData[i] = entry[i]
    }
  }
  else{
    for(let i=0;i<this.entryListCredit.length;i++){
      if(this.entryListCredit[q].id==entry.id){
        this.entryListCredit[q]['condition']=false;
        // for(let j=0;j<this.transaddCredit.length;j++){
        //   this.transaddCredit[i]['CREDIT'] = false
        //   this.transaddCredit['nametransaction'].remove()
          //  = this.entryListDebit[q].name
          // this.transaddCredit[q]['transaction'].remove()
          console.log('this.transadd',this.transaddCredit)
        // }
      }
      // this.masterData[i] = entry[i]
    }
    
  }
  console.log(this.entryListCredit)
    
  }

  transaddnewDebit(d,i){
    if(d.value == "D"){
      this.statusCheckFirst = true;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat']=true;
      this.entryListDebit[i]['debitstatusCheck']=false;
      this.entryListDebit[i]['sourcegetDeb']="F"
      this.entryListDebit[i]['sourcegetAddNew']=true
      this.entryListDebit[i]['booleannew']=true
      this.EntryTemplateNewAddRow[i]['dynamic']=true;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat1'] = false;
      this.entryListDebit[i]['subcat'] = 'DYNAMIC';
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat1').patchValue('DYNAMIC')
      // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('booleannew').patchValue(true);
      
    }
    if(d.value == "F"){
      this.statusCheckFirst = false;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat1'] = true;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat']=false;
      this.entryListDebit[i]['debitstatusCheck']=true;
      this.entryListDebit[i]['sourcegetDeb']="F"
      this.entryListDebit[i]['sourcegetAddNew']=true
      this.entryListDebit[i]['booleannew']=false
      this.EntryTemplateNewAddRow[i]['dynamic']=false;
      // ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat').patchValue('')
     //  (this.EntrySearchForm.get('listproduct') as FormArray).at(i).patchValue('');
     //  (this.EntrySearchForm.get('listproduct') as FormArray).push(this.formBuilder.group({
     //   'id': null,
     //  }))
   }
  }

  transadddynamiccat(d,i){
    if(d.value == "D"){
      this.EntryTemplateNewAddRow[i]['dynamiccat']=true;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat']=true;
      this.EntryTemplateNewAddRow[i]['dynamiccat1']=false;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat1']=false;
      this.entryListDebit[i]['cat'] = 'DYNAMIC';
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('cat1').patchValue('DYNAMIC'),
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat1').patchValue('DYNAMIC'),
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('transnew').patchValue('DYNAMIC')
      // this.modeSelect = 'DYNAMIC';
      // ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcattrans').patchValue('DYNAMIC')
    }
    if(d.value == "F"){
      this.EntryTemplateNewAddRow[i]['dynamiccat1']=true;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat1']=true;
      this.EntryTemplateNewAddRow[i]['dynamicsubcat']=false;
      this.EntryTemplateNewAddRow[i]['dynamiccat']=false;
      // ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcattrans').patchValue('FIXED'),
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('cat').patchValue(''),
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat1').patchValue(''),
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('transnew').patchValue('')
      // this.modeSelect = 'FIXED';
   }
  }

  transaddnewvalue(d,i){
    if(d.value == "D"){
      this.statusCheckSecond = true;
      // this.EntryTemplateNewAddRow[i]['value']='';
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('formula').patchValue('DYNAMIC'),
      this.EntryTemplateNewAddRow[i]['dynamicsecond']=false;
      this.entryListDebit[i]['sourcegetDebsecond']="F"
      this.entryListDebit[i]['sourcegetAddNewSecond']=true 
    }
    if(d.value == "F"){
      this.statusCheck = false;
      // this.EntryTemplateNewAddRow[i]['value']='';
      ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('formula').patchValue(''),
      this.EntryTemplateNewAddRow[i]['dynamicsecond']=true;
      this.entryListDebit[i]['sourcegetDebsecond']="D"
      this.entryListDebit[i]['sourcegetAddNewSecond']=true
      this.statusCheckSecond = false;
      // ((this.debitsave.get('listTransactionDebit') as FormArray).at(i) as FormGroup).get('booleannew').patchValue(true);
     //  (this.EntrySearchForm.get('listproduct') as FormArray).at(i).patchValue('');
     //  (this.EntrySearchForm.get('listproduct') as FormArray).push(this.formBuilder.group({
     //   'id': null,
     //  }))
   }
  }
  // transaddnewCredit(d,i){
  //   ((this.creditsave.get('listTransactionCredit') as FormArray).at(i) as FormGroup).get('transactionNewValue').patchValue(d.transaction);
  //   if(d.value == "D"){
  //     this.statusCheck = false;
  //     this.entryListCredit[i]['creditstatusCheck']=false;
  //     this.entryListCredit[i]['sourcegetCre']="D"
  //   }
  //   if(d.value == "F"){
  //     this.statusCheck = true;
  //     this.entryListCredit[i]['creditstatusCheck']=true;
  //     this.entryListCredit[i]['sourcegetCre']="F"
  //     (this.EntrySearchForm.get('listproduct') as FormArray).at(i).patchValue('');
  //     (this.EntrySearchForm.get('listproduct') as FormArray).push(this.formBuilder.group({
  //      'id': null,
  //     }))
  //  }
  // }
  dialogRef:any
  getpaystatus(temp):void {
    this.dialogRef = this.dialog.open(temp, {
      width: '60%',
      height: '70%',
      // data: { name: this.name, animal: this.animal }
    });

    this.dialogRef.afterClosed().subscribe(result => {
    });
    // this.service.getpaymentstatus(crno)
    // .subscribe(result =>{
    //   this.paymentdata = result['data']
    //   console.log(result)
    //   console.log(this.paymentdata)
    // },
    // (error)=>{
    //   this.spinner.hide();
    //   this.toastr.warning(error.status+error.statusText)
    // });
  }

  ab = 0
  bc = 0

  calculation(i,event){
    if(this.bc == 1){
      if (event.target.isConnected == true){
        this.ab++
      }
    }
    this.bc = 1

    this.formulate[this.ab] = ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('formula').value
    this.l1='';
    this.l2='';
    this.l3='';
    this.l4='';
    this.l5='';
    this.l6='';
    this.dialogRef.close()
  }

  formulaCalculate(d){
    if(d.value=="1"){
      this.formulaFlag = 1
    }
    if(d.value=="2"){
      this.formulaFlag = 2
    }
  }

  model1(event){
    if (event.target.checked == false) {
      this.l1 = '';
    }
    else if(event.target.checked == true) {
      this.l1 = 'BASEAMOUNT';
    }
    // ((this.debitsave.get("listTransactionDebit") as FormArray).at(0) as FormGroup).get('formula').patchValue('INVOICEAMOUNT')
    // this.l1.get.patchValue('INVOICEAMOUNT')
  //   this.l1.forEach(x =>  {
  //     x = x ? '' || 'XXX' : 'INVOICEAMOUNT'
  //  });
  }
  model2(event){
    if (event.target.checked == false) {
      this.l2 = '';
    }
    else if(event.target.checked == true) {
      this.l2 = 'IGST';
    }
    // ((this.debitsave.get("listTransactionDebit") as FormArray).at(0) as FormGroup).get('formula').patchValue(this.l1+'IGST')
    // this.l2.get.patchValue('IGST')
  //   this.l2.forEach(x =>  {
  //     x = x ? '' || 'XXX' : 'IGST'
  //  });
  }
  model3(event){
    if (event.target.checked == false) {
      this.l3 = '';
    }
    else if(event.target.checked == true) {
      this.l3 = 'SGST'
    }
    // ((this.debitsave.get("listTransactionDebit") as FormArray).at(0) as FormGroup).get('formula').patchValue('SGST')
    // this.l3.get.patchValue('SGST')
  //   this.l3.forEach(x =>  {
  //     x = x ? '' || 'XXX' : 'SGST'
  //  });
  }
  model4(event){
    if (event.target.checked == false) {
      this.l4 = '';
    }
    else if(event.target.checked == true) {
      this.l4 = 'CGST';
    }
    // ((this.debitsave.get("listTransactionDebit") as FormArray).at(0) as FormGroup).get('formula').patchValue('CGST')
    // this.l4.get.patchValue('CGST')
  //   this.l4.forEach(x =>  {
  //     x = x ? '' || 'XXX' : 'CGST'
  //  });
  }
  model5(event){
    if (event.target.checked == false) {
      this.l5 = '';
    }
    else if(event.target.checked == true) {
      this.l5 = 'INVAMOUNT';
    }
  }
  
  conditionAddDebit(d,i){
    if(d.viewValue=='100%'){
      let amount = ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('condition1').value
      let finalamount = amount
    }
    if(d.viewValue=='50%'){
      let amount = ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('condition1').value
      let finalamount = amount/2
    }
  }

  actionDelete(i){
  // const d:number=((this.splitquantity.get('listofquantity') as FormArray).length);
    ((this.debitsave.get('listTransactionDebit') as FormArray).removeAt(i-1))
    this.EntryTemplateNewAddRow[i]['flagTemplate'] = false;
  }
  conditionAddCredit(d,i){
    console.log(d)
  }

  cancel(){
    this.router.navigateByUrl('/entry/entrymaster')
  }

  save(){
    this.spinner.show();
    if(this.EntrySearchForm.get('parametername').value==null || this.EntrySearchForm.get('parametername').value=="" || '' ){
      this.toastr.warning('Enter Parameter Name');
      this.spinner.hide();
      return false;
     }
    if(this.checkDebitFlag!=true){
      this.toastr.error('At Least One Debit Check Box To Be Choose')
      this.spinner.hide();
      return false;
    }
    if(this.checkCreditFlag!=true){
      this.toastr.error('At Least One Credit Check Box To Be Choose')
      this.spinner.hide();
      return false;
    }
    let dta1 = [];
    let dta2 = [];
    let ent1 = [];
    let ent2 = [];
    let flag: Array<any>=[];
    let flag2: Array<any>=[];
    let flag3: Array<any>=[];
    let flag4: Array<any>=[];
    let flag5: Array<any>=[]
    let a:any;
    let b:any;
    let c:any;
    let d:any;
    let e:any;
    let data = this.EntrySearchForm.value
    // console.log('santhosh',data)
    // console.log('santhosh1',this.entryListDebit)
    // console.log('santhosh2',this.debitsave)
    var datanew=['apheader','apinvoiceheader','apinvoicedetails','apdebit','apcredit']
    for(let i=0;i<this.entryListDebit.length;i++){
        if(this.entryListDebit[i].condition==true){
          if(this.selectEntryDynamicDebit[i]==undefined || null){
            this.selectEntryDynamicDebit[i]=""
          }
          let hello =  this.selectEntryDynamicDebit[i].toString()
          // ((this.EntrySearchForm.get('listproductdebit') as FormArray).at(i) as FormGroup).get('dynamicdebit').value;
          let v:any={'columnname':this.entryListDebit[i].name,'source_key':this.entryListDebit[i].sourceget,'source_value':hello};
          console.log(v)
          flag.push(v)
          // if(this.entryListDebit[i].debitstatusCheck==true){
            
          // }
          // a={'columnnamedebit':flag}
          // b={"template":flag2}
          a=flag
        }
      }
    for(let i=0;i<this.entryListCredit.length;i++){
        if(this.entryListCredit[i].condition==true){
          console.log('new124',this.EntrySearchForm.value)
          if(this.selectEntryDynamicCredit[i]==undefined || null){
            this.selectEntryDynamicCredit[i]=""
          }
          let hello = this.selectEntryDynamicCredit[i].toString()
          // ((this.EntrySearchForm.get('listproductcredit') as FormArray).at(i) as FormGroup).get('dynamiccredit').value;
          let v:any={'columnname':this.entryListCredit[i].name,'source_key':this.entryListCredit[i].sourceget,'source_value':hello};
          console.log(v)
          flag3.push(v)
          // if(this.entryListCredit[i].creditstatusCheck==true){
          //   let e = {'glno':this.entryListCredit[i].sourcegetCre.toString(),
          //            'transaction':this.entryListCredit[i].tempCredit.toString(),
          //            'value':((this.creditsave.get("listTransactionCredit") as FormArray).at(i) as FormGroup).get('condition2').value,
          //            'valuetobetaken':((this.creditsave.get("listTransactionCredit") as FormArray).at(i) as FormGroup).get('value2').value,
          //            'wisefincat':'',
          //            'wisefinsubcat':'',
          //            'display':((this.creditsave.get("listTransactionCredit") as FormArray).at(i) as FormGroup).get('display2').value}
          //            flag4.push(e)
          // }
          // var new2 = {"columnnamecredit":flag3}
          // c={'columnnamecredit':flag3}
          c=flag3
          // d={"template":flag4}
        }
      }
    for(let i=0;i<this.EntryTemplateNewAddRow.length;i++){
        if(this.entryListDebit[i]['sourcegetAddNew']==true){
          // let gl_no:any
          // if(this.entryListDebit[i]['booleannew']=true){
          //   let gl_no = ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('transnew').value
          // }
          // if(this.entryListDebit[i]['booleannew']=false){
          //   let gl_no = this.entryListDebit[i]['sourcegetDebsecond']
          // }
          // for(let j=0;j<this.EntryTemplateNewAddRow.length;j++){
            if(this.EntryTemplateNewAddRow[i]['flagTemplate']==true){
              let e = {'gl_no': ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('transnew').value,
                    // 'source_value_gl':((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('dynamicdebitentrycat').value,
                    // this.entryListDebit[i].sourcegetDeb.toString(),
                  'transaction':((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('transactionNewValue').value,
                  //  this.entryListDebit[i].tempDebit.toString(),
                  // 'value':((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('condition1').value,
                  // 'value':this.EntryTemplateNewAddRow[i]['value'],
                  // ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('dynamicdebitvalue').value,
                  // 'source_value':((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('dynamicdebitvalue').value,
                  'valuetobetaken':this.formulate[i],
                  // ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('value1').value,
                  'wisefincat':this.entryListDebit[i]['cat'],
                  // ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('cat').value,
                  'wisefinsubcat':this.entryListDebit[i]['subcat'],
                  // ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat').value,
                  'display':((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('display1').value}
                  console.log('eeee',e)
                  flag2.push(e)
                  b=flag2
                // }
              }
            }
          }
        // }
          // let e = {'gl_no': '425001010',
          //           // 'source_value_gl':((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('dynamicdebitentrycat').value,
          // // this.entryListDebit[i].sourcegetDeb.toString(),
          //         'transaction':'DEBIT',
          //         //  this.entryListDebit[i].tempDebit.toString(),
          //         'value':'100',
          //         // 'source_value':'100',
          //         'valuetobetaken':'100%',
          //         'wisefincat':'EXECUTIVE MALE',
          //         // ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('cat').value,
          //         'wisefinsubcat':'BASIC PAY',
          //         // ((this.debitsave.get("listTransactionDebit") as FormArray).at(i) as FormGroup).get('subcat').value,
          //         'display':'YES'}
          //         console.log('eeee',e)
          //         flag2.push(e)
          //         b=flag2
          //       }
          //     }
        
      // if(this.entryListDebit[i].is_parent==2){
        
      //   let hello = ((this.EntrySearchForm.get('listproduct') as FormArray).at(i) as FormGroup).get('dynamic').value;
      //   let v:any={'columnname':this.entryListDebit[i].displayname.toString(),'source_key':this.entryListDebit[i].sourceget,'source_value':hello};
      //   flag2.push(v)
      //   var new2 = {"tabel_key":this.entryListDebit[i].is_parent,"param":flag2}
      //   b={'apinvoiceheader':new2}
      // }
      // if(this.entryListDebit[i].is_parent==3){
        
      //   let hello = ((this.EntrySearchForm.get('listproduct') as FormArray).at(i) as FormGroup).get('dynamic').value;
      //   let v:any={'columnname':this.entryListDebit[i].displayname.toString(),'source_key':this.entryListDebit[i].sourceget,'source_value':hello};
      //   flag3.push(v)
      //   var new3 = {"tabel_key":this.entryListDebit[i].is_parent,"param":flag3}
      //   c={'apinvoicedetails':new3}
      // }
      // if(this.entryListDebit[i].is_parent==4){
        
      //   let hello = ((this.EntrySearchForm.get('listproduct') as FormArray).at(i) as FormGroup).get('dynamic').value;
      //   let v:any={'columnname':this.entryListDebit[i].displayname.toString(),'source_key':this.entryListDebit[i].sourceget,'source_value':hello};
      //   flag4.push(v)
      //   var new4 = {"tabel_key":this.entryListDebit[i].is_parent,"param":flag4}
      //   c={'apdebit':new4}
      // }
      // if(this.entryListDebit[i].is_parent==5){
        
      //   let hello = ((this.EntrySearchForm.get('listproduct') as FormArray).at(i) as FormGroup).get('dynamic').value;
      //   let v:any={'columnname':this.entryListDebit[i].displayname.toString(),'source_key':this.entryListDebit[i].sourceget,'source_value':hello};
      //   flag5.push(v)
      //   var new5 = {"tabel_key":this.entryListDebit[i].is_parent,"param":flag5}
      //   c={'apcredit':new5}
      // }
  if (a !=undefined){
    dta1.push(a)
  }
  if (b !=undefined){
    ent1.push(b)
  }
  if (c !=undefined){
    dta2.push(c)
  }
  // if (d !=undefined){
  //   ent2.push(d)
  // }
  // if (e !=undefined){
  //   dta.push(e)
  // }

  let flagTransaction = this.transactionListCode
  var paradata = {'paramname':this.EntrySearchForm.get('parametername').value,
  // this.EntrySearchForm.get('parametername').value,
    'code':this.transactionListCode,
    'columnnamedebit':dta1,
    'columnnamecredit':dta2,
    'entry_template':ent1}
  console.log('masterdata',paradata)
  console.log('masterdata',this.transactionListCode)
  console.log('masterdata',dta1)
  console.log('masterdata',dta2)
  console.log('masterdata',ent1)

  // let drog = {"paramname":"ECF NON PO REG",
  // "code":"APECF NON PO",}
  this.service.getEntrySave(paradata)
  .subscribe((results: any) => {
    console.log("saveEntry", results);
    if(results.status == 'success'){
      this.toastr.success('SUCCESS')
      this.spinner.hide();
      this.router.navigateByUrl('/entry/entrymaster')
    }
    if(results.code == 'INVALID_DATA'){
      this.toastr.error('Duplicate entry')
      this.spinner.hide()
    }
  },
  (error)=>{
    this.spinner.hide();
    this.toastr.warning(error.status+error.statusText)
  }
  )}
}
