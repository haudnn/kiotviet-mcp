import { z } from 'zod';
import { McpTool } from '../types';

const paginationSchema = {
  pageSize: z.number().int().min(1).max(100).optional().describe('Số bản ghi mỗi trang (tối đa 100)'),
  currentItem: z.number().int().min(0).optional().describe('Vị trí bắt đầu (offset)'),
};

export const customerTools: McpTool[] = [
  {
    name: 'kiotviet_customers_list',
    project: 'customers',
    description: 'Lấy danh sách khách hàng. Hỗ trợ lọc theo tên, số điện thoại, nhóm khách hàng.',
    schema: z.object({
      ...paginationSchema,
      code: z.string().optional().describe('Mã khách hàng'),
      name: z.string().optional().describe('Tên khách hàng'),
      contactNumber: z.string().optional().describe('Số điện thoại'),
      lastModifiedFrom: z.string().optional().describe('Lọc theo ngày cập nhật (ISO 8601)'),
      groupId: z.number().int().optional().describe('ID nhóm khách hàng'),
      includeTotal: z.boolean().optional().describe('Có lấy thông tin TotalInvoice, TotalPoint, TotalRevenue'),
      birthDate: z.string().optional().describe('Ngày sinh nhật khách hàng (ISO 8601)') 
    }),
    httpMethod: 'GET',
    path: '/customers',
  },
  {
    name: 'kiotviet_customers_get_by_id',
    project: 'customers',
    description: 'Lấy thông tin chi tiết khách hàng theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID khách hàng'),
    }),
    httpMethod: 'GET',
    path: '/customers/{id}',
  },
  {
    name: 'kiotviet_customers_get_by_code',
    project: 'customers',
    description: 'Lấy thông tin chi tiết khách hàng theo mã.',
    schema: z.object({
      code: z.string().describe('Mã khách hàng'),
    }),
    httpMethod: 'GET',
    path: '/customers/code:{code}',
  }
];
