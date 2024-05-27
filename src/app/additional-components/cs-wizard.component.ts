import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { RootService } from 'src/app/services/root.service';

@Component({
  selector: 'cs-wizard',
  templateUrl: './cs-wizard.component.html'
})
export class CsWizard {

  @Input() public options: any = {};
  @Input() public step: any = 0;
  @Output() stepChange = new EventEmitter<any>();
  @Output() public actionCallback: any = new EventEmitter<any>();

  public nextLoader: boolean = false;
  public prevLoader: boolean = false;

  constructor(){}

  cancel(){
    this.actionCallback.emit({action: 'cancel'});
  }

  nextStep() {
    this.nextLoader = true;
    this.actionCallback.emit({
      action: 'validate-before-next', 
      data: {step: this.step}, 
      callback: (data: any)=>{
        if(data.status){
          // this.rootService.closeResponseStatus();
          this.actionCallback.emit({
            action: this.step < this.options.stepList.length-1 ? 'next':'completed', 
            data: {step: this.step+1},
            callback: (resp: any)=>{this.nextLoader = false;}
          });
          if(this.step < this.options.stepList.length-1){
            this.step++;
            this.stepChange.emit(this.step);  
          }
        }else{
          // this.rootService.setErrorResponse(data.message);
          this.nextLoader = false;
        }
      }
    });
  }


  prevStep() {
    this.prevLoader = true;
    this.actionCallback.emit({
      action: 'validate-before-prev', 
      data: {step: this.step}, 
      callback: (data: any)=>{
        if(data.status){
            // this.rootService.closeResponseStatus();
            this.step--;
            this.stepChange.emit(this.step);  
            this.actionCallback.emit({
              action: 'prev', 
              data: {step: this.step},
              callback: (resp: any)=>{this.prevLoader = false;}
            });
        }else{
          // this.rootService.setErrorResponse(data.message);
          this.prevLoader = false;
        }
      }
    });
  }


  jumpStep(step: any){
    if(step == this.step+1){
      this.nextStep();
    }else if(step == this.step-1){
        this.prevStep();
    }else{
      this.nextLoader = true;
      this.prevLoader = true;
      this.actionCallback.emit({
        action: 'validate-before-jump', 
        data: {step: this.step, target : step},
        callback: (data: any)=>{
          if(data.status){
            // this.rootService.closeResponseStatus();
            this.step = step;
            this.stepChange.emit(this.step);
            this.actionCallback.emit({
              action: 'jump',
              data: {step: step},
              callback: (resp: any)=>{this.nextLoader = false;this.prevLoader = false;}
            });
          }else{
            this.nextLoader = false;
            this.prevLoader = false;
            if(data.message.length > 0){
              // this.rootService.setErrorResponse(data.message);
            }
          }
        }
      });
    }
  }
}
