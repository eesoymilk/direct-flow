<template>
  <h1 class="text-2xl font-bold" v-if="paragraph.heading === 'heading_1'">
    <DocumentParagraphText
      v-if="paragraph.type === 'children'"
      :children="paragraph.children"
    />
    <p v-if="paragraph.type === 'text'">{{ paragraph.text }}</p>
  </h1>
  <h2 class="text-xl font-bold" v-else-if="paragraph.heading === 'heading_2'">
    <DocumentParagraphText
      v-if="paragraph.type === 'children'"
      :children="paragraph.children"
    />
    <p v-if="paragraph.type === 'text'">{{ paragraph.text }}</p>
  </h2>
  <h3 class="text-lg font-bold" v-else-if="paragraph.heading === 'heading_3'">
    <DocumentParagraphText
      v-if="paragraph.type === 'children'"
      :children="paragraph.children"
    />
    <p v-if="paragraph.type === 'text'">{{ paragraph.text }}</p>
  </h3>
  <h4 class="text-base font-bold" v-else-if="paragraph.heading === 'heading_4'">
    <DocumentParagraphText
      v-if="paragraph.type === 'children'"
      :children="paragraph.children"
    />
    <p v-if="paragraph.type === 'text'">{{ paragraph.text }}</p>
  </h4>
  <h5 class="text-sm font-bold" v-else-if="paragraph.heading === 'heading_5'">
    <DocumentParagraphText
      v-if="paragraph.type === 'children'"
      :children="paragraph.children"
    />
    <p v-if="paragraph.type === 'text'">{{ paragraph.text }}</p>
  </h5>
  <h6 class="text-xs font-bold" v-else-if="paragraph.heading === 'heading_6'">
    <DocumentParagraphText
      v-if="paragraph.type === 'children'"
      :children="paragraph.children"
    />
    <p v-if="paragraph.type === 'text'">{{ paragraph.text }}</p>
  </h6>
  <div v-else>
    <DocumentParagraphText
      v-if="paragraph.type === 'children'"
      :children="paragraph.children"
    />
    <p v-if="paragraph.type === 'text'">{{ paragraph.text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  paragraph: DocumentParagraph;
}
defineProps<Props>();
</script>
