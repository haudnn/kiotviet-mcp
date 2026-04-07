import { z } from 'zod';
import { McpTool } from '../types';

const webhookEventSchema = z.enum([
  'customer.update',
  'customer.delete',
  'product.update',
  'product.delete',
  'stock.update',
  'order.update',
  'invoice.update',
]);

export const webhookTools: McpTool[] = [
  {
    name: 'kiotviet_webhooks_list',
    project: 'webhooks',
    description: 'Lấy danh sách webhook đã đăng ký.',
    schema: z.object({}),
    httpMethod: 'GET',
    path: '/webhooks',
  },
  {
    name: 'kiotviet_webhooks_create',
    project: 'webhooks',
    description: 'Đăng ký webhook mới để nhận thông báo sự kiện từ KiotViet.',
    schema: z.object({
      type: webhookEventSchema.describe(
        'Loại sự kiện: customer.update, customer.delete, product.update, product.delete, stock.update, order.update, invoice.update'
      ),
      url: z.string().url().describe('URL nhận webhook (phải phản hồi trong 5 giây)'),
      isActive: z.boolean().optional().default(true).describe('Kích hoạt webhook'),
    }),
    httpMethod: 'POST',
    path: '/webhooks',
  },
  {
    name: 'kiotviet_webhooks_update',
    project: 'webhooks',
    description: 'Cập nhật cấu hình webhook theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID webhook'),
      type: webhookEventSchema.optional().describe('Loại sự kiện'),
      url: z.string().url().optional().describe('URL nhận webhook'),
      isActive: z.boolean().optional().describe('Kích hoạt/tắt webhook'),
    }),
    httpMethod: 'PUT',
    path: '/webhooks/{id}',
  },
  {
    name: 'kiotviet_webhooks_delete',
    project: 'webhooks',
    description: 'Xóa webhook theo ID.',
    schema: z.object({
      id: z.number().int().describe('ID webhook cần xóa'),
    }),
    httpMethod: 'DELETE',
    path: '/webhooks/{id}',
  },
];
