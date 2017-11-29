import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <div>{{name}}</div>
  `,
})
export class ViewEditComponent  { name = 'ViewEditComponent'; }
