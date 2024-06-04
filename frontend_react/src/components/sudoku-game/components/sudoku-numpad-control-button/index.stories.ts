import type { Meta, StoryObj } from '@storybook/react';

import { userEvent, within } from '@storybook/test';
import { SudokuNumpadControlButton } from '.';

const meta = {
  title: 'Components/SudokuNumpadControlButton',
  component: SudokuNumpadControlButton,
  parameters: {
    layout: 'centered',
    actions: {
      handles: ['mouseover', 'click .btn'],
    },
  },
  // tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    // index: { control: 'number' },
    // size: { control: 'radio', options: ['lg', 'md', 'sm'] },
  },
} satisfies Meta<typeof SudokuNumpadControlButton>;

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
    label: '2',
    // index: 1,
  },
};
