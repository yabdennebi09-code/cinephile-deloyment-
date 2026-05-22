# Cinephile Outfits

AI cinematic outfit generator with a static frontend and one Node/Express backend.

## Run locally

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file with:

   ```sh
   OPENAI_API_KEY=your_key_here
   ```

3. Start the app:

   ```sh
   npm start
   ```

4. Open `http://localhost:3001`.

## Deploy

Deploy the whole folder as a Node app.

Use:

- Build command: `npm install`
- Start command: `npm start`
- Environment variable: `OPENAI_API_KEY`

The frontend and backend are served from the same hosted URL, so the shared link can generate images without calling `localhost`.
