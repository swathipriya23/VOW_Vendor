import { Component, OnInit , Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { AtmaService } from '../atma.service'
import { NotificationService } from '../notification.service'
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
export interface categiry{
  id:string;
  name:string;
}
@Component({
  selector: 'app-producttype',
  templateUrl: './producttype.component.html',
  styleUrls: ['./producttype.component.scss']
})
export class ProducttypeComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  producttypeForm: FormGroup
  productcategoryList: Array<any>;
  // isLoading:boolean=false;
  isLoading:boolean;
  constructor(private fb: FormBuilder,private router: Router,
    private atmaService: AtmaService,private notification: NotificationService,private toastr: ToastrService) { }

    ngOnInit(): void {
      this.producttypeForm = this.fb.group({
        //code: ['', Validators.required],
        name: ['', Validators.required],
        productcategory_id: ['', Validators.required],
       
        
      })
      this.getproductcategory();
      this.producttypeForm.get('productcategory_id').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(()=>{
          this.isLoading=true;
        }),
        switchMap(value=>this.atmaService.getproductcategory().pipe(
          finalize(()=>{
            this.isLoading=false;
          })
        ))
      ).subscribe(data=>{
        this.productcategoryList=data['data'];
      })
    }


    private getproductcategory() {
      this.atmaService.getproductcategory()
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.productcategoryList = datas;
          console.log("product", datas)
    
        }, error => {
          return Observable.throw(error);
        })
    }
    public categoryinterface(data:categiry):string|undefined{
      return data?data.name:undefined;
    }
    producttypeCreateForm(){

      if (this.producttypeForm.value.name.trim()===""){
        this.toastr.error('Add name Field','Empty value inserted' ,{timeOut: 1500});
        // this.onCancel.emit()
        return false;
      }
      if (this.producttypeForm.value.name.trim().length > 20){
        this.toastr.error('Dont Enter more than 20 characters','Limited characters allowed' ,{timeOut: 1500});
        // this.onCancel.emit()
        return false;
      }
      if (this.producttypeForm.value.productcategory_id===""){
        this.toastr.error('Add productcategory Field','Empty value inserted' ,{timeOut: 1500});
        // this.onCancel.emit()
        return false;
      }
      let data = this.producttypeForm.value
      data.productcategory_id=this.producttypeForm.value.productcategory_id.id;
      this.atmaService.producttypeCreateForm(data)
        .subscribe(res => {
  
         if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
            this.notification.showError("INVALID_DATA!...")
          }
          else if(res.code === "INVALID_DATA" && res.description === "Duplicate Name"){
            this.notification.showWarning("Duplicate Data! ...")
          } else {
            this.notification.showSuccess("Saved Successfully!...")
            this.onSubmit.emit();
          }
          
          // console.log("Apcategory", res)
          // this.notification.showSuccess("Added Successfully!...")
          // this.onSubmit.emit();
          return true
          })
    }
  
    onCancelClick() {
      this.onCancel.emit()
    }
  
  }
  
  


