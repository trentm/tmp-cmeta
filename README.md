
```
% node userapp.js
AGENT: start gathering                      <-- start gathering on agent.start()
AGENT: agent started
USERAPP: sending span                       <-- app sends span before gathering is done
AGENT: sending a span
USERAPP: listening at http://localhost:3000
AGENT: done gathering                       <-- when gathered ...
CLIENT: got encoded metadata                <-- client gets it and uses it:
{"thisIsMyCloud":"there are many like it"}
{"name":"setup","time":"2021-01-08T00:59:04.664Z"}
AGENT: emitted metadata event

                                            <-- curl localhost:3000
AGENT: sending a span
CLIENT: got encoded metadata                <-- gets cached metadata
{"thisIsMyCloud":"there are many like it"}
{"name":"handled request","time":"2021-01-08T00:59:15.702Z"}
^C
```

Or with a number of `curl localhost:3000` requests before the metadata is
gathered they buffer up on that `this._conf.metadataGatherer.once('metadata',`.

```
% node userapp.js
AGENT: start gathering
AGENT: agent started
USERAPP: sending span
AGENT: sending a span
USERAPP: listening at http://localhost:3000
AGENT: sending a span
AGENT: sending a span
AGENT: sending a span
AGENT: done gathering
CLIENT: got encoded metadata
{"thisIsMyCloud":"there are many like it"}
{"name":"setup","time":"2021-01-08T01:00:16.114Z"}
CLIENT: got encoded metadata
{"thisIsMyCloud":"there are many like it"}
{"name":"handled request","time":"2021-01-08T01:00:18.183Z"}
CLIENT: got encoded metadata
{"thisIsMyCloud":"there are many like it"}
{"name":"handled request","time":"2021-01-08T01:00:18.911Z"}
CLIENT: got encoded metadata
{"thisIsMyCloud":"there are many like it"}
{"name":"handled request","time":"2021-01-08T01:00:19.579Z"}
AGENT: emitted metadata event
```

If we are worried about that buffering too large, then we could consider a
limited queue, but I'm not sure that's a concern for startup time.
