import api from "./api";
import users from "@/routes/admin/users";
import { User } from "@/types";

export const getUsersAutocomplete = () => {
  return api.get<User[]>(users.autocomplete().url);
};