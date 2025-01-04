# Forcoding

Javascript + HTML + CSS editor for up to 4 people.

### Technologies used

- Typescript
- Express
- Socket.IO

---

### To try it locally

The client repository expects a `.env` file in its root directory with the following:

```
VITE_SOCKET_ENDPOINT=localhost:4000/
```

Once that is set run in separate terminals:

```bash
$ npm run dev:server
$ npm run dev:client
```
