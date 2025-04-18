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
  const [selectedTypes, setSelectedTypes] = useState(["plateforme", "outil", "jeu", "données", "forum"]);
  
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  
  const fetchApplications = useCallback(async () => {
    try {
      let url = process.env.NEXT_PUBLIC_SYNAPSE_API + "/applications";
      url += `?limit=30&tags=${selectedFilters.join(",")}&sort=${selectedSort}&type=${selectedTypes.join(",")}`;
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
  }, [selectedFilters, selectedSort, selectedTypes, searchQuery]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <>
      <nav>
        <h1>Applications</h1>
        <div>
          <button className="inverted outline flex gap-10 disabled">
            <Icon name="heart" />
            <span>Favoris</span>
          </button>

          <div className="dropdown">
            <button className="inverted outline flex gap-10" onClick={() => {
              const newState = !filterMenuOpen;
              setFilterMenuOpen(newState);
              if(newState) setSortMenuOpen(false);
              if(newState) setTypeMenuOpen(false);
            }}>
              <Icon name="filter" />
              <span>Filtrer ({selectedFilters.length})</span>
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
                        setTypeMenuOpen(false);
                      }}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown">
            <button className="inverted outline flex gap-10" onClick={() => {
              const newState = !typeMenuOpen;
              setTypeMenuOpen(newState);
              if(newState) setSortMenuOpen(false);
              if(newState) setFilterMenuOpen(false);
            }}>
              <Icon name="box" />
              <span>Types ({selectedTypes.length})</span>
            </button>
            {typeMenuOpen && (
              <div className="dropdown-menu outline">
                {[
                  "outil",
                  "jeu",
                  "plateforme", 
                  "données", 
                  "forum",
                ].map((tag) => (
                  <label key={tag} className="dropdown-item">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(tag)}
                      onChange={() => {
                        setSelectedTypes((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        );
                        setSortMenuOpen(false);
                        setFilterMenuOpen(false);
                      }}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown">
            <button className="inverted outline flex gap-10" onClick={() => {
              const newState = !sortMenuOpen;
              setSortMenuOpen(newState);
              if(newState) setFilterMenuOpen(false);
              if(newState) setTypeMenuOpen(false);
            }}>
              <Icon name="sort" />
              <span>Trier</span>
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