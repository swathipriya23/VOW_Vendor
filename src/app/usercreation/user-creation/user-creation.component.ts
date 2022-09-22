import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,FormArray, FormControl } from '@angular/forms'
import { UsercreationService } from '../usercreation.service';
import { SharedService } from 'src/app/service/shared.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorHandlingServiceService } from 'src/app/service/error-handling-service.service';
import { NotificationService } from 'src/app/service/notification.service'; 


@Component({
  selector: 'app-user-creation',
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.scss']
})
export class UserCreationComponent implements OnInit {

  UserCreation:FormGroup;
  passwordLength: Number = 6;
  roleTypeList:any;

  constructor(private fb: FormBuilder,private UsercreationService: UsercreationService,private router: Router,
    public sharedService: SharedService,private errorHandler: ErrorHandlingServiceService,private SpinnerService: NgxSpinnerService,
    private notification: NotificationService,) { }

  ngOnInit(): void {
    this.UserCreation  = this.fb.group({
      name: [''],
      role: [1],
      port_id:[this.sharedService.portal_id],
      email:['', [Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
  });

  // this.GetRole();
  }

  
  // GetRole() {
  //   this.userService.getRole_Type()
  //     .subscribe((results: any[]) => {
  //       let datas = results["data"];
  //       this.roleTypeList = datas;
  //     })
  // }


  // password = ''


  
  

  
    //user creation
    submit_user_Creation() {

    this.UsercreationService.userCreationForm(this.UserCreation.value)
      .subscribe((res) => {
        // console.log("user",res)
        // if(res.code)  {
        //   this.notification.showSuccess("Created Successfully!...");
        //   this.router.navigate(['branchdetails/branchsummary']);
        // }else{
        //     this.notification.showError(res.description)
        //     return false;
          
        // }
        if(res.id === undefined){
          this.notification.showError(res.description)
          this.SpinnerService.hide();
          return false;
        }
        else{
          this.notification.showSuccess("Created Successfully!...")
          this.SpinnerService.hide();
          this.router.navigate(['usercreation/usersummary']);
        }

      },
      error => {
        this.errorHandler.handleError(error);
        this.SpinnerService.hide();
      }
      )
   
    
  }



  // generatePassword(passwordLength) {
  //   var numberChars = "0123456789";
  //   var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  //   var lowerChars = "abcdefghijklmnopqrstuvwxyz";
  //   var allChars = numberChars + upperChars + lowerChars;
  //   var randPasswordArray = Array(passwordLength);
  //   randPasswordArray = allChars.split('');
  //   console.log("k",randPasswordArray)

  //   var newPassword = '';
  //   for (var i = 0; i < this.passwordLength; i++) {
  //     newPassword +=
  //       randPasswordArray[Math.floor(Math.random() * randPasswordArray.length)];
  //   }
  //   console.log('jjj', newPassword);
  //   newPassword = newPassword;
  //   this.UserCreation.patchValue({
  //     password:newPassword
  //   })
  // }


  // onCancelUser(){
  //   this.router.navigate(['user/usersummary']);
  // }

  onCancelUser() {
    this.router.navigate(['/usercreation/usersummary'], { skipLocationChange: true });
  }

}
