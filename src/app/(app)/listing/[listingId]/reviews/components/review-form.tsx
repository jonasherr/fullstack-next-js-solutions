import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ActionResponseType } from "@/lib/types/form";
import { useActionState } from "react";
import { addReview } from "../lib/api/addReview";
import { InsertReview } from "../lib/db/reviews.sql";

type ReviewFormProps = {
  userId: string;
  listingId: string;
  addOptimistic: (action: InsertReview) => void;
};

export const ReviewForm = ({
  userId,
  listingId,
  addOptimistic,
}: ReviewFormProps) => {
  const [state, formAction] = useActionState(addReview, {
    message: "",
    userId,
    type: ActionResponseType.success,
  });

  const handleSubmit = async (formData: FormData) => {
    const review: InsertReview & { id: string } = {
      id: "optimistic",
      rating: parseInt(formData.get("rating") as string),
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      date: new Date().toLocaleDateString("de-de"),
      userId: 0,
      listingId: 0,
    };

    addOptimistic(review);

    formAction(formData);
  };

  return (
    <form
      className="grid w-full gap-1.5 mt-10 max-w-xl mx-auto"
      action={handleSubmit}
    >
      <Label htmlFor="rating">Sterne</Label>
      <Input
        id="rating"
        name="rating"
        type="number"
        defaultValue={1}
        min={1}
        max={5}
        required
      />
      <Label htmlFor="title">Titel</Label>
      <Input id="title" name="title" type="text" required />
      <Label htmlFor="content">Neue Bewertung</Label>
      <Textarea
        placeholder="Schreibe deine Bewertung."
        id="content"
        name="content"
        rows={5}
        required
      />
      <Label htmlFor="name">Dein Name</Label>
      <Input id="name" name="name" type="text" required />
      <input hidden name="listingId" value={listingId} readOnly />

      {state.message && (
        <p
          className={
            state.type === ActionResponseType.success
              ? "text-green-500"
              : "text-red-500"
          }
        >
          {state.message}
        </p>
      )}
      <Button>Senden</Button>
    </form>
  );
};
