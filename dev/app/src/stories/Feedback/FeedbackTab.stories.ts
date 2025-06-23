import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

// components
import { FeedbackTab, FeedbackTabProps } from './FeedbackTab';

// meta情報の定義
const meta = {
    title: 'Feedback/FeedbackTab',
    component: FeedbackTab,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        color: { control: 'color' },            // 色
        backgroundColor: { control: 'color' },  // 背景色
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: { onClick: fn() },
} satisfies Meta<typeof FeedbackTab>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story - 基本的なコンポーネントのストーリー
export const Primary : Story = {
    args: {
        primary: true,
        backgroundColor: "#000000",
        color: "#ffffff",
        aiReview: "これまでの素晴らしいご経験を踏まえ、今後どのような技術分野に興味があるのか、どのようなエンジニア（あるいは人物）になっていきたいのか、といった将来のビジョンを少し加えることで、ご自身のキャリアに対する一貫性や熱意がより深く伝わります。"
    },
};
