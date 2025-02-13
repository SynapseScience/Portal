"use client";

import React, { useState, useEffect, useCallback } from "react";
import AppCard from "../components/AppCard";
import Icon from "../components/Icon";
import "./Home.css";
import { Application } from "@/types/models";

export default function Home() {
  
  const [apps, setApps] = useState([]);
  const [searchQuery, setQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [selectedFilters, setSelectedFilters] = useState(["indépendant", "francophone"]);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  const fetchApplications = useCallback(async () => {
    try {
      let url = process.env.NEXT_PUBLIC_SYNAPSE_API + "/applications";
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
  }, [selectedFilters, selectedSort, searchQuery]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <>
      <nav>
        <h1>Applications</h1>
        <div>
          <button className="inverted outline disabled">
            <Icon name="heart" />
          </button>

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
        {apps.map((app: Application) => (
          <AppCard key={app.client_id} app={app} />
        ))}
      </div>
    </>
  );
}