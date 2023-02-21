import { useSession } from "next-auth/react";
import { api, type RouterOutputs } from "~/utils/api";
import Link from "next/link";
import { useState } from "react";

type Topic = RouterOutputs["topic"]["getAll"][0];

export const Content = () => {
  const { data: sessionData } = useSession();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined, //no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      },
    }
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
  });

  return (
    <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
      <div className="px-2">
        <input
          type="text"
          placeholder="New Topic"
          className="w-full border-spacing-1 border border-blue-800 "
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createTopic.mutate({
                title: e.currentTarget.value,
              });
              e.currentTarget.value = "";
            }
          }}
        />
        <ul className="p-2">
          {topics?.map((topic) => (
            <li key={topic.id} className="p-1">
              <Link
                className={`block p-1 ${
                  topic == selectedTopic ? "selected-topic" : ""
                }`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTopic(topic);
                }}
              >
                {topic.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-3"></div>
    </div>
  );
};
