# nodecrm

## ADALJS-Custom Branch
This branch is an experimental attempt to implement a more robust authentication scheme. The adal-ts/adal-typescript packages are great but they're not super robust and don't provide support for multiple AAD resources. For example, if I want to get access tokens for both graph.microsoft.com and tenant-name.sharepoint.com using a single app id and a single login, those libraries do not provide (obvious - I might be missing something) support. Instead, this branch will follow the guidance provided by (the great) Waldek Mastykarz [here](https://blog.mastykarz.nl/building-office-365-web-applications-react/). The changes here will probably only be relevant for the client code.

## Resources
[Typescript Express Sample](https://github.com/Microsoft/TypeScript-Node-Starter#typescript-node-starter)
[Adal-ts](https://github.com/HNeukermans/adal-ts/pull/26)