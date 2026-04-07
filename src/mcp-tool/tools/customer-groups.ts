import { z } from 'zod';
import { McpTool } from '../types';

export const customerGroupTools: McpTool[] = [
  {
    name: 'kiotviet_customer_groups_list',
    project: 'customers',
    description: 'Lấy danh sách nhóm khách hàng.',
    schema: z.object({}),
    httpMethod: 'GET',
    path: '/customergroups',
  },
];
