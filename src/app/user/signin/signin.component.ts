import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Toastr } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
