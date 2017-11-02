export class CreateTeamDto {
  readonly title: string;
  readonly url: string;
  readonly ei_creator: string;
  readonly status: number;
  readonly players: number;
  readonly logo: string;
  readonly chat: number;
  readonly users: string[];
}