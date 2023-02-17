import { useRouter } from "next/router";

export default function Chat() {
  const router = useRouter();
  const { slug } = router.query as {
    slug: string;
  };

  if (!slug) {
    return null;
  }
  return (
    <div>Chat</div>
  )
}
