import { Lightbulb, Shuffle } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ItemPage({ params }: Props) {
  const { id } = await params;
  const nextId = Number(id) >= 10 ? 1 : Number(id) + 1;

  const someData = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`,
  );
  const data = await someData.json();

  return (
    <div className="flex max-w-[80ch] flex-col gap-4">
      <h1 className="text-7xl">{`Dynamic Route`}</h1>
      <span className="text-3xl text-base-300">
        {`Url Param Value: `}
        <span className="text-base-800">{id}</span>
      </span>
      <p className="mt-4 flex w-fit items-center gap-2 text-sm">
        <Lightbulb className="h-full p-1" />
        Try replacing the value /dynamic-page/XXXX
      </p>
      <Link
        href={`/dynamic-page/${nextId}`}
        className="flex w-fit items-center gap-2 border bg-base-100 px-2 py-1 text-sm hover:bg-base-150"
      >
        <Shuffle className="h-full p-1" />
        Press to cycle the value of the url param
      </Link>

      <div className="flex max-w-[80ch] text-xl flex-col gap-8 break-words">
        <p>
          Try fetching some data here and awaiting before returning JSX. This
          means the page will be server-rendered and server all content at once
          with no client-side loading
        </p>
        <span>
          {`For example, fetching from https://jsonplaceholder.typicode.com/users/${id}, the username is: `}
          <span className="inline bg-base-150 px-2 py-1">{data.username}</span>
        </span>
      </div>
    </div>
  );
}