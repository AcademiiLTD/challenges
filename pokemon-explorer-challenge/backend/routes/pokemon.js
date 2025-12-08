import express from "express";
import fetch from "node-fetch";

const router = express.Router();

/**
 * GET /api/pokemon/:name
 *
 * Fetches Pokemon data from the PokeAPI and returns a simplified response
 * containing only the name, sprite, and types.
 *
 * TODO: Implement this route handler to:
 * 1. Fetch Pokemon data from https://pokeapi.co/api/v2/pokemon/{name}
 * 2. Extract only the name, sprite (front_default), and types
 * 3. Return a simplified JSON response
 * 4. Handle errors appropriately (404 for Pokemon not found, 500 for server errors)
 */
router.get("/:name", async (req, res) => {
  // TODO: Implement this route handler
  const rawName = req.params.name;
  const name = rawName?.trim().toLowerCase();

  if (!name || !/^[a-z]+$/.test(name)) {
    return res.status(400).json({error: "Bad request: Invalid input"})
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`)

    if (response.status === 404) {
      return res.status(404).json({message: "Pokemon not found"})
    }

    if (!response.ok) {
      return res.status(502).json({message: "Failed to fetch data"})
    }

    if (response.ok) {
      const rawData = await response.json();
      // const data = name: rawData.name,
      //   sprite: rawData.sprites?.front_default,
      //   types: rawData.types?.map(type => type.type.name);

      return res.status(200).json({name: rawData.name, sprite: rawData.sprites?.front_default, types: rawData.types?.map(type => type.type.name)})
    }

  } catch (error) {
    console.error("Error fetching data", error);
    return res.status(500).json({ message: "internal server error"})
  }

  res.status(501).json({ error: "Not implemented" });
});

export default router;
