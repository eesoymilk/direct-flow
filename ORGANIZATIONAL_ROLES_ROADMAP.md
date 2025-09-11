# Organizational Roles Roadmap

## Current State Analysis

### Person Types Currently Used
The system currently uses three standardized person types across all organization types:
- **responsiblePerson** (負責人) - Currently required for all organization types
- **representative** (代表人) - Currently required for all organization types  
- **contactPerson** (聯絡人) - Currently required for all organization types

### Current Implementation
All organization types (corporation, limited_company, sole_proprietorship, partnership) use the same three person roles with identical validation rules.

## Requested Changes

### 股份有限公司 (Corporation) Specific Roles
Client has requested that corporations use different organizational roles:
- **董事長** (Chairman of the Board)
- **董事** (Director) 
- **監察人** (Supervisor)

### Outstanding Questions for Client Clarification

#### 1. Role Mapping and Requirements
- [ ] **Question**: Should 董事長, 董事, 監察人 replace responsiblePerson, representative, contactPerson respectively?
- [ ] **Question**: Are all three roles required for corporations, or are some optional?
- [ ] **Question**: Can the same person hold multiple roles (e.g., Chairman + Director)?
- [ ] **Question**: Are there minimum/maximum counts for each role type (e.g., minimum 3 directors)?

#### 2. Other Organization Types Impact
- [ ] **Question**: Should limited companies (有限公司) also get different roles?
- [ ] **Question**: What about sole proprietorships and partnerships - do they keep current roles?
- [ ] **Question**: Should there be role-specific validation rules (e.g., different requirements for 董事長 vs 董事)?

#### 3. Database and Schema Changes
- [ ] **Question**: Should this be a breaking change or maintain backward compatibility?
- [ ] **Question**: Do we need to migrate existing data or handle both old and new schemas?

#### 4. UI/UX Considerations
- [ ] **Question**: Should the form dynamically show different person sections based on organization type?
- [ ] **Question**: Are there specific workflows for adding multiple directors/supervisors?
- [ ] **Question**: Should role labels be contextualized (e.g., "Add Director" instead of "Add Person")?

## Implementation Planning

### Phase 1: Schema Design (Pending Client Clarification)
```typescript
// Potential new schema structure
type PersonRole = 
  | 'responsiblePerson' | 'representative' | 'contactPerson'  // Current
  | 'chairman' | 'director' | 'supervisor';                   // New for corporations

// Or organization-specific role mapping
type CorporationRoles = {
  chairman: PersonSchema;
  directors: PersonSchema[];  // Multiple directors allowed?
  supervisors: PersonSchema[]; // Multiple supervisors allowed?
}

type LimitedCompanyRoles = {
  // TBD based on client requirements
}
```

### Phase 2: Form Component Updates
- [ ] Update form part 2 to show different person sections based on organization type
- [ ] Add dynamic form generation for multiple directors/supervisors if needed
- [ ] Update validation schemas to handle organization-specific roles
- [ ] Modify person creation logic in stores

### Phase 3: Database Migration
- [ ] Create migration scripts for role type changes
- [ ] Update database schema to support new role types
- [ ] Ensure backward compatibility during transition
- [ ] Update API endpoints to handle new role structures

### Phase 4: Review System Updates
- [ ] Update review components to handle new role types
- [ ] Modify display labels and sections for different organization types
- [ ] Update document management for role-specific requirements
- [ ] Adjust workflow logic for organization-specific validation

## Technical Considerations

### Current File Locations
- **Person schemas**: `packages/company/shared/utils/schemas/person.ts`
- **Form components**: `packages/company/app/components/company/application/form/part/2.vue`
- **Person stores**: `packages/company/app/composables/stores/companyApplication.ts`
- **Database schema**: `packages/company/server/database/schema/person/schema.ts`
- **Review constants**: `packages/company/app/components/company/application/review/constants.ts`

### Impact Assessment
- **High Impact**: Person creation, form validation, database schema
- **Medium Impact**: Review system, confirmation pages, mock data generation
- **Low Impact**: Styling, labels, test data

## Risk Analysis

### Technical Risks
- **Breaking Changes**: Significant schema changes may affect existing applications
- **Data Migration**: Complex migration needed if changing existing person role structure
- **Form Complexity**: Multiple dynamic person sections may complicate form logic

### Business Risks
- **User Confusion**: Different role types per organization may confuse users familiar with current system
- **Validation Complexity**: Organization-specific validation rules increase system complexity
- **Maintenance Overhead**: Multiple role systems require more comprehensive testing and maintenance

## Next Steps

1. **Client Discussion** - Schedule meeting to clarify requirements and answer outstanding questions
2. **Requirements Documentation** - Document final requirements based on client feedback
3. **Technical Specification** - Create detailed technical spec once requirements are clear
4. **Implementation Timeline** - Estimate development time based on final scope
5. **Testing Strategy** - Plan comprehensive testing for new role systems

## Decision Log

| Date | Decision | Rationale | Impact |
|------|----------|-----------|---------|
| TBD | Final role structure | Pending client clarification | TBD |
| TBD | Migration strategy | Pending requirements | TBD |
| TBD | Implementation approach | Pending technical specification | TBD |

---

**Status**: 🔄 Awaiting Client Clarification  
**Priority**: Medium  
**Estimated Effort**: TBD (depends on scope)  
**Last Updated**: 2025-01-11