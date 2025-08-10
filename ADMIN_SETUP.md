# Admin Dashboard Setup

## Environment Variables Configuration

To keep admin credentials secure and out of version control, you need to create environment files with your admin credentials.

### Backend Setup (.env)

Create a `.env` file in the `backend/` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=aishwaryabodhe1122@gmail.com
ADMIN_PASSWORD=Aishu@11

# Email Configuration (for future use)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Setup (.env.local)

Create a `.env.local` file in the `frontend/` directory with the following content:

```env
# Frontend Environment Variables

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Admin Credentials (for frontend validation)
NEXT_PUBLIC_ADMIN_EMAIL=aishwaryabodhe1122@gmail.com
NEXT_PUBLIC_ADMIN_PASSWORD=Aishu@11
```

## Security Notes

- ✅ **Environment files are gitignored** - Your credentials won't be pushed to GitHub
- ✅ **Example files provided** - `.env.example` and `.env.local.example` show the required structure
- ✅ **Fallback values** - Code includes fallback values for development
- ✅ **Separate frontend/backend configs** - Each service has its own environment file

## Admin Dashboard Access

1. **Login**: Use your configured admin email
2. **Navigate**: Click the "Admin" button in the navbar (only visible to admin users)
3. **Authenticate**: Enter your configured admin password
4. **Access**: Full admin dashboard functionality

## Features Available

- **User Management**: View and delete user accounts
- **Newsletter Management**: View subscribers and send blog updates
- **Contact Requests**: View all contact form submissions
- **Visitor Analytics**: Dynamic visitor statistics
- **Beautiful UI**: Animated, responsive admin interface

## Important

Make sure to:
1. Create both `.env` files before starting the servers
2. Never commit `.env` files to version control
3. Update the credentials to your preferred values
4. Restart both servers after creating the environment files
