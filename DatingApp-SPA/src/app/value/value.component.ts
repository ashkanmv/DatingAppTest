import { Component, OnInit } from '@angular/core';
import { error } from 'util';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {
  values: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // this.getValues();
  }

  // getValues() {
  //   this.http.get('http://localhost:59429/api/values/1').subscribe(response => {
  //     this.values = response;
  //   // tslint:disable-next-line: no-shadowed-variable
  //   }, error => {
  //     console.log(error);
  //   });
  //}
}
