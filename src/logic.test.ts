import { strictEqual, throws } from "node:assert";
import { getBumpType, getConventionalRegex } from "./logic.ts";

describe("conventional commit regex tests", () => {
  describe("getConventionalRegex()", () => {
    it("should return a regex that matches with messages that have the specified types", () => {
      const types = ["feat", "fix", "chore"];
      const regex = getConventionalRegex({ types });

      const validMessages = [
        "feat: add new feature",
        "fix(scope): fix a bug",
        "chore: update dependencies"
      ];

      validMessages.forEach((message) => {
        strictEqual(regex.test(message), true, `Should match '${message}' with regex '${regex}'`);
      });

      const invalidMessages = [
        "update documentation",
        "style = format code",
        "test; add tests"
      ];

      invalidMessages.forEach((message) => {
        strictEqual(regex.test(message), false, `Should not match '${message}' with regex '${regex}'`);
      });
    });

    it("should return a regex that matches with messages that have the specified scopes or no scope", () => {
      const types = ["feat", "fix", "chore"];
      const scopes = ["scope1", "scope2"];
      const regex = getConventionalRegex({ types, scopes });

      const validMessages = [
        "feat: add new feature",
        "feat(scope1): add new feature",
        "fix(scope2): fix a bug",
        "chore(scope1): update dependencies"
      ];

      validMessages.forEach((message) => {
        strictEqual(regex.test(message), true, `Should match '${message}' with regex '${regex}'`);
      });

      const invalidMessages = [
        "feat(invalid-scope): add new feature",
        "fix(invalid-scope): fix a bug",
        "chore(invalid-scope): update dependencies"
      ];

      invalidMessages.forEach((message) => {
        strictEqual(regex.test(message), false, `Should not match '${message}' with regex '${regex}'`);
      });
    });

    it("should return a regex that fails when the scope is not in the message and forceScope is true", () => {
      const types = ["feat", "fix", "chore"];
      const scopes = ["scope1", "scope2"];
      const regex = getConventionalRegex({ types, scopes, forceScope: true });

      const validMessages = [
        "feat(scope1): add new feature",
        "fix(scope2): fix a bug",
        "chore(scope1): update dependencies"
      ];

      validMessages.forEach((message) => {
        strictEqual(regex.test(message), true, `Should match '${message}' with regex '${regex}'`);
      });

      const invalidMessages = [
        "feat: add new feature",
        "fix: fix a bug",
        "chore: update dependencies"
      ];

      invalidMessages.forEach((message) => {
        strictEqual(regex.test(message), false, `Should not match '${message}' with regex '${regex}'`);
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
