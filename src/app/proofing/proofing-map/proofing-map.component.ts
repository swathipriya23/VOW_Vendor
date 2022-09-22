import { Component, OnInit, ViewChild, } from '@angular/core';
import { ProofingService } from '../proofing.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { NotificationService } from '../notification.service';
import { ShareService } from '../share.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';


// const Colors = ["#22fa92", "#b6a330", "#62fbb1", "#8dd55d", "#b2c072", "#24fbbe", "#50f8fc","#e4ff98","#41e740"];
const Colors = ["#f7f6f2", "#faf8d4", "#e9eff5"];
const datePickerFormat = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MMM-yyyy', this.locale);
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-proofing-map',
  templateUrl: './proofing-map.component.html',
  styleUrls: ['./proofing-map.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: datePickerFormat },
    DatePipe
  ],
})
export class ProofingMapComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  dp: boolean[][] = null;
  images: any;
  tempId: any;
  accountid: any;
  uploadForm: FormGroup;
  knockForm: FormGroup;
  proofingList: Array<any>;
  ProofingList_Desc = [];

  transactionMapFilter: string[] = ['All', 'Mapped', 'Partially Mapped', 'Unmapped', 'Debit', 'Credit'];
  balanceMapFilter: string[] = ['All', 'Mapped', 'Partially Mapped'];
  sortby: string[] = ['Date', 'Debit', 'Credit'];
  sorttype: string[] = ['Ascending', 'Descending'];
  matchcolumn: string[] = ['All', 'Amount', 'Description', 'ReferenceNo', 'UserReference'];
  sorttype_filter1: any;
  matchcolumn_filter: any;
  sortby_filter1: any;
  sorttype_filter2: any;
  sortby_filter2: any;
  colorarray = [];
  creditrowCount: any = 0;
  knockoffList = [];
  selectedList = [];
  LabelList: Array<any>;
  checkedItems: any = [];
  refno: any;
  noofchars: any = 8;
  noofcharsdesc: any = 8;
  noofcharsrefno: any = 8;
  noofcharsuserrefno: any = 8;
  RemarksLabelid: any;
  RemarksRefNo: any;
  remarks: any;
  ShowMappingFlag = false;
  ShowMatchedFlag = false;
  Filtertype: any = 'All';
  BalanceFiltertype: any = 'All';
  finaljson: any;
  uploadFileList: Array<any>;
  templateDDList: Array<any>;
  AccountList: Array<any>;
  from_Date: any = new Date();
  to_Date: any = new Date();
  colorvalue = '';
  PrevColorValue = '';
  proofinglabelSort: Array<any>;
  jsonLabel: Array<any>
  fromdate = new FormControl(new Date())
  todate = new FormControl(new Date())
  

  noofDebit: number = 0;
  noofCredit: number = 0;
  sumofDebit: number = 0;
  sumofCredit: number = 0;
  PartillyMappedId: any;
  selected: any;
  selectedAll: boolean
  userDescription: FormGroup;
  tableid: number;
  descriptonDataList: any = [];
  attachmentsList: any = [];
  lableDocumentList: any = [];
  labelTableId: number;
  transactionFile: any;
  labelFile: any
  attachmentTransactionList: any;
  attachmentLabelList: any;
  lableDataList: any;
  labeldatas: any;
  labelTransactionImages: FormGroup
  constructor(private shareService: ShareService, private router: Router,
    private notification: NotificationService, private SpinnerService: NgxSpinnerService,
    private datePipe: DatePipe, private proofingService: ProofingService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userDescription = this.fb.group({
      user_description: ['', Validators.required],
      TransactionImages: [''],
    })
    this.labelTransactionImages = this.fb.group({
      lablesImages: [''],
    })
    this.knockForm = this.fb.group({
      fromdate: [''],
      todate: [''],
      branch_s: [''],
      userid_s: [''],
      referenceno_s: [''],
      userreference_s: [''],
      description_s: [''],
      debit_s: [''],
      credit_s: [''],
      refno_s: ['']
    })

    this.getTemplateDD();
    this.getAccountList();
    this.get_Label();
    this.Filtertype = 'All';
    this.BalanceFiltertype = 'All'
    this.sortby_filter1 = 'Date'
    this.sorttype_filter1 = 'Ascending'
    this.matchcolumn_filter = 'All'
    
  }

  display(v: Array<number>) {
    let temp: any[];
    temp = v.sort((n1, n2) => n1 - n2);
    const index = this.ProofingList_Desc.indexOf(JSON.stringify(temp));
    debugger;
    if (index == -1) {

      this.ProofingList_Desc.push(JSON.stringify(temp));

    }

    this.creditrowCount = this.creditrowCount + 1
    if (this.creditrowCount === 2000) {  console.log('2000 reached') }
  }
  printSubsetsRec(arr: number[], i: number, sum: number, p: Array<number>) {
    if (this.creditrowCount === 2001) { return }
    if (i === 0 && sum !== 0 && this.dp[0][sum]) {
      /* add */(p.push(arr[i]) > 0);
      this.display(p);
      /* clear */(p.length = 0);
      return;
    }
    if (i === 0 && sum === 0) {
      this.display(p);
      /* clear */(p.length = 0);
      return;
    }
    if (this.dp[i - 1][sum]) {
      let b: Array<number> = <any>([]);
      /* addAll */((l1, l2) => l1.push.apply(l1, l2))(b, p);
      this.printSubsetsRec(arr, i - 1, sum, b);
    }
    if (sum >= arr[i] && this.dp[i - 1][sum - arr[i]]) {
      /* add */(p.push(arr[i]) > 0);
      this.printSubsetsRec(arr, i - 1, sum - arr[i], p);
    }
  }
  printAllSubsets(arr: number[], n: number, sum: number) {
    if (n === 0 || sum < 0) return;
    this.dp = <any>(function (dims) { let allocate = function (dims) { if (dims.length == 0) { return false; } else { let array = []; for (let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; } }; return allocate(dims); })([n, sum + 1]);
    for (let i: number = 0; i < n; ++i) {
      {
        this.dp[i][0] = true;
      };
    }
    if (arr[0] <= sum) this.dp[0][arr[0]] = true;
    for (let i: number = 1; i < n; ++i) { for (let j: number = 0; j < sum + 1; ++j) { this.dp[i][j] = (arr[i] <= j) ? (this.dp[i - 1][j] || this.dp[i - 1][j - arr[i]]) : this.dp[i - 1][j]; }; }
    if (this.dp[n - 1][sum] === false) {
      
      return;
    }
    let p: Array<number> = <any>([]);
    this.printSubsetsRec(arr, n - 1, sum, p);
  }

  findSubset(debit_array, creditrow) {

    
    let subSet = [];
    this.subsetSum1(debit_array, subSet, debit_array.length, 0, 0, 0, creditrow);
  }

  subsetSum(debit_array, subSet, n, subSize, total, nodeCount, creditrow) {
    if (total == +creditrow.amount) {
      
      this.displaySubset(subSet, subSize);     //print the subset
      this.subsetSum(debit_array, subSet, n, subSize - 1, total - +debit_array[nodeCount].amount, nodeCount + 1, creditrow);     //for other subsets
      return;
    } else {
      
      for (let i = nodeCount; i < n; i++) {     //find node along breadth
        subSet[subSize] = +debit_array[i].amount;
        
        this.subsetSum(debit_array, subSet, n, subSize + 1, total + +debit_array[i].amount, i + 1, creditrow);     //do for next node in depth
      }
    }
  }

  subsetSum1(debit_array, subSet, n, subSize, total, nodeCount, creditrow) {
    if (total == +creditrow) {
      
      this.displaySubset(subSet, subSize);     //print the subset
      subSet = [];
      this.subsetSum1(debit_array, subSet, n, subSize - 1, total - +debit_array[nodeCount], nodeCount + 1, creditrow);     //for other subsets
      return;
    } else {
      
      for (let i = nodeCount; i < n; i++) {     //find node along breadth
        subSet[subSize] = +debit_array[i];
        
        this.subsetSum1(debit_array, subSet, n, subSize + 1, total + +debit_array[i], i + 1, creditrow);     //do for next node in depth
      }
    }
  }
  displaySubset(subSet, size) {
    
    let finalsubset = [];
    for (let i = 0; i < size; i++) {
      finalsubset.push(subSet[i]);
      
    }
    
    
  }

  CreditMatchprocess(debit_array, creditrow) {
    this.creditrowCount = this.creditrowCount + 1;
    if (this.creditrowCount > 1) { return; }
    
    
    function fork(i = 0, s = 0, t = []) {
      

      if (s === +creditrow.amount) {
        result.push(t);
        
        return;
      }
      
      if (i === debit_array.length) {
        return;
      }
      if ((s + +debit_array[i].amount) <= (+creditrow.amount)) { // shout circuit for positive numbers only
        
        
        fork(i + 1, s + +debit_array[i].amount, t.concat(debit_array[i].amount));
        
      }
      
      fork(i + 1, s, t);
      
    }

    var result = [];
    fork();
    
    return result;
  }


  gotoupload($event) {
    
    this.router.navigate(["/ProofingUpload"],{ skipLocationChange: true });
  }
  AmountMatch($event) {
    let proofingList_new = [];
    let proofingList_Debit = this.proofingList.filter(trandata => trandata.type == 'Debit');
    let proofingList_Credit = this.proofingList.filter(trandata => trandata.type == 'Credit');
    proofingList_Debit.forEach((eachrow) => {
      while (this.colorvalue === '' || this.colorvalue === this.PrevColorValue) {
        let random = Math.floor(Math.random() * Colors.length);
        this.colorvalue = Colors[random];
        if (this.PrevColorValue !== this.colorvalue) {
          this.PrevColorValue = this.colorvalue;
          break;
        }
      }
      proofingList_new.push(eachrow);
      this.colorarray.push(this.colorvalue)
      let proofingList_Creditnew = proofingList_Credit.filter(trandata => trandata.amount == eachrow.amount);
      if (proofingList_Creditnew.length) {
        proofingList_new = proofingList_new.concat(proofingList_Creditnew);
        for (var i = 0; i < proofingList_Creditnew.length; i++) {
          this.colorarray.push(this.colorvalue)
        }
      }
    });
    this.proofingList = proofingList_new;
    if (this.proofingList.length===0){this.proofingList=undefined}
  }
  DescMatch($event) {
    if (this.noofcharsdesc === undefined) { this.noofcharsdesc = 8; }
    this.ProofingList_Desc = [];
    let proofingList_CreditDescription = [];
    let proofingList_Debit = this.proofingList.filter(trandata => trandata.type == 'Debit');
    let proofingList_Credit = this.proofingList.filter(trandata => trandata.type == 'Credit');
    proofingList_Debit.forEach((eachrow) => {
      this.process(eachrow, proofingList_Credit, this.noofcharsdesc)
    });
    this.proofingList = this.ProofingList_Desc;
    if (this.proofingList.length===0){this.proofingList=undefined}
  }
  CreditMatch($event) {
    this.ProofingList_Desc = [];
    let proofingList_Debit = this.proofingList.filter(trandata => trandata.type == 'Debit');
    let proofingList_Credit = this.proofingList.filter(trandata => trandata.type == 'Credit');
    proofingList_Debit = proofingList_Debit.sort((n1, n2) => parseFloat(n1.amount) - parseFloat(n2.amount));
    proofingList_Credit = proofingList_Credit.sort((n1, n2) => parseFloat(n1.amount) - parseFloat(n2.amount));
    proofingList_Credit.forEach((eachrow) => {
      if (eachrow.amount >= 50000) { return; }
      if (eachrow.amount <= 38000) { return; }
      this.ProofingList_Desc.push(eachrow);
      this.printAllSubsets(proofingList_Debit, proofingList_Debit.length, eachrow.amount)
    });
  }
  getSubsets(array, sum) {

    function fork(i = 0, s = 0, t = []) {
      if (s === sum) {
        result.push(t);
        return;
      }
      if (i === array.length) {
        return;
      }
      if (s + array[i] <= sum) { // shout circuit for positive numbers only
        fork(i + 1, s + array[i], t.concat(array[i]));
      }
      fork(i + 1, s, t);
    }

    var result = [];
    fork();
    return result;
  }

  RefNoMatch($event) {
    if (this.noofcharsrefno === undefined) { this.noofcharsrefno = 8; }
    this.ProofingList_Desc = [];
    let proofingList_Debit = this.proofingList.filter(trandata => trandata.type == 'Debit');
    let proofingList_Credit = this.proofingList.filter(trandata => trandata.type == 'Credit');
    proofingList_Debit.forEach((eachrow) => {
      this.process(eachrow, proofingList_Credit, this.noofcharsrefno)
    });
    this.proofingList = this.ProofingList_Desc;
    if (this.proofingList.length===0){this.proofingList=undefined}
  }
  UserRefNoMatch($event) {
    if (this.noofcharsuserrefno === undefined) { this.noofcharsuserrefno = 8; }
    this.ProofingList_Desc = [];
    let proofingList_Debit = this.proofingList.filter(trandata => trandata.type == 'Debit');
    let proofingList_Credit = this.proofingList.filter(trandata => trandata.type == 'Credit');
    proofingList_Debit.forEach((eachrow) => {
      this.process(eachrow, proofingList_Credit, this.noofcharsuserrefno)
    });
    this.proofingList = this.ProofingList_Desc;
    if (this.proofingList.length===0){this.proofingList=undefined}
  }
  getColor(i) {
    var xcolor = this.colorarray[i]
    if (xcolor === '') {
      xcolor = 'white'
    }
    return xcolor;
  }
  process(debit, credit_arr, weight) {
    var per_arr = [];

    while (this.colorvalue === '' || this.colorvalue === this.PrevColorValue) {
      let random = Math.floor(Math.random() * Colors.length);
      this.colorvalue = Colors[random];
      if (this.PrevColorValue !== this.colorvalue) {
        this.PrevColorValue = this.colorvalue;
        break;
      }
    }
    let DebitColumn = '';
    let CreditColumn = '';


    this.ProofingList_Desc.push(debit);
    this.colorarray.push(this.colorvalue)
    for (var i = 0; i < credit_arr.length; i++) {
      if (this.matchcolumn_filter === 'Description') {
        DebitColumn = debit.description;
        CreditColumn = credit_arr[i].description
      }
      if (this.matchcolumn_filter === 'ReferenceNo') {
        DebitColumn = debit.ref_no;
        CreditColumn = credit_arr[i].ref_no
      }
      if (this.matchcolumn_filter === 'UserReference') {
        DebitColumn = debit.user_ref;
        CreditColumn = credit_arr[i].user_ref
      }
      var sper = this.calculate_per(DebitColumn, CreditColumn, weight);
      var dper = this.calculate_per(CreditColumn, DebitColumn, weight);
      if (sper > dper) {
        if (sper > 10) {
          per_arr.push(sper);
          this.ProofingList_Desc = this.ProofingList_Desc.concat(credit_arr[i]);
          this.colorarray.push(this.colorvalue)
        }
      }
      else {
        if (dper > 10) {
          per_arr.push(dper);
          this.ProofingList_Desc = this.ProofingList_Desc.concat(credit_arr[i]);
          this.colorarray.push(this.colorvalue)
        }
      }
    }
  }

  calculate_per(source, destination, weight) {
    var len = (source.length + 1) - parseInt(weight);
    var counter = 0;
    var icount = 0;
    for (var i = 0; i < len; i++) {
      var start = i;
      var end = i + parseInt(weight);
      end = weight;
      var s = source.substr(start, end);
      if (destination.indexOf(s) !== -1) {
        counter++;
      }
      icount++;
    }
    var per = ((counter) / icount) * 100;
    return per;
  }

  calculateDiff(sentDate) {
    var date1: any = new Date(sentDate);
    var date2: any = new Date();
    var diffDays: any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  getTemplateDD() {
    this.proofingService.getTemplateDD()
      .subscribe((results: any) => {
        let data = results['data'];
        this.templateDDList = data
      })
  }

  getAccountList() {
    this.proofingService.getAccount_List()
      .subscribe((results: any) => {
        let data = results['data'];
        this.AccountList = data;
      })
  }



  fileChange(file) {
    this.images = <File>file.target.files[0];
  }


  uploadPreview() {
    let preViewid = this.uploadFileList[0].id
    this.proofingService.uploadPreview(preViewid)
      .subscribe((response: any) => {
        let binaryData = [];
        binaryData.push(response)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = "Proofing.xlsx";
        link.click();
      })
  }

  tempDD(id) {
    this.tempId = id
    return this.tempId
  }
  FetchAccountID(id) {
    this.accountid = id
    this.checkedItems = [];
    this.noofCredit = 0;
    this.noofDebit = 0;
    this.sumofCredit = 0;
    this.sumofDebit = 0;
    this.ShowMappingFlag = false;
    this.selectedList = [];
    return this.accountid
  }

  get_Proofingdata(pjson, accountid) {
    this.proofingService.getProofingdata(pjson, accountid)
      .subscribe((results: any[]) => {
    this.displaydownload=true

        let datas = results["data"];
        this.colorarray = [];
        this.proofingList = datas;
        if (this.proofingList.length===0){this.proofingList=undefined
          this.displaydownload=false
        }
        datas.forEach(element => {
          if (this.descriptonDataList.id === element.id) {
            this.attachmentTransactionList = element.attachments;
          }
        });
        if (this.matchcolumn_filter === 'Amount') {
          this.AmountMatch(event);
        }
        if (this.matchcolumn_filter === 'Description') {
          this.DescMatch(event);
        }
        if (this.matchcolumn_filter === 'ReferenceNo') {
          this.RefNoMatch(event);
        }
        if (this.matchcolumn_filter === 'UserReference') {
          this.UserRefNoMatch(event);
        }
        if (this.matchcolumn_filter === 'Credit') {
          this.CreditMatch(event);
        }
      });
     
  }

  private get_Label() {
    this.proofingService.getLabel()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.LabelList = datas;
      })
  }

  onCheckboxChange(item: any, event: any) {
    let checked = event.currentTarget.checked;
    // console.log("id=>",item.label.id)

    if (item.label) {
      if (this.PartillyMappedId !== undefined && this.PartillyMappedId !== item.label.id) {
        // debugger;
        item.selected = false;
        this.notification.showWarning("Invalid RefNo selection!");
        return false;
      }
      if (checked === false && this.PartillyMappedId === item.label.id) {
        this.PartillyMappedId = undefined;
      }
      if (checked === true) {
        this.PartillyMappedId = item.label.id;
      }

    }

    if (checked) {
      this.checkedItems.push(item.id);
      this.selectedList.push(item);
      console.log("check=>",this.checkedItems,this.selectedList)
      if (item.type === "Credit") {
        this.noofCredit = this.noofCredit + 1;
        this.sumofCredit = +this.sumofCredit + +item.amount;
      }
      if (item.type === "Debit") {
        this.noofDebit = this.noofDebit + 1;
        this.sumofDebit = +this.sumofDebit + +item.amount;
      }
    } else {

      let index = this.checkedItems.indexOf(item.id);
      if (index !== -1) this.checkedItems.splice(index, 1);
      let index1 = this.selectedList.indexOf(item);
      if (index1 !== -1) this.selectedList.splice(index1, 1);
      console.log("deselect=>",this.checkedItems,this.selectedList)

      if (item.type === "Credit") {
        this.noofCredit = this.noofCredit - 1;
        this.sumofCredit = +this.sumofCredit - +item.amount;
      }
      if (item.type === "Debit") {
        this.noofDebit = this.noofDebit - 1;
        this.sumofDebit = +this.sumofDebit - +item.amount;
      }
    }
    if (this.noofCredit > 0 || this.noofDebit > 0) {
      this.ShowMappingFlag = true;
    } else {
      this.ShowMappingFlag = false;
    }
    if (this.sumofDebit === this.sumofCredit) {
      this.ShowMatchedFlag = true;
    } else {
      this.ShowMatchedFlag = false;
    }
  }

  OnFilterChange(e) {
    if (e.isUserInput == true) {
      this.Filtertype = e.source.value;
    }
  }
  OnBalanceFilterChange(e) {
    if (e.isUserInput == true) {
      this.BalanceFiltertype = e.source.value;
    }
  }
  OnSortTypeChange(e) {
    if (e.isUserInput == true) {
      this.sorttype_filter1 = e.source.value;
    }
  }
  OnMatchColumnChange(e) {
    if (e.isUserInput == true) {
      this.matchcolumn_filter = e.source.value;
    }
  }
  selectedaccountlist
  selectedtransactionmap
  selectedsortvalue
  selectmatchcolum
  selsectsorttypeitem
  
  // @ViewChild('selectedElement') selectDropdown: MatSelect;
  ClearAll(e) {
    console.log("datas=>",e)
    this.fromdate.reset()
    this.todate.reset()
    this.from_Date=''
    this.to_Date=''
    this.accountid=''
    this.selectedaccountlist=''
    this.selectedtransactionmap=''
    this.selectedsortvalue=''
    this.selectmatchcolum=''
    this.selsectsorttypeitem=''
    
    // console.log("clear=>",this.selectDropdown)
    this.ProofingList_Desc = [];
    this.colorarray = [];
    this.knockoffList = [];
    this.proofingList = [];
    this.checkedItems = [];
    this.noofCredit = 0;
    this.noofDebit = 0;
    this.sumofCredit = 0;
    this.sumofDebit = 0;
    this.ShowMappingFlag = false;
    this.ShowMatchedFlag = false;
    this.selectedList = [];
    this.Filtertype = 'All';
    this.BalanceFiltertype = 'All'
    this.sortby_filter1 = 'Date'
    this.sorttype_filter1 = 'Ascending'
    this.matchcolumn_filter = 'All'
  }
  OnSortByChange(e) {
    if (e.isUserInput == true) {
      this.sortby_filter1 = e.source.value;
    }
  }
  OnSortTypeChange2(e) {
    if (e.isUserInput == true) {
      this.sorttype_filter2 = e.source.value;
    }
  }
  OnSortByChange2(e) {
    if (e.isUserInput == true) {
      this.sortby_filter2 = e.source.value;
    }
  }

  OnlabelClick(item: any, event) {
    this.RemarksLabelid = item.label.id;
    this.RemarksRefNo = item.label.labelname;
  }
  OnUnMap2(item: any, event) {
    let UncheckedItems: any = [];
    UncheckedItems.push(item.id);
    let p_json: any = [];
    let x = JSON.stringify(UncheckedItems)
    p_json["transaction_id"] = JSON.parse(x)
    this.finaljson = JSON.stringify(Object.assign({}, p_json));
    this.proofingService.mapLabelToProofData(this.finaljson, item.label.id, 'Remove')
      .subscribe(res => {
        let fromdate = this.fromDatechange(this.from_Date)
        let todate = this.toDatechange(this.to_Date)
        this.setProofSearch();
        this.proofingService.getProofingdata(this.finaljson, this.accountid)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.colorarray = [];
            this.proofingList = datas;
            if (this.proofingList.length===0){this.proofingList=undefined}
            
            if (this.matchcolumn_filter === 'Amount') {
              this.AmountMatch(event);
            }
            if (this.matchcolumn_filter === 'Description') {
              this.DescMatch(event);
            }
            if (this.matchcolumn_filter === 'ReferenceNo') {
              this.RefNoMatch(event);
            }
            if (this.matchcolumn_filter === 'UserReference') {
              this.UserRefNoMatch(event);
            }
            if (this.matchcolumn_filter === 'Credit') {
              this.CreditMatch(event);
            }
            this.proofingService.proofingLabelSort(fromdate, todate, this.BalanceFiltertype, this.accountid)
              .subscribe((response: any) => {
                let data = response['data'];
                for (let i = 0; i < data.length; i++) {
                  data[i].label = Object.keys(data[i])[0]
                }
                let knockoffList1 = data;
                this.knockoffList = knockoffList1.filter(trandata => trandata.label !== 'Unassigned_Data');
              });

            this.notification.showSuccess("Unmapped!")
          });
        return true
      });
  }

  OnUnMap(item: any, event) {
    let UncheckedItems: any = [];
    UncheckedItems.push(item.id);
    let p_json: any = [];
    let x = JSON.stringify(UncheckedItems)
    p_json["transaction_id"] = JSON.parse(x)
    this.finaljson = JSON.stringify(Object.assign({}, p_json));
    this.proofingService.mapLabelToProofData(this.finaljson, item.label.id, 'Remove')
      .subscribe(res => {
        let fromdate = this.fromDatechange(this.from_Date)
        let todate = this.toDatechange(this.to_Date)
        this.setProofSearch();
        this.proofingService.getProofingdata(this.finaljson, this.accountid)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.colorarray = [];
            this.proofingList = datas;
            if (this.proofingList.length===0){this.proofingList=undefined}
            if (this.matchcolumn_filter === 'Amount') {
              this.AmountMatch(event);
            }
            if (this.matchcolumn_filter === 'Description') {
              this.DescMatch(event);
            }
            if (this.matchcolumn_filter === 'ReferenceNo') {
              this.RefNoMatch(event);
            }
            if (this.matchcolumn_filter === 'UserReference') {
              this.UserRefNoMatch(event);
            }
            if (this.matchcolumn_filter === 'Credit') {
              this.CreditMatch(event);
            }

            this.proofingService.proofingLabelSort(fromdate, todate, this.BalanceFiltertype, this.accountid)
              .subscribe((response: any) => {
                let data = response['data'];
                for (let i = 0; i < data.length; i++) {
                  data[i].label = Object.keys(data[i])[0]
                }
                let knockoffList1 = data;
                this.knockoffList = knockoffList1.filter(trandata => trandata.label !== 'Unassigned_Data');
              });

            this.notification.showSuccess("Unmapped!")
          });
        return true
      });


  }

  AddRefNo($event) {
    if (this.noofCredit <= 0) {
      this.notification.showWarning("No credit in your selection!");
      return false;
    }
    // if (this.noofDebit <= 0) {
    //   this.notification.showWarning("No debit in your selection!");
    //   return false;
    // }
    if (this.remarks === undefined) {
      this.notification.showWarning("Remarks can not be empty!");
      return false;
    }
    if ( this.PartillyMappedId === undefined && this.refno === undefined) {
      this.notification.showWarning("RefNo can not be empty!");
      return false;
    }

    let p_json: any = [];    if (this.checkedItems.length !== 0) {

      let x = JSON.stringify(this.checkedItems)
      p_json["transaction_id"] = JSON.parse(x);
      console.log("sumofCredit=>",this.sumofCredit)
     
        if (this.refno !== undefined) { p_json["labelcolor"] = this.refno; }
      
      p_json["description"] = this.remarks;
    }

    this.finaljson = JSON.stringify(Object.assign({}, p_json));
    let maptype: any;
    if (this.PartillyMappedId !== undefined) {
      maptype = 'Assgin'
    }
    else {
      maptype = 'FullyMap'
    }
    console.log("final=>",this.finaljson)
    this.proofingService.mapLabelToProofData(this.finaljson, this.PartillyMappedId, maptype)
      .subscribe(res => {
        let fromdate = this.fromDatechange(this.from_Date)
        let todate = this.toDatechange(this.to_Date)
        this.setProofSearch();
        this.proofingService.getProofingdata(this.finaljson, this.accountid)
          .subscribe((results: any[]) => {
            let datas = results["data"];
            this.colorarray = [];
            this.proofingList = datas;
            if (this.proofingList.length===0){this.proofingList=undefined}
            if (this.matchcolumn_filter === 'Amount') {
              this.AmountMatch(event);
            }
            if (this.matchcolumn_filter === 'Description') {
              this.DescMatch(event);
            }
            if (this.matchcolumn_filter === 'ReferenceNo') {
              this.RefNoMatch(event);
            }
            if (this.matchcolumn_filter === 'UserReference') {
              this.UserRefNoMatch(event);
            }
            if (this.matchcolumn_filter === 'Credit') {
              this.CreditMatch(event);
            }
            this.SpinnerService.show();

            this.proofingService.proofingLabelSort(fromdate, todate, this.BalanceFiltertype, this.accountid)
              .subscribe((response: any) => {
    this.SpinnerService.hide();

                let data = response['data'];
                for (let i = 0; i < data.length; i++) {
                  data[i].label = Object.keys(data[i])[0]
                }
                let knockoffList1 = data;
                this.knockoffList = knockoffList1.filter(trandata => trandata.label !== 'Unassigned_Data');
              });
            this.checkedItems = [];
            this.noofCredit = 0;
            this.noofDebit = 0;
            this.sumofCredit = 0;
            this.sumofDebit = 0;
            this.ShowMappingFlag = false;
            this.selectedList = [];
            this.PartillyMappedId = undefined;
            this.notification.showSuccess("Mapped!")
          });

        return true
      }, error => {
       
        this.SpinnerService.hide();
      });


  } // End of AddRefNo($event)
  KnockOff($event) {
    
    this.knock();
    
  }

  fromDatechange(date: string) {
    this.from_Date = date
    this.from_Date = this.datePipe.transform(this.from_Date, 'yyyy-MM-dd');
    return this.from_Date;
  }

  toDatechange(date: string) {
    this.to_Date = date
    this.to_Date = this.datePipe.transform(this.to_Date, 'yyyy-MM-dd');
    return this.to_Date;
  }
  setProofSearch() {

    let fromdate = this.fromDatechange(this.from_Date)
    let todate = this.toDatechange(this.to_Date)

    let p_json: any = [];
    p_json["fromdate"] = fromdate
    p_json["todate"] = todate
    if (this.knockForm.value.branch_s) {
      p_json["txn_branch"] = this.knockForm.value.branch_s
    }
    if (this.knockForm.value.userid_s) {
      p_json["user_id"] = this.knockForm.value.userid_s
    }
    if (this.knockForm.value.userreference_s) {
      p_json["user_ref"] = this.knockForm.value.userreference_s
    }
    if (this.knockForm.value.referenceno_s) {
      p_json["reference_no"] = this.knockForm.value.referenceno_s
    }
    if (this.knockForm.value.description_s) {
      p_json["description"] = this.knockForm.value.description_s
    }
    if (this.knockForm.value.debit_s) {
      p_json["debit"] = this.knockForm.value.debit_s
    }
    if (this.knockForm.value.credit_s) {
      p_json["credit"] = this.knockForm.value.credit_s
    }
    if (this.knockForm.value.refno_s) {
      p_json["label_name"] = this.knockForm.value.refno_s
    }
    if (this.Filtertype) {
      p_json["type"] = this.Filtertype
    }
    if (this.sortby_filter1) {
      p_json["value"] = this.sortby_filter1
    }
    if (this.sorttype_filter1) {
      p_json["sort_by"] = this.sorttype_filter1
    }

    this.finaljson = JSON.stringify(Object.assign({}, p_json));
  }
  knock() {
    if(this.from_Date=='' || this.from_Date==null || this.from_Date==undefined){
      this.notification.showWarning("Please Choose The From Date ");
      return false;
    }
    if(this.to_Date=='' || this.to_Date==null || this.to_Date==undefined){
      this.notification.showWarning("Please Choose The To Date ");
      return false;
    }
    if (this.accountid === undefined || this.accountid=='' || this.accountid ==null) {
      this.notification.showWarning("Invalid AccountNo selection!");
      return false;
    }
    console.log("this.finaljson",this.finaljson)
    let fromdate = this.fromDatechange(this.from_Date)
    let todate = this.toDatechange(this.to_Date)
    this.setProofSearch();
    this.get_Proofingdata(this.finaljson, this.accountid)
    this.SpinnerService.show();

    this.proofingService.proofingLabelSort(fromdate, todate, this.BalanceFiltertype, this.accountid)
      .subscribe((response: any) => {
        this.SpinnerService.hide();

        let data = response['data'];
        for (let i = 0; i < data.length; i++) {
          data[i].label = Object.keys(data[i])[0]
        }
        
        let knockoffList1 = data;
        this.knockoffList = knockoffList1.filter(trandata => trandata.label !== 'Unassigned_Data');

      }, error => {
        this.SpinnerService.hide();
      })
  }
  isEnabledcheckbox(data) {
    const index = this.checkedItems.indexOf(data.id);
    // let foundid = this.checkedItems.filter(item => item.id == data.id);
    if (index >= 0) {
      data.selected = true;
    }
  }
  canbeChecked(data) {
    if (data.label === null) {
      return true
    }
    if (data.label.isdefault === false) {
      return true
    }
    return false
  }

  selectAll(event) {
    let checked = event.currentTarget.checked;
    this.proofingList.forEach((item) => {
      item.selected = checked
      if (item.label === null && checked === true) {
        this.ShowMappingFlag = true;
        this.selectedList.push(item)
        if (item.type === "Credit") {
          this.noofCredit = this.noofCredit + 1;
          this.sumofCredit = +this.sumofCredit + +item.amount;
        }
        else if (item.type === "Debit") {
          this.noofDebit = this.noofDebit + 1;
          this.sumofDebit = +this.sumofDebit + +item.amount;
        }
      } else if (checked === false) {
        this.ShowMappingFlag = false;
        this.selectedList.forEach((element, j) => {
          if (item.id === element.id) {
            this.selectedList.splice(j, 1)
            if (item.type === "Credit") {
              this.noofCredit = this.noofCredit - 1;
              this.sumofCredit = +this.sumofCredit - +item.amount;
            }
            else if (item.type === "Debit") {
              this.noofDebit = this.noofDebit - 1;
              this.sumofDebit = +this.sumofDebit - +item.amount;
            }
          }
        });
      }
      if (this.sumofDebit === this.sumofCredit) {
        this.ShowMatchedFlag = true;
      } else {
        this.ShowMatchedFlag = false;
      }
    });
  }

  user_Description() {
    this.proofingService.userDescription(this.tableid, this.userDescription.value)
      .subscribe(res => {
        this.notification.showSuccess(res.message)
        this.get_Proofingdata(this.finaljson, this.accountid)
        this.userDescription.reset()
        this.closebutton.nativeElement.click();
      }
      )
  }

  tableId(data) {
    this.descriptonDataList = data;
    this.attachmentTransactionList = data.attachments;
    this.tableid = data.id
    // console.log("ss", data)
    // console.log("trabas", this.tableid)

  }

  uploadTransactionImages(e) {
    this.transactionFile = e.target.files;
    const formData = new FormData();
    for (var i = 0; i < this.transactionFile.length; i++) {
      formData.append("file", this.transactionFile[i]);
    }
    this.proofingService.uploadTransactionImages(this.tableid, formData)
      .subscribe(res => {
        this.notification.showSuccess("Upload Successfully..")
        this.get_Proofingdata(this.finaljson, this.accountid)
        this.userDescription.reset();
        return true
      })

  }
  transactionDownload(id, file_name) {
    this.proofingService.transactionDownload(id)
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file_name;
        link.click();
      })
  }

  lableTableId(id, data) {
    this.labelTableId = id;
    this.labeldatas = data.label
    this.lableDataList = data["3"].transaction
    this.attachmentLabelList = data['3'].attachments
    // console.log("lala", this.labeldatas);
    // console.log("lal2", this.lableDataList);
    // console.log("lal3", this.attachmentLabelList);
    // console.log("lable1", data)

  }
  uploadLabelImages(e) {
    this.labelFile = e.target.files;
    const formData = new FormData();
    for (var i = 0; i < this.labelFile.length; i++) {
      formData.append("file", this.labelFile[i]);
    }
    this.proofingService.uploadLabelImages(this.labelTableId, formData)
      .subscribe(res => {
        this.notification.showSuccess("Upload SuccessFully!...")
        this.labelTransactionImages.reset();
        let fromdate = this.fromDatechange(this.from_Date)
        let todate = this.toDatechange(this.to_Date)
        this.proofingService.proofingLabelSort(fromdate, todate, this.BalanceFiltertype, this.accountid)
          .subscribe((response: any) => {
            let data = response['data'];
            for (let i = 0; i < data.length; i++) {
              data[i].label = Object.keys(data[i])[0]
            }
            let knockoffList1 = data;
            data.forEach(element => {
              if (this.labeldatas === element.label) {
                this.attachmentLabelList = data[2]['3'].attachments;
                // console.log("LSSaaaaa", this.labeldatas);
                // console.log(">>>", this.attachmentLabelList)
              }
            });
            this.knockoffList = knockoffList1.filter(trandata => trandata.label !== 'Unassigned_Data');
          });
        return true;

      })
  }


  labelDownload(id, file_name) {
    this.proofingService.labelDownload(id)
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file_name;
        link.click();
      })
  }
  displaydownload:boolean=false
  downloadexlsearch(){
    let name =  'Proofing Map'

    this.proofingService.transactiondownload(this.accountid,this.finaljson)
    .subscribe((data: any) => {
      
      
          let binaryData = [];
          binaryData.push(data)
          let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
          let link = document.createElement('a');
          link.href = downloadUrl;
          link.download = name + ".xlsx";
          link.click();
    })
  }
}
