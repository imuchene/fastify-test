export interface AuthVariables {
  title: string;
  message: string;
  route: string;
  switchPage: string;
  showExtraFields: boolean;
}

export type LoginFormVariables = Record<string, AuthVariables>;

export interface AuthQueryString {
  page: string;
}
