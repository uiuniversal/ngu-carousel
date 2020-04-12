import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

/** Time and timing curve for expansion panel animations. */
export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

/** Animations used by the Material expansion panel. */
export const slider: AnimationTriggerMetadata = trigger('slider', [
  state('true', style({ transform: 'translate3d({{distance}}px,0,0)' }), {
    params: { distance: '0' }
  }),
  state('false', style({ transform: 'translate3d({{distance}}px,0,0)' }), {
    params: { distance: '0' }
  }),
  transition('* => *', animate('200ms ease-in'))
]);
