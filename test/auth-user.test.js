const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const user1 = {
    first_name:"Mike",
    last_name:"Johnson",
    email:"Mike@aol.com",
    password:"43my_pass!"
}
const user2 = {
    first_name:"Thomas",
    last_name:"White",
    email:"tomw@comcast.net",
    password:"t0mwh!te"
}

let token1;
let token2;

beforeAll(async () => {
    await User.deleteMany();
    await new User(user1).save();
    await new User(user2).save();

    const res1 = await request(app).post("/users/login").send({
        email:user1.email,
        password:user1.password
    });
    token1 = res1.headers["set-cookie"][0].replace("access_token=","");
    token1 = token1.slice(0, token1.indexOf(";"));

    const res2 = await request(app).post("/users/login").send({
        email:user2.email,
        password:user2.password
    });
    token2 = res1.headers["set-cookie"][0].replace("access_token=","");
    token2 = token1.slice(0, token1.indexOf(";"));

});

test("Should get profile for user", async () => {
    const res = await request(app)
        .get("/users/me")
        .set("Cookie",[`access_token=${token1}`])
        .send()
        .expect(200);

    expect(res.text).toContain("Mike");
});

test("Should not get profile for unauthenticated user", async () => {
    const res = await request(app)
        .get("/users/me")
        .send()
        .expect(302);
    
});