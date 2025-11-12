<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold">資產負債表</h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ metadata.companyName }} - {{ metadata.periodYear }}年度
          </p>
        </div>
        <UButton
          label="匯出"
          icon="i-lucide-download"
          color="primary"
          @click="handleExport"
        />
      </div>
    </template>

    <div class="space-y-4">
      <!-- Table -->
      <UTable
        v-model:expanded="expanded"
        :data="treeData"
        :columns="columns"
        :get-sub-rows="(row) => row.subRows"
        :ui="{
          base: 'border-separate border-spacing-0',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          tr: 'group',
          td: 'empty:p-0 group-has-[td:not(:empty)]:border-b border-default',
        }"
      />

      <!-- Footer Info -->
      <div class="pt-4 border-t text-xs text-gray-500 text-right">
        產生時間:
        {{
          formatDateFns(metadata.generatedAt, "yyyy/MM/dd HH:mm", {
            locale: zhTW,
          })
        }}
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { format as formatDateFns } from "date-fns";
import { zhTW } from "date-fns/locale";
import type {
  GeneratedBalanceSheet,
  GeneratedBSLineItem,
} from "../../../types/financial";

const UButton = resolveComponent("UButton");

interface Props {
  balanceSheet: GeneratedBalanceSheet;
}

const props = defineProps<Props>();

const metadata = computed(() => props.balanceSheet.metadata);

// Track expanded rows
const expanded = ref({});

// Transform flat array into hierarchical tree structure
interface TreeLineItem extends GeneratedBSLineItem {
  subRows?: TreeLineItem[];
  computedAmount?: number;
}

// Helper function to compute parent amount from children
function computeAmount(item: TreeLineItem): number {
  if (!item.subRows || item.subRows.length === 0) {
    return item.amount;
  }
  // For parent rows, sum all children
  return item.subRows.reduce((sum, child) => sum + computeAmount(child), 0);
}

// Helper function to set computed amounts on all nodes in the tree
function setComputedAmounts(item: TreeLineItem): void {
  // First, recursively process all children
  if (item.subRows && item.subRows.length > 0) {
    item.subRows.forEach((child) => setComputedAmounts(child));
  }
  // Then set the computed amount for this item
  item.computedAmount = computeAmount(item);
}

const treeData = computed(() => {
  // Filter out separate total/subtotal rows - we'll compute them on parents
  const items = props.balanceSheet.lineItems.filter((item) => {
    // Keep all rows except standalone totals/subtotals
    // Standalone totals/subtotals have isTotal or isSubtotal = true
    return !item.isTotal && !item.isSubtotal;
  });

  // Build tree structure recursively for arbitrary depth
  const tree: TreeLineItem[] = [];
  const stack: { level: number; item: TreeLineItem }[] = [];

  items.forEach((item) => {
    const treeItem: TreeLineItem = { ...item, subRows: [] };

    // Remove items from stack that are at same or deeper level
    while (stack.length > 0) {
      const top = stack[stack.length - 1];
      if (top && top.level >= item.indentLevel) {
        stack.pop();
      } else {
        break;
      }
    }

    if (stack.length === 0) {
      // Root level item
      tree.push(treeItem);
    } else {
      // Child item - add to parent's subRows
      const parent = stack[stack.length - 1]?.item;
      if (parent?.subRows) {
        parent.subRows.push(treeItem);
      }
    }

    // Add current item to stack
    stack.push({ level: item.indentLevel, item: treeItem });
  });

  // Compute amounts for all items recursively (including nested children)
  tree.forEach((item) => {
    setComputedAmounts(item);
  });

  return tree;
});

// Amount formatting helper
const formatAmount = (amount: number): string => {
  if (amount === 0) return "-";

  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat("zh-TW", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);

  return amount < 0 ? `(${formatted})` : formatted;
};

// Table columns configuration
const columns = [
  {
    accessorKey: "name",
    header: "項目",
    cell: ({ row }: any) => {
      const hasChildren =
        row.original.subRows && row.original.subRows.length > 0;
      const isParent = hasChildren;

      const nameClasses = [
        "text-gray-700",
        // Parent rows (with children) are bold like totals
        isParent ? "font-bold" : "",
        // Apply different font sizes based on depth
        row.depth === 0 ? "text-base" : "",
        row.depth === 1 && isParent ? "font-semibold" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const nameElement = h("span", { class: nameClasses }, [
        row.original.name,
        row.original.code
          ? h(
              "span",
              { class: "ml-2 text-xs text-gray-400" },
              `(${row.original.code})`
            )
          : null,
      ]);

      return h(
        "div",
        {
          style: {
            paddingLeft: `${row.depth * 1.5}rem`,
          },
          class: "flex items-center gap-2",
        },
        [
          h(UButton, {
            color: "neutral",
            variant: "ghost",
            size: "xs",
            icon: row.getIsExpanded()
              ? "i-lucide-chevron-down"
              : "i-lucide-chevron-right",
            class: !row.getCanExpand() && "invisible",
            onClick: row.getToggleExpandedHandler(),
          }),
          nameElement,
        ]
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => h("div", { class: "text-right" }, "金額 (新台幣)"),
    cell: ({ row }: any) => {
      // Use computed amount (sum of children) for parent rows
      const amount = row.original.computedAmount ?? row.original.amount;
      const hasChildren =
        row.original.subRows && row.original.subRows.length > 0;
      const isParent = hasChildren;

      const amountClasses = [
        "text-right font-mono",
        amount < 0 ? "text-red-600" : "text-gray-900",
        // Parent rows (with children) are bold like totals
        isParent ? "font-bold" : "",
        row.depth === 1 && isParent ? "font-semibold" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return h("div", { class: amountClasses }, formatAmount(amount));
    },
  },
];

const handleExport = () => {
  // TODO: Implement export functionality
  console.log("Export Balance Sheet");
};
</script>
