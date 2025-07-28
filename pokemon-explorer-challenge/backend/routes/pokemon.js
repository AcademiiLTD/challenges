import express from "express";
import fetch from "node-fetch";

const router = express.Router();

export const extractAPIData = (dataObj) => {
  const newOBj = {
    name: dataObj.name,
    sprite: dataObj.sprites.front_default,
    types: dataObj.types.map((typeObj) => {
      return typeObj.type.name;
    }),
  };
  return newOBj;
};

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
  const { name } = req.params;
  try {
    const APIRequest = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.trim()}`
    );

    switch (APIRequest.status) {
      case 200:
        const APIData = await APIRequest.json();
        const extractedData = extractAPIData(APIData);
        return res.status(200).json(extractedData);
      case 404:
        return res.status(404).json({ error: `Pokemon ${name} not found` });
      default:
        // Warn about unexpected statuses - should print to stdout, I think.
        // Should be captured and logged
        console.warn(
          `${Date.now()} - Unexpected status ${APIRequest.status} fetching ${
            APIRequest.url
          }`
        );
        return res
          .status(500)
          .json({ error: `We ran into an issue. Please try again later.` });
    }
  } catch (e) {
    // Error to stderr for capture - less volatile storage of error messages
    // For later action
    console.error(e);
    return res
      .status(500)
      .json({ error: "We ran into an issue. Please try again later." });
  }
});

export default router;
