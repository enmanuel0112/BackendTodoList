import path from 'path';
import dotenv from 'dotenv';



dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const must = (v: string | undefined, name: string) => {
  if (!v || v.trim() === "") throw new Error(`Missing env: ${name}`);
  return v.trim();
};


export const env = {
 
  JWT_ACCESS_SECRET: must(process.env.JWT_ACCESS_SECRET, "JWT_ACCESS_SECRET"),


  JWT_REFRESH_SECRET: must(
    process.env.JWT_REFRESH_ACCESS_SECRET ?? process.env.JWT_REFRESH_ACESS_SECRET,
    "JWT_REFRESH_ACCESS_SECRET (o JWT_REFRESH_ACESS_SECRET)"
  ),

};
