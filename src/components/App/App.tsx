import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";

import css from "./App.module.css";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import { useDebounce } from "use-debounce";
import type { NoteResponse } from "../../services/noteService";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [debouncedQuery] = useDebounce(query, 300);

  const handleChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const { data } = useQuery<NoteResponse>({
    queryKey: ["notes", debouncedQuery, page],
    queryFn: () => fetchNotes(page, debouncedQuery),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onChange={handleChange} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        <button className={css.button} onClick={openModal}>
          Create note
        </button>
      </header>
      {isOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
      {data?.notes && <NoteList notes={data?.notes} />}
    </div>
  );
}
