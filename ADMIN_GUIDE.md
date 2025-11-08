# Admin Product Management Guide

This guide explains how to use the admin product management functionality in the Toko Online application.

## Features

The admin product management system allows admin users to:

1. **View all products** - Including active and inactive products
2. **Create new products** - Add new products to the catalog
3. **Edit existing products** - Update product details, price, stock, etc.
4. **Delete products** - Soft delete products (sets isActive to false)
5. **Filter and search products** - Find products by name, category, status, etc.
6. **Pagination** - Navigate through large product lists

## Access Requirements

- **Admin Role**: Only users with `role: 'admin'` can access the product management interface
- **Authentication**: Admin users must be logged in to access the functionality

## Default Admin Credentials

After running the database seeder, you can use these admin accounts:

- **Email**: `admin@toko.com`
- **Password**: `admin123`

Or:

- **Email**: `admin2@toko.com`
- **Password**: `admin123`

## How to Access

1. **Login** with admin credentials at `http://localhost:5174/login`
2. **Navigate** to the admin section using either:
   - Click the "Admin" button in the navigation bar
   - Click the user menu and select "Product Management"
   - Go directly to `http://localhost:5174/admin/products`

## Product Management Interface

### Main Features

1. **Product Table**: Displays all products with their details
   - Product image thumbnail
   - Name and description
   - Category badge
   - Price and stock levels
   - Active/inactive status
   - Action buttons (edit/delete)

2. **Filters and Search**:
   - Search by product name or description
   - Filter by category
   - Filter by status (active/inactive)
   - Sort by various fields (name, price, stock, date)
   - Sort order (ascending/descending)

3. **Product Form Modal**:
   - Create new products or edit existing ones
   - Form validation for all fields
   - Support for product images (URL)
   - Category selection
   - Stock management
   - Active/inactive toggle (for existing products)

### Product Fields

- **Name** (Required): Product name (2-200 characters)
- **Description** (Optional): Product description (max 1000 characters)
- **Price** (Required): Product price (must be positive)
- **Stock** (Required): Available quantity (must be non-negative)
- **Category** (Optional): Product category
- **Image** (Optional): Product image URL
- **Active** (Edit only): Whether the product is visible to customers

## API Endpoints

The admin functionality uses these protected API endpoints:

- `GET /api/products/admin/all` - Get all products (including inactive)
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update an existing product
- `DELETE /api/products/:id` - Soft delete a product (sets isActive to false)

All endpoints require:
- Authentication token in the `Authorization: Bearer <token>` header
- Admin role (`role: 'admin'`)

## Security Features

1. **Role-based access control**: Only admin users can access the management interface
2. **Protected routes**: Admin routes are protected both on frontend and backend
3. **Input validation**: All product data is validated before saving
4. **Soft delete**: Products are marked as inactive instead of being permanently deleted

## Technical Implementation

### Frontend Components

- `AdminRoute.tsx` - Protected route component for admin-only access
- `ProductForm.tsx` - Form component for creating/editing products
- `ProductManagement.tsx` - Main admin product management page
- Updated `Navbar.tsx` - Shows admin options for admin users

### Backend Integration

- Uses existing product controller methods
- Admin-specific endpoint `/api/products/admin/all`
- Role-based middleware protection
- Comprehensive input validation

## Testing

The system has been tested with:
- Admin login and authentication
- Product creation, editing, and deletion
- Filtering and sorting functionality
- Role-based access control
- Form validation and error handling

## Troubleshooting

1. **Access Denied**: Ensure you're logged in with an admin account
2. **404 Errors**: Check that the backend server is running on port 3000
3. **Form Validation Errors**: Ensure all required fields are filled correctly
4. **Image Issues**: Use valid image URLs for product images

## Future Enhancements

Potential improvements for the admin system:

1. **Bulk operations** - Select and edit/delete multiple products
2. **Image upload** - Direct image upload instead of URL input
3. **Product variants** - Support for products with multiple variants
4. **Advanced analytics** - Sales reports and product performance metrics
5. **Import/Export** - Bulk product import from CSV/Excel files