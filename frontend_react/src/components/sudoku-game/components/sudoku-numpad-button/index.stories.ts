import type { Meta, StoryObj } from '@storybook/react';

import { userEvent, within } from '@storybook/test';
import { SudokuNumpadButton } from './index';

const meta = {
  title: 'Components/SudokuNumpadButton',
  component: SudokuNumpadButton,
  parameters: {
    layout: 'centered',
    actions: {
      handles: ['mouseover', 'click .btn'],
    },
  },
  // tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    index: { control: 'number' },
    // size: { control: 'radio', options: ['lg', 'md', 'sm'] },
  },
} satisfies Meta<typeof SudokuNumpadButton>;

// eslint-disable-next-line import/no-default-export
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
  },
  args: {
    // size: 'lg',
    children: '2',
    index: 1,
  },
};

// export const Medium: Story = {
//   args: {
//     size: 'md',
//     children: '2',
//     index: 1,
//   },
// };

// export const Small: Story = {
//   args: {
//     size: 'sm',
//     children: '2',
//     index: 1,
//   },
// };
