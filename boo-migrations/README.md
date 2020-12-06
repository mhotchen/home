```
npm i
./generate-config dev
npx ts-node ./node_modules/typeorm/cli.js migration:create -d migrations -n [Name of migration]
npx ts-node ./node_modules/typeorm/cli.js migration:run
```