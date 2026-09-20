import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, confirmHeaders, unwrap } from '@/shared/api/client';
import type { components } from '@/shared/api/schema';

type FeedbackCreate = components['schemas']['FeedbackCreate'];

/** 读取提交快照。父任务 version 经 ETag/task_version 投影，审核时用作 If-Match。 */
export function useSubmission(submissionId: string) {
  return useQuery({
    queryKey: ['submission', submissionId],
    queryFn: async ({ signal }) =>
      unwrap(
        await api.GET('/submissions/{submission_id}', {
          params: { path: { submission_id: submissionId } },
          signal,
        }),
      ),
  });
}

/** 提交快照只带 step_id 与状态，不含步骤说明；拉取对应 SOP 版本以展示步骤内容。 */
export function useSnapshotRevision(revisionId: string) {
  return useQuery({
    queryKey: ['training-revision', revisionId],
    queryFn: async ({ signal }) =>
      unwrap(
        await api.GET('/sop-revisions/{revision_id}', {
          params: { path: { revision_id: revisionId } },
          signal,
        }),
      ),
  });
}

/** 审核提交：If-Match 用父任务 task_version；幂等键保证「一份主反馈」。 */
export function useFeedback(submissionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ version, body }: { version: number; body: FeedbackCreate }) =>
      unwrap(
        await api.POST('/submissions/{submission_id}/feedback', {
          params: {
            path: { submission_id: submissionId },
            header: confirmHeaders(version, crypto.randomUUID()),
          },
          body,
        }),
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['submission', submissionId] });
      // 审核会推进/回退任务状态，刷新个案列表与工作台「待反馈」计数。
      qc.invalidateQueries({ queryKey: ['cases'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
