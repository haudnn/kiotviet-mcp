import { z } from 'zod';
import { McpTool } from '../types';

export const bankAccountTools: McpTool[] = [
  {
    name: 'kiotviet_bank_accounts_list',
    project: 'bank-accounts',
    description: 'Lấy danh sách tài khoản ngân hàng của cửa hàng.',
    schema: z.object({}),
    httpMethod: 'GET',
    path: '/bankaccounts',
  },
];
