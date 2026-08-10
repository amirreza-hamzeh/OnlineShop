const storage = () => typeof localStorage === 'undefined' ? null : localStorage;

export const getJwtToken = () => storage() ? storage().getItem('jwtToken') : null;
export const setJwtToken = token => { if (storage()) storage().setItem('jwtToken', token); };
export const removeJwtToken = () => { if (storage()) storage().removeItem('jwtToken'); };
