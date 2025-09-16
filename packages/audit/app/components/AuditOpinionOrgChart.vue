<template>
  <UCard>
    <template #header>
      <div class="space-y-2">
        <h3 class="text-xl font-bold text-gray-900">查核意見選擇</h3>
        <div class="text-sm text-gray-500">請選擇適當的查核意見類型</div>
      </div>
    </template>

    <OrganizationChart
      v-model:selection-keys="selectionKeys"
      :value="opinionOrgChartData"
      selection-mode="single"
      @update:selection-keys="onUpdateSelectionKeys"
      class="w-full"
    >
      <template #default="{ node }">
        <div
          :class="
            cn(
              'px-3 py-1 text-xs font-semibold text-md',
              getOpinionTypeLabelClass(node.data.opinionType)
            )
          "
        >
          {{ getOpinionTypeLabel(node.data.opinionType) }}
        </div>
        <p class="text-xs text-gray-700 leading-relaxed">
          {{ node.data.description }}
        </p>
      </template>
    </OrganizationChart>

    <!-- Legend -->
    <template #footer>
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="text-sm font-semibold text-gray-900 mb-4 flex items-center">
          <Icon name="i-lucide-info" class="w-4 h-4 mr-2" />
          圖例說明
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div class="flex items-center space-x-3">
            <div
              class="w-4 h-4 bg-green-100 border-2 border-green-400 rounded-full flex items-center justify-center"
            >
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <span class="text-gray-700">無保留意見</span>
          </div>
          <div class="flex items-center space-x-3">
            <div
              class="w-4 h-4 bg-amber-100 border-2 border-amber-400 rounded-full flex items-center justify-center"
            >
              <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
            </div>
            <span class="text-gray-700">保留意見</span>
          </div>
          <div class="flex items-center space-x-3">
            <div
              class="w-4 h-4 bg-red-100 border-2 border-red-400 rounded-full flex items-center justify-center"
            >
              <div class="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <span class="text-gray-700">否定意見</span>
          </div>
          <div class="flex items-center space-x-3">
            <div
              class="w-4 h-4 bg-gray-100 border-2 border-gray-400 rounded-full flex items-center justify-center"
            >
              <div class="w-2 h-2 bg-gray-500 rounded-full"></div>
            </div>
            <span class="text-gray-700">無法表示意見</span>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-gray-200">
          <div class="flex items-center text-xs text-gray-500">
            <Icon name="i-lucide-arrow-down" class="w-3 h-3 mr-2" />
            <span>嚴重程度遞增</span>
          </div>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import OrganizationChart, {
  type OrganizationChartNode,
} from "primevue/organizationchart";

interface OpinionNodeData {
  opinionType: OpinionType;
  description: string;
  reason?: string;
  branchType?: "errors" | "evidence";
}

type OpinionNodeKey =
  | "unqualified"
  | "qualified-branch-1"
  | "qualified-branch-2"
  | "adverse"
  | "disclaimer";

interface OpinionNode {
  key: OpinionNodeKey;
  styleClass?: string;
  selectable: boolean;
  data: OpinionNodeData;
  children?: OpinionNode[];
}

const emit = defineEmits<{
  opinionSelected: [opinionType: OpinionType];
}>();

const store = useAuditBuilderStore();

const { opinionInfo } = storeToRefs(store);

const selectionKeys = ref<Record<string, boolean>>({});

const selectedKey = computed(() => {
  const keys = Object.keys(selectionKeys.value);
  if (keys.length === 0) {
    return null;
  }
  return Object.keys(selectionKeys.value)[0] as OpinionNodeKey;
});

const nodeBaseClass =
  "group space-y-2 p-4 bg-neutral-50 hover:scale-105 transition-all duration-200";

const opinionOrgChartData = computed<OpinionNode>(
  () =>
    ({
      key: "unqualified",
      styleClass: cn(
        nodeBaseClass,
        selectedKey.value === "unqualified"
          ? "bg-green-200 hover:bg-green-300"
          : "hover:bg-green-100"
      ),
      selectable: true,
      data: {
        opinionType: "unqualified",
        description: "財務報表在所有重大方面均依照適用之財務報導架構編製",
      },
      children: [
        {
          key: "qualified-branch-1",
          styleClass: cn(
            nodeBaseClass,
            selectedKey.value === "qualified-branch-1"
              ? "bg-amber-200 hover:bg-amber-300"
              : "hover:bg-amber-100"
          ),
          selectable: true,
          data: {
            opinionType: "qualified",
            description: "除特定事項外，財務報表在所有重大方面均適當表達",
            reason: "財務報表有錯誤但不足以構成否定意見",
            branchType: "errors",
          },
          children: [
            {
              key: "adverse",
              styleClass: cn(
                nodeBaseClass,
                selectedKey.value === "adverse"
                  ? "bg-red-200 hover:bg-red-300"
                  : "hover:bg-red-100"
              ),
              selectable: true,
              data: {
                opinionType: "adverse",
                description: "財務報表整體而言並未適當表達",
                reason: "錯誤過於重大且廣泛",
              },
            },
          ],
        },
        {
          key: "qualified-branch-2",
          styleClass: cn(
            nodeBaseClass,
            selectedKey.value === "qualified-branch-2"
              ? "bg-amber-200 hover:bg-amber-300"
              : "hover:bg-amber-100"
          ),
          selectable: true,
          data: {
            opinionType: "qualified",
            description: "除特定事項外，財務報表在所有重大方面均適當表達",
            reason: "查核證據不足但不足以構成無法表示意見",
            branchType: "evidence",
          },
          children: [
            {
              key: "disclaimer",
              styleClass: cn(
                nodeBaseClass,
                selectedKey.value === "disclaimer"
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "hover:bg-gray-100"
              ),
              selectable: true,
              data: {
                opinionType: "disclaimer",
                description: "無法取得充分適切之查核證據作為查核意見之基礎",
                reason: "查核範圍限制過於重大且廣泛",
              },
            },
          ],
        },
      ],
    }) as const satisfies OrganizationChartNode
);

const onUpdateSelectionKeys = (newSelectionKeys: Record<string, boolean>) => {
  const keys = Object.keys(newSelectionKeys);
  if (keys.length === 0) {
    return;
  }
  opinionInfo.value.opinionType = keys[0] as OpinionType;
};

const getOpinionTypeLabelClass = (opinionType: OpinionType) => {
  switch (opinionType) {
    case "unqualified":
      return "text-green-800";
    case "qualified":
      return "text-amber-800";
    case "adverse":
      return "text-red-800";
    case "disclaimer":
      return "text-gray-800";
    default:
      return "text-gray-800";
  }
};
</script>
