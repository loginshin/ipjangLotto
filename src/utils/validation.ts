import { type UserData } from '../types';

export const validateNickname = (nickname: string): string | null => {
  if (nickname.length > 10) {
    return '닉네임은 10자 이내로 입력해주세요.';
  }
  return null;
};

export const validateBirth = (birth: string): string | null => {
  if (!birth) {
    return '생년월일을 입력해주세요.';
  }
  
  const birthDate = new Date(birth);
  const now = new Date();
  
  if (birthDate > now) {
    return '미래의 날짜는 선택할 수 없습니다.';
  }
  
  return null;
};

export const validateUserData = (user: UserData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  const nicknameError = validateNickname(user.nickname);
  if (nicknameError) errors.push(nicknameError);
  
  const birthError = validateBirth(user.birth);
  if (birthError) errors.push(birthError);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
