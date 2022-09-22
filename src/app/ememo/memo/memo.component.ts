import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { DataService } from '../../service/data.service'
import { from, Observable, fromEvent } from 'rxjs';
import { Router } from '@angular/router'
import { SharedService } from '../../service/shared.service'
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { MemoService, Department, Category, subCategory } from 'src/app/service/memo.service';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/service/notification.service';
import { Subscription, timer } from 'rxjs';
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
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.css']
})

export class MemoComponent implements OnInit {
  // subscription: Subscription;
  imageUrl = environment.apiURL
  memoAddForm: FormGroup;

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
    // uploadImagePath: '/api/upload',
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
      ['insert', ['table', 'picture', 'link', 'hr']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

  editorDisabled = false;

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.memoAddForm.get('html').value);
  }

  isLoading = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  has_next = true;
  has_previous = true;
  currentpage: number = 1;
  public allEmployeeList: iEmployeeList[];
  departmentList: iDeptList[];
  public chipSelectedEmployeeTo: iEmployeeList[] = [];
  public chipSelectedEmployeeToid = [];
  public to_emp = new FormControl();
  public chipSelectedEmployeeBTo: iEmployeeList[] = [];
  public chipSelectedEmployeeBToid = [];
  public bto_emp = new FormControl();
  private readonly RELOAD_TOP_SCROLL_POSITION = 50;
  @ViewChild('categoryInput') categoryInput: any;
  @ViewChild('subcategoryInput') subcategoryInput: any;
  @ViewChild('employeeToInput') employeeToInput: any;
  @ViewChild('employeeBToInput') employeeBToInput: any;
  @ViewChild('autoto') matToAutocomplete: MatAutocomplete;
  @ViewChild('autobto') matBToAutocomplete: MatAutocomplete;
  @ViewChild('employeeccInput') employeeccInput: any;
  @ViewChild('autocc') matAutocompleteCC: MatAutocomplete;
  @ViewChild('employeeApproverInput') employeeApproverInput: any;
  @ViewChild('employeeApproverInput1') employeeApproverInput1: any;
  @ViewChild('autoapprover') matAutocompleteApp: MatAutocomplete;
  @ViewChild('autoapprover1') matAutocompleteApp1: MatAutocomplete;
  @ViewChild('employeeDeptInput') employeeDeptInput: any;
  @ViewChild('autodept') matAutocompleteDept: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild('senderValue') matAutocomplete: MatAutocomplete;

  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;
  categoryID: any;
  draftSaveId: any;
  uploadList = [];
  documentList: any;
  category = new FormControl();
  sub_category = new FormControl();
  public chipSelectedEmployeeCC: iEmployeeList[] = [];
  public chipSelectedEmployeeCCid = [];
  public employeeccControl = new FormControl();
  public chipSelectedEmployeeDept: iDeptList[] = [];
  public chipSelectedEmployeeDeptid = [];
  public employeeDeptControl = new FormControl();
  // public chipSelectedDeptid = [];
  public allEmployeeApprover: iEmployeeList[];
  public chipSelectedEmployeeApprover: iEmployeeList[] = [];
  public chipSelectedEmployeeApproverid = [];
  public chipSelectedEmployeeRecommender: iEmployeeList[] = [];
  public chipSelectedEmployeeRecommenderid = [];
  public employeeApproverControl = new FormControl();
  public employeeRecommenderControl = new FormControl();
  public Confidential: boolean = false;
  public Parallel_Delivery: boolean = false;
  SubmitCalled = false;
  isButtonVisible = true;
  rdoIOMnfa: any;
  employeeList = [];
  senderList: Array<any>;
  pdfUrls: string;
  jpgUrls: string;
  priorityList: Array<any>;
  categoryList: Array<Category>;
  sub_categoryList: Array<subCategory>;
  images: string[] = [];
  intervalid: any;
  constructor(private formBuilder: FormBuilder, private dataService: DataService,
    public sharedService: SharedService, private toastr: ToastrService, private notification: NotificationService,
    private router: Router, private memoService: MemoService, private sanitizer: DomSanitizer,
    private SpinnerService: NgxSpinnerService
    ) {
    this.intervalid = setInterval(() => { this.saveDraft() }, 60 * 1000);
  }

  ngOnDestroy() {
    if (this.intervalid) {
      clearInterval(this.intervalid);
    }
  }

  ngOnInit(): void {

    // this.subscription = timer(0, 10000).pipe(
    //   switchMap(() => this.myservice.checkdata())
    // ).subscribe(result => this.statustext = result);

    this.memoAddForm = this.formBuilder.group({
      subject: ['', Validators.required],
      sender: ['', Validators.required],
      priority: [''],
      manual_reference: [''],
      watermarktext: [''],
      to_emp: [''],
      bto_emp: [''],
      to_dept: [''],
      approver: ['', Validators.required],
      recommender: ['', Validators.required],
      cc: ['', Validators.required],
      category: [''],
      sub_category: [''],
      images: ['', Validators.required],
      html: ['', Validators.required],
    })
    this.memoAddForm.controls['priority'].setValue({id:2,name:"Medium"});
    this.memoAddForm.patchValue({ watermarktext: 'NAC' });
    if (this.sharedService.Memofrom === 'IOMEMO') {
      this.sharedService.MyModuleName = "eMemo - Inter Office Memo";
      this.rdoIOMnfa = 'iom';
    } else {
      this.sharedService.MyModuleName = "eMemo - Note for Approval";
      this.rdoIOMnfa = 'nfa';
    }
    // this.getSender();
    // this.getPriority();
    this.getForwardMessage();
    this.memoAddForm.get('sender').valueChanges
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
        this.senderList = datas;
        const index = this.senderList.findIndex(fromdept => fromdept.code === "DGRP11"); 
        // console.log("index1",index);
        if (index !== -1)
          {
            this.senderList.splice(index, 1);
          }
         
        this.categoryInput.nativeElement.value = '';
        this.subcategoryInput.nativeElement.value = '';
      })
    this.memoAddForm.get('priority').valueChanges
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
    this.memoAddForm.get('category').valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.memoService.getCategory_Dept(value, this.memoAddForm.value.sender.id)
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

    this.memoAddForm.get('sub_category').valueChanges
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
          let datapagination = results["pagination"];
          this.allEmployeeList = datas;
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
          let datapagination = results["pagination"];
          this.allEmployeeList = datas;
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
          // console.log("index2",index);
          if (index !== -1)
          {
            todeptlist.splice(index, 1); 
          }
          
          // console.log("this.departmentList",this.departmentList);
          if (this.departmentList.length >= 0) {
            this.has_next = datapagination.has_next;
            this.has_previous = datapagination.has_previous;
            this.currentpage = datapagination.index;
          }
        })
    }
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

  filter(data) {
    // console.log(data.value);
  }


  getForwardMessage() {
    this.sharedService.forwardMessage.value;
  }

  public displayTo(empto?: iEmployeeList): string | undefined {
    return empto ? empto.full_name : undefined;
  }

  get empto() {
    return this.memoAddForm.get('to_emp');
  }

  OnCategoryChange(e) {
    this.categoryID = e.source.value.id;
  }

  OnSenderChange(e) {
    this.categoryInput.nativeElement.value = '';
    this.subcategoryInput.nativeElement.value = '';
  }

  focusCategory(e) {
    if (this.memoAddForm.value.sender.id === undefined) {
      this.toastr.error('Memo Add', 'Invalid From/Sender value', { timeOut: 1500 });
      return false;
    }

    if (this.categoryInput.nativeElement.value === '') {
      this.memoService.getCategory_Dept('', this.memoAddForm.value.sender.id)
        .subscribe((results: any[]) => {
          let datas = results["data"];
          this.categoryList = datas;
          // this.subcategoryInput.nativeElement.value = '';
        });
    }
    // }
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
    return this.memoAddForm.get('category');
  }

  public displaysubCategory(subcategory?: subCategory): string | undefined {
    return subcategory ? subcategory.name : undefined;
  }
  get subcategory() {
    return this.memoAddForm.get('sub_category');
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
      // We found the employeecc name in the allEmployeeList list
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
  public removeEmployeeApprover1(employee: iEmployeeList): void {
    const index = this.chipSelectedEmployeeRecommender.indexOf(employee);
    if (index >= 0) {
      this.chipSelectedEmployeeRecommender.splice(index, 1);
      this.chipSelectedEmployeeRecommenderid.splice(index, 1);
      this.employeeApproverInput1.nativeElement.value = '';
    }
  }

  public employeeApproverSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeApproverByName(event.option.value.full_name);
    this.employeeApproverInput.nativeElement.value = '';
  }
  public employeeApproverSelected1(event: MatAutocompleteSelectedEvent): void {
    this.selectEmployeeApproverByName1(event.option.value.full_name);
    this.employeeApproverInput1.nativeElement.value = '';
  }
  private selectEmployeeApproverByName(employee) {
    let foundEmployeeApprover1 = this.chipSelectedEmployeeApprover.filter(employeecc => employeecc.full_name == employee);
    if (foundEmployeeApprover1.length) {
      return;
    }
    let foundEmployeeApprover = this.allEmployeeList.filter(employeecc => employeecc.full_name == employee);
    if (foundEmployeeApprover.length) {
      this.chipSelectedEmployeeApprover.push(foundEmployeeApprover[0]);
      this.chipSelectedEmployeeApproverid.push(foundEmployeeApprover[0].id)
    }
  }
  private selectEmployeeApproverByName1(employee) {
    let foundEmployeeApprover1 = this.chipSelectedEmployeeRecommender.filter(employeecc => employeecc.full_name == employee);
    if (foundEmployeeApprover1.length) {
      return;
    }
    let foundEmployeeApprover = this.allEmployeeList.filter(employeecc => employeecc.full_name == employee);
    if (foundEmployeeApprover.length) {
      this.chipSelectedEmployeeRecommender.push(foundEmployeeApprover[0]);
      this.chipSelectedEmployeeRecommenderid.push(foundEmployeeApprover[0].id)
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
    this.selectEmployeeDeptByName(event.option.value.name);
    this.employeeDeptInput.nativeElement.value = '';
  }
  private selectEmployeeDeptByName(dept) {
    let foundEmployeeDept1 = this.chipSelectedEmployeeDept.filter(employeedept => employeedept.name == dept);
    if (foundEmployeeDept1.length) {
      return;
    }
    let foundEmployeeDept = this.departmentList.filter(employeedept => employeedept.name == dept);
    if (foundEmployeeDept.length) {
      this.chipSelectedEmployeeDept.push(foundEmployeeDept[0]);
      this.chipSelectedEmployeeDeptid.push(foundEmployeeDept[0].id)
    }
  }

 



  createMemoInput() {
    let orderno: number = 0;
    let ordernos: number = 0;
    let finalappArray = [];
    this.chipSelectedEmployeeApproverid.forEach((eachitem) => {
      let apporder = {
        "id": eachitem,
        "order": orderno + 1
      }
      orderno = orderno + 1;
      finalappArray.push(apporder)
    });
    let finalrecArray = [];
    this.chipSelectedEmployeeRecommenderid.forEach((eachitem) => {
      let recommorder = {
        "id": eachitem,
        "order": ordernos + 1
      }
      ordernos = ordernos + 1;
      finalrecArray.push(recommorder)
    });

    let memoclass = new Memo();
    memoclass.to_dept = this.chipSelectedEmployeeDeptid
    memoclass.approver = finalappArray
    memoclass.cc = this.chipSelectedEmployeeCCid
    memoclass.to_emp = this.chipSelectedEmployeeToid;
    memoclass.bto_emp = this.chipSelectedEmployeeBToid;
    memoclass.subject = this.memoAddForm.value.subject;
    memoclass.manual_reference = this.memoAddForm.value.manual_reference;
    memoclass.watermark_txt = this.memoAddForm.value.watermarktext;
    memoclass.type = this.rdoIOMnfa;
    memoclass.sender = this.memoAddForm.value.sender.id + '_dept';
    memoclass.priority = this.memoAddForm.value.priority.id;
    memoclass.confidential = this.Confidential;
    if (this.memoAddForm.value.category.id === undefined) {
      memoclass.category = null;
    } else {
      memoclass.category = this.memoAddForm.value.category.id;
    }
    if (this.memoAddForm.value.sub_category.id === undefined) {
      memoclass.sub_category = null;
    } else {
      memoclass.sub_category = this.memoAddForm.value.sub_category.id;
    }
    memoclass.content = this.memoAddForm.value.html.replace('border="0"', 'border="1"');
    memoclass.recommender = finalrecArray;
    memoclass.parallel_delivery = this.Parallel_Delivery
    // memoclass.images = this.images;
    return memoclass;
  }

  Submit() {
   
    this.SubmitCalled = true

    if (this.memoAddForm.value.sender.id === undefined) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid From/Sender value', { timeOut: 1500 });
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

      for (let i = 0; i < this.chipSelectedEmployeeRecommenderid.length; i++) {
        if (this.chipSelectedEmployeeRecommenderid[i] === this.sharedService.loginEmpId) {
          this.SpinnerService.hide();
          this.toastr.error('Memo Add', 'Recommender name can not be yours', { timeOut: 1500 });
         this.SubmitCalled = false;
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

    if (this.memoAddForm.value.priority.id === undefined) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid Priority', { timeOut: 1500 });
      this.SubmitCalled = false;
      return false;
    }
    if (this.memoAddForm.value.subject === "") {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid subject', { timeOut: 1500 });
      this.SubmitCalled = false;
      return false;
    }
    if (this.memoAddForm.value.watermarktext === "") {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid Watermark text', { timeOut: 1500 });
      this.SubmitCalled = false;
      return false;
    }
    if (this.memoAddForm.value.html === "") {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid content', { timeOut: 1500 });
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
    if (this.draftSaveId === undefined) {
      this.dataService.createNewMemo(this.createMemoInput(), this.images).subscribe((res) => {
        let id = res.id;
        this.sharedService.fetchData.next(id);
        this.draftSaveId = res.id;
        this.SpinnerService.hide();
        this.notification.showSuccess('New Memo created!...');
        this.router.navigate(['/ememo/memoView'], { queryParams: { mid: id, from: 'memocreate', MemoView: "YES" }, skipLocationChange: true });
      },
      error => {
        this.SpinnerService.hide();
      }
      );
      return true;
    }

    if (this.draftSaveId !== '') {
      this.dataService.reDraftSave(this.redraftCreate(), this.draftSaveId, this.images, this.documentList).subscribe((res) => {
        this.SpinnerService.hide();
        this.notification.showSuccess('Draft Updated and ready to create Memo!...');
        this.dataService.sendMemo(this.draftSaveId).subscribe((res) => {
          this.sharedService.fetchData.next(this.draftSaveId);
          this.router.navigate(['/ememo/memoView'], { queryParams: { mid: this.draftSaveId, from: 'memocreate', MemoView: "YES" }, skipLocationChange: true });
        },
        error => {
          this.SpinnerService.hide();
        }
        );
        return true;
      },
      error => {
        this.SpinnerService.hide();
      }
      );
    }
  }  //End of createMemoForm

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
    this.InputVar.nativeElement.value = '';
    imagesList.push(this.images);
    this.uploadList = [];
    imagesList.forEach((item) => {
      let s = item;
      s.forEach((it) => {
        let io = it.name;
        this.uploadList.push(io);
      });
    });
  }

  deleteUpload(s, index) {
    this.uploadList.forEach((s, i) => {
      if (index === i) {
        this.uploadList.splice(index, 1)
        this.images.splice(index, 1);
      }
    })
  }

  department(id) {
    this.dataService.getCategory(id)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.categoryList = datas;

      })
  }

  // categorychange(id) {
  //   this.dataService.getSubCategory(id)
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.sub_categoryList = datas;
  //     }, error => {
  //       return Observable.throw(error);
  //     })
  // }
  saveDraft() {
    this.SpinnerService.show();
    
    if (this.SubmitCalled === true) {
      this.SpinnerService.hide();
      return false;
    }
    this.isButtonVisible = false;
    if (this.memoAddForm.value.sender.id === undefined) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid From/Sender value', { timeOut: 1500 });
      this.isButtonVisible = true;
      return false;
    }

    if (this.chipSelectedEmployeeApproverid.length === 0) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Approver/Signee should be mandatory', { timeOut: 1500 });
      this.isButtonVisible = true;
      return false;
    }

    if (this.sharedService.Memofrom === 'NFA-MEMO') {
      for (let i = 0; i < this.chipSelectedEmployeeApproverid.length; i++) {
        if (this.chipSelectedEmployeeApproverid[i] === this.sharedService.loginEmpId) {
          this.SpinnerService.hide();
          this.toastr.error('Memo Add', 'Approver name can not be yours', { timeOut: 1500 });
          this.isButtonVisible = true;
          return false;
        }
      }
      for (let i = 0; i < this.chipSelectedEmployeeRecommenderid.length; i++) {
        if (this.chipSelectedEmployeeRecommenderid[i] === this.sharedService.loginEmpId) {
          this.SpinnerService.hide();
          this.toastr.error('Memo Add', 'Recommender name can not be yours', { timeOut: 1500 });
          this.SubmitCalled = false;
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
    
    if (this.memoAddForm.value.priority.id === undefined) {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid Priority', { timeOut: 1500 });
      this.isButtonVisible = true;
      return false;
    }

    if (this.memoAddForm.value.subject === '') {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid subject', { timeOut: 1500 });
      this.isButtonVisible = true;
      return false;
    }
    if (this.memoAddForm.value.watermarktext === '') {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid Watermark text', { timeOut: 1500 });
     this.isButtonVisible = true;
      return false;
    }
    if (this.memoAddForm.value.html === "") {
      this.SpinnerService.hide();
      this.toastr.error('Memo Add', 'Invalid content', { timeOut: 1500 });
      this.isButtonVisible = true;
      return false;
    }
    // var answer = window.confirm("Save Draft data?");
    // if (answer) {
    //     //some code
    // }
    // else {
    //   return false;
    // }
    if (this.draftSaveId === undefined) {
      this.dataService.saveAsDraft(this.redraftCreate(), '', this.images).subscribe((res) => {
        if (res.code === 'UNEXPECTED_ERROR' && res.description === 'Duplicate Name') {
          this.SpinnerService.hide();
          this.notification.showWarning('Duplicate! Code Or Name ...');
         } else if (res.code === 'UNEXPECTED_ERROR' && res.description === 'Unexpected Internal Server Error') {
          this.SpinnerService.hide();
          this.notification.showError('INVALID_DATA!...');
         
        } else if (res.code === 'INVALID_DATA' && res.description === 'Invalid Data or DB Constraint') {
          this.SpinnerService.hide();
          this.notification.showError('INVALID_DATA Or DB !...');
         
        } else {
          this.SpinnerService.hide();
          this.notification.showSuccess('Draft Saved!...');
          
        }
        this.draftSaveId = res.id;
        this.dataService.getFetch(this.draftSaveId)
          .subscribe(result => {
            this.documentList = result.document_arr;
            this.uploadList = [];
            this.images = [];
          },
          error => {
            this.SpinnerService.hide();
          });
        this.isButtonVisible = true;
        return true;
      },
      error => {
        this.SpinnerService.hide();
      }
      );
    } else {
      // this.uploadList = [];
      this.dataService.reDraftSave(this.redraftCreate(), this.draftSaveId, this.images, this.documentList).subscribe((res) => {
        this.SpinnerService.hide();
        this.notification.showSuccess('Draft Updated!...');
        this.dataService.getFetch(this.draftSaveId)
          .subscribe(result => {
            this.documentList = result.document_arr;
            this.uploadList = [];
            this.images = [];
          },
          error => {
            this.SpinnerService.hide();
          });
        this.isButtonVisible = true;
        return true;
      },
      error => {
        this.SpinnerService.hide();
      }
      );
    }
  }

  redraftCreate() {
    let orderno: number = 0;
    let ordernos: number = 0;
    let finalappArray = [];
    this.chipSelectedEmployeeApproverid.forEach((eachitem) => {
      let apporder = {
        "id": eachitem,
        "order": orderno + 1
      }
      orderno = orderno + 1;
      finalappArray.push(apporder)
    });
    let finalrecArray = [];
    this.chipSelectedEmployeeRecommenderid.forEach((eachitem) => {
      let recommorder = {
        "id": eachitem,
        "order": ordernos + 1
      }
      ordernos = ordernos + 1;
      finalrecArray.push(recommorder)
    });

    let data = this.memoAddForm.controls;
    let memoclass1 = new Memo();
    memoclass1.to_dept = this.chipSelectedEmployeeDeptid;
    memoclass1.approver = finalappArray
    memoclass1.cc = this.chipSelectedEmployeeCCid
    memoclass1.to_emp = this.chipSelectedEmployeeToid;
    memoclass1.bto_emp = this.chipSelectedEmployeeBToid;
    memoclass1.subject = this.memoAddForm.value.subject;
    memoclass1.manual_reference = this.memoAddForm.value.manual_reference;
    memoclass1.watermark_txt = this.memoAddForm.value.watermarktext;
    memoclass1.type = this.rdoIOMnfa
    memoclass1.sender = this.memoAddForm.value.sender.id + '_dept';
    memoclass1.priority = this.memoAddForm.value.priority.id;
    memoclass1.confidential = this.Confidential;
    if (this.memoAddForm.value.category.id === undefined) {
      memoclass1.category = null;
    } else {
      memoclass1.category = this.memoAddForm.value.category.id;
    }
    if (this.memoAddForm.value.sub_category.id === undefined) {
      memoclass1.sub_category = null;
    } else {
      memoclass1.sub_category = this.memoAddForm.value.sub_category.id;
    }
    memoclass1.content = this.memoAddForm.value.html.replace('border="0"', 'border="1"');
    memoclass1.recommender = finalrecArray;
    memoclass1.parallel_delivery = this.Parallel_Delivery;
    return memoclass1;
  }

  draftCreate() {
    let orderno: number = 0;
    let ordernos: number = 0;
    let finalappArray = [];
    this.chipSelectedEmployeeApproverid.forEach((eachitem) => {
      let apporder = {
        id: eachitem,
        order: orderno + 1
      };
      orderno = orderno + 1;
      finalappArray.push(apporder);
    });
    let finalrecArray = [];
    this.chipSelectedEmployeeRecommenderid.forEach((eachitem) => {
      let recommorder = {
        "id": eachitem,
        "order": ordernos + 1
      }
      ordernos = ordernos + 1;
      finalrecArray.push(recommorder)
    });
    let memoclass = new Memo();
    memoclass.to_dept = this.chipSelectedEmployeeDeptid;
    memoclass.approver = finalappArray;
    memoclass.cc = this.chipSelectedEmployeeCCid;
    memoclass.to_emp = this.chipSelectedEmployeeToid;
    memoclass.bto_emp = this.chipSelectedEmployeeBToid;
    memoclass.subject = this.memoAddForm.value.subject;
    memoclass.manual_reference = this.memoAddForm.value.manual_reference;
    memoclass.watermark_txt = this.memoAddForm.value.watermarktext;
    memoclass.type = this.rdoIOMnfa;
    memoclass.sender = this.memoAddForm.value.sender.id + '_dept';
    memoclass.priority = this.memoAddForm.value.priority.id;
    memoclass.confidential = this.Confidential;
    if (this.memoAddForm.value.category.id === undefined) {
      memoclass.category = null;
    } else {
      memoclass.category = this.memoAddForm.value.category.id;
    }
    if (this.memoAddForm.value.sub_category.id === undefined) {
      memoclass.sub_category = null;
    } else {
      memoclass.sub_category = this.memoAddForm.value.sub_category.id;
    }
    memoclass.content = this.memoAddForm.value.html.replace('border="0"', 'border="1"');
    memoclass.recommender = finalrecArray;
    memoclass.parallel_delivery = this.Parallel_Delivery
    // memoclass.images = this.images;
    return memoclass;
  }

  private getSenderList() {
    this.memoService.get_empTodeptMapping1('memo')
      .subscribe((results: any[]) => {
        let datas = results["data"];
        this.senderList = datas;
        const index = this.senderList.findIndex(fromdept => fromdept.code === "DGRP11"); 
        // console.log("index3",index);
        if (index !== -1)
        {
          this.senderList.splice(index, 1);
        }
        // console.log("this.senderList",this.senderList);
      })
  }
  getSender() {
    this.getSenderList();
  }

  public displayFnSender(senderValue?: SenderValue): string | undefined {
    return senderValue ? senderValue.name : undefined;
  }

  get senderValue() {
    return this.memoAddForm.value.get('sender');
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
  }

  public displayFnPriority(priority?: PriorityValue): string | undefined {
    return priority ? priority.name : undefined;
  }

  get priority() {
    return this.memoAddForm.value.get('priority');
  }









}

class Memo {
  subject: string;
  watermark_txt: string;
  manual_reference: string;
  type: any;
  sender: any;
  priority: any;
  confidential: any;
  category: number;
  sub_category: number;
  content: any;
  to_emp: any;
  bto_emp: any;
  to_dept: any;
  approver: any;
  recommender: any;
  cc: any;
  parallel_delivery: any;
  // images: any;
}

