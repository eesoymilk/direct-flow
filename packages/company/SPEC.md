# Company Registration Management System Specification

## 1. System Overview

### 1.1 Purpose

The system is designed to manage the company registration process, handling both client-side data entry and internal document management for accounting firms. It provides a comprehensive solution for managing company registration documents, client information, and the registration process workflow.

### 1.2 Target Users

- Accounting firm staff (internal users)
- Company registration clients (external users)
- System administrators

### 1.3 System Architecture

- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- File Storage: AWS S3 or similar cloud storage
- Authentication: JWT-based authentication

## 2. Database Schema

### 2.1 Core Tables

#### companies

```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    foreign_name VARCHAR(255),
    organization_type VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    postal_code VARCHAR(10),
    tax_id VARCHAR(20),
    tax_number VARCHAR(20),
    property_tax_id VARCHAR(20),
    phone VARCHAR(20),
    fax VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### representatives

```sql
CREATE TABLE representatives (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    id_number VARCHAR(20) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### agents

```sql
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    firm_name VARCHAR(255),
    representative_name VARCHAR(255),
    id_number VARCHAR(20),
    address TEXT,
    phone VARCHAR(20),
    fax VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### contacts

```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    name VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### partners

```sql
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    id_number VARCHAR(20) NOT NULL,
    address TEXT,
    is_director BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### documents

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    document_type VARCHAR(50) NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### registration_progress

```sql
CREATE TABLE registration_progress (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    stage INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### users

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    firm_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. User Interface Specifications

### 3.1 Client Interface

#### 3.1.1 Basic Information Form

- Company name input field
- Business type selection (股份有限公司, 有限公司, 獨資, 合夥)
- Address input with postal code lookup
- Tax ID input
- Property tax ID input with auto-fill functionality
- Contact information fields
- Representative information
- Agent information
- Contact person information

#### 3.1.2 Document Upload Section

- File upload interface for:
  - ID card (front/back)
  - Health insurance card
  - Property tax bill
  - Partner documents
  - Other required documents

#### 3.1.3 Document Generation

- PDF generation for:
  - Property use agreement
  - Partner agreement
  - Director appointment agreement
  - Natural person declaration
  - Legal representative declaration

### 3.2 Internal Interface

#### 3.2.1 Document Management

- Internal document generation
- Document template management
- Document version control
- Document status tracking

#### 3.2.2 Progress Tracking

- Visual progress bar showing current stage
- Stage status updates
- Notes and comments section
- Document checklist

## 4. Business Logic

### 4.1 Registration Process Flow

1. Initial Data Upload
   - Client uploads required documents
   - System performs basic validation
2. Data Entry
   - Staff enters and verifies information
3. Document Review
   - Internal review process
4. Government Review
   - City government review status
5. Tax Bureau Review
   - Tax bureau review status
6. Document Transfer
   - Document handover process
7. Completion
   - Final status update

### 4.2 State Management

- System maintains state history
- Each state change is recorded with timestamp
- Ability to revert to previous states
- State comparison functionality

## 5. Security Requirements

### 5.1 Authentication

- JWT-based authentication
- Role-based access control
- Password hashing using bcrypt
- Session management
- Remember me functionality

### 5.2 Authorization

- Different access levels for:
  - System administrators
  - Firm staff
  - Clients
- Document access control
- Operation logging

## 6. Technical Requirements

### 6.1 Performance

- Page load time < 2 seconds
- File upload size limit: 10MB
- Support for concurrent users
- Database query optimization

### 6.2 Reliability

- Regular database backups
- Error logging and monitoring
- System health checks
- Automatic recovery procedures

### 6.3 Scalability

- Horizontal scaling capability
- Load balancing support
- Caching implementation
- Database sharding preparation

## 7. Integration Requirements

### 7.1 External Services

- Postal code lookup API
- Tax bureau API integration
- Document OCR service
- Email service integration

### 7.2 File Storage

- Cloud storage integration
- File type validation
- Virus scanning
- Backup procedures

## 8. Deployment Requirements

### 8.1 Environment

- Production environment
- Staging environment
- Development environment
- Testing environment

### 8.2 Monitoring

- Application monitoring
- Database monitoring
- Server monitoring
- Error tracking

## 9. Maintenance and Support

### 9.1 Backup Procedures

- Daily database backups
- Weekly full system backups
- Backup verification
- Recovery testing

### 9.2 Update Procedures

- Version control
- Deployment pipeline
- Rollback procedures
- Update testing

## 10. Future Considerations

### 10.1 Scalability

- Multi-tenant support
- API versioning
- Microservices architecture
- Container orchestration

### 10.2 Feature Extensions

- Mobile application
- API access for partners
- Advanced reporting
- Analytics dashboard
