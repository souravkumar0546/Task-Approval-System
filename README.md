# Task-ApprovalSystem

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

- Retrieves a list of users for the approval dropdown.

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

- If 3 approvals are received, the task status is updated to Approved and all parties are notified via email.

### Get Tasks Created By User
```GET /api/tasks/created```

- Retrieves tasks created by the logged-in user along with comments and approvers.

Success Response:
```
Returns a task list  with its comments, creator and approver details.
```
Error Response:
```json
{ "message": "Failed to fetch tasks" }
```

### Get Tasks for Approval
```GET /api/tasks/approvals```

- Retrieves tasks pending approval for the logged-in user.

Success Response:
```
Returns a task list  with its comments, creator and approver details.
```
Error Response:
```json
{ "message": "Failed to fetch tasks" }
```

### Get Task by ID

```GET /api/tasks/:taskId```

- Retrieves a task by ID (creator or assigned approver only).

Success Response:
```
Returns a task list  with its comments, creator and approver details.
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

- Improvement: Implement a worker queue (e.g., using BullMQ with Redis) to send emails in the background.

- This will Reduces API response time, Handles a large number of email requests efficiently and Provides retry mechanisms for failed emails.

