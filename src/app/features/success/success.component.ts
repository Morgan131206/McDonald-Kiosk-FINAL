import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  val: number = 6;

  constructor(private router: Router) { }

  ngOnInit() {
    setInterval(() => {
      this.val -= 1;
    }, 1000);

    setTimeout(() => {
      this.router.navigate([""]);
    }, this.val * 1000);
  }
}
