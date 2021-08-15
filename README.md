## Description

[salesServer](https://github.com/muckiware/muckidrive) muckiDrive server system repository.

## Installation

```bash
$ npm install
```

## Running the server

```bash
# start server application
$ nest start
```

```YAML
# etc/config.yml
http:
  host: '127.0.0.1'
  port: 3000

db:
  type: 'mysql'
  url: 'localhost'
  port: 3306
  database: 'mydatabase'
  username: 'database_user'
  password: 'database_password'
  entityPrefix: 'random_prefix_'
  logging: false

grapgql:
  debug: false
  playground: true
  schemaPath: './var/etc/schema.gql'

auth:
  backend:
    jwt:
      secret: 'my_random_jwt_secret_key'
      signOptions:
        expiresIn: '20s' #Eg: 60, "2 days", "10h", "7d"
```

## License
smoppit sales server is [MIT licensed](LICENSE).
