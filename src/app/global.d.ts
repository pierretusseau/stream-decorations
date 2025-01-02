import type { Database as DB, Tables } from "@/lib/database.type"

declare global {
  type Database = DB
  type Monster = Tables<'monsters'>
  type Weapon = Tables<'weapons'>
  type Hunt = Tables<'hunts'>
}