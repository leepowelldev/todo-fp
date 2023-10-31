# todo-app

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

This project was created using `bun init` in bun v1.0.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Reading

https://fsharpforfunandprofit.com/posts/against-railway-oriented-programming/

"Result should only be used as part of the domain modeling process, to document expected return values. And then to ensure at compile-time that you handle all the possible expected error cases."

# Controllers

Controllers are part of the application/infra layer

Controllers are responsible for handling incoming requests and returning responses to the client.

Controller should not contain domain/business logic, they should orchestrate the return values from derivers and render the appropriate response to the user

https://antman-does-software.com/stop-catching-errors-in-typescript-use-the-either-type-to-make-your-code-predictable
https://antman-does-software.com/applying-googles-testing-methodology-to-functional-domain-driven-design-for-scalable-testing
https://antman-does-software.com/functional-domain-driven-design-simplified

"Notice, however, that the Controller does not make any business decisions. It only takes actions based on the result of the Deriver. It does not validate the subscriptions, and it does not check any rules."

https://fsharpforfunandprofit.com/posts/against-railway-oriented-programming/

https://blog.logrocket.com/javascript-either-monad-error-handling/
https://dev.to/blindpupil/domain-driven-architecture-in-the-frontend-ii-1dm9
https://github.com/Blindpupil/family-cookbook/tree/6b817e32ed5adf2dfc55372da2951f24035ee849
https://matthiasnoback.nl/2022/09/is-it-a-dto-or-a-value-object/

# DTOs

A DTO should only be used in two places: where data enters the application or where it leaves the application. Some examples:

- When a controller receives an HTTP POST request, the request data may have any shape. We need to go from shapeless data to data with a schema (verified keys and types). We can use a DTO for this. A form library may be able to populate this DTO based on submitted form data, or we can use a serializer to convert the plain-text request body to a populated DTO.
- When we make an HTTP POST request to a web service, we may collect the input data in a DTO first, and then serialize it to a request body that our HTTP client can send to the service.
  For queries the situation is similar. Here we can use a DTO to represent the query result. As an example we can pass a DTO to a template to render a view based on it. We can use a DTO, serialize it to JSON and send it back as an API response.
- When we send an HTTP GET request to a web service, we may deserialize the API response into a DTO first, so we can apply a known schema to it instead of just accessing array keys and guessing the types. API client packages usually offer DTOs for requests and responses.

## A DTO:

- Declares and enforces a schema for data: names and types
- Offers no guarantees about correctness of values

https://medium.com/@yelinliu/dto-explained-in-nestjs-3a296498d77b

## A value object:

- Wraps one or more values or value objects
- Provides evidence of the correctness of these values

# Application vs Domain

https://matthiasnoback.nl/2021/02/does-it-belong-in-the-application-or-domain-layer/

# Services

Used for dealing with third parties
