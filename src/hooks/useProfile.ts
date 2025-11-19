// src/hooks/useProfile.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type Profile = {
  id: string;
  full_name: string;
  sala: string;
  role: string;
  cedula: string;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, sala, role, cedula')
        .eq('id', user.id)
        .single();

      if (!error) setProfile(data);
      setLoading(false);
    })();
  }, []);

  return { profile, loading };
}
