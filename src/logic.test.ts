import { strictEqual, throws } from "node:assert";
import { getBumpType, getConventionalRegex } from "./logic.ts";

describe("conventional Commit Regex Tests", () => {
  describe("getConventionalRegex()", () => {
    it("should return a regex that matches conventional commit messages", () => {
      const types = ["feat", "fix", "chore"];
      const regex = getConventionalRegex(types);
      const testMessages = [
        "feat: add new feature",
        "fix(scope): fix a bug",
        "chore: update dependencies"
      ];

      testMessages.forEach((message) => {
        strictEqual(regex.test(message), true, `Should match '${message}'`);
      });
    });

    it("should not match non-conventional commit messages", () => {
      const types = ["feat", "fix", "chore"];
      const regex = getConventionalRegex(types);
      const nonMatchingMessages = [
        "update README",
        "add new feature",
        "fix bug"
      ];

      nonMatchingMessages.forEach((message) => {
        strictEqual(regex.test(message), false, `Should not match '${message}'`);
      });
    });
  });

  describe("getBumpType()", () => {
    it("should return 'major' for major keywords", () => {
      const majorKeywords = ["major", "breaking"];
      const minorKeywords = ["minor", "feat"];
      const patchKeywords = ["patch", "fix", "chore"];

      strictEqual(
        getBumpType("breaking: introduce breaking change", majorKeywords, minorKeywords, patchKeywords),
        "major",
        "Should return 'major' for 'breaking: introduce breaking change'"
      );
    });

    it("should return 'minor' for minor keywords", () => {
      const majorKeywords = ["major", "breaking"];
      const minorKeywords = ["minor", "feat"];
      const patchKeywords = ["patch", "fix", "chore"];

      strictEqual(
        getBumpType("feat: add new feature", majorKeywords, minorKeywords, patchKeywords),
        "minor",
        "Should return 'minor' for 'feat: add new feature'"
      );
    });

    it("should return 'patch' for patch keywords", () => {
      const majorKeywords = ["major", "breaking"];
      const minorKeywords = ["minor", "feat"];
      const patchKeywords = ["patch", "fix", "chore"];

      strictEqual(
        getBumpType("fix: resolve issue", majorKeywords, minorKeywords, patchKeywords),
        "patch",
        "Should return 'patch' for 'fix: resolve issue'"
      );
    });

    it("should throw an error for non-matching messages", () => {
      const majorKeywords = ["major", "breaking"];
      const minorKeywords = ["minor", "feat"];
      const patchKeywords = ["patch", "fix", "chore"];

      throws(
        () => getBumpType("docs: update documentation", majorKeywords, minorKeywords, patchKeywords),
        /No matching bump type found/,
        "Should throw an error for 'docs: update documentation'"
      );
    });
  });
});
