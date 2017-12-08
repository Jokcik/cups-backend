export class CreateTeamDto {
  readonly title: string;
  readonly url: string;
  readonly ei_creator: string;
  readonly status: number;
  readonly logo: string;
  readonly chat: number;
  readonly players: string[];


  readonly addPlayers: string[];
  readonly removePlayers: string[];
}