import { z } from 'zod';
import { McpTool } from '../types';

const paginationSchema = {
  pageSize: z.number().int().min(1).max(100).optional().describe('Số bản ghi mỗi trang (tối đa 100)'),
  currentItem: z.number().int().min(0).optional().describe('Vị trí bắt đầu (offset)'),
};

export const returnTools: McpTool[] = [
  {
    name: 'kiotviet_returns_list',
    project: 'returns',
    description: 'Lấy danh sách phiếu trả hàng. Lọc theo ngày, khách hàng, thanh toán.',
    schema: z.object({
      ...paginationSchema,
      orderBy: z.string().optional().describe('Sắp xếp theo trường'),
      lastModifiedFrom: z.string().optional().describe('Lọc theo ngày cập nhật (ISO 8601)'),
      includePayment: z.boolean().optional().describe('Bao gồm thông tin thanh toán'),
      fromReturnDate: z.string().optional().describe('Thời gian bắt đầu trả hàng (ISO 8601)'),
      toReturnDate: z.string().optional().describe('Thời gian kết thúc trả hàng (ISO 8601)'),
    }),
    httpMethod: 'GET',
    path: '/returns',
  },
  {
    name: 'kiotviet_returns_get_by_id',
    project: 'returns',
    description: 'Lấy chi tiết phiếu trả hàng theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID phiếu trả hàng'),
    }),
    httpMethod: 'GET',
    path: '/returns/{id}',
  },
  {
    name: 'kiotviet_returns_get_by_code',
    project: 'returns',
    description: 'Lấy chi tiết phiếu trả hàng theo mã.',
    schema: z.object({
      code: z.string().describe('Mã phiếu trả hàng (ví dụ: TH0001)'),
    }),
    httpMethod: 'GET',
    path: '/returns/code/{code}',
  },
];
