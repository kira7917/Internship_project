import React from "react";

const Sidebar = ({ selectedRepos = [], repoDetails = {} }) => {
  return (
    <div className="sidebar">
      <h3>Selected Repositories</h3>
      <ul>
        {selectedRepos.length > 0 ? (
          selectedRepos.map((repo) => (
            <li key={repo.id}>
              <strong>{repo.name}</strong>
              {repoDetails[repo.id] && (
                <div className="repo-details">
                  <h4>Branches</h4>
                  {repoDetails[repo.id]?.branches?.map((branch) => (
                    <div key={branch.name}>{branch.name}</div>
                  ))}

                  <h4>Pull Requests</h4>
                  {repoDetails[repo.id]?.pullRequests?.map((pr) => (
                    <div key={pr.id}>{pr.title}</div>
                  ))}

                  <h4>Issues</h4>
                  {repoDetails[repo.id]?.issues?.map((issue) => (
                    <div key={issue.id}>{issue.title}</div>
                  ))}
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No repositories selected</p>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
