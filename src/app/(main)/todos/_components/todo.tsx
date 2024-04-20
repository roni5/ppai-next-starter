"use client";

import { Todo } from "@/db/schema";
import { TrashIcon } from "lucide-react";
import { useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { deleteTodoAction, setTodoCompleteStatusAction } from "./actions";
import { LoaderButton } from "@/components/loader-button";
import { Checkbox } from "@/components/ui/checkbox";

function TodoCheckbox({ todo }: { todo: Todo }) {
  const [pending, startTransition] = useTransition();

  return (
    <Checkbox
      checked={todo.isCompleted}
      id={todo.id}
      onCheckedChange={(checked) => {
        startTransition(() => {
          setTodoCompleteStatusAction(todo.id, checked as boolean);
        });
      }}
    />
  );
}

export function Todo({ todo }: { todo: Todo }) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  return (
    <div
      key={todo.id}
      className="flex gap-8 items-center border-b py-4 last:border-b-0"
    >
      <TodoCheckbox todo={todo} />

      <label
        htmlFor={todo.id}
        className="text-2xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {todo.text}
      </label>

      <LoaderButton
        isLoading={pending}
        size="icon"
        onClick={() => {
          startTransition(() => {
            deleteTodoAction(todo.id)
              .then(() => {
                toast({
                  title: "Todo Deleted",
                  description: "Your todo has been removed",
                });
              })
              .catch((e) => {
                toast({
                  title: "Something went wrong",
                  description: e.message,
                  variant: "destructive",
                });
              });
          });
        }}
        variant="destructive"
        title="Delete Todo"
      >
        <TrashIcon className="w-4 h-4" />
      </LoaderButton>
    </div>
  );
}