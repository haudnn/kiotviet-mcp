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
  },
  {
    name: 'kiotviet_customers_create',
    project: 'customers',
    description: 'Tạo khách hàng mới.',
    schema: z.object({
      code: z.string().optional().describe('Mã khách hàng'),
      name: z.string().describe('Tên khách hàng (bắt buộc)'),
      contactNumber: z.string().optional().describe('Số điện thoại'),
      email: z.string().email().optional().describe('Email'),
      address: z.string().optional().describe('Địa chỉ'),
      groupId: z.number().int().optional().describe('ID nhóm khách hàng'),
      gender: z.number().int().min(0).max(1).optional().describe('Giới tính (0=Nữ, 1=Nam)'),
      birthDate: z.string().optional().describe('Ngày sinh (ISO 8601)'),
      organization: z.string().optional().describe('Tên công ty/tổ chức'),
      taxCode: z.string().optional().describe('Mã số thuế'),
      comments: z.string().optional().describe('Ghi chú'),
    }),
    httpMethod: 'POST',
    path: '/customers',
  },
  {
    name: 'kiotviet_customers_update',
    project: 'customers',
    description: 'Cập nhật thông tin khách hàng theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID khách hàng'),
      name: z.string().optional().describe('Tên khách hàng'),
      contactNumber: z.string().optional().describe('Số điện thoại'),
      email: z.string().email().optional().describe('Email'),
      address: z.string().optional().describe('Địa chỉ'),
      groupId: z.number().int().optional().describe('ID nhóm khách hàng'),
      gender: z.number().int().min(0).max(1).optional().describe('Giới tính'),
      birthDate: z.string().optional().describe('Ngày sinh (ISO 8601)'),
      organization: z.string().optional().describe('Tên công ty'),
      taxCode: z.string().optional().describe('Mã số thuế'),
      comments: z.string().optional().describe('Ghi chú'),
    }),
    httpMethod: 'PUT',
    path: '/customers/{id}',
  },
];
