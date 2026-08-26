import { Blog, WithContext } from "schema-dts";

export default function JsonLd({ data }: { data: WithContext<Blog> }) {
  const jsonString = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}


