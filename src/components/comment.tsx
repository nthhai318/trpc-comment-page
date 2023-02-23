import { useState } from "react";
import { useSession } from "next-auth/react";
import { type RouterOutputs, api } from "~/utils/api";

type Topic = RouterOutputs["topic"]["getAll"][0];

export const Comment = ({ topic }: { topic: Topic }) => {
  const { data: sessionData } = useSession();
  const [comment, setComment] = useState<string>("");

  const { data: comments, refetch: refetchComment } = api.note.getAll.useQuery(
    { topicId: topic.id },
    { enabled: sessionData?.user !== undefined }
  );

  comment;

  const createComment = api.note.create.useMutation({
    onSuccess: () => {
      void refetchComment();
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div>Topic: {topic.title}</div>
      <div>
        <p>
          Commentor: <strong>{sessionData?.user.name}</strong>
        </p>
      </div>

      <textarea
        className="w-3/4 border p-2"
        name="comment"
        id="comment"
        cols={50}
        rows={3}
        onChange={(e) => {
          setComment(e.target.value);
          console.log("comment: ", e.target.value);
          console.log("title: ", sessionData?.user.name);
          console.log("topicId: ", topic.id);
        }}
      />
      <button
        className="mr-auto rounded-md bg-blue-300 p-2"
        onClick={() => {
          createComment.mutate({
            title: sessionData?.user.name,
            content: comment,
            topicId: topic.id,
          });
          setComment("");
        }}
      >
        Submit Comment
      </button>
      <ul>
        {comments?.reverse().map((com) => (
          <li key={com.id}>
            <p>
              Commented by <strong>{com.title}</strong>
            </p>
            <p>{com.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
