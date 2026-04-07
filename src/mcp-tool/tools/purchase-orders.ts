import { z } from 'zod';
import { McpTool } from '../types';

const purchaseDetailSchema = z.object({
  productId: z.number().int().describe('ID hàng hóa'),
  productCode: z.string().optional().describe('Mã hàng hóa'),
  quantity: z.number().describe('Số lượng nhập'),
  price: z.number().describe('Giá nhập'),
  discount: z.number().optional().describe('Chiết khấu'),
});

export const purchaseOrderTools: McpTool[] = [
  {
    name: 'kiotviet_purchase_orders_list',
    project: 'purchase-orders',
    description: 'Lấy danh sách phiếu nhập kho. Lọc theo chi nhánh, nhà cung cấp, trạng thái.',
    schema: z.object({
      pageSize: z.number().int().min(1).max(100).optional().describe('Số bản ghi mỗi trang (tối đa 100)'),
      currentItem: z.number().int().min(0).optional().describe('Vị trí bắt đầu (offset)'),
      branchIds: z.string().optional().describe('Lọc theo ID chi nhánh'),
      supplierIds: z.string().optional().describe('Lọc theo ID nhà cung cấp'),
      status: z.number().int().optional().describe('Trạng thái phiếu nhập'),
      lastModifiedFrom: z.string().optional().describe('Lọc theo ngày cập nhật (ISO 8601)'),
    }),
    httpMethod: 'GET',
    path: '/purchaseorders',
  },
  {
    name: 'kiotviet_purchase_orders_get',
    project: 'purchase-orders',
    description: 'Lấy chi tiết phiếu nhập kho theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID phiếu nhập kho'),
    }),
    httpMethod: 'GET',
    path: '/purchaseorders/{id}',
  },
  {
    name: 'kiotviet_purchase_orders_create',
    project: 'purchase-orders',
    description: 'Tạo phiếu nhập kho mới.',
    schema: z.object({
      branchId: z.number().int().describe('ID chi nhánh (bắt buộc)'),
      supplierId: z.number().int().optional().describe('ID nhà cung cấp'),
      purchaseDate: z.string().optional().describe('Ngày nhập (ISO 8601)'),
      purchaseOrderDetails: z.array(purchaseDetailSchema).describe('Chi tiết phiếu nhập (bắt buộc)'),
    }),
    httpMethod: 'POST',
    path: '/purchaseorders',
  },
];
