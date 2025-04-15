"use client"

import React, { useCallback, useEffect, useState } from "react";
import "./Trade.css";
import MissionCard from "@/components/MissionCard";
import { Mission } from "@/types/models";
import ItemCard from "@/components/ItemCard";

export default function Trade() {

  const [missions, setMissions] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingMissions, setLoadingMissions] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedSort, setSelectedSort] = useState("value");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMissions = useCallback(async () => {
    try {
      let url = process.env.NEXT_PUBLIC_SYNAPSE_API + "/missions";
      url += `?limit=30&sort=${selectedSort}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMissions(data.missions);
      setLoadingMissions(false);
      
    } catch (err) {
      console.error(err);
    }
  }, [selectedSort, searchQuery]);

  const fetchItems = useCallback(async () => {
    try {
      let url = process.env.NEXT_PUBLIC_SYNAPSE_API + "/items";
      url += `?limit=30&sort=${selectedSort}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data.items);
      setLoadingItems(false);

    } catch (err) {
      console.error(err);
    }
  }, [selectedSort, searchQuery]);

  useEffect(() => {
    fetchMissions();
    fetchItems();
  }, [fetchMissions]);

  return <div className="cols equal">
    <div className="bubble transparent full-height">
      <h1>Missions</h1>
      <div className="missions">
        { loadingMissions ? <span>Chargement des missions...</span> 
          : (missions.length > 0
          ? missions.map(mission => <MissionCard mission={mission} />)
          : <span>Aucune mission disponible pour l'instant.</span>)
        }
      </div>
    </div>
    <div className="bubble transparent full-height">
      <h1>Items</h1>
      <div className="items">
        { loadingItems ? <span>Chargement des items...</span> 
          : (items.length > 0
          ? items.map(item => <ItemCard item={item} />)
          : <span>Aucun item disponible pour l'instant.</span>) 
        }
      </div>
    </div>
  </div>;
  
}