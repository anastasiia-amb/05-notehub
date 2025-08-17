import css from "./NoteForm.module.css";
import { createNote } from "../../services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateNoteParams } from "../../services/noteService";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";

interface NoteFormProps {
  onClose: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  content: Yup.string().max(500, "Too Long!"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

interface FormValues {
  title: string;
  content: string;
  tag: string;
}

const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });
  const createNewNote = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    const newNote: CreateNoteParams = {
      title: values.title,
      content: values.content,
      tag: values.tag as CreateNoteParams["tag"],
    };

    createNoteMutation.mutate(newNote);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={createNewNote}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            id="content"
            as="textarea"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" onClick={onClose} className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
