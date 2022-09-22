import { Component, OnInit, Output, ViewChild,EventEmitter, ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import { Observable, fromEvent, } from 'rxjs'
import { masterService } from '../master.service'
import { ShareService } from '../share.service'
import { NotificationService } from '../../service/notification.service'
import { SharedService } from '../../service/shared.service'
import { DataService } from '../../service/data.service'
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, FormGroupDirective } from '@angular/forms';
import { Department, MemoService } from '../../service/memo.service'
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { COMMA, D, ENTER } from '@angular/cdk/keycodes';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

export interface iEmployeeList {
  full_name: string;
  id: number;
}
export interface DepartmentList {
  name: string;
  id: number;
}
export interface iEmployeeSummaryList {
  full_name: string;
  id: number;
}
export interface bslistss {
  id: string;
  name: string;
}
export interface cclistss {
  id: string;
  name: string;
}
export interface Emplistss {
  id: string;
  full_name: string;
}
export interface comlistss {
  id: string;
  name: string;
}
export interface bslistss {
  id: string;
  name: string;
}
export interface cclistss {
  id: string;
  name: string;
}
export interface catlistss {
  id: string;
  name: string;
}
export interface prodlistss {
  id: string;
  name: any;
}
@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})

export class MasterComponent implements OnInit {
  commoditySearchForm: FormGroup;
  delmatSearchForm: FormGroup;
  delmatapprovalSearchForm: FormGroup;
  productSearchForm: FormGroup;

  prpomasterList: any
  urls: string;
  urlcommodity;
  urldelmatmaker;
  urldelmatapprover;
  ismakerCheckerButton: boolean;
  roleValues: string;
  addFormBtn: any;

  isCommodity: boolean;
  isCommodityForm: boolean;
  isDelmatMakers: boolean;
  isDelmatMakerForm: boolean;
  isDelmatApproval: boolean;

  approvalForm: FormGroup
  rejectForm: FormGroup
  riskForm: FormGroup

  editApcatPopup: boolean;
  editApsubcatPopup: boolean;

  isdelmatappPagination: boolean;
  delmatappnodatafound: boolean

  presentpagecom: number = 1;
  has_nextcom = true;
  has_previouscom = true;

  presentpagedel: number = 1;
  has_nextdel = true;
  has_previousdel = true;

  presentpagedelapp: number = 1;
  has_nextdelapp = true;
  has_previousdelapp = true;
  frmData :any= new FormData();
  pageSize = 10;

  commodityList: any;
  delmatList: Array<any>=[];
  delmatappList: any;
  prodList: any;

  isLoading = false;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  dcurrentpage: number = 1;
  ccurrentpage: number = 1;
  pcurrentpage: number = 1;
  nodata = false
  name: string;
  no: string;
  code: string;

  employeeList: Array<Emplistss>;
  employee_id = new FormControl();

  commodityLists: Array<comlistss>;
  commodity_id = new FormControl();

  productList: prodlistss[];
  public chipSelectedprod: prodlistss[] = [];
  public chipSelectedprodid = [];
  product_id = new FormControl();
  glsearchform:any=FormGroup;
  appVersionForm:any=FormGroup;
  delmattypeList: Array<any>;
  isdelmatappnodatafound: boolean;
  first=false;
  second:boolean=false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @ViewChild('fileInput') frmdata:FormData;
  @ViewChild('exampleModal') public exampleModal: ElementRef;
  @ViewChild('exampleModals') public exampleModals: ElementRef;
  
  @ViewChild('emp') matempAutocomplete: MatAutocomplete;
  @ViewChild('empInput') empInput: any;
  @ViewChild('com') matcomAutocomplete: MatAutocomplete;
  @ViewChild('comInput') comInput: any;

  @ViewChild('empapproval') matempappAutocomplete: MatAutocomplete;
  @ViewChild('empappInput') empappInput: any;
  @ViewChild('comapproval') matcomappAutocomplete: MatAutocomplete;
  @ViewChild('comappInput') comappInput: any;


  @ViewChild('prod') matprodAutocomplete: MatAutocomplete;
  @ViewChild('prodInput') prodInput: any;


  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;


  assetlist = [{ 'id': '1', 'name': '1', 'show': 'Yes' },
  { 'id': '2', 'name': '0', 'show': 'No' }]
  gstblockedlist = [{ 'id': '1', 'show': 'Yes', 'name': '1' },
  { 'id': '2', 'show': 'No', 'name': '0' }]
  gstrcmlist = [{ 'id': '1', 'show': 'Yes', 'name': '1' },
  { 'id': '2', 'show': 'No', 'name': '0' }]
  statuslist = [{ 'id': '1', 'show': 'Active', 'name': 1 },
  { 'id': '2', 'show': 'Inactive', 'name': 0 }]

  ActiveInactive = [
    { value: 0, display: 'Active' },
    { value: 1, display: 'Inactive' },
    { value: 0, display: 'All' }
  ]


  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
 
  categoryList: Array<any>
  categoryName = "";
  subcategoryName = "";
  subCategoryList: Array<any>
  channelList: Array<any>
  courierList: Array<any>
  documentList: Array<any>
  departmentList: Array<any>
  modulesList: Array<any>
  rolesList: Array<any>
  templateList: Array<any>
  accountList: Array<any>
  phas_next = false;
  phas_previous = false;
  shas_next:boolean = false;
  shas_previous:boolean = false;
  has_nextpdm = false;
  has_previouspdm = false;
  chas_next = false;
  chas_previous = false;
  dhas_next = false;
  dhas_previous = false;
  subModuleList: any;
  subModuleUrls: any;
  urlPermission: string;
  urlDepartment: string;
  urlCategory: string;
  urlSubCategory: string;
  urlEmployee: string;
  urlMoudles: string;
  urlRoles: string;
  urlState: string;
  urlPinCode: string;
  urlDistrict: string;
  urlCity: string;
  urlAppVersion: string;
  urlDesignation:string;
  urlRisk:string;
  urlClient:string;

  urlPMD: string;
  isEntity:boolean;
  isEntityEdit:boolean;
  isEntityForm:boolean;
  isPermission: boolean;
  isDesignation:boolean;
  isDesignationForm:boolean;
  isRisk:boolean;
  isRiskForm:boolean;
  riskeditform:boolean;
  isDepartment: boolean;
  isCategory: boolean;
  isSubcategory: boolean;
  isEmployee: boolean=false;
  isEmployeeform:boolean;
  isEmployeeEdit:boolean;
  isRoles: boolean;
  isModules: boolean;
  isState: boolean;
  isPinCode: boolean;
  isCity: boolean;
  isDistrict: boolean;
  isPMD: boolean;
  isGL: boolean;
  isGLform:boolean;
  urlGl:any;
  isempbank:boolean;
  isempbankform:boolean;
  isempbankedit:boolean=false;
  citysummarydata: Array<any>=[];
  districtsummaryData: Array<any>=[];
  datadistrictid:any;
  datacityid:any;
  has_nexts:boolean=false;
  has_prese:boolean=false;
  dispage:number=1;
  citypage:number=1;
  employeeId: any;
  makerNameBtn: any;
  employee: string;
  isEditMakerChekerBtn: boolean;
  url: string;
  isEmployeeViewForm: boolean;
  isDeptForm: boolean;
  AddForm: FormGroup;
  ctrldepartment = new FormControl();
  departmentList1: DepartmentList[] = [];
  departmentId: any;
  isdeptEditForm: boolean;
  isPermissionForm: boolean;
  isCategoryForm: boolean;
  isCategoryEditForm: boolean;
  isSubCategoryForm: boolean;
  isSubCategoryEditForm: boolean;
  isRolesEdit: boolean;
  isStateForm: boolean
  isDistrictForm: boolean
  isCityForm: boolean

  isPinCodeForm: boolean;
  designationeditform:boolean;
  designationform:any=FormGroup;
  designationList: Array<any>=[];
  has_designationnext:boolean;
  has_designationprevious:boolean;
  has_designationpage:number=1;
  riskList: Array<any>=[];
  has_risknext:boolean;
  has_riskprevious:boolean;
  has_riskpage:number=1;
  has_appnext:boolean;
  has_appprevious:boolean;
  has_apppage:number=1;
  sectorlist: Array<any>=[];
  has_sectornext: boolean;
  has_sectorprevious: boolean;
  has_sectorpage:number=1;
  isSector:boolean;
  isSectorform:boolean;
  isSectorEdit:boolean;
  urlSector:any;
  sectorForm:any=FormGroup;
  expForm:any=FormGroup;
  isPMDForm: boolean;
  subModuleName: string;
  rolesIndex: string;
  employeeIndex: string;
  permissionList: Array<any>;
  permisionSubList: Array<any>;
  categoryIdValue: number;
  employeeSearchId: number;
  category_sub: string;
  isExpform:boolean = false;
  isExp:boolean;
  isExpEdit:boolean;
  clientForm:any=FormGroup;
  isClientForm:boolean = false;
  isClient:boolean;
  isClientEdit:boolean;
  clientList=[];
  has_clientnext:boolean;
  has_clientprevious:boolean;
  has_clientpage:number = 1;
  urlEXP:any;
  explist: Array<any>=[];
  has_expnext:boolean;
  has_expprevious:boolean;
  has_exppage:number;
  entitylist: Array<any>=[];
  has_entitynext: boolean;
  has_entityprevious: boolean;
  has_entitypage:number=1;
  entityForm:any=FormGroup;
  urlEntity:any;
  isFinEdit:boolean;
  isFinForm:boolean;
  isFin:boolean;
  isAppVersionEdit:boolean;
  isAppVersionForm:boolean;
  isAppVersion:boolean;
  Finlist: Array<any>=[];
  has_Finnext: boolean;
  has_Finprevious: boolean;
  has_Finpage:number=1;
  // isFin:boolean;
  // isFinForm:boolean;
  // isFinEdit:boolean;
  urlFin:any;
  FinQlist: Array<any>=[];
  has_FinQnext: boolean;
  has_FinQprevious: boolean;
  has_FinQpage:number=1;
  isFinQ:boolean;
  isFinQForm:boolean;
  isFinQEdit:boolean;
  urlQFin:any;
  finForm:any=FormGroup;
  isdelmatmaker:boolean;
  urldelmaker:any;
  iscommodity:boolean;
  finquaterform:any=FormGroup;
  empbranchform:any=FormGroup;
  isEmpupload:any;
  empbranchData:Array<any>=[];
  empUploadStatus:Array<any>=[];
  empbranchnext:boolean=false;
  empbranchprevious:boolean=false;
  empbranchpage:number=1;
  Urlempobranch:any='';
  isEmpuploadnew:boolean=false;
  isEmpbranch:boolean=false;
  isEmpbranchEdit:boolean=false;
  isEMpbranchsummary:boolean=false;
  public allEmployeeList: iEmployeeList[];
  public chipSelectedEmployeeTo: iEmployeeList[] = [];
  public chipSelectedEmployeeToid = [];
  public to_emp = new FormControl();
  public totalEmployeeList: iEmployeeSummaryList[];
  public chipSelectedEmployee: iEmployeeSummaryList[] = [];
  public chipSelectedEmployeeid = [];
  public employeeControl = new FormControl();
  memoAddForm: FormGroup;
  PMDSearchForm: FormGroup;
  @ViewChild('employeeToInput') employeeToInput: any;
  @ViewChild('autoto') matToAutocomplete: MatAutocomplete;
  @ViewChild('employeeccInput') employeeccInput: any;
  @ViewChild('autocc') matAutocompleteCC: MatAutocomplete;
  @ViewChild('employeeApproverInput') employeeApproverInput: any;
  @ViewChild('autoapprover') matAutocompleteApp: MatAutocomplete;
  @ViewChild('employeeInput') employeeInput: any;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('autodept') matAutocompleteDept: MatAutocomplete;
  @ViewChild('employeeDeptInput') employeeDeptInput: any;
  permissionArray = [];
  isDepartmentView: boolean;
  employeeIdValue: any;
  stateList: Array<any>=[];
  districtList: Array<any>;
  enbaction:boolean=false;
  delmatid:any='';
  cityList: Array<any>
  pincodeList: Array<any>
  isStateEditForm: boolean;
  isDistrictEditForm: boolean;
  isPinCodeEditForm: boolean;
  isCityEditForm: boolean;
  isPMDEditForm: boolean;
  pinform: any;
  districtform: any
  cityform: any;
  sform: any;
  totalcount:any;
  isempcreate:boolean=false;
  PDMList: Array<any>;
  isPMDFormedit: boolean;
  drpdwn:any={'ACTIVE':1,'INACTIVE':0,'ALL':2};
  appdataList: any;
  images: any;
  empupload: Array<any>=[];
  urlempupload: string;
  empuploadform:any=FormGroup;
  commodityfor:FormGroup;
  yesorno = [{ 'value': 1, 'display': 'Yes' }, { 'value': 0, 'display': 'No' }]
  is_multil:boolean;
  constructor(private datepipe:DatePipe,private router: Router, private notification: NotificationService, private mastersErvice: masterService,
    private memoService: MemoService, private dataServices: DataService, private formBuilder: FormBuilder, private toastService: ToastrService,
   private shareService: ShareService, private sharedService: SharedService,private SpinnerService:NgxSpinnerService) { }

  ngOnInit(): void {
    this.empbranchform=this.formBuilder.group({
      'code':new FormControl(''),
      'name':new FormControl(''),
      'drop':new FormControl('')
    });

    this.empuploadform=this.formBuilder.group({
      'images': new FormControl(),
    });

    this.commoditySearchForm = this.formBuilder.group({
      code: "",
      name: "",
      drop:""
    })
    this.delmatSearchForm = this.formBuilder.group({
      employee_id: [''],
      commodity_id: [''],
      type: [''],
      drop:['']
    })
    this.delmatapprovalSearchForm = this.formBuilder.group({
      employee_id: [''],
      commodity_id: [''],
      type: [''],
      drop:['']
    })


    this.approvalForm = this.formBuilder.group({
      id: '',
      remarks: ''
    })
    this.rejectForm = this.formBuilder.group({
      id: '',
      remarks: ''
    })

    this.productSearchForm = this.formBuilder.group({
      commodity_id: ''
    })
    this.commodityfor = this.formBuilder.group({
      id:[''],
      name: [''],
      is_multilevel: [''],
      Approval_level:[]
    })
    /////////////delmat maker search
    let empkeyvalue: String = "";
    this.getemployeeFK(empkeyvalue);
    this.delmatSearchForm.get('employee_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          //console.log('inside tap')

        }),
        switchMap(value => this.mastersErvice.getemployeeFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;

      },(error) => {
      
      })


    let comkeyvalue: String = "";
    this.getcommodityFK(comkeyvalue);
    this.delmatSearchForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;

        }),
        switchMap(value => this.mastersErvice.getcommodityFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityLists = datas;

      },(error) => {
        
      })

    //////////////////////delmat approval
    this.getemployeeFKapp(empkeyvalue);
    this.delmatapprovalSearchForm.get('employee_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          //console.log('inside tap')

        }),
        switchMap(value => this.mastersErvice.getemployeeFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.employeeList = datas;

      },(error) => {
        // this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      })


    this.getcommodityFKapp(comkeyvalue);
    this.delmatapprovalSearchForm.get('commodity_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          //console.log('inside tap')

        }),
        switchMap(value => this.mastersErvice.getcommodityFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.commodityLists = datas;

      },(error) => {
        // this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      })




    let prodkeyvalue: String = "";
    // this.getproduct(prodkeyvalue);
    this.product_id.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.mastersErvice.getproductFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.productList = datas;
      },(error) => {
        // this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      }
      )




    this.getdelmattype();

    this.AddForm = this.formBuilder.group({
      ctrldepartment: ['', Validators.required],
    });
    this.pinform = this.formBuilder.group({
      name: ['']
    })
    this.cityform = this.formBuilder.group({
      name: ['']
    })
    this.districtform = this.formBuilder.group({
      name: ['']
    })
    this.sform = this.formBuilder.group({
      name: ['']
    })
    ////cc bs ccbs forms
    this.BSSearchForm = this.formBuilder.group({
      no: "",
      name: "",
      drop:[""]
    })
    this.CCSearchForm = this.formBuilder.group({
      no: "",
      name: "",
      drop:""
    })
    this.CCBSSearchForm = this.formBuilder.group({
      businesssegment_id: '',
      costcentre_id: '',
      name: '',
      no: '',
      drop:[""]
    });
    this.glsearchform=this.formBuilder.group({
      'name':new FormControl(''),
      'desc':new FormControl('')
    });
    this.editbss = this.formBuilder.group({
      id: '',
      code: ['', Validators.required],
      name: ['', Validators.required],
      no: ['', Validators.required],

    });
    this.designationform=this.formBuilder.group({
      'name':['',Validators.required]
    });
    this.sectorForm=this.formBuilder.group({
      'name':['',Validators.required],
      'drop':['',Validators.required]
    });
    this.expForm=this.formBuilder.group({
      'name':['',Validators.required],
      'drop':['',Validators.required]
    });
    this.entityForm=this.formBuilder.group({
      'name':['',Validators.required]
    });
    this.finForm=this.formBuilder.group({
      'year':['',Validators.required],
      'month':['',Validators.required],
      'drop':['',Validators.required]
    });
    this.finquaterform=this.formBuilder.group({
      'year':['',Validators.required],
      'month':['',Validators.required],
      'drop':['',Validators.required]
    });
    this.PMDSearchForm = this.formBuilder.group({
      branch_name:'',
      branch_code:'',
      location:'',
      drop:''
    })
    this.appVersionForm = this.formBuilder.group({
      no:'',
      remarks:'',
      drop:''
    })
    this.riskForm = this.formBuilder.group({
      'name':['',Validators.required]
    });
    this.clientForm = this.formBuilder.group({
      'code':[''],
      'name':[''],
      'drop':['']
    });
    this.sharedService.subCategoryID.subscribe(data => {
      this.categoryIdValue = data;
    })

    // this.sharedService.menuUrls.subscribe(data => {
    let datas = this.sharedService.menuUrlData;
    // console.log("MENu", datas)
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Masters") {
        this.subModuleList = subModule;
        // this.isEmployee = subModule[0].name
      } else if (element.name === "Masters") {
        this.subModuleList = subModule;
        this.isSubcategory = subModule[0].name
      } else if (element.name === "Masters") {
        this.subModuleList = subModule;
        this.isCategory = subModule[0].name
      } else if (element.name === "Masters") {
        this.subModuleList = subModule;
        this.isDepartment = subModule[0].name
      } else if (element.name === "Masters") {
        this.subModuleList = subModule;
        this.isModules = subModule[0].name
      } else if (element.name === "Masters") {
        this.subModuleList = subModule;
        this.isRoles = subModule[0].name
      } else if (element.name === "Masters") {
        this.subModuleList = subModule;
        this.isPermission = subModule[0].name
      } else if (element.name === "Masters") {
        this.subModuleList = subModule;
        this.isBS = subModule[0].name
      } else if (element.name === "Masters") {
        this.subModuleList = subModule;
        this.isCC = subModule[0].name
      } else if (element.name === "Masters") {
        this.subModuleList = subModule;
        this.isCCBS = subModule[0].name
      } else if(element.name== "Masters"){
        this.subModuleList=subModule;
        this.isDesignation=subModule[0].name;
      }
      else if(element.name== "Masters"){
        this.subModuleList=subModule;
        this.isAppVersion=subModule[0].name;
      } else if(element.name== "Masters"){
        this.subModuleList=subModule;
        this.isEmpupload=subModule[0].name;
      }
    });

    if (this.to_emp !== null) {
      this.to_emp.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.memoService.get_EmployeeList(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          let datapagination = results["pagination"];
          this.allEmployeeList = datas;
          // console.log("toemps", datas)
          if (this.allEmployeeList.length >= 0) {
            this.has_next = datapagination.has_next;
            // console.log('this.has_next', this.has_next);
            this.has_previous = datapagination.has_previous;
            this.currentpage = datapagination.index;
          }
        })
    }
    if (this.employeeControl !== null) {
      this.employeeControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.dataServices.get_EmployeeList(value, 1)
            .pipe(
              finalize(() => {
                this.isLoading = false;
              }),
            )
          )
        )
        .subscribe((results: any[]) => {
          let datas = results["data"];
          let datapagination = results["pagination"];
          this.totalEmployeeList = datas;
          // console.log("totalEmployeeList", datas)
          if (this.totalEmployeeList.length >= 0) {
            this.has_next = datapagination.has_next;
            // console.log('this.has_next', this.has_next);
            this.has_previous = datapagination.has_previous;
            this.currentpage = datapagination.index;
          }

        })
    }

    // let deptkeyvalue: String = "";
    // this.getDepartment(deptkeyvalue);
    this.AddForm.get('ctrldepartment').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.getDepartmentPage(value, 1, '')
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.departmentList1 = datas;
        let datapagination = results["pagination"];
        this.departmentList1 = datas;
        if (this.departmentList1.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      })

    ////////////////////CC BS SEARCH
    let bskeyvalue: String = "";
    this.getbsDD(bskeyvalue);
    this.CCBSSearchForm.get('businesssegment_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.mastersErvice.getbsFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;

      })


    let cckeyvalue: String = "";
    this.getccDD(cckeyvalue);
    this.CCBSSearchForm.get('costcentre_id').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          console.log('inside tap')

        }),
        switchMap(value => this.mastersErvice.getccFKdd(value, 1)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccList = datas;

      })
    // this.getbs();
    // this.getcc();
    // this.getccbs();

  }

  private getDepartment(deptkeyvalue) {
    this.memoService.getDepartment(deptkeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.departmentList1 = datas;
      })
  }

  private getDepartmentList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      this.SpinnerService.show();
    this.mastersErvice.getDepartmentList(filter, sortOrder, this.currentpage, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.departmentList = datas;
        // console.log(this.departmentList)
        let datapagination = results["pagination"];
        if (this.departmentList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      },
      (error)=>{
        this.SpinnerService.hide();
      });
  }
  nextClickDepartment() {
    if (this.has_next === true) {
      this.currentpage += 1
      this.getDepartmentList("", 'asc', this.currentpage, 10)
    }
  }

  previousClickDepartment() {
    if (this.has_previous === true) {
      this.currentpage -= 1
      this.getDepartmentList("", 'asc', this.currentpage  , 10)
    }
  }
  departmentView(data) {
    this.isDepartment = false;
    this.ismakerCheckerButton = false;
    this.isDepartmentView = true
    this.sharedService.departmentView.next(data)

  }

  getModulesList() {
    this.SpinnerService.show();
    this.mastersErvice.getModulesList()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.modulesList = datas;
      },
      (error)=>{
        this.SpinnerService.hide();
      })
  }

  getRolesList() {
    this.SpinnerService.show();
    this.mastersErvice.getRolesList()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"]; ``
        this.rolesList = datas;
      },
      (error)=>{
        this.SpinnerService.hide();
      })
  }
  rolesEdit(data: any) {
    this.isRoles = false;
    this.isRolesEdit = true
    this.shareService.rolesEditValue.next(data)
    return data;
  }

  getPermissionList(id) {
    this.mastersErvice.getPermissionList1(id)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        datas.forEach((element) => {
          let masterRole = element.role;
          masterRole.forEach(masRoles => {
            let role_code = masRoles.code;
            let role_id = masRoles.id;
            let role_name = masRoles.name;
            let masterRoleDatas = {
              "code": role_code,
              "name": role_name,
              "role_id": role_id,
              "parent_name": element.name,
              "parent_id": element.id,
              "logo": element.log,
              "url": element.url,
            }
            this.permissionArray.push(masterRoleDatas)
          });

          let subModule = element.submodule;
          subModule.forEach(subElement => {
            let suModuleRole = subElement.role;
            suModuleRole.forEach(subModRoles => {
              let role_code = subModRoles.code;
              let role_id = subModRoles.id;
              let name = subModRoles.name;
              let subModuleRoleDatas = {
                "code": role_code,
                "name": name,
                "role_id": role_id,
                "parent_name": subElement.name,
                "parent_id": subElement.id,
                "submodule": element.name,
                "submodule_id": element.id,
                "logo": subElement.log,
                "url": subElement.url,

              }
              this.permissionArray.push(subModuleRoleDatas)
            });
          });
        })
      })
  }

  private getAccountList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.mastersErvice.getAccountList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.accountList = datas;
        for (let i = 0; i < this.accountList.length; i++) {
          let temp = this.accountList[i].template
          if (temp == undefined) {
            this.accountList[i].template_name = ''
          } else {
            this.accountList[i].template_name = temp.template
          };
        }
        let datapagination = results["pagination"];
        this.accountList = datas;
        if (this.accountList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      })
  }
  accountEdit(data: any) {
    this.shareService.accountEditValue.next(data)
    this.router.navigateByUrl('/accountEdit', { skipLocationChange: true })
    return data;
  }
  deleteAccount(data) {
    let value = data.id
    this.mastersErvice.acctDeleteForm(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        return true

      })
  }
  nextClickAccount() {
    if (this.has_next === true) {
      this.getAccountList("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickAccount() {
    if (this.has_previous === true) {
      this.getAccountList("", 'asc', this.currentpage - 1, 10)
    }
  }


  private getTemplate(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
    this.mastersErvice.getTemplateDD(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.templateList = datas;
        for (let i = 0; i < this.templateList.length; i++) {
          let ft = this.templateList[i].file_type
          if (ft == undefined) {
            this.templateList[i].file_name = ''
          } else {
            this.templateList[i].file_name = ft.text
          };
        }
        let datapagination = results["pagination"];
        this.templateList = datas;
        if (this.templateList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }


      })
  }
  templateEdit(data: any) {
    this.shareService.templateEditValue.next(data)
    this.router.navigateByUrl('/templateedit', { skipLocationChange: true })
    return data;
  }
  nextClickTemplate() {
    if (this.has_next === true) {
      this.getTemplate("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickTemplate() {
    if (this.has_previous === true) {
      this.getTemplate("", 'asc', this.currentpage - 1, 10)
    }
  }
  deleteTemplate(data) {
    let value = data.id
    // console.log("tempdetelevalueeee", value)
    this.mastersErvice.templateDeleteForm(value)
      .subscribe(result => {
        // // console.log("deleteact",result)
        this.notification.showSuccess("Successfully deleted....")
        return true

      })
  }


  private getCategoryList(filter = "", sortOrder = 'asc',
    pageNumber = 1) {
      this.SpinnerService.show();
    this.mastersErvice.ms_getCategoryList(filter, sortOrder, pageNumber, this.categoryName)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.categoryList = datas;
        let datapagination = results["pagination"];
        this.categoryList = datas;
        if (this.categoryList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      },
      (error)=>{
        this.SpinnerService.hide();
      });
  }
  categoryEdit(data: any) {
    this.isCategoryEditForm = true;
    this.ismakerCheckerButton = false;
    this.isCategory = false;
    this.shareService.categoryEditValue.next(data)
    return data;
  }
  nextClickCategory() {
    if (this.has_next === true) {
      this.getCategoryList("", 'asc', this.currentpage + 1)
    }
  }

  previousClickCategory() {
    if (this.has_previous === true) {
      this.getCategoryList("", 'asc', this.currentpage - 1)
    }
  }

  private getSubCategoryList1(filter = "", sortOrder = 'asc',
    pageNumber = 1) {
      this.SpinnerService.show();
    this.mastersErvice.ms_getSubCategoryList1(filter, sortOrder, pageNumber, this.subcategoryName)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.category_sub = datas.category;
        this.subCategoryList = datas;
        let datapagination = results["pagination"];
        this.subCategoryList = datas;
        if (this.subCategoryList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      },
      (error)=>{
        this.SpinnerService.hide();
      })
  }
  nextClickSubCategory() {
    if (this.has_next === true) {
      this.getSubCategoryList1("", 'asc', this.currentpage + 1)
    }
  }

  previousClickSubCategory() {
    if (this.has_previous === true) {
      this.getSubCategoryList1("", 'asc', this.currentpage - 1)
    }
  }
  departmentEdit(data: any) {
    this.isdeptEditForm = true;
    this.isDepartment = false;
    this.ismakerCheckerButton = false;
    this.shareService.deptEditValue.next(data)
    return data;
  }


  subCategoryEdit(data: any) {
    this.isSubCategoryEditForm = true;
    this.isSubcategory = false;
    this.ismakerCheckerButton = false;
    this.shareService.subCategoryEditValue.next(data);
    return data;
  }

  getChannel(
    pageNumber = 1) {
    this.mastersErvice.getChannel(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.channelList = datas;
        if (this.channelList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      })
  }



  getDocument(
    pageNumber = 1) {
    this.mastersErvice.getDocument(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.documentList = datas;
        if (this.documentList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      })
  }

  next_Click() {
    if (this.has_next === true) {
      this.getDocument(this.currentpage + 1)
    }
  }

  previous_Click() {
    if (this.has_previous === true) {
      this.getDocument(this.currentpage - 1)
    }
  }



  _nextClick() {
    if (this.has_next === true) {
      this.getChannel(this.currentpage + 1)
    }
  }

  _previousClick() {
    if (this.has_previous === true) {
      this.getChannel(this.currentpage - 1)
    }
  }


  courierEdit(data) {
    this.shareService.courierEdit.next(data)
    this.router.navigateByUrl('/courierEdit', { skipLocationChange: true })
  }

  channelEdit(data) {
    this.shareService.channelEdit.next(data)
    this.router.navigateByUrl('/channelEdit', { skipLocationChange: true })
  }
  documentEdit(data) {
    this.shareService.documentEdit.next(data)
    this.router.navigateByUrl('/documentEdit', { skipLocationChange: true })
  }



  getCourier(
    pageNumber = 1) {
    this.mastersErvice.getCourier(pageNumber)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.courierList = datas;
        if (this.courierList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
      })
  }

  nextClick() {
    if (this.has_next === true) {
      this.getCourier(this.currentpage + 1)
    }
  }

  previousClick() {
    if (this.has_previous === true) {
      this.getCourier(this.currentpage - 1)
    }
  }


  getEmployee(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      this.SpinnerService.show();
    this.mastersErvice.getEmployee(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        if(results['code'] !=undefined && results['code'] !=null){
          this.notification.showError(results['code']);
          this.notification.showError(results['description']);
          this.employeeList=[];
        }
        else{
          let datas = results["data"];
        this.employeeList = datas;
        let datapagination = results["pagination"];
        this.employeeList = datas;
        this.totalcount=results['count']?results['count']:'';
        if (this.employeeList.length >= 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }
        }
      },
      (error)=>{
        this.SpinnerService.hide();
        this.employeeList=[];
        
      }
      )
  }
  getempeditnavigate(data:any){
    // routerLink="/master/empedit"
    this.isEmployee=false;
    this.isEmployeeViewForm=false;
    this.isEmployeeEdit=true;
    this.isempbank=false;
    this.isempbankedit=false;
    this.isempbankform=false;
    this.shareService.empeditid.next(data.id);
    // this.router.navigate(['/master/empedit']);
  }
  nextClickEmployee() {
    if (this.has_next === true) {
      this.getEmployee("", 'asc', this.currentpage + 1, 10)
    }
  }

  previousClickEmployee() {
    if (this.has_previous === true) {
      this.getEmployee("", 'asc', this.currentpage - 1, 10)
    }
  }
  employeeView(data) {
    this.isEmployeeViewForm = true;
    this.isEmployee = false;
    this.isEmployeeEdit=false;
    this.isEmployeeform=false;
    console.log("employeeView", data)
    this.sharedService.empView.next(data.id)
    // this.sharedService.employeeView.next(data)
  }
  CategoryView() {
    this.getCategoryList();
  }
  subCategoryView() {
    this.getSubCategoryList1();
  }
  empView() {
    if(this.employeeControl.value==undefined || this.employeeControl.value=='' || this.employeeControl.value==null){
      this.notification.showError('Please Select The  Employee Name');
      return false;
    }
    this.isEmployeeViewForm = true;
    this.isEmployee = false;
    this.isEmployeeEdit=false;
    this.isEmployeeform=false;
    let empdata = this.employeeId
    console.log("empdata", empdata)
    this.sharedService.empView.next(empdata)
  }
  employeereset(){
    this.employeeControl.reset('');
    this.chipSelectedEmployee=[];
    this.dataServices.get_EmployeeList('', 1).subscribe(data=>{
      this.totalEmployeeList = data["data"];
    });
  }
  autocompleteEmployeeScroll() {
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
            // console.log('fetchmoredataemp', scrollTop, elementHeight, scrollHeight, atBottom);
            if (atBottom) {
              // fetch more data
              // console.log('fetchmoredataemp1', this.has_next);
              // console.log(this.employeeInput.nativeElement.value);
              if (this.has_next === true) {
                this.dataServices.get_EmployeeList(this.employeeInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.totalEmployeeList = this.totalEmployeeList.concat(datas);
                    // console.log("emp", datas)
                    if (this.totalEmployeeList.length >= 0) {
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

  public removeEmployee(employee: iEmployeeSummaryList): void {
    const index = this.chipSelectedEmployee.indexOf(employee);

    // this.chipRemovedEmployeeid.push(employee.id)
    // // console.log('this.chipRemovedEmployeeid', this.chipRemovedEmployeeid);
    // // console.log(employee.id)
    if (index >= 0) {

      this.chipSelectedEmployee.splice(index, 1);
      // console.log(this.chipSelectedEmployee);
      this.chipSelectedEmployeeid.splice(index, 1);
      // console.log(this.chipSelectedEmployeeid);
      this.employeeInput.nativeElement.value = '';
    }

  }

  public employeeSelected(event: MatAutocompleteSelectedEvent): void {
    // console.log('employeeSelected', event.option.value.full_name);
    this.selectEmployeeByName(event.option.value.full_name);
    this.employeeInput.nativeElement.value = '';
  }
  private selectEmployeeByName(employeeName) {
    let foundEmployee1 = this.chipSelectedEmployee.filter(employee => employee.full_name == employeeName);
    if (foundEmployee1.length) {
      // console.log('found in chips');
      return;
    }
    let foundEmployee = this.totalEmployeeList.filter(employee => employee.full_name == employeeName);
    if (foundEmployee.length) {
      // We found the employeecc name in the allEmployeeList list
      // console.log('founde', foundEmployee[0].id);
      this.chipSelectedEmployee.push(foundEmployee[0]);
      this.chipSelectedEmployeeid.push(foundEmployee[0].id)
      // console.log(this.chipSelectedEmployeeid);
      let employeId = foundEmployee[0].id
      this.employeeId = employeId
      // console.log("employeeId", this.employeeId)
    }
  }
  subModuleData(data) {
    this.url = data.url;
    this.urlPermission = "/permissions";
    this.urlDepartment = "/department";
    this.urlEmployee = "/employeeSummary";
    this.urlSubCategory = "/subCategory";
    this.urlCategory = "/category";
    this.urlMoudles = "/module";
    this.urlRoles = "/roles";
    this.urlState = "/state";
    this.urlPinCode = "/pincode";
    this.urlCity = "/city";
    this.urlDistrict = "/district";
    this.urlDesignation="/designation";
    this.urlRisk = "/risktype";
    this.urlCC = "/costcentre";
    this.urlBS = "/businesssegment";
    this.urlCCBS = "/ccbs";
    this.urlcommodity="/commodity";
    this.urlEntity="/entity";
    this.urlGl="/gl";
    this.urlPMD = "/pmd";
    this.urlFin='/finyear';
    this.urlQFin="/finquarter";
    this.urlcommodity = "/commodity";
    this.urldelmatmaker = "/delmatmaker";
    this.urldelmatapprover = "/delmatapprover";
    this.urlAppVersion='/appversion';
    this.urlClient='/client';
    this.Urlempobranch='/empbranch';
    this.urlempupload='/empupload';
    this.isEmpbranch=this.Urlempobranch === this.url ? true:false;
    this.isPermission = this.urlPermission === this.url ? true : false;
    this.isDepartment = this.urlDepartment === this.url ? true : false;
    this.isEmployee = this.urlEmployee === this.url ? true : false;
    this.isSubcategory = this.urlSubCategory === this.url ? true : false;
    this.isCategory = this.urlCategory === this.url ? true : false;
    this.isRoles = this.urlRoles === this.url ? true : false;
    this.isModules = this.urlMoudles === this.url ? true : false;
    this.isState = this.urlState === this.url ? true : false;
    this.isPinCode = this.urlPinCode === this.url ? true : false;
    this.isDistrict = this.urlDistrict === this.url ? true : false;
    this.isCity = this.urlCity === this.url ? true : false;
    this.isCC = this.urlCC === this.url ? true : false;
    this.isBS = this.urlBS === this.url ? true : false;
    this.isCCBS = this.urlCCBS === this.url ? true : false;
    this.isEmpuploadnew = this.urlempupload === this.url ? true : false;
    this.urlEntity="/entity";
    this.urlSector="/sector";
    this.urlEXP="/expense";
    // this.iscommodity=this.urlcommodity===this.url ? true:false;
    this.isDesignation=this.urlDesignation===this.url ? true : false;
    this.isRisk=this.urlRisk===this.url ? true : false;
    this.isEntity=this.urlEntity===this.url? true : false;
    this.isPMD = this.urlPMD === this.url ? true : false;
    this.isFin=this.urlFin===this.url ? true:false;
    this.isAppVersion=this.urlAppVersion===this.url ? true:false;
    this.isFinQ=this.urlQFin===this.url ? true:false;
    this.isGL=this.urlGl===this.url?true:false;
    this.isCommodity = this.urlcommodity === this.url ? true : false;
    this.isDelmatMakers = this.urldelmatmaker === this.url? true : false;
    this.isDelmatApproval = this.urldelmatapprover === this.url ? true : false;
    this.roleValues = data.role[0].name;
    this.isSector=this.urlSector===this.url?true:false;
    this.isExp=this.urlEXP===this.url?true:false;
    this.isClient = this.urlClient === this.url ? true : false;
    this.makerNameBtn = data.name;
    if (this.isPermission) {
      this.isPermissionForm = false;
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isDeptForm = false;
      this.isRolesEdit = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } 
    if (this.isEmpbranch) {
      this.getempbranchdata();
      this.isEmpbranchEdit=false;
      this.isPermissionForm = false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isDeptForm = false;
      this.isRolesEdit = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } 
    else if (this.isExp) {
      this.getexpsummarysearch(1);
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isEntity=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isEntityEdit=false;
      this.isEntityForm=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isDeptForm = false;
      this.isDepartmentView = false;
      this.isdeptEditForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isRolesEdit = false;
      this.isPermissionForm = false;
      this.isCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isSubCategoryForm = false;
      this.isCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false;
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }
    else if (this.isEntity) {
      this.getentitysummarysearch(1);
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isFin=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isDeptForm = false;
      this.isDepartmentView = false;
      this.isdeptEditForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isRolesEdit = false;
      this.isPermissionForm = false;
      this.isCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isSubCategoryForm = false;
      this.isCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false;
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }
    else if (this.isFin) {
      this.getfinsummarysearch(1);
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQ=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isDeptForm = false;
      this.isDepartmentView = false;
      this.isdeptEditForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isRolesEdit = false;
      this.isPermissionForm = false;
      this.isCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isSubCategoryForm = false;
      this.isCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false;
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }
    else if (this.isFinQ) {
      this.getfinquatersummarysearch(1);
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isDeptForm = false;
      this.isDepartmentView = false;
      this.isdeptEditForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeform=false;
      this.isRolesEdit = false;
      this.isPermissionForm = false;
      this.isCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isSubCategoryForm = false;
      this.isCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false;
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }
    else if (this.isSector) {
      this.getsectorsummary(1);
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isDeptForm = false;
      this.isDepartmentView = false;
      this.isdeptEditForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeform=false;
      this.isRolesEdit = false;
      this.isPermissionForm = false;
      this.isCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isSubCategoryForm = false;
      this.isCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false;
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }else if (this.isDepartment) {
      this.getDepartmentList();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isDeptForm = false;
      this.isDepartmentView = false;
      this.isdeptEditForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeform=false;
      this.isRolesEdit = false;
      this.isPermissionForm = false;
      this.isCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isSubCategoryForm = false;
      this.isCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false;
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } else if (this.isDesignation) {
      this.getdesignationsummary(1,'');
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isDesignationForm=false;
      this.isDeptForm = false;
      this.isDepartmentView = false;
      this.isdeptEditForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeform=false;
      this.isRolesEdit = false;
      this.isPermissionForm = false;
      this.isCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isSubCategoryForm = false;
      this.isCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false;
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } 
     else if (this.isEmployee) {
      this.getEmployee();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isEmployeeViewForm = false;
      this.isempbank=false;
      this.isempbankedit=false;
      this.isempbankform=false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.ismakerCheckerButton = false;
      this.isSubCategoryEditForm = false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isPermissionForm = false;
      this.isSubCategoryForm = false;
      this.isCategoryEditForm = false;
      this.isDepartmentView = false;
      this.isdeptEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } else if (this.isCategory) {
      this.getCategoryList();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isCategoryForm = false;
      this.isCategoryEditForm = false;
      this.isPermissionForm = false;
      this.isRolesEdit = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isSubCategoryEditForm = false;
      this.isDeptForm = false;
      this.isdeptEditForm = false;
      this.isSubCategoryForm = false;
      this.isDepartmentView = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } else if (this.isSubcategory) {
      this.getSubCategoryList1();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isPermissionForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } else if (this.isModules) {
      this.getModulesList();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isSubCategoryEditForm = false;
      this.isPermissionForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isRolesEdit = false;
      this.isCategoryForm = false;
      this.isDeptForm = false;
      this.isSubCategoryForm = false;
      this.isDepartmentView = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } else if (this.isRoles) {
      this.getRolesList();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isRolesEdit = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isPermissionForm = false;
      this.isSubCategoryEditForm = false;
      this.isCategoryForm = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isSubCategoryForm = false;
      this.isDepartmentView = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }
    else if (this.isState) {
      this.getStateList();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.ismakerCheckerButton=false;
      this.isPermissionForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } else if (this.isCity) {
      this.getCityList();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isPermissionForm = false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } else if (this.isPinCode) {
      this.getPincodeList();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isPermissionForm = false;
      this.isEmployeeViewForm = false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } else if (this.isDistrict) {
      this.getDistrictList();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.ismakerCheckerButton=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isPermissionForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }

    else if (this.isBS) {
      this.getbs(1);
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isPermissionForm = false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }

    else if (this.isCC) {
      this.getcc(1);
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isPermissionForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }
    else if (this.isCCBS) {
      this.getccbs();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isPermissionForm = false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }
    else if (this.isPMD) {
      this.getPMD();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isPermissionForm = false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isPMDForm = false;
      this.isPMDFormedit = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }
    else if (this.isGL) {
      // this.();
      this.getGL();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.ismakerCheckerButton=false;
      this.isPermissionForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isPMDForm = false;
      this.isPMDFormedit = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }
    else if (this.isCommodity) {
      this.getcommodity(1,10);
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isCommodity = true;
      this.isCommodityForm = false;
      this.isDelmatApproval = false;
      this.isDelmatMakers = false;
      this.isDelmatMakerForm = false;
      this.isPermissionForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isPMDForm = false;
      this.isPMDFormedit = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } else if (this.isDelmatMakers) {
      this.getdelmat();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isCommodity = false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.isCommodityForm = false;
      this.isDelmatMakers = true;
      this.isDelmatMakerForm = false;
      this.isDelmatApproval = false;
      this.isPermissionForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isPMDForm = false;
      this.isPMDFormedit = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    } else if (this.isDelmatApproval) {
      this.getdelmatapproval();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.ismakerCheckerButton=false;
      this.isPermissionForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isPMDForm = false;
      this.isPMDFormedit = false;
      this.isCommodity = false;
      this.isCommodityForm = false
      this.isDelmatMakers = false;
      this.isDelmatMakerForm = false;
      this.isDelmatApproval = true;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }   else if (this.isRisk) {
      this.getrisksummary();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      this.ismakerCheckerButton=false;
      this.isPermissionForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isPMDForm = false;
      this.isPMDFormedit = false;
      this.isCommodity = false;
      this.isCommodityForm = false
      this.isDelmatMakers = false;
      this.isDelmatMakerForm = false;
      this.isDelmatApproval = false;
      this.isRisk = true;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }
    else if (this.isAppVersion) {
      this.getappversionsummary();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      // this.ismakerCheckerButton=false;
      this.isPermissionForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isPMDForm = false;
      this.isPMDFormedit = false;
      this.isCommodity = false;
      this.isCommodityForm = false
      this.isDelmatMakers = false;
      this.isDelmatMakerForm = false;
      this.isDelmatApproval = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isAppVersion=true;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
    }
    else if (this.isClient) {
      this.getclientsummary();
      this.isEmpbranch=false;
      this.isEmpbranchEdit=false;
      this.isEMpbranchsummary=false;
      this.isFinQEdit=false;
      this.isFinQForm=false;
      this.isFinEdit=false;
      this.isFinForm=false;
      this.isEntityForm=false;
      this.isEntityEdit=false;
      this.isExpEdit=false;
      this.isExpform=false;
      this.isSectorEdit=false;
      this.isSectorform=false;
      // this.ismakerCheckerButton=false;
      this.isPermissionForm = false;
      this.isEmployeeViewForm = false;
      this.isEmployeeEdit=false;
      this.isEmployeeform=false;
      this.isCategoryForm = false;
      this.isRolesEdit = false;
      this.isDeptForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isPMDForm = false;
      this.isPMDFormedit = false;
      this.isCommodity = false;
      this.isCommodityForm = false
      this.isDelmatMakers = false;
      this.isDelmatMakerForm = false;
      this.isDelmatApproval = false;
      this.isRisk = false;
      this.isRiskForm = false;
      this.riskeditform= false;
      this.isAppVersionEdit=false;
      this.isAppVersionForm=false;
      this.isAppVersion=false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=true;
    }

    if (this.roleValues === "Maker") {
      this.ismakerCheckerButton = true;
    } else if (this.roleValues === "Checker") {
      this.ismakerCheckerButton = false;
    }
    if (data.name === "Module") {
      this.ismakerCheckerButton = this.makerNameBtn = false;
    }
    if (data.name === "Employee") {
      this.ismakerCheckerButton = this.makerNameBtn = false;
    }
    if (data.name === "Roles") {
      this.ismakerCheckerButton = this.makerNameBtn = false;
      this.isEditMakerChekerBtn = true;
    }
    else if(data.name=="Oracle GL"){
      this.ismakerCheckerButton = this.makerNameBtn = false;
    }
    else if(data.name=='Delmat Approver'){
      this.ismakerCheckerButton = this.makerNameBtn = false;
    }
    else if(data.name=='State'){
      this.ismakerCheckerButton = this.makerNameBtn = false;
    }
    else if(data.name=='District'){
      this.ismakerCheckerButton = this.makerNameBtn = false;
    }
    else if(data.name=='Entity'){
      this.ismakerCheckerButton = this.makerNameBtn = false;
    }
    else if(data.name=='Employee'){
      this.ismakerCheckerButton = this.makerNameBtn = false;
    }
    else if(data.name=='Pincode'){
      this.ismakerCheckerButton = this.makerNameBtn = false;
    }
    // else if(data.name=='CCBS'){
    //   this.ismakerCheckerButton = this.makerNameBtn = false;
    // }
    // console.log("cccccccc", data)
  }

  Modules_Listview(){
    // let datas = this.sharedService.menuUrlData;
    // this.todo= [];
    // // this.done = [];
    // datas.forEach(element => {
    //   if (element.type === "transaction") {
    //     this.todo.push(element);
    //   }
    //   console.log("todo", this.todo)
    // })
      this.isRisk =  true;
      this.getrisksummary();
      this.ismakerCheckerButton = false;
      this.isPermission = false;
      this.isDepartment = false;
      this.isEmployee = false;
      this.isSubcategory =  false;
      this.isCategory = false;
      this.isRoles =  false;
      this.isModules = false;
      this.isState =  false;
      this.isPinCode = false;
      this.isDistrict =  false;
      this.isCity = false;
      this.isCC =   false;
      this.isBS =  false;
      this.isCCBS =  false;
      this.isPermissionForm = false;
      this.isDeptForm = false;
      this.isRolesEdit = false;
      this.isEmployeeViewForm = false;
      this.isCategoryForm = false;
      this.isSubCategoryForm = false;
      this.isSubCategoryEditForm = false;
      this.isCategoryEditForm = false;
      this.isdeptEditForm = false;
      this.isDepartmentView = false;
      this.isStateForm = false;
      this.isCityForm = false;
      this.isDistrictForm = false;
      this.isPinCodeForm = false
      this.isStateEditForm = false;
      this.isDistrictEditForm = false;
      this.isCityEditForm = false;
      this.isPinCodeEditForm = false;
      this.isCCBSform = false;
      this.isBSForm = false;
      this.isCCform = false;
      this.isAppVersion = false;
      this.isAppVersionForm = false;
      this.isAppVersionEdit = false;
      this.isClientEdit=false;
      this.isClientForm=false;
      this.isClient=false;
  }

  addForm() {
    console.log(this.makerNameBtn)
    if (this.makerNameBtn === "Department") {
      this.isDeptForm = true;
      this.isDepartment = false;
      this.isdeptEditForm = false;
      this.ismakerCheckerButton = false;
    } else if (this.makerNameBtn === "Permissions") {
      this.isPermission = false;
      this.isPermissionForm = true;
    } else if (this.makerNameBtn === "Sub Category") {
      this.isSubCategoryForm = true;
      this.isSubcategory = false;
      this.isSubCategoryEditForm = false;
      this.ismakerCheckerButton = false;
    }else if (this.makerNameBtn === "Designation") {
      this.isDesignationForm = true;
      this.isDesignation = false;
      // this.isSubCategoryEditForm = false;
      this.ismakerCheckerButton = false;
    } 
    else if (this.makerNameBtn === "Risk Type") {
      this.isRiskForm = true;
      this.isRisk = false;
      this.ismakerCheckerButton = false;
    } 
    else if (this.makerNameBtn === "Category") {
      this.isCategoryForm = true;
      this.isCategoryEditForm = false;
      this.isCategory = false;
      this.ismakerCheckerButton = false;
    } else if (this.makerNameBtn === "State") {
      this.isStateForm = true;
      this.isState = false;
      this.isStateEditForm = false;
      this.ismakerCheckerButton = false;
    } else if (this.makerNameBtn === "Pincode") {
      this.isPinCodeForm = true;
      this.isPinCode = false;
      this.isPinCodeEditForm = false;
      this.ismakerCheckerButton = false;
    } else if (this.makerNameBtn === "City") {
      this.isCityForm = true;
      this.isCity = false;
      this.isCityEditForm = false;
      this.ismakerCheckerButton = false;
    } else if (this.makerNameBtn === "District") {
      this.isDistrictForm = true;
      this.isDistrict = false;
      this.isDistrictEditForm = false;
      this.ismakerCheckerButton = false;
    }
    else if (this.makerNameBtn === "Cost Centre") {
      this.isCCform = true;
      this.isCC = false;
      this.isBS = false;
      this.isCCBS = false;
      this.ismakerCheckerButton = false;
    }
    else if (this.makerNameBtn === "Business Segment") {
      this.isBSForm = true;
      this.isCC = false;
      this.isBS = false;
      this.isCCBS = false;

      this.ismakerCheckerButton = false;
    }
    else if (this.makerNameBtn === "CCBS") {
      this.isCCBSform = true;
      this.isCC = false;
      this.isBS = false;
      this.isCCBS = false;
      this.ismakerCheckerButton = false;
    }

    else if (this.makerNameBtn === "Sector") {
      this.isSectorform = true;
      this.isSector = false;
      this.isSectorEdit = false;
      this.ismakerCheckerButton = false;
    }

    else if (this.makerNameBtn === "PMD Branch") {
      this.isPMDForm = true;
      this.isPMDFormedit = false;
      this.isPMD = false;
      this.isCCBSform = false;
      this.ismakerCheckerButton = false;
    }
    else if (this.makerNameBtn === "Entity") {
      this.isEntity = false;
      this.isEntityForm=true;
      this.isEntityEdit=false;
      this.ismakerCheckerButton = false;

    }
    else if (this.makerNameBtn === "Fin Year") {
      this.isFin = false;
      this.isFinForm=true;
      this.isFinEdit=false;
      this.ismakerCheckerButton = false;

    }
    else if (this.makerNameBtn === "Fin Quarter") {
      this.isFinQ = false;
      this.isFinQEdit=false;
      this.isFinQForm=true;
      this.ismakerCheckerButton = false;

    }
    else if (this.makerNameBtn === "Employee") {
      this.isEmployee = false;
      this.isEmployeeEdit=true;
      this.isEmployeeform=false;
      this.isFinQForm=false;
      this.ismakerCheckerButton = false;

    }
    else if (this.makerNameBtn === "Commodity") {
      this.isCommodityForm = true;
      this.isCommodity = false;
      this.ismakerCheckerButton = false;
    } else if (this.makerNameBtn === "Delmat Maker") {
      this.isDelmatMakerForm = true;
      this.ismakerCheckerButton = false
      this.isDelmatMakers = false;
    }
    else if (this.makerNameBtn === "Expense") {
      this.isExp = false;
      this.isExpform = true
      this.isExpEdit=false;
      this.ismakerCheckerButton = false
      // this.isDelmatMakers = false;
    }
    else if(this.makerNameBtn=='Delmat Approver'){
      this.isDelmatApproval=true;
      this.ismakerCheckerButton=false;

    }
    else if(this.makerNameBtn=="CBS GL"){
      this.isGL=false;
      this.isGLform=true;
      this.ismakerCheckerButton=false;
      
    }
    else if(this.makerNameBtn=="App Version"){
      this.isAppVersion=false;
      this.isAppVersionForm=true;
      this.ismakerCheckerButton=true;
      
    }
    else if(this.makerNameBtn=="Client"){
      this.isClient=false;
      this.isClientForm=true;
      this.ismakerCheckerButton=true;
      
    }
    else if(this.makerNameBtn=="Employee Branch"){
      this.isEmpbranch=false;
      this.isEMpbranchsummary=true;
      this.isEmpbranchEdit=false;
      this.ismakerCheckerButton=false;
    }
  }
  sectorsubmit(){
    this.getsectorsummary(1);
    this.isSector=true;
    this.isSectorEdit=false;
    this.isSectorform=false;
  }
  sectorcancel(){
    this.getsectorsummary(1);
    this.isSector=true;
    this.isSectorEdit=false;
    this.isSectorform=false;
  }
  designation(){
    this.getdesignationsummary(1,'');
    this.ismakerCheckerButton = true;
    this.isDesignation = true;
    this.isDesignationForm = false;
    this.designationeditform=false;
  }
  designationcancel(){
    this.isDesignationForm=false;
    this.isDesignation=true;
    this.designationeditform=false;
    this.ismakerCheckerButton = true;
  }

  risk(){
    this.getrisksummary();
    this.ismakerCheckerButton = true;
    this.isRisk = true;
    this.isRiskForm = false;
    this.riskeditform=false;
  }
  riskcancel(){
    this.isRiskForm=false;
    this.isRisk=true;
    this.riskeditform=false;
    this.ismakerCheckerButton = true;
  }
  sectoractiveinactive(e:any){
    let data:any={
      'id':e.id,
      'status':e.status
,    };
    this.mastersErvice.getsectorsummaryactiveinactive(data).subscribe(res=>{
      if(res['status']=='success'){
        this.notification.showSuccess(res['message']);
        this.getsectorsummary(1);
      }
      else{
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )

  }
  expenceactiveinactive(e:any){
    let data:any={
      'id':e.id,
      'status':e.status
,    };
    this.mastersErvice.getexpencesummaryactiveinactive(data).subscribe(res=>{
      if(res['status']=='success'){
        this.notification.showSuccess(res['message']);
        this.getexpsummary(1);
      }
      else{
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )

  }
  pmdactiveinactive(e:any){
    let data:any={
      'id':e.id,
      'status':e.status
,    };
    this.mastersErvice.getpmdcbsglactive(data).subscribe(res=>{
      if(res['status']=='success'){
        this.notification.showSuccess(res['message']);
        this.getPMD(1);
      }
      else{
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )

  }
  deptCancel() {
    this.isDeptForm = false;
    this.ismakerCheckerButton = true;
    this.isDepartment = true;
  }

  deptEditCancel() {
    this.isdeptEditForm = false;
    this.isDepartment = true;
    this.ismakerCheckerButton = true;
  }
  categoryCancel() {
    this.ismakerCheckerButton = true;
    this.isCategoryForm = false;
    this.isCategory = true
  }

  categoryEditCancel() {
    this.ismakerCheckerButton = true;
    this.isCategoryEditForm = false;
    this.isCategory = true;
  }

  subCategoryCancel() {
    this.ismakerCheckerButton = true;
    this.isSubCategoryForm = false;
    this.isSubcategory = true
  }

  subCategoryEditCancel() {
    this.ismakerCheckerButton = true;
    this.isSubCategoryEditForm = false;
    this.isSubcategory = true
  }

  permissionCancel() {
    this.ismakerCheckerButton = true;
    this.isPermission = true;
    this.isPermissionForm = false;
  }

  rolesEditCancel() {
    this.ismakerCheckerButton = false;
    this.isRoles = true;
    this.isRolesEdit = false;
  }

  employeeViewCancel() {
    this.isEmployeeViewForm = false;
    this.isEmployeeEdit=false;
    this.isEmployee = true;
    this.isEmployeeform=false;
  }

  categorySubmit() {
    this.getCategoryList();
    this.ismakerCheckerButton = true;
    this.isCategory = true;
    this.isCategoryForm = false;
  }

  categoryEditSubmit() {
    this.getCategoryList();
    this.ismakerCheckerButton = true;
    this.isCategory = true;
    this.isCategoryEditForm = false;
  }
  deptSubmit() {
    this.getDepartmentList()
    this.ismakerCheckerButton = true;
    this.isDeptForm = false;
    this.isDepartment = true;
  }
  editdeptSubmit() {
    this.getDepartmentList()
    this.ismakerCheckerButton = true;
    this.isdeptEditForm = false;
    this.isDepartment = true;
  }

  subCategorySubmit() {
    this.getSubCategoryList1();
    this.isSubCategoryForm = false;
    this.isSubcategory = true;
    this.ismakerCheckerButton = true;
  }

  subCategoryEditSubmit() {
    this.getSubCategoryList1();
    this.isSubCategoryEditForm = false;
    this.isSubcategory = true;
    this.ismakerCheckerButton = true;
  }

  rolesEditSubmit() {
    this.getRolesList();
    this.ismakerCheckerButton = false;
    this.isRolesEdit = false;
    this.isRoles = true;
  }


  stateSubmit() {
    this.getStateList();
    this.isStateForm = false;
    this.isState = true;
    this.ismakerCheckerButton = true;
  }

  stateCancel() {
    this.ismakerCheckerButton = true;
    this.isStateForm = false;
    this.isState = true
  }


  citySubmit() {
    this.getStateList();
    this.isCityForm = false;
    this.isCity = true;
    this.ismakerCheckerButton = true;
  }

  cityCancel() {
    this.ismakerCheckerButton = true;
    this.isCityForm = false;
    this.isCity = true
  }

  districtSubmit() {
    // this.getStateList();
    this.isDistrictForm = false;
    this.isDistrict = true;
    this.ismakerCheckerButton = true;
  }

  districtCancel() {
    this.ismakerCheckerButton = true;
    this.isDistrictForm = false;
    this.isDistrict = true;
  }
  pinCodeSubmit() {
    // this.getStateList();
    this.isPinCodeForm = false;
    this.isPinCode = true;
    this.ismakerCheckerButton = true;
  }

  pinCodeCancel() {
    this.ismakerCheckerButton = true;
    this.isPinCodeForm = false;
    this.isPinCode = true;
  }



  stateEditCancel() {
    this.isStateEditForm = false;
    this.isState = true;
    this.ismakerCheckerButton = true;
  }
  stateEditSubmit() {
    this.getStateList();
    this.ismakerCheckerButton = true;
    this.isState = true;
    this.isStateEditForm = false;
  }

  cityEditCancel() {
    this.isCityEditForm = false;
    this.isCity = true;
    this.ismakerCheckerButton = true;
  }
  cityEditSubmit() {
    this.getCityList();
    this.isCityEditForm = false;
    this.isCity = true;
    this.ismakerCheckerButton = true;
  }
  districtEditCancel() {
    this.isDistrictEditForm = false;
    this.isDistrict = true;
    this.ismakerCheckerButton = true;
  }
  districtEditSubmit() {
    this.getDistrictList();
    this.isDistrictEditForm = false;
    this.isDistrict = true;
    this.ismakerCheckerButton = true;
  }
  pinCodeEditCancel() {
    this.isPinCodeEditForm = false;
    this.isPinCode = true;
    this.ismakerCheckerButton = true;
  }
  pinCodeEditSubmit() {
    this.getPincodeList();
    this.isPinCodeEditForm = false;
    this.isPinCode = true;
    this.ismakerCheckerButton = true;
  }
  empcreateselect:boolean=false;

  empcreateSubmit(){
    this.getEmployee();
    this.empcreateselect=false;
    this.isEmployee=true;
    this.isEmployeeEdit=false;
    this.isEmployeeform=false;
  }
  empcreatebankCancel(){
    // this.getEmployee();
    // this.empcreateselect=false;
    this.isEmployee=true;
    this.isempbank=false;
    this.isEmployeeEdit=false;
    this.isEmployeeform=false;
  }
  empcreateenb(){
    this.isEmployee=false;
    this.isEmployeeform=true;
    this.isEmployeeEdit=false;
  }
  empcreateenbbank(){
    this.isEmployee=false;
    this.isEmployeeform=false;
    this.isEmployeeEdit=false;
    this.isempbankform=true;
    this.isempbankedit=false;
    this.isempbank=true;
  }
  appversioncancel(){
    this.isAppVersion=true;
    this.isAppVersionForm=false;
    this.isAppVersionEdit=false;
  }
  appversion(){
    this.isAppVersion=true;
    this.isAppVersionForm=false;
    this.isAppVersionEdit=false;
  }
  clientcancel(){
    this.isClient=true;
    this.isClientForm=false;
    this.isClientEdit=false;
    this.getclientsummary(1,10)
  }
  client(){
    this.isClient=true;
    this.isClientForm=false;
    this.isClientEdit=false;
    this.getclientsummary(1,10)
  }
  clienteditcancel(){
    this.isClient=true;
    this.isClientForm=false;
    this.isClientEdit=false;
    this.getclientsummary(1,10)
  }
  clientedit(){
    this.isClient=true;
    this.isClientForm=false;
    this.isClientEdit=false;
    this.getclientsummary(1,10)
  }
  empbrancheditcancel(){
    this.empbranchpage=1;
    this.empbranchform.reset('');
    this.isEmpbranch=true;
    this.isEMpbranchsummary=false;
    this.isEmpbranchEdit=false;
    this.ismakerCheckerButton=true;
    this.getempbranchdata();
  }
  empbranchedit(){
    this.empbranchpage=1;
    this.empbranchform.reset('');
    this.isEmpbranch=true;
    this.isEMpbranchsummary=false;
    this.isEmpbranchEdit=false;
    this.ismakerCheckerButton=true;
    this.getempbranchdata();
  }
  getempbranchdata(){
    let d:any=this.empbranchpage;
    if(this.empbranchform.get('code').value !=undefined && this.empbranchform.get('code').value !='' && this.empbranchform.get('code').value !=""){
      d=d+'&code='+this.empbranchform.get('code').value;
    }
    if(this.empbranchform.get('name').value !=undefined && this.empbranchform.get('name').value !='' && this.empbranchform.get('name').value !=""){
      d=d+'&name='+this.empbranchform.get('name').value;
    }
    if(this.empbranchform.get('drop').value !=undefined && this.empbranchform.get('drop').value !='' && this.empbranchform.get('drop').value !=""){
      d=d+'&status='+this.drpdwn[this.empbranchform.get('drop').value?this.empbranchform.get('drop').value:'ALL'];
    }
    // this.SpinnerService.show();
    this.SpinnerService.show();
    this.mastersErvice.getempbranchsummary(d).subscribe(datas=>{
      this.SpinnerService.hide();
      this.empbranchData=datas['data'];
      let pagination=datas['pagination'];
      this.empbranchnext=pagination.has_next;
      this.empbranchprevious=pagination.has_previous;
      this.empbranchpage=pagination.index;
    },
    (error)=>{
      this.SpinnerService.hide();
      this.empbranchData=[];
    }
    );
  }
  getempbranchdatasearch(){
    let d:any='page='+this.empbranchpage;
    if(this.empbranchform.get('code').value !=undefined && this.empbranchform.get('code').value !='' && this.empbranchform.get('code').value !=""){
      d=d+'&code='+this.empbranchform.get('code').value;
    }
    if(this.empbranchform.get('name').value !=undefined && this.empbranchform.get('name').value !='' && this.empbranchform.get('name').value !=""){
      d=d+'&name='+this.empbranchform.get('name').value;
    }
    if(this.empbranchform.get('drop').value !=undefined && this.empbranchform.get('drop').value !='' && this.empbranchform.get('drop').value !=""){
      d=d+'&status='+this.drpdwn[this.empbranchform.get('drop').value?this.empbranchform.get('drop').value:'ALL'];
    }
    this.SpinnerService.show();
    // let status:any=this.drpdwn[this.hsnform.value.drop?this.hsnform.value.drop:'ALL'];
    // this.spinner.show();
    // this.atmaService.hsnsearch(this.hsnform.value.hsn,hsnpresentpagepro,status)
    this.mastersErvice.getempbranchsummarysearch(d).subscribe(datas=>{
      this.SpinnerService.hide();
      this.empbranchData=datas['data'];
      let pagination=datas['pagination'];
      if (this.empbranchData.length >= 0) {
        this.empbranchnext = pagination.has_next;
        this.empbranchprevious = pagination.has_previous;
        this.empbranchpage = pagination.index;
      }
      if (this.empbranchnext == true) {
        this.empbranchnext = true;
      }
      if (this.empbranchprevious == true) {
        this.empbranchprevious = true;
      }
    },
    (error)=>{
      this.SpinnerService.hide();
      this.empbranchData=[];
    }
    );
  }
  empbranchreset(){
    this.empbranchform.reset('');
    this.getempbranchdata();
  }
  empbranchactiveinactive(data:any){
    let d:any={'id':data.id,'status':data.status};
    this.mastersErvice.getempbranchlactive(d).subscribe(res=>{
      if(res['status']=='success'){
        this.notification.showSuccess(res['message']);
        this.getempbranchdata();
      }
      else{
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )
  }
  empsbranchnext(){
    if(this.empbranchnext){
      this.empbranchpage +=1;
      this.getempbranchdata();
    }
  }
  empsbranchprevious(){
    if(this.empbranchprevious){
      this.empbranchpage -=1;
      this.getempbranchdata();
    }
  }
  getempbranchdownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getempbranchDoenload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'Employee Branch'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }
  editmasterbranchdata(data:any){
    this.isEmpbranch=false;
    this.isEMpbranchsummary=false;
    this.isEmpbranchEdit=true;
    this.ismakerCheckerButton=false;
    this.shareService.branchmstid.next(data['id']);
  }
  autocompleteToScroll() {
    setTimeout(() => {
      if (
        this.matToAutocomplete &&
        this.autocompleteTrigger &&
        this.matToAutocomplete.panel
      ) {
        fromEvent(this.matToAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matToAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matToAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matToAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matToAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            // console.log('fetchmoredata1', scrollTop, elementHeight, scrollHeight, atBottom);
            if (atBottom) {
              // fetch more data
              // console.log('fetchmoredata');
              // console.log(this.employeeToInput.nativeElement.value);
              if (this.has_next === true) {
                this.memoService.get_EmployeeList(this.employeeToInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.allEmployeeList = this.allEmployeeList.concat(datas);
                    // console.log("toempss", datas)
                    if (this.allEmployeeList.length >= 0) {
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
  public displayTo(empto?: iEmployeeList): string | undefined {
    return empto ? empto.full_name : undefined;
  }

  get empto() {
    return this.memoAddForm.get('to_emp');
  }
  public removeEmployeeTo(employee: iEmployeeList): void {
    const index = this.chipSelectedEmployeeTo.indexOf(employee);
    if (index >= 0) {
      this.chipSelectedEmployeeTo.splice(index, 1);
      // console.log(this.chipSelectedEmployeeTo);
      this.chipSelectedEmployeeToid.splice(index, 1);
      // console.log(this.chipSelectedEmployeeToid);
      this.employeeToInput.nativeElement.value = '';
    }
    if (index === 0) {
      this.permissionArray = []
    }

  }

  public employeeToSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeToByName(event.option.value.full_name);
    this.employeeToInput.nativeElement.value = '';
  }
  private selectEmployeeToByName(employeeName) {
    let foundEmployeeCC1 = this.chipSelectedEmployeeTo.filter(employeecc => employeecc.full_name == employeeName);
    if (foundEmployeeCC1.length) {
      return;
    }
    let foundEmployeeCC = this.allEmployeeList.filter(employeecc => employeecc.full_name == employeeName);
    if (foundEmployeeCC.length) {
      this.chipSelectedEmployeeTo.push(foundEmployeeCC[0]);
      this.chipSelectedEmployeeToid.push(foundEmployeeCC[0].id)
    }
    if (this.chipSelectedEmployeeTo.length > 1) {
      alert("select one value")
    }
    this.employeeIdValue = this.chipSelectedEmployeeToid;
  }
  empactiveinactive(data:any){
    // this.SpinnerService.show()
    let employee:any={'id':data.id,'status':data.status};
    this.mastersErvice.getempactive(employee).subscribe(res=>{
      if(res['status']=='success'){
        this.notification.showSuccess(res['message']);
        let filter = "", sortOrder = 'asc',pageNumber = 1, pageSize = 10;
        this.mastersErvice.getEmployee(filter, sortOrder, pageNumber, pageSize)
    }
      else{
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )
  }
  permissionDelete(data) {
    var answer = window.confirm("Remove permission?");
    if (answer) {
      //some code
    }
    else {
      return false;
    }
    this.mastersErvice.removePermission(data, this.employeeIdValue)
      .subscribe(result => {
        this.notification.showSuccess(result.message)
        this.permissionArray = [];
        this.getPermissionList(this.employeeIdValue)
        // console.log("ssPOOOOOOO", result)
      })
  }
  expsubmit(data:any){
    this.getsectorsummary(1);
    this.ismakerCheckerButton=false;
    this.isExp=false;
    this.isExpEdit=true;
    this.isExpform=false;
    this.shareService.expEdit.next(data);
  }
  ExpCancel() {
    this.isExpform = false;
    this.ismakerCheckerButton = true;
    this.isExp = true;
    this.isExpEdit=false;
  }
  getexpsummarysearch(page:any){
    let d:any;
    if(this.expForm.get('name').value==undefined || this.expForm.get('name').value=='' || this.expForm.get('name').value==null){
      d=''
    }
    else{
      d=this.expForm.get('name').value;
    }
    let status:any=this.drpdwn[this.expForm.get('drop').value?this.expForm.get('drop').value:'ALL'];
    this.SpinnerService.show();
    this.mastersErvice.expencesummarydata(page,d,2).subscribe(data=>{
      this.SpinnerService.hide();
      this.explist=data['data'];
      let pagination=data['pagination'];
      this.has_expnext=pagination.has_next;
      this.has_expprevious=pagination.has_previous;
      this.has_exppage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    )
  }
  getexpsummarysearch_new(){
    let d:any;
    if(this.expForm.get('name').value==undefined || this.expForm.get('name').value=='' || this.expForm.get('name').value==null){
      d=''
    }
    else{
      d=this.expForm.get('name').value;
    }
    let status:any=this.drpdwn[this.expForm.get('drop').value?this.expForm.get('drop').value:'ALL'];
    this.SpinnerService.show();
    this.mastersErvice.expencesummarydata(1,d,status).subscribe(data=>{
      this.SpinnerService.hide();
      this.explist=data['data'];
      // let pagination=data['pagination'];
      // this.has_expnext=pagination.has_next;
      // this.has_expprevious=pagination.has_previous;
      // this.has_exppage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    )
  }
  getexpsummarysearch_reset(page:any){
    this.expForm.reset('');
    let d:any;
    if(this.expForm.get('name').value==undefined || this.expForm.get('name').value=='' || this.expForm.get('name').value==null){
      d=''
    }
    else{
      d=this.expForm.get('name').value;
    }
    this.SpinnerService.show();
    this.mastersErvice.expencesummarydata( this.has_exppage,d,2).subscribe(data=>{
      this.SpinnerService.hide();
      this.explist=data['data'];
      let pagination=data['pagination'];
      this.has_expnext=pagination.has_next;
      this.has_expprevious=pagination.has_previous;
      this.has_exppage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    );
  }
  exp_previous(){
    if(this.has_expprevious){
      this.getexpsummary(this.has_exppage-1);
    }
  }

  ExpSubCancel() {
    this.isExpEdit = false;
    this.isExp = true;
    this.ismakerCheckerButton = true;
    this.isExpform=false;
    this.getexpsummary(1);
  }
  getexpsummary(page:any){
    let d:any;
    if(this.expForm.get('name').value==undefined || this.expForm.get('name').value=='' || this.expForm.get('name').value==null){
      d=''
    }
    else{
      d=this.expForm.get('name').value;
    }
    this.mastersErvice.expencesummarydata(page,d,2).subscribe(data=>{
      this.explist=data['data'];
      let pagination=data['pagination'];
      this.has_expnext=pagination.has_next;
      this.has_expprevious=pagination.has_previous;
      this.has_exppage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    );
  }
  exp_next(){
    if(this.has_expnext){
      this.getexpsummary(this.has_exppage+1);
    }
  }
  getentitysummarysearch(page:any){
    let d:any;
    if(this.entityForm.get('name').value==undefined || this.entityForm.get('name').value==null || this.entityForm.get('name').value==''){
      d=''
    }
    else{
      d=this.entityForm.get('name').value;
    }
    this.SpinnerService.show();
    this.mastersErvice.getentitysummary(page,d).subscribe(data=>{
      this.SpinnerService.hide();
      this.entitylist=data['data'];
      let pagination=data['pagination'];
      this.has_entitynext=pagination.has_next;
      this.has_entityprevious=pagination.has_previous;
      this.has_entitypage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    )
  }
  getentitysummarysearch_new(page:any){
    let d:any;
    if(this.entityForm.get('name').value==undefined || this.entityForm.get('name').value==null || this.entityForm.get('name').value==''){
      d=''
    }
    else{
      d=this.entityForm.get('name').value;
    }
    this.SpinnerService.show();
    this.mastersErvice.getentitysummarysearch_new(page,d).subscribe(data=>{
      this.SpinnerService.hide();
      this.entitylist=data['data'];
      let pagination=data['pagination'];
      this.has_entitynext=pagination.has_next;
      this.has_entityprevious=pagination.has_previous;
      this.has_entitypage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    )
  }
  getentitysummarysearch_new_reset(page:any){
    this.entityForm.reset('');
    let d:any;
    if(this.entityForm.get('name').value==undefined || this.entityForm.get('name').value==null || this.entityForm.get('name').value==''){
      d=''
    }
    else{
      d=this.entityForm.get('name').value;
    }
    this.SpinnerService.show();
    this.mastersErvice.getentitysummarysearch_new(page,d).subscribe(data=>{
      this.SpinnerService.hide();
      this.entitylist=data['data'];
      let pagination=data['pagination'];
      this.has_entitynext=pagination.has_next;
      this.has_entityprevious=pagination.has_previous;
      this.has_entitypage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    );
  }
  Entityactiveinactive(e:any){
    let data:any={
      'id':e.id,
      'status':e.status
,    };
    this.mastersErvice.getentityactiveinactive(data).subscribe(res=>{
      if(res['status']=='success'){
        this.notification.showSuccess(res['message']);
        this.getentitysummarysearch(1);
      }
      else{
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )

  }
  entity_previous(){
    if(this.has_entityprevious){
      this.getentitysummarysearch(this.has_entitypage-1);
    }
  }
  entity_next(){
    if(this.has_entitynext){
      this.getentitysummarysearch(this.has_entitypage+1);
    }
  }
  entitySubmit(){
    this.isEntity=true;
    this.isEntityEdit=false;
    this.isEntityForm=false;
  }
  entityCancel(){
    this.isEntity=true;
    this.isEntityEdit=false;
    this.isEntityForm=false;
  }
  getfinsummarysearch(page:any){
    let d:any='page='+this.has_Finpage;
    if(this.finForm.get('year').value !=undefined && this.finForm.get('year').value !=null && this.finForm.get('year').value !=''){
      d=d+'&year='+this.datepipe.transform(this.finForm.get('year').value,'yyyy');
    }
    if(this.finForm.get('month').value !=undefined && this.finForm.get('month').value !=null && this.finForm.get('month').value !=''){
      d=d+'&month='+this.datepipe.transform(this.finForm.get('month').value,'MM');
    }
    if(this.finForm.get('drop').value !=undefined && this.finForm.get('drop').value !=null && this.finForm.get('drop').value !=''){
      d=d+'&status='+this.drpdwn[this.finForm.get('drop').value?this.finForm.get('drop').value:'ALL'];
    }
    this.SpinnerService.show();
    this.mastersErvice.getfinyearsummary(d).subscribe(data=>{
      this.SpinnerService.hide();
      this.Finlist=data['data'];
      let pagination=data['pagination'];
      this.has_Finnext=pagination.has_next;
      this.has_Finprevious=pagination.has_previous;
      this.has_Finpage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    )
  }
  resetfindata(){
    this.finForm.controls['year'].reset('');
    this.finForm.controls['month'].reset('');
    this.finForm.controls['drop'].reset('');
    this.getfinsummarysearch(this.has_Finpage);
  }
  getfinsummarysearch_search(page:any){
    let d:any='page='+1;
    if(this.finForm.get('year').value !=undefined && this.finForm.get('year').value !=null && this.finForm.get('year').value !=''){
      d=d+'&year='+this.datepipe.transform(this.finForm.get('year').value,'yyyy');
    }
    if(this.finForm.get('month').value !=undefined && this.finForm.get('month').value !=null && this.finForm.get('month').value !=''){
      d=d+'&month='+this.datepipe.transform(this.finForm.get('month').value,'MM');
    }
    if(this.finForm.get('drop').value !=undefined && this.finForm.get('drop').value !=null && this.finForm.get('drop').value !=''){
      d=d+'&status='+this.drpdwn[this.finForm.get('drop').value?this.finForm.get('drop').value:'ALL'];
    }
    this.SpinnerService.show();
    this.mastersErvice.getfinyearsummary(d).subscribe(data=>{
      this.SpinnerService.hide();
      this.Finlist=data['data'];
      let pagination=data['pagination'];
      // this.has_Finnext=pagination.has_next;
      // this.has_Finprevious=pagination.has_previous;
      // this.has_Finpage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    )
  }
  getfinquatersummarysearch(page:any){
    let d:any='page='+this.has_FinQpage;
    if(this.finquaterform.get('year').value !=undefined && this.finquaterform.get('year').value !=null && this.finquaterform.get('year').value !=''){
      d=d+'&year='+this.datepipe.transform(this.finquaterform.get('year').value,'yyyy');
    }
    if(this.finquaterform.get('month').value !=undefined && this.finquaterform.get('month').value !=null && this.finquaterform.get('month').value !=''){
      d=d+'&month='+this.datepipe.transform(this.finquaterform.get('month').value,'MM');
    }
    if(this.finquaterform.get('drop').value !=undefined && this.finquaterform.get('drop').value !=null && this.finquaterform.get('drop').value !=''){
      d=d+'&status='+this.drpdwn[this.finquaterform.get('drop').value?this.finquaterform.get('drop').value:'ALL'];
    }
    this.SpinnerService.show();
    this.mastersErvice.getfinQuateryearsummary(d).subscribe(data=>{
      this.SpinnerService.hide();
      this.FinQlist=data['data'];
      let pagination=data['pagination'];
      this.has_FinQnext=pagination.has_next;
      this.has_FinQprevious=pagination.has_previous;
      this.has_FinQpage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    )
  }
  resetfinqdata(){
    this.finquaterform.controls['year'].reset('');
    this.finquaterform.controls['month'].reset('');
    this.finquaterform.controls['drop'].reset('');
    this.getfinquatersummarysearch( this.has_FinQpage);
  }
  getfinquatersummarysearch_search(page:any){
    let d:any='page='+1;
    if(this.finquaterform.get('year').value !=undefined && this.finquaterform.get('year').value !=null && this.finquaterform.get('year').value !=''){
      d=d+'&year='+this.datepipe.transform(this.finquaterform.get('year').value,'yyyy');
    }
    if(this.finquaterform.get('month').value !=undefined && this.finquaterform.get('month').value !=null && this.finquaterform.get('month').value !=''){
      d=d+'&month='+this.datepipe.transform(this.finquaterform.get('month').value,'MM');
    }
    if(this.finquaterform.get('drop').value !=undefined && this.finquaterform.get('drop').value !=null && this.finquaterform.get('drop').value !=''){
      d=d+'&status='+this.drpdwn[this.finquaterform.get('drop').value?this.finquaterform.get('drop').value:'ALL'];
    }
    this.SpinnerService.show();
    this.mastersErvice.getfinQuateryearsummary(d).subscribe(data=>{
      this.SpinnerService.hide();
      this.FinQlist=data['data'];
      let pagination=data['pagination'];
      // this.has_FinQnext=pagination.has_next;
      // this.has_FinQprevious=pagination.has_previous;
      // this.has_FinQpage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    )
  }
  getglactive(data:any){
    let d:any={'id':data.id,'status':data.status};
    this.mastersErvice.getcbsglactive(data).subscribe(res=>{
      if(res['status']=='success'){
        this.notification.showSuccess(res['message']);
        this.getGL(1);
      }
      else{
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )
  }
  Finedit(data:any){
    this.isFinForm=true;
    this.isFin=false;
    this.isFinEdit=false;
    this.shareService.finedit.next(data);
    return true;
  }
  Finactiveinactive(e:any){
    let data:any={
      'id':e.id,
      'status':e.status
,    };
    this.mastersErvice.getfinyearactiveinactive(data).subscribe(res=>{
      if(res['status']=='success'){
        this.notification.showSuccess(res['message']);
        this.getfinsummarysearch(1);
      }
      else{
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )

  }
  clientEdit(data:any){
    this.isClientForm=false;
    this.isClient=false;
    this.isClientEdit=true;
    this.shareService.clientedit.next(data);
    return true;
  }
  clientActiveInactive(d:any){
    let data:any={
      'id':d.id,
      'status':d.status
,    };
    this.mastersErvice.getclientactiveinactive(data).subscribe(res=>{
      if(res['status']=='success'){
        this.notification.showSuccess(res['message']);
        this.getclientsummary(1);
      }
      else{
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )

  }
  FinQactiveinactive(e:any){
    let data:any={
      'id':e.id,
      'status':e.status
,    };
    this.mastersErvice.getfinQyearactiveinactive(data).subscribe(res=>{
      if(res['status']=='success'){
        this.notification.showSuccess(res['message']);
        this.getfinquatersummarysearch(1);
      }
      else{
        this.notification.showError(res['code']);
        this.notification.showError(res['description']);
      }
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )

  }
  FinQuateredit(data:any){
    this.isFinQForm=true;
    this.isFinQ=false;
    this.isFinQEdit=false;
    this.shareService.finquateredit.next(data);
    return true;
  }
  fin_next(){
    if(this.has_Finnext){
      this.has_Finpage=this.has_Finpage+1;
      this.getfinsummarysearch(this.has_Finpage);
    }
  }
  finQ_next(){
    if(this.has_FinQnext){
      this.has_FinQpage=this.has_FinQpage+1
      this.getfinquatersummarysearch(this.has_FinQpage);
    }
  }
  fin_previous(){
    if(this.has_Finprevious){
      this.has_Finpage=this.has_Finpage-1;
      this.getfinsummarysearch(this.has_Finpage);
    }
  }
  finQ_previous(){
    if(this.has_FinQprevious){
      this.has_FinQpage=this.has_FinQpage-1;
      this.getfinquatersummarysearch(this.has_FinQpage);
    }
  }
  app_next(){
    if(this.has_appnext){
      this.getappversionsummary(this.has_apppage+1);
    }
  }
  app_previous(){
    if(this.has_appprevious){
      this.getappversionsummary(this.has_apppage-1);
    }
  }
  FinSubmit() {
    this.getfinsummarysearch(1);
    this.ismakerCheckerButton = true;
    this.isFin = true;
    this.isFinForm = false;
    this.isFinEdit = false;
  }
  FinQSubmit() {
    this.getfinsummarysearch(1);
    this.ismakerCheckerButton = true;
    this.isFinQ = true;
    this.isFinQForm = false;
    this.isFinQEdit = false;
  }
  fincancel() {
    this.ismakerCheckerButton = true;
    this.isFin = true;
    this.isFinForm = false;
    this.isFinEdit = false;
  }
  finQcancel() {
    this.ismakerCheckerButton = true;
    this.isFinQ = true;
    this.isFinQForm = false;
    this.isFinQEdit = false;
  }
  departmentViewCancel() {
    this.isDepartment = true;
    this.getDepartmentList();
    this.isDepartmentView = false;
    this.ismakerCheckerButton=true;
  }
  employeeViewSubmit() {
    this.getEmployee();
    this.isEmployeeViewForm = false;
    this.isEmployee = true;
    this.isEmployeeEdit=false;
    this.isEmployeeform=true;
  }
  getrisksummarysearch_new(page:any){
    let d:any;
    if(this.riskForm.get('name').value==undefined || this.riskForm.get('name').value==null || this.riskForm.get('name').value==''){
      d=''
    }
    else{
      d=this.riskForm.get('name').value;
    }
    this.mastersErvice.getrisksummarysearch_new(page,d).subscribe(data=>{
      this.riskList=data['data'];
      let pagination=data['pagination'];
      this.has_risknext=pagination.has_next;
      this.has_riskprevious=pagination.has_previous;
      this.has_riskpage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    )
  }
  getrisksummary_new(){
    let d:any;
    if(this.riskForm.get('name').value==undefined || this.riskForm.get('name').value==null || this.riskForm.get('name').value==''){
      d=''
    }
    else{
      d=this.riskForm.get('name').value;
    }
    this.SpinnerService.show();
    this.mastersErvice.getrisksummarysearch_new(1,d).subscribe(data=>{
      this.SpinnerService.hide();
      this.riskList=data['data'];
      let pagination=data['pagination'];
      // this.has_risknext=pagination.has_next;
      // this.has_riskprevious=pagination.has_previous;
      // this.has_riskpage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    );
  }
  getrisksummarysearch_new_reset(page:any){
    this.riskForm.reset('');
    let d:any;
    if(this.riskForm.get('name').value==undefined || this.riskForm.get('name').value==null || this.riskForm.get('name').value==''){
      d=''
    }
    else{
      d=this.riskForm.get('name').value;
    }
    this.SpinnerService.show();
    this.mastersErvice.getrisksummarysearch_new(this.has_riskpage,d).subscribe(data=>{
      this.SpinnerService.hide();
      this.riskList=data['data'];
      let pagination=data['pagination'];
      this.has_risknext=pagination.has_next;
      this.has_riskprevious=pagination.has_previous;
      this.has_riskpage=pagination.index;
    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    )
  }
  autocompleteDeptScroll() {
    setTimeout(() => {
      if (
        this.matAutocompleteDept &&
        this.autocompleteTrigger &&
        this.matAutocompleteDept.panel
      ) {
        fromEvent(this.matAutocompleteDept.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompleteDept.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompleteDept.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteDept.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteDept.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.memoService.getDepartmentPage(this.employeeDeptInput.nativeElement.value, this.currentpage + 1, '')
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.departmentList1 = this.departmentList1.concat(datas);
                    if (this.departmentList1.length >= 0) {
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
  departmentSelected(data) {
    this.departmentId = data;
  }
  getsectorsummary(page){
    let d:any;
    if(this.sectorForm.get('name').value==undefined || this.sectorForm.get('name').value=='' || this.sectorForm.get('name').value==null){
      d='';
    }
    else{
      d=this.sectorForm.get('name').value;
    }
    let status:any=this.drpdwn[this.sectorForm.get('drop').value?this.sectorForm.get('drop').value:'ALL'];
    this.SpinnerService.show();
    this.mastersErvice.getsectorsummary(d,page,status).subscribe(data=>{
      this.SpinnerService.hide();
      this.sectorlist=data['data'];
      let pagination=data['pagination'];
      this.has_sectornext=pagination.has_next;
      this.has_sectorprevious=pagination.has_previous;
      this.has_sectorpage=pagination.index;
    },
    (error)=>{
      this.SpinnerService.hide();
    })
  }
  getsectorsummary_search(page){
    let d:any;
    if(this.sectorForm.get('name').value==undefined || this.sectorForm.get('name').value=='' || this.sectorForm.get('name').value==null){
      d='';
    }
    else{
      d=this.sectorForm.get('name').value;
    }
    let status:any=this.drpdwn[this.sectorForm.get('drop').value?this.sectorForm.get('drop').value:'ALL'];
    this.SpinnerService.show();
    this.mastersErvice.getsectorsummary(d,page,status).subscribe(data=>{
      this.SpinnerService.hide();
      this.sectorlist=data['data'];
      let pagination=data['pagination'];
      // this.has_sectornext=pagination.has_next;
      // this.has_sectorprevious=pagination.has_previous;
      // this.has_sectorpage=pagination.index;
    },
    (error)=>{
      this.SpinnerService.hide();
    })
  }
  nextsector(){
    if(this.has_sectornext){
      this.has_sectorpage=this.has_sectorpage+1;
      this.getsectorsummary(this.has_sectorpage);
    }
  }
  previoussector(){
    if(this.has_sectorprevious){
      this.has_sectorpage=this.has_sectorpage-1;
      this.getsectorsummary(this.has_sectorpage);
    }
  }
  getsectorsummary_reset(page){
    this.sectorForm.reset('');
    let d:any;
    if(this.sectorForm.get('name').value==undefined || this.sectorForm.get('name').value=='' || this.sectorForm.get('name').value==null){
      d='';
    }
    else{
      d=this.sectorForm.get('name').value;
    }
    let status:any=this.drpdwn[this.sectorForm.get('drop').value?this.sectorForm.get('drop').value:'ALL'];
    this.SpinnerService.show();
    this.mastersErvice.getsectorsummary(d, this.has_sectorpage,status).subscribe(data=>{
      this.SpinnerService.hide();
      this.sectorlist=data['data'];
      let pagination=data['pagination'];
      this.has_sectornext=pagination.has_next;
      this.has_sectorprevious=pagination.has_previous;
      this.has_sectorpage=pagination.index;
    },
    (error)=>{
      this.SpinnerService.hide();
    });
  }
  // risk

  getrisksummary(pageNumber = 1, pageSize = 10){
    // let dta:any;
    // if(this.designationform.get('name').value=='' || this.designationform.get('name').value==undefined || this.designationform.get('name').value==null){
    //   dta='';
    // }
    // else{
    //   dta=this.designationform.get('name').value;
    // }
   this.SpinnerService.show();
    this.mastersErvice.getRiskList_master(pageNumber, pageSize).subscribe(data=>{
      this.SpinnerService.hide();
      this.riskList=data['data'];
      let pagination=data['pagination'];
      this.has_risknext=pagination.has_next;
      this.has_riskprevious=pagination.has_previous;
      this.has_riskpage=pagination.index;

    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    );
  }
  has_riskclicknext(){
    if(this.has_risknext){
      this.getrisksummary(this.has_riskpage+1,10);
    }
  }
  has_riskclickprevoius(){
    if(this.has_riskprevious){
      this.getrisksummary(this.has_riskpage-1,10);
    }
  }
  getdesignationsummary(page,data){
    let dta:any;
    if(this.designationform.get('name').value=='' || this.designationform.get('name').value==undefined || this.designationform.get('name').value==null){
      dta='';
    }
    else{
      dta=this.designationform.get('name').value;
    }
   this.SpinnerService.show();
    this.mastersErvice.getdesignationsummary(dta,page).subscribe(data=>{
      this.SpinnerService.hide();
      this.designationList=data['data'];
      let pagination=data['pagination'];
      this.has_designationnext=pagination.has_next;
      this.has_designationprevious=pagination.has_previous;
      this.has_designationpage=pagination.index;

    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    );
    return true;
  }
  getdesignationsummary_reset(page,data){
    this.designationform.reset('');
    let dta:any;
    if(this.designationform.get('name').value=='' || this.designationform.get('name').value==undefined || this.designationform.get('name').value==null){
      dta='';
    }
    else{
      dta=this.designationform.get('name').value;
    }
   
    this.mastersErvice.getdesignationsummary(dta,page).subscribe(data=>{
      this.designationList=data['data'];
      let pagination=data['pagination'];
      this.has_designationnext=pagination.has_next;
      this.has_designationprevious=pagination.has_previous;
      this.has_designationpage=pagination.index;

    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
    }
    );
  }
  getdesignationsummarysearch(){
    let dta:any;
    if(this.designationform.get('name').value=='' || this.designationform.get('name').value==undefined || this.designationform.get('name').value==null){
      dta='';
    }
    else{
      dta=this.designationform.get('name').value;
    }
    this.SpinnerService.show();
    this.mastersErvice.getdesignationsearch(1,dta).subscribe(data=>{
      this.SpinnerService.hide();
      this.designationList=data['data'];
      let pagination=data['pagination'];
      // this.has_designationnext=pagination.has_next;
      // this.has_designationprevious=pagination.has_previous;
      // this.has_designationpage=pagination.index;

    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    );
  }
  getdesignationsummarysearch_reset(){
    this.designationform.reset('');
    let dta:any;
    if(this.designationform.get('name').value=='' || this.designationform.get('name').value==undefined || this.designationform.get('name').value==null){
      dta='';
    }
    else{
      dta=this.designationform.get('name').value;
    }
   this.SpinnerService.show();
    this.mastersErvice.getdesignationsearch(this.has_designationpage,dta).subscribe(data=>{
      this.SpinnerService.hide();
      this.designationList=data['data'];
      let pagination=data['pagination'];
      this.has_designationnext=pagination.has_next;
      this.has_designationprevious=pagination.has_previous;
      this.has_designationpage=pagination.index;

    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    );
  }
  has_designationclicknext(){
    if(this.has_designationnext){
      this.has_designationpage +=1;
      // this.getdesignationsummarysearch();
      this.getdesignationsummary(this.has_designationpage,'')
    }
  }
  has_designationclickprevoius(){
    if(this.has_designationprevious){
      this.has_designationpage -=1;
      // this.getdesignationsummarysearch();
      this.getdesignationsummary(this.has_designationpage,1)
    }
  }
  designationedit(data:any){
    this.designationeditform=true;
    this.isDesignation=false;
    this.isDesignationForm=false;
    this.shareService.designationValue.next(data);
    return true;
  }
  riskedit(data:any){
    this.riskeditform=true;
    this.isRisk=false;
    this.isRiskForm=false;
    this.shareService.riskValue.next(data);
    return true;
  }
  has_sectorclicknext(){
    if(this.has_sectornext){
      this.getsectorsummary(this.has_sectorpage+1);
    }
  }
  has_sectorclickprevoius(){
    if(this.has_sectorprevious){
      this.getsectorsummary(this.has_sectorpage-1);
    }
  }
  sectoredit(data:any){
    this.isSector=false;
    this.isSector=false;
    this.isSectorEdit=true;
    this.isSectorform=false;
    this.shareService.sectorEdit.next(data);
    return true;
  }
  expenceedit(data:any){
    this.isExp=false;
    this.isExpEdit=true;
    // this.isSectorEdit=true;
    this.isExpform=false;
    this.shareService.sectorEdit.next(data);
    return true;
  }
  deptView() {
    if(this.AddForm.get('ctrldepartment').value.id==undefined || this.AddForm.get('ctrldepartment').value=='' || this.AddForm.get('ctrldepartment').value.id==null || this.AddForm.get('ctrldepartment').value==''){
      this.notification.showError("Please Select The Valid Department");
      return false;
    }
    this.isDepartment = false;
    this.ismakerCheckerButton = false;
    this.isDepartmentView = true
    this.sharedService.departmentView.next(this.departmentId)
  }
  departmentreset(){
    this.AddForm.reset('');
    this.memoService.getDepartmentPage('', 1, '').subscribe(data=>{
      this.departmentList1=data['data'];
    });
  }
  public displayFn(department?: Department): string | undefined {
    return department ? department.name : undefined;
  }
  get department() {
    return this.AddForm.get('ctrldepartment');
  }

  getStateList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      this.SpinnerService.show();
    this.mastersErvice.getStateList(filter, sortOrder, this.currentpage, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.stateList = datas;
        for (let i = 0; i < this.stateList.length; i++) {
          let ci = this.stateList[i].country_id
          if (ci == undefined) {
            this.stateList[i]['country_name'] = ''
          } else {
            this.stateList[i]['country_name'] = ci.name;
          };
        }
        let datapagination = results["pagination"];
        this.stateList = datas;
        if (this.stateList.length >= 0) {
          this.shas_next = datapagination.has_next;
          this.shas_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      },
      (error)=>{
        this.SpinnerService.hide();
      });
  }
  getStateList_reset(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.sform.reset('');
    this.SpinnerService.show();
  this.mastersErvice.getStateList(filter, sortOrder, this.currentpage, pageSize)
    .subscribe((results: any[]) => {
      this.SpinnerService.hide();
      let datas = results["data"];
      this.stateList = datas;
      for (let i = 0; i < this.stateList.length; i++) {
        let ci = this.stateList[i].country_id
        if (ci == undefined) {
          this.stateList[i]['country_name'] = ''
        } else {
          this.stateList[i]['country_name'] = ci.name;
        };
      }
      let datapagination = results["pagination"];
      this.stateList = datas;
      if (this.stateList.length >= 0) {
        this.shas_next = datapagination.has_next;
        this.shas_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      }

    },
    (error)=>{
      this.SpinnerService.hide();
    })
}
  nextClickState() {
    if (this.shas_next === true) {
      this.currentpage +=1;
      // this.ssearch();
      this.getStateList();
    }
  }

  previousClickState() {
    if (this.shas_previous === true) {
      this.currentpage -=1;
      // this.ssearch();
      this.getStateList();
    }
  }
  stateEdit(data: any) {
    this.shareService.stateEditValue.next(data)
    this.isStateEditForm = true;
    this.ismakerCheckerButton = false;
    this.isState = false;
    return data;
  }
  deleteState(data) {
    let value = data.id
    // console.log("deletestate", value)
    this.mastersErvice.stateDeleteForm(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        return true

      })
  }

  getDistrictList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      this.SpinnerService.show();
    this.mastersErvice.getDistrictList(filter, sortOrder, this.dcurrentpage, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.districtList = datas;
        for (let i = 0; i < this.districtList.length; i++) {
          let si = this.districtList[i].state_id
          if (si == undefined) {
            this.districtList[i].state_name = ''
          } else {
            this.districtList[i].state_name = si.name
          };
        }
        let datapagination = results["pagination"];
        this.districtList = datas;
        if (this.districtList.length >= 0) {
          this.dhas_next = datapagination.has_next;
          this.dhas_previous = datapagination.has_previous;
          this.dcurrentpage = datapagination.index;
        }

      },
      (error)=>{
        this.SpinnerService.hide();
      })
  }

  getappversionsummary(pageNumber = 1, pageSize = 10){
   this.SpinnerService.show();
    let d = this.appVersionForm.get('no').value;
    let i = this.appVersionForm.get('remarks').value;
    let status:any=this.drpdwn[this.appVersionForm.get('drop').value?this.appVersionForm.get('drop').value:'ALL'];
    this.mastersErvice.getAppVersionMaster(this.has_apppage, pageSize, d, i,status).subscribe(data=>{
      console.log('san',data)
      this.appdataList=data['data'];
      this.SpinnerService.hide();
      let pagination=data['pagination'];
      this.has_appnext=pagination.has_next;
      this.has_appprevious=pagination.has_previous;
      this.has_apppage=pagination.index;

    },
    (error)=>{
      this.notification.showError(error.status+error.statusText);
      this.SpinnerService.hide();
    }
    );
  }
  getappversionsummarysearch(){
    this.SpinnerService.show();
     let d = this.appVersionForm.get('no').value;
     let i = this.appVersionForm.get('remarks').value;
     let status:any=this.drpdwn[this.appVersionForm.get('drop').value?this.appVersionForm.get('drop').value:'ALL'];
     this.mastersErvice.getAppVersionMaster(this.has_apppage, 10, d, i,status).subscribe(data=>{
       console.log('san',data)
       this.appdataList=data['data'];
       this.SpinnerService.hide();
       let pagination=data['pagination'];
      //  this.has_appnext=pagination.has_next;
      //  this.has_appprevious=pagination.has_previous;
      //  this.has_apppage=pagination.index;
 
     },
     (error)=>{
       this.notification.showError(error.status+error.statusText);
       this.SpinnerService.hide();
     }
     );
   }
  resetappversion(){
    this.appVersionForm.controls['no'].reset('');
    this.appVersionForm.controls['remarks'].reset('');
    this.appVersionForm.controls['drop'].reset('');
    this.getappversionsummary(this.has_apppage,10);
  }
  client_next(){
    if(this.has_clientnext){
      this.has_clientpage=this.has_clientpage+1;
      this.getclientsummary(this.has_clientpage,10);
    }
  }
  client_previous(){
    if(this.has_clientprevious){
      this.has_clientpage=this.has_clientpage-1;
      this.getclientsummary(this.has_clientpage,10);
    }
  }
  getclientsummary(pageNumber = 1, pageSize = 10){
    this.SpinnerService.show();
     let d = this.clientForm.get('code').value
     let i = this.clientForm.get('name').value
     this.mastersErvice.getClientMaster(this.has_clientpage, pageSize, d, i,2).subscribe(data=>{
       this.clientList=data['data'];
       this.SpinnerService.hide();
       let pagination=data['pagination'];
       this.has_clientnext=pagination.has_next;
       this.has_clientprevious=pagination.has_previous;
       this.has_clientpage=pagination.index;
 
     },
     (error)=>{
      this.SpinnerService.hide();
      this.notification.showError(error.status+error.statusText);
     }
     );
   }
   getclientsummary_search(){
   
     let d = this.clientForm.get('code').value;
     let i = this.clientForm.get('name').value;
     let status:any=this.drpdwn[this.clientForm.get('drop').value?this.clientForm.get('drop').value:'ALL'];
     this.SpinnerService.show();
     this.mastersErvice.getClientMaster( 1, 10, d, i,status).subscribe(data=>{
       this.clientList=data['data'];
       this.SpinnerService.hide();
       let pagination=data['pagination'];
      //  this.has_clientnext=pagination.has_next;
      //  this.has_clientprevious=pagination.has_previous;
      //  this.has_clientpage=pagination.index;
 
     },
     (error)=>{
      this.SpinnerService.hide();
      this.notification.showError(error.status+error.statusText);
     }
     );
   }
  getDistrictList_reset(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.districtform.reset('');
    this.SpinnerService.show();
  this.mastersErvice.getDistrictList(filter, sortOrder, this.dcurrentpage, pageSize)
    .subscribe((results: any[]) => {
      this.SpinnerService.hide();
      let datas = results["data"];
      this.districtList = datas;
      for (let i = 0; i < this.districtList.length; i++) {
        let si = this.districtList[i].state_id
        if (si == undefined) {
          this.districtList[i].state_name = ''
        } else {
          this.districtList[i].state_name = si.name
        };
      }
      let datapagination = results["pagination"];
      this.districtList = datas;
      if (this.districtList.length >= 0) {
        this.dhas_next = datapagination.has_next;
        this.dhas_previous = datapagination.has_previous;
        this.dcurrentpage = datapagination.index;
      }

    },
    (error)=>{
      this.SpinnerService.hide();
    });
}

appversionactiveinactive(e:any){
  let data:any={
    'id':e.id,
    'status':e.status
,    };
  this.mastersErvice.getfinyearactiveinactive(data).subscribe(res=>{
    if(res['status']=='success'){
      this.notification.showSuccess(res['message']);
      this.getfinsummarysearch(1);
    }
    else{
      this.notification.showError(res['code']);
      this.notification.showError(res['description']);
    }
  },
  (error)=>{
    this.notification.showError(error.status+error.statusText);
  }
  )

}

  nextClickDistrict() {
    if (this.dhas_next === true) {
      this.dcurrentpage +=1;
      this.getDistrictList();
      // this.dsearch();
    }
  }

  previousClickDistrict() {
    if (this.dhas_previous === true) {
      this.dcurrentpage -=1;
      this.getDistrictList();
      // this.dsearch();
    }
  }
  districtEdit(data: any) {
    this.shareService.districtEditValue.next(data)
    this.isDistrictEditForm = true;
    this.ismakerCheckerButton = false;
    this.isDistrict = false;
    return data;
  }
  deleteDistrict(data) {
    let value = data.id
    // console.log("deletedistrict", value)
    this.mastersErvice.districtDeleteForm(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        return true

      })
  }

  getCityList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      this.SpinnerService.show();
    this.mastersErvice.getCityList(filter, sortOrder, this.ccurrentpage, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.cityList = datas;
        for (let i = 0; i < this.cityList.length; i++) {
          let si = this.cityList[i].state_id
          if (si == undefined) {
            this.cityList[i].state_name = ''
          } else {
            this.cityList[i].state_name = si.name
          };
        }
        let datapagination = results["pagination"];
        for(let i=0;i<this.cityList.length;i++){
          this.cityList[i]['con']=false;
        }
        this.cityList = datas;
        if (this.cityList.length >= 0) {
          this.chas_next = datapagination.has_next;
          this.chas_previous = datapagination.has_previous;
          this.currentpage = datapagination.index;
        }

      },
      (error)=>{
        this.SpinnerService.hide();
      })
  }
  getCityList_reset(filter = "", sortOrder = 'asc',
  pageNumber = 1, pageSize = 10) {
    this.cityform.reset('');
    this.SpinnerService.show();
  this.mastersErvice.getCityList(filter, sortOrder,  this.ccurrentpage, pageSize)
    .subscribe((results: any[]) => {
      this.SpinnerService.hide();
      let datas = results["data"];
      this.cityList = datas;
      for (let i = 0; i < this.cityList.length; i++) {
        let si = this.cityList[i].state_id
        if (si == undefined) {
          this.cityList[i].state_name = ''
        } else {
          this.cityList[i].state_name = si.name
        };
      }
      let datapagination = results["pagination"];
      for(let i=0;i<this.cityList.length;i++){
        this.cityList[i]['con']=false;
      }
      this.cityList = datas;
      if (this.cityList.length >= 0) {
        this.chas_next = datapagination.has_next;
        this.chas_previous = datapagination.has_previous;
        this.ccurrentpage = datapagination.index;
      }

    },
    (error)=>{
      this.SpinnerService.hide();
    });
}
  nextClickCity() {
    if (this.chas_next === true) {
      this.ccurrentpage +=1;
      // this.citysearch();  
      this.getCityList();
    }
  }

  previousClickCity() {
    if (this.chas_previous === true) {
      this.ccurrentpage -=1;
      // this.citysearch();
      this.getCityList();
    }
  }
  cityEdit(data: any) {
    this.shareService.cityEditValue.next(data)
    this.isCityEditForm = true;
    this.ismakerCheckerButton = false;
    this.isCity = false;
    return data;
  }
  deleteCity(data) {
    let value = data.id
    // console.log("deletecity", value)
    this.mastersErvice.cityDeleteForm(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        return true

      })
  }

  getPincodeList(filter = "", sortOrder = 'asc',
    pageNumber = 1, pageSize = 10) {
      this.SpinnerService.show();
    this.mastersErvice.getPincodeList(filter, sortOrder, pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.pincodeList = datas;
        for (let i = 0; i < this.pincodeList.length; i++) {
          let ci = this.pincodeList[i].city_id
          let di = this.pincodeList[i].district_id
          if (ci == undefined) {
            this.pincodeList[i].city_name = ''
          } else {
            this.pincodeList[i].city_name = ci.name
          };
          if (di == undefined) {
            this.pincodeList[i].district_name = ''
          } else {
            this.pincodeList[i].district_name = di.name
          };
        }
        let datapagination = results["pagination"];
        this.pincodeList = datas;
        if (this.pincodeList.length >= 0) {
          this.phas_next = datapagination.has_next;
          this.phas_previous = datapagination.has_previous;
          this.pcurrentpage = datapagination.index;
        }

      },
      (error)=>{
        this.SpinnerService.hide();
      })
  }
  resetpincodedata(){
    this.pinform.controls['name'].reset('');
    this.getPincodeList("", 'asc', this.pcurrentpage, 10);
  }
  nextClickPincode() {
    if (this.phas_next === true) {
      this.getPincodeList("", 'asc', this.pcurrentpage + 1, 10)
    }
  }

  previousClickPincode() {
    if (this.phas_previous === true) {
      this.getPincodeList("", 'asc', this.pcurrentpage - 1, 10)
    }
  }
  pincodeEdit(data: any) {
    this.isPinCodeEditForm = true;
    this.ismakerCheckerButton = false;
    this.isPinCode = false;
    this.shareService.pincodeEditValue.next(data)
    return data;
  }
  deletePincode(data) {
    let value = data.id
    // console.log("deletepincode", value)
    this.mastersErvice.pincodeDeleteForm(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        return true

      })
  }
  riskdelete(data) {
    let value = data.id
    this.mastersErvice.riskDeleteForm(value)
      .subscribe(result => {
        this.notification.showSuccess("Successfully deleted....")
        this.getrisksummary();
        return true

      })
  }
  pinsearch() {
    this.SpinnerService.show();
    this.mastersErvice.getPinCodeSearch(this.pinform.value.name)
      .subscribe(result => {
        this.SpinnerService.hide();
        let datas = result['data'];
        this.pincodeList = datas;
        for (let i = 0; i < this.pincodeList.length; i++) {
          let ci = this.pincodeList[i].city
          let di = this.pincodeList[i].district
          if (ci == undefined) {
            this.pincodeList[i].city_name = ''
          } else {
            this.pincodeList[i].city_name = ci.name
          };
          if (di == undefined) {
            this.pincodeList[i].district_name = ''
          } else {
            this.pincodeList[i].district_name = di.name
          };
        }
        let datapagination = result["pagination"];
        this.pincodeList = datas;
        // if (this.pincodeList.length >= 0) {
        //   this.phas_next = datapagination.has_next;
        //   this.phas_previous = datapagination.has_previous;
        //   this.pcurrentpage = datapagination.index;
        // }

      },
      (error)=>{
        this.SpinnerService.hide();
      });
  }

  citysearch() {
    this.SpinnerService.show();
    this.mastersErvice.get_cityValue_new(this.cityform.value.name,this.currentpage)
      .subscribe(result => {
        this.SpinnerService.hide();
        let datas = result["data"];
        this.cityList = datas;
        for (let i = 0; i < this.cityList.length; i++) {
          let si = this.cityList[i].state_id;
          if (si == undefined) {
            this.cityList[i].state_name = ''
          } else {
            this.cityList[i].state_name = si.name
          };
        }
        for(let i=0;i<this.cityList.length;i++){
          this.cityList[i]['con']=false;
        }
        let datapagination = result["pagination"];
        this.cityList = datas;
        // if (this.cityList.length >= 0) {
        //   this.chas_next = datapagination.has_next;
        //   this.chas_previous = datapagination.has_previous;
        //   this.currentpage = datapagination.index;
        // }

      },
      (error)=>{
        this.SpinnerService.hide();
      })
  }
  dsearch() {
    this.SpinnerService.show();
    this.mastersErvice.getDistrictDropDown_new(this.districtform.value.name,this.currentpage)
      .subscribe(results => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.districtList = datas;
        for (let i = 0; i < this.districtList.length; i++) {
          let si = this.districtList[i].state
          if (si == undefined) {
            this.districtList[i].state_name = ''
          } else {
            this.districtList[i].state_name = si.name
          };
        }
        let datapagination = results["pagination"];
        this.districtList = datas;
        // if (this.districtList.length >= 0) {
        //   this.dhas_next = datapagination.has_next;
        //   this.dhas_previous = datapagination.has_previous;
        //   this.currentpage = datapagination.index;
        // }



      },
      (error)=>{
        this.SpinnerService.hide();
      })
  }
  ssearch() {
    this.SpinnerService.show();
    this.mastersErvice.getStateSearch_new(this.sform.value.name,this.currentpage)
      .subscribe(results => {
        this.SpinnerService.hide();
        let datas = results["data"];
        this.stateList = datas;
        for (let i = 0; i < this.stateList.length; i++) {
          let ci = this.stateList[i].country_id;
          if (ci == undefined) {
            this.stateList[i].country_name = ''
          } else {
            this.stateList[i].country_name = ci.name
          };
        }
        let datapagination = results["pagination"];
        this.stateList = datas;
        // if (this.stateList.length >= 0) {
        //   this.shas_next = datapagination.has_next;
        //   this.shas_previous = datapagination.has_previous;
        //   this.currentpage = datapagination.index;
        // }




      },
      (error)=>{
        this.SpinnerService.hide();
      })
  }

  ///////////////////////////////// CC BS and CCBS coding part 

  urlCC;
  urlBS;
  urlCCBS;

  isBS: boolean;
  isBSForm: boolean;
  isCCform: boolean;
  isCC: boolean;
  isCCBS: boolean;
  isCCBSform: boolean;

  BSSearchForm: FormGroup;
  CCSearchForm: FormGroup;
  CCBSSearchForm: FormGroup;
  editbss: FormGroup;

  presentpagebs: number = 1;
  has_previousbs = true;
  has_nextbs = true;

  presentpagecc: number = 1;
  has_nextcc = true;
  has_previouscc = true;

  presentpageccbs: number = 1;
  has_nextccbs = true;
  has_previousccbs = true;

  presentpagepmd: number = 1;
  has_nextpmd = true;
  has_previouspmd = true;


  businesssegmentList: any;
  costcenterList: any;
  ccbsList: any;

  bsList: Array<bslistss>;
  costcentre_id = new FormControl();

  ccList: Array<cclistss>;
  businesssegment_id = new FormControl();

  @ViewChild('bs') matbsAutocomplete: MatAutocomplete;
  @ViewChild('bsInput') bsInput: any;

  @ViewChild('cc') matccAutocomplete: MatAutocomplete;
  @ViewChild('ccInput') ccInput: any;


  comment = true
  ////////////////////////////////////////////////  bs
  getbs(pageNumber) {
    this.SpinnerService.show();
    this.mastersErvice.getbs(pageNumber,10)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getbs", datas);
        let datapagination = results["pagination"];
        this.businesssegmentList = datas;
        if (this.businesssegmentList.length > 0) {
          this.has_nextbs = datapagination.has_next;
          this.has_previousbs = datapagination.has_previous;
          this.presentpagebs = datapagination.index;
        }
      },
      (error)=>{
        this.SpinnerService.hide();
      })
    }


  nextClickbs() {
    if (this.has_nextbs === true) {
      this.presentpagebs +=1;
      // this.BSSearch_new();
      this.getbs(this.presentpagebs);
    }
  }

  previousClickbs() {
    if (this.has_previousbs === true) {
      this.presentpagebs -=1;
      // this.BSSearch_new();
      this.getbs(this.presentpagebs);
    }
  }

  BsSubmit() {
    this.getbs(1);
    this.ismakerCheckerButton = true;
    this.isBS = true;
    this.isBSForm = false;
  }
  BsCancel() {
    this.ismakerCheckerButton = true;
    this.isBS = true;
    this.isBSForm = false;
  }
  resetBS() {
    this.BSSearchForm.controls['no'].reset("");
    this.BSSearchForm.controls['name'].reset("");
    this.BSSearchForm.controls['drop'].reset("");
    this.getbs( this.presentpagebs);
  }
  BSSearch() {
    if (this.BSSearchForm.value.no === '' && this.BSSearchForm.value.name === '') {
      this.getbs(1);
      return
    }
    if (this.BSSearchForm.value.name === null && this.BSSearchForm.value.no === null) {
      this.getbs(1);
      return false
    }
    let no = this.BSSearchForm.value.no;
    let name = this.BSSearchForm.value.name;
    this.mastersErvice.getBssearch(no, name)
      .subscribe(result => {
        console.log("businesssegmentList search result", result)
        this.businesssegmentList = result['data']
      })
    if (this.BSSearchForm.value.no === '' && this.BSSearchForm.value.name === '') {
      this.getbs(1);
    }
  }
  BSSearch_new() {
    let no = this.BSSearchForm.value.no?this.BSSearchForm.value.no:'';
    let name = this.BSSearchForm.value.name?this.BSSearchForm.value.name:'';
    let status:any=this.drpdwn[this.BSSearchForm.value.drop?this.BSSearchForm.value.drop:'ALL'];
    this.SpinnerService.show();
    this.mastersErvice.getBssearch_new(no, name,status,1)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("businesssegmentList search result", result)
        this.businesssegmentList = result['data'];
        // let pagination=result['pagination'];
        // this.has_previousbs=pagination.has_previous;
        // this.has_nextbs=pagination.has_next;
        // this.presentpagebs=pagination.index;
      },
      (error)=>{
        this.SpinnerService.hide();
      });
  }
  forInactivebs(data) {
    let datas = data.id
    let status: number = 0
    console.log('check id for data passing', datas)
    this.mastersErvice.activeInactivebs(datas, status)
      .subscribe((results: any[]) => {
        this.notification.showSuccess('Successfully InActivated!')
        this.getbs(1);
        return true
      })
    // alert('inactive')
  }
  foractivebs(data) {
    let datas = data.id
    let status: number = 1
    console.log('check id for data passing', datas)
    this.mastersErvice.activeInactivebs(datas, status)
      .subscribe((results: any[]) => {
        this.notification.showSuccess('Successfully Activated!')
        this.getbs(1);
        return true
      })
    // alert('active')
  }

  editbs(data) {

    this.editbss.patchValue({
      id: data.id,
      name: data.name,
      code: data.code,
      no: data.no
    })

  }
  editbssForm() {
    let data = this.editbss.value
    this.mastersErvice.BSCreateForm(data)
      .subscribe(res => {
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.notification.showError("[INVALID_DATA! ...]")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.notification.showWarning("Duplicate Data! ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.notification.showError("INVALID_DATA!...")
        }
        else {
          this.notification.showSuccess("Updated Successfully!...")
        }
        this.getbs(1);
        console.table("BSFormeditsssssssssssss SUBMIT", res)
        return true
      })


  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  ////////////////////////////////////////////////  CC


  getcc(pageNumber) {
    this.SpinnerService.show();
    this.mastersErvice.getcc(pageNumber, 10)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getcc", datas);
        let datapagination = results["pagination"];
        this.costcenterList = datas;
        if (this.costcenterList.length > 0) {
          this.has_nextcc = datapagination.has_next;
          this.has_previouscc = datapagination.has_previous;
          this.presentpagecc = datapagination.index;
        }
      },
      (error)=>{
        this.SpinnerService.hide();
      })

  }


  nextClickcc() {
    if (this.has_nextcc === true) {
      this.presentpagecc +=1;
      // this.CCSearch_new();
      this.getcc(this.presentpagecc);
    }
  }

  previousClickcc() {
    if (this.has_previouscc === true) {
      this.presentpagecc -=1;
      // this.CCSearch_new();
      this.getcc(this.presentpagecc);
    }
  }

  CCSubmit() {
    this.getcc(1);
    this.ismakerCheckerButton = true;
    this.isCC = true;
    this.isCCform = false;
  }
  CCCancel() {
    this.ismakerCheckerButton = true;
    this.isCC = true;
    this.isCCform = false;
  }
  resetCC() {
    this.CCSearchForm.controls['no'].reset("")
    this.CCSearchForm.controls['name'].reset("")
    this.CCSearchForm.controls['drop'].reset("")
    this.getcc(this.presentpagecc);
  }

  CCSearch() {
    if (this.CCSearchForm.value.no === '' && this.CCSearchForm.value.name === '') {
      this.getcc(1);
      return
    }
    if (this.CCSearchForm.value.name === null && this.CCSearchForm.value.no === null) {
      this.getcc(1);
      return false
    }
    let no = this.CCSearchForm.value.no
    let name = this.CCSearchForm.value.name
    this.mastersErvice.getCCsearchoverall(no, name)
      .subscribe(result => {
        console.log("costcenterList search result", result)
        this.costcenterList = result['data']
      })
    if (this.CCSearchForm.value.no === '' && this.CCSearchForm.value.name === '') {
      this.getcc(1);
    }
  }
  CCSearch_new() {
    let no = this.CCSearchForm.value.no?this.CCSearchForm.value.no:'';
    let name = this.CCSearchForm.value.name?this.CCSearchForm.value.name:'';
    let status=this.drpdwn[this.CCSearchForm.value.drop?this.CCSearchForm.value.drop:'ALL'];
    let page= 1;
    this.SpinnerService.show();
    this.mastersErvice.getCCsearchoverall_new(no, name,status,page)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("costcenterList search result", result)
        this.costcenterList = result['data'];
        let pagination=result['pagination'];
        // this.has_previouscc=pagination.has_previous;
        // this.has_nextcc=pagination.has_next;
        // this.presentpagecc=pagination.index;
      },
      (error)=>{
        this.SpinnerService.hide();
      })
    // if (this.CCSearchForm.value.no === '' && this.CCSearchForm.value.name === '') {
    //   this.getcc();
    // }
  }
  forInactivecc(data) {
    let datas = data.id
    let status: number = 0
    console.log('check id for data passing', datas)
    this.mastersErvice.activeInactivecc(datas, status)
      .subscribe((results: any[]) => {
        this.notification.showSuccess('Successfully InActivated!')
        this.getcc(1);
        return true
      })
    // alert('inactive')
  }
  foractivecc(data) {
    let datas = data.id
    let status: number = 1
    console.log('check id for data passing', datas)
    this.mastersErvice.activeInactivecc(datas, status)
      .subscribe((results: any[]) => {
        this.notification.showSuccess('Successfully Activated!')
        this.getcc(1);
        return true
      })
    // alert('active')
  }
  //////////////////////////////////////////////////////////CCBS



  getccbs(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show();
    this.mastersErvice.getccBS(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getccBS", datas);
        let datapagination = results["pagination"];
        this.ccbsList = datas;
        if (this.ccbsList.length > 0) {
          this.has_nextccbs = datapagination.has_next;
          this.has_previousccbs = datapagination.has_previous;
          this.presentpageccbs = datapagination.index;
        }
      },
      (error)=>{
        this.SpinnerService.hide();
      })

  }

  getPMD(pageNumber = 1, pageSize = 10) {
    let code:any=this.PMDSearchForm.get('branch_code').value?this.PMDSearchForm.get('branch_code').value:'';
    let name:any=this.PMDSearchForm.get('branch_name').value?this.PMDSearchForm.get('branch_name').value:'';
    let location:any=this.PMDSearchForm.get('location').value?this.PMDSearchForm.get('location').value:'';
    this.SpinnerService.show();
    this.mastersErvice.getPMDServ(this.presentpagepmd, pageSize,code,name,location,2)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getPMD", datas);
        let datapagination = results["pagination"];
        this.PDMList = datas;
        if (this.PDMList.length > 0) {
          this.has_nextpmd = datapagination.has_next;
          this.has_previouspmd = datapagination.has_previous;
          this.presentpagepmd = datapagination.index;
        }
      },
      (error)=>{
        this.SpinnerService.hide();
      });

  }
  Gllist: Array<any>=[];
  getGL(pageNumber = 1, pageSize = 10) {
    let data:any='';
    if(this.glsearchform.get('name').value !=undefined && this.glsearchform.get('name').value !='' && this.glsearchform.get('name').value !="" && this.glsearchform.get('name').value !=''){
      data=data+'&data='+this.glsearchform.get('name').value;
    }
    if(this.glsearchform.get('desc').value !=undefined && this.glsearchform.get('desc').value !='' && this.glsearchform.get('desc').value !="" && this.glsearchform.get('desc').value !=''){
      data=data+'&status='+this.glsearchform.get('desc').value;
    }
    if(data=='' || data==""){
      data='&data='+'';
    }
    this.SpinnerService.show();
    this.mastersErvice.getglsummary(pageNumber, data)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getPMD", datas);
        let datapagination = results["pagination"];
        this.Gllist = datas;
        if (this.Gllist.length > 0) {
          this.has_nextpmd = datapagination.has_next;
          this.has_previouspmd = datapagination.has_previous;
          this.presentpagepmd = datapagination.index;
        }
      },
      (error)=>{
        this.SpinnerService.hide();
      });

  }
  getGLsearch() {
    let data:any='';
    if(this.glsearchform.get('name').value !=undefined && this.glsearchform.get('name').value !='' && this.glsearchform.get('name').value !="" && this.glsearchform.get('name').value !=''){
      data=data+'&data='+this.glsearchform.get('name').value;
    }
    if(this.glsearchform.get('desc').value !=undefined && this.glsearchform.get('desc').value !='' && this.glsearchform.get('desc').value !="" && this.glsearchform.get('desc').value !=''){
      data=data+'&status='+this.glsearchform.get('desc').value;
    }
    if(data=='' || data==""){
      data='&data='+'';
    }
    this.SpinnerService.show();
    this.mastersErvice.getglsummary(1, data)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getPMD", datas);
        let datapagination = results["pagination"];
        this.Gllist = datas;
        // if (this.Gllist.length > 0) {
        //   this.has_nextpmd = datapagination.has_next;
        //   this.has_previouspmd = datapagination.has_previous;
        //   this.presentpagepmd = datapagination.index;
        // }
      },
      (error)=>{
        this.SpinnerService.hide();
      });

  }
  getGLReset(pageNumber = 1, pageSize = 10) {
    this.glsearchform.reset('');
    let data:any='';
    if(this.glsearchform.get('name').value !=undefined && this.glsearchform.get('name').value !='' && this.glsearchform.get('name').value !="" && this.glsearchform.get('name').value !=''){
      data=data+'&data='+this.glsearchform.get('name').value;
    }
    if(this.glsearchform.get('desc').value !=undefined && this.glsearchform.get('desc').value !='' && this.glsearchform.get('desc').value !="" && this.glsearchform.get('desc').value !=''){
      data=data+'&status='+this.glsearchform.get('desc').value;
    }
    if(data=='' || data==""){
      data='&data='+'';
    }
    this.SpinnerService.show();
    this.mastersErvice.getglsummary(this.presentpagepmd, data)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getPMD", datas);
        let datapagination = results["pagination"];
        this.Gllist = datas;
        if (this.ccbsList.length > 0) {
          this.has_nextpmd = datapagination.has_next;
          this.has_previouspmd = datapagination.has_previous;
          this.presentpagepmd = datapagination.index;
        }
      },
      (error)=>{
        this.SpinnerService.hide();
      });

  }
 glnext(){
   if(this.has_nextpmd){
     this.getGL(this.presentpagepmd+1,10);
   }
 }
 glprevious(){
   if( this.has_previouspmd){
    this.getGL(this.presentpagepmd-1,10);
   }
 }
  nextClickccbs() {
    if (this.has_nextccbs === true) {
      this.getccbs(this.presentpageccbs + 1, 10)
    }
  }

  previousClickccbs() {
    if (this.has_previousccbs === true) {
      this.getccbs(this.presentpageccbs - 1, 10)
    }
  }

  CCBSSubmit() {
    this.getccbs();
    this.ismakerCheckerButton = true;
    this.isCCBS = true;
    this.isCCBSform = false;
  }
  CCBSCancel() {
    this.ismakerCheckerButton = true;
    this.isCCBS = true;
    this.isCCBSform = false;
  }
  resetCCBS() {
    this.CCBSSearchForm.controls['businesssegment_id'].reset("")
    this.CCBSSearchForm.controls['costcentre_id'].reset("")
    this.CCBSSearchForm.controls['name'].reset("")
    this.CCBSSearchForm.controls['no'].reset("")
    this.getccbs( this.presentpageccbs,10);
  }

  nextClickPMD() {
    if (this.has_nextpmd === true) {
      this.presentpagepmd =this.presentpagepmd + 1
      // this.getPMD(this.presentpagepmd , 10)
      this.PMDSearch_validate(this.presentpagepmd , 10);
    }
  }

  previousClickPMD() {
    if (this.has_previouspmd === true) {
      this.presentpagepmd=this.presentpagepmd - 1
      // this.getPMD(this.presentpagepmd, 10)
      this.PMDSearch_validate(this.presentpagepmd , 10);
    }
  }

  PMDSubmitCreate() {
    this.getPMD();
    this.ismakerCheckerButton = true;
    this.isPMD = true;
    this.isPMDForm = false;
  }
  PMDCancelCreate() {
    this.ismakerCheckerButton = true;
    this.isPMD = true;
    this.isPMDForm = false;
  }
  resetPMD() {
    this.PMDSearchForm.controls['branch_name'].reset("")
    this.PMDSearchForm.controls['location'].reset("")
    this.PMDSearchForm.controls['branch_code'].reset("")
    this.PMDSearchForm.controls['drop'].reset("")
    this.PMDSearch_validate(this.presentpagepmd,10);
  }

  PMDSubmitEdit() {
    this.getPMD();
    this.ismakerCheckerButton = true;
    this.isPMD = false;
    this.isPMDForm = false;
    this.isPMDFormedit = true;
  }
  PMDCancelEdit() {
    this.ismakerCheckerButton = true;
    this.isPMD = true;
    this.isPMDForm = false;
    this.isPMDFormedit = false;
  }

  nextClickPDM() {
    if (this.has_nextpdm === true) {
      this.getPMD(this.presentpagepmd + 1, 10)
    }
  }

  previousClickPDM() {
    if (this.has_previouspdm === true) {
      this.getPMD(this.presentpagepmd - 1, 10)
    }
  }

  edit(d){
    this.isPMDForm = false;
    this.isPMD = false;
    this.ismakerCheckerButton = false;
    this.isPMDFormedit = true;
  }
  
  PMDSearch(pageNumber = 1, pageSize = 10){
      let code:any=this.PMDSearchForm.get('branch_code').value?this.PMDSearchForm.get('branch_code').value:'';
      let name:any=this.PMDSearchForm.get('branch_name').value?this.PMDSearchForm.get('branch_name').value:'';
      let location:any=this.PMDSearchForm.get('location').value?this.PMDSearchForm.get('location').value:'';
      let status:any=this.drpdwn[this.PMDSearchForm.get('drop').value?this.PMDSearchForm.get('drop').value:'ALL'];
      this.SpinnerService.show();
      this.mastersErvice.getPMDServ(pageNumber, pageSize,code,name,location,status)
        .subscribe((results: any[]) => {
          this.SpinnerService.hide();
          let datas = results["data"];
          console.log("getPMD", datas);
          let datapagination = results["pagination"];
          this.PDMList = datas;
          if (this.PDMList.length > 0) {
            this.has_nextpmd = datapagination.has_next;
            this.has_previouspmd = datapagination.has_previous;
            this.presentpagepmd = datapagination.index;
          }
        },
        (error)=>{
          this.SpinnerService.hide();
        });
  
    
  }
  PMDSearch_validate(pageNumber, pageSize = 10){
    let code:any=this.PMDSearchForm.get('branch_code').value?this.PMDSearchForm.get('branch_code').value:'';
    let name:any=this.PMDSearchForm.get('branch_name').value?this.PMDSearchForm.get('branch_name').value:'';
    let location:any=this.PMDSearchForm.get('location').value?this.PMDSearchForm.get('location').value:'';
    let status:any=this.drpdwn[this.PMDSearchForm.get('drop').value?this.PMDSearchForm.get('drop').value:'ALL'];
    this.SpinnerService.show();
    this.mastersErvice.getPMDServ(pageNumber, pageSize,code,name,location,status)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide();
        let datas = results["data"];
        console.log("getPMD", datas);
        let datapagination = results["pagination"];
        this.PDMList = datas;
        if (this.PDMList.length > 0) {
          this.has_nextpmd = datapagination.has_next;
          this.has_previouspmd = datapagination.has_previous;
          this.presentpagepmd = datapagination.index;
        }
      },
      (error)=>{
        this.SpinnerService.hide();
      });

  
}

  autocompletebsScroll() {
    setTimeout(() => {
      if (
        this.matbsAutocomplete &&
        this.autocompleteTrigger &&
        this.matbsAutocomplete.panel
      ) {
        fromEvent(this.matbsAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matbsAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matbsAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matbsAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matbsAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.mastersErvice.getbsFKdd(this.bsInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.bsList = this.bsList.concat(datas);
                    // console.log("emp", datas)
                    if (this.bsList.length >= 0) {
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

  public displayFnbs(bs?: bslistss): string | undefined {
    return bs ? bs.name : undefined;
  }

  get bs() {
    return this.CCBSSearchForm.get('businesssegment_id');
  }

  private getbsDD(bskeyvalue) {
    this.mastersErvice.getbsvalue(bskeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.bsList = datas;
      })
  }








  //////////////////////////////////////////cc

  autocompleteccScroll() {
    setTimeout(() => {
      if (
        this.matccAutocomplete &&
        this.autocompleteTrigger &&
        this.matccAutocomplete.panel
      ) {
        fromEvent(this.matccAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matccAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matccAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matccAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matccAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.mastersErvice.getccFKdd(this.ccInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.ccList = this.ccList.concat(datas);
                    if (this.ccList.length >= 0) {
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

  public displayFncc(cc?: cclistss): string | undefined {
    return cc ? cc.name : undefined;
  }

  get cc() {
    return this.CCBSSearchForm.get('costcentre_id');
  }

  private getccDD(cckeyvalue) {
    this.mastersErvice.getccvalue(cckeyvalue)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.ccList = datas;
      })
  }

  createFormateccbs() {
    let data = this.CCBSSearchForm.controls;
    let ccbsSearchclass = new ccbsSearchtype();
    ccbsSearchclass.businesssegment_id = data['businesssegment_id'].value.id;
    ccbsSearchclass.costcentre_id = data['costcentre_id'].value.id;
    ccbsSearchclass.name = data['name'].value;
    ccbsSearchclass.no = data['no'].value;
    console.log("ccbsSearchclass", ccbsSearchclass)
    return ccbsSearchclass;
  }

  CCBSSearch() {
    let search = this.createFormateccbs();
    console.log(search);
    for (let i in search) {
      if (!search[i]) {
        delete search[i];
      }
    }

    //let data = this.CCBSSearchForm.value
    this.SpinnerService.show();
    this.mastersErvice.getCCBSsearch(search)
      .subscribe(result => {
        this.SpinnerService.hide();
        console.log("ccbsList search result", result)
        this.ccbsList = result['data']
      },
      (error)=>{
        this.SpinnerService.hide();
      })
    if (this.CCBSSearchForm.value.businesssegment_id === '' && this.CCBSSearchForm.value.costcentre_id === '' && this.CCBSSearchForm.value.name === '' && this.CCBSSearchForm.value.no === '') {
      this.getccbs();
    }
  }

  createFormatePMD() {
    let data = this.PMDSearchForm.controls;
    let ccbsSearchclass = new ccbsSearchtype();
    ccbsSearchclass.businesssegment_id = data['businesssegment_id'].value.id;
    ccbsSearchclass.costcentre_id = data['costcentre_id'].value.id;
    ccbsSearchclass.name = data['name'].value;
    ccbsSearchclass.no = data['no'].value;
    console.log("ccbsSearchclass", ccbsSearchclass)
    return ccbsSearchclass;
  }
  bsInactivelist(pageNumber = 1, pageSize = 10) {
    this.mastersErvice.getbsInactivelist(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.businesssegmentList = datas;
        if (this.businesssegmentList.length >= 0) {
          this.has_nextbs = datapagination.has_next;
          this.has_previousbs = datapagination.has_previous;
          this.presentpagebs = datapagination.index;
        }
      })
  }



  bsactivelist(pageNumber = 1, pageSize = 10) {
    this.mastersErvice.getbsactivelist(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.businesssegmentList = datas;
        if (this.businesssegmentList.length >= 0) {
          this.has_nextbs = datapagination.has_next;
          this.has_previousbs = datapagination.has_previous;
          this.presentpagebs = datapagination.index;
        }
      })
  }



  ccInactivelist(pageNumber = 1, pageSize = 10) {
    this.mastersErvice.getccInactivelist(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.costcenterList = datas;
        if (this.costcenterList.length >= 0) {
          this.has_nextcc = datapagination.has_next;
          this.has_previouscc = datapagination.has_previous;
          this.presentpagecc = datapagination.index;
        }
      })
  }

  has_pre:boolean=false;
  presentPage:number=1;
  ccactivelist(pageNumber = 1, pageSize = 10) {
    this.mastersErvice.getccactivelist(pageNumber, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.costcenterList = datas;
        if (this.costcenterList.length >= 0) {
          this.has_nextcc = datapagination.has_next;
          this.has_previouscc = datapagination.has_previous;
          this.presentpagecc = datapagination.index;
        }
      })
  }
 
  getcitydata(data:any){
    // if(e=='yes'){
      this.datadistrictid=data['state_id'].id;
      for(let i=0;i<this.cityList.length;i++){
        if(data.id==this.cityList[i].id){
          this.cityList[i]['con']=!this.cityList[i]['con'];
        }
        else{
          this.cityList[i]['con']=false;
        }
      }
      this.mastersErvice.getsummarydistrict(data['state_id'].id,this.dispage).subscribe(dta=>{
        this.citysummarydata=dta['data'];
        let pagination=dta['pagination'];
        this.has_next=pagination.has_next;
        this.has_pre=pagination.has_previous;
        this.dispage=pagination.index;
        console.log(this.citysummarydata);
        for(let i=0;i<this.citysummarydata.length;i++){
          this.citysummarydata[i]['con']=false;
        }
        console.log(this.citysummarydata);
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      )
    // }
    // else{
    //   for(let i=0;i<this.cityList.length;i++){
    //     if(data.id==this.cityList[i].id){
    //       this.cityList[i]['con']=!this.cityList[i]['con'];
    //     }
    //     else{
    //       this.cityList[i]['con']=false;
    //     }
    //   }
    // }
    
  }
  has_nextdistrict(){
    if(this.has_next){
      this.mastersErvice.getsummarydistrict(this.datadistrictid,this.dispage+1).subscribe(dta=>{
        this.citysummarydata=dta['data'];
        let pagination=dta['pagination'];
        this.has_next=pagination.has_next;
        this.has_pre=pagination.has_previous;
        this.dispage=pagination.index;
        console.log(this.citysummarydata);
        for(let i=0;i<this.citysummarydata.length;i++){
          this.citysummarydata[i]['con']=false;
        }
        console.log(this.citysummarydata);
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      )
    }
  }
  has_predisrict(){
    if(this.has_pre){
      this.mastersErvice.getsummarydistrict(this.datadistrictid,this.dispage-1).subscribe(dta=>{
        this.citysummarydata=dta['data'];
        let pagination=dta['pagination'];
        this.has_next=pagination.has_next;
        this.has_pre=pagination.has_previous;
        this.dispage=pagination.index;
        console.log(this.citysummarydata);
        for(let i=0;i<this.citysummarydata.length;i++){
          this.citysummarydata[i]['con']=false;
        }
        console.log(this.citysummarydata);
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      )
    
    }
  }
  getdistrictcitydata(data:any){
    // if(e=='yes'){
      this.datacityid=data.id;
      for(let i=0;i<this.citysummarydata.length;i++){
        if(data.id==this.citysummarydata[i].id){
          this.citysummarydata[i]['con']=true;
        }
        else{
          this.citysummarydata[i]['con']=false;
        }
      }
      this.SpinnerService.show();
      this.mastersErvice.getsummarycity(data.id,this.dispage).subscribe(dta=>{
        this.districtsummaryData=dta['data'];
        let pagination=dta['pagination'];
        this.SpinnerService.hide();
        this.has_nexts=pagination.has_next;
        this.has_prese=pagination.has_previous;
        this.citypage=pagination.index;
        for(let i=0;i<this.districtsummaryData.length;i++){
          this.districtsummaryData[i]['con']=false;
        }
        
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      );
    // }
    // else{
    //   for(let i=0;i<this.citysummarydata.length;i++){
    //     if(data.id==this.citysummarydata[i].id){
    //       this.citysummarydata[i]['con']=true;
    //     }
    //     else{
    //       this.citysummarydata[i]['con']=false;
    //     }
    //   }
    // }
    }
   has_citynext(){
     if(this.has_nexts){
       this.SpinnerService.show();
      this.mastersErvice.getsummarycity(this.datacityid,this.citypage+1).subscribe(dta=>{
        this.districtsummaryData=dta['data'];
        let pagination=dta['pagination'];
        this.SpinnerService.hide();
        this.has_nexts=pagination.has_next;
        this.has_prese=pagination.has_previous;
        this.citypage=pagination.index;
        for(let i=0;i<this.districtsummaryData.length;i++){
          this.districtsummaryData[i]['con']=false;
        }
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      );
     }
    
   }
   keypressnodigit(event:any){
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode<64 || charCode>123)) {
      return false;
    }
    return true;
  }
  has_citypre(){
    if( this.has_prese){
      this.SpinnerService.show();
      this.mastersErvice.getsummarycity(this.datacityid,this.citypage-1).subscribe(dta=>{
        this.districtsummaryData=dta['data'];
        let pagination=dta['pagination'];
        this.SpinnerService.hide();
        this.has_nexts=pagination.has_next;
        this.has_prese=pagination.has_previous;
        this.citypage=pagination.index;
        for(let i=0;i<this.districtsummaryData.length;i++){
          this.districtsummaryData[i]['con']=false;
        }
      },
      (error)=>{
        this.notification.showError(error.status+error.statusText);
      }
      );
    }
  }


  ////////////////////////Validation dropdown 
  private SelectionValidator(fcvalue: FormControl) {
    if (typeof fcvalue.value === 'string') {
      return { incorrectValue: `Selected value only Allowed` }
    }
    return null;
  }

  ///////////////////////////   TABS
  Apcategory() {
    this.isCommodity = false;
    this.isCommodityForm = false;
    this.isDelmatMakers = false;
    this.isDelmatMakerForm = false;
    this.isDelmatApproval = false;
  }
  ApSubcategory() {
    this.isCommodity = false;
    this.isCommodityForm = false
    this.isDelmatMakers = false;
    this.isDelmatMakerForm = false;
    this.isDelmatApproval = false;
  }


  CC() {
    this.isCommodity = false;
    this.isCommodityForm = false
    this.isDelmatMakerForm = false;
    this.isDelmatApproval = false;
    this.isDelmatMakers = false;
  }
  BS() {
    this.isCommodity = false;
    this.isCommodityForm = false
    this.isDelmatMakerForm = false;
    this.isDelmatApproval = false;
    this.isDelmatMakers = false;
  }

  BSCC() {
    this.isCommodity = false;
    this.isCommodityForm = false
    this.isDelmatMakerForm = false;
    this.isDelmatApproval = false;
    this.isDelmatMakers = false;
  }



  //////////////////    ADD
  addcom() {
    this.isDelmatMakerForm = false;
    this.isDelmatApproval = false;
    this.isDelmatMakers = false;

    this.isCommodity = false;
    this.isCommodityForm = true;
  }
  adddel() {
    this.isCommodity = false;
    this.isCommodityForm = false;
    this.isDelmatApproval = false;

    this.isDelmatMakerForm = true;
    this.isDelmatMakers = false;
  }

  //////////////         COMMODITY SUMMARY GET
  getcommodity(pageNumber, pageSize) {
    this.SpinnerService.show()
    this.mastersErvice.getcommodity(this.presentpagecom, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.commodityList = datas;
        if (this.commodityList.length > 0) {
          this.has_nextcom = datapagination.has_next;
          this.has_previouscom = datapagination.has_previous;
          this.presentpagecom = datapagination.index;
        }
      },
      (error)=>{
        this.SpinnerService.hide();
      });

  }
  nextClickcom() {
    if (this.has_nextcom === true) {
      this.presentpagecom +=1;
      // this.commoditySearchcom();
      this.getcommodity(this.presentpagecom,10);
    }
  }

  previousClickcom() {
    if (this.has_previouscom === true) {
      this.presentpagecom -=1;
      // this.commoditySearchcom();
      this.getcommodity(this.presentpagecom,10);
    }
  }
  commoditySubmit() {
    this.getcommodity(1,10);
    this.ismakerCheckerButton = true;
    this.isCommodity = true;
    this.isCommodityForm = false;
  }
  commodityCancel() {
    this.ismakerCheckerButton = true;
    this.isCommodity = true;
    this.isCommodityForm = false;
  }
  resetcom() {
    this.commoditySearchForm.controls['code'].reset("")
    this.commoditySearchForm.controls['name'].reset("")
    this.commoditySearchForm.controls['drop'].reset("")
    this.getcommodity(1,10);
    return true;
  }
  commoditySearchcom() {
    // if(this.presentpagecom>1){
    //   this.presentpagecom=1;
    // }
    // else{
    //   this.presentpagecom=this.presentpagecom;
    // }
    let code = this.commoditySearchForm.value.code?this.commoditySearchForm.value.code:'';
    let name = this.commoditySearchForm.value.name? this.commoditySearchForm.value.name:'';
    let status:any=this.drpdwn[this.commoditySearchForm.value.drop?this.commoditySearchForm.value.drop:'ALL'];
    this.SpinnerService.show();
    this.mastersErvice.getCommoditySearch(code, name,this.presentpagecom,status)
      .subscribe(result => {
        this.SpinnerService.hide();
        this.commodityList = result['data'];
        // let pagination=result['pagination'];
        // this.presentpagecom=pagination.index;
        // this.has_previouscom=pagination.has_previous;
        // this.has_nextcom=pagination.has_next;
      },
      (error)=>{
        this.SpinnerService.hide();
      });

  }

  forInactive(data) {
    let datas = data.id
    let status_action: number = 0
    // this.SpinnerService.show()
    this.mastersErvice.activeInactiveCommodity(datas, status_action)
      .subscribe((results: any[]) => {
        // this.SpinnerService.hide()
        this.notification.showSuccess('Successfully InActivated!')
        this.getcommodity(1,10);
        return true
      })
  }
  foractive(data) {
    let datas = data.id
    let status_action: number = 1
    // this.SpinnerService.show()
    this.mastersErvice.activeInactiveCommodity(datas, status_action)
      .subscribe((results: any[]) => {
        // this.SpinnerService.hide()
        this.notification.showSuccess('Successfully Activated!')
        this.getcommodity(1,10);
        return true
      })
  }
  //////////////delmat

  getdelmat(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show()
    this.mastersErvice.getdelmat( this.presentpagedel, pageSize)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.SpinnerService.hide();
        let datapagination = results["pagination"];
        this.delmatList = datas;
        if (this.delmatList.length > 0) {
          this.has_nextdel = datapagination.has_next;
          this.has_previousdel = datapagination.has_previous;
          this.presentpagedel = datapagination.index;
        }
      },
      (error:HttpErrorResponse)=>{
        this.delmatList=[];
        this.SpinnerService.hide();
      }
      );

  }
  nextClickdel() {
    if (this.has_nextdel === true) {
      this.presentpagedel += 1;
      this.getdelmat(this.presentpagedel, 10)
    }
  }

  previousClickdel() {
    if (this.has_previousdel === true) {
      this.presentpagedel -=1;
      this.getdelmat(this.presentpagedel , 10)
    }
  }
  delSubmit() {
    this.getdelmat();
    this.getdelmatapproval();
    this.isDelmatMakers = true;
    this.isDelmatMakerForm = false;
  }
  delCancel() {
    this.isDelmatMakers = true;
    this.isDelmatMakerForm = false;
  }

  delmatEdit(data) {
    this.shareService.DelmatEdit.next(data);
    return data;
  }
  createFormatedel() {
    let data = this.delmatSearchForm.controls;
    let delSearchclass = new delSearchtype();
    delSearchclass.employee_id = data['employee_id'].value.id;
    delSearchclass.commodity_id = data['commodity_id'].value.id;
    delSearchclass.type = data['type'].value;
    return delSearchclass;
  }


  delmatSearch() {
    if (this.delmatSearchForm.value.commodity_id === 'string') {
      return { incorrectValue: `Selected value only Allowed` }
    }
    let searchdel = this.createFormatedel();
    for (let i in searchdel) {
      if (!searchdel[i]) {
        delete searchdel[i];
      }
    }
    
    // this.SpinnerService.show()
    this.mastersErvice.getdelmatSearch(searchdel)
      .subscribe(result => {
        // this.SpinnerService.hide()
        this.delmatList = result['data']
        if (searchdel.employee_id === '' && searchdel.commodity_id === '' && searchdel.type === '') {
          this.getdelmat();
        }
      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  delmatSearch_new() {
    if (this.delmatSearchForm.value.commodity_id === 'string') {
      return { incorrectValue: `Selected value only Allowed` }
    }
    let searchdel = this.createFormatedel();
    for (let i in searchdel) {
      if (!searchdel[i]) {
        delete searchdel[i];
      }
    }
    this.SpinnerService.show()
    let status:any=this.drpdwn[this.delmatSearchForm.value.drop?this.delmatSearchForm.value.drop:'ALL'];
    this.mastersErvice.getdelmatSearch_new(searchdel,status)
      .subscribe(result => {
        this.SpinnerService.hide()
        this.delmatList = result['data']
        if (searchdel.employee_id === '' && searchdel.commodity_id === '' && searchdel.type === '') {
          this.getdelmat();
        }
      },(error) => {
        this.delmatList=[];
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  autocompleteempScroll() {
    setTimeout(() => {
      if (
        this.matempAutocomplete &&
        this.autocompleteTrigger &&
        this.matempAutocomplete.panel
      ) {
        fromEvent(this.matempAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.mastersErvice.getemployeeFKdd(this.empInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    // console.log("emp", datas)
                    if (this.employeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    // this.errorHandler.handleError(error);
                    // this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  public displayFnemp(emp?: Emplistss): string | undefined {
    return emp ? emp.full_name : undefined;
  }

  get emp() {
    return this.delmatSearchForm.get('employee_id');
  }




  autocompleteempapprovalScroll() {
    setTimeout(() => {
      if (
        this.matempappAutocomplete &&
        this.autocompleteTrigger &&
        this.matempappAutocomplete.panel
      ) {
        fromEvent(this.matempappAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matempappAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matempappAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matempappAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matempappAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.mastersErvice.getemployeeFKdd(this.empappInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.employeeList = this.employeeList.concat(datas);
                    // console.log("emp", datas)
                    if (this.employeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    // this.errorHandler.handleError(error);
                    // this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  public displayFnempapproval(empapproval?: Emplistss): string | undefined {
    return empapproval ? empapproval.full_name : undefined;
  }

  get empapproval() {
    return this.delmatapprovalSearchForm.get('employee_id');
  }

  getemployeeFK(empkeyvalue) {
    // this.SpinnerService.show()
    this.mastersErvice.getemployeeFK(empkeyvalue)
      .subscribe((results: any[]) => {
        // this.SpinnerService.hide()
        let datas = results["data"];
        this.employeeList = datas;
      },(error) => {
        // this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      })
  }
  getemployeeFKapp(empkeyvalue) {
    // this.SpinnerService.show()
    this.mastersErvice.getemployeeFK(empkeyvalue)
      .subscribe((results: any[]) => {
        // this.SpinnerService.hide()
        let datas = results["data"];
        this.employeeList = datas;
      },(error) => {
        // this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      })
  }

  autocompletecomScroll() {
    setTimeout(() => {
      if (
        this.matcomAutocomplete &&
        this.autocompleteTrigger &&
        this.matcomAutocomplete.panel
      ) {
        fromEvent(this.matcomAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcomAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcomAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcomAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcomAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.mastersErvice.getcommodityFKdd(this.comInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.commodityLists = this.commodityLists.concat(datas);
                    if (this.commodityLists.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    // this.errorHandler.handleError(error);
                    // this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  public displayFncom(com?: comlistss): string | undefined {
    return com ? com.name : undefined;
  }

  get com() {
    return this.delmatSearchForm.get('commodity_id');
  }



  autocompletecomappScroll() {
    setTimeout(() => {
      if (
        this.matcomappAutocomplete &&
        this.autocompleteTrigger &&
        this.matcomappAutocomplete.panel
      ) {
        fromEvent(this.matcomappAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matcomappAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matcomappAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matcomappAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matcomappAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.mastersErvice.getcommodityFKdd(this.comappInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.commodityLists = this.commodityLists.concat(datas);
                    if (this.commodityLists.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    // this.errorHandler.handleError(error);
                    // this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }
  public displayFncomapproval(comapproval?: comlistss): string | undefined {
    return comapproval ? comapproval.name : undefined;
  }

  get comapproval() {
    return this.delmatapprovalSearchForm.get('commodity_id');
  }
  getcommodityFK(comkeyvalue) {
    // this.SpinnerService.show()
    this.mastersErvice.getcommodityFK(comkeyvalue)
      .subscribe((results: any[]) => {
        // this.SpinnerService.hide()
        let datas = results["data"];
        this.commodityLists = datas;
      },(error) => {
        // this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      })
  }
  getcommodityFKapp(comkeyvalue) {
    // this.SpinnerService.show()
    this.mastersErvice.getcommodityFK(comkeyvalue)
      .subscribe((results: any[]) => {
        // this.SpinnerService.hide()
        let datas = results["data"];
        this.commodityLists = datas;
      },(error) => {
        // this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      })
  }

  getdelmattype() {
    this.mastersErvice.getdelmattype()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.delmattypeList = datas;
      },(error) => {
        // this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      })
  }

  resetdelmak() {
    this.delmatSearchForm.controls['employee_id'].reset("")
    this.delmatSearchForm.controls['commodity_id'].reset("")
    this.delmatSearchForm.controls['type'].reset("")
    this.delmatSearchForm.controls['drop'].reset("")
    this.getdelmat();
    return
  }
  forInactivedel(data) {
    let datas = data.id
    let status: number = 0
    // this.SpinnerService.show()
    this.mastersErvice.activeInactivedel(datas, status)
      .subscribe((results: any[]) => {
        // this.SpinnerService.hide()
        this.notification.showSuccess('Successfully InActivated!')
        this.getdelmat();
        return true
      },(error) => {
        // this.errorHandler.handleError(error);
        // this.SpinnerService.hide();
      })
  }
  foractivedel(data) {
    let datas = data.id
    let status: number = 1
    // this.SpinnerService.show()
    this.mastersErvice.activeInactivedel(datas, status)
      .subscribe((results: any[]) => {
        // this.SpinnerService.hide()
        this.notification.showSuccess('Successfully Activated!')
        this.getdelmat();
        return true
      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  Inactivelist() {
    this.SpinnerService.show()
    this.mastersErvice.getInactivelist()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.delmatList = datas;
      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  activelist() {
    this.SpinnerService.show()
    this.mastersErvice.getactivelist()
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.delmatList = datas;
      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  /////////delmat approval
  getdelmatapproval(pageNumber = 1, pageSize = 10) {
    this.SpinnerService.show()
    this.mastersErvice.getdelmatapp(this.presentpagedelapp, pageSize)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        let datapagination = results["pagination"];
        this.delmatappList = datas;
        if (this.delmatappList.length > 0) {
          this.has_nextdelapp = datapagination.has_next;
          this.has_previousdelapp = datapagination.has_previous;
          this.presentpagedelapp = datapagination.index;
        }
      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  nextClickdelapp() {
    if (this.has_nextdelapp === true) {
      this.presentpagedelapp =this.presentpagedelapp+1;
      this.getdelmatapproval(this.presentpagedelapp , 10)
    }
  }

  previousClickdelapp() {
    if (this.has_previousdelapp === true) {
      this.presentpagedelapp =this.presentpagedelapp-1;
      this.getdelmatapproval(this.presentpagedelapp , 10)
    }
  }
  delappSubmit() {
    this.getdelmatapproval();
    this.isDelmatMakers = true;
    this.isDelmatMakerForm = true;
  }
  delappCancel() {
    this.isDelmatMakers = true;
    this.isDelmatMakerForm = true;
  }
  delmatapprovalId: any
  delappcommodity_id: string;
  delmat_status: string;
  delappemployee_id: string;
  limit: string;
  status: string;
  type: string;
  approval(data) {
    this.delmatapprovalId = data?.id
    this.delappcommodity_id = data?.commodity_id?.name
    this.delmat_status = data?.delmat_status
    this.delappemployee_id = data?.employee_id?.full_name
    this.limit = data?.limit
    this.status = data?.status
    this.type = data?.type


    this.approvalForm.patchValue({
      id: data.id,
    })
    this.rejectForm.patchValue({
      id: data.id,
    })
  }
  approveClick() {
    let data = this.approvalForm.value
    this.mastersErvice.getdelapprovaldata(data)
      .subscribe(result => {
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.notification.showError("Maker Not Allowed To Approve")
          return false
        } else {

          this.notification.showSuccess("Successfully Approved!...")

          this.getdelmatapproval();
          this.approvalForm.controls['remarks'].reset()
          this.getdelmat();
          this.getdelmatapproval();
        }
        return true
      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  rejectClick() {
    if(this.rejectForm.get('remarks').value ==undefined || this.rejectForm.get('remarks').value =='' || this.rejectForm.get('remarks').value ==null){
      this.notification.showError('Please Enter The Rejected Remarks');
      return false;
    }
    let data = this.rejectForm.value
    this.SpinnerService.show()
    this.mastersErvice.getdelrejectdata(data)
      .subscribe(result => {
        this.SpinnerService.hide()
        if (result.code === "INVALID_APPROVER_ID" && result.description === "Invalid Approver Id") {
          this.SpinnerService.hide()
          this.notification.showError("Maker Not Allowed To Reject")
          return false
        } else {
          this.SpinnerService.hide()
          this.notification.showSuccess("Successfully Rejected!...")
        }
        this.rejectForm.controls['remarks'].reset()
        this.getdelmat();
        this.getdelmatapproval();
        return true
      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  Approval(ApprovalData) {
    this.shareService.Delmatappshare.next(ApprovalData);
    this.router.navigate(['/delmatapproval'], { skipLocationChange: true })
  }

  createFormatedelapp() {
    let data = this.delmatapprovalSearchForm.controls;

    let delappSearchclass = new delappSearchtype();
    delappSearchclass.employee_id = data['employee_id'].value.id;
    delappSearchclass.commodity_id = data['commodity_id'].value.id;
    delappSearchclass.type = data['type'].value;
    return delappSearchclass;
  }

  delmatappSearch() {
    let searchdelapp = this.createFormatedelapp();

    for (let i in searchdelapp) {
      if (!searchdelapp[i]) {
        delete searchdelapp[i];
      }
    }
    this.SpinnerService.show()
    this.mastersErvice.getdelmatappSearch(searchdelapp)
      .subscribe(result => {

        this.SpinnerService.hide()

        this.delmatappList = result['data']

        if (searchdelapp.employee_id === '' && searchdelapp.commodity_id === '' && searchdelapp.type === '') {
          this.getdelmatapproval();
        }
      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  delmatappSearch_new() {
    let searchdelapp = this.createFormatedelapp();

    for (let i in searchdelapp) {
      if (!searchdelapp[i]) {
        delete searchdelapp[i];
      }
    }
    // let status:any=this.drpdwn[this.delmatSearchForm.value.drop?this.delmatSearchForm.value.drop:'ALL'];

    this.SpinnerService.show();
    this.mastersErvice.getdelmatappSearch_new(searchdelapp)
      .subscribe(result => {

        this.SpinnerService.hide()

        this.delmatappList = result['data']

        if (searchdelapp.employee_id === '' && searchdelapp.commodity_id === '' && searchdelapp.type === '') {
          this.getdelmatapproval();
        }
      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }
  resetdelapproval() {
    this.delmatapprovalSearchForm.controls['employee_id'].reset('')
    this.delmatapprovalSearchForm.controls['commodity_id'].reset('')
    this.delmatapprovalSearchForm.controls['type'].reset('')
    this.getdelmatapproval();
  }
  resetclient() {
    this.clientForm.controls['code'].reset('')
    this.clientForm.controls['name'].reset('')
    this.clientForm.controls['drop'].reset('')
    this.getclientsummary(1,10);
  }
  // omit_special_char(event) {
  //   var k;
  //   k = event.charCode;
  //   return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  // }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  commodname: string;

  commodityforProduct(data) {
    this.shareService.CommodityEdit.next(data)
    let commodity = data.id
    let commodityId = data.id
    this.commodname = data.name
    this.productSearchForm.patchValue({
      commodity_id: commodity
    })
    this.prodfetch()
    return true
  }




  autocompleteprodScroll() {
    setTimeout(() => {
      if (
        this.matprodAutocomplete &&
        this.autocompleteTrigger &&
        this.matprodAutocomplete.panel
      ) {
        fromEvent(this.matprodAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matprodAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matprodAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matprodAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matprodAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.mastersErvice.getproduct(this.prodInput.nativeElement.value)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.productList = this.productList.concat(datas);
                    if (this.productList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  },(error) => {
                    // this.errorHandler.handleError(error);
                    this.SpinnerService.hide();
                  })
              }
            }
          });
      }
    });
  }

  public displayFnprod(prod?: prodlistss): string | undefined {
    return prod ? prod.name : undefined;
  }

  get prod() {
    return this.product_id;
  }



  getproduct(prokeyvalue) {
    this.SpinnerService.show()
    this.mastersErvice.getproduct(prokeyvalue)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];
        this.productList = datas;
      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }

      )
  }





  public removedprod(pro: prodlistss): void {
    const index = this.chipSelectedprod.indexOf(pro);

    if (index >= 0) {

      this.chipSelectedprod.splice(index, 1);
      console.log(this.chipSelectedprod);
      this.chipSelectedprodid.splice(index, 1);
      console.log(this.chipSelectedprodid);
      this.prodInput.nativeElement.value = '';
    }

  }



  public prodSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('event.option.value', event.option.value)
    this.selectprodByName(event.option.value.name);
    this.prodInput.nativeElement.value = '';
    console.log('chipSelectedprodid', this.chipSelectedprodid)
  }
  private selectprodByName(prod) {
    let foundprod1 = this.chipSelectedprod.filter(pro => pro.name == prod);
    if (foundprod1.length) {
      return;
    }
    let foundprod = this.productList.filter(pro => pro.name == prod);
    if (foundprod.length) {
      this.chipSelectedprod.push(foundprod[0]);
      this.chipSelectedprodid.push(foundprod[0].id)
    }
  }

  commodityid: any

  createformatprod() {
    let datas = this.productSearchForm.value

    let dataprod = this.chipSelectedprodid
    let datamethod = "add"

    let productclass = new producttype();
    productclass.commodity_id = datas.commodity_id
    productclass.product_id = dataprod
    productclass.method = datamethod
    if (dataprod?.length === 0) {
      //this.toastr.error('Add Product','Empty value not Allowed');
      return false;
    }
    return productclass
  }



  productsubmit() {
    let datas = this.createformatprod();
    if (datas === false) {
      this.notification.showError('Add Product Empty value not Allowed');
      return null;
    }
    this.SpinnerService.show()
    this.mastersErvice.productCreateForm(datas)
      .subscribe(res => {
        this.SpinnerService.hide()
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
          this.SpinnerService.hide()
          this.notification.showError("Duplicate Data! ...[INVALID_DATA! ...]")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
          this.SpinnerService.hide()
          this.notification.showWarning("Duplicate Data! ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.SpinnerService.hide()
          this.notification.showSuccess("Saved Successfully!...")
          this.product_id.setValue("")
          this.chipSelectedprod = []
          this.chipSelectedprodid = []
        }
        this.getcommodity(1,10);

        return true
      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }


  createformatremoveprod() {
    let datas = this.productSearchForm.value

    let dataprod = this.chipSelectedprodid
    let datamethod = "remove"

    let productclass = new productremovetype();
    productclass.commodity_id = datas.commodity_id
    productclass.product_id = dataprod
    productclass.method = datamethod
    if (dataprod?.length === 0) {
      //this.toastr.error('Add Product','Empty value not Allowed');
      return false;
    }
    return productclass
  }

  commodityDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getCommodityDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'CommodityReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  riskTypeDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getRiskTypeDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'RiskTypeReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }
  downloadexceldataofdelamat(){
    if(this.first == true){
      this.notification.showWarning('Please Wait Already Work In Progress');
      return false;
    }
    this.first=true;
    this.mastersErvice.getDelmatMakerDownload().subscribe(data=>{
      if(data['status']==true){
        this.first=false;
        this.delmatid=data['id'];
        this.enbaction=true;
        this.notification.showSuccess('Delmat-Excel Prepared Successflly');
      }
      else{
        this.delmatid='';
        this.first=false;
        this.enbaction=false;
        this.notification.showError('Delmat-Excel Prepared Failed');
      }
      
    },
    (error)=>{
      this.first=false;
      this.enbaction=false;
      this.delmatid='';
      this.notification.showError('Delmat-Excel Prepared Failed');
    }
    );
  }
  delmatMakerDownload(){
    if(this.delmatid =='' || this.delmatid == undefined || this.delmatid==null){
      this.notification.showWarning('Please Prepare the Excel and Download');
      return false;
    }
    if(this.second==true){
      this.notification.showWarning('Already Running');
      return true
    }
    this.second=true;
    this.mastersErvice.getDelmatMakerDownloadprepare(this.delmatid)
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'DelmatMakerReport'+ date +".xlsx";
      link.click();
      this.second = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.second=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  delmatApproverDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getDelmatApproverDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'DelmatApproverReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  departmentDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getDeparmentDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'DeparmentReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  ccbsDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getCCBSDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'CCBSReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  bsDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getBSDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'BSReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  ccDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getCCDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'CCReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  designationDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getDesignationDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'DesignationReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  pincodeDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getPincodeDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'PincodeReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  cityDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getCityDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'CityReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  districtDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getDistrictDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'DistrictReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  stateDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getStateDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'StateReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  clientDownload(){
    if(this.first==true){
      this.notification.showWarning('Already Running')
      return true
    }
    this.first=true;
    this.mastersErvice.getClientDownload()
    .subscribe(fullXLS=>{
      console.log(fullXLS);
      let binaryData = [];
      binaryData.push(fullXLS)
      let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
      let link = document.createElement('a');
      link.href = downloadUrl;
      let date: Date = new Date();
      link.download = 'ClientReport'+ date +".xlsx";
      link.click();
      this.first = false;
      this.notification.showSuccess('SUCCESS')
    },
    (error)=>{
      this.first=false;
      this.notification.showWarning(error.status+error.statusText)
    })
  }

  productremovesubmit() {
    let datas = this.createformatremoveprod();
    if (datas === false) {
      this.notification.showError('Remove Product Empty value not Allowed');
      return null;
    }
    console.log('check value', datas)
    this.SpinnerService.show()
    this.mastersErvice.productCreateForm(datas)
      .subscribe(res => {
        this.SpinnerService.hide()
        if (res.code === "INVALID_DATA" && res.description === "Invalid Data or DB Constraint") {
        this.SpinnerService.hide()
          this.notification.showError("Duplicate Data! ...[INVALID_DATA! ...]")
        }
        else if (res.code === "UNEXPECTED_ERROR" && res.description === "Duplicate Name") {
        this.SpinnerService.hide()
          this.notification.showWarning("Duplicate Data! ...")
        } else if (res.code === "UNEXPECTED_ERROR" && res.description === "Unexpected Internal Server Error") {
          this.SpinnerService.hide()
          this.notification.showError("INVALID_DATA!...")
        } else {
          this.SpinnerService.hide()
          this.notification.showSuccess("Updated Successfully!...")
          this.product_id.reset('')
          this.onSubmit.emit();
        }
        this.getcommodity(1,10);
        return true
      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  prodfetch() {
    let data: any = this.shareService.CommodityEdit.value
    let id = data.id
    this.SpinnerService.show()
    this.mastersErvice.getprodselectedlist(id)
      .subscribe((results: any[]) => {
        this.SpinnerService.hide()
        let datas = results["data"];

        this.prodList = datas;

      },(error) => {
        // this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      })
  }

  imagess(e:any){
    this.images=e;
  }
  
  files: any
  myFiles: Array<any> = [];
  getFileDetails(e:any,data:any) {
    this.empupload.pop()
    console.log('q=',data);
    const d:any=new FormData();
    this.empupload[0] = [{'files':[],'images':[],'image':[]}]
    console.log(this.empupload)
    for (var i = 0; i < e.target.files.length; i++) {
      this.empupload[0].files = []
      this.empupload[0].images = [];
      this.empupload[0].image = []

      this.empupload[0].files.push(e.target.files[i].name);
      const reader :any= new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      reader.onload = (_event) => {
      this.empupload[0].images.push(reader.result);
      }
      this.frmData.append('file',e.target.files[i])
    }
    console.log('form=',this.frmData)
    this.empupload[0].image.push(d);
    console.log(this.empupload[0])
  }
  deleteRow(listIndex: number, fileIndex: number) {
    console.log("files", this.empupload[listIndex].files);
    this.empupload[listIndex].files.splice(fileIndex, 1);
    this.empupload[listIndex].images.splice(fileIndex, 1);

  }

  empupload_Save(){
    this.SpinnerService.show();
    this.mastersErvice.getempupload(this.frmData).subscribe(result=>{
      console.log(result);
      this.SpinnerService.hide();
      this.empUploadStatus = result['data']
      let act = 0
      if(result.code == "UNEXPECTED_ERROR"){
        this.notification.showError(result.description)
      }
      else{
        for(let i=0;i<this.empUploadStatus.length;i++){
          if(this.empUploadStatus[i].code == "Failed"){
            act = 1
            this.toastService.warning('','Message - ' + this.empUploadStatus[i].code + ' Emp Code - ' + this.empUploadStatus[i].description,{timeOut:5000});
          }
        }
        if(act == 1){
          this.toastService.success('','Success But Some Emp Id Not Created',{timeOut:5000})
        }
        else{
          this.notification.showSuccess("Success")
        }
      }
      this.SpinnerService.hide();
    },(error)=>{
      this.SpinnerService.hide();
    })
  }
  
  kyenbdata(event:any){
    let d:any=new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)
    console.log(d.test(event.key))
    if(d.test(event.key)==true){
      return false;
    }
    return true;
  }

  commodity(com)
  {
    this.SpinnerService.show()
    this.commodityfor.value.id = com.id
    console.log("this.commodityfor.value.id",this.commodityfor.value.id)
    console.log("comm",com)
    if(com.is_multilevel==1)
    {
      this.is_multil=true
    }
    else
    {
      this.is_multil=false
    }
    this.commodityfor.patchValue(
      {
        id:com?.id,
        name: com?.name,
        is_multilevel: com?.is_multilevel,
        Approval_level:com?.Approval_level
      }
    )
    this.SpinnerService.hide()
  }
  // Multilevel(data) {
  //   this.commodityfor.value.is_multilevel = data.value
  // }
  editcommidity()
  {
    
    console.log("com",this.commodityfor.value)
    this.mastersErvice.commodityCreateForm(this.commodityfor.value)
    .subscribe((results: any[]) => {
      if(results)
      {
        this.notification.showSuccess("Updated Successfully!...")
      }
      this.getcommodity(1,10)
    })
    
  }


}
class ccbsSearchtype {
  costcentre_id: any;
  businesssegment_id: any;
  name: string;
  no: string;
}

class PMDSearchtype {
  branch_code: any;
  branch_name: any;
  location: string;
}

class delSearchtype {
  employee_id: string;
  commodity_id: string;
  type: any;
}
class delappSearchtype {
  employee_id: string;
  commodity_id: string;
  type: any;
}

class producttype {
  product_id: any;
  commodity_id: any;
  method: any;
}

class productremovetype {
  product_id: any;
  commodity_id: any;
  method: any;
} 