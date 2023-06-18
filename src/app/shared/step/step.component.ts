import { Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css'],
})
export class StepComponent implements OnInit {
  
  @Input() titulo1: string = '';
  @Input() titulo2: string = '';
  @Input() titulo3: string = '';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;
  
  
  constructor() { }

  ngOnInit(): void {
  }
  goToNextStep(stepNumber: number): void {
    switch (stepNumber) {
      case 1:
        this.isStep1Completed = true;
        break;
      case 2:
        this.isStep2Completed = true;
        break;
      case 3:
        this.isStep3Completed = true;
        break;
      default:
        break;
    }
  }
}
