import { Directive, ElementRef, Input, Renderer } from '@angular/core';

/**
 * Generated class for the AnimateItemSlidingDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[animate-item-sliding]' // Attribute selector
})
export class AnimateItemSlidingDirective {

  @Input('animateItemSliding') shouldAnimate: boolean;
 
  constructor(public element: ElementRef, public renderer: Renderer) {
 
  }
 
  ngOnInit(){
 
    if(this.shouldAnimate){
 
      this.renderer.setElementClass(this.element.nativeElement, 'active-slide', true);
      this.renderer.setElementClass(this.element.nativeElement, 'active-options-right', true);
 
      // Wait to apply animation
      setTimeout(() => {
        this.renderer.setElementClass(this.element.nativeElement.firstElementChild, 'itemSlidingAnimation', true);
      }, 2000);
 
    }
 
  }
 

}
