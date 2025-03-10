import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, HeaderComponent, CommonModule, NgxSpinnerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  userProfile: any = {};
  userId = 0;

  constructor(private api: ApiService, private auth: AuthService, private spinner: NgxSpinnerService, private title: Title){
  }
  ngOnInit(): void {
    this.title.setTitle('Profile - PasaBuy');
    this.auth.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.getDetailsProf();
      } else {
        console.log("User not found");
      }
    })

  }


  getDetailsProf(){
    this.spinner.show();
    this.api.getProfile(this.userId).subscribe((response:any) => {
      if(response) {
        this.userProfile = response.data;
        console.log(this.userProfile)
        this.spinner.hide();
      } else {
        console.log('No user details found');
      }
    })

  }








}
