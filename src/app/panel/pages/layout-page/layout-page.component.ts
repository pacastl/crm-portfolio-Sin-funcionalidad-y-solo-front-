import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  // styleUrls: ['./layout-page.component.scss']
})
export class LayoutPageComponent implements OnInit {
  username: string='';
  role: string='';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username') !== null ? params.get('username')! : '';
      this.role = params.get('role') !== null ? params.get('role')! : '';
    });
  }
}
