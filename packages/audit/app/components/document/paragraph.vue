<template>
  <component
    :is="getParagraphComponent(paragraph.heading)"
    :class="
      getParagraphComponentClass(
        paragraph.heading,
        paragraph.alignment,
        paragraph.numbering
      )
    "
  >
    <DocumentParagraphText
      v-if="paragraph.type === 'children'"
      :list-item-index="listItemIndex"
      :children="paragraph.children"
    />
    <p v-if="paragraph.type === 'text'">
      <span v-if="listItemIndex > 0"> {{ listItemIndex }}. </span>
      <span>{{ paragraph.text }}</span>
    </p>
  </component>
</template>

<script setup lang="ts">
import type { HeadingLevel, AlignmentType } from "#shared/types/document";

interface Props {
  paragraph: DocumentParagraph;
  index: number;
  orderedListInfo: {
    index: number;
    numbering: {
      reference: string;
      level: number;
    };
  }[];
}
const props = defineProps<Props>();

const paragraphComponentMap = {
  title: "h1",
  heading_1: "h1",
  heading_2: "h2",
  heading_3: "h3",
  heading_4: "h4",
  heading_5: "h5",
  heading_6: "h6",
} as const;

const paragraphTextClassMap = {
  title: "text-2xl font-bold",
  heading_1: "text-2xl font-bold",
  heading_2: "text-xl font-bold",
  heading_3: "text-lg font-bold",
  heading_4: "text-base font-bold",
  heading_5: "text-sm font-bold",
  heading_6: "text-xs font-bold",
} as const;

const paragraphAlignmentClassMap = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
  both: "text-both",
  left: "text-left",
  right: "text-right",
} as const;

const getParagraphNumberingClass = (level: number) => {
  switch (level) {
    case 0:
      return "pl-4";
    case 1:
      return "pl-8";
    case 2:
      return "pl-12";
  }
};

const getParagraphComponent = (heading?: HeadingLevel) =>
  heading ? paragraphComponentMap[heading] : "div";

const getParagraphComponentClass = (
  heading?: HeadingLevel,
  alignment?: AlignmentType,
  numbering?: {
    reference: string;
    level: number;
  }
) => {
  const textClass = heading ? paragraphTextClassMap[heading] : "text-sm";
  const alignmentClass = alignment ? paragraphAlignmentClassMap[alignment] : "";
  const numberingClass = numbering
    ? getParagraphNumberingClass(numbering.level)
    : "";
  return cn(textClass, alignmentClass, numberingClass);
};

const listItemIndex = computed(() => {
  return (
    props.orderedListInfo.findIndex((info) => info.index === props.index) + 1
  );
});
</script>
