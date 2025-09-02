<template>
  <div v-if="application" class="space-y-6">
    <!-- Basic Application Info -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Application Overview</h2>
      </template>
      
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-600">Application ID:</label>
          <p class="text-lg">{{ application.id }}</p>
        </div>
        
        <div>
          <label class="text-sm font-medium text-gray-600">Company Names:</label>
          <div class="flex flex-wrap gap-2 mt-1">
            <UBadge 
              v-for="(name, index) in application.candidateNames" 
              :key="index"
              :label="name"
              color="primary"
            />
          </div>
        </div>
        
        <div>
          <label class="text-sm font-medium text-gray-600">Status:</label>
          <UBadge 
            :label="application.status"
            :color="getStatusColor(application.status)"
          />
        </div>
        
        <div>
          <label class="text-sm font-medium text-gray-600">Responsible Person:</label>
          <p class="text-lg">{{ application.responsiblePerson?.name || 'Not provided' }}</p>
        </div>
      </div>
    </UCard>
    
    <!-- Review Status -->
    <UCard v-if="hasReviewData">
      <template #header>
        <h3 class="text-lg font-semibold">Review Status</h3>
      </template>
      
      <div class="space-y-4">
        <div>
          <p class="text-sm text-gray-600">Issues: {{ reviewProgress.totalIssues }}</p>
          <p class="text-sm text-gray-600">Verifications: {{ reviewProgress.totalVerifications }}</p>
          <p class="text-sm text-gray-600">Critical Issues: {{ reviewProgress.criticalIssues }}</p>
        </div>
        
        <div v-if="reviewOverlay.issues.length > 0">
          <h4 class="font-medium mb-2">Issues Found:</h4>
          <div class="space-y-2">
            <div v-for="issue in reviewOverlay.issues" :key="issue.fieldPath" 
                 class="p-2 bg-red-50 rounded text-sm">
              <span class="font-medium">{{ issue.fieldPath }}:</span>
              <span class="text-red-600">{{ issue.severity }} - {{ issue.issueType }}</span>
            </div>
          </div>
        </div>
      </div>
    </UCard>
    
    <!-- Simple Actions -->
    <UCard>
      <div class="flex gap-4">
        <UButton color="green" @click="testVerify">Test Verify</UButton>
        <UButton color="red" @click="testFlag">Test Flag Issue</UButton>
        <UButton color="blue" @click="logData">Log Data</UButton>
      </div>
    </UCard>
  </div>
  
  <div v-else>
    <p>No application data</p>
  </div>
</template>

<script setup lang="ts">
import { getStatusColor } from "~/utils/labels";

interface Props {
  application: any;
}

const props = defineProps<Props>();

// Test if review overlay works
const hasReviewData = computed(() => {
  return props.application?.reviewRounds && props.application.reviewRounds.length > 0;
});

// Only use review overlay if we have review data
const reviewData = hasReviewData.value ? useReviewOverlay(props.application) : null;
const reviewOverlay = computed(() => reviewData?.reviewOverlay.value || { issues: [], verifications: [] });
const reviewProgress = computed(() => reviewData?.reviewProgress.value || { 
  totalIssues: 0, 
  totalVerifications: 0, 
  criticalIssues: 0 
});

const testVerify = () => {
  console.log('Test verify clicked');
};

const testFlag = () => {
  console.log('Test flag clicked');
};

const logData = () => {
  console.log('Application:', props.application);
  console.log('Review Overlay:', reviewOverlay.value);
  console.log('Review Progress:', reviewProgress.value);
};
</script>