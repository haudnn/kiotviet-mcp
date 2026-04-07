import { z } from 'zod';
import { McpTool } from '../types';

const paginationSchema = {
  pageSize: z.number().int().min(1).max(100).optional().describe('Số bản ghi mỗi trang (tối đa 100)'),
  currentItem: z.number().int().min(0).optional().describe('Vị trí bắt đầu (offset)'),
};

export const productTools: McpTool[] = [
  {
    name: 'kiotviet_products_list',
    project: 'products',
    description: 'Lấy danh sách hàng hóa. Hỗ trợ lọc theo nhóm hàng, ngày cập nhật, tồn kho.',
    schema: z.object({
      ...paginationSchema,
      orderBy: z.string().optional().describe('Sắp xếp theo trường (vd: id, modifiedDate)'),
      orderDirection: z.enum(['ASC', 'DESC']).optional().describe('Chiều sắp xếp'),
      lastModifiedFrom: z.string().optional().describe('Lọc hàng hóa thay đổi từ ngày (ISO 8601)'),
      categoryId: z.number().int().optional().describe('Lọc theo nhóm hàng'),
      masterUnitId: z.number().optional().describe('Lọc theo đơn vị cơ bản'),
      includeInventory: z.boolean().optional().describe('Bao gồm thông tin tồn kho'),
      includePricebook: z.boolean().optional().describe('Bao gồm bảng giá'),
      IncludeBatchExpires: z.boolean().optional().describe('Bao gồm thông tin lô/hạn dùng'),
    }),
    httpMethod: 'GET',
    path: '/products',
  },
  {
    name: 'kiotviet_products_get_by_id',
    project: 'products',
    description: 'Lấy thông tin chi tiết hàng hóa theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID hàng hóa'),
    }),
    httpMethod: 'GET',
    path: '/products/{id}',
  },
  {
    name: 'kiotviet_products_get_by_code',
    project: 'products',
    description: 'Lấy thông tin chi tiết hàng hóa theo mã hàng.',
    schema: z.object({
      code: z.string().describe('Mã hàng hóa'),
    }),
    httpMethod: 'GET',
    path: '/products/code:{code}',
  },
  {
    name: 'kiotviet_products_create',
    project: 'products',
    description: 'Tạo hàng hóa mới. Bắt buộc: code, name, categoryId, retailPrice.',
    schema: z.object({
      code: z.string().describe('Mã hàng hóa (bắt buộc)'),
      name: z.string().describe('Tên hàng hóa (bắt buộc)'),
      categoryId: z.number().int().describe('ID nhóm hàng (bắt buộc)'),
      retailPrice: z.number().describe('Giá bán lẻ (bắt buộc)'),
      basePrice: z.number().optional().describe('Giá vốn'),
      weight: z.number().optional().describe('Khối lượng (kg)'),
      unit: z.string().optional().describe('Đơn vị tính'),
      isActive: z.boolean().optional().describe('Kích hoạt hàng hóa'),
      allowsSale: z.boolean().optional().describe('Cho phép bán'),
      description: z.string().optional().describe('Mô tả hàng hóa'),
      isRewardPoint: z.boolean().optional().describe('Tích điểm thưởng'),
    }),
    httpMethod: 'POST',
    path: '/products',
  },
  {
    name: 'kiotviet_products_update',
    project: 'products',
    description: 'Cập nhật thông tin hàng hóa theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID hàng hóa'),
      name: z.string().optional().describe('Tên hàng hóa'),
      categoryId: z.number().int().optional().describe('ID nhóm hàng'),
      retailPrice: z.number().optional().describe('Giá bán lẻ'),
      basePrice: z.number().optional().describe('Giá vốn'),
      weight: z.number().optional().describe('Khối lượng (kg)'),
      unit: z.string().optional().describe('Đơn vị tính'),
      isActive: z.boolean().optional().describe('Kích hoạt hàng hóa'),
      allowsSale: z.boolean().optional().describe('Cho phép bán'),
      description: z.string().optional().describe('Mô tả hàng hóa'),
    }),
    httpMethod: 'PUT',
    path: '/products/{id}',
  },
  {
    name: 'kiotviet_products_delete',
    project: 'products',
    description: 'Xóa hàng hóa theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID hàng hóa cần xóa'),
    }),
    httpMethod: 'DELETE',
    path: '/products/{id}',
  },
];
