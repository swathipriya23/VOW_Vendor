import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { SharedService } from '../../service/shared.service'
import { DataService } from '../../service/data.service'
import { from, Observable, fromEvent } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Memo } from '../../memomodal/memo.model'
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime, map, takeUntil } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MemoService, Category, subCategory, Department } from 'src/app/service/memo.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/service/notification.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
export interface SenderValue {
  id: string;
  name: string;
}

export interface PriorityValue {
  id: string;
  name: string;
}
export interface iEmployeeList {
  full_name: string;
  id: number;
}

export interface iDeptList {
  name: string;
  id: number;
}

@Component({
  selector: 'app-memoredraft',
  templateUrl: './memoredraft.component.html',
  styleUrls: ['./memoredraft.component.scss']
})
export class MemoredraftComponent implements OnInit {
  imageUrl = environment.apiURL
  forwardForm: FormGroup;
  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      link: [['link', ['linkDialogShow', 'unlink']]],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear',
          ],
        ],
      ],
    },
    height: '200px',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear',
        ],
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'hr']]
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };


  editorDisabled = false;
  isLoading = false;
  contentName: any;
  dept_autochange: boolean = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public allEmployeeList: iEmployeeList[];
  departmentList: iDeptList[];
  public chipSelectedEmployeeTo: iEmployeeList[] = [];
  public chipSelectedEmployeeToid = [];
  public to_emp = new FormControl();
  public chipSelectedEmployeeBTo: iEmployeeList[] = [];
  public chipSelectedEmployeeBToid = [];
  public bto_emp = new FormControl();
  public chipSelectedEmployeeCC: iEmployeeList[] = [];
  public chipSelectedEmployeeCCid = [];
  public employeeccControl = new FormControl();
  public allEmployeeApprover: iEmployeeList[];
  public chipSelectedEmployeeApprover: iEmployeeList[] = [];
  public chipSelectedEmployeeApproverid = [];
  public employeeApproverControl = new FormControl();
  public Confidential: boolean = false;
  public Parallel_Delivery: boolean = false;
  SubmitCalled = false;
  isButtonVisible=true;
  memoFrom_rf: any;
  images: string[] = [];
  source_id: any;
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  isSender: boolean;
  refid:any;
  pdfUrls: string;
  jpgUrls: string;
  @ViewChild('senderInput') senderInput: any;
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('employeeToInput') employeeToInput: any;
  @ViewChild('employeeBToInput') employeeBToInput: any;
  @ViewChild('autoto') matToAutocomplete: MatAutocomplete;
  @ViewChild('autobto') matBToAutocomplete: MatAutocomplete;
  @ViewChild('employeeccInput') employeeccInput: any;
  @ViewChild('autocc') matAutocompleteCC: MatAutocomplete;
  @ViewChild('employeeApproverInput') employeeApproverInput: any;
  @ViewChild('autoapprover') matAutocompleteApp: MatAutocomplete;
  @ViewChild('employeeDeptInput') employeeDeptInput: any;
  @ViewChild('autodept') matAutocompleteDept: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;
  categoryID: any;
  datas: any = [];
  senderListData: any = [];
  categoryList: any = [];
  sub_categoryList: any = [];
  documentList: any;
  uploadList = [];
  toListData: Array<any>;
  public chipSelectedEmployeeDept: iDeptList[] = [];
  public chipSelectedEmployeeDeptid = [];
  public employeeDeptControl = new FormControl();
  priorityList: Array<any>;
  rdoIOMnfa: any;
  idValue: any;
  refId: any;
  refversion:any;
  documentDatas: Array<any>;
  intervalid: any;
  public chipSelectedRecommender: iEmployeeList[] = [];
  @ViewChild('employeeInputRecommender') employeeInputRecommender: any;
  public chipSelectedRecommenderId = [];
  public employeeRecommenderControl = new FormControl();


  constructor(private formBuilder: FormBuilder, private dataService: DataService,
    private router: Router, private memoService: MemoService, private toastr: ToastrService,
    private notification: NotificationService,private SpinnerService: NgxSpinnerService,
    public sharedService: SharedService, private sanitizer: DomSanitizer, private route: ActivatedRoute) {
    this.intervalid = setInterval(() => { this.saveAsDraft() }, 60 * 1000);
  }

  ngOnDestroy() {
    if (this.intervalid) {
      clearInterval(this.intervalid);
    }
  }

  ngOnInit(): void {
    this.forwardForm = this.formBuilder.group({
      subject: ['', Validators.required],
      sender: ['', Validators.required],
      manual_reference: [''],
      watermarktext: [''],
      to_emp: [''],
      bto_emp: [''],
      to_dept: [''],
      approver: [''],
      cc: [''],
      category: [''],
      sub_category: [''],
      priority: [''],
      images: [''],
      forward_comments:null,
      recommender: ['',],

    });

    this.route.queryParams
      .subscribe(params => {
        this.memoFrom_rf = params.memofrom_rf;
      }
      );

    this.getForwardFetchData();

    this.forwardForm.get('category').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.getCategory_Dept(value, this.forwardForm.value.sender.id)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;
        this.subcategoryInput.nativeElement.value = '';
      })

    this.forwardForm.get('sub_category').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.getSubCategory1(value, this.categoryID)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.sub_categoryList = datas;
      })

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
          if (this.allEmployeeList.length >= 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.currentpage = datapagination.index;
          }

        })
    }

    if (this.bto_emp !== null) {
      this.bto_emp.valueChanges
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
          if (this.allEmployeeList.length >= 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.currentpage = datapagination.index;
          }
        })
    }

    if (this.employeeccControl !== null) {
      this.employeeccControl.valueChanges
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
          this.allEmployeeList = datas;
          let datapagination = results["pagination"];
          if (this.allEmployeeList.length >= 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.currentpage = datapagination.index;
          }
        })

    }

    if (this.employeeApproverControl !== null) {
      this.employeeApproverControl.valueChanges
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
          this.allEmployeeList = datas;
          let datapagination = results["pagination"];
          if (this.allEmployeeList.length >= 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.currentpage = datapagination.index;
          }
        })
    }

    if (this.employeeDeptControl !== null) {
      this.employeeDeptControl.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          tap(() => {
            this.isLoading = true;
          }),
          switchMap(value => this.memoService.getDepartmentPage(value, 1, '')
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
          this.departmentList = datas;
          let todeptlist =datas;
          const index = todeptlist.findIndex(todept => todept.code === "DGRP11"); 
          if (index !== -1)
          {
            todeptlist.splice(index, 1); 
          }
          if (this.departmentList.length >= 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.currentpage = datapagination.index;
          }
        })


          if (this.employeeRecommenderControl !== null) {
          this.employeeRecommenderControl.valueChanges
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
              if (this.allEmployeeList.length >= 0) {
                this.has_next = datapagination.has_next;
                this.has_previous = datapagination.has_previous;
                this.currentpage = datapagination.index;
              }
            })
        }
    }

  } //end of oninit

  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  onBlur() {
    // console.log('Blur');
  }

  onDelete(file) {
    // console.log('Delete file', file.url);
  }

  summernoteInit(event) {
    // console.log(event);
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
            if (atBottom) {
              if (this.has_next === true) {
                this.memoService.get_EmployeeList(this.employeeToInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.allEmployeeList = this.allEmployeeList.concat(datas);
                    if (this.allEmployeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }//if (this.has_next === true)
            }//endof atBottom
          });
      }
    });
  } //endof auto completeTo

  autocompleteBToScroll() {
    setTimeout(() => {
      if (
        this.matBToAutocomplete &&
        this.autocompleteTrigger &&
        this.matBToAutocomplete.panel
      ) {
        fromEvent(this.matBToAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matBToAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matBToAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.matBToAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.matBToAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.memoService.get_EmployeeList(this.employeeBToInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.allEmployeeList = this.allEmployeeList.concat(datas);
                    if (this.allEmployeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }//if (this.has_next === true)
            }//endof atBottom
          });
      }
    });
  } //endof auto completeBTo

  autocompleteCCScroll() {
    setTimeout(() => {
      if (
        this.matAutocompleteCC &&
        this.autocompleteTrigger &&
        this.matAutocompleteCC.panel
      ) {
        fromEvent(this.matAutocompleteCC.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompleteCC.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompleteCC.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteCC.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteCC.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.memoService.get_EmployeeList(this.employeeccInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.allEmployeeList = this.allEmployeeList.concat(datas);
                    if (this.allEmployeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }//if (this.has_next === true)
            }//endof atBottom
          });
      }
    });
  } //endof autocomplete CC

  autocompleteAppScroll() {
    setTimeout(() => {
      if (
        this.matAutocompleteApp &&
        this.autocompleteTrigger &&
        this.matAutocompleteApp.panel
      ) {
        fromEvent(this.matAutocompleteApp.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.matAutocompleteApp.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.matAutocompleteApp.panel.nativeElement.scrollTop;
            const scrollHeight = this.matAutocompleteApp.panel.nativeElement.scrollHeight;
            const elementHeight = this.matAutocompleteApp.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              if (this.has_next === true) {
                this.memoService.get_EmployeeList(this.employeeApproverInput.nativeElement.value, this.currentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.allEmployeeList = this.allEmployeeList.concat(datas);
                    if (this.allEmployeeList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }//if (this.has_next === true)
            }//endof atBottom
          });
      }
    });
  } //endof auto completeApproval

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
                    this.departmentList = this.departmentList.concat(datas);
                    if (this.departmentList.length >= 0) {
                      this.has_next = datapagination.has_next;
                      this.has_previous = datapagination.has_previous;
                      this.currentpage = datapagination.index;
                    }
                  })
              }//if (this.has_next === true)
            }//endof atBottom
          });
      }
    });
  } //endof auto matAutocompleteDept

  getForwardFetchData() {
    let id = this.sharedService.fetchData.value;
    this.idValue = id
    this.dataService.getFetch(id)
      .subscribe((data) => {
        this.Confidential = data.confidential;
        this.Parallel_Delivery = data.parallel_delivery;
        this.isSender = data.is_sender;
        this.documentList = data.document_arr;
        this.refid =data.ref_id;
        this.refversion = data.ref_version;
        this.source_id = data.source_id;
        let priority = data["priority"];
        if (priority) {
          let priorityid = priority['id'];
          let name = priority['name']
          this.forwardForm.patchValue({
            "priority": priority
          })
        }
        let memoClass = new Memo();
        memoClass.subject = data['subject']
        memoClass.watermark_txt = data['watermark_txt']
        memoClass.manual_reference = data['manual_reference']
        // memoClass.forward_comments = data['forward_comments']
        if (data['type'] === 'iom') {
          this.rdoIOMnfa = 'Inter-Office Memo';
          this.sharedService.Memofrom = 'IOMEMO'
        }
        if (data['type'] === 'nfa') {
          this.rdoIOMnfa = 'Note for Approval';
          this.sharedService.Memofrom = 'NFA-MEMO'
        }
        this.contentName = data['content'];
        let senderValue = data['sender'];
        let senderId = senderValue['id'];
        if (senderValue['name']) {
          let deptValues: any = {
            "name": senderValue.name,
            "id": senderId
          }
          memoClass.sender = deptValues;
          this.senderListData.push(deptValues);
        }
        
        let categoryValue = data['category'];
        let categoryId = categoryValue['id'];
        let categoryName = categoryValue['name'];
        let cat = categoryId
        if (cat !== -1) {
          let cats: any = {
            "name": categoryName,
            "id": categoryId
          }
          memoClass.category = cats;
          this.categoryID = cat;
          this.categoryList.push(cats);
        }
        let subCategoryValue = data['sub_category'];
        let subcategoryId = subCategoryValue['id'];
        let subcategoryName = subCategoryValue['name'];
        let subCategory = subcategoryId
        if (subCategory !== -1) {
          let subCategoryValues: any = {
            "name": subcategoryName,
            "id": subcategoryId
          }
          memoClass.sub_category = subCategoryValues;
          this.sub_categoryList.push(subCategoryValues)
        }
        data.cc.forEach(element => {
          this.chipSelectedEmployeeCC.push(element);
          this.chipSelectedEmployeeCCid.push(element.id);
        });
        data.to_dept.forEach(element => {
          this.chipSelectedEmployeeDept.push(element);
          this.chipSelectedEmployeeDeptid.push(element.id);
        });
        data.approver.forEach(element => {
          this.chipSelectedEmployeeApprover.push(element);
          this.chipSelectedEmployeeApproverid.push(element.id);
        });
        data.recommender.forEach(element => {
          this.chipSelectedRecommender.push(element);
          this.chipSelectedRecommenderId.push(element.id);
        });
        this.datas = data;
        this.refId = data.ref_id
        this.dept_autochange = true;
        this.forwardForm.patchValue({
          subject: memoClass.subject,
          sender: memoClass.sender,
          manual_reference: memoClass.manual_reference,
          watermarktext: memoClass.watermark_txt,
          to_emp: this.chipSelectedEmployeeToid,
          to_dept: this.chipSelectedEmployeeDeptid,
          approver: this.chipSelectedEmployeeApproverid,
          recommender: this.chipSelectedRecommenderId,
          category: memoClass.category,
          sub_category: memoClass.sub_category,
          cc: this.chipSelectedEmployeeCCid,
          ref_id: this.refId
        }, { emitEvent: false });
        // this.dept_autochange=false;
        return memoClass
      })
    if (this.memoFrom_rf === 'CLOSEandCLONE') {
      this.idValue = '';
    }
  } ///getForwardFetchData()

  imagePreview(attachment) {
    const getToken = localStorage.getItem("sessionData");
    let tokenValue = JSON.parse(getToken);
    let token = tokenValue.token;
    pdfUrls: String;
    jpgUrls: String;

    let filename = attachment.file_name;
    let fileid = attachment.id;
    let fileextn = filename.split('.')

    if (fileextn[1] === "png" || fileextn[1] === "jpeg" || fileextn[1] === "jpg") {
      this.jpgUrls = this.imageUrl + "memserv/memo/download/" + fileid + "?token=" + token;
    }
    else {
      this.pdfUrls = this.imageUrl + "memserv/memo/download/" + fileid + "?type= " + filename + "&token=" + token;
      let anchor = document.createElement('a');
      anchor.href = this.pdfUrls;
      anchor.target = '_blank';
      anchor.click();
    }
  }

  createMemoInput() {
    let data = this.forwardForm.controls;
    let memoclass1 = new Memo();
    memoclass1.confidential = this.Confidential;
    memoclass1.parallel_delivery = this.Parallel_Delivery;
    memoclass1.priority =  data.priority.value.id
    let orderno: number = 0;
    let finalappArray = [];
    this.chipSelectedEmployeeApproverid.forEach((eachitem) => {
      let apporder = {
        "id": eachitem,
        "order": orderno + 1
      }
      orderno = orderno + 1;
      finalappArray.push(apporder)
    });
    memoclass1.to_dept = this.chipSelectedEmployeeDeptid;
    memoclass1.approver = finalappArray
    memoclass1.cc = this.chipSelectedEmployeeCCid
    memoclass1.to_emp = this.chipSelectedEmployeeToid;
    memoclass1.bto_emp = this.chipSelectedEmployeeBToid;
    memoclass1.subject = this.forwardForm.value.subject;
    memoclass1.manual_reference = this.forwardForm.value.manual_reference;
    memoclass1.watermark_txt = this.forwardForm.value.watermarktext;
    // memoclass1.forward_comments = this.forwardForm.value.forward_comments;
    if (this.rdoIOMnfa === 'Inter-Office Memo') {
      memoclass1.type = 'iom'
    }
    if (this.rdoIOMnfa === 'Note for Approval') {
      memoclass1.type = 'nfa'
    }

    memoclass1.sender = this.forwardForm.value.sender.id + '_dept';
    if (this.forwardForm.value.category === undefined) {
      memoclass1.category = null;
    } else {
      memoclass1.category = this.forwardForm.value.category.id;
    }
    if (this.forwardForm.value.sub_category === undefined) {
      memoclass1.sub_category = null;
    } else {
      memoclass1.sub_category = this.forwardForm.value.sub_category.id;
    }
    memoclass1.content = this.contentName;
    memoclass1.images = this.images;
    let finalrecArray = [];
    let ordernos: number = 0;
    this.chipSelectedRecommenderId.forEach((eachitem) => {
      let recommorder = {
        "id": eachitem,
        "order": ordernos + 1
      }
      ordernos = ordernos + 1;
      finalrecArray.push(recommorder)
    });

    memoclass1.recommender = finalrecArray;
    return memoclass1;
  }

  forwardMemoForm() {
    this.SpinnerService.show();
    if (this.forwardForm.value.sender.id === undefined) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid From value', { timeOut: 1500 });
      return false;
    }
    if (this.chipSelectedEmployeeApproverid.length === 0) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Approver/Signee should be mandatory', { timeOut: 1500 });
      return false;
    }
    if (this.sharedService.Memofrom === 'NFA-MEMO') {
      for (let i = 0; i < this.chipSelectedEmployeeApproverid.length; i++) {
        if (this.chipSelectedEmployeeApproverid[i] === this.sharedService.loginEmpId) {
          this.SpinnerService.hide();
          this.toastr.error('Memo Add', 'Approver name can not be yours', { timeOut: 1500 });
          return false;
        }
      }
      for (let i = 0; i < this.chipSelectedRecommenderId.length; i++) {
        if (this.chipSelectedRecommenderId[i] === this.sharedService.loginEmpId) {
          this.SpinnerService.hide();
          this.toastr.error('Memo Add', 'Recommender name can not be yours', { timeOut: 1500 });
         return false;
        }
      }
    }

    if (this.sharedService.Memofrom === 'IOMEMO') {
      if (this.chipSelectedEmployeeToid.length === 0 && this.chipSelectedEmployeeDeptid.length === 0) {
        this.SpinnerService.hide();
        this.toastr.error('Memo Add', 'To employee or To Department should be mandatory', { timeOut: 1500 });
        return false;
      }
    }
    if (this.forwardForm.value.subject === "") {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid subject', { timeOut: 1500 });
      return false;
    }
    if (this.forwardForm.value.watermarktext === "") {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid Watermark text', { timeOut: 1500 });
      return false;
    }

    this.dataService.createForwardForm(this.createMemoInput(), this.images, this.refId)
      .subscribe(res => {
        let id = res.id
        this.sharedService.fetchData.next(id);
        this.SpinnerService.hide();
        this.router.navigate(["/ememo/memoView"], { queryParams: { mid: id, from: 'draft' }, skipLocationChange: true });
        return true
      },
      error => {
        this.SpinnerService.hide();
      }
      );
  }

  OnCategoryChange(e) {
    this.categoryID = e.source.value.id;
  }

  OnSenderChange(e) {
    if (e.isUserInput == true) {
      if (this.dept_autochange === false) {
        this.categoryInput.nativeElement.value = '';
        this.subcategoryInput.nativeElement.value = '';
      }
      this.dept_autochange = false;
    }
  }

  focusCategory(e) {
    if (this.forwardForm.value.sender.id === undefined) {
      this.toastr.error('Memo Add', 'Invalid From/Sender value', { timeOut: 1500 });
      return false;
    }

    if (this.categoryInput.nativeElement.value === '') {
      this.memoService.getCategory_Dept('', this.forwardForm.value.sender.id)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.categoryList = datas;
        });
    }
  }

  focussubCategory(e) {
    if (this.subcategoryInput.nativeElement.value === '' && this.categoryID !== undefined) {
      this.memoService.getSubCategory1(' ', this.categoryID)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.sub_categoryList = datas;
          this.subcategoryInput.nativeElement.value = '';
        });
    }
  }

  public displayCategory(categorydis?: Category): string | undefined {

    return categorydis ? categorydis.name : undefined;
  }
  get categorydis() {
    return this.forwardForm.get('category');
  }

  public displaysubCategory(subcategory?: subCategory): string | undefined {

    return subcategory ? subcategory.name : undefined;
  }
  get subcategory() {
    return this.forwardForm.get('sub_category');
  }


  public removeEmployeeTo(employee: iEmployeeList): void {
    const index = this.chipSelectedEmployeeTo.indexOf(employee);
    if (index >= 0) {
      this.chipSelectedEmployeeTo.splice(index, 1);
      this.chipSelectedEmployeeToid.splice(index, 1);
      this.employeeToInput.nativeElement.value = '';
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
  }

  public removeEmployeeBTo(employee: iEmployeeList): void {
    const index = this.chipSelectedEmployeeBTo.indexOf(employee);
    if (index >= 0) {
      this.chipSelectedEmployeeBTo.splice(index, 1);
      this.chipSelectedEmployeeBToid.splice(index, 1);
      this.employeeBToInput.nativeElement.value = '';
    }
  }

  public employeeBToSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeBToByName(event.option.value.full_name);
    this.employeeBToInput.nativeElement.value = '';
  }
  private selectEmployeeBToByName(employeeName) {
    let foundEmployeebto = this.chipSelectedEmployeeBTo.filter(employeebto => employeebto.full_name == employeeName);
    if (foundEmployeebto.length) {
      return;
    }
    let foundEmployeebto1 = this.allEmployeeList.filter(employeebto => employeebto.full_name == employeeName);
    if (foundEmployeebto1.length) {
      this.chipSelectedEmployeeBTo.push(foundEmployeebto1[0]);
      this.chipSelectedEmployeeBToid.push(foundEmployeebto1[0].id)
    }
  }


  public removeEmployeeCC(employeecc: iEmployeeList): void {
    const index = this.chipSelectedEmployeeCC.indexOf(employeecc);
    if (index >= 0) {
      this.chipSelectedEmployeeCC.splice(index, 1);
      this.chipSelectedEmployeeCCid.splice(index, 1);
      this.employeeccInput.nativeElement.value = '';
    }
  }

  public employeeccSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeCCByName(event.option.value.full_name);
    this.employeeccInput.nativeElement.value = '';
  }
  private selectEmployeeCCByName(employeeccName) {
    let foundEmployeeCC1 = this.chipSelectedEmployeeCC.filter(employeecc => employeecc.full_name == employeeccName);
    if (foundEmployeeCC1.length) {
      return;
    }
    let foundEmployeeCC = this.allEmployeeList.filter(employeecc => employeecc.full_name == employeeccName);
    if (foundEmployeeCC.length) {
      this.chipSelectedEmployeeCC.push(foundEmployeeCC[0]);
      this.chipSelectedEmployeeCCid.push(foundEmployeeCC[0].id)
    }
  }

  public removeEmployeeApprover(employee: iEmployeeList): void {
    const index = this.chipSelectedEmployeeApprover.indexOf(employee);
    if (index >= 0) {
      this.chipSelectedEmployeeApprover.splice(index, 1);
      this.chipSelectedEmployeeApproverid.splice(index, 1);
      this.employeeApproverInput.nativeElement.value = '';
    }
  }

  public employeeApproverSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeApproverByName(event.option.value.full_name,event.option.value.id);
    this.employeeApproverInput.nativeElement.value = '';
  }
  private selectEmployeeApproverByName(employee,employeeid) {
    let foundEmployeeApproverid = this.chipSelectedEmployeeApprover.filter(employeecc => employeecc.id == employeeid);
    if (foundEmployeeApproverid.length) {
      return;
    }
    let foundEmployeeApprover = this.allEmployeeList.filter(employeecc => employeecc.full_name == employee);
    if (foundEmployeeApprover.length) {
      this.chipSelectedEmployeeApprover.push(foundEmployeeApprover[0]);
      this.chipSelectedEmployeeApproverid.push(foundEmployeeApprover[0].id)
    }
  }

  public removeEmployeeDept(dept: iDeptList): void {
    const index = this.chipSelectedEmployeeDept.indexOf(dept);
    if (index >= 0) {
      this.chipSelectedEmployeeDept.splice(index, 1);
      this.chipSelectedEmployeeDeptid.splice(index, 1);
      this.employeeDeptInput.nativeElement.value = '';
    }
  }

  public employeeDeptSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeDeptByName(event.option.value.name,event.option.value.id);
    this.employeeDeptInput.nativeElement.value = '';
  }
  private selectEmployeeDeptByName(dept,deptid) {
    let foundEmployeeDept1 = this.chipSelectedEmployeeDept.filter(employeedept => employeedept.id == deptid);
    if (foundEmployeeDept1.length) {
      return;
    }
    let foundEmployeeDept = this.departmentList.filter(employeedept => employeedept.name == dept);
    if (foundEmployeeDept.length) {
      this.chipSelectedEmployeeDept.push(foundEmployeeDept[0]);
      this.chipSelectedEmployeeDeptid.push(foundEmployeeDept[0].id)
      console.log("this.chipSelectedEmployeeDept",this.chipSelectedEmployeeDept)
    }
  }

  redraftCreate() {
    let data = this.forwardForm.controls;
    let memoclass1 = new DraftMemo();
    if (this.refId){
      memoclass1.ref_id=this.refId;
    }
    memoclass1.confidential = this.Confidential;
    memoclass1.parallel_delivery = this.Parallel_Delivery;
    memoclass1.priority =  data.priority.value.id
    let orderno: number = 0;
    let finalappArray = [];
    this.chipSelectedEmployeeApproverid.forEach((eachitem) => {
      let apporder = {
        "id": eachitem,
        "order": orderno + 1
      }
      orderno = orderno + 1;
      finalappArray.push(apporder)
    });
    memoclass1.to_dept = this.chipSelectedEmployeeDeptid;
    memoclass1.approver = finalappArray
    memoclass1.cc = this.chipSelectedEmployeeCCid
    memoclass1.to_emp = this.chipSelectedEmployeeToid;
    memoclass1.bto_emp = this.chipSelectedEmployeeBToid;
    memoclass1.subject = this.forwardForm.value.subject;
    memoclass1.manual_reference = this.forwardForm.value.manual_reference;
    memoclass1.forward_comments = this.forwardForm.value.forward_comments;
    
    memoclass1.watermark_txt = this.forwardForm.value.watermarktext;
    if (this.rdoIOMnfa === 'Inter-Office Memo') {
      memoclass1.type = 'iom'
    }
    if (this.rdoIOMnfa === 'Note for Approval') {
      memoclass1.type = 'nfa'
    }

    memoclass1.sender = this.forwardForm.value.sender.id + '_dept';
    if (this.forwardForm.value.category === undefined) {
      memoclass1.category = null;
    } else {
      memoclass1.category = this.forwardForm.value.category.id;
    }
    if (this.forwardForm.value.sub_category === undefined) {
      memoclass1.sub_category = null;
    } else {
      memoclass1.sub_category = this.forwardForm.value.sub_category.id;
    }
    memoclass1.content = this.contentName;
    let finalrecArray = [];
    let ordernos: number = 0;
    this.chipSelectedRecommenderId.forEach((eachitem) => {
      let recommorder = {
        "id": eachitem,
        "order": ordernos + 1
      }
      ordernos = ordernos + 1;
      finalrecArray.push(recommorder)
    });

    memoclass1.recommender = finalrecArray;
    return memoclass1;
  }

  saveAsDraft() {
    this.SpinnerService.show();
    if (this.SubmitCalled === true) {
      this.SpinnerService.hide();
      return false;
    }
    this.isButtonVisible=false;

    if (this.forwardForm.value.sender.id === undefined) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid From/Sender value', { timeOut: 1500 });
      this.isButtonVisible=true;
      return false;
    }
    if (this.chipSelectedEmployeeApproverid.length === 0) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Approver/Signee should be mandatory', { timeOut: 1500 });
      this.isButtonVisible=true;
     return false;
    }
    if (this.sharedService.Memofrom === 'NFA-MEMO') {
      for (let i = 0; i < this.chipSelectedEmployeeApproverid.length; i++) {
        if (this.chipSelectedEmployeeApproverid[i] === this.sharedService.loginEmpId) {
          this.SpinnerService.hide();
          this.toastr.error('Memo Add', 'Approver name can not be yours', { timeOut: 1500 });
          this.isButtonVisible=true;
          return false;
        }
      }
      for (let i = 0; i < this.chipSelectedRecommenderId.length; i++) {
        if (this.chipSelectedRecommenderId[i] === this.sharedService.loginEmpId) {
          this.SpinnerService.hide();
          this.toastr.error('Memo Add', 'Recommender name can not be yours', { timeOut: 1500 });
          return false;
        }
      }
    }

    if (this.forwardForm.value.priority.id === undefined) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid Priority', { timeOut: 1500 });
      this.isButtonVisible=true;
      return false;
    }

    if (this.forwardForm.value.subject === '') {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid subject', { timeOut: 1500 });
      this.isButtonVisible=true;
      return false;
    }
    if (this.forwardForm.value.watermarktext === '') {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid Watermark text', { timeOut: 1500 });
      this.isButtonVisible=true;
      return false;
    }

    // var answer = window.confirm("Save Draft data?");
    // if (answer) {
    //     //some code
    // }
    // else {
    //   return false;
    // }

    if (this.idValue === '') {
      // this.uploadList = [];
      this.dataService.saveAsDraft(this.redraftCreate(), '', this.images).subscribe((res) => {
        if(res.code === undefined) {
          this.SpinnerService.hide();
          this.notification.showSuccess('Draft Saved!...');
          this.idValue = res.id;
          this.dataService.getFetch(this.idValue)
          .subscribe(result => {
            this.documentList = result.document_arr;
            this.uploadList = [];
          },
          error => {
            this.SpinnerService.hide();
          });
        } else {
          this.SpinnerService.hide();
          this.notification.showError(res.description)
        }        
        this.isButtonVisible=true;
        return true;
      },
      error => {
        this.SpinnerService.hide();
      }
      );
    } else {

      this.dataService.reDraftSave(this.redraftCreate(), this.idValue, this.images, this.documentList)
        .subscribe(result => {
          if(result.code === undefined) {
            this.SpinnerService.hide();
          this.notification.showSuccess("Draft Updated...")
          this.dataService.getFetch(this.idValue)
            .subscribe(result => {
              this.documentList = result.document_arr;
              this.uploadList = [];
              this.images = [];
            },
            error => {
              this.SpinnerService.hide();
            });
          } else {
            this.SpinnerService.hide();
            this.notification.showError(result.description)
          } 
          
            this.isButtonVisible=true;
        },
        error => {
          this.SpinnerService.hide();
        });
    }

  }

  MovetoView() {
    this.SubmitCalled = true
   
    if (this.forwardForm.value.sender.id === undefined) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid From value', { timeOut: 1500 });
      this.SubmitCalled = false;
      return false;
    }
    if (this.chipSelectedEmployeeApproverid.length === 0) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Approver/Signee should be mandatory', { timeOut: 1500 });
      this.SubmitCalled = false;
      return false;
    }
    if (this.sharedService.Memofrom === 'NFA-MEMO') {
      for (let i = 0; i < this.chipSelectedEmployeeApproverid.length; i++) {
        if (this.chipSelectedEmployeeApproverid[i] === this.sharedService.loginEmpId) {
          this.SpinnerService.hide();
          this.toastr.error('Memo Add', 'Approver name can not be yours', { timeOut: 1500 });
          this.SubmitCalled = false;
          return false;
        }
      }
      for (let i = 0; i < this.chipSelectedRecommenderId.length; i++) {
        if (this.chipSelectedRecommenderId[i] === this.sharedService.loginEmpId) {
          this.SpinnerService.hide();
          this.toastr.error('Memo Add', 'Recommender name can not be yours', { timeOut: 1500 });
          return false;
        }
      }
    }
    if (this.sharedService.Memofrom === 'IOMEMO') {
      if (this.chipSelectedEmployeeToid.length === 0 && this.chipSelectedEmployeeDeptid.length === 0) {
        this.SpinnerService.hide();
        this.toastr.error('Memo Add', 'To employee or To Department should be mandatory', { timeOut: 1500 });
        this.SubmitCalled = false;
        return false;
      }
    }

    if (this.forwardForm.value.priority.id === undefined) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid Priority', { timeOut: 1500 });
      this.SubmitCalled = false;
      return false;
    }

    if (this.forwardForm.value.subject === "") {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid subject', { timeOut: 1500 });
      this.SubmitCalled = false;
      return false;
    }
    if (this.forwardForm.value.watermarktext === "") {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid Watermark text', { timeOut: 1500 });
      this.SubmitCalled = false;
      return false;
    }
    var answer = window.confirm("Save Memo?");
    if (answer) {
      //some code
    }
    else {
      this.SubmitCalled = false;
      return false;
    }
    this.SpinnerService.show();
    if (this.idValue) {
      
      this.dataService.reDraftSave(this.redraftCreate(), this.idValue, this.images, this.documentList).subscribe((res) => {
        if(res.code === undefined) {
        this.SpinnerService.hide();
        this.notification.showSuccess('Draft Updated and ready to create Memo!...');
        this.dataService.sendMemo(this.idValue).subscribe((res) => {
          this.sharedService.fetchData.next(this.idValue);
          this.SpinnerService.hide();
          this.router.navigate(['/ememo/memoView'], { queryParams: { mid: this.idValue, from: 'memoredraft' ,MemoView: "YES"}, skipLocationChange: true });
        },
        error => {
          this.SpinnerService.hide();
        });
      } else {
        this.SpinnerService.hide();
        this.notification.showError(res.description)
      }
        return true;
      },
      error => {
        this.SpinnerService.hide();
      }
      );


    } else {
      this.uploadList = [];
      this.dataService.createNewMemo(this.createMemoInput(), this.images).subscribe((result) => {
        if(result.code === undefined) {
        let id = result.id;
        this.sharedService.fetchData.next(id);
        this.idValue = result.id;
        this.SpinnerService.hide();
        this.notification.showSuccess("Memo created")
        this.router.navigate(['/ememo/memoView'], { queryParams: { mid: id ,MemoView: "YES"}, skipLocationChange: true });
      } else {
        this.SpinnerService.hide();
        this.notification.showError(result.description)
      } 
        return true;
      },
      error => {
        this.SpinnerService.hide();
      }
      );
    }

    // if (this.idValue){
    //   this.redraftCreate()
    //   this.uploadList = [];
    //   this.dataService.saveDraft(this.idValue)
    //     .subscribe(result => {
    //       this.notification.showSuccess("Draft Moved to View ...")
    //       this.router.navigate(["/ememo/memoView"], { queryParams: { mid: this.idValue }, skipLocationChange: true });
    //     })
    // }


  }
  attachmentDelete(s, index) {
    this.documentList.forEach((s, i) => {
      if (index === i)
        this.documentList.splice(index, 1)
      this.images.splice(index, 1)

    })
  }

  fileChange(event) {
    let imagesList = [];
    for (var i = 0; i < event.target.files.length; i++) {
      this.images.push(event.target.files[i]);
    }
    this.InputVar.nativeElement.value = "";
    imagesList.push(this.images)
    this.uploadList = [];
    imagesList.forEach(item => {
      let s = item;
      s.forEach(it => {
        let io = it.name;
        this.uploadList.push(io);
      })
    })
  }

  deleteUpload(s, index) {
    this.uploadList.forEach((s, i) => {
      if (index === i) {
        this.uploadList.splice(index, 1)
        this.images.splice(index, 1);
      }
    })
  }

  private getSenderList() {
    this.memoService.get_empTodeptMapping1('memo')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.senderListData = datas;
        const index =  this.senderListData.findIndex(fromdept => fromdept.code === "DGRP11"); 
        if (index !== -1)
        {
          this.senderListData.splice(index, 1); 
        } 
      })
  }
  getSender() {
    this.getSenderList();
    this.forwardForm.get('sender').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.get_empTodeptMapping1('memo')
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.senderListData = datas;
        const index =  this.senderListData.findIndex(fromdept => fromdept.code === "DGRP11"); 
        if (index !== -1)
        {
          this.senderListData.splice(index, 1); 
        } 
        this.categoryInput.nativeElement.value = '';	
        this.subcategoryInput.nativeElement.value = '';
      })
  }

  public displayFnSender(senderValue?: SenderValue): string | undefined {
    return senderValue ? senderValue.name : undefined;
  }
  get senderValue() {
    return this.forwardForm.value.get('sender');
  }



  getPriority() {
    this.memoService.get_priority()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.priorityList = datas;
      })
  }
  getPriorityList() {
    this.getPriority();
    this.forwardForm.get('priority').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.get_priority()
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.priorityList = datas;
      })
  }

  public displayFnPriority(priority?: PriorityValue): string | undefined {
    return priority ? priority.name : undefined;
  }

  get priority() {
    return this.forwardForm.value.get('priority');
  }

  public removeEmployeeApprover1(employee: iEmployeeList): void {
    const index = this.chipSelectedRecommender.indexOf(employee);
    if (index >= 0) {
      this.chipSelectedRecommender.splice(index, 1);
      this.chipSelectedRecommenderId.splice(index, 1);
      this.employeeInputRecommender.nativeElement.value = '';
    }
  }

  public employeeApproverSelected1(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeApproverByName1(event.option.value.full_name);
    this.employeeInputRecommender.nativeElement.value = '';
  }

  private selectEmployeeApproverByName1(employee) {
    let foundEmployeeApprover1 = this.chipSelectedRecommender.filter(employeecc => employeecc.full_name == employee);
    if (foundEmployeeApprover1.length) {
      return;
    }
    let foundEmployeeApprover = this.allEmployeeList.filter(employeecc => employeecc.full_name == employee);
    if (foundEmployeeApprover.length) {
      this.chipSelectedRecommender.push(foundEmployeeApprover[0]);
      this.chipSelectedRecommenderId.push(foundEmployeeApprover[0].id)
    }
  }

}

export class DraftMemo {
  ref_id:any;
  subject: string;
  watermark_txt:string;
  manual_reference:string;
  sender: any;
  type:any;
  category: number;
  sub_category: number;
  content: any;
  to_emp: any;
  bto_emp: any;
  to_dept: any;
  approver: any;
  cc: any;
  images: any;
  confidential: any;
  priority: string;
  source_id:any;
  source_type:any;
  forward_comments:any;
  recommender: any;
  parallel_delivery: any;

}