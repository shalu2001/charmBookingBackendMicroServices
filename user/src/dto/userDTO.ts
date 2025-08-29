export class LoginUserDto {
  email: string;
  password: string;
}

export class LoginUserResponseDTO {
  customerId: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

export class UserDetailsDTO {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phone: string;
}

export class UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}
