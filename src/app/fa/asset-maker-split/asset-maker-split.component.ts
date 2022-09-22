import { Component, OnInit, Inject, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service'
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-asset-maker-split',
  templateUrl: './asset-maker-split.component.html',
  styleUrls: ['./asset-maker-split.component.scss']
})
export class AssetMakerSplitComponent implements OnInit {
  @ViewChild('myInput') myInput: ElementRef;
  @ViewChild('closeModal') private closeModal: ElementRef;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  assetcatlist: Array<any>
  isassetmaker: boolean
  isassetbuk: boolean
  isinvoice: boolean
  isassetwbuk: boolean
  has_nextasset = true;
  has_previousasset = true;
  // currentpage: number = 1;
  presentpageasset: number = 1;
  a: number
  // formsArray = [''];
  view: String = "sa"
  ismakerCheckerButton: boolean;
  has_nextwbuk = true;
  has_previouswbuk = true;
  presentpagewbuk: number = 1;
  count: number = 0;
  errorMessage = "aaa"
  has_nextbuk = true;
  has_previousbuk = true;
  presentpagebuk: number = 1;
  pageSize = 10;
  public split: number;
  isin: boolean = false;
  selectedFormGroup: FormGroup = null;

  issubmit: boolean = true;
  // myForm:FormGroup;
  asset: any
  display = 'none';



  myForm = new FormArray([]);
  total = 100;
  form: FormGroup;




  constructor(private notification: NotificationService, private router: Router
    , private Faservice: faservice,
    private toastr: ToastrService, private share: faShareService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.myForm.valueChanges.subscribe(value => {
      let checkValid = this.isValidTotal();
      // this.isValidTotal();
      // this.showError();
      if (!checkValid) {
        this.showError();
      }
      // let checkbox = this.check();
      // if (checkbox) this.saveBtn();




    });




    this.get()
    this.getassetmakersplitsummary();
    this.addRow();
    this.showError()

  }


  addRow() {
    const group = new FormGroup({
      value: new FormControl("", [Validators.required]),
      branchname: new FormControl("", [Validators.required]),
      locname: new FormControl("", [Validators.required]),
      bsname: new FormControl("", [Validators.required]),
      ccname: new FormControl("", [Validators.required]),
    });
    this.myForm.push(group);
  }


  // isValidFormControl(formGroup, controlName) {
  //   var ctrl = formGroup && formGroup.controls[controlName];
  //   return ctrl.status && ctrl.errors;
  // }

  // isInValidFormControl(formGroup, controlName) {
  //   var ctrl = formGroup && formGroup.controls[controlName];
  //   return ctrl && ctrl.touched && ctrl.status === "INVALID" && ctrl.errors;
  // }
  aa: any;
  isValidTotal() {
    var values = this.myForm.controls.map((x) =>
      x ? Number(x.value.value) : 0
    );
    let sumTotal = values.reduce((a, b) => a + b);
    this.aa = this.split === sumTotal;

    return sumTotal < this.split;
  }

  // isValidTotal() {
  //   var values = this.myForm.controls.map((x) =>
  //     x ? Number(x.value.value) : 0
  //   );
  //   let sumTotal = values.reduce((a, b) => a + b);
  //   this.aa = this.split === sumTotal; 
  //   if (sumTotal < this.split){
  //     this.showError()
  //   }

  // return true
  // }
  sh: number
  openForm(form: FormGroup) {
    this.selectedFormGroup = form;
    console.log(this.selectedFormGroup);
    this.sh = this.selectedFormGroup.value.value
  }

  validate(): void {
    const checkedCount = this.assetcatlist.filter(item => item.isTicked).length
    const checkedCounts = this.assetcatlist.filter(item => item.isDisabled).length
    const checkedCountss = checkedCount - checkedCounts
    // var selectedItemsCount = this.assetcatlist.filter((x) => x.isTicked).length;
    if (checkedCountss > this.sh) {

      this.toastr.error(
        `More Checkboxes enabled.Total checkbox enabled is ${checkedCountss}`,
        "Total Error",
        {
          timeOut: 3000
        }
      );
    }
  }

  showError() {
    var values = this.myForm.controls.map((x) =>
      x ? Number(x.value.value) : 0
    );
    let sumTotal = values.reduce((a, b) => a + b);

    if (sumTotal > this.split) {
      this.toastr.error(
        `Your Values Sum is greater than your total ${this.split}`,
        "Total Error",
        { timeOut: 3000 }
      );
      return false;

    }
  }
  totals: boolean;




  getassetmakersplitsummary(pageNumber = 1, pageSize = 10) {
    this.Faservice.getassetcategorysummary(pageNumber, pageSize)
      .subscribe((result) => {
        console.log("split", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetcatlist = datass;
        console.log("split", this.assetcatlist)
        if (this.assetcatlist.length >= 0) {
          this.has_nextasset = datapagination.has_next;
          this.has_previousasset = datapagination.has_previous;
          this.presentpageasset = datapagination.index;
        }

      })

  }

  nextClick() {

    if (this.has_nextasset === true) {

      this.getassetmakersplitsummary(this.presentpageasset + 1, 10)

    }
  }

  previousClick() {

    if (this.has_previousasset === true) {

      this.getassetmakersplitsummary(this.presentpageasset - 1, 10)

    }
  }




  invoiceBtn() {
    this.isinvoice = true;
  }

  get() {
    this.split = this.share.quantity.value;
    console.log("aaa", this.split)

  }



  BackBtn() {
    this.router.navigate(['/fa/assetmakeradd'], { skipLocationChange: true })
  }



  DelBtn(index: number) {
    this.myForm.removeAt(index);
  }



  addCheckValue(index) {
    this.assetcatlist[index].isTicked = !this.assetcatlist[index].isTicked;
  }

  c: number = 0
  saveBtn() {
    // const checkedCount = this.assetcatlist.filter(item => item.isTicked).length
    // const checkedCounts = this.assetcatlist.filter(item => item.isDisabled).length
    // const checkedCountss= checkedCount-checkedCounts

    // if(checkedCountss-this.c > this.sh) {
    //    this.toastr.error(
    //       `More cheeckboxes enabled.Total checkbox enabled is ${checkedCountss }`,
    //       "Total Error",
    //       { timeOut: 3000 });
    //       return false;

    // }
    this.assetcatlist = this.assetcatlist.map(e => {
      if (e.isTicked === true) {
        e.isDisabled = true;
        // this.c=this.c+1
        this.onSubmit.emit();



      }
      // this.closeModal.nativeElement.click();    

      return e;


    });


    console.log(this.assetcatlist);

    // this.closeModal.nativeElement.click();    


  }

  // check(){
  //   const checkedCount = this.assetcatlist.filter(item => item.isTicked).length;

  //   return checkedCount > this.sh
  // }


}



