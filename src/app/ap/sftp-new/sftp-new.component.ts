import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormArray, FormControl} from '@angular/forms';
import { ApService } from '../ap.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../service/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sftp-new',
  templateUrl: './sftp-new.component.html',
  styleUrls: ['./sftp-new.component.scss']
})
export class SFTPNewComponent implements OnInit {
  loadFlag = true
  filePath = ""
  files : any
  fileList : any
  constructor(private toastr: ToastrService,private notification: NotificationService,private service: ApService, private fb: FormBuilder,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {

    this.getFiles("");
  }

  getFiles(name)
  {
    let input
    if(name=="")
    {
      input ={
        "is_first_list": "Y",
        "is_cd_with_list": "N",
        "cd_path": ""
      }
      this.filePath = ""
    }
    else
    {
      if(this.filePath =="")
      {
        this.filePath =name
      }
      else
      {
        this.filePath = this.filePath + "/" + name     
      }
      input ={
        "is_first_list": "N",
        "is_cd_with_list": "Y",
        "cd_path": this.filePath
      }      
    }
      this.spinner.show();
      this.service.sftpGet(input)
        .subscribe((result:any)=> {
            this.spinner.hide();
            if(result)
            {
              this.files = result?.data
              this.fileList =[]

              for(let item of this.files)
              {
                if(item.indexOf(".") > 0)
                {
                  this.fileList.push({"name" : item ,"type" : "file"})
                }
                else
                {
                  this.fileList.push({"name" : item ,"type" : "folder"})
                }
              }
              this.checkFileType()
            }
          })    
    }
    
  sftpOpenFile(name) {
      this.spinner.show()
      let input ={
                  "module":"AP",
                  "file_path": this.filePath + "/" + name 
                  }
    
      this.service.sftpFileDownload(input)
        .subscribe((results) => {
          console.log(results)
          let dataType = results.type;
          let binaryData = [];
          binaryData.push(results)         
          let downloadLink = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
          window.open(downloadLink, "_blank");
          this.spinner.hide()
        },
          error => {
            this.spinner.hide();
          }
        )
    }

sftpDownloadFile(name) {
    this.spinner.show()
    let input ={
                "module":"AP",
                "file_path": this.filePath + "/" + name 
                }
  
    this.service.sftpFileDownload(input)
      .subscribe((results) => {
        console.log(results)
        let binaryData = [];
        binaryData.push(results)
        let downloadUrl = window.URL.createObjectURL(new Blob(binaryData));
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = name;
        link.click();
        this.spinner.hide()
      },
        error => {
          this.spinner.hide();
        }
      )
  }

  goBack()
  {
    let filepath = this.filePath
    let indexOfSlash1 = filepath.lastIndexOf("/") 
    let filepath1 = filepath.substring(0, indexOfSlash1)
    let indexOfSlash2 = filepath1.lastIndexOf("/")
    let newPath =filepath1.substring(0, indexOfSlash2)     
    let folder = this.filePath.substring(indexOfSlash2+1,indexOfSlash1)
    this.filePath = newPath
    this.getFiles(folder)
  }

  viewDisable=[]
  checkFileType()
  {
    this.viewDisable=[]
    for(let item of this.fileList)
    {
      if(item.type=="file")
      {
        let filename =item.name
        let ext = filename.split('.')
        if(ext[1]=="png" || ext[1]=="gif"|| ext[1]=="jpeg" || ext[1]=="jpg" || ext[1]=="tiff" || ext[1]=="tif" || ext[1]=="pdf" || ext[1]=="txt")
        {
          this.viewDisable.push(false)
        }
        else
        {
          this.viewDisable.push(true)
        }
      }
      else
      {
        this.viewDisable.push(true)
      }
    }

  }

}
