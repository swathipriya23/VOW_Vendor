import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { TaService } from "../ta.service";
import 'jqueryui';
import * as $ from 'jquery';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChild('scroll', { static: true }) scroll: any;
  //Added for Drag/Resize Option
  @ViewChild('modalcon') modalContentChat : ElementRef;
  @ViewChild('modalhead') modalHeaderChat : ElementRef;
  @ViewChild('modalbody') modalBody: ElementRef;
  @ViewChild('modaldialog') modalDialogs: ElementRef;
  //Added for Drag/Resize Option
  chatsummary:any;
  chatbool=false;
  chatform:FormGroup;
  data_final: { request: any; ref_type: number; approver_id: string; comment: any; type: number; };
  chatboxcurrentpage=1;
  chatunreadmsg=true;
  chatboxpagination=true;
  commentDataList: any;
  tourno: any;
  chatloader=true;  
  isMaximize: boolean = false;

  config: any = {
    airMode: false,
    tabDisable: true,
    toolbar: false,
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
    height: '150',
    width: '625',
    inheritPlaceholder: true,
    overflow: 'hidden',
    dialogsInBody: true,
    
    // border:false,
    // uploadImagePath: '/api/upload',
    // toolbar: [
    //   ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
    //   [
    //     'font',
    //     [
    //       'bold',
    //       'italic',
    //       'underline',
    //       'strikethrough',
    //       'superscript',
    //       'subscript',
    //       'clear',
    //     ],
    //   ],
    //   ['fontsize', ['fontname', 'fontsize', 'color']],
    //   ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
    //   ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    // ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
  };

  has_next=true;
  has_previous=true;
  has_present=1;
  currenttableindex: any;

  constructor(private taservice:TaService,private router: Router,private formBuilder:FormBuilder,private notification: NotificationService,) { }

  ngOnInit(): void {
    this.chatform=this.formBuilder.group({
      chat:null
     })
    this.getchatsummary(this.has_present)
    
  }
  ngAfterViewInit(): void {
    let modalContent = $(this.modalContentChat.nativeElement);
    let modalHeader = $(this.modalHeaderChat.nativeElement);
    let modalBodys = $(this.modalBody.nativeElement);
    let modalDialogg = $(this.modalDialogs.nativeElement);
    modalHeader.addClass('cursor-all-scroll');
    //modalContent.draggable({
     // cursor: "all-scroll",
      //handle: modalBodys
    //});      
    modalDialogg.draggable({
      cursor: "all-scroll",
      handle: modalHeader
    })
   
    modalContent.resizable({  
      minHeight: 370,
      minWidth: 750,   
      handles: 'n, e, s, w, se, ne, sw, nw'
 });

   }
   minimize()
   {
     document.getElementById('modal-dialog1').style.width = "40px";
     document.getElementById('modal-body1').style.height = "130px";
     document.getElementById('modal-body1').style.width = "";
     document.getElementById('modal-body1').style.display = "flex";
   
     
 
   }
   maximize() {
     this.isMaximize = !this.isMaximize;
     document.getElementById('modal-dialog1').style.width = "fit-content";
     document.getElementById('modal-body1').style.height = "70vh";
     document.getElementById('modal-body1').style.width = "1200px";
     document.getElementById('modal-body1').style.padding = "0";
     document.getElementById('modal-body1').style.display = "flex";
     //document.getElementById('chatbox1').style.width = "1300px";
     document.getElementById('modal-dialog1').style.top = "0px";
  
     }
     
     restore() {
     this.isMaximize = !this.isMaximize;
     document.getElementById('modal-dialog1').style.width = "50vw";
     document.getElementById('modal-body1').style.height = "50vh";
     document.getElementById('modal-body1').style.width = "";
     document.getElementById('modal-body1').style.display = "flex";
     }
   

  getchatsummary(page){
    this.taservice.getchatsummary(page).subscribe(
      results=>{
        console.log(results)
        this.chatsummary=results['data']
        this.chatbool=true
        let datapagination = results["pagination"];
      
        console.log('empdataaa',this.chatsummary)
        if (this.chatsummary.length > 0) {
          this.has_next = datapagination.has_next;
          this.has_previous = datapagination.has_previous;
          this.has_present = datapagination.index;
      }
      }
    )
  }

  nextClick(){
    // this.chatbool=false
    if (this.has_next === true) {
      this.getchatsummary(this.has_present + 1)
    }
  }

  previousClick() {
    // this.chatbool=false
    if (this.has_previous === true) {

      this.getchatsummary(this.has_present - 1)
    }
  }



  createCommentform(){

    if(this.chatform.value.chat == '' || this.chatform.value.chat == null ){
      return false
    }
    var chatdata = this.chatform.value.chat
    chatdata = chatdata.replace('border="0"', 'border="2"')
    chatdata = chatdata.replace('cellspacing="0"', 'cellspacing="2"')
    chatdata = chatdata.replace('cellpadding="0"', 'cellpadding="5"')
    this.chatform.get('chat').setValue(chatdata);

    
      this.data_final = {
        "request":this.tourno,
        "ref_type":1,
        "approver_id": "1",
        "comment":this.chatform.value.chat,
        "type":1
      }
      {
        
    }
      this.chat_service(this.data_final)
      this.chatform.patchValue({ chat: null })
  }

  chat_service(data) {
    // this.SpinnerService.show()
    this.taservice.tourchat(data)
      .subscribe(res => {
        if (res.status === "success") {
          // this.SpinnerService.hide()
          this.chatboxcurrentpage=1
          
          // this.notification.showSuccess("Message Send Successfully....")
          this.getchatlist(this.tourno,this.chatboxcurrentpage);
          this.chatform.value.chat=''
          // this.chatseen()
          return true;
        } else {
          // this.SpinnerService.hide()
          // this.notification.showError(res.description)
          return false;
        }
      })

  }

  getchatlist(tourno,i) {
    this.taservice.getchatlist(tourno,i)
      .subscribe(result => {
        let data =result['data'].reverse()
        this.chatunreadmsg=result['data'][0]['unread_message']
        console.log('unreadddd',this.chatunreadmsg)
        let chatpagination=result['pagination']['has_next']



        this.chatboxpagination=chatpagination
        this.chatloader=false
        this.chatseen(tourno)
        this.chatsummary[this.currenttableindex].Chats.unread_message=0
        // if(this.chatunreadmsg == 1){
      
        //   this.notification.showInfo(this.chatunreadmsg + ' Unread message')
         
        // }else if(this.chatunreadmsg != 0 && this.chatunreadmsg != 1){
        //   this.notification.showInfo(this.chatunreadmsg + ' Unread messages')
        // }
      
        this.commentDataList = result['data']
        this.changecolor()
        setTimeout(() => {
          this.scrollchange()
       }, 1);
        // this.scrollToBottom()
      })
  }
  nextgetchatlist(i){
    let numb=i+1
    this.chatboxcurrentpage=i+1
    this.taservice.getchatlist(this.tourno,numb)
      .subscribe(result => {
        let data =result['data']
        let chatpagination=result['pagination']['has_next']

        this.chatboxpagination=chatpagination
        for(let i=0;i<data.length;i++){
          this.commentDataList.unshift(data[i])
        }
        // this.commentDataList.unshift(data)
        console.log('this.commentdatalist',this.commentDataList)
      })
  }
  tourEdit(tour,i){
    this.chatloader=true
    this.commentDataList=[]
    this.chatboxcurrentpage=1
    this.tourno=tour
    this.currenttableindex=i
    this.getchatlist(this.tourno,this.chatboxcurrentpage)
  
  }
  scrollchange(){
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
    console.log('scrollllllllllllll',this.scroll.nativeElement.scrollTop,this.scroll.nativeElement.scrollHeight)
  }

  chatseen(data) {
    // seenunreadmsg
    this.taservice.seenunreadmsg(data)
      .subscribe(result => {
        console.log('result', result)
        // this.chatunreadmsg = 0
      })

  }

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    const styles = {
      // 'background-color' : color,
      // 'padding':"27px",
      // "border-radius":"100%",
      "color":color
    };
    return styles;
  }

  chatcloseall(){
    this.commentDataList=[]
    this.chatloader=true
    this.chatboxpagination=false
  }


  changecolor(){

    let a=this.commentDataList


    for (let i = 0; i < a.length; i++) {
      for (let k = i + 1; k < a.length; k++) {
        if(a[i].color){
          return false
        }else{
          if (a[i].code != a[k].code) {
              // this.commentDataList[i].colorcode=this.getRandomColor()
              Object.assign(this.commentDataList[i],this.getRandomColor())
              this.commentDataList.forEach((c) => {
                if (c.code==a[i].code) {
                  Object.assign(c,{'color':a[i].color})
                }
               
              });
          }
          // else{
          //   Object.assign(this.commentDataList[i],this.getRandomColor())
          // }
      
      }
    }
  }
   console.log('color',this.commentDataList)
  }

  gettourdelete(chatid,tourid,i){
    console.log('chatid',chatid,'tourid',tourid)

      this.taservice.getdeletechatmessage(chatid, tourid)
      .subscribe(res => {
        if (res.status === "success") {
          this.notification.showSuccess("Success....")
          this.commentDataList[i].comment='THIS MESSAGE WAS DELETED'
          this.commentDataList[i].status=0
          
          return true;
        } else {
          this.notification.showError(res.description)
          return false;
        }
      }
      )
  }


  getundomessage(chatid,tourid,i){

    this.taservice.getundochatmessage(chatid, tourid)
    .subscribe(res => {

      if(res.data.length != 0){
        this.commentDataList.splice(i,1)
        this.commentDataList.splice(i, 0, res.data[0])
  
        console.log(res)
      }

    
    }
    )

  }

}
