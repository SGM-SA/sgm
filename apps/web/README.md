# SGM / web

## Todo

### Global
- [ ] Authentication
  - [x] Switch from username to mail (with confirmation mail)
  - [x] Test token expiration
  - [x] *Refresh token?* (or expire token after much longer time)
  - [x] Logout
  - [x] Login
- [ ] Error handling
  - [ ] Page/components (Catch & 404)
  - [ ] API calls (Popup)
  - [ ] Check for a more FP way of handling errors (rather than ungly try/catch)
- [ ] Layout
  - [x] Sidebar menu

### Liste des affaires

- [ ] Min height sur le tableau (doit prendre tout l'espact)
- [ ] Tri
  - [ ] Date de rendu
  - [ ] Numéro d'affaire
- [ ] Recherche (num_affaire, client ou description en 3 in 1) 
- [ ] Chat room
  - [ ] 

---

## Stack

- UI Library: [react](https://reactjs.org/)
- Bundler: [vite](https://vitejs.dev/)
- Router: [generouted](https://github.com/oedotme/generouted) (file based routing leveraging `react-router-dom`)
- Data fetching: [@tanstack/query](https://react-query.tanstack.com/)