"use client";

import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/empty";

type Flashcard = {
  title: string;
  content: string;
};

export default function FlashcardGenerator() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<{ topic: string }>();

  const onSubmit = async (data: { topic: string }) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/flashcards', { topic: data.topic });
      const newFlashcard: Flashcard = { 
        title: response.data.title, 
        content: response.data.content 
      };
      setFlashcards((prev) => [...prev, newFlashcard]);
    } catch (error) {
      console.error("Error generating flashcard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Heading 
        title="Flashcard Generator" 
        description="Generate flashcards for any topic." 
        icon = {ImageIcon} 
        iconColor="text-pink-700"
        bgColor="bg-pink-500/10" 
      />
      <div className="px-4 lg:px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} 
          className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
            <FormField
              name="topic"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      placeholder="Promise in JavaScript"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button 
                className="col-span-12 lg:col-span-2 w-full" 
                disabled={isLoading}>
              Generate
            </Button>
          </form>
        </Form>

        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {flashcards.length === 0 && !isLoading && 
            <div>
                <Empty label="No conversation started." />
            </div> 
          }

          {flashcards.map((flashcard, index) => (
            <Card key={index} className="mt-4">
              <CardHeader>
                <CardTitle>{flashcard.title}</CardTitle> {/* Title is the topic */}
              </CardHeader>
              <CardContent>
                <p>{flashcard.content}</p> {/* Content is the response */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
