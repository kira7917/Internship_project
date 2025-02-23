import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css"; 


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [branches, setBranches] = useState({});
  const [pullRequests, setPullRequests] = useState({});
  const [issues, setIssues] = useState({});

  // Fetch user info
  useEffect(() => {
    axios.get("http://localhost:5000/api/user", { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  // Fetch GitHub repositories
  useEffect(() => {
    if (user?.token) {
      axios.get("https://api.github.com/user/repos", {
        headers: {
          Authorization: `token ${user.token}`,
          Accept: "application/vnd.github.v3+json",
        },
      })
      .then(response => setRepos(response.data))
      .catch(error => console.error("Error fetching repos:", error));
    }
  }, [user]);

  // Handle repository selection
  const toggleRepoSelection = (repo) => {
    const updatedSelection = selectedRepos.includes(repo.name)
      ? selectedRepos.filter(r => r !== repo.name)
      : [...selectedRepos, repo.name];

    setSelectedRepos(updatedSelection);

    if (!branches[repo.name]) fetchBranches(repo.owner.login, repo.name);
    if (!pullRequests[repo.name]) fetchPullRequests(repo.owner.login, repo.name);
    if (!issues[repo.name]) fetchIssues(repo.owner.login, repo.name);
  };

  // Fetch branches
  const fetchBranches = (owner, repoName) => {
    axios.get(`https://api.github.com/repos/${owner}/${repoName}/branches`, {
      headers: {
        Authorization: `token ${user.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
    .then(response => setBranches(prev => ({ ...prev, [repoName]: response.data })))
    .catch(error => console.error("Error fetching branches:", error));
  };

  // Fetch pull requests
  const fetchPullRequests = (owner, repoName) => {
    axios.get(`https://api.github.com/repos/${owner}/${repoName}/pulls?state=all`, {
      headers: {
        Authorization: `token ${user.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
    .then(response => setPullRequests(prev => ({ ...prev, [repoName]: response.data })))
    .catch(error => console.error("Error fetching PRs:", error));
  };

  // Fetch issues
  const fetchIssues = (owner, repoName) => {
    axios.get(`https://api.github.com/repos/${owner}/${repoName}/issues`, {
      headers: {
        Authorization: `token ${user.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
    .then(response => setIssues(prev => ({ ...prev, [repoName]: response.data })))
    .catch(error => console.error("Error fetching issues:", error));
  };

  return (
    <div className="dashboard">
      <h2>GitHub Repository Explorer</h2>

      {!user ? (
        <button onClick={() => window.location.href = "http://localhost:5000/auth/github"}>
          Login with GitHub
        </button>
      ) : (
        <div className="repo-container">
          <h3>Welcome, {user.username}!</h3>

          {/* Repository List */}
          <div className="repo-list">
            <h3>Your Repositories</h3>
            {repos.map(repo => (
              <div key={repo.id} className="repo-item">
                <input
                  type="checkbox"
                  checked={selectedRepos.includes(repo.name)}
                  onChange={() => toggleRepoSelection(repo)}
                />
                <span>{repo.name}</span>
              </div>
            ))}
          </div>

          {/* Repository Details */}
          <div className="details-container">
            {selectedRepos.map(repoName => (
              <div key={repoName} className="repo-details">
                <h4>{repoName}</h4>

                {/* Branches */}
                <div className="section">
                  <h5>Branches</h5>
                  <ul>
                    {branches[repoName]?.map(branch => (
                      <li key={branch.name}>{branch.name}</li>
                    )) || <p>Loading...</p>}
                  </ul>
                </div>

                {/* Pull Requests */}
                <div className="section">
                  <h5>Pull Requests</h5>
                  <h6>Open PRs</h6>
                  <ul>
                    {pullRequests[repoName]?.filter(pr => pr.state === "open").map(pr => (
                      <li key={pr.id}>
                        <strong>{pr.title}</strong> by {pr.user.login} - {new Date(pr.created_at).toLocaleDateString()}
                      </li>
                    )) || <p>Loading...</p>}
                  </ul>

                  <h6>Closed PRs</h6>
                  <ul>
                    {pullRequests[repoName]?.filter(pr => pr.state === "closed").map(pr => (
                      <li key={pr.id}>
                        <strong>{pr.title}</strong> by {pr.user.login} - Closed on {new Date(pr.closed_at).toLocaleDateString()}
                      </li>
                    )) || <p>Loading...</p>}
                  </ul>
                </div>

                {/* Issues */}
                <div className="section">
                  <h5>Issues</h5>
                  <ul>
                    {issues[repoName]?.map(issue => (
                      <li key={issue.id}>
                        <strong>{issue.title}</strong> by {issue.user.login} - {new Date(issue.created_at).toLocaleDateString()}
                      </li>
                    )) || <p>Loading...</p>}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
