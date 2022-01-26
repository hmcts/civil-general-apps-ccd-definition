# civil-general-apps-ccd-definition

## Build (Dev)

run:

```
./bin/import-ccd-definition-dev.sh
```
## Testing

The repo uses codeceptjs framework for e2e tests.

To install dependencies enter `yarn install`.

To run e2e tests enter `yarn test:e2e` in the command line.

### Optional configuration

To run tests with browser window open set `SHOW_BROWSER_WINDOW=true`. By default, the browser window is hidden.

### Smoke test

To run smoke tests enter `yarn test:smoke`.

### API test

Before running API tests, you will need the `SENDGRID_API_KEY` environment variable setup and to be running the service locally along with all containers.

To run API tests enter `yarn test:api`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
