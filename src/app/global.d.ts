import type { Database as DBDecorations, Tables as TablesDecorations } from "@/lib/database-decorations.type"
import type { Database as DBAmaw, Tables as TablesAmaw } from "@/lib/database-amaw.type"

declare global {
  // Decorations
  type DatabaseDecorations = DBDecorations
  type Announce = TablesDecorations<'announces'>
  type Token = TablesDecorations<'twitch_tokens'>
  // AMAW
  type DatabaseAmaw = DBAmaw
  type Monster = TablesAmaw<'monsters'>
  type Weapon = TablesAmaw<'weapons'>
  type Hunt = TablesAmaw<'hunts'>
}