
import { User } from "../types";

export const USERS: User[] = [
  {
    id: "u1",
    role: "asesor",
    name: "Andres Cardozo",
    email: "Andres@empresa.com",
    password: "demo",
    sala: "1",
    metas: { diaria: 3, semanal: 12, mensual: 40, presupuesto: 2 },
  },
  {
    id: "u2",
    role: "asesor",
    name: "Vaneza PAcheco",
    email: "Vaneza@empresa.com",
    password: "demo",
    sala: "3",
    metas: { diaria: 2, semanal: 10, mensual: 35, presupuesto: 2 },
  },
  {
    id: "b1",
    role: "back",
    name: "Back Office",
    email: "back@empresa.com",
    password: "demo",
    sala: "0",
  },
  {
    id: "a1",
    role: "admin",
    name: "Admin",
    email: "admin@empresa.com",
    password: "demo",
    sala: "0",
  },
];
