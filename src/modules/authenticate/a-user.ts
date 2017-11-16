import {Schema} from 'mongoose';
import {RolesTypes} from '../core/constants';
import ObjectId = Schema.Types.ObjectId;

class User {
  id: string;
  nickname: string;
  logo: string;
  admin: boolean = false;
}

export class AUser extends User {
  private _roles = RolesTypes.ALL;

  get roles(): number {return this._roles;}
  set roles(value: number) {this._roles = value;}

  constructor(user: User) {
    super();
    Object.assign(this, user);
  }

  public isJudjes() {
    return this._roles == RolesTypes.JUDGES || this.isCreator();
  }

  public isCreator() {
    return this._roles == RolesTypes.CREATOR || this.isAdmin();
  }

  public isAdmin() {
    return this._roles == RolesTypes.ADMIN;
  }
}