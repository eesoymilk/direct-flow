<template>
  <div
    class="bg-white min-h-[600px] leading-[1.8] font-serif text-sm space-y-4"
  >
    <!-- TODO: add custom spacing between sections and paragraphs -->
    <div v-for="section in sections" :key="section.id" class="space-y-2">
      <DocumentParagraph
        v-for="(paragraph, index) in section.children"
        :key="index"
        :index="index"
        :ordered-list-info="getOrderedListInfo(section)"
        :paragraph="paragraph"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  sections: DocumentSection[];
  documentSize: "A4" | "Letter";
}
defineProps<Props>();

const getOrderedListInfo = (section: DocumentSection) =>
  section.children
    .map((paragraph, index) => ({
      index: index,
      numbering: paragraph.numbering,
    }))
    .filter(
      (
        paragraph
      ): paragraph is {
        index: number;
        numbering: { reference: "ol"; level: number };
      } =>
        paragraph.numbering !== undefined &&
        paragraph.numbering.reference === "ol"
    );
</script>
