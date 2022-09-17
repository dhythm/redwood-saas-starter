# README
## How to create the environment
```sh
yarn create redwood-app redwood-saas-starter --typescript
cd redwood-saas-starter
yarn rw setup ui chakra-ui
yarn rw setup auth dbAuth
yarn rw g dbAuth
```

## Getting Started
### Set up DB by Docker
```sh
docker-compose run -p 5432:5432 -d postgres
yarn rw prisma migrate dev
yarn rw prisma db seed

docker exec -it <CONTAINER_ID> psql -U postgres
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
```

### Frontend
```sh
yarn rw storybook
```

### Testing
```sh
yarn rw test
```
