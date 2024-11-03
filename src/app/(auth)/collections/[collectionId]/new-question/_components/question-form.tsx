import { Button } from "@/components/ui/button";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  type QuestionFormData,
  questionSchema,
} from "@/server/api/routers/question/question-validators";
import { Checkbox } from "@/components/ui/checkbox";

type QuestionFormProps = {
  onSubmit: SubmitHandler<QuestionFormData>;
  defaultValues?: QuestionFormData;
  collectionId: number;
};

export default function QuestionForm({
  onSubmit,
  collectionId,
  defaultValues = { text: "", options: [], collectionId, choices_limit: 1 },
}: QuestionFormProps) {
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues,
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "options",
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input
                  placeholder="What is the capital of Morocco?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="choices_limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selected options limit</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1" {...field} />
              </FormControl>
              <FormDescription>
                The maximum number of options that can be selected
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-1">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`options.${index}.text`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option</FormLabel>
                  <div className="flex items-center gap-x-1">
                    <FormControl>
                      <Input placeholder="Meknes" {...field} />
                    </FormControl>
                    <FormField
                      control={form.control}
                      name={`options.${index}.isCorrect`}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            append({ text: "", isCorrect: false });
          }}
        >
          New Option
        </Button>
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
}
