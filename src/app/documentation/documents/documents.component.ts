import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../service/shared.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DocumentationService } from '../documentation.service'
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  docList: any
  urls: string;
  urlSGdoc;
  isSG:boolean
  isSGTab: boolean
  ismakerCheckerButton: boolean;
  roleValues: string;
  addFormBtn: any;




  constructor(private fb: FormBuilder, private router: Router,
    private shareService: SharedService, private toastr: ToastrService,private dataService: DocumentationService,) {
  }

  ngOnInit(): void {

    let datas = this.shareService.menuUrlData;
    datas.forEach((element) => {
      let subModule = element.submodule;
      if (element.name === "Documentation") {
        this.docList = subModule;
        // this.isSGTab = subModule[0].name;
        console.log("doc menu list", this.docList)
      }
    })
  }

  subModuleData(data) {
    this.urls = data.url;
    this.urlSGdoc = "/sg_usermanual";

    this.isSG = this.urlSGdoc === this.urls ? true : false;
    this.roleValues = data.role[0].name;
    this.addFormBtn = data.name;

    if (this.roleValues === "Maker") {
      this.ismakerCheckerButton = true;
    } else if (this.roleValues === "Checker") {
      this.ismakerCheckerButton = false;
    }

    if (this.isSG) {
      this.isSGTab = true

    }

  }


  downloadSGuserManual(){
    this.dataService.getpdfSG()
      .subscribe((data) => {
        let binaryData = [];
        binaryData.push(data)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'Security Guard User Manual' + ".pdf";
        link.click();
      })
  }











}
