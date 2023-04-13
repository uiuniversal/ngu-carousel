import { Meta } from '@storybook/angular';
import { NguItemComponent } from './ngu-item.component';

export default {
  title: 'NguItemComponent',
  component: NguItemComponent
} as Meta<NguItemComponent>;

export const Primary = {
  render: (args: NguItemComponent) => ({
    props: args
  }),
  args: {}
};
