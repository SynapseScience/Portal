import React, { useEffect, useState } from "react";
import AppCard from "../parts/AppCard";
import Icon from "../parts/Icon";

import "./Home.css";

export default function Home({ setPopup, me, token, session }) {
  const [apps, setApps] = useState([]);
  const [searchQuery, setQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [selectedFilters, setSelectedFilters] = useState(["indépendant", "francophone"]);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [selectedSort, selectedFilters]);

  const fetchApplications = async () => {
    try {
      let url = session.apiUrl + "/applications";
      url += `?tags=${selectedFilters.join(",")}&sort=${selectedSort}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setApps(data.applications);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <nav>
        <h1>Applications</h1>
        <div>
          <button className="inverted outline disabled">
            <Icon name="heart" />
          </button>

          {/* FILTER MENU */}
          <div className="dropdown">
            <button className="inverted outline" onClick={() => {
              const newState = !filterMenuOpen;
              setFilterMenuOpen(newState);
              if(newState) setSortMenuOpen(false);
            }}>
              <Icon name="filter" />
            </button>
            {filterMenuOpen && (
              <div className="dropdown-menu outline">
                {[
                  "indépendant",
                  "académique",
                  "francophone", 
                  "anglophone", 
                  "open-source", 
                  "participatif",
                  "éducatif",
                ].map((tag) => (
                  <label key={tag} className="dropdown-item">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(tag)}
                      onChange={() => {
                        setSelectedFilters((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        );
                        setSortMenuOpen(false);
                      }}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* SORT MENU */}
          <div className="dropdown">
            <button className="inverted outline" onClick={() => {
              const newState = !sortMenuOpen;
              setSortMenuOpen(newState);
              if(newState) setFilterMenuOpen(false);
            }}>
              <Icon name="sort" />
            </button>
            {sortMenuOpen && (
              <div className="dropdown-menu outline">
                {[ 
                  { label: "Plus récents", value: "newest" },
                  { label: "Plus anciens", value: "oldest" },
                  { label: "Plus populaires", value: "popular" },
                  { label: "Moins populaires", value: "reverse-popular" }
                ].map((option) => (
                  <label key={option.value} className="dropdown-item">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={selectedSort === option.value}
                      onChange={() => {
                        setSelectedSort(option.value);
                      }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          <input
            className="outline"
            placeholder="Rechercher une application"
            type="text"
            value={searchQuery}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchApplications();
            }}
          />
          <button onClick={fetchApplications}>
            <Icon name="magnifying-glass" />
          </button>
        </div>
      </nav>

      <div className="results">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} me={me} session={session} token={token} />
        ))}
      </div>
    </>
  );
}
