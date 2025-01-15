import fetch from "node-fetch";
import express from "express";
import * as dotenv from 'dotenv';
import path from "path";
import process from "process";

// retrieve the environment variables from .env
dotenv.config();

const SYNAPSE_API = "https://synapse-api.replit.app/api";
const CLIENT_ID = process.env.SYNAPSE_ID;
const CLIENT_SECRET = process.env.SYNAPSE_SECRET;

const app = express();
app.use(express.json());

// main route for Synapse authorization
app.get("/synapse/token", async (req, res) => {

  const url = `${SYNAPSE_API}/token?code=${req.query.code}`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
       Authorization: `Basic ${CLIENT_ID}:${CLIENT_SECRET}`
    }
  });

  // a JSON object is returned with token or error
  let data = await response.json();
  res.status(response.status).json(data);

});

// static files (html, css, ...) served from /dist and /static
app.use('/static', express.static(path.join(process.cwd(), "../client/static")));
app.use('/assets', express.static(path.join(process.cwd(), "../client/dist/assets")));

// generated pages served from React's dist/index.html
app.use('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(process.cwd(), "../client/dist/index.html"));
});

app.listen(8080);