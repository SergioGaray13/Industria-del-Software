export type Provider = {
  id: string;
  name: string;
  category: string;
  rating: number | null;
  location: string | null;
  user_id: string;
  email: string | null;
  phones: string | null;
  website: string | null;
  image_url: string | null;
};

export type ReviewUser = {
  first_name: string | null;
  last_name: string | null;
};

export type Review = {
  id: string;
  provider_id: string;
  user_id: string | null;
  comment: string;
  rating: number;
  created_at: string;
  /**
   * Relación con la tabla users, puede venir como objeto único o como array.
   */
  users?: ReviewUser | ReviewUser[];
  /**
   * Nombre ya formateado para mostrar en UI.
   */
  user_name?: string;
};
