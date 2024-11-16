import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuestionWithoutCorrectOptions } from "@/partykit/validators";
import { useState } from "react";

type QuestionProps = QuestionWithoutCorrectOptions & {
  timeleft: number | null;
  onAnswer: (optionId: number) => void;
  canAnswer: boolean;
};

export default function Question({
  text,
  options,
  timeleft,
  onAnswer,
  canAnswer,
}: QuestionProps) {
  const [selectedOption, setSelectedOption] = useState<Array<number>>([]);
  return (
    <div className="rounded-xl bg-gray-100 p-5 pb-7">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-bold">{text}</h2>
        <p className="">{timeleft}</p>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
        {options.map((option) => {
          const selected = selectedOption.includes(option.id);
          return (
            <li key={option.id}>
              <Button
                onClick={() => {
                  setSelectedOption([option.id]);
                  onAnswer(option.id);
                }}
                disabled={!canAnswer}
                variant="default"
                className={cn("w-full bg-sky-500 hover:bg-sky-400", {
                  "border-2 border-sky-500 bg-sky-400": selected,
                })}
              >
                {option.text}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
