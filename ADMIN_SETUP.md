# Admin Setup Instructions

## Creating the Admin Account

The admin panel is protected and only accessible by the admin user with email: `admin@atamagri.com`

### Option 1: Using Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/project/atamagri-cc5c1/authentication/users)
2. Click "Add user"
3. Enter:
   - Email: `admin@atamagri.com`
   - Password: Choose a secure password (minimum 6 characters)
4. Click "Add user"

### Option 2: Using the Create Admin Script

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Run the admin creation script:
   ```bash
   node scripts/create-admin.js
   ```

3. Follow the prompts to set a password for the admin account

**Note:** There is no sign-up option on the login page. All users must be created either through Firebase Console or by an admin through the Admin Panel.

## Using the Admin Panel

1. Sign in with the admin account at `/login`
2. After login, you'll see an "Admin Panel" button in the dashboard sidebar
3. Click "Admin Panel" to access user management features

## Admin Panel Features

- **Register New Users**: Create new user accounts that can access the dashboard
- **View Registered Users**: See all users registered in the system
- **User Information**: View when users were created and by whom

## Important Notes

1. **No Public Sign-Up**: There is no sign-up option available on the login page. All users must be created by an administrator through the Admin Panel or Firebase Console.

2. **Security**: After creating a user, the admin will be logged out and needs to sign in again. This is a security feature.

3. **Admin Email**: Only `admin@atamagri.com` can access the admin panel. To add more admins, modify the `ADMIN_EMAILS` array in `/frontend/lib/auth-context.tsx`

4. **Production Recommendation**: For production use, implement Firebase Custom Claims for more secure role management instead of hardcoded email addresses.

## Default Admin Credentials

- Email: `admin@atamagri.com`
- Password: (You set this during account creation)

## Troubleshooting

If you can't access the admin panel:
1. Verify you're signed in with `admin@atamagri.com`
2. Check the browser console for errors
3. Ensure Firebase Authentication is enabled in your project
4. Verify the Firebase configuration in `.env.local` is correct