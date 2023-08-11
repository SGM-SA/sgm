# SGM / web

## Todo

- [ ] Authentication
  - [ ] Switch from username to mail (with confirmation mail)
  - [x] Test token expiration
  - [x] *Refresh token?* (or expire token after much longer time)
  - [x] Logout
  - [x] Login
- [ ] Error handling
  - [ ] Page/components (Catch & 404)
  - [ ] API calls (Popup)
  - [ ] Check for a more FP way of handling errors (rather than ungly try/catch)
- [ ] Layout
  - [ ] Sidebar menu
- [ ] Pages
  - [ ] ...

## Stack

- UI Library: [react](https://reactjs.org/)
- Bundler: [vite](https://vitejs.dev/)
- Router: [generouted](https://github.com/oedotme/generouted) (file based routing leveraging `react-router-dom`)
- Data fetching: [@tanstack/query](https://react-query.tanstack.com/)