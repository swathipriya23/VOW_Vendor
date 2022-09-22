import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { faservice } from '../fa.service';
import { faShareService } from '../share.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';


export interface BRANCH {
  name: string;
  id: string;
  
}
@Component({
  selector: 'app-assetlocation',
  templateUrl: './assetlocation.component.html',
  styleUrls: ['./assetlocation.component.scss']
})
export class AssetlocationComponent implements OnInit {
  [x: string]: any;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  assetcatlist: Array<any>
  list: string[] = [];
  SubcatSearchForm: FormGroup;
  updateForm:FormGroup;
  locationdata=false
 
  presentpageasset: number = 1;
  isassetlocation: boolean
  
  has_nextloc = true;
  has_previousloc = true;
  presentpageloc: number = 1;
  pageSize = 10;
  depform: FormGroup
  assetlocationform: FormGroup
    isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  branchdata: any;
  myControl = new FormControl();
  assetloclist=[];

  constructor(private fb: FormBuilder, private notification: NotificationService, private router: Router
    , private Faservice: faservice, private FaShareService: faShareService,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.assetlocationform = this.fb.group({

      reftablegid: ['', Validators.required],
      name: ['', Validators.required],

      floor: ['', Validators.required],
      refgid: ['', Validators.required],
      remarks: ['', Validators.required],
      branch_id:['']



    })
    this.getassetlocationsummary()
  }

  getassetlocationsummary(pageNumber = 1, pageSize = 10) {
    this.Faservice.getassetlocationdata(pageNumber)
      .subscribe((result) => {
        console.log("landlord", result)
        let datass = result['data'];
        let datapagination = result["pagination"];
        this.assetloclist = datass;
        console.log("landlord", this.assetloclist)
        if (this.assetloclist.length >= 0) {
          this.has_nextloc = datapagination.has_next;
          this.has_previousloc = datapagination.has_previous;
          this.presentpageloc = datapagination.index;
        }

      })

  }


  locnextClick() {

    if (this.has_nextloc === true) {
      // this.currentpage= this.presentpage + 1
      this.getassetlocationsummary(this.presentpageloc + 1, 10)

    }
  }

  locpreviousClick() {

    if (this.has_previousloc === true) {
      // this.currentpage= this.presentpage - 1
      this.getassetlocationsummary(this.presentpageloc - 1, 10)

    }
  }

  assetlocationCreateForm() {
    if (this.assetlocationform.value.branch_id === "") {
      this.toastr.error('Add Branch ', 'Empty value inserted', { timeOut: 1500 });
      return false;
    }
    if (this.assetlocationform.value.name === "") {
      this.toastr.error('Add Location name ', 'Empty value inserted', { timeOut: 1500 });
      return false;
    }
    if (this.assetlocationform.value.floor === "") {
      this.toastr.error('Add Floor name', 'Empty value inserted', { timeOut: 1500 });
      return false;
    }
    // if (this.assetlocationform.value.refgid === "") {
    //   this.toastr.error('Add Refgid Field', 'Empty value inserted', { timeOut: 1500 });
    //   return false;
    // }




    
    this.assetlocationform.value.branch_id=this.assetlocationform.value.branch_id.id
    let data = this.assetlocationform.value
    this.Faservice.assetlocCreateForm(data)
      .subscribe(res => {

        if(res){
        this.notification.showSuccess("Saved Successfully!...")
       
        this.router.navigate(['/famaster'], { skipLocationChange: true })

          this.assetlocationform.reset()
          this.getassetlocationsummary();

        return true}else{
          this.notification.showSuccess("Failed")
          this.assetlocationform.reset()
          this.getassetlocationsummary();

        }
      })


  }


  onCancelClick() {
    this.router.navigate(['/famaster'], { skipLocationChange: true })


  }


  branchget() {
    let bs: String = "";
    this.getbranch(bs);
  
    this.assetlocationform.get('branch_id').valueChanges
    .pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        // console.log('inside tap')
  
      }),
      switchMap(value => this.Faservice.search_employeebranch(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
  
      .subscribe((results: any[]) => {
        this.branchdata = results["data"];
       
      })
  }
  
  getbranch(val){
    this.Faservice.search_employeebranch(val).subscribe((results: any[]) => {
      this.branchdata = results["data"];
     
    })
  
  }
  public displayFnbranch(_branchval?: BRANCH): string | undefined {
    return _branchval ? _branchval.name : undefined;
  }
  
  
  
  // branchend
  
  assetlocation(){
    this.locationdata=true;}

    findDetails(data) {
      console.log('n',data)
      return data
    }

}
