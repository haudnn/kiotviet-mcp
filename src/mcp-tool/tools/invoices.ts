import { z } from 'zod';
import { McpTool } from '../types';

const paginationSchema = {
  pageSize: z.number().int().min(1).max(100).optional().describe('Số bản ghi mỗi trang (tối đa 100)'),
  currentItem: z.number().int().min(0).optional().describe('Vị trí bắt đầu (offset)'),
};

const invoiceDetailSchema = z.object({
  productId: z.number().int().describe('ID hàng hóa'),
  productCode: z.string().optional().describe('Mã hàng hóa'),
  productName: z.string().optional().describe('Tên hàng hóa'),
  quantity: z.number().describe('Số lượng'),
  price: z.number().describe('Đơn giá'),
  discount: z.number().optional().describe('Chiết khấu'),
});

const paymentSchema = z.object({
  amount: z.number().describe('Số tiền'),
  method: z.string().describe('Phương thức thanh toán (Cash, Card, Transfer...)'),
  accountId: z.number().int().optional().describe('ID tài khoản ngân hàng'),
});

export const invoiceTools: McpTool[] = [
  {
    name: 'kiotviet_invoices_list',
    project: 'invoices',
    description: 'Lấy danh sách hóa đơn. Lọc theo cửa hàng, khách hàng, trạng thái, ngày hoá đơn',
    schema: z.object({
      ...paginationSchema,
      fromPurchaseDate: z.string().optional().describe('Từ ngày bắt đầu hoá đơn cần lấy'),
      toPurchaseDate: z.string().optional().describe('Đến ngày kết thúc hoá đơn cần lấy'),
      branchIds: z.string().optional().describe('ID cửa hàng (nhiều cửa hàng cách nhau bằng dấu phẩy)'),
      customerIds: z.string().optional().describe('ID khách hàng'),
      customerCode: z.string().optional().describe('Mã khách hàng'),
      status: z.number().int().optional().describe('Trạng thái: 1=Hoàn thành, 3=Đã hủy'),
      includePayment: z.boolean().optional().describe('Bao gồm thông tin thanh toán'),
      includeInvoiceDelivery: z.boolean().optional().describe('Bao gồm thông tin giao hàng'),
    }),
    httpMethod: 'GET',
    path: '/invoices',
  },
  {
    name: 'kiotviet_invoices_get_by_id',
    project: 'invoices',
    description: 'Lấy chi tiết hóa đơn theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID hóa đơn'),
    }),
    httpMethod: 'GET',
    path: '/invoices/{id}',
  },
  {
    name: 'kiotviet_invoices_get_by_code',
    project: 'invoices',
    description: 'Lấy chi tiết hóa đơn theo mã.',
    schema: z.object({
      code: z.string().describe('Mã hóa đơn'),
    }),
    httpMethod: 'GET',
    path: '/invoices/code:{code}',
  },
  {
    name: 'kiotviet_invoices_create',
    project: 'invoices',
    description: 'Tạo hóa đơn mới. Bắt buộc: branchId, invoiceDetails (productId, quantity, price).',
    schema: z.object({
      branchId: z.number().int().describe('ID chi nhánh (bắt buộc)'),
      customerId: z.number().int().optional().describe('ID khách hàng'),
      purchaseDate: z.string().optional().describe('Ngày xuất hóa đơn (ISO 8601)'),
      discount: z.number().optional().describe('Chiết khấu tổng hóa đơn'),
      saleChannelId: z.number().int().optional().describe('ID kênh bán hàng'),
      invoiceDetails: z.array(invoiceDetailSchema).describe('Chi tiết hóa đơn (bắt buộc)'),
      payments: z.array(paymentSchema).optional().describe('Thông tin thanh toán'),
    }),
    httpMethod: 'POST',
    path: '/invoices',
  },
  {
    name: 'kiotviet_invoices_update',
    project: 'invoices',
    description: 'Cập nhật hóa đơn theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID hóa đơn'),
      customerId: z.number().int().optional().describe('ID khách hàng'),
      discount: z.number().optional().describe('Chiết khấu tổng'),
      invoiceDetails: z.array(invoiceDetailSchema).optional().describe('Chi tiết hóa đơn'),
      payments: z.array(paymentSchema).optional().describe('Thông tin thanh toán'),
    }),
    httpMethod: 'PUT',
    path: '/invoices/{id}',
  },
  {
    name: 'kiotviet_invoices_cancel',
    project: 'invoices',
    description: 'Hủy hóa đơn theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID hóa đơn cần hủy'),
    }),
    httpMethod: 'DELETE',
    path: '/invoices/{id}',
  },
];
