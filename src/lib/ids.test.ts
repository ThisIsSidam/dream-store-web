import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { UUID_PATTERN, isEntityId } from "./ids.ts";

describe("isEntityId", () => {
  it("accepts UUIDs in either case", () => {
    assert.equal(isEntityId("001069b0-cbe1-406c-870e-3f5bdb3e9651"), true);
    assert.equal(isEntityId("001069B0-CBE1-406C-870E-3F5BDB3E9651"), true);
  });

  it("rejects old-style 24-hex ids, slugs, junk and non-strings", () => {
    for (const bad of ["507f1f77bcf86cd799439011", "backup-gravity", "", " ", "../etc/passwd", "001069b0-cbe1-406c-870e-3f5bdb3e965", "001069b0-cbe1-406c-870e-3f5bdb3e9651x"]) {
      assert.equal(isEntityId(bad), false, JSON.stringify(bad));
    }
    for (const bad of [undefined, null, 42, {}, ["001069b0-cbe1-406c-870e-3f5bdb3e9651"]]) {
      assert.equal(isEntityId(bad), false);
    }
  });

  it("exports a pattern that matches the same ids (for the bridge allow-list)", () => {
    const allowed = new RegExp(`^cart/items/${UUID_PATTERN}$`, "i");
    assert.equal(allowed.test("cart/items/001069b0-cbe1-406c-870e-3f5bdb3e9651"), true);
    assert.equal(allowed.test("cart/items/507f1f77bcf86cd799439011"), false);
    assert.equal(allowed.test("cart/items/001069b0-cbe1-406c-870e-3f5bdb3e9651/../coupon"), false);
  });
});
