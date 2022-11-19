import { createAnimation } from "@ionic/react";

export const animationBuilder = (baseEl:any, opts:any) => {
    const enteringAnimation = createAnimation()
      .addElement(opts.enteringEl)
      .fromTo('opacity', 1, 0)
      .duration(10000);
    
    const leavingAnimation = createAnimation()
      .addElement(opts.leavingEl)
      .fromTo('opacity', 1, 0)
      .duration(5000);
    
    const animation = createAnimation()
      .addAnimation(enteringAnimation)
      .addAnimation(leavingAnimation);
    
    return animation;
  };