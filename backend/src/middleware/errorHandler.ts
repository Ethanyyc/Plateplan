import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[Error]", err.message);

  if (err.message === "Only image files are allowed") {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.message?.includes("File too large")) {
    res.status(413).json({ error: "File size exceeds 5MB limit" });
    return;
  }

  if ((err as any).code === "P2025") {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  if (err.name === "ZodError") {
    res.status(400).json({
      error: "Validation failed",
      details: (err as any).issues,
    });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
}
