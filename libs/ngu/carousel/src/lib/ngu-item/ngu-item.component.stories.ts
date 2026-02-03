import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { NguItemComponent } from './ngu-item.component';

const meta: Meta<NguItemComponent> = {
  title: 'Carousel/NguItem',
  component: NguItemComponent,
  decorators: [
    moduleMetadata({
      imports: [NguItemComponent]
    })
  ]
};

export default meta;
type Story = StoryObj<NguItemComponent>;

export const Primary: Story = {
  render: (args: NguItemComponent) => ({
    props: args
  }),
  args: {}
};
