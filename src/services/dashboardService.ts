import type { DashboardSummary } from '@/types/dashboard'
import type { ApiResponse } from '@/types/api'
import api from './api'

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary')
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message ?? 'Common_500')
  }

  const summary = response.data.data
  const jlpt = summary.personal.jlpt as Record<string, DashboardSummary['personal']['jlpt'][keyof DashboardSummary['personal']['jlpt']]>

  return {
    ...summary,
    personal: {
      ...summary.personal,
      jlpt: {
        'Từ vựng': jlpt['Từ vựng'] ?? jlpt['Tu vung'] ?? [],
        'Ngữ pháp': jlpt['Ngữ pháp'] ?? jlpt['Ngu phap'] ?? [],
        'Cả hai': jlpt['Cả hai'] ?? jlpt['Ca hai'] ?? [],
      },
    },
  }
}

export async function getStudyBatchIds(mode: 'learn' | 'review' = 'learn'): Promise<string[]> {
  const response = await api.get<ApiResponse<string[]>>('/dashboard/study-batch-ids', {
    params: { mode },
  })
  if (!response.data.success) {
    throw new Error(response.data.message ?? 'Common_500')
  }

  return response.data.data ?? []
}
