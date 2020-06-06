const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const user1 = {
    first_name:"Mike",
    last_name:"Johnson",
    email:"Mike@aol.com",
    password:"43my_pass!"
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(user1).save();
});

test("Should register a new user", async () => {
    await request(app).post("/users").send({
        first_name:"Foo",
        last_name:"Bar",
        email:"foo@bar.com",
        password:"test_!pass!_555"
    }).expect(201);
});


test("Should login an existing user", async () => {
    await request(app).post("/users/login").send({
        email:user1.email,
        password:user1.password
    }).expect(302);
});

test("Should not login a non-existing user", async () => {
    await request(app).post("/users/login").send({
        email:user1.email + "foo",
        password:user1.password
    }).expect(400);
});

test("Should not login an existing user with the wrong PW", async () => {
    await request(app).post("/users/login").send({
        email:user1.email,
        password:user1.password + "foo"
    }).expect(400);
});
