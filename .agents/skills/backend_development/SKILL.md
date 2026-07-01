---
name: backend_development
description: Guidelines, architectures, and recipes for backend development in the Car Booking system (Node.js, Express, MongoDB, Mongoose)
---

# Backend Development Skill

This skill provides context, guidelines, architecture constraints, and step-by-step recipes for backend development in the Car Booking codebase.

## Tech Stack Overview
- **Runtime**: Node.js (ES Modules with `"type": "module"`)
- **Web Framework**: Express (v5.x)
- **Database / ODM**: MongoDB with Mongoose (v9.x)
- **Environment**: Configured via `.env` file (e.g., `MONGO_URI`) and managed with `dotenv`

## Directory Structure & Conventions

```
backend/
├── config/              # Configuration (e.g. database connection db.js)
├── controllers/         # Request handling & business logic (camelCase, e.g. userController.js)
├── middleware/          # Express middlewares (e.g. asyncHandler.js, errorMiddleware.js)
├── models/              # Mongoose schemas/models (Capitalized, e.g. User.js)
├── routes/              # Express route definitions (camelCase, e.g. userRoutes.js)
├── server.js            # Entry point
```

### File Naming Conventions
- **Models**: `CamelCase` with capital first letter (e.g., `User.js`, `Route.js`, `Trip.js`, `Ticket.js`).
- **Controllers**: `camelCase` ending in `Controller.js` (e.g., `userController.js`, `ticketController.js`).
- **Routes**: `camelCase` ending in `Routes.js` (e.g., `userRoutes.js`, `ticketRoutes.js`).
- **Middlewares**: `camelCase` ending in `Middleware.js` or descriptive name (e.g., `errorMiddleware.js`, `asyncHandler.js`).

---

## Coding Guidelines & Standards

### 1. ES Modules Imports
Because the backend is configured as an ES Module (`"type": "module"` in `package.json`), all local file imports **must include the `.js` extension**.
- **Correct**: `import User from '../models/User.js';`
- **Incorrect**: `import User from '../models/User';`

### 2. Error Handling & Async Code
Do not use raw `try/catch` blocks inside controllers. Instead, wrap all route handler functions in `asyncHandler`.
- Use `asyncHandler` imported from `../middleware/asyncHandler.js`.
- To trigger an error, set `res.status(...)` (default is 500 if not set) and throw a new `Error`.
- Example:
  ```javascript
  import asyncHandler from '../middleware/asyncHandler.js';

  export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('Không tìm thấy người dùng');
    }
    res.status(200).json({ success: true, data: user });
  });
  ```

### 3. Response Structure
Ensure JSON responses maintain a uniform format:
- **Success (Single Resource)**:
  ```json
  { "success": true, "data": { ... } }
  ```
- **Success (Lists / Queries)**:
  ```json
  { "success": true, "count": 10, "data": [ ... ] }
  ```
- **Errors**: Handled automatically by `errorMiddleware.js` which returns:
  ```json
  { "success": false, "message": "Error message", "stack": "..." }
  ```

### 4. Database Indices & Optimization
When defining models that will be queried frequently, define appropriate indexes:
- Dual-indices for search combinations (e.g., `{ from: 1, to: 1 }` or `{ from: 1, to: 1, date: 1 }`).
- Define indexes via schema: `schema.index({ fieldName: 1 });` at the bottom of the schema definition.

---

## Code Recipes

### Recipe A: Adding a New Resource (CRUD)

Follow these steps to add a new entity (e.g., `Review`):

#### Step 1: Create the Mongoose Model
Create `backend/models/Review.js`:
```javascript
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Mã người dùng là bắt buộc'],
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Mã chuyến đi là bắt buộc'],
    },
    rating: {
      type: Number,
      required: [true, 'Đánh giá từ 1-5 sao là bắt buộc'],
      min: [1, 'Đánh giá tối thiểu là 1'],
      max: [5, 'Đánh giá tối đa là 5'],
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ tripId: 1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
```

#### Step 2: Create the Controller
Create `backend/controllers/reviewController.js`:
```javascript
import Review from '../models/Review.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Lấy đánh giá của chuyến xe
// @route   GET /api/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res) => {
  const { tripId } = req.query;
  let query = {};
  if (tripId) query.tripId = tripId;

  const reviews = await Review.find(query).populate('userId', 'name avatar');
  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Tạo đánh giá mới
// @route   POST /api/reviews
// @access  Public
export const createReview = asyncHandler(async (req, res) => {
  const { userId, tripId, rating, comment } = req.body;

  const review = await Review.create({
    userId,
    tripId,
    rating,
    comment,
  });

  res.status(201).json({
    success: true,
    data: review,
  });
});
```

#### Step 3: Create the Routes
Create `backend/routes/reviewRoutes.js`:
```javascript
import express from 'express';
import { getReviews, createReview } from '../controllers/reviewController.js';

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(createReview);

export default router;
```

#### Step 4: Register Route in `server.js`
Modify `backend/server.js`:
```javascript
// Import route
import reviewRoutes from './routes/reviewRoutes.js';

// ... other middlewares

// Use route
app.use('/api/reviews', reviewRoutes);
```
