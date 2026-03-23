import type { DashboardSummary } from '@/types/dashboard'
import { mockDataStore } from './mockDataStore'

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return mockDataStore.getDashboardSummary()
}

export async function getStudyBatchIds(mode: 'learn' | 'review' = 'learn'): Promise<string[]> {
  return mockDataStore.getStudyBatchIds(mode)
}
