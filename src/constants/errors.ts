import type { Entity } from "./resources";

export abstract class ExpectedError extends Error {
  abstract readonly code: string;
}

export class NotFoundError extends ExpectedError {
  readonly code = "notFound";
  constructor(readonly entity?: Entity) {
    super(entity ? `${entity} not found` : "Not found");
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends ExpectedError {
  readonly code = "forbidden";
  constructor(readonly entity?: Entity) {
    super(entity ? `${entity} access denied` : "Forbidden");
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends ExpectedError {
  readonly code = "unauthorized";
  constructor() {
    super("User not authenticated");
    this.name = "UnauthorizedError";
  }
}

export class BadRequestError extends ExpectedError {
  readonly code = "badRequest";
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class InternalServerError extends ExpectedError {
  readonly code = "internal";
  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
  }
}

// A business-rule rejection with a specific translated message. `.code` reproduces the
// "rules.<key>" wire format so the client can key a translation off it directly.
export class RuleError extends ExpectedError {
  readonly code: string;
  constructor(readonly rule: string) {
    super(rule);
    this.name = "RuleError";
    this.code = `rules.${rule}`;
  }
}
