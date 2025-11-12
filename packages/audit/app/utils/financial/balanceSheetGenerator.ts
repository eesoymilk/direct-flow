import type {
  BalanceSheetConfig,
  BSNode,
  TrialBalanceEntry,
  GeneratedBalanceSheet,
  GeneratedBSLineItem,
} from "../../types/financial";
import { isParentNode, isLeafNode } from "../../types/financial";
import { createTBMap, calculateLineItemAmount } from "./accountQuery";

/**
 * Balance Sheet Generator
 *
 * Pure functions for generating Balance Sheet from TB data and hierarchical config.
 * Uses functional programming approach with no classes or stateful objects.
 */

/**
 * Generate complete Balance Sheet from TB data and configuration
 *
 * @param tbEntries - Trial Balance data
 * @param config - Hierarchical Balance Sheet configuration
 * @param companyName - Company name for metadata
 * @param periodYear - Accounting period year (ROC year)
 * @returns Generated Balance Sheet with flattened line items
 *
 * @example
 * const balanceSheet = generateBalanceSheet(
 *   tbData,
 *   balanceSheetConfig,
 *   '測試公司',
 *   113
 * );
 */
export function generateBalanceSheet(
  tbEntries: TrialBalanceEntry[],
  config: BalanceSheetConfig,
  companyName: string,
  periodYear: number
): GeneratedBalanceSheet {
  const tbMap = createTBMap(tbEntries);
  const lineItems: GeneratedBSLineItem[] = [];

  // Generate line items for each root node (recursively)
  for (const node of config.nodes) {
    lineItems.push(...generateNodeLines(node, tbMap, 0, undefined));
  }

  return {
    lineItems,
    metadata: {
      companyName,
      periodYear,
      generatedAt: new Date(),
    },
  };
}

/**
 * Generate line items for a node (recursive)
 *
 * @param node - Balance sheet node (can be parent or leaf)
 * @param tbMap - TB entries map for lookups
 * @param indentLevel - Current indentation level
 * @param parentSide - Accounting side from parent (asset/liability/equity)
 * @returns Array of flattened line items for the node and its children
 */
function generateNodeLines(
  node: BSNode,
  tbMap: Map<string, TrialBalanceEntry>,
  indentLevel: number,
  parentSide: "asset" | "liability" | "equity" | undefined
): GeneratedBSLineItem[] {
  const items: GeneratedBSLineItem[] = [];

  // Determine the side for this node (use node's side if available, otherwise inherit from parent)
  const currentSide = isParentNode(node) && node.side ? node.side : parentSide;

  if (isLeafNode(node)) {
    // Leaf node: calculate amount from TB data
    if (!currentSide) {
      throw new Error(`Leaf node ${node.code} has no accounting side defined`);
    }

    const amount = calculateLineItemAmount(tbMap, node.query, currentSide);

    items.push({
      code: node.code,
      name: node.name,
      amount,
      indentLevel,
      isSubtotal: false,
      isTotal: false,
    });
  } else if (isParentNode(node)) {
    // Parent node: add header, recurse through children, optionally add subtotal

    // Add parent header (e.g., "資產", "流動資產")
    items.push({
      code: node.code,
      name: node.name,
      amount: 0,
      indentLevel,
      isSubtotal: false,
      isTotal: false,
    });

    let subtotal = 0;

    // Recursively generate items for all children
    for (const child of node.children) {
      const childItems = generateNodeLines(
        child,
        tbMap,
        indentLevel + 1,
        currentSide
      );
      items.push(...childItems);

      // Sum up leaf node amounts (not subtotals/totals) for subtotal calculation
      subtotal += sumNodeTotal(childItems);
    }

    // Add subtotal if configured
    if (node.showSubtotal) {
      items.push({
        code: `${node.code}-SUBTOTAL`,
        name: node.subtotalLabel || `${node.name}合計`,
        amount: subtotal,
        indentLevel,
        isSubtotal: true,
        isTotal: indentLevel === 0, // Root level subtotals are considered totals
      });
    }
  }

  return items;
}

/**
 * Sum the total amount for a node's children
 * Sums only the deepest subtotal or leaf amounts, avoiding double-counting
 *
 * @param nodeItems - Line items generated for a node
 * @returns Total amount for the node
 */
function sumNodeTotal(nodeItems: GeneratedBSLineItem[]): number {
  // Find the deepest subtotal (which represents the sum of all children)
  // If no subtotal exists, sum all leaf items
  const subtotalItems = nodeItems.filter((item) => item.isSubtotal);

  if (subtotalItems.length > 0) {
    // Return the first (outermost) subtotal, which includes all nested amounts
    return subtotalItems[0]?.amount || 0;
  }

  // If no subtotals, sum all non-subtotal, non-total items (leaf nodes)
  return nodeItems
    .filter((item) => !item.isSubtotal && !item.isTotal)
    .reduce((sum, item) => sum + item.amount, 0);
}
