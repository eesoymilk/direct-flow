<template>
  <!-- Company Candidate Names -->
  <CompanyApplicationReviewEntry entry-path="company.candidateNames">
    <FormedInputTags
      :initial-value="
        reviewStore.getEntryByPath('company.candidateNames')?.value as string[]
      "
      placeholder="請輸入公司預查名稱"
      @submit="
        (value) => reviewStore.editEntry('company.candidateNames', value)
      "
    />
  </CompanyApplicationReviewEntry>

  <!-- Company Chosen Name -->
  <CompanyApplicationReviewEntry entry-path="company.chosenName" ignorable>
    <FormedInput
      :initial-value="
        reviewStore.getEntryByPath('company.chosenName')?.value as string
      "
      placeholder="請輸入公司選定名稱"
      @submit="(value) => reviewStore.editEntry('company.chosenName', value)"
    />
  </CompanyApplicationReviewEntry>

  <!-- Organization Type -->
  <CompanyApplicationReviewEntry entry-path="company.organizationType">
    <FormedRadioGroup
      :initial-value="
        reviewStore.getEntryByPath('company.organizationType')?.value as string
      "
      :radio-group-items="organizationTypeItems"
      @submit="
        (value) => reviewStore.editEntry('company.organizationType', value)
      "
    />
  </CompanyApplicationReviewEntry>

  <!-- Company Address -->
  <CompanyApplicationReviewEntry entry-path="company.address">
    <FormedInput
      :initial-value="
        reviewStore.getEntryByPath('company.address')?.value as string
      "
      placeholder="請輸入公司地址"
      @submit="(value) => reviewStore.editEntry('company.address', value)"
    />
  </CompanyApplicationReviewEntry>

  <!-- Business Items Description -->
  <CompanyApplicationReviewEntry entry-path="company.businessItemsDescription">
    <FormedInput
      :initial-value="
        reviewStore.getEntryByPath('company.businessItemsDescription')
          ?.value as string
      "
      placeholder="請輸入營業項目描述"
      @submit="
        (value) =>
          reviewStore.editEntry('company.businessItemsDescription', value)
      "
    />
  </CompanyApplicationReviewEntry>

  <!-- Business Items -->
  <CompanyApplicationReviewEntry entry-path="company.businessItems" ignorable>
    <FormedInputTags
      :initial-value="
        reviewStore.getEntryByPath('company.businessItems')?.value as string[]
      "
      placeholder="請輸入營業項目"
      @submit="(value) => reviewStore.editEntry('company.businessItems', value)"
    />
  </CompanyApplicationReviewEntry>
</template>

<script setup lang="ts">
import { organizationTypeItems } from "../helpers";

const reviewStore = useCompanyApplicationReviewStore();
</script>
