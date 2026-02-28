# Setup Instructions

## Install Required Dependencies

Run this command to install the camera package:

```bash
npx expo install expo-camera
```

## Configure Groq AI API Key

1. Get your API key from [Groq Console](https://console.groq.com/)
2. Create a `.env.local` file in the root directory
3. Add your API key:

```
EXPO_PUBLIC_GROQ_API_KEY=gsk_your_actual_key_here
```

Note: The `.env.local` file is already in `.gitignore` to keep your API key secure.

## Run the App

```bash
npm start
```

Then press:

- `a` for Android
- `i` for iOS
- `w` for Web (camera won't work on web)

## How It Works

1. User points camera at an object
2. Taps capture button
3. Image is sent to Groq's Llama 3.2 90B Vision model
4. AI identifies the object and returns 3 vocabulary words:
   - Beginner level
   - Intermediate level
   - Advanced level
5. Each word includes a natural example sentence

## Troubleshooting

If you get API errors:

- Verify your API key is correct in `.env.local`
- Restart the dev server after adding the API key
- Check you have credits in your Groq account
- Ensure you have internet connection
