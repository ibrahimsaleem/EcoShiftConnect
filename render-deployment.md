# Deploying EcoShiftConnect to Render

This guide explains how to deploy the EcoShiftConnect application to Render.com.

## Deployment Configuration

Use the following settings when setting up your web service on Render:

### Basic Settings

- **Name**: `EcoShiftConnect`
- **Region**: `Oregon (US West)` (or any region of your choice)
- **Branch**: `main`
- **Root Directory**: Leave empty (uses repository root)
- **Runtime Environment**: `Node`

### Build and Start Commands

- **Build Command**: `npm install; npm run build`
- **Start Command**: `npm run start:render`

### Instance Type

For testing and personal use, you can use the Free tier. For production, we recommend at least the Starter tier ($7/month) for better performance.

### Environment Variables

Add the following environment variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `GEMINI_API_KEY` | `AIzaSyAVd72kO1py4DuPzTDKdQPJNduMEi6pKa8` | API key for Gemini AI (already hardcoded but better as env var) |
| `OPENWEATHER_API_KEY` | `your_api_key` | (Optional) API key for OpenWeatherMap for real weather data |
| `NODE_ENV` | `production` | Set the environment to production mode |

## Deployment Steps

1. Click "Create Web Service" on Render dashboard
2. Connect your GitHub repository (`ibrahimsaleem/EcoShiftConnect`)
3. Fill in the settings as described above
4. Add the environment variables
5. Click "Create Web Service"

Render will automatically build and deploy your application. Once the deployment is complete, you can access your application at the URL provided by Render.

## Post-Deployment

After deployment, verify that:

1. The application is running correctly
2. API endpoints are working
3. The Gemini AI integration is functioning properly
4. Weather data is being fetched (either real or mock)

## Troubleshooting

If you encounter any issues:

1. Check the Render logs for error messages
2. Verify that all environment variables are set correctly
3. Ensure that the build and start commands are executing properly
4. Check that the port configuration is correct (Render sets the PORT environment variable automatically)

## Scaling

If you need to scale your application:

1. Upgrade to a higher instance type on Render
2. Consider adding a custom domain
3. Set up automatic scaling rules if needed

## Monitoring

Render provides built-in monitoring for:

- CPU usage
- Memory usage
- Request count
- Response time

Use these metrics to ensure your application is performing optimally.
