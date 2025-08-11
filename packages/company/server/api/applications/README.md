# Applications API

This directory contains all application-related API endpoints organized in a RESTful structure.

## API Endpoints

### List Applications

- **GET** `/api/applications`
- **Description**: Retrieve paginated list of company applications
- **Query Parameters**:
  - `page` (number, default: 1): Page number
  - `limit` (number, default: 20, max: 100): Items per page
  - `status` (string): Filter by application status
  - `organizationType` (string): Filter by organization type
  - `search` (string): Search in business description and address
  - `dateFrom` (string): Filter by creation date from
  - `dateTo` (string): Filter by creation date to
  - `sortBy` (string): Sort by field (createdAt, updatedAt, status, organizationType)
  - `sortOrder` (string): Sort order (asc, desc)

### Create Application

- **POST** `/api/applications/create`
- **Description**: Submit a new company application
- **Body**: CompanyApplicationSchema

### Get Application Details

- **GET** `/api/applications/[id]`
- **Description**: Retrieve detailed information about a specific application
- **Parameters**:
  - `id` (string): Application ID

### Update Application Status

- **PUT** `/api/applications/[id]/status`
- **Description**: Update application status
- **Parameters**:
  - `id` (string): Application ID
- **Body**:
  ```json
  {
    "status": "submitted|staff_review|pending_client_update|approved|rejected",
    "comment": "Optional comment about the status change"
  }
  ```

### Add Application Comment

- **POST** `/api/applications/[id]/comments`
- **Description**: Add internal comment to application
- **Parameters**:
  - `id` (string): Application ID
- **Body**:
  ```json
  {
    "comment": "Comment text (max 1000 characters)"
  }
  ```

## Response Format

All endpoints return responses in the following format:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Optional message"
}
```

## Error Handling

All endpoints include comprehensive error handling with appropriate HTTP status codes:

- `400`: Bad Request (validation errors)
- `404`: Not Found (resource not found)
- `500`: Internal Server Error

## TODO

- [ ] Add application status history tracking
- [ ] Add application comments table and functionality
- [ ] Add shareholders relationship and data
- [ ] Add authentication and authorization
- [ ] Add audit logging
- [ ] Add email notifications for status changes
