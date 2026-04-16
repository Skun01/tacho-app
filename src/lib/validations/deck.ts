import { z } from 'zod'

export const deckFormSchema = z.object({
  title: z.string().trim().min(1, 'Vui lòng nhập tiêu đề bộ thẻ.'),
  description: z.string().trim().max(1000, 'Mô tả không được vượt quá 1000 ký tự.').optional().or(z.literal('')),
  coverImageFile: z.instanceof(File).nullable().optional(),
  visibility: z.enum(['Private', 'Public']),
  typeId: z.string().optional().or(z.literal('')),
})

export type DeckFormValues = z.infer<typeof deckFormSchema>

export const folderFormSchema = z.object({
  title: z.string().trim().min(1, 'Vui lòng nhập tên thư mục.'),
  description: z.string().trim().max(500, 'Mô tả không được vượt quá 500 ký tự.').optional().or(z.literal('')),
})

export type FolderFormValues = z.infer<typeof folderFormSchema>
