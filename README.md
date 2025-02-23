# GitHub OAuth Explorer

## Project Overview
This application allows users to authenticate via GitHub OAuth, select multiple repositories, and visualize repository branches in a user-friendly way. Additionally, it provides an overview of pull requests (PRs) and issues.

## Features
1. **User Authentication via GitHub OAuth**
   - Users can sign in using their GitHub credentials.
   - OAuth authentication is implemented using GitHub’s OAuth API.
   - Authorization enables the app to fetch user repositories.

2. **Repository Selection**
   - Fetches the authenticated user’s repositories from GitHub.
   - Users can select multiple repositories from a list.
   - Displays selected repositories in a sidebar.

3. **Branch Visualization**
   - Fetches and displays branches for each selected repository.
   - Presents branches in an organized and visually appealing manner.
   - Allows smooth navigation between repositories and their branches.

4. **PR & Issues Overview (Bonus Feature)**
   - Fetches open and closed pull requests (PRs) along with metadata (authors, dates, status).
   - Fetches issues for selected repositories.
   - Displays PRs and issues interactively within the branch view.

---

## Setup Instructions

### 1. Prerequisites
Before running the project, ensure you have the following installed:
- Node.js (v16+ recommended)
- npm or yarn
- GitHub Developer Account

### 2. Clone the Repository


### 3. Install Dependencies
```sh
npm install
# or
yarn install
```

### 4. Set Up GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Create a new OAuth App.
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization Callback URL:** `http://localhost:5000/auth/github/callback`
3. Copy the **Client ID** and **Client Secret**.
4. Create a `.env` file in the project root and add the following:
```sh
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
```

### 5. Start the Backend Server
```sh
cd backend
node server.js
```

### 6. Start the Frontend Application
```sh
cd frontend
npm start
```

### 7. Usage
- Open `http://localhost:3000` in your browser.
- Click **Login with GitHub** to authenticate.
- Select repositories to view branches, PRs, and issues.

---

## Folder Structure
```
/github-oauth-explorer
├── frontend/       # React frontend
    ├── public/
        ├── index.html   #hrml file
│   ├── src/
│   │   ├── components/  # Sidebar, Charts, etc.
│   │   ├── App.js       # Main application file
│   │   ├── index.js     # Entry point
├── backend/       # Node.js backend
│   ├── server.js  # Express server with OAuth handling
├── .env          # Environment variables
├── README.md     # Documentation
```

---

## API Endpoints
| Method | Endpoint                   | Description |
|--------|----------------------------|-------------|
| GET    | `/auth/github`              | Redirects user to GitHub OAuth |
| GET    | `/auth/github/callback`     | Handles GitHub OAuth callback |
| GET    | `/api/user`                 | Fetches authenticated user info |
| GET    | `/api/repositories`         | Fetches user repositories |
| GET    | `/api/repository/:id/branches` | Fetches branches for a repository |
| GET    | `/api/repository/:id/prs`   | Fetches pull requests |
| GET    | `/api/repository/:id/issues` | Fetches issues |

---

## Notes
- Ensure your GitHub OAuth App is correctly configured with the correct **callback URL**.
- If encountering a `404` error on API calls, verify that the backend is running on port `5000`.
- The frontend and backend must run simultaneously for the app to function correctly.

Happy coding! 🚀

