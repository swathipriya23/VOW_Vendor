import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../service/shared.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../service/data.service'
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login-logo',
  templateUrl: './login-logo.component.html',
  styleUrls: ['./login-logo.component.scss']
})
export class LoginLogoComponent implements OnInit {
  nac_FE_Url = environment.nacFEURL;
  apiUrl = environment.apiURL;
  redirect_tO_NAC = environment.redirect_TO_NAC
  logoForm: FormGroup;
  entityID: any;
  entityList: any;
  version: any;

  // entityList:any=[{id:1,value:"Client 1"},{id:2,value:"Client 2"},{id:3,value:"Client 3"},
  // {id:4,value:"Client 4"}]

  constructor(private router: Router, private formBuilder: FormBuilder, private sharedService: SharedService,
    private toastr: ToastrService, private dataService: DataService, public cookieService: CookieService,) {
  }

  ngOnInit(): void {
    console.log("Loginlogo calling1")
    this.logoForm = this.formBuilder.group({
      entity: [''],
    });
    localStorage.removeItem("sessionData");
    this.cookieService.delete('my-key', '/');
    this.sharedService.transactionList = [];
    this.sharedService.masterList = [];
    
    if (localStorage.getItem('refreshed') === null) {
      localStorage['refreshed'] = true;
      if (this.redirect_tO_NAC) {
        window.location.reload();
      }
    } else {
      localStorage.removeItem('refreshed');
    }
    if (this.redirect_tO_NAC) {
      window.location.href = "https://sts.northernarc.com/adfs/oauth2/authorize?response_type=code&client_id=4532e558-6c0b-4fda-ac66-05c316910726&grant_type=authorization_code&response_code=id_token&redirect_uri=" + this.nac_FE_Url + "verify";
    } else {
      this.entity_List();
    }

  }

  entity_List() {
    this.dataService.getEntity_List()
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log("enty-list", datas)
        this.entityList = datas;
      })
  }


  select_entityName(data) {
    let list = data.id
    this.entityID = list
    console.log("entity", this.entityID)
    this.dataService.getAppVersion(this.entityID)
      .subscribe((results: any[]) => {
        let datas = results["data"];
        console.log('san', datas)
        this.version = datas[0].no;
        this.sharedService.appVersion.next(this.version)
      });
  }


  viewDetail() {
    if (this.logoForm.value.entity === "") {
      this.toastr.error('Please Enter Entity');
      // this.SpinnerService.hide();
      return false;
    }
    this.sharedService.entity_name.next(this.entityID)
    this.router.navigate(['/verify'], { skipLocationChange: true })
  }

}
