export interface Database {
    public: {
      Tables: {
        users: {
          Row: User
          Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
          Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
        }
        events: {
          Row: Event
          Insert: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'current_attendees'>
          Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>
        }
        event_categories: {
          Row: EventCategory
          Insert: Omit<EventCategory, 'id' | 'created_at'>
          Update: Partial<Omit<EventCategory, 'id' | 'created_at'>>
        }
        event_attendees: {
          Row: EventAttendee
          Insert: Omit<EventAttendee, 'id' | 'registration_date'>
          Update: Partial<Omit<EventAttendee, 'id' | 'registration_date'>>
        }
        service_providers: {
          Row: ServiceProvider
          Insert: Omit<ServiceProvider, 'id' | 'created_at' | 'updated_at'>
          Update: Partial<Omit<ServiceProvider, 'id' | 'created_at' | 'updated_at'>>
        }
        event_agenda: {
          Row: EventAgenda
          Insert: Omit<EventAgenda, 'id' | 'created_at'>
          Update: Partial<Omit<EventAgenda, 'id' | 'created_at'>>
        }
        feed_posts: {
          Row: FeedPost
          Insert: Omit<FeedPost, 'id' | 'created_at' | 'likes_count' | 'comments_count'>
          Update: Partial<Omit<FeedPost, 'id' | 'created_at'>>
        }
        bookings: {
          Row: Booking
          Insert: Omit<Booking, 'id' | 'created_at' | 'booking_date'>
          Update: Partial<Omit<Booking, 'id' | 'created_at' | 'booking_date'>>
        }
      }
    }
  }
  
  export interface User {
    id: string
    email: string
    full_name: string
    phone?: string
    avatar_url?: string
    user_type: 'client' | 'provider' | 'admin'
    created_at: string
    updated_at: string
  }
  
  export interface Event {
    id: string
    title: string
    description?: string
    event_type: string
    category_id?: string
    organizer_id: string
    start_date: string
    end_date: string
    location?: string
    address?: string
    latitude?: number
    longitude?: number
    capacity?: number
    current_attendees: number
    price: number
    currency: string
    is_free: boolean
    is_virtual: boolean
    virtual_link?: string
    image_url?: string
    status: 'active' | 'cancelled' | 'completed' | 'draft'
    created_at: string
    updated_at: string
  }
  
  export interface EventCategory {
    id: string
    name: string
    description?: string
    icon?: string
    color?: string
    created_at: string
  }
  
  export interface EventAttendee {
    id: string
    event_id: string
    user_id: string
    registration_date: string
    status: 'registered' | 'attended' | 'cancelled'
    payment_status: 'pending' | 'completed' | 'failed'
  }
  
  export interface ServiceProvider {
    id: string
    user_id: string
    business_name: string
    service_type: string
    description?: string
    price_range?: string
    rating: number
    total_reviews: number
    location?: string
    contact_phone?: string
    contact_email?: string
    website?: string
    is_verified: boolean
    created_at: string
    updated_at: string
  }
  
  export interface EventAgenda {
    id: string
    event_id: string
    title: string
    description?: string
    start_time: string
    end_time: string
    location?: string
    speaker_name?: string
    speaker_bio?: string
    speaker_image?: string
    order_index: number
    created_at: string
  }
  
  export interface FeedPost {
    id: string
    event_id: string
    author_id: string
    content: string
    post_type: 'announcement' | 'post' | 'poll' | 'reminder'
    image_url?: string
    poll_options?: any
    poll_votes: any
    likes_count: number
    comments_count: number
    created_at: string
  }
  
  export interface Booking {
    id: string
    event_id: string
    user_id: string
    provider_id?: string
    service_type?: string
    amount: number
    currency: string
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    booking_date: string
    event_date: string
    notes?: string
    created_at: string
  }
  
  export interface EventWithDetails extends Event {
    category?: EventCategory
    organizer?: User
    attendees_count?: number
    agenda?: EventAgenda[]
  }