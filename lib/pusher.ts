import PusherServer from 'pusher';

// console.log(
//   process.env.PUSHER_APP_ID,
//   process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
//   process.env.PUSHER_APP_SECRET,
//   process.env.NEXT_PUBLIC_PUSHER_SERVER_HOST,
//   process.env.NEXT_PUBLIC_PUSHER_SERVER_PORT,
//   process.env.NEXT_PUBLIC_PUSHER_SERVER_TLS
// );

export const pusherServerClient = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  host: process.env.NEXT_PUBLIC_PUSHER_SERVER_HOST!,
  port: process.env.NEXT_PUBLIC_PUSHER_SERVER_PORT!,
  useTLS: process.env.NEXT_PUBLIC_PUSHER_SERVER_TLS === 'true',
  cluster: 'us2',
});
