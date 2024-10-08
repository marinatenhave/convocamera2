/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.9.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as notes from "../notes.js";
import type * as togethe_old_working_ver from "../togethe_old_working_ver.js";
import type * as together from "../together.js";
import type * as together_oldest from "../together_oldest.js";
import type * as utils from "../utils.js";
import type * as whisper from "../whisper.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  notes: typeof notes;
  togethe_old_working_ver: typeof togethe_old_working_ver;
  together: typeof together;
  together_oldest: typeof together_oldest;
  utils: typeof utils;
  whisper: typeof whisper;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
