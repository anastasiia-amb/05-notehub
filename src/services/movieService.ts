import axios from "axios";
import type { Movie } from "../types/movie";

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  page: number,
  query: string
): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        page: page,
        query: query,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
  return response.data;
};
