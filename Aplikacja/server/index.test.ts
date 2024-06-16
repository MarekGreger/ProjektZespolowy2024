import { describe, test, expect } from "@jest/globals";
import request from "supertest";

import app from "./index";

describe("test example", () => {
    test("sends pong", () => {
        request(app)
            .get("/ping")
            .expect(200)
            .expect("Content-Type", /text/)
            .then((response) => expect(response.text).toBe("pong"));
    });
});
