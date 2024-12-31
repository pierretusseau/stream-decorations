type Monster = {
  id: number
  name: string
}

type Weapon = {
  id: number
  acronym: string
  name: string
}

type Hunt = {
  id: number
  created_at: string
  monster: Monster.id
  weapon: Weapon.id
  time: string
}