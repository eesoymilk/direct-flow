import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { OpinionType } from '~/shared/types/audit-report'

// Create a mock store implementation
class MockAuditBuilderStore {
  selectedOpinion: OpinionType | null = null
  selectOpinion = vi.fn((opinionType: OpinionType) => {
    this.selectedOpinion = opinionType
  })

  opinionTypes = [
    {
      type: 'unqualified' as OpinionType,
      title: '無保留意見',
      description: '財務報表在所有重大方面均依照適用之財務報導架構編製',
      tags: ['標準意見', '無修正']
    },
    {
      type: 'qualified' as OpinionType,
      title: '保留意見',
      description: '除特定事項外，財務報表在所有重大方面均適當表達',
      tags: ['修正意見', '部分限制']
    },
    {
      type: 'adverse' as OpinionType,
      title: '否定意見',
      description: '財務報表整體而言並未適當表達',
      tags: ['修正意見', '重大違反']
    },
    {
      type: 'disclaimer' as OpinionType,
      title: '無法表示意見',
      description: '無法取得充分適切之查核證據作為查核意見之基礎',
      tags: ['修正意見', '查核範圍限制']
    }
  ]
}

const mockStore = new MockAuditBuilderStore()

// Mock the useAuditBuilderStore composable
vi.mock('~/app/composables/stores/auditBuilder', () => ({
  useAuditBuilderStore: () => mockStore
}))

describe('AuditOpinionOrgChart Integration Tests', () => {
  beforeEach(() => {
    mockStore.selectedOpinion = null
    mockStore.selectOpinion.mockClear()
  })

  describe('Opinion Selection Logic', () => {
    it('should update store when opinion is selected', async () => {
      const wrapper = await mountSuspended(await import('~/app/components/AuditOpinionOrgChart.vue'))
      const vm = wrapper.vm as any

      // Test selection of unqualified opinion
      vm.selectOpinion('unqualified')
      expect(mockStore.selectOpinion).toHaveBeenCalledWith('unqualified')
      expect(mockStore.selectedOpinion).toBe('unqualified')

      // Test selection of qualified opinion
      mockStore.selectOpinion.mockClear()
      vm.selectOpinion('qualified')
      expect(mockStore.selectOpinion).toHaveBeenCalledWith('qualified')
      expect(mockStore.selectedOpinion).toBe('qualified')
    })

    it('should emit opinionSelected event with correct payload', () => {
      const wrapper = mount(AuditOpinionOrgChart)
      const vm = wrapper.vm as any

      vm.selectOpinion('adverse')

      expect(wrapper.emitted('opinionSelected')).toBeTruthy()
      expect(wrapper.emitted('opinionSelected')?.[0]).toEqual(['adverse'])
    })

    it('should correctly identify selected nodes', () => {
      mockStore.selectedOpinion = 'disclaimer'
      const wrapper = mount(AuditOpinionOrgChart)
      const vm = wrapper.vm as any

      const selectedNode = { data: { opinionType: 'disclaimer' } }
      const unselectedNode = { data: { opinionType: 'unqualified' } }

      expect(vm.isSelected(selectedNode)).toBe(true)
      expect(vm.isSelected(unselectedNode)).toBe(false)
    })
  })

  describe('Organization Chart Data Structure', () => {
    it('should have correct hierarchical structure representing audit opinion relationships', () => {
      const wrapper = mount(AuditOpinionOrgChart)
      const vm = wrapper.vm as any
      const data = vm.orgChartData

      // Root should be unqualified opinion
      expect(data.key).toBe('unqualified')
      expect(data.data.opinionType).toBe('unqualified')
      expect(data.data.severity).toBe('標準')

      // Should have two qualified opinion branches
      expect(data.children).toHaveLength(2)

      const [errorsBranch, evidenceBranch] = data.children

      // Errors branch (leads to adverse opinion)
      expect(errorsBranch.key).toBe('qualified-branch-1')
      expect(errorsBranch.data.opinionType).toBe('qualified')
      expect(errorsBranch.data.branchType).toBe('errors')
      expect(errorsBranch.children).toHaveLength(1)
      expect(errorsBranch.children[0].key).toBe('adverse')
      expect(errorsBranch.children[0].data.opinionType).toBe('adverse')

      // Evidence branch (leads to disclaimer)
      expect(evidenceBranch.key).toBe('qualified-branch-2')
      expect(evidenceBranch.data.opinionType).toBe('qualified')
      expect(evidenceBranch.data.branchType).toBe('evidence')
      expect(evidenceBranch.children).toHaveLength(1)
      expect(evidenceBranch.children[0].key).toBe('disclaimer')
      expect(evidenceBranch.children[0].data.opinionType).toBe('disclaimer')
    })

    it('should have all nodes marked as selectable', () => {
      const wrapper = mount(AuditOpinionOrgChart)
      const vm = wrapper.vm as any
      const data = vm.orgChartData

      // Check all nodes are selectable
      const checkSelectableRecursively = (node: any) => {
        expect(node.data.isSelectable).toBe(true)
        if (node.children) {
          node.children.forEach(checkSelectableRecursively)
        }
      }

      checkSelectableRecursively(data)
    })

    it('should have appropriate qualification reasons for each branch', () => {
      const wrapper = mount(AuditOpinionOrgChart)
      const vm = wrapper.vm as any
      const data = vm.orgChartData

      const [errorsBranch, evidenceBranch] = data.children

      // Errors branch qualification reasons
      expect(errorsBranch.data.qualificationReason).toBe('財務報表有錯誤但不足以構成否定意見')
      expect(errorsBranch.children[0].data.qualificationReason).toBe('錯誤過於重大且廣泛')

      // Evidence branch qualification reasons
      expect(evidenceBranch.data.qualificationReason).toBe('查核證據不足但不足以構成無法表示意見')
      expect(evidenceBranch.children[0].data.qualificationReason).toBe('查核範圍限制過於重大且廣泛')
    })
  })

  describe('Styling and Visual Feedback', () => {
    it('should apply severity-based styling correctly', () => {
      const wrapper = mount(AuditOpinionOrgChart)
      const vm = wrapper.vm as any

      // Test different severity levels
      const standardNode = { data: { severity: '標準' } }
      const minorNode = { data: { severity: '輕微' } }
      const severeNode = { data: { severity: '嚴重' } }

      expect(vm.getNodeClass(standardNode)).toContain('bg-green-50 border-green-200')
      expect(vm.getNodeClass(minorNode)).toContain('bg-amber-50 border-amber-200')
      expect(vm.getNodeClass(severeNode)).toContain('bg-red-50 border-red-200')
    })

    it('should add selection ring when node is selected', () => {
      mockStore.selectedOpinion = 'adverse'
      const wrapper = mount(AuditOpinionOrgChart)
      const vm = wrapper.vm as any

      const selectedNode = { data: { opinionType: 'adverse', severity: '嚴重' } }
      const nodeClass = vm.getNodeClass(selectedNode)

      expect(nodeClass).toContain('ring-2 ring-blue-500 ring-offset-2')
    })

    it('should provide correct badge styling for severity levels', () => {
      const wrapper = mount(AuditOpinionOrgChart)
      const vm = wrapper.vm as any

      const standardNode = { data: { severity: '標準' } }
      const minorNode = { data: { severity: '輕微' } }
      const severeNode = { data: { severity: '嚴重' } }

      expect(vm.getBadgeClass(standardNode)).toContain('bg-green-100 text-green-800')
      expect(vm.getBadgeClass(minorNode)).toContain('bg-amber-100 text-amber-800')
      expect(vm.getBadgeClass(severeNode)).toContain('bg-red-100 text-red-800')
    })
  })

  describe('Node Key Mapping', () => {
    it('should correctly map opinion types to node keys for visual selection', () => {
      const wrapper = mount(AuditOpinionOrgChart)
      const vm = wrapper.vm as any

      expect(vm.getNodeKeyByOpinion('unqualified')).toBe('unqualified')
      expect(vm.getNodeKeyByOpinion('qualified')).toBe('qualified-branch-1')
      expect(vm.getNodeKeyByOpinion('adverse')).toBe('adverse')
      expect(vm.getNodeKeyByOpinion('disclaimer')).toBe('disclaimer')
    })
  })

  describe('Label Display Logic', () => {
    it('should simplify qualified opinion branch labels for display', () => {
      const wrapper = mount(AuditOpinionOrgChart)
      const vm = wrapper.vm as any

      const errorsBranchNode = {
        label: '保留意見 (錯誤分支)',
        data: { opinionType: 'qualified', branchType: 'errors' }
      }

      const evidenceBranchNode = {
        label: '保留意見 (證據分支)',
        data: { opinionType: 'qualified', branchType: 'evidence' }
      }

      const regularNode = {
        label: '無保留意見',
        data: { opinionType: 'unqualified' }
      }

      // Both qualified branches should display as "保留意見"
      expect(vm.getDisplayLabel(errorsBranchNode)).toBe('保留意見')
      expect(vm.getDisplayLabel(evidenceBranchNode)).toBe('保留意見')
      expect(vm.getDisplayLabel(regularNode)).toBe('無保留意見')
    })
  })

  describe('Real-world Usage Scenarios', () => {
    it('should handle complete opinion selection workflow', () => {
      const wrapper = mount(AuditOpinionOrgChart)
      const vm = wrapper.vm as any

      // Simulate user clicking through different opinions
      const opinionSequence: OpinionType[] = ['unqualified', 'qualified', 'adverse', 'disclaimer']

      opinionSequence.forEach((opinion, index) => {
        vm.selectOpinion(opinion)

        expect(mockStore.selectOpinion).toHaveBeenNthCalledWith(index + 1, opinion)
        expect(wrapper.emitted('opinionSelected')?.[index]).toEqual([opinion])
        expect(mockStore.selectedOpinion).toBe(opinion)
      })
    })

    it('should maintain selection state when re-selecting same option', () => {
      const wrapper = mount(AuditOpinionOrgChart)
      const vm = wrapper.vm as any

      // Select same option multiple times
      vm.selectOpinion('qualified')
      vm.selectOpinion('qualified')
      vm.selectOpinion('qualified')

      expect(mockStore.selectOpinion).toHaveBeenCalledTimes(3)
      expect(mockStore.selectedOpinion).toBe('qualified')
      expect(wrapper.emitted('opinionSelected')).toHaveLength(3)
    })
  })
})