// lib/star-wars.d.ts

declare module 'star-wars' {
  export const starWars: {
    searchCharacters: (query: string) => Promise<{ results: any[] }>;
    searchPlanets: (query: string) => Promise<{ results: any[] }>;
    searchSpecies: (query: string) => Promise<{ results: any[] }>;
    getCharactersById: (id: string) => Promise<any>;
    getPlanetsById: (id: string) => Promise<any>;
    getSpeciesById: (id: string) => Promise<any>;
    getFilmsById: (id: string) => Promise<{ title: string }>;
  };
}
