export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  favoriteGames: string[];
  gamingPlatforms: string[];
  gamingHoursWeekly: string;
  esportsSince: string;
  watchingPreference: string;
  favoriteTeams: string[];
  furiaFanSince: string;
  favoritePlayers: string;
  purchasedMerchandise: string;
  attendedEvents: string;
  whyFuria: string;
  documentUploaded: boolean;
  documentName: string;
  documentId?: string;
  documentStatus?: 'pending' | 'verified' | 'failed';
  profileId?: string;
  connectedSocials?: string[];
}