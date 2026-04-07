import { z } from 'zod';
import { McpTool } from '../types';

export const supplierTools: McpTool[] = [
  {
    name: 'kiotviet_suppliers_list',
    project: 'suppliers',
    description: 'Lấy danh sách nhà cung cấp. Hỗ trợ tìm kiếm theo tên.',
    schema: z.object({
      pageSize: z.number().int().min(1).max(100).optional().describe('Số bản ghi mỗi trang (tối đa 100)'),
      currentItem: z.number().int().min(0).optional().describe('Vị trí bắt đầu (offset)'),
      name: z.string().optional().describe('Tìm kiếm theo tên nhà cung cấp'),
    }),
    httpMethod: 'GET',
    path: '/suppliers',
  },
];
