import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  userProfile: any = {};
  userId = 0;

  constructor(private api: ApiService, private auth: AuthService){
  }
  ngOnInit(): void {
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
    this.api.getProfile(this.userId).subscribe((response:any) => {
      if(response) {
        this.userProfile = response.data[0];
        console.log(this.userProfile)
      } else {
        console.log('No user details found');
      }
    })

  }








}
