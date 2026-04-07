import { z } from 'zod';
import { McpTool } from '../types';

export const branchTools: McpTool[] = [
  {
    name: 'kiotviet_branches_list',
    project: 'branches',
    description: 'Lấy danh sách tất cả chi nhánh của cửa hàng.',
    schema: z.object({}),
    httpMethod: 'GET',
    path: '/branches',
  },
];
