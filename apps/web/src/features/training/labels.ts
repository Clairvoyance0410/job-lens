import type { components } from '@/shared/api/schema';

export type TaskStatus = components['schemas']['Submission']['task_status'];
export type FeedbackTag = components['schemas']['FeedbackCreate']['tags'][number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: '未开始',
  in_progress: '进行中',
  paused: '已暂停',
  submitted: '已提交',
  changes_requested: '需修改',
  completed: '已完成',
  cancelled: '已取消',
};

export const OUTCOME_LABELS: Record<'passed' | 'changes_requested', string> = {
  passed: '通过',
  changes_requested: '需修改',
};

export const OUTCOME_OPTIONS: { value: 'passed' | 'changes_requested'; label: string }[] = [
  { value: 'passed', label: '通过' },
  { value: 'changes_requested', label: '需修改' },
];

export const TAG_LABELS: Record<FeedbackTag, string> = {
  title_correct: '标题正确',
  naming_adjustment: '命名需调整',
  retake_required: '需重新提交',
  other: '其他',
};

export const TAG_OPTIONS: { value: FeedbackTag; label: string }[] = [
  { value: 'title_correct', label: '标题正确' },
  { value: 'naming_adjustment', label: '命名需调整' },
  { value: 'retake_required', label: '需重新提交' },
  { value: 'other', label: '其他' },
];
