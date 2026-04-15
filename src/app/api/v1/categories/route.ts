import type { NextRequest } from "next/server";
import { categories } from "../_data";

export async function GET(_request: NextRequest) {
  return Response.json(categories);
}
