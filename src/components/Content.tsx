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

  const deleteTopic = api.topic.delete.useMutation({
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
          className="w-full border-spacing-1 rounded-md border border-blue-800 p-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createTopic.mutate({
                title: e.currentTarget.value,
              });
              e.currentTarget.value = "";
            }
          }}
        />
        <ul className="mt-3 flex flex-col gap-1 overflow-x-hidden">
          {topics?.map((topic) => (
            <li
              key={topic.id}
              className={`group flex items-center rounded-md p-1  ${
                topic == selectedTopic ? "selected-topic" : "hover:bg-gray-200"
              }`}
            >
              <Link
                className="flex-1 p-1"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTopic(topic);
                }}
              >
                {topic.title}
              </Link>
              <button
                className="translate-x-20 cursor-pointer overflow-hidden rounded-md bg-red-500 p-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                onClick={(e) =>
                  deleteTopic.mutate({
                    id: topic.id,
                  })
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-3"></div>
    </div>
  );
};
