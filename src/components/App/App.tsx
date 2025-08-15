import css from "./App.module.css";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

import { useEffect, useState } from "react";
import { fetchMovies } from "../../services/movieService";
import type { MoviesResponse } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginate from "react-paginate";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => setSelectedMovie(null);
  const { data, isLoading, isError, isSuccess } = useQuery<MoviesResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(page, query),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });
  const totalPages = data?.total_pages || 1;

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const handleSearch = (query: string) => {
    setQuery(query);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <MovieGrid onSelect={openModal} movies={data?.results ?? []} />
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      <Toaster position="top-center" />
    </div>
  );
}
