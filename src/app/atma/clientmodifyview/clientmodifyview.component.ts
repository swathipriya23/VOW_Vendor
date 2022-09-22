import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Observable,
  from,
  fromEvent
} from 'rxjs';
import {
  AtmaService
} from '../atma.service'
import {
  NotificationService
} from '../notification.service'
import {
  ShareService
} from '../share.service'
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  filter,
  switchMap,
  finalize,
  takeUntil,
  map
} from 'rxjs/operators';
import {
  MatAutocomplete,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import {
  ToastrService
} from 'ngx-toastr';
@Component({
  selector: 'app-clientmodifyview',
  templateUrl: './clientmodifyview.component.html',
  styleUrls: ['./clientmodifyview.component.scss']
})
export class ClientmodifyviewComponent implements OnInit {
  @Output() onCancel = new EventEmitter<any>();
  constructor(private atmaService: AtmaService, private notification: NotificationService, private toastr: ToastrService,
    private shareService: ShareService,
    private fb: FormBuilder) {}
  modificationdata: any;
  data = {}
  clientEditForm: FormGroup;
  ngOnInit(): void {
    
    this.modificationdata = this.shareService.modification_data.value;

    this.clientEditForm = this.fb.group({
      name: [this.modificationdata.new_data.name,],
      line1: [this.modificationdata.new_data.address_id.line1,],
      pincode_id: [this.modificationdata.new_data.address_id.pincode_id.no,],
      city_id: [this.modificationdata.new_data.address_id.city_id.name,],
      district_id: [this.modificationdata.new_data.address_id.district_id.name,],
      state_id: [this.modificationdata.new_data.address_id.state_id.name,],
      line2: [this.modificationdata.new_data.address_id.line2,],
      line3: [this.modificationdata.new_data.address_id.line3,],

    })

    this.clientEditForm.disable()
   


   

  }
  Cancel(){
    this.onCancel.emit()
  }

}