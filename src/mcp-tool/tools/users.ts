import { z } from 'zod';
import { McpTool } from '../types';

export const userTools: McpTool[] = [
  {
    name: 'kiotviet_users_list',
    project: 'users',
    description: 'Lấy danh sách người dùng/nhân viên của cửa hàng.',
    schema: z.object({}),
    httpMethod: 'GET',
    path: '/users',
  },
];
