import { z } from 'zod';
import { McpTool } from '../types';

export const categoryTools: McpTool[] = [
  {
    name: 'kiotviet_categories_list',
    project: 'categories',
    description: 'Lấy danh sách danh mục hàng hoá. Hỗ trợ phân trang và lọc theo ngày cập nhật.',
    schema: z.object({
      pageSize: z.number().int().min(1).max(100).optional().describe('Số bản ghi mỗi trang (tối đa 100)'),
      currentItem: z.number().int().min(0).optional().describe('Vị trí bắt đầu (offset)'),
      lastModifiedFrom: z.string().optional().describe('Lọc nhóm hàng cập nhật từ ngày (ISO 8601)'),
      hierarchicalData: z.boolean().optional().describe('Trả về dạng cây phân cấp'),
    }),
    httpMethod: 'GET',
    path: '/categories',
  },
];
