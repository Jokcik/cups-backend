import {Component} from '@nestjs/common';
import {User} from '../users/interfaces/user.interface';

@Component()
export class UserService {
  private resolveResult: Function;
  private rejectResult: Function;
  public login: boolean = false;

  private user: Promise<User> = new Promise((resolve, reject) => {
    this.resolveResult = resolve;
    this.rejectResult = reject;
  });

  public getUser() {
    return this.user;
  }

  public setUser(user: User) {
    this.resolveResult(user);
    this.login = true;
  }
}