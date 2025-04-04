import * as core from "@actions/core";

type BumpType = "major" | "minor" | "patch";

const CONVENTIONAL_PATTERN = "<type>(<scope?>): <description>";
const DEFAULT_MAJOR = ["major", "breaking"];
const DEFAULT_MINOR = ["minor", "feat", "ft"];
const DEFAULT_PATCH = ["patch", "fix", "chore", "docs"];

/**
 * Returns a regex that matches the conventional commit message pattern `<type>(<scope?>): <description>`.
 */
export function getConventionalRegex(types: string[]): RegExp {
  return new RegExp(`^(${types.join("|")})(\\(.*\\))?:\\s`);
}

/**
 * Returns the bump type based on the commit message and the keywords for major, minor, and patch using
 * the conventional commit message pattern.
 */
export function getBumpType(message: string, major: string[], minor: string[], patch: string[]): BumpType {
  const majorRegex = getConventionalRegex(major);
  const minorRegex = getConventionalRegex(minor);
  const patchRegex = getConventionalRegex(patch);

  if (majorRegex.test(message)) {
    return "major";
  } else if (minorRegex.test(message)) {
    return "minor";
  } else if (patchRegex.test(message)) {
    return "patch";
  }

  throw new Error(`No matching bump type found for message: ${message}`);
}

/**
 * Main function to run the action.
 */
export async function run(): Promise<void> {
  try {
    // extract inputs
    const message: string = core.getInput("message");
    const majorKeywords: string = core.getInput("keywords-major");
    const minorKeywords: string = core.getInput("keywords-minor");
    const patchKeywords: string = core.getInput("keywords-patch");

    // parse keywords
    const major: string[] = majorKeywords ? majorKeywords.split(",").map(s => s.trim()) : DEFAULT_MAJOR;
    const minor: string[] = minorKeywords ? minorKeywords.split(",").map(s => s.trim()) : DEFAULT_MINOR;
    const patch: string[] = patchKeywords ? patchKeywords.split(",").map(s => s.trim()) : DEFAULT_PATCH;

    // log inputs
    core.debug(`Message: ${message}`);
    core.debug(`Major keywords: ${major}`);
    core.debug(`Minor keywords: ${minor}`);
    core.debug(`Patch keywords: ${patch}`);

    // generate regex
    core.debug("Generating regex ...");
    const regex = getConventionalRegex([...major, ...minor, ...patch]);

    // check if message matches regex
    core.debug("Checking if message matches regex ...");
    if (!regex.test(message)) {
      throw new Error(`The message "${message}" does not match the conventional commit message pattern '${CONVENTIONAL_PATTERN}'`);
    }

    // determine bump type
    core.debug("Determining bump type ...");
    const bumpType: BumpType = getBumpType(message, major, minor, patch);
    core.debug(`Bump type: ${bumpType}`);
    core.setOutput("type", bumpType);
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error)
      core.setFailed(error.message);
  }
}
