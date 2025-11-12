<template>
  <OrganizationChart
    v-model:selection-keys="selectionKeys"
    :value="opinionOrgChartData"
    selection-mode="single"
    class="w-full"
    @update:selection-keys="onUpdateSelectionKeys"
  >
    <template #default="{ node }">
      <div
        :class="
          cn(
            'px-3 py-1 text-xs font-semibold text-md',
            getOpinionTypeLabelClass(node.key)
          )
        "
      >
        {{ getOpinionTypeLabel(node.key) }}
      </div>
      <!-- We don't need to show the description for unqualified -->
      <p
        v-if="node.key != 'unqualified'"
        class="text-xs text-gray-700 leading-relaxed"
      >
        {{ getOpinionTypeDescription(node.key) }}
      </p>
    </template>
  </OrganizationChart>
</template>

<script setup lang="ts">
import OrganizationChart, {
  type OrganizationChartNode,
} from "primevue/organizationchart";

interface OpinionNode {
  key: OpinionType;
  styleClass?: string;
  selectable: boolean;
  children?: OpinionNode[];
}

const props = defineProps<{
  /** Opinion mode: 'current' for current year in dual mode, 'comparative' for comparative year, undefined for single mode */
  yearMode?: 'current' | 'comparative';
}>();

const store = useOpinionBuilderStore();
const { opinionInfo } = storeToRefs(store);

const selectionKeys = ref<Record<string, boolean>>({});
const selectedKey = computed(() => {
  const keys = Object.keys(selectionKeys.value);
  if (keys.length === 0) {
    return null;
  }
  return Object.keys(selectionKeys.value)[0] as OpinionType;
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
      children: [
        {
          key: "qualifiedAdverse",
          styleClass: cn(
            nodeBaseClass,
            selectedKey.value === "qualifiedAdverse"
              ? "bg-amber-200 hover:bg-amber-300"
              : "hover:bg-amber-100"
          ),
          selectable: true,
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
            },
          ],
        },
        {
          key: "qualifiedDisclaimer",
          styleClass: cn(
            nodeBaseClass,
            selectedKey.value === "qualifiedDisclaimer"
              ? "bg-amber-200 hover:bg-amber-300"
              : "hover:bg-amber-100"
          ),
          selectable: true,
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
            },
          ],
        },
      ],
    }) as const satisfies OrganizationChartNode
);

const onUpdateSelectionKeys = (newSelectionKeys: Record<string, boolean>) => {
  console.log("newSelectionKeys", newSelectionKeys);
  const keys = Object.keys(newSelectionKeys);
  if (keys.length === 0) {
    return;
  }

  const selectedOpinionType = keys[0] as OpinionType;

  // Update the appropriate opinion based on mode
  if (opinionInfo.value.mode === 'single') {
    opinionInfo.value = {
      ...opinionInfo.value,
      opinion: {
        ...opinionInfo.value.opinion,
        opinionType: selectedOpinionType,
      },
    };
  } else if (opinionInfo.value.mode === 'dual') {
    if (props.yearMode === 'current') {
      opinionInfo.value = {
        ...opinionInfo.value,
        currentYearOpinion: {
          ...opinionInfo.value.currentYearOpinion,
          opinionType: selectedOpinionType,
        },
      };
    } else if (props.yearMode === 'comparative') {
      opinionInfo.value = {
        ...opinionInfo.value,
        comparativeYearOpinion: {
          ...opinionInfo.value.comparativeYearOpinion,
          opinionType: selectedOpinionType,
        },
      };
    }
  }
};

const getOpinionTypeLabelClass = (opinionType: OpinionType) => {
  switch (opinionType) {
    case "unqualified":
      return "text-green-800";
    case "qualifiedDisclaimer":
    case "qualifiedAdverse":
      return "text-amber-800";
    case "adverse":
      return "text-red-800";
    case "disclaimer":
      return "text-gray-800";
    default:
      return "text-gray-800";
  }
};

// Watch for opinion changes and update selection
watch(
  () => {
    if (opinionInfo.value.mode === 'single') {
      return opinionInfo.value.opinion.opinionType;
    } else if (opinionInfo.value.mode === 'dual') {
      if (props.yearMode === 'current') {
        return opinionInfo.value.currentYearOpinion.opinionType;
      } else if (props.yearMode === 'comparative') {
        return opinionInfo.value.comparativeYearOpinion.opinionType;
      }
    }
    return undefined;
  },
  (newType) => {
    if (newType) {
      selectionKeys.value = { [newType]: true };
    } else {
      selectionKeys.value = {};
    }
  },
  { immediate: true }
);
</script>
