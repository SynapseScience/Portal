import React from "react";
import Mention from "@/components/Mention";
import Icon from "@/components/Icon";
import Link from "next/link";
import { notFound } from "next/navigation";
import "./App.css";
import { Application, Mission } from "../../../types/models";
import LikeButton from "@/components/LikeButton";
import MissionCard from "@/components/MissionCard";

async function getAppData(client_id: string, apiUrl: string) {
  const response = await fetch(`${apiUrl}/application?client_id=${client_id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return null;
  return await response.json();
}

async function getMissions(client_id: string, apiUrl: string) {
  const response = await fetch(`${apiUrl}/missions?application=${client_id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return null;
  return await response.json();
}

function dateToString(dateSeed: string) {
  const date = new Date(dateSeed);
  const dd = date.getDate().toString().padStart(2, "0");
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

type Props = {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_SYNAPSE_API;
  
  const res = await fetch(`${apiUrl}/application?client_id=${id}`);
  if (!res.ok) {
    return {
      title: "Application inconnue",
      description: "Cette application n'existe pas ou a été supprimée.",
    };
  }

  const app = await res.json();

  return {
    title: `Synapse | ${app.title}`,
    description: app.description,
    openGraph: {
      title: app.title,
      description: app.description,
      url: `https://synapse.example.com/app/${id}`,
      siteName: "Synapse",
      images: [
        {
          url: app.thumbnail || process.env.NEXT_PUBLIC_SYNAPSE_STATIC + "/assets/banner.jpg",
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: app.title,
      description: app.description,
      images: [app.thumbnail || process.env.NEXT_PUBLIC_SYNAPSE_STATIC + "/assets/banner.jpg"],
    },
  };
}

export default async function AppPage({ params }: Props) {
  const p = await params;
  const client_id = p.id;
  
  const apiUrl = process.env.NEXT_PUBLIC_SYNAPSE_API as string;
  const app = await getAppData(client_id, apiUrl) as Application;
  const missionsResponse = await getMissions(client_id, apiUrl);
  const missions = missionsResponse.missions as Mission[];
  
  if (!app) return notFound();

  return (
    <>
      <div className="cols" style={{ gap: "0px" }}>
        <div className="bubble transparent flex-col gap-20">
          { app.thumbnail && <div className="thumbnail outline" style={{
            backgroundImage: `url(${app.thumbnail})`,
            backgroundSize: "cover"
          }}>
          </div> }
          <div className="bubble outline app">
            <div className="banner"></div>
            <div className="details">
              <h1>{app.title}</h1>
              <span>
                #{app.client_id}
                {app.authors.length > 0 ? " par " : ""}
                {app.authors.map((author: string) =>
                  author.startsWith("$") ? author.replace("$", "").trim() : 
                    <Mention username={author} />
                )}
              </span>
              <div className="cols">
                {<LikeButton app={app} />}
                <Link href={app.link} target="_blank" rel="noopener noreferrer">
                  <button>Visiter</button>
                </Link>
              </div>
              <p>{app.description}</p>
              <span className="app-date"
                >Enregistrée le {dateToString(app.creation)}</span>
            </div>
          </div>
        </div>

        <div className="bubble transparent flex-col gap-30" style={{ marginRight: "0px", paddingLeft: "0px" }}>
          <div className="flex-col gap-10">
            <h1>Particularités</h1>
            <div className="specs">
              {[
                {
                  "test": (app: Application) => app.type,
                  "line": (app: Application) => `Média de type '${app.type}'`,
                  "icon": "question"
                },
                {
                  "test": (app: Application) => app.verified,
                  "line": (app: Application) => "Publié sur le catalogue public",
                  "icon": "check"
                },
                {
                  "test": (app: Application) => !app.verified,
                  "line": (app: Application) => "Média en attente de vérification",
                  "icon": "hourglass-half"
                },
                {
                  "test": (app: Application) => app.permissions.includes("economy"),
                  "line": (app: Application) => "Application intégrée à l'économie SYN",
                  "icon": "coins"
                },
                {
                  "test": (app: Application) => app.tags.includes("partenaire"),
                  "line": (app: Application) => "Partenaire vérifié de l'écosystème Synapse",
                  "icon": "handshake"
                },
                {
                  "test": (app: Application) => app.tags.includes("open-source"),
                  "line": (app: Application) => "Code source disponible en sources ouvertes",
                  "icon": "git-alt",
                  "prefix": "fab"
                },
                {
                  "test": (app: Application) => app.tags.includes("indépendant"),
                  "line": (app: Application) => "Aut.eur.rice indépendant.e",
                  "icon": "person"
                },
              ].map(
                (tag) =>
                  tag.test(app) && (
                    <div key={tag.line(app)}>
                      <Icon name={tag.icon} prefix={tag.prefix || "fas"} /> {tag.line(app)}
                    </div>
                  )
              )}
            </div>
          </div>
          <div className="flex-col gap-10">
            <h1>Métadonnées</h1>
            <div>
              {app.tags.length > 0 ? app.tags.join(', ') : <span>Aucun tag fourni pour cette application.</span>}
            </div>
          </div>
          <div className="flex-col gap-10">
            <h1>Missions rattachées</h1>
            <div className="missions">{
              missions.length > 0 
                ? missions.map(mission => {
                  return <MissionCard mission={mission} />
                })
                : <span>Aucune mission concernant cette application.</span>
            }</div>
          </div>
        </div>
      </div>
    </>
  );
}