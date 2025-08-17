import axios from "axios";
import type { Note } from "../types/note";

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

export const fetchNotes = async (
  page: number,
  query: string
): Promise<NoteResponse> => {
  const response = await axios.get<NoteResponse>(
    `https://notehub-public.goit.study/api/notes`,
    {
      params: {
        page: page,
        perPage: 12,
        search: query,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
};

export const createNote = async (newNote: CreateNoteParams): Promise<Note> => {
  const response = await axios.post<Note>(
    `https://notehub-public.goit.study/api/notes`,
    newNote,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
};
