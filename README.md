# Task-Approval-System

## Setup Instructions

### Clone the repository:

```bash
git clone https://github.com/souravkumar0546/Task-Approval-System.git
cd Task-Approval-System
```
### Set up the PostgreSQL Database

- Create a PostgreSQL database.

### Configure environment variables:

- Rename ```.env.example``` to ```.env``` and update the necessary values.

### Install dependencies:

```bash
npm install
```

### Start the server:
```bash
npm start
```

## API Description

### Sign Up
```POST /api/auth/signup```

- Creates a new user account.

Request Body:
```Json
{ "name": "John Doe", "email": "john@example.com", "password": "password123" }
```

Success Response:
```Json
{ "message": "User registered successfully", "userId": 1 }
```

Error Response:
```Json
{ "message": "Validation error" }
```

### Login
```POST /api/auth/login```

- Authenticates a user and returns a JWT token.

Request Body:
```json
{ "email": "john@example.com", "password": "password123" }
```

Success Response:
```json
{ "message": "Login successful", "token": "jwt_token" }
```

Error Response:
```json
{ "message": "Authentication failed" }
```

### List Users
```GET /api/users```

- Retrieves a list of all users, which can be used to populate the approver dropdown, allowing the task creator to select approvers for a task.

Success Response:
```json
[
  { "id": 1, "email": "user1@example.com" },
  { "id": 2, "email": "user2@example.com" }
]
```

### Create Task
```POST /api/tasks```

- Creates a new task and assigns approvers.

Request Body:
```json
{ "description": "Task description", "approverIds": [2, 3, 4] }
```

Success Response:
```json
{ "message": "Task created successfully", "taskId": 1 }
```

### Approve Task
```POST /api/tasks/:taskId/approve```

- Approves a task by an approver.

Success Response:
```json
{ "message": "Task approved successfully" }
```
Error Response:
```json
{ "message": "Task already approved or unauthorized" }
```
- If 3 approvals are received, the task status is updated to Approved and all parties are notified via email.

### Get Tasks Created By User
```GET /api/tasks/created```

- Retrieves tasks created by the logged-in user along with comments and approvers.

Success Response:
```json
[
  {
    "id": 1,
    "description": "Sample task description",
    "status": "Awaiting Approval",
    "createdAt": "2025-02-11T10:00:00.000Z",
    "updatedAt": "2025-02-11T12:00:00.000Z",
    "creatorId": 5,
    "TaskApprovers": [
      {
        "id": 10,
        "approved": false,
        "createdAt": "2025-02-11T10:05:00.000Z",
        "updatedAt": "2025-02-11T11:00:00.000Z",
        "approverId": 2,
        "taskId": 1,
        "User": {
          "id": 2,
          "email": "approver1@example.com"
        }
      },
      {
        "id": 11,
        "approved": true,
        "createdAt": "2025-02-11T10:10:00.000Z",
        "updatedAt": "2025-02-11T11:30:00.000Z",
        "approverId": 3,
        "taskId": 1,
        "User": {
          "id": 3,
          "email": "approver2@example.com"
        }
      }
    ],
    "Comments": [
      {
        "id": 20,
        "text": "Looks good, but needs a minor update.",
        "createdAt": "2025-02-11T12:30:00.000Z",
        "updatedAt": "2025-02-11T12:30:00.000Z",
        "userId": 3,
        "taskId": 1,
        "User": {
          "id": 3,
          "name": "John Doe",
          "email": "approver2@example.com"
        }
      }
    ]
  }
]
```
Error Response:
```json
{ "message": "Failed to fetch tasks" }
```

### Get Tasks for Approval
```GET /api/tasks/approvals```

- Retrieves tasks pending approval for the logged-in user.

Success Response:
```json
[
  {
    "id": 5,
    "approved": false,
    "createdAt": "2025-02-11T14:00:00.000Z",
    "updatedAt": "2025-02-11T14:30:00.000Z",
    "approverId": 7,
    "taskId": 3,
    "Task": {
      "id": 3,
      "description": "Review project proposal",
      "status": "Awaiting Approval",
      "createdAt": "2025-02-11T13:50:00.000Z",
      "updatedAt": "2025-02-11T14:20:00.000Z",
      "creatorId": 10,
      "creator": {
        "email": "creator@example.com"
      },
      "Comments": [
        {
          "id": 15,
          "text": "Please check the budget section before approval.",
          "createdAt": "2025-02-11T15:00:00.000Z",
          "updatedAt": "2025-02-11T15:00:00.000Z",
          "userId": 12,
          "taskId": 3,
          "User": {
            "id": 12,
            "name": "Jane Doe",
            "email": "commenter@example.com"
          }
        }
      ]
    }
  }
]
```
Error Response:
```json
{ "message": "Failed to fetch tasks" }
```

### Get Task by ID

```GET /api/tasks/:taskId```

- Retrieves a task by ID (creator or assigned approver only).

Success Response:
```json
{
  "id": 7,
  "description": "Finalize marketing strategy",
  "status": "Awaiting Approval",
  "createdAt": "2025-02-11T10:30:00.000Z",
  "updatedAt": "2025-02-11T12:00:00.000Z",
  "creatorId": 15,
  "TaskApprovers": [
    {
      "id": 21,
      "approved": true,
      "createdAt": "2025-02-11T11:00:00.000Z",
      "updatedAt": "2025-02-11T11:45:00.000Z",
      "approverId": 8,
      "taskId": 7,
      "User": {
        "id": 8,
        "email": "approver1@example.com"
      }
    },
    {
      "id": 22,
      "approved": false,
      "createdAt": "2025-02-11T11:10:00.000Z",
      "updatedAt": "2025-02-11T11:50:00.000Z",
      "approverId": 9,
      "taskId": 7,
      "User": {
        "id": 9,
        "email": "approver2@example.com"
      }
    }
  ],
  "Comments": [
    {
      "id": 30,
      "text": "Can we clarify the budget allocation?",
      "createdAt": "2025-02-11T12:15:00.000Z",
      "updatedAt": "2025-02-11T12:15:00.000Z",
      "userId": 9,
      "taskId": 7,
      "User": {
        "id": 9,
        "name": "John Doe",
        "email": "approver2@example.com"
      }
    }
  ],
  "creator": {
    "id": 15,
    "email": "creator@example.com"
  }
}
```
Error Response:
```json
{ "message": "Task not found or unauthorized access" }
```

### Add Approver

```POST /api/tasks/:taskId/approvers```

- Allows the creator to add an approver to an existing task.

Request Body:
```json
{ "approverId": 5 }
```
Success Response:
```json
{ "message": "Approver added successfully" }
```
Error Response:
```json
{ "message": "Task not found or unauthorized action" }
```

### Add Comment
```POST /api/tasks/:taskId/comments```

- Adds a comment to a task.

Request Body:
```json
{ "text": "This task needs more details." }
```
Success Response:
```json
{ "message": "Comment added", "commentId": 1 }
```
Error Response:
```json
{ "message": "Failed to add comment" }
```

## Possible Improvements

### Background Email Processing with a Worker Queue

- Current Issue: Emails are sent synchronously during API calls, increasing API latency.

- Improvement: Implement a worker queue to send emails in the background.

- This will Reduce API response time, Handle a large number of email requests efficiently and Provide retry mechanisms for failed emails.

