import { describe, it, expect } from "vitest";
import { tokenize, TokenType } from "../src";

describe("Tokenizer - Extended Characters", () => {
  it("should allow hyphens in identifiers", () => {
    const input = "background-color: \"red\"";
    const tokens = tokenize(input);
    
    expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[0].value).toBe("background-color");
  });

  it("should allow underscores in identifiers", () => {
    const input = "user_id: \"123\"";
    const tokens = tokenize(input);
    
    expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[0].value).toBe("user_id");
  });

  it("should allow hyphens in TagNames", () => {
    const input = "My-Component {}";
    const tokens = tokenize(input);
    
    expect(tokens[0].type).toBe(TokenType.TAGNAME);
    expect(tokens[0].value).toBe("My-Component");
  });

  it("should allow underscores in TagNames", () => {
    const input = "My_Component {}";
    const tokens = tokenize(input);
    
    expect(tokens[0].type).toBe(TokenType.TAGNAME);
    expect(tokens[0].value).toBe("My_Component");
  });

  it("should handle mixed dots, hyphens and underscores", () => {
    const input = "style.prop_name-v1: \"val\"";
    const tokens = tokenize(input);
    
    expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[0].value).toBe("style.prop_name-v1");
  });
});
