# Fresh Kitchen - Frontend

A modern, responsive React frontend for the Fresh Kitchen food ordering application. Built with React 19, TypeScript, Vite, and Tailwind CSS for a fast, scalable user interface.

## Tech Stack

- **React** - UI library with latest features
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client for API communication
- **JWT Decode** - JWT token parsing for authentication



## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

Update API configuration in `src/infra/api/client.ts` if needed.

## Running the Application

### Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at: `http://localhost:5173` (or next available port)

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.


## Project Structure

```
src/
├── main.tsx                    # Application entry point
├── index.css                   # Global styles
├── app/
│   └── App.tsx                # Main app component with routing
├── infra/                      # Infrastructure & API layer
│   ├── api/
│   │   └── client.ts          # Axios instance & configuration
│   └── services/              # API service gateways
│       ├── authGateway.ts     # Authentication API calls
│       ├── basketGateway.ts   # Cart/Basket API calls
│       ├── menuGateway.ts     # Menu & categories API calls
│       ├── orderGateway.ts    # Order API calls
│       ├── paymentGateway.ts  # Payment API calls
│       └── userGateway.ts     # User profile API calls
├── pages/                      # Page components (route pages)
│   ├── AccessPage.tsx         # Login/Auth page
│   ├── BasketPage.tsx         # Shopping cart page
│   ├── ControlCenterPage.tsx  # Admin/Control center
│   ├── MenuDashboardPage.tsx  # Main menu display
│   └── PurchasePage.tsx       # Checkout/Purchase page
├── state/                      # Global state management
│   ├── auth/                  # Authentication state
│   │   ├── SessionContext.ts  # Auth context definition
│   │   ├── SessionProvider.tsx# Auth provider component
│   │   ├── token.ts           # JWT token utilities
│   │   └── useSession.ts      # Custom hook for auth
│   └── basket/                # Shopping cart state
│       ├── BasketContext.ts   # Basket context definition
│       ├── BasketProvider.tsx # Basket provider component
│       └── useBasket.ts       # Custom hook for basket
├── type/                       # TypeScript type definitions
│   ├── auth.ts                # Authentication types
│   └── types.ts               # Shared type definitions
├── ui/                         # Reusable UI components
│   ├── guards/
│   │   └── RequireSession.tsx # Protected route wrapper
│   └── layout/
│       └── Header.tsx         # Header/Navigation component
└── utils/
    └── totals.ts              # Utility functions for calculations

public/                         # Static assets
```

## API Integration

### Available Services

All API communication is handled through gateway services in `src/infra/services/`:

#### Authentication (`authGateway.ts`)
```typescript
login(email, password)
register(userData)
logout()
verifyToken(token)
```

#### Menu (`menuGateway.ts`)
```typescript
getCategories()
getFoods()
getFoodsByCategory(categoryId)
getFoodById(id)
```

#### Basket/Cart (`basketGateway.ts`)
```typescript
getCart()
addToCart(item)
updateCartItem(itemId, quantity)
removeFromCart(itemId)
clearCart()
```

#### Orders (`orderGateway.ts`)
```typescript
createOrder(orderData)
getOrders()
getOrderById(id)
updateOrder(id, data)
```

#### Payments (`paymentGateway.ts`)
```typescript
processPayment(paymentData)
getPaymentById(id)
getPaymentByOrderId(orderId)
```

#### User Profile (`userGateway.ts`)
```typescript
getUserProfile()
updateUserProfile(userData)
getUserById(id)
```



### Protected Routes

Use `RequireSession` wrapper for routes that require authentication:


## Shopping Cart State

The basket/cart state is managed globally using React Context:



## Styling with Tailwind CSS

This project uses **Tailwind CSS v4** for styling. Customize the design by:
