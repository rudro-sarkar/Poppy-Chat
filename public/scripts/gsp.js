
const socket = io('/general', {
    auth: {
        userToken: userToken
    }
});
