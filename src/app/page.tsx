import Link from "next/link";

export default function Home() {
  return (
    <div className="flex max-w-[80ch] flex-col gap-4">
      <h1 className="text-7xl">Next.js Quickstart</h1>
      <h3 className="text-3xl">This quickstart web template includes:</h3>
      <ul className="w-fit list-inside list-disc text-base-700">
        <li>TypeScript</li>
        <li>Next.js</li>
        <li>React</li>
        <li>Tailwind</li>
        <li>ESLint</li>
        <li>Prettier</li>
        <li>Lucide Icons</li>
        <li>Vercel Analytics</li>
        <li>{`"Overused Grotesk" typeface`}</li>
        <li>
         {` "npm run dev" will start the app and run Tailwind's watch command
          concurrently`}
        </li>
      </ul>
      <div>
        <Link
          href="/dynamic-page/1"
          className="rounded-full border bg-base-100 px-3 py-2 shadow-sm hover:bg-base-150"
        >
          {`Dynamically routed page (SSR)`}
        </Link>
      </div>
    </div>
  );
}
