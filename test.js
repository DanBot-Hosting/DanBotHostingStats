;(async () => {
    const users = await userData.all();

    await console.log(users);
})();