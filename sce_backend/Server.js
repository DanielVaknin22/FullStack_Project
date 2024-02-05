const appInit = require("./App");
const port = process.env.PORT;

appInit.then((app) => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`)ף
    });
});
