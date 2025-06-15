
-- Create client_messages table for the messaging system
CREATE TABLE public.client_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id uuid REFERENCES public.client_connections(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  message text NOT NULL,
  message_type text DEFAULT 'text'::text,
  sent_at timestamp with time zone DEFAULT now(),
  read_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on client_messages
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for client_messages
CREATE POLICY "Users can view messages in their connections" ON public.client_messages
FOR SELECT USING (
  sender_id = auth.uid() OR 
  recipient_id = auth.uid()
);

CREATE POLICY "Users can send messages in their connections" ON public.client_messages
FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.client_connections cc 
    WHERE cc.id = connection_id 
    AND (cc.client_id = auth.uid() OR cc.dietitian_id = auth.uid())
  )
);

-- Add trigger for updated_at on client_connections if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for client_connections
DROP TRIGGER IF EXISTS update_client_connections_updated_at ON public.client_connections;
CREATE TRIGGER update_client_connections_updated_at
    BEFORE UPDATE ON public.client_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for client_notes
DROP TRIGGER IF EXISTS update_client_notes_updated_at ON public.client_notes;
CREATE TRIGGER update_client_notes_updated_at
    BEFORE UPDATE ON public.client_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
