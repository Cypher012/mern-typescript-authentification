import {
  DocumentType,
  Severity,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
// import { nanoid } from "nanoid";
import argon2 from "argon2";
import { log } from "../utils/logger";
import { generateCode } from "../utils/generateCode";

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const hash = await argon2.hash(this.password);
  this.password = hash;
  return;
})
@index({ email: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  username: string;

  @prop({ required: true })
  password: string;

  @prop({
    required: true,
    default: () => generateCode(),
  })
  verificationCode: string;

  @prop({ default: null })
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
      log.error(error, "Could not validate password");
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;