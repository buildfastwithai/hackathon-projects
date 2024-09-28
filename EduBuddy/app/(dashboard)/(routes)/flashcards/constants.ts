import z from 'zod';

export const formSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
    numFlashcards: z.number().min(1, "At least one flashcard is required").optional(),
  });