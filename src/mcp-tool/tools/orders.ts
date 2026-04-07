import { z } from 'zod';
import { McpTool } from '../types';

const paginationSchema = {
  pageSize: z.number().int().min(1).max(100).optional().describe('Số bản ghi mỗi trang (tối đa 100)'),
  currentItem: z.number().int().min(0).optional().describe('Vị trí bắt đầu (offset)'),
};

const orderDetailSchema = z.object({
  productId: z.number().int().describe('ID hàng hóa'),
  productCode: z.string().optional().describe('Mã hàng hóa'),
  quantity: z.number().describe('Số lượng'),
  price: z.number().describe('Đơn giá'),
  discount: z.number().optional().describe('Chiết khấu'),
});

const paymentSchema = z.object({
  amount: z.number().describe('Số tiền'),
  method: z.string().describe('Phương thức (Cash, Card, Transfer...)'),
  accountId: z.number().int().optional().describe('ID tài khoản ngân hàng'),
});

export const orderTools: McpTool[] = [
  {
    name: 'kiotviet_orders_list',
    project: 'orders',
    description: 'Lấy danh sách đơn hàng. Lọc theo chi nhánh, khách hàng, trạng thái.',
    schema: z.object({
      ...paginationSchema,
      branchIds: z.string().optional().describe('ID chi nhánh (nhiều ID cách nhau bằng dấu phẩy)'),
      customerIds: z.string().optional().describe('ID khách hàng'),
      customerCode: z.string().optional().describe('Mã khách hàng'),
      status: z.number().int().optional().describe('Trạng thái: 1=Đang xử lý, 2=Hoàn thành, 3=Đã hủy'),
      includePayment: z.boolean().optional().describe('Bao gồm thông tin thanh toán'),
      lastModifiedFrom: z.string().optional().describe('Lọc theo ngày cập nhật (ISO 8601)'),
    }),
    httpMethod: 'GET',
    path: '/orders',
  },
  {
    name: 'kiotviet_orders_get',
    project: 'orders',
    description: 'Lấy chi tiết đơn hàng theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID đơn hàng'),
    }),
    httpMethod: 'GET',
    path: '/orders/{id}',
  },
  {
    name: 'kiotviet_orders_create',
    project: 'orders',
    description: 'Tạo đơn hàng mới. Bắt buộc: branchId, orderDetails.',
    schema: z.object({
      branchId: z.number().int().describe('ID chi nhánh (bắt buộc)'),
      customerId: z.number().int().optional().describe('ID khách hàng'),
      purchaseDate: z.string().optional().describe('Ngày đặt hàng (ISO 8601)'),
      discount: z.number().optional().describe('Chiết khấu tổng đơn'),
      saleChannelId: z.number().int().optional().describe('ID kênh bán hàng'),
      orderDetails: z.array(orderDetailSchema).describe('Chi tiết đơn hàng (bắt buộc)'),
      payments: z.array(paymentSchema).optional().describe('Thông tin thanh toán'),
    }),
    httpMethod: 'POST',
    path: '/orders',
  },
  {
    name: 'kiotviet_orders_update',
    project: 'orders',
    description: 'Cập nhật đơn hàng theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID đơn hàng'),
      customerId: z.number().int().optional().describe('ID khách hàng'),
      discount: z.number().optional().describe('Chiết khấu tổng đơn'),
      orderDetails: z.array(orderDetailSchema).optional().describe('Chi tiết đơn hàng'),
      payments: z.array(paymentSchema).optional().describe('Thông tin thanh toán'),
    }),
    httpMethod: 'PUT',
    path: '/orders/{id}',
  },
  {
    name: 'kiotviet_orders_cancel',
    project: 'orders',
    description: 'Hủy đơn hàng theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID đơn hàng cần hủy'),
    }),
    httpMethod: 'DELETE',
    path: '/orders/{id}',
  },
];
