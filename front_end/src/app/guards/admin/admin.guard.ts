import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "../../services/user/user.service";

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  let role;
  userService.getUserInfo().subscribe(
    (user)=>{role = user.role},
    (error)=>{console.log(error)}
  )

  return role === 'ADMIN';
};
