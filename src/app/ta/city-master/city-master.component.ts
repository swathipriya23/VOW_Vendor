import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { PICK_FORMATS } from '../tamaker-create/tamaker-create.component';
import { TaService } from '../ta.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { fromEvent } from 'rxjs';

import { map, takeUntil } from 'rxjs/operators';
import { NotificationService } from '../notification.service';
import { error } from 'console';

@Component({
  selector: 'app-city-master',
  templateUrl: './city-master.component.html',
  styleUrls: ['./city-master.component.scss'],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
})
export class CityMasterComponent implements OnInit {

  @ViewChild('fromplace') clientfromplace: any;
  @ViewChild('cityfrom') cityfrommatAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompletetrigger: MatAutocompleteTrigger

  @ViewChild('stateinput') stateinput: any;
  @ViewChild('state') statematautocomplete: MatAutocomplete;

  @ViewChild('cityeditclose') cityeditclose;
  @ViewChild('cityaddclose') cityaddclose;


  cityform:FormGroup
  cityeditform:FormGroup
  citydropdown: any;
  cityhas_next=true;
  cityhas_previous=true;
  citycurrentpage=1;
  statecurrentpage=1;
  statehas_previous=true;
  statehas_next=true;
  statedropdown: any;
  citytypedropdown: any;
  metrononmetrodropdown=[{name:'Metro',id:0 },{name:'Non Metro',id:1}]
  citysummary: any;
  has_next=true;
  has_previous=true;
  currentpage=1;
  cityname='';
  citynames = new FormControl()
  cityfileupload:any;

  excelformat:any=[
    {
      "id": 1,
      "metro_non": 'Metro',
      "name": "Nicobar",
      "state": "Andaman Nicobar",
      "state_type": "Union Territory"
    },
    {
      "id": 152,
      "metro_non": 'Non Metro',
      "name": "Raipur",
      "state": "Chhattisgarh",
      "state_type": "State"
  },
    {
      "id": 3,
      "metro_non": 'Metro',
      "name": "South Andaman",
      "state": "Andaman Nicobar",
      "state_type": "Union Territory"
    },
    {
      "id": 4,
      "metro_non": 'Metro',
      "name": "Alluri Sitarama Raju",
      "state": "Andhra Pradesh",
      "state_type": "State"
    },
    {
      "id": 5,
      "metro_non": 'Metro',
      "name": "Anakapalli",
      "state": "Andhra Pradesh",
      "state_type": "State"
    },
    
  ]
  fileupload: any;

  constructor(private formBuilder:FormBuilder,private taservice:TaService,private notification: NotificationService,) { }

  ngOnInit(): void {

    this.cityform=this.formBuilder.group({
      state:null,
      name:null,
      state_type:"Union Territory",
      metro_non:0,

    })

    this.cityeditform=this.formBuilder.group({
      state:null,
      name:null,
      state_type:null,
      metro_non:null,
      id:null,
    })

    this.getcitydropdown()
    this.getstatedropdown()
    this.getcitytype()

    this.getcitysummary('',this.currentpage)

  }

  getcitydropdown(){
    this.taservice.getcitysearch('', 1).subscribe(result => {
      console.log('from place to place', result)
      this.citydropdown = result['data']
      let datapagination = result['pagination']
      if (this.citydropdown.length >= 0) {
        this.cityhas_next = datapagination.has_next;
        this.cityhas_previous = datapagination.has_previous;
        this.citycurrentpage = datapagination.index;
      }
    })
  }

  reasonvalue(subject) {
    return subject ? subject.name : undefined;
  }

  autocompletecityfromScroll() {
    setTimeout(() => {
      if (
        this.cityfrommatAutocomplete &&
        this.autocompletetrigger &&
        this.cityfrommatAutocomplete.panel
      ) {
        fromEvent(this.cityfrommatAutocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.cityfrommatAutocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.cityfrommatAutocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.cityfrommatAutocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.cityfrommatAutocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log('autocomplete', this.cityhas_next)
              if (this.cityhas_next === true) {
                this.taservice.getcitysearch(this.clientfromplace.nativeElement.value, this.citycurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.citydropdown = this.citydropdown.concat(datas);
                    if (this.citydropdown.length >= 0) {
                      this.cityhas_next = datapagination.has_next;
                      this.cityhas_previous = datapagination.has_previous;
                      this.citycurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });

  }

  cityfromtosearch(e,val){
    this.taservice.getcitysearch(e.target.value, 1).subscribe(result => {
      console.log('from place to place', result)
      this.citydropdown = result['data']
      let datapagination = result['pagination']
      if (this.citydropdown.length >= 0) {
        this.cityhas_next = datapagination.has_next;
        this.cityhas_previous = datapagination.has_previous;
        this.citycurrentpage = datapagination.index;
      }
    })
  }


  getstatedropdown(){
    this.taservice.getstatesearch('', 1).subscribe(result => {
      console.log('from place to place', result)
      this.statedropdown = result['data']
      let datapagination = result['pagination']
      if (this.statedropdown.length >= 0) {
        this.statehas_next = datapagination.has_next;
        this.statehas_previous = datapagination.has_previous;
        this.statecurrentpage = datapagination.index;
      }
    })
  }


  autocompleteclientScroll() {
    setTimeout(() => {
      if (
        this.statematautocomplete &&
        this.autocompletetrigger &&
        this.statematautocomplete.panel
      ) {
        fromEvent(this.statematautocomplete.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.statematautocomplete.panel.nativeElement.scrollTop),
            takeUntil(this.autocompletetrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.statematautocomplete.panel.nativeElement.scrollTop;
            const scrollHeight = this.statematautocomplete.panel.nativeElement.scrollHeight;
            const elementHeight = this.statematautocomplete.panel.nativeElement.clientHeight;
            const atBottom = scrollHeight - 1 <= scrollTop + elementHeight;
            if (atBottom) {
              console.log('autocomplete', this.statehas_next)
              if (this.statehas_next === true) {
                this.taservice.getstatesearch(this.stateinput.nativeElement.value, this.statecurrentpage + 1)
                  .subscribe((results: any[]) => {
                    let datas = results["data"];
                    let datapagination = results["pagination"];
                    this.statedropdown = this.statedropdown.concat(datas);
                    if (this.statedropdown.length >= 0) {
                      this.statehas_next = datapagination.has_next;
                      this.statehas_previous = datapagination.has_previous;
                      this.statecurrentpage = datapagination.index;
                    }
                  })
              }
            }
          });
      }
    });

  }

  statesearch(e,val){
    this.taservice.getstatesearch(e.target.value, val).subscribe(result => {
      console.log('from place to place', result)
      this.statedropdown = result['data']
      let datapagination = result['pagination']
      if (this.statedropdown.length >= 0) {
        this.statehas_next = datapagination.has_next;
        this.statehas_previous = datapagination.has_previous;
        this.statecurrentpage = datapagination.index;
      }
    })
  }

  // getstatesearch

  getcitytype(){
    
    this.taservice.citytype().subscribe(result => {
      console.log(result)
      this.citytypedropdown=result['data']
    })
  }

  resetform(){
    this.cityform.reset()
    this.cityform.get('state_type').setValue("Union Territory")
    this.cityform.get('metro_non').setValue(0)
  }

  submitform(){
    if(this.cityform.value.state == '' || this.cityform.value.state == null){
      console.log('show error in state')
      this.notification.showError('Please Choose State')
      throw new Error;
    }

    if(this.cityform.value.name == '' || this.cityform.value.name == null){
      console.log('show error in city')
      this.notification.showError('Please Enter City')

      throw new Error;

    }



    this.taservice.cityadd(this.cityform.value).subscribe(res => {
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('City Added Successfully')
        this.cityaddclose.nativeElement.click()
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })

  }

  getcitysummary(value,page){
    this.taservice.getcitysearch(value,page).subscribe(result => {
      console.log('from place to place', result)
      this.citysummary = result['data']
      let datapagination = result['pagination']
      if (this.citysummary.length >= 0) {
        this.has_next = datapagination.has_next;
        this.has_previous = datapagination.has_previous;
        this.currentpage = datapagination.index;
      }
    })
  }

  previousClick(){
    if(this.has_previous == true){
      this.getcitysummary(this.cityname,this.currentpage -1)
    }
  }

  nextClick(){
    if(this.has_next == true){
      this.getcitysummary(this.cityname,this.currentpage +1)
    }
  }
  searchsummary(){
    this.currentpage =1
    this.cityname=this.citynames.value.trim()
    this.getcitysummary(this.cityname,this.currentpage)
  }

  clearsearch(){
    if(this.citynames.value != ''){
    this.citynames.setValue('')
    this.currentpage=1
    this.cityname=''
    this.getcitysummary(this.cityname,this.currentpage)
    }
  }

  editcity(data){
    this.cityeditform.patchValue({
      state:data.state,
      name:data.name,
      state_type:data.state_type,
      metro_non:data.metro_non,
      id:data.id,
    })
  }

  deletecity(val){

    console.log(val)
    // return false

    this.taservice.citydelete(val).subscribe(res => {
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('City deleted Successfully')
        this.searchsummary()
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }

  editsubmitform(){
    if(this.cityeditform.value.state == '' || this.cityeditform.value.state == null){
      console.log('show error in state')
      this.notification.showError('Please Choose State')
      throw new Error;
    }

    if(this.cityeditform.value.name == '' || this.cityeditform.value.name == null){
      console.log('show error in city')
      this.notification.showError('Please Enter City')

      throw new Error;

    }



    this.taservice.cityedit(this.cityeditform.value).subscribe(res => {
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('City updated Successfully')
        this.cityeditclose.nativeElement.click()
        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })

  }

  uploadfile(e){
    console.log('file,',this.cityfileupload)
    console.log('files',e.target.files.item(0))
    this.fileupload=e.target.files.item(0)
  }

  submitfile(){
    // cityfileadd
    if(this.fileupload){

    this.taservice.cityfileadd(this.fileupload).subscribe(res => {
      console.log(res)
      if (res.status === "success") {
        this.notification.showSuccess('City updated Successfully')
        this.cityaddclose.nativeElement.click()

        return true;
      } else {
        this.notification.showError(res.description)
        return false;
      }
    })
  }
  else{
    this.notification.showError('Please select file')
  }
  }

}
