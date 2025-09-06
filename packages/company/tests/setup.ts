import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Global test setup and mocks

// Mock Vue composables
const ref = vi.fn((val) => ({ value: val }))
const computed = vi.fn((fn) => ({ value: fn() }))
const readonly = vi.fn((obj) => obj)

// Mock Nuxt composables
vi.mock('#app', () => ({
  navigateTo: vi.fn(),
  useRoute: vi.fn(() => ({
    query: {},
    params: {},
    path: '/',
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
  useTemplateRef: vi.fn(() => ref(null)),
  computed,
  ref,
  reactive: vi.fn((obj) => obj),
  readonly,
  watch: vi.fn(),
  watchEffect: vi.fn(),
  onMounted: vi.fn(),
  onUnmounted: vi.fn(),
  nextTick: vi.fn(() => Promise.resolve()),
  definePageMeta: vi.fn(),
  defineNuxtPlugin: vi.fn(),
  $fetch: vi.fn(),
  process: {
    env: {
      NODE_ENV: 'test',
    },
  },
}))

// Mock Nuxt UI composables
vi.mock('@nuxt/ui', () => ({
  useToast: vi.fn(() => ({
    add: vi.fn(),
  })),
  useColorMode: vi.fn(() => ({
    value: 'light',
    preference: 'light',
  })),
}))

// Mock Pinia
vi.mock('pinia', () => ({
  createPinia: vi.fn(() => ({})),
  setActivePinia: vi.fn(),
  defineStore: vi.fn((id, fn) => fn),
}))

// Mock VueUse
vi.mock('@vueuse/core', () => ({
  useLocalStorage: vi.fn(() => ref(null)),
  useSessionStorage: vi.fn(() => ref(null)),
  useStorage: vi.fn(() => ref(null)),
  useDebounceFn: vi.fn((fn) => fn),
  useThrottleFn: vi.fn((fn) => fn),
}))

// Export the mocked functions for use in tests
export { ref, computed, readonly }

// Mock date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date, formatStr) => {
    if (date instanceof Date) {
      return date.toLocaleDateString()
    }
    return '2024/01/01 00:00'
  }),
  parseISO: vi.fn((dateString) => new Date(dateString)),
  isValid: vi.fn(() => true),
}))

// Mock @internationalized/date
vi.mock('@internationalized/date', () => ({
  CalendarDate: vi.fn((year, month, day) => ({
    year,
    month,
    day,
    toString: () => `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
  })),
}))

// Global test utilities
export const createMockForm = () => ({
  candidateNames: ['測試公司股份有限公司'],
  organizationType: 'company_limited',
  isCloselyHeld: false,
  hasParValueFreeShares: false,
  businessItemsDescription: '軟體開發與資訊服務',
  capitalAmount: 1000000,
  parValue: 10,
  totalShares: 100000,
  authorizedShares: 100000,
  ordinaryShares: 100000,
  preferredShares: 0,
  address: '台北市信義區信義路五段7號',
  isDirectorSameAsResponsiblePerson: false,
  isContactPersonSameAsResponsiblePerson: false,
  isContactPersonSameAsDirector: false,
  responsiblePerson: {
    name: '王小明',
    idNumber: 'A123456789',
    address: '台北市信義區信義路五段7號',
    telephone: '02-12345678',
    cellphone: '0912345678',
    email: 'test@example.com',
    dateOfBirth: new Date('1990-01-01'),
  },
  director: {
    name: '李小華',
    idNumber: 'B987654321',
    address: '台北市信義區信義路五段8號',
    telephone: '02-87654321',
    cellphone: '0987654321',
    email: 'director@example.com',
    dateOfBirth: new Date('1985-05-15'),
  },
  contactPerson: {
    name: '張小美',
    idNumber: 'C111222333',
    address: '台北市信義區信義路五段9號',
    telephone: '02-11111111',
    cellphone: '0911111111',
    email: 'contact@example.com',
    dateOfBirth: new Date('1992-03-20'),
  },
  shareholders: [],
})

export const createMockStore = (overrides = {}) => ({
  form: createMockForm(),
  submissionState: {
    justSubmitted: false,
    applicationId: null,
    submissionTime: null,
  },
  isStockCompany: true,
  addShareholder: vi.fn(),
  addPersonAsShareholder: vi.fn(),
  removeShareholder: vi.fn(),
  resetForm: vi.fn(),
  markSubmissionSuccess: vi.fn(),
  markSuccessViewed: vi.fn(),
  populateWithMockData: vi.fn(),
  populateWithOrgTypeTestData: vi.fn(),
  ...overrides,
})

export const createMockToast = () => ({
  add: vi.fn(),
})

export const createMockNavigation = () => ({
  navigateTo: vi.fn(),
  useRoute: vi.fn(() => ({
    query: {},
    params: {},
    path: '/',
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
})
