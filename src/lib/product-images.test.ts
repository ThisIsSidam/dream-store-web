import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getProductImageUrls } from "./product-images.ts";

const img = (url: unknown, n = 1) => ({ id: `i${n}`, public_id: `p/${n}`, url }) as never;

describe("getProductImageUrls", () => {
  it("returns [] for missing input", () => {
    assert.deepEqual(getProductImageUrls(undefined), []);
    assert.deepEqual(getProductImageUrls(null), []);
    assert.deepEqual(getProductImageUrls([]), []);
  });

  it("drops entries with an empty, blank or non-string url", () => {
    assert.deepEqual(
      getProductImageUrls([img(""), img("   ", 2), img(undefined, 3), img(42, 4), img("https://x/y.jpg", 5)]),
      ["https://x/y.jpg"],
    );
  });

  it("keeps the given order", () => {
    assert.deepEqual(
      getProductImageUrls([img("https://x/a.jpg", 1), img("https://x/b.jpg", 2), img("https://x/c.jpg", 3)]),
      ["https://x/a.jpg", "https://x/b.jpg", "https://x/c.jpg"],
    );
  });

  it("trims surrounding whitespace", () => {
    assert.deepEqual(getProductImageUrls([img("  https://x/a.jpg \n")]), ["https://x/a.jpg"]);
  });

  it("keeps relative urls (a missing file falls back to artwork in the component)", () => {
    assert.deepEqual(getProductImageUrls([img("/mock/x.png")]), ["/mock/x.png"]);
  });
});
