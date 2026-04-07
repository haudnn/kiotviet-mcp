import { z } from 'zod';
import { McpTool } from '../types';

export const cashBookTools: McpTool[] = [
  {
    name: 'kiotviet_cashbook_list',
    project: 'cashbook',
    description: 'Lấy danh sách phiếu thu/chi trong sổ quỹ. Lọc theo chi nhánh, ngày, loại phiếu.',
    schema: z.object({
      pageSize: z.number().int().min(1).max(100).optional().describe('Số bản ghi mỗi trang (tối đa 100)'),
      currentItem: z.number().int().min(0).optional().describe('Vị trí bắt đầu (offset)'),
      branchIds: z.string().optional().describe('Lọc theo ID chi nhánh (nhiều ID cách nhau bằng dấu phẩy)'),
      fromDate: z.string().optional().describe('Từ ngày (ISO 8601)'),
      toDate: z.string().optional().describe('Đến ngày (ISO 8601)'),
      type: z.number().int().min(0).max(1).optional().describe('Loại phiếu: 0=Thu, 1=Chi'),
    }),
    httpMethod: 'GET',
    path: '/cashbook',
  },
];
