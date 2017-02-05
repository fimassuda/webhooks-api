# webhooks-api
Hootsuite Challenge - A project developed for Vanhackathon

* * *
# Challenge
Write a webhook calling service that will reliably POST data to destination URLs in the order POST message requests are received.

The service should support the following remote requests via REST
- register a new destination (URL) returning its id
- list registered destinations [{id, URL},...]
- delete a destination by id
- POST a message to this destination (id, msg-body, content-type): this causes the server to POST the given msg-body to the URL associated with that id.

**Behaviour:**
If the destination URL is not responding (e.g. the servier is down) or returns a non-200 response, your service should resend the message at a later time
- Messages not sent within 24 hours can be be deleted
- Messages that failed to send should retried 3 or more times before they are deleted
- Message ordering to a destination should be preserved, even when there are pending message retries for that destination
- Feel free to add more metadata to the destination (id, URL,) if it helps your implementation

**To Consider:**
- is your API using the standard REST-ful conventions for the 4 operations?
- how can I scale out this service across multiple servers while preserving per-destination ordering?
- how well does your service support concurrency for multiple destinations while preserving per-destination ordering?
- how secure is this? should you require HTTPS urls? should the content be signed with something like an HMAC?  Should any url be allowed (e.g. one that has or resolves to a private IP address?)

* * * 
# Project

Technologies and frameworks that I used:
- Node.JS
- Express.JS
- MongoDB
- Docker
- Amazon Elastic Beanstalk
- Swagger - API Documentation

There are two resources
- Webhooks
- Events

I tried a simple solutions saving the events in MongoDB with TTL that after 24 hours would be deleted with a [CRON execution](https://github.com/fimassuda/events-scheduler) that would interact with webhook events via HTTP requests in the API.

> I thought that saving the events in MongoDB would garantee the order by creation date, probably not the best solution


> Security requeriments like HTTPS and API Tokens are not addressed because it should be done by an API Gateway layer, not in the scope of the solutions
The overriding design goal for Markdown's
