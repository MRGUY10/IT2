import { Component } from '@angular/core';
import { BaseStepComponent } from '../base.step.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'lib-experience',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './experience.component.html',
})
export class ExperienceComponent extends BaseStepComponent {
  constructor() {
    super();
    this.form = new FormGroup({
      parentName: new FormControl('', [Validators.required]),
      parentSurname: new FormControl('', [Validators.required]),
      parentRelationship: new FormControl('', [Validators.required]),
      parentPhoneNumber: new FormControl('', [Validators.required]),
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.initializeFormWithSavedFields(this.form);
    this.registerFormFields(this.form);
    this.listenForFormChanges(this.form);
  }
}
