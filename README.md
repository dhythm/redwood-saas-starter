# README
## How to create the environment
```sh
yarn create redwood-app redwood-saas-starter --typescript
cd redwood-saas-starter
yarn rw setup ui chakra-ui
yarn add @chakra-ui/icons
yarn rw setup auth dbAuth
yarn rw g dbAuth
yarn add recoil
```

## Getting Started
### Set up DB by Docker
```sh
docker-compose run -p 5432:5432 -d postgres
yarn rw prisma migrate dev
yarn rw prisma db seed
yarn rw prisma migrate reset
yarn rw prisma migrate reset --skip-seed

docker exec -it <CONTAINER_ID> psql -U postgres
```

### Create secure SESSION_SECRET
Generate SESSION_SECRET and put it to `.env` or own environment variables.
`yarn rw g dbAuth` automatically adds it to `.env`

```sh
yarn rw g secret
```

### Run App
```sh
yarn rw dev
```

## How to develop App
```sh
# create a new page
yarn rw g page home /

# create a new layout
yarn rw g layout main

# create a new stuff with scaffold
yarn rw g scaffold post

# create a new cell and generate its GraphQL schema
yarn rw g sdl Organization
yarn rw g cell Organization

# and more..., https://redwoodjs.com/docs/cli-commands#generate-alias-g
```

### Frontend
```sh
yarn rw storybook
```

### Testing
```sh
yarn rw test
```

### More
RedwoodJS has been discussing the actual multi-tenancy feature.
https://github.com/redwoodjs/redwood/issues/5821
