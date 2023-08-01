const getAuthUser = () => {

    const jwt = window.localStorage.getItem('jwt')

    if (!jwt) return null
    else return JSON.parse(atob(jwt))
}

const actions = {
    login: (user: any) => {
        
    }
}