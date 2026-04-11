import { McpTool } from './types';
import { categoryTools } from './tools/categories';
import { productTools } from './tools/products';
import { customerTools } from './tools/customers';
import { invoiceTools } from './tools/invoices';
import { branchTools } from './tools/branches';
import { returnTools } from './tools/returns';

// import { cashBookTools } from './tools/cashbook';
// import { webhookTools } from './tools/webhooks';
// import { bankAccountTools } from './tools/bank-accounts';
// import { userTools } from './tools/users';
// import { supplierTools } from './tools/suppliers';
// import { purchaseOrderTools } from './tools/purchase-orders';
// import { customerGroupTools } from './tools/customer-groups';
// import { orderTools } from './tools/orders';

export const allTools: McpTool[] = [
  ...categoryTools,
  ...productTools,
  ...customerTools,
  ...invoiceTools,
  ...branchTools,
  ...returnTools,
  // ...orderTools,
  // ...purchaseOrderTools,
  // ...userTools,
  // ...supplierTools,
  // ...customerGroupTools,
  // ...cashBookTools,
  // ...webhookTools,
  // ...bankAccountTools,

];

/** Preset tool groups */
export const PRESETS: Record<string, string[]> = {
  'preset.default': allTools.map((t) => t.name),

  'preset.readonly': allTools
    .filter((t) => t.httpMethod === 'GET')
    .map((t) => t.name),

  'preset.products': [
    ...productTools.map((t) => t.name),
    ...categoryTools.map((t) => t.name),
  ],

  'preset.sales': [
    // ...orderTools.map((t) => t.name),
    ...invoiceTools.map((t) => t.name),
    ...returnTools.map((t) => t.name),
    ...customerTools.map((t) => t.name),
    // ...customerGroupTools.map((t) => t.name),
  ],

  'preset.inventory': [
    ...productTools.map((t) => t.name),
    // ...purchaseOrderTools.map((t) => t.name),
    // ...supplierTools.map((t) => t.name),
    ...branchTools.map((t) => t.name),
  ],
};

/**
 * Filters allTools by a list of tool names, project names, or preset keys.
 */
export function filterTools(tools: McpTool[], filter: string[]): McpTool[] {
  if (!filter || filter.length === 0) return tools;

  const filterSet = new Set(filter);
  return tools.filter(
    (t) => filterSet.has(t.name) || filterSet.has(t.project)
  );
}
