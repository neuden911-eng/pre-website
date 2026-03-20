import { supabase } from '../supabase/db';

export const joinWaitlist = async (email: string, role: 'founder' | 'investor') => {
    const { data, error } = await supabase
        .from(role)
        .insert([{ email }]);

    if (error) {
        throw new Error(error.message || 'Request failed');
    }

    return { success: true };
};

export const getWaitlistCounts = async () => {
    const [foundersRes, investorsRes] = await Promise.all([
        supabase.from('founder').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('investor').select('*', { count: 'exact', head: true }).eq('status', 'active')
    ]);

    const founders = foundersRes.count || 0;
    const investors = investorsRes.count || 0;

    return {
        founders,
        investors,
        total: founders + investors
    };
};
