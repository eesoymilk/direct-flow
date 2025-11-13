<template>
  <div class="flex gap-4 md:gap-8 items-start">
    <!-- Left Panel: Forms and Configurations -->
    <div class="space-y-6 flex-1">
      <BuilderBasicInfo />
      <BuilderOpinionSelection />
    </div>

    <!-- Right Panel: Preview -->
    <BuilderPreview />
  </div>
</template>