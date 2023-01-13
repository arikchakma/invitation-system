# Invitation System

This project is a simple invite system built using Next.js, Prisma, Next-Auth, React Query, mailing.run and Tailwind CSS. It allows you to invite team members to your project. I took the idea from the [dub](https://github.com/steven-tey/dub) project.

### Features

- User authentication and registration using Next-Auth
- Invitation management using Prisma
- Data Fetching using React Query
- Sending mail using Mailing.run
- Styling with Tailwind CSS

### Roadmap

- [ ] Add `app` subdomain for the application
- [ ] Add `api` subdomain for the API
- [ ] Add multi-tenancy

### Getting Started

1. Clone the repository and install the dependencies:

```bash
git clone https://github.com/arikchakma/invitation-system.git
cd invitation-system
pnpm install
```

2. Create a .env file in the root of the project and add your Prisma, mailing.run and Next-Auth credentials.

3. Start the development server:

```bash
pnpm dev
```

### Deployment

You can deploy this application to any environment that supports Next.js. I recommend using Vercel.

### Built With

- [Next.js](https://nextjs.org) - The web framework used
- [Prisma](https://prisma.io) - Database management
- [Next-Auth](https://next-auth.js.org/) - Authentication and authorization
- [React Query](https://tanstack.com/query/latest) - Data Fetching
- [Mailing.run](https://www.mailing.run/) - Sending mail
- [Tailwind CSS](https://tailwindcss.com/) - Styling

### Contributing

If you would like to contribute to this project, please submit a pull request.

### Acknowledgments

- Thanks to the developers and contributors of the technologies used in this project.

### Note

Please keep in mind that you need to setup Prisma, mailing.run, and the database by yourself, this readme is just for the setup of the application.

## Author

- Arik Chakma - [@imarikchakma](https://twitter.com/imarikchakma)
